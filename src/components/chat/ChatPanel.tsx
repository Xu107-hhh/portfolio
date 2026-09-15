"use client";

import { useEffect, useRef, useState } from "react";
import { Send, X } from "lucide-react";
import PetSprite from "../pet/PetSprite";
import { PANEL_GREETING, SEED_PROMPTS } from "../pet/petLines";
import { CHAT_PHASE_TO_FRAME, type ChatPhase, type FrameKey } from "../pet/petFrames";

type Msg = { role: "user" | "assistant"; content: string };

const GREETING: Msg = { role: "assistant", content: PANEL_GREETING };

// 聊天后端：EdgeOne 边缘函数路由修复前走 CloudBase 云函数（同口径、同密钥）
// EdgeOne 修复后改回 "/api/chat" 即可（cloud-functions 同款代码已就绪于仓库）
const CHAT_API = "https://xu-d9gozqmzc1ff7c219.service.tcloudbase.com/api/chat";

export type SeedQuestion = { q: string; id: number } | null;

type Props = {
  open: boolean;
  onClose: () => void;
  /** 宠物带过来的问题；消费完由父级清空，避免重复发送 */
  seed?: SeedQuestion;
  onSeedConsumed?: () => void;
  /** 把问答阶段回传给桌宠，驱动小鑫切换 思考/敲字/完成/出错 帧 */
  onPhaseChange?: (phase: ChatPhase) => void;
};

/**
 * 知识库问答面板（受控组件）。
 * 由桌面宠物负责「什么时候打开、带什么问题上屏」，面板只负责对话与流式渲染。
 * 后端口径唯一事实源在 edge-functions/api/chat.js 的 KNOWLEDGE，前端不做任何本地兜底回答，
 * 避免两套口径慢慢分叉。
 */
export default function ChatPanel({ open, onClose, seed = null, onSeedConsumed, onPhaseChange }: Props) {
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [phase, setPhase] = useState<ChatPhase>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const lastSeed = useRef(0);
  const gotToken = useRef(false);
  const phaseTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // 阶段变化同步给桌宠
  useEffect(() => {
    onPhaseChange?.(phase);
  }, [phase, onPhaseChange]);

  useEffect(() => () => {
    if (phaseTimer.current) clearTimeout(phaseTimer.current);
  }, []);

  /** 收尾：done/failed 停留片刻后回到常态（waiting） */
  function settlePhase(ok: boolean) {
    if (phaseTimer.current) clearTimeout(phaseTimer.current);
    setPhase(ok ? "done" : "failed");
    phaseTimer.current = setTimeout(() => setPhase(null), ok ? 1300 : 2200);
  }

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight });
  }, [messages, loading, open]);

  function updateLast(delta: string) {
    setMessages((m) => {
      if (!m.length) return m;
      const copy = [...m];
      copy[copy.length - 1] = {
        role: "assistant",
        content: copy[copy.length - 1].content + delta,
      };
      return copy;
    });
  }

  async function send(text: string) {
    const q = text.trim();
    if (!q || loading) return;
    const history = (messages.length ? messages : [GREETING]).slice(-8);
    const next: Msg[] = [...history, { role: "user", content: q }];
    setMessages([...next, { role: "assistant", content: "" }]);
    setInput("");
    setLoading(true);
    gotToken.current = false;
    if (phaseTimer.current) clearTimeout(phaseTimer.current);
    setPhase("thinking");
    let ok = false;
    try {
      const res = await fetch(CHAT_API, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ messages: next }),
      });
      if (!res.ok || !res.body) throw new Error(String(res.status));
      const ct = res.headers.get("content-type") || "";
      if (ct.includes("application/json")) {
        // 非流式（CloudBase 备用后端）：整段返回
        const data = await res.json();
        const reply = data?.reply ?? data?.choices?.[0]?.message?.content ?? "";
        if (!reply) throw new Error("empty");
        updateLast(reply);
        ok = true;
      } else {
        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        let buf = "";
        for (;;) {
          const { done, value } = await reader.read();
          if (done) break;
          buf += decoder.decode(value, { stream: true });
          const parts = buf.split("\n\n");
          buf = parts.pop() ?? "";
          for (const part of parts) {
            for (const line of part.split("\n")) {
              if (!line.startsWith("data:")) continue;
              const data = line.slice(5).trim();
              if (!data || data === "[DONE]") continue;
              try {
                const delta = JSON.parse(data)?.choices?.[0]?.delta?.content;
                if (delta) {
                  if (!gotToken.current) {
                    gotToken.current = true;
                    setPhase("working");
                  }
                  updateLast(delta);
                }
              } catch {
                /* 忽略无法解析的分片 */
              }
            }
          }
        }
      }
        ok = true;
    } catch {
      setMessages((m) => {
        const copy = [...m];
        copy[copy.length - 1] = {
          role: "assistant",
          content:
            "连接好像出了点问题，请稍后再试；也可以直接通过页面底部的邮箱或电话联系许隆鑫。",
        };
        return copy;
      });
      settlePhase(false);
    } finally {
      setLoading(false);
      if (ok) settlePhase(true);
    }
  }

  // 宠物把问题带过来了 → 自动发出（同一条 seed 只发一次）
  useEffect(() => {
    if (!open || !seed || seed.id === lastSeed.current) return;
    lastSeed.current = seed.id;
    send(seed.q);
    onSeedConsumed?.();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, seed]);

  // ESC 关闭
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  const displayed = messages.length ? messages : [GREETING];
  const headerFrame: FrameKey = phase ? CHAT_PHASE_TO_FRAME[phase] : "waiting";

  return (
    <div
      role="dialog"
      aria-label="问问 AI · 关于许隆鑫"
      className="fixed bottom-6 right-6 z-50 flex h-[min(560px,calc(100dvh-6rem))] w-[min(380px,calc(100vw-2rem))] flex-col overflow-hidden rounded-2xl border border-line bg-surface shadow-2xl"
    >
      <div className="flex items-center justify-between border-b border-line bg-elevated px-4 py-3">
        <div className="flex items-center gap-2.5">
          <span className="flex h-8 w-8 items-center justify-center overflow-hidden rounded-full bg-paper-card ring-1 ring-line">
            <PetSprite frame={headerFrame} />
          </span>
          <div>
            <p className="text-sm font-semibold text-ivory">问问 AI · 关于许隆鑫</p>
            <p className="text-[11px] text-faint">基于作品集内容回答 · 仅供参考</p>
          </div>
        </div>
        <button
          onClick={onClose}
          aria-label="关闭问答"
          className="rounded p-1 text-muted transition-colors hover:text-ivory"
        >
          <X size={18} />
        </button>
      </div>

      <div ref={listRef} className="flex-1 space-y-3 overflow-y-auto px-4 py-4">
        {displayed.map((m, i) => (
          <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
            <div
              className={`max-w-[85%] whitespace-pre-wrap rounded-xl px-3.5 py-2.5 text-sm leading-relaxed ${
                m.role === "user"
                  ? "rounded-br-sm bg-[#3b5bdb] text-white"
                  : "rounded-bl-sm border border-line bg-elevated text-ivory"
              }`}
            >
              {m.content || (loading && i === displayed.length - 1 ? "…" : "")}
            </div>
          </div>
        ))}
        {!messages.length && (
          <div className="flex flex-wrap gap-2 pt-1">
            {SEED_PROMPTS.map((p) => (
              <button
                key={p}
                onClick={() => send(p)}
                className="rounded-full border border-line bg-elevated px-3 py-1.5 text-xs text-muted transition-colors hover:border-accent hover:text-accent"
              >
                {p}
              </button>
            ))}
          </div>
        )}
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          send(input);
        }}
        className="flex items-center gap-2 border-t border-line px-3 py-3"
      >
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="输入问题，回车发送…"
          maxLength={500}
          className="h-10 flex-1 rounded-lg border border-line bg-ink px-3 text-sm text-ivory placeholder:text-faint focus:border-accent focus:outline-none"
        />
        <button
          type="submit"
          disabled={loading || !input.trim()}
          aria-label="发送"
          className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#3b5bdb] text-white transition-opacity disabled:opacity-40"
        >
          <Send size={16} />
        </button>
      </form>
    </div>
  );
}
