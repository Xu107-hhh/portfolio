"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { POSES, type PoseName } from "./pixelRig";
import { PET_BOX } from "./petFrames";

/* ------------------------------------------------------------------ *
 * 参数
 * ------------------------------------------------------------------ *
 * 交互契约（用户定版）：小人常驻右下角，不自主漫游；
 * 拖到哪儿就停在哪儿（视口内自由固定），点击唤起知识库问答。
 * 动作表现 = 豆包 7 帧立绘（见 petFrames.ts），由问答阶段 + 轻量小动作驱动。
 */
export const PET_PARAMS = {
  /** 一个像素渲染成多少 CSS px */
  scale: 2.5,
  scaleMobile: 2.05,
  /** 距视口左右边缘的安全边距 / 常驻右下角时距底边的高度 */
  margin: 14,
  bottomGap: 12,

  /** 闲置多久冒一个随机小动作 */
  actionAfter: [9000, 22000] as [number, number],
  /** 闲置多久打盹 */
  sleepAfter: 75000,
  /** 主动搭话间隔 */
  bubbleAfter: [32000, 70000] as [number, number],

  /** 鼠标靠近多少 px 内抬头打招呼 */
  notice: 130,
  noticeCooldown: 22000,
  /** 位移小于此值算点击而非拖拽 */
  dragSlop: 5,
  /** 鼠标横向偏离多少 px 才扭头 */
  gazeDeadzone: 26,

  /** 闲置时随机播放的动作池（只保留映射到不同立绘帧的姿态） */
  idleActions: ["wave", "cheer", "thumb", "think", "hmm", "idea", "focus"] as PoseName[],
  oneShotDuration: 2100,

  /** 问答面板尺寸：打开面板时若宠物会被压住，就地挪到面板左侧
   *  gap = 面板右边距(24) + 面板与宠物之间留的空隙(4) */
  chatPanelWidth: 380,
  chatPanelGap: 28,
} as const;

export type PetMode = "idle" | "drag" | "sleep";

export type PetBubble = {
  /** 气泡文案 */
  text: string;
  /** 带上它就会出现「帮我问 →」按钮，点了直接把这个问句发给知识库 */
  question?: string | null;
  /** 常驻气泡（不自动消失） */
  sticky?: boolean;
};

export type PetBrainOptions = {
  /** 用户点击宠物（question 为 null）或点了气泡里的引导问题 */
  onAsk: (question: string | null) => void;
  /** 问答面板是否打开 */
  chatOpen: boolean;
  /** 是否尊重「减少动态效果」系统偏好（默认 true） */
  respectReducedMotion?: boolean;
  scale?: number;
};

const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v));
const rand = ([a, b]: readonly [number, number]) => a + Math.random() * (b - a);

type Sim = {
  mode: PetMode;
  facing: 1 | -1;
  x: number;
  y: number;
  nextActionAt: number;
  lastActivity: number;
  lastNotice: number;
  oneShot: PoseName | null;
  oneShotUntil: number;
  dragging: boolean;
  dragStartX: number;
  dragStartY: number;
  dragMoved: number;
  dragOffX: number;
  dragOffY: number;
  px: number;
  py: number;
  hovered: boolean;
  reduced: boolean;
};

const initialSim = (): Sim => ({
  mode: "idle",
  facing: 1,
  x: 0,
  y: 0,
  nextActionAt: 0,
  lastActivity: 0,
  lastNotice: -Infinity,
  oneShot: null,
  oneShotUntil: 0,
  dragging: false,
  dragStartX: 0,
  dragStartY: 0,
  dragMoved: 0,
  dragOffX: 0,
  dragOffY: 0,
  px: -9999,
  py: -9999,
  hovered: false,
  reduced: false,
});

/**
 * 桌面宠物行为引擎（常驻版）。
 *
 * 状态迁移表：
 *
 *   tick  + idle + 闲置 > sleepAfter   → sleep
 *   tick  + idle + 闲置 > actionAfter  → 播一个随机小动作（原地，不挪位）
 *   any   + 鼠标/触摸活动              → idle（唤醒并挥下手）
 *   down                               → drag
 *   drag  + up（位移 ≥ dragSlop）      → idle（停在松手处，视口内自由固定）
 *   drag  + up（位移 <  dragSlop）     → chat（唤起知识库问答）
 *   chat  + 面板关闭                   → idle
 *   hover + 首次进入                   → wave（带冷却，避免反复打扰）
 *
 * 位置每帧直接写 element.style.transform（不走 React state），
 * 只有「姿态 / 模式 / 朝向 / 气泡」这类离散变化才触发重渲染。
 */
export function usePetBrain({
  onAsk,
  chatOpen,
  respectReducedMotion = true,
  scale = PET_PARAMS.scale,
}: PetBrainOptions) {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const flipRef = useRef<HTMLDivElement | null>(null);
  const shadowRef = useRef<HTMLDivElement | null>(null);

  const [pose, setPose] = useState<PoseName>("idle");
  const [mode, setMode] = useState<PetMode>("idle");
  const [facing, setFacing] = useState<1 | -1>(1);
  const [anchor, setAnchor] = useState<"left" | "right">("right");
  const [ready, setReady] = useState(false);
  const [bubble, setBubble] = useState<PetBubble | null>(null);

  const sim = useRef<Sim>(initialSim());
  const cfg = useRef({ onAsk, chatOpen, scale, respectReducedMotion });
  const poseRef = useRef<PoseName>("idle");
  const facingRef = useRef<1 | -1>(1);
  const rafRef = useRef(0);
  const bubbleTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  cfg.current = { onAsk, chatOpen, scale, respectReducedMotion };

  /* ---------------- 尺寸与活动范围 ---------------- */
  const pxW = () => PET_BOX.w * cfg.current.scale;
  const pxH = () => PET_BOX.h * cfg.current.scale;
  const vw = () => window.innerWidth;
  const vh = () => window.innerHeight;
  /** 常驻位（右下角） */
  const homeX = () => Math.max(PET_PARAMS.margin, vw() - pxW() - PET_PARAMS.margin);
  const homeY = () => vh() - pxH() - PET_PARAMS.bottomGap;
  /** 拖拽落点允许的完整范围：整个视口内自由固定 */
  const maxX = () => Math.max(PET_PARAMS.margin, vw() - pxW() - PET_PARAMS.margin);
  const maxY = () => Math.max(0, vh() - pxH() - 2);

  /* ---------------- 朝向同步（只在变化时 setState） ---------------- */
  const applyFacing = useCallback((f: 1 | -1) => {
    if (facingRef.current === f) return;
    facingRef.current = f;
    setFacing(f);
  }, []);

  const setPoseSafe = useCallback((name: PoseName) => {
    if (poseRef.current === name) return;
    poseRef.current = name;
    setPose(name);
  }, []);

  /* ---------------- 气泡 ---------------- */
  const hideBubble = useCallback(() => {
    if (bubbleTimer.current) clearTimeout(bubbleTimer.current);
    bubbleTimer.current = null;
    setBubble(null);
  }, []);

  const say = useCallback(
    (text: string, opts: { sticky?: boolean; ms?: number; question?: string | null } = {}) => {
      const { sticky = false, ms = 9000, question = null } = opts;
      if (bubbleTimer.current) clearTimeout(bubbleTimer.current);
      setBubble({ text, question, sticky });
      if (question) {
        sim.current.oneShot = "think";
        sim.current.oneShotUntil = performance.now() + 2800;
        setPoseSafe("think");
      }
      if (!sticky) {
        bubbleTimer.current = setTimeout(() => setBubble(null), ms);
      }
    },
    [setPoseSafe]
  );

  /* ---------------- 基础姿态 ---------------- */
  const basePose = useCallback((s: Sim): PoseName => {
    if (s.oneShot) return s.oneShot;
    if (s.mode === "sleep") return "sleep";
    if (s.mode === "drag") return "cheer";
    // 面板开着时保持「听你说」
    if (cfg.current.chatOpen) return "listen";
    return "idle";
  }, []);

  const syncPose = useCallback(() => {
    setPoseSafe(basePose(sim.current));
  }, [basePose, setPoseSafe]);

  const poseOnce = useCallback(
    (name: PoseName, duration: number = PET_PARAMS.oneShotDuration) => {
      sim.current.oneShot = name;
      sim.current.oneShotUntil = performance.now() + duration;
      setPoseSafe(name);
    },
    [setPoseSafe]
  );

  /* ---------------- 落位：停在哪就写哪，视口内即合法 ---------------- */
  const place = useCallback(() => {
    const el = rootRef.current;
    const s = sim.current;
    if (!el) return;
    el.style.transform = `translate3d(${Math.round(s.x)}px, ${Math.round(s.y)}px, 0)`;
    // 气泡/菜单贴边方向：靠右时向左展开，避免溢出视口
    setAnchor(s.x + pxW() / 2 > vw() / 2 ? "right" : "left");
  }, []);

  /* ---------------- 唤醒 ---------------- */
  const activity = useCallback(() => {
    const s = sim.current;
    s.lastActivity = performance.now();
    if (s.mode === "sleep") {
      s.mode = "idle";
      setMode("idle");
      poseOnce("wave", 1600);
    }
  }, [poseOnce]);

  /* ---------------- 主循环 ---------------- */
  useEffect(() => {
    const s = sim.current;
    const el = rootRef.current;
    if (!el) return;

    s.reduced =
      respectReducedMotion &&
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    s.mode = "idle";
    s.x = homeX();
    s.y = homeY();
    const t0 = performance.now();
    s.lastActivity = t0;
    s.nextActionAt = t0 + rand(PET_PARAMS.actionAfter);
    place();
    setReady(true);

    const step = (now: number) => {
      // 单次动作到期回落
      if (s.oneShot && now > s.oneShotUntil) {
        s.oneShot = null;
        syncPose();
      }

      if (s.mode === "drag") {
        s.x = clamp(s.px - s.dragOffX, -pxW() * 0.25, vw() - pxW() * 0.75);
        s.y = clamp(s.py - s.dragOffY, 0, vh() - pxH() * 0.5);
      } else if (s.mode === "idle") {
        // 打盹
        if (!s.oneShot && !s.reduced && !s.hovered && !cfg.current.chatOpen &&
            now - s.lastActivity > PET_PARAMS.sleepAfter) {
          s.mode = "sleep";
          setMode("sleep");
          syncPose();
          say("我先眯一会儿，有事点我～", { ms: 4200 });
        }

        // 随机小动作（原地换表情，不挪位）
        if (s.mode === "idle" && !s.oneShot && !s.reduced && !s.hovered && now > s.nextActionAt) {
          const list = PET_PARAMS.idleActions;
          poseOnce(list[Math.floor(Math.random() * list.length)], PET_PARAMS.oneShotDuration);
          s.nextActionAt = now + rand(PET_PARAMS.actionAfter);
        }

        // 扭头看光标
        if (!s.oneShot && !s.dragging) {
          const dx = s.px - (s.x + pxW() / 2);
          if (Math.abs(dx) > PET_PARAMS.gazeDeadzone) applyFacing(dx > 0 ? 1 : -1);
        }
      }

      place();
      rafRef.current = requestAnimationFrame(step);
    };

    rafRef.current = requestAnimationFrame(step);
    return () => cancelAnimationFrame(rafRef.current);
  }, [applyFacing, place, poseOnce, say, syncPose, respectReducedMotion]);

  /* ---------------- 指针 / 键盘 ---------------- */
  const onPointerDown = useCallback((e: React.PointerEvent) => {
    if (e.button === 2) return;
    e.preventDefault();
    activity();
    const s = sim.current;
    s.dragging = true;
    s.dragStartX = e.clientX;
    s.dragStartY = e.clientY;
    s.dragMoved = 0;
    s.dragOffX = e.clientX - s.x;
    s.dragOffY = e.clientY - s.y;
    (e.currentTarget as Element).setPointerCapture?.(e.pointerId);
  }, [activity]);

  /** 拖完落定：就地固定，不回弹、不下坠 */
  const settle = useCallback(() => {
    const s = sim.current;
    s.x = clamp(s.x, PET_PARAMS.margin, maxX());
    s.y = clamp(s.y, 0, maxY());
    s.mode = "idle";
    setMode("idle");
    syncPose();
    place();
  }, [place, syncPose]);

  const onPointerUp = useCallback((e: React.PointerEvent) => {
    const s = sim.current;
    if (!s.dragging) return;
    s.dragging = false;
    try {
      (e.currentTarget as Element).releasePointerCapture?.(e.pointerId);
    } catch {
      /* 指针已释放，忽略 */
    }
    if (s.dragMoved >= PET_PARAMS.dragSlop) {
      settle();
    } else {
      s.mode = "idle";
      setMode("idle");
      syncPose();
      // 位移够小 = 单击 → 唤起知识库问答
      cfg.current.onAsk(null);
    }
  }, [settle, syncPose]);

  const onPointerEnter = useCallback(() => {
    const s = sim.current;
    s.hovered = true;
    activity();
    if (s.mode === "idle" && !s.oneShot) poseOnce("wave", 1800);
  }, [activity, poseOnce]);

  const onPointerLeave = useCallback(() => {
    sim.current.hovered = false;
  }, []);

  useEffect(() => {
    const move = (e: PointerEvent) => {
      const s = sim.current;
      s.px = e.clientX;
      s.py = e.clientY;
      if (s.dragging) {
        s.dragMoved = Math.hypot(e.clientX - s.dragStartX, e.clientY - s.dragStartY);
        if (s.dragMoved > PET_PARAMS.dragSlop && s.mode !== "drag") {
          s.mode = "drag";
          setMode("drag");
          hideBubble();
        }
        // 位置在事件里就地更新，不等下一帧 rAF——
        // 否则快速连发的 down→move→up 会在一帧内完成，松手时 settle 拿到的还是旧位置
        if (s.mode === "drag") {
          s.x = clamp(s.px - s.dragOffX, -pxW() * 0.25, vw() - pxW() * 0.75);
          s.y = clamp(s.py - s.dragOffY, 0, vh() - pxH() * 0.5);
          place();
        }
        return;
      }
      const cx = s.x + pxW() / 2;
      const cy = s.y + pxH() / 2;
      const near = Math.hypot(e.clientX - cx, e.clientY - cy) < PET_PARAMS.notice;
      if (
        near &&
        s.mode === "idle" &&
        !s.oneShot &&
        performance.now() - s.lastNotice > PET_PARAMS.noticeCooldown
      ) {
        s.lastNotice = performance.now();
        poseOnce(Math.random() > 0.5 ? "wave" : "thumb", 1900);
      }
    };
    const up = () => {
      // 指针在宠物外松开：兜底落定，避免卡在拖拽态
      const s = sim.current;
      if (s.dragging) {
        s.dragging = false;
        if (s.mode === "drag") settle();
      }
    };
    const resize = () => {
      const s = sim.current;
      // 窗口变化只做越界回收，不改变用户「拖哪停哪」的位置
      if (s.mode !== "drag") {
        s.x = clamp(s.x, PET_PARAMS.margin, maxX());
        s.y = clamp(s.y, 0, maxY());
        place();
      }
    };
    window.addEventListener("pointermove", move, { passive: true });
    window.addEventListener("pointerup", up);
    window.addEventListener("pointercancel", up);
    window.addEventListener("resize", resize);
    return () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
      window.removeEventListener("pointercancel", up);
      window.removeEventListener("resize", resize);
    };
  }, [hideBubble, place, poseOnce, settle]);

  /* ---------------- 问答面板打开/关闭 ---------------- */
  useEffect(() => {
    const s = sim.current;
    if (chatOpen) {
      activity(); // 打盹中被叫起来
      // 面板若会压住小人，就地平移到面板左侧（瞬移，不走动画）
      const panelW = Math.min(PET_PARAMS.chatPanelWidth, vw() - 32);
      const panelH = Math.min(560, vh() - 96);
      const panelLeft = vw() - 24 - panelW;
      const panelTop = vh() - 24 - panelH;
      const overlaps = s.x + pxW() > panelLeft - 4 && s.y + pxH() > panelTop - 4;
      if (overlaps) {
        s.x = clamp(panelLeft - pxW() - 4, PET_PARAMS.margin, maxX());
        applyFacing(1); // 面朝右侧的面板
      }
      s.oneShot = null;
      s.mode = "idle";
      setMode("idle");
      syncPose();
      place();
      hideBubble();
    } else {
      s.lastActivity = performance.now();
      if (s.mode === "idle") syncPose();
    }
  }, [chatOpen, activity, applyFacing, hideBubble, place, syncPose]);

  /* ---------------- 对外 ---------------- */
  const resetPosition = useCallback(() => {
    const s = sim.current;
    s.x = homeX();
    s.y = homeY();
    s.mode = "idle";
    setMode("idle");
    s.lastActivity = performance.now();
    syncPose();
    place();
  }, [place, syncPose]);

  useEffect(() => () => {
    if (bubbleTimer.current) clearTimeout(bubbleTimer.current);
  }, []);

  return {
    rootRef,
    flipRef,
    shadowRef,
    onPointerDown,
    onPointerUp,
    onPointerEnter,
    onPointerLeave,
    pose,
    mode,
    facing,
    anchor,
    ready,
    bubble,
    say,
    hideBubble,
    resetPosition,
    poseOnce,
    /** 全部可用姿态，供菜单里的「换表情」用 */
    poses: Object.keys(POSES) as PoseName[],
  };
}
