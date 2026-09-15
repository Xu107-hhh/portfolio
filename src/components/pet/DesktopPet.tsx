"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import ChatPanel, { type SeedQuestion } from "../chat/ChatPanel";
import PetSprite from "./PetSprite";
import { PET_PARAMS, usePetBrain } from "./usePetBrain";
import { type PoseName } from "./pixelRig";
import {
  PET_BOX,
  POSE_TO_FRAME,
  CHAT_PHASE_TO_FRAME,
  preloadPetFrames,
  type ChatPhase,
  type FrameKey,
} from "./petFrames";
import { POSE_LABELS, pickGuidedLine, pickLine } from "./petLines";

const LS_HIDDEN = "pet:hidden";

type MenuKind = "root" | "poses" | null;

export default function DesktopPet() {
  const pathname = usePathname();
  const [chatOpen, setChatOpen] = useState(false);
  const [chatPhase, setChatPhase] = useState<ChatPhase>(null);
  const [seed, setSeed] = useState<SeedQuestion>(null);
  const [scale, setScale] = useState<number>(PET_PARAMS.scale);
  const [hidden, setHidden] = useState(false);
  const [menu, setMenu] = useState<MenuKind>(null);
  const [prefsReady, setPrefsReady] = useState(false);

  const seedId = useRef(0);
  const greetedRef = useRef(false);
  const seenRoutes = useRef<Set<string>>(new Set());
  const longPress = useRef<ReturnType<typeof setTimeout> | null>(null);
  /** 长按唤出菜单后，紧接着的 pointerup 不要被当成「单击提问」 */
  const suppressAskUntil = useRef(0);

  /* ---------------- 偏好（记住「让它歇着」） ---------------- */
  useEffect(() => {
    try {
      setHidden(localStorage.getItem(LS_HIDDEN) === "1");
    } catch {
      /* 隐私模式下拿不到 localStorage，用默认值 */
    }
    setPrefsReady(true);
  }, []);

  useEffect(() => {
    if (!prefsReady) return;
    try {
      localStorage.setItem(LS_HIDDEN, hidden ? "1" : "0");
    } catch {
      /* 忽略写入失败 */
    }
  }, [hidden, prefsReady]);

  /* ---------------- 尺寸随视口调整 ---------------- */
  useEffect(() => {
    const apply = () =>
      setScale(window.innerWidth < 720 ? PET_PARAMS.scaleMobile : PET_PARAMS.scale);
    apply();
    window.addEventListener("resize", apply);
    return () => window.removeEventListener("resize", apply);
  }, []);

  /* ---------------- 宠物的行为引擎 ---------------- */
  const handleAsk = useCallback((question: string | null) => {
    // 长按刚唤出菜单，这一下输入不该被当成点击提问
    if (Date.now() < suppressAskUntil.current) return;
    setChatOpen(true);
    if (question) {
      seedId.current += 1;
      setSeed({ q: question, id: seedId.current });
    }
  }, []);

  const pet = usePetBrain({ onAsk: handleAsk, chatOpen, scale });

  const { say, hideBubble, bubble, pose, mode, facing, anchor, ready, resetPosition, poseOnce } = pet;

  /* 预载小鑫全部帧，状态切换不闪图 */
  useEffect(() => {
    preloadPetFrames();
  }, []);

  /** 实际显示帧：进行中的问答阶段优先，否则取行为动作映射 */
  const frame: FrameKey = chatPhase ? CHAT_PHASE_TO_FRAME[chatPhase] : POSE_TO_FRAME[pose] ?? "idle";

  /* ---------------- 搭话：落地打招呼 + 主动引路 + 换页提醒 ---------------- */
  useEffect(() => {
    if (!prefsReady || hidden) return;
    if (!greetedRef.current) {
      greetedRef.current = true;
      const t = setTimeout(() => {
        if (!chatOpen) {
          const line = pickGuidedLine(pathname ?? "/", 0.35);
          say(line.text, { question: line.question ?? null, sticky: !!line.question, ms: 11000 });
        }
      }, 2600);
      return () => clearTimeout(t);
    }
  }, [prefsReady, hidden, chatOpen, pathname, say]);

  useEffect(() => {
    if (!prefsReady || hidden) return;
    const route = pathname ?? "/";
    if (!seenRoutes.current.has(route)) {
      seenRoutes.current.add(route);
      return; // 当前页刚进来，交给上面的首屏问候
    }
    if (chatOpen) return;
    const t = setTimeout(() => {
      if (!chatOpen) {
        const line = pickLine(route);
        say(line.text, { question: line.question ?? null, ms: 10000 });
      }
    }, 1600);
    return () => clearTimeout(t);
  }, [pathname, prefsReady, hidden, chatOpen, say]);

  useEffect(() => {
    if (!prefsReady || hidden) return;
    let timer: ReturnType<typeof setTimeout>;
    const loop = () => {
      const wait =
        PET_PARAMS.bubbleAfter[0] +
        Math.random() * (PET_PARAMS.bubbleAfter[1] - PET_PARAMS.bubbleAfter[0]);
      timer = setTimeout(() => {
        if (!chatOpen && mode !== "sleep") {
          const line = pickLine(pathname ?? "/");
          say(line.text, { question: line.question ?? null, ms: 10000 });
        }
        loop();
      }, wait);
    };
    loop();
    return () => clearTimeout(timer);
  }, [pathname, prefsReady, hidden, chatOpen, mode, say]);

  /* ---------------- 关掉气泡（点击别处） ---------------- */
  useEffect(() => {
    if (!bubble) return;
    const onDoc = (e: PointerEvent) => {
      const t = e.target as Element | null;
      if (t?.closest?.(".pet-root")) return;
      hideBubble();
    };
    window.addEventListener("pointerdown", onDoc);
    return () => window.removeEventListener("pointerdown", onDoc);
  }, [bubble, hideBubble]);

  /* ---------------- 菜单 ---------------- */
  useEffect(() => {
    if (!menu) return;
    const close = () => setMenu(null);
    window.addEventListener("pointerdown", close);
    window.addEventListener("keydown", close);
    return () => {
      window.removeEventListener("pointerdown", close);
      window.removeEventListener("keydown", close);
    };
  }, [menu]);

  const openMenu = useCallback(() => {
    hideBubble();
    setMenu("root");
  }, [hideBubble]);

  const startLongPress = useCallback(() => {
    if (longPress.current) clearTimeout(longPress.current);
    longPress.current = setTimeout(() => {
      suppressAskUntil.current = Date.now() + 800;
      openMenu();
    }, 520);
  }, [openMenu]);

  const cancelLongPress = useCallback(() => {
    if (longPress.current) clearTimeout(longPress.current);
    longPress.current = null;
  }, []);

  const act = useCallback(
    (name: PoseName) => {
      poseOnce(name, 2400);
      setMenu(null);
    },
    [poseOnce]
  );

  // 注意：这里不能 early-return —— 宠物根节点必须先挂上，行为引擎才有节点可写。
  // 「被收起来」用 class 隐藏，而不是卸载。
  const cls = [
    "pet-root",
    ready && !hidden ? "is-ready" : "is-hidden",
    mode === "drag" ? "is-dragging" : "",
    mode === "sleep" ? "is-sleeping" : "",
    chatOpen ? "is-chatting" : "",
    frame === "done" ? "is-done" : "",
    frame === "failed" ? "is-failed" : "",
    frame === "working" ? "is-working" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <>
      <div
        ref={pet.rootRef}
        className={cls}
        data-pose={pose}
        data-frame={frame}
        data-anchor={anchor}
        aria-hidden={hidden ? true : undefined}
        style={{ width: PET_BOX.w * scale, height: PET_BOX.h * scale }}
      >
        {/* 气泡：放在 hitzone 外面，里面的按钮才能独立点击 */}
        {bubble && (
          <div className={`pet-bubble ${bubble.sticky ? "is-on is-sticky" : "is-on"}`} role="status">
            <span>{bubble.text}</span>
            {bubble.question && (
              <button
                type="button"
                className="pet-bubble-cta"
                onPointerDown={(e) => e.stopPropagation()}
                onClick={(e) => {
                  e.stopPropagation();
                  const q = bubble.question!;
                  hideBubble();
                  handleAsk(q);
                }}
              >
                帮我问 →
              </button>
            )}
          </div>
        )}

        <div
          className="pet-hitzone"
          role="button"
          tabIndex={0}
          aria-label="小鑫（作品集 AI 助手）：点我提问，也可以把我拖到别处"
          onPointerDown={pet.onPointerDown}
          onPointerUp={pet.onPointerUp}
          onPointerEnter={pet.onPointerEnter}
          onPointerLeave={pet.onPointerLeave}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              handleAsk(null);
            }
          }}
          onContextMenu={(e) => {
            e.preventDefault();
            openMenu();
          }}
          onTouchStart={startLongPress}
          onTouchEnd={cancelLongPress}
          onTouchMove={cancelLongPress}
        >
          <div className="pet-flip" style={{ transform: `scaleX(${facing})` }}>
            <div className="pet-breathe">
              <div className="pet-land">
                <PetSprite frame={frame} />
              </div>
            </div>
          </div>
        </div>

        {/* 情绪符号：放在翻转层之外，? / Z / ! 不会被朝向镜像 */}
        <div className="pet-fx" aria-hidden="true">
          {frame === "thinking" && <span className="pet-fx-q">?</span>}
          {frame === "working" && (
            <span className="pet-fx-dots">
              <i />
              <i />
              <i />
            </span>
          )}
          {frame === "failed" && <span className="pet-fx-x">!</span>}
          {frame === "sleeping" && (
            <>
              <span className="pet-fx-z z1">z</span>
              <span className="pet-fx-z z2">Z</span>
            </>
          )}
        </div>

        <div ref={pet.shadowRef} className="pet-shadow" aria-hidden="true" />

        {/* 右键 / 长按菜单 */}
        {menu && (
          <div
            className="pet-menu"
            role="menu"
            onPointerDown={(e) => e.stopPropagation()}
          >
            {menu === "root" && (
              <>
                <button type="button" role="menuitem" onClick={() => act("wave")}>
                  打个招呼
                </button>
                <button
                  type="button"
                  role="menuitem"
                  onClick={() => {
                    setMenu("poses");
                  }}
                >
                  换表情 →
                </button>
                <button
                  type="button"
                  role="menuitem"
                  onClick={() => {
                    resetPosition();
                    setMenu(null);
                  }}
                >
                  回到右下角
                </button>
                <button
                  type="button"
                  role="menuitem"
                  onClick={() => {
                    setMenu(null);
                    setChatOpen(true);
                  }}
                >
                  问问 AI
                </button>
                <button
                  type="button"
                  role="menuitem"
                  className="is-danger"
                  onClick={() => {
                    setMenu(null);
                    setHidden(true);
                  }}
                >
                  先休息吧
                </button>
              </>
            )}
            {menu === "poses" && (
              <>
                <button type="button" role="menuitem" onClick={() => setMenu("root")}>
                  ← 返回
                </button>
                {Object.keys(POSE_LABELS).map((p) => (
                  <button
                    key={p}
                    type="button"
                    role="menuitem"
                    onClick={() => act(p as PoseName)}
                  >
                    {POSE_LABELS[p as PoseName]}
                  </button>
                ))}
              </>
            )}
          </div>
        )}
      </div>

      {/* 被收起来时，留一个恢复入口，别让访客找不回来 */}
      {hidden && (
        <button
          type="button"
          className="pet-restore"
          onClick={() => {
            setHidden(false);
            resetPosition();
          }}
          aria-label="叫回小助手"
        >
          叫回小助手
        </button>
      )}

      <ChatPanel
        open={chatOpen}
        onClose={() => {
          setChatOpen(false);
          setChatPhase(null);
        }}
        seed={seed}
        onSeedConsumed={() => setSeed(null)}
        onPhaseChange={setChatPhase}
      />
    </>
  );
}
