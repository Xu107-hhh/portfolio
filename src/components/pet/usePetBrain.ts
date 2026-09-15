"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { POSES, type PoseName } from "./pixelRig";
import { PET_BOX } from "./petFrames";

/* ------------------------------------------------------------------ *
 * 参数
 * ------------------------------------------------------------------ *
 * 与调参台 pet-lab/prototype/pet-engine.js 的 PARAMS 保持一致。
 * 改这里的同时请改那边，否则两套实现的行为会慢慢分叉。
 */
export const PET_PARAMS = {
  /** 一个像素渲染成多少 CSS px */
  scale: 2.5,
  scaleMobile: 2.05,
  /** 距视口左右边缘的安全边距 / 距底部高度 */
  margin: 14,
  floorGap: 12,

  /** 走路速度；挪到问答面板旁边时用小跑 */
  walkSpeed: 54,
  runSpeed: 210,
  /** 闲置多久开始漫游（随机区间，ms） */
  wanderAfter: [7000, 16000] as [number, number],
  /** 到达目标后停多久 */
  wanderPause: [1100, 2800] as [number, number],
  /** 闲置多久冒一个随机小动作 */
  actionAfter: [9000, 22000] as [number, number],
  /** 闲置多久打盹 */
  sleepAfter: 75000,
  /** 主动搭话间隔 */
  bubbleAfter: [32000, 70000] as [number, number],

  /** 自由落体 */
  gravity: 1900,
  bounce: 0.42,
  bounceStop: 240,

  /** 鼠标靠近多少 px 内抬头打招呼 */
  notice: 130,
  noticeCooldown: 22000,
  /** 位移小于此值算点击而非拖拽 */
  dragSlop: 5,
  /** 鼠标横向偏离多少 px 才扭头 */
  gazeDeadzone: 26,

  /** 闲置时随机播放的动作池 */
  idleActions: ["wave", "cheer", "thumb", "think", "hmm", "idea", "sip", "focus"] as PoseName[],
  oneShotDuration: 2100,

  /** 问答面板尺寸：用来把宠物挪到面板旁边，而不是被面板压住
   *  gap = 面板右边距(24) + 面板与宠物之间留的空隙(4) */
  chatPanelWidth: 380,
  chatPanelGap: 28,
} as const;

export type PetMode = "idle" | "walk" | "drag" | "fall" | "sleep";

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
  /** 是否允许自主漫游（用户可在菜单里关掉） */
  roam: boolean;
  /** 是否尊重「减少动态效果」系统偏好（默认 true） */
  respectReducedMotion?: boolean;
  /** 首次出现时从屏幕上方掉下来弹一下（整页加载才播一次，路由切换不重播） */
  enterWithDrop?: boolean;
  scale?: number;
};

const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v));
const rand = ([a, b]: readonly [number, number]) => a + Math.random() * (b - a);

type Sim = {
  mode: PetMode;
  facing: 1 | -1;
  x: number;
  y: number;
  vx: number;
  vy: number;
  targetX: number | null;
  nextWanderAt: number;
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
  running: boolean;
  reduced: boolean;
};

const initialSim = (): Sim => ({
  mode: "idle",
  facing: 1,
  x: 0,
  y: 0,
  vx: 0,
  vy: 0,
  targetX: null,
  nextWanderAt: 0,
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
  running: false,
  reduced: false,
});

/**
 * 桌面宠物行为引擎。
 *
 * 状态迁移表（与 pet-lab 调参台保持同一份契约）：
 *
 *   tick  + idle + 闲置 > wanderAfter        → walk（随机挑一个目标点）
 *   tick  + walk + 到达目标点                 → idle
 *   tick  + idle + 闲置 > sleepAfter         → sleep
 *   any   + 鼠标/触摸活动                     → idle（唤醒并挥下手）
 *   down                                      → drag
 *   drag  + up（位移 ≥ dragSlop）             → fall（交给重力，落地弹一下）
 *   drag  + up（位移 <  dragSlop）            → chat（唤起知识库问答）
 *   chat  + 面板关闭                          → idle
 *   hover + 首次进入                          → wave（带冷却，避免反复打扰）
 *
 * 位置每帧直接写 element.style.transform（不走 React state），
 * 只有「姿态 / 模式 / 朝向 / 气泡」这类离散变化才触发重渲染。
 */
export function usePetBrain({
  onAsk,
  chatOpen,
  roam,
  respectReducedMotion = true,
  enterWithDrop = true,
  scale = PET_PARAMS.scale,
}: PetBrainOptions) {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const flipRef = useRef<HTMLDivElement | null>(null);
  const shadowRef = useRef<HTMLDivElement | null>(null);

  const [pose, setPose] = useState<PoseName>("idle");
  const [mode, setMode] = useState<PetMode>("idle");
  const [facing, setFacing] = useState<1 | -1>(1);
  const [anchor, setAnchor] = useState<"left" | "right">("right");
  const [running, setRunning] = useState(false);
  const [ready, setReady] = useState(false);
  const [bubble, setBubble] = useState<PetBubble | null>(null);

  const sim = useRef<Sim>(initialSim());
  const cfg = useRef({ onAsk, chatOpen, roam, scale, respectReducedMotion });
  const poseRef = useRef<PoseName>("idle");
  const rafRef = useRef(0);
  const bubbleTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  cfg.current = { onAsk, chatOpen, roam, scale, respectReducedMotion };

  /* ---------------- 尺寸与地面 ---------------- */
  const pxW = () => PET_BOX.w * cfg.current.scale;
  const pxH = () => PET_BOX.h * cfg.current.scale;
  const vw = () => window.innerWidth;
  const vh = () => window.innerHeight;
  const floorY = () => vh() - pxH() - PET_PARAMS.floorGap;
  const maxX = () => Math.max(PET_PARAMS.margin, vw() - pxW() - PET_PARAMS.margin);

  /* ---------------- 朝向同步（只在变化时 setState） ---------------- */
  const facingRef = useRef<1 | -1>(1);
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
    // 面板开着时保持「听你说」，即使正在挪到面板旁边（此时腿仍在走）
    if (cfg.current.chatOpen) return "listen";
    if (s.mode === "walk") return "walk";
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

  /* ---------------- 放置 ---------------- */
  const place = useCallback(() => {
    const el = rootRef.current;
    const s = sim.current;
    if (!el) return;
    el.style.transform = `translate3d(${Math.round(s.x)}px, ${Math.round(s.y)}px, 0)`;

    // 影子留在地面上：位置随「离地高度」偏移，透明度与宽度随高度收缩
    const sh = shadowRef.current;
    if (sh) {
      const air = clamp((floorY() - s.y) / 260, 0, 1);
      sh.style.top = `${floorY() - s.y - 4}px`;
      sh.style.opacity = String(0.42 * (1 - air * 0.75));
      sh.style.transform = `translateX(-50%) scaleX(${(1 - air * 0.45).toFixed(3)})`;
    }
    // 气泡贴边方向：靠右时向左展开，避免溢出视口
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
    s.x = maxX();
    s.y = floorY();
    const t0 = performance.now();
    s.lastActivity = t0;
    s.nextWanderAt = t0 + 3600;
    s.nextActionAt = t0 + rand(PET_PARAMS.actionAfter);
    if (enterWithDrop && !s.reduced) {
      // 从屏幕上方落下来，落地弹一下——「宠物到岗」的入场
      s.y = -pxH() - 24;
      s.vy = 150;
      s.mode = "fall";
      setMode("fall");
    }
    place();
    setReady(true);

    let last = 0;

    const step = (now: number) => {
      const dt = last ? Math.min(0.05, (now - last) / 1000) : 0;
      last = now;

      // 单次动作到期回落
      if (s.oneShot && now > s.oneShotUntil) {
        s.oneShot = null;
        syncPose();
      }

      switch (s.mode) {
        case "drag": {
          s.x = clamp(s.px - s.dragOffX, -pxW() * 0.25, vw() - pxW() * 0.75);
          s.y = clamp(s.py - s.dragOffY, 0, vh() - pxH() * 0.5);
          break;
        }
        case "fall": {
          s.vy += PET_PARAMS.gravity * dt;
          s.y += s.vy * dt;
          s.x += s.vx * dt;
          s.vx *= 0.985;
          const fy = floorY();
          if (s.y >= fy) {
            s.y = fy;
            if (Math.abs(s.vy) > PET_PARAMS.bounceStop) {
              s.vy = -s.vy * PET_PARAMS.bounce;
              el.classList.remove("pet-landed");
              // 强制重启动画，否则连续两次落地看不出挤压
              void el.offsetWidth;
              el.classList.add("pet-landed");
            } else {
              s.vy = 0;
              s.vx = 0;
              s.mode = "idle";
              setMode("idle");
              poseOnce("cheer", 1200);
              s.nextWanderAt = now + 1600;
            }
          }
          if (s.x <= PET_PARAMS.margin || s.x >= maxX()) {
            s.x = clamp(s.x, PET_PARAMS.margin, maxX());
            s.vx = 0;
          }
          break;
        }
        case "walk": {
          if (s.targetX === null) break;
          const d = s.targetX - s.x;
          if (Math.abs(d) < 3) {
            s.x = s.targetX;
            s.targetX = null;
            s.running = false;
            setRunning(false);
            s.mode = "idle";
            setMode("idle");
            syncPose();
            if (!cfg.current.chatOpen) s.nextWanderAt = now + rand(PET_PARAMS.wanderPause);
          } else {
            const dir: 1 | -1 = d > 0 ? 1 : -1;
            applyFacing(dir);
            s.x += dir * (s.running ? PET_PARAMS.runSpeed : PET_PARAMS.walkSpeed) * dt;
          }
          break;
        }
        default: {
          if (s.targetX === null && now > s.nextWanderAt) {
            if (s.mode === "idle" && !s.reduced && cfg.current.roam && !s.hovered && !cfg.current.chatOpen) {
              const hi = maxX();
              let t = PET_PARAMS.margin + Math.random() * (hi - PET_PARAMS.margin);
              if (Math.abs(t - s.x) < 100) {
                t = clamp(s.x + (t >= s.x ? 170 : -170), PET_PARAMS.margin, hi);
              }
              s.targetX = t;
              s.oneShot = null;
              s.mode = "walk";
              setMode("walk");
              syncPose();
            } else {
              s.nextWanderAt = now + 4000;
            }
          }
          break;
        }
      }

      // 打盹
      if (
        s.mode === "idle" &&
        !s.oneShot &&
        !s.reduced &&
        !s.hovered &&
        !cfg.current.chatOpen &&
        now - s.lastActivity > PET_PARAMS.sleepAfter
      ) {
        s.mode = "sleep";
        setMode("sleep");
        s.targetX = null;
        s.nextWanderAt = now + 5000;
        syncPose();
        say("我先眯一会儿，有事点我～", { ms: 4200 });
      }

      // 随机小动作
      if (s.mode === "idle" && !s.oneShot && !s.reduced && !s.hovered && now > s.nextActionAt) {
        const list = PET_PARAMS.idleActions;
        poseOnce(list[Math.floor(Math.random() * list.length)], PET_PARAMS.oneShotDuration);
        s.nextActionAt = now + rand(PET_PARAMS.actionAfter);
      }

      // 扭头看光标
      if (s.mode === "idle" && !s.oneShot && !s.dragging) {
        const dx = s.px - (s.x + pxW() / 2);
        if (Math.abs(dx) > PET_PARAMS.gazeDeadzone) applyFacing(dx > 0 ? 1 : -1);
      }

      place();
      rafRef.current = requestAnimationFrame(step);
    };

    rafRef.current = requestAnimationFrame(step);
    return () => cancelAnimationFrame(rafRef.current);
  }, [applyFacing, place, poseOnce, say, syncPose, respectReducedMotion, enterWithDrop]);

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
      s.mode = "fall";
      setMode("fall");
      s.vx = 0;
      s.vy = Math.max(s.vy, 40);
    } else {
      s.mode = "idle";
      setMode("idle");
      syncPose();
      // 位移够小 = 单击 → 唤起知识库问答
      cfg.current.onAsk(null);
    }
  }, [syncPose]);

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
      // 指针在宠物外松开：兜底，避免卡在拖拽态
      const s = sim.current;
      if (s.dragging) {
        s.dragging = false;
        if (s.mode === "drag") {
          s.mode = "fall";
          setMode("fall");
          s.vx = 0;
        }
      }
    };
    const resize = () => {
      const s = sim.current;
      const fy = floorY();
      if (s.mode !== "drag" && s.mode !== "fall") s.y = fy;
      else s.y = Math.min(s.y, fy);
      s.x = clamp(s.x, PET_PARAMS.margin, maxX());
      if (s.targetX !== null) s.targetX = clamp(s.targetX, PET_PARAMS.margin, maxX());
      place();
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
  }, [hideBubble, place, poseOnce]);

  /* ---------------- 问答面板打开/关闭 ---------------- */
  useEffect(() => {
    const s = sim.current;
    if (chatOpen) {
      // 站到面板左手边，别被面板压住
      const panelW = Math.min(PET_PARAMS.chatPanelWidth, vw() - 32);
      const tx = vw() - panelW - PET_PARAMS.chatPanelGap - pxW();
      s.facing = 1; // 面朝右侧的面板
      applyFacing(1);
      s.oneShot = null;
      if (tx >= PET_PARAMS.margin) {
        const target = clamp(tx, PET_PARAMS.margin, maxX());
        const dist = Math.abs(target - s.x);
        s.targetX = target;
        // 离得远就小跑过去，别让访客干等
        s.running = dist > 120;
        setRunning(s.running);
        s.mode = dist > 6 ? "walk" : "idle";
        setMode(s.mode);
      } else {
        s.targetX = null;
        s.running = false;
        setRunning(false);
        s.mode = "idle";
        setMode("idle");
      }
      syncPose();
      hideBubble();
    } else if (s.mode === "walk" || s.mode === "idle") {
      s.targetX = null;
      s.running = false;
      setRunning(false);
      s.mode = "idle";
      setMode("idle");
      syncPose();
      s.lastActivity = performance.now();
      s.nextWanderAt = performance.now() + 2600;
    }
  }, [chatOpen, applyFacing, hideBubble, syncPose]);

  /* ---------------- 收起/展开漫游 ---------------- */
  useEffect(() => {
    if (!roam) {
      sim.current.targetX = null;
      sim.current.running = false;
      setRunning(false);
    } else {
      sim.current.nextWanderAt = performance.now() + 1200;
    }
  }, [roam]);

  /* ---------------- 对外 ---------------- */
  const resetPosition = useCallback(() => {
    const s = sim.current;
    s.x = maxX();
    s.y = floorY();
    s.targetX = null;
    s.vy = 0;
    s.vx = 0;
    s.running = false;
    setRunning(false);
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
    running,
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
