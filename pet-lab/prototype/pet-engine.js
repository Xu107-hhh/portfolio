/**
 * pet-engine.js — 桌面宠物行为引擎（参考实现 / 调参台）
 * ---------------------------------------------------------------------------
 * 与生产实现 src/components/pet/usePetBrain.ts 使用同一套参数与状态迁移表。
 *
 * 状态迁移表（唯一契约，两侧必须一致）：
 *
 *   tick   + idle   + 闲置 > WANDER_AFTER      → walk（随机挑一个目标点）
 *   tick   + walk   + 到达目标点                → idle
 *   tick   + idle   + 闲置 > SLEEP_AFTER       → sleep
 *   any    + 鼠标/触摸活动                      → idle（唤醒）
 *   down                                        → drag
 *   drag   + up（位移 ≥ DRAG_SLOP）             → fall（交给重力）
 *   drag   + up（位移 <  DRAG_SLOP）            → chat（唤起知识库问答）
 *   fall   + 落地                               → idle（补一次 cheer 单次动作）
 *   chat   + 面板关闭                            → idle
 *   hover  + 首次进入                           → wave（单次动作，带冷却）
 *
 * 渲染约定（重要）：SVG 层只做整数位移（`translate`）的帧动画，
 * 所有缩放 / 翻转 / 挤压都发生在 HTML 包裹层上 —— 避开 SVG transform-origin
 * 在各浏览器里语义不一致的坑。
 */

import { buildPose, VIEWBOX, VB, LAYERS, W, H } from "./pet-rig.js";

/* ------------------------------------------------------------------ *
 * 参数（调参台可实时覆盖；默认值 = 生产默认值）
 * ------------------------------------------------------------------ */
export const PARAMS = {
  scale: 2.5, // 一个像素渲染成多少 CSS px
  margin: 14, // 距视口左右边缘的安全边距
  floorGap: 12, // 距视口底部的高度

  walkSpeed: 54, // px/s
  runSpeed: 210, // px/s —— 挪到问答面板旁边时的小跑速度
  wanderAfter: [7000, 16000], // 闲置多久开始漫游（随机区间）
  wanderPause: [1100, 2800], // 到达目标后停多久
  actionAfter: [9000, 22000], // 闲置多久冒一个随机动作
  sleepAfter: 75000, // 闲置多久打盹
  bubbleAfter: [26000, 60000], // 主动说话间隔

  gravity: 1900, // px/s²
  bounce: 0.42, // 落地反弹系数
  bounceStop: 240, // 低于此速度不再弹

  notice: 130, // 鼠标靠近多少 px 内抬头打招呼
  noticeCooldown: 22000,
  dragSlop: 5, // 位移小于此值算点击而非拖拽
  gazeDeadzone: 26, // 鼠标横向偏离多少 px 才扭头

  idleActions: ["wave", "cheer", "thumb", "think", "hmm", "idea", "sip", "focus"],
  oneShotDuration: 2100,

  /** 问答面板尺寸：用来把宠物挪到面板旁边，而不是被面板压住 */
  chatPanelWidth: 380,
  chatPanelGap: 20,
};

const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
const rand = ([a, b]) => a + Math.random() * (b - a);

/** 只有这几个层会做帧位移动画，其余静态 */
const ANIM_LAYERS = new Set(["armL", "armR", "legL", "legR"]);

function renderGroups(groups) {
  const parts = [];
  for (const layer of LAYERS) {
    const rects = groups[layer];
    if (!rects || !rects.length) continue;
    const inner = rects
      .map((r) => `<rect x="${r.x}" y="${r.y}" width="1" height="1" fill="${r.c}"/>`)
      .join("");
    parts.push(
      ANIM_LAYERS.has(layer)
        ? `<g data-anim="${layer}">${inner}</g>`
        : `<g data-layer="${layer}">${inner}</g>`
    );
  }
  return parts.join("");
}

/* ------------------------------------------------------------------ *
 * 引擎
 * ------------------------------------------------------------------ */
let uid = 0;

export function createPet(opts = {}) {
  const cfg = { ...PARAMS, ...(opts.params || {}) };
  const onAsk = opts.onAsk || (() => {});

  const cache = new Map();
  const pose = (name) => {
    if (!cache.has(name)) cache.set(name, buildPose(name));
    return cache.get(name);
  };

  /* ---- DOM ---- */
  const el = document.createElement("div");
  el.className = "pet";
  el.dataset.pose = "idle";
  el.dataset.mode = "idle";
  el.innerHTML = `
    <div class="pet-bubble" role="status" aria-live="polite"></div>
    <div class="pet-hitzone" role="button" tabindex="0" aria-label="小助手：点击向我提问">
      <div class="pet-flip">
        <div class="pet-breathe">
          <div class="pet-land">
            <svg class="pet-svg" viewBox="${VIEWBOX}" shape-rendering="crispEdges" aria-hidden="true"></svg>
          </div>
        </div>
      </div>
    </div>
    <div class="pet-shadow" aria-hidden="true"></div>`;
  (opts.mount || document.body).appendChild(el);

  const $svg = el.querySelector(".pet-svg");
  const $flip = el.querySelector(".pet-flip");
  const $land = el.querySelector(".pet-land");
  const $hit = el.querySelector(".pet-hitzone");
  const $bubble = el.querySelector(".pet-bubble");
  const $shadow = el.querySelector(".pet-shadow");

  const pxW = VB.w * cfg.scale;
  const pxH = VB.h * cfg.scale;
  el.style.width = `${pxW}px`;
  el.style.height = `${pxH}px`;
  $hit.style.width = `${pxW}px`;
  $hit.style.height = `${pxH}px`;

  /* ---- 状态 ---- */
  const S = {
    mode: "idle",
    pose: null,
    oneShot: null,
    oneShotUntil: 0,
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
    dragging: false,
    dragStartX: 0,
    dragStartY: 0,
    dragMoved: 0,
    dragOff: { x: 0, y: 0 },
    pointer: { x: -9999, y: -9999 },
    hovered: false,
    chatOpen: false,
    reduced: window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    lastFrame: 0,
    raf: 0,
    paused: false,
  };

  const vw = () => window.innerWidth;
  const vh = () => window.innerHeight;
  const floorY = () => vh() - pxH - cfg.floorGap;
  const maxX = () => Math.max(cfg.margin, vw() - pxW - cfg.margin);

  function place() {
    el.style.transform = `translate3d(${Math.round(S.x)}px, ${Math.round(S.y)}px, 0)`;
    // 影子留在地面上：位置随「离地高度」偏移，透明度/宽度随高度收缩
    const air = clamp((floorY() - S.y) / 260, 0, 1);
    $shadow.style.top = `${floorY() - S.y - 4}px`;
    $shadow.style.opacity = String(0.42 * (1 - air * 0.75));
    $shadow.style.transform = `translateX(-50%) scaleX(${(1 - air * 0.45).toFixed(3)})`;
    $flip.style.transform = `scaleX(${S.facing})`;
    // 气泡贴边方向：靠右时向左展开，避免溢出视口
    el.dataset.anchor = S.x + pxW / 2 > vw() / 2 ? "right" : "left";
  }

  function setPose(name) {
    if (S.pose === name) return;
    S.pose = name;
    el.dataset.pose = name;
    $svg.innerHTML = renderGroups(pose(name).groups);
  }

  function setMode(mode) {
    S.mode = mode;
    el.dataset.mode = mode;
    el.classList.toggle("is-walking", mode === "walk");
    el.classList.toggle("is-dragging", mode === "drag");
    el.classList.toggle("is-sleeping", mode === "sleep");
    el.classList.toggle("is-airborne", mode === "fall");
  }

  function play(name, duration) {
    S.oneShot = name;
    S.oneShotUntil = performance.now() + (duration ?? cfg.oneShotDuration);
    setPose(name);
  }

  function basePose() {
    if (S.oneShot) return S.oneShot;
    if (S.mode === "sleep") return "sleep";
    if (S.mode === "drag") return "cheer";
    // 面板开着时保持「听你说」姿态，即使正在挪到面板旁边（此时腿仍在走）
    if (S.chatOpen) return "listen";
    if (S.mode === "walk") return "walk";
    return "idle";
  }

  const syncPose = () => setPose(basePose());

  function activity() {
    S.lastActivity = performance.now();
    if (S.mode === "sleep") {
      setMode("idle");
      play("wave", 1600);
    }
  }

  /* ---- 气泡 ---- */
  let bubbleTimer = 0;
  function say(text, { sticky = false, ms = 8000, question = null } = {}) {
    $bubble.innerHTML = "";
    const t = document.createElement("span");
    t.textContent = text;
    $bubble.appendChild(t);
    if (question) {
      const b = document.createElement("button");
      b.className = "pet-bubble-cta";
      b.textContent = "帮我问 →";
      b.addEventListener("pointerdown", (e) => e.stopPropagation());
      b.addEventListener("click", (e) => {
        e.stopPropagation();
        hideBubble();
        ask(question);
      });
      $bubble.appendChild(b);
    }
    $bubble.classList.add("is-on");
    clearTimeout(bubbleTimer);
    if (!sticky) bubbleTimer = setTimeout(hideBubble, ms);
    if (question) play("think", 2800);
  }
  function hideBubble() {
    $bubble.classList.remove("is-on");
    clearTimeout(bubbleTimer);
  }

  /* ---- 主循环 ---- */
  function frame(now) {
    const dt = S.lastFrame ? Math.min(0.05, (now - S.lastFrame) / 1000) : 0;
    S.lastFrame = now;
    step(now, dt);
    if (S.raf) S.raf = requestAnimationFrame(frame);
  }

  function step(now, dt) {
    if (S.oneShot && now > S.oneShotUntil) {
      S.oneShot = null;
      syncPose();
    }

    switch (S.mode) {
      case "drag":
        S.x = clamp(S.pointer.x - S.dragOff.x, -pxW * 0.25, vw() - pxW * 0.75);
        S.y = clamp(S.pointer.y - S.dragOff.y, 0, vh() - pxH * 0.5);
        break;

      case "fall": {
        S.vy += cfg.gravity * dt;
        S.y += S.vy * dt;
        S.x += S.vx * dt;
        S.vx *= 0.985;
        const fy = floorY();
        if (S.y >= fy) {
          S.y = fy;
          if (Math.abs(S.vy) > cfg.bounceStop) {
            S.vy = -S.vy * cfg.bounce;
            $land.classList.remove("just-landed");
            void $land.offsetWidth;
            $land.classList.add("just-landed");
          } else {
            S.vy = 0;
            S.vx = 0;
            setMode("idle");
            play("cheer", 1200);
            nextWander(now, 1600);
          }
        }
        if (S.x <= cfg.margin || S.x >= maxX()) {
          S.x = clamp(S.x, cfg.margin, maxX());
          S.vx = 0;
        }
        break;
      }

      case "walk": {
        if (S.targetX === null) break;
        const d = S.targetX - S.x;
        if (Math.abs(d) < 3) {
          S.x = S.targetX;
          S.targetX = null;
          S.running = false;
          el.classList.remove("is-running");
          setMode("idle");
          syncPose();
          if (!S.chatOpen) nextWander(now, rand(cfg.wanderPause));
        } else {
          S.facing = d > 0 ? 1 : -1;
          S.x += S.facing * (S.running ? cfg.runSpeed : cfg.walkSpeed) * dt;
        }
        break;
      }

      default: {
        // idle / sleep / chat
        if (S.targetX === null && now > S.nextWanderAt) {
          if (S.mode === "idle" && !S.reduced && !S.hovered && !S.chatOpen) pickWander(now);
          else S.nextWanderAt = now + 4000;
        }
        break;
      }
    }

    // 打盹
    if (
      S.mode === "idle" &&
      !S.oneShot &&
      !S.chatOpen &&
      !S.reduced &&
      !S.hovered &&
      now - S.lastActivity > cfg.sleepAfter
    ) {
      setMode("sleep");
      S.targetX = null;
      S.nextWanderAt = now + 5000;
      syncPose();
      say("我先眯一会儿，有事点我～", { ms: 4200 });
    }

    // 随机小动作
    if (S.mode === "idle" && !S.oneShot && !S.reduced && !S.hovered && now > S.nextActionAt) {
      play(cfg.idleActions[(Math.random() * cfg.idleActions.length) | 0], cfg.oneShotDuration);
      S.nextActionAt = now + rand(cfg.actionAfter);
    }

    // 扭头看光标
    if (S.mode === "idle" && !S.oneShot) {
      const dx = S.pointer.x - (S.x + pxW / 2);
      if (Math.abs(dx) > cfg.gazeDeadzone) S.facing = dx > 0 ? 1 : -1;
    }

    place();
  }

  function nextWander(now, delay) {
    S.nextWanderAt = now + (delay ?? rand(cfg.wanderAfter));
  }

  function pickWander(now) {
    const lo = cfg.margin;
    const hi = maxX();
    let t = lo + Math.random() * (hi - lo);
    if (Math.abs(t - S.x) < 100) t = clamp(S.x + (t >= S.x ? 170 : -170), lo, hi);
    S.targetX = t;
    S.oneShot = null;
    setMode("walk");
    syncPose();
  }

  /* ---- 交互 ---- */
  function onPointerMove(e) {
    S.pointer.x = e.clientX;
    S.pointer.y = e.clientY;
    if (S.dragging) {
      S.dragMoved = Math.hypot(e.clientX - S.dragStartX, e.clientY - S.dragStartY);
      if (S.dragMoved > cfg.dragSlop && S.mode !== "drag") {
        setMode("drag");
        hideBubble();
      }
      return;
    }
    const cx = S.x + pxW / 2;
    const cy = S.y + pxH / 2;
    const near = Math.hypot(e.clientX - cx, e.clientY - cy) < cfg.notice;
    if (
      near &&
      S.mode === "idle" &&
      !S.oneShot &&
      performance.now() - S.lastNotice > cfg.noticeCooldown
    ) {
      S.lastNotice = performance.now();
      play(Math.random() > 0.5 ? "wave" : "thumb", 1900);
    }
  }

  function onDown(e) {
    if (e.button === 2) return;
    e.preventDefault();
    activity();
    S.dragging = true;
    S.dragStartX = e.clientX;
    S.dragStartY = e.clientY;
    S.dragMoved = 0;
    S.dragOff.x = e.clientX - S.x;
    S.dragOff.y = e.clientY - S.y;
    try { $hit.setPointerCapture(e.pointerId); } catch {}
  }

  function onUp(e) {
    if (!S.dragging) return;
    S.dragging = false;
    try { $hit.releasePointerCapture(e.pointerId); } catch {}
    if (S.dragMoved >= cfg.dragSlop) {
      setMode("fall");
      S.vx = 0;
      S.vy = Math.max(S.vy, 40);
    } else {
      setMode("idle");
      syncPose();
      ask(null);
    }
  }

  function ask(question) {
    // 先切到「问答中」并走到面板旁边，再通知外部打开面板
    setChatOpen(true);
    onAsk(question || null);
  }

  function onKey(e) {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      activity();
      ask(null);
    }
  }

  /* ---- 对外 ---- */
  /** 面板打开时宠物站到面板左手边，别被面板压住 */
  function chatSideX() {
    const panelW = Math.min(cfg.chatPanelWidth, vw() - 32);
    return vw() - panelW - cfg.chatPanelGap - pxW;
  }

  function setChatOpen(open) {
    S.chatOpen = open;
    el.classList.toggle("is-chatting", open);
    if (open) {
      const tx = chatSideX();
      S.facing = 1; // 面朝右侧的面板
      S.oneShot = null;
      if (tx >= cfg.margin) {
        S.targetX = clamp(tx, cfg.margin, maxX());
        const dist = Math.abs(S.targetX - S.x);
        // 离得远就小跑过去，别让访客干等
        S.running = dist > 120;
        el.classList.toggle("is-running", S.running);
        setMode(dist > 6 ? "walk" : "idle");
      } else {
        S.targetX = null;
        S.running = false;
        el.classList.remove("is-running");
        setMode("idle");
      }
      syncPose();
      hideBubble();
    } else if (S.mode === "chat" || S.mode === "walk" || S.mode === "idle") {
      S.targetX = null;
      S.running = false;
      el.classList.remove("is-running");
      setMode("idle");
      syncPose();
      S.lastActivity = performance.now();
      nextWander(performance.now(), 2600);
    }
  }

  function resetPosition() {
    S.x = maxX();
    S.y = floorY();
    S.targetX = null;
    S.vy = 0;
    S.vx = 0;
    setMode("idle");
    syncPose();
    place();
  }

  function layout() {
    const fy = floorY();
    if (S.mode !== "drag" && S.mode !== "fall") S.y = fy;
    else S.y = Math.min(S.y, fy);
    S.x = clamp(S.x, cfg.margin, maxX());
    if (S.targetX !== null) S.targetX = clamp(S.targetX, cfg.margin, maxX());
    place();
  }

  /* ---- 挂载 ---- */
  $hit.addEventListener("pointerdown", onDown);
  window.addEventListener("pointermove", onPointerMove, { passive: true });
  window.addEventListener("pointerup", onUp);
  window.addEventListener("pointercancel", onUp);
  $hit.addEventListener("pointerenter", () => {
    S.hovered = true;
    activity();
    if (S.mode === "idle" && !S.oneShot) play("wave", 1800);
  });
  $hit.addEventListener("pointerleave", () => {
    S.hovered = false;
  });
  $hit.addEventListener("keydown", onKey);
  $hit.addEventListener("contextmenu", (e) => e.preventDefault());
  window.addEventListener("resize", layout);

  setMode("idle");
  setPose("idle");
  resetPosition();
  const t0 = performance.now();
  S.lastActivity = t0;
  nextWander(t0, 3600);
  S.nextActionAt = t0 + rand(cfg.actionAfter);
  S.raf = requestAnimationFrame(frame);

  return {
    el,
    params: cfg,
    state: S,
    setChatOpen,
    say,
    hideBubble,
    play,
    resetPosition,
    setPaused(p) {
      S.paused = p;
      if (p) {
        cancelAnimationFrame(S.raf);
        S.raf = 0;
      } else {
        S.lastFrame = 0;
        S.raf = requestAnimationFrame(frame);
      }
    },
    destroy() {
      cancelAnimationFrame(S.raf);
      S.raf = 0;
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("pointercancel", onUp);
      window.removeEventListener("resize", layout);
      el.remove();
    },
  };
}
