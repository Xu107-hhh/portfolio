"use client";

import { useEffect, useRef, useState } from "react";
import { Send, X } from "lucide-react";
import AiBuddy from "./AiBuddy";

type Msg = { role: "user" | "assistant"; content: string };

const GREETING: Msg = {
  role: "assistant",
  content:
    "你好，我是许隆鑫作品集的 AI 助手。可以问我他的实习经历、项目案例、技能或求职意向。\n回答基于作品集公开内容生成，仅供参考，重要信息建议与本人直接确认。",
};

const QUICK_PROMPTS = [
  "实习中最有代表性的成果是什么？",
  "介绍一下 SciAgent 多智能体项目",
  "他的技术栈和求职方向？",
];

// 聊天后端：EdgeOne 边缘函数路由修复前走 CloudBase 云函数（同口径、同密钥）
// EdgeOne 修复后改回 "/api/chat" 即可（cloud-functions 同款代码已就绪于仓库）
const CHAT_API = "https://xu-d9gozqmzc1ff7c219.service.tcloudbase.com/api/chat";

export default function AskAI() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight });
  }, [messages, loading, open]);

  function updateLast(delta: string) {
    setMessages((m) => {
      if (!m.length) return m;
      const copy = [...m];
      copy[copy.length - 1] = { role: "assistant", content: copy[copy.length - 1].content + delta };
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
        const text = data?.reply ?? data?.choices?.[0]?.message?.content ?? "";
        if (!text) throw new Error("empty");
        updateLast(text);
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
              if (delta) updateLast(delta);
            } catch {
              /* 忽略无法解析的分片 */
            }
          }
        }
      }
      }
    } catch {
      setMessages((m) => {
        const copy = [...m];
        copy[copy.length - 1] = {
          role: "assistant",
          content: "连接好像出了点问题，请稍后再试；也可以直接通过页面底部的邮箱或电话联系许隆鑫。",
        };
        return copy;
      });
    } finally {
      setLoading(false);
    }
  }

  const displayed = messages.length ? messages : [GREETING];

  /* --- 桌宠行为：可拖拽挪位置（<6px 位移视为点击） --- */
  const [pos, setPos] = useState<{ x: number; y: number } | null>(null);
  const dragRef = useRef<{ startX: number; startY: number; moved: boolean } | null>(null);

  function onBuddyPointerDown(e: React.PointerEvent<HTMLButtonElement>) {
    dragRef.current = { startX: e.clientX, startY: e.clientY, moved: false };
    e.currentTarget.setPointerCapture(e.pointerId);
  }
  function onBuddyPointerMove(e: React.PointerEvent<HTMLButtonElement>) {
    const d = dragRef.current;
    if (!d) return;
    if (!d.moved && Math.hypot(e.clientX - d.startX, e.clientY - d.startY) < 6) return;
    d.moved = true;
    const x = Math.min(Math.max(e.clientX, 36), window.innerWidth - 36);
    const y = Math.min(Math.max(e.clientY, 36), window.innerHeight - 36);
    setPos({ x, y });
  }
  function onBuddyClick() {
    if (dragRef.current?.moved) {
      dragRef.current = null;
      return;
    }
    setOpen(true);
  }

  return (
    <>
      {/* 桌宠：SVG 小人（纸面奶油底，呼应站点档案风）；可拖拽、悬停开心、点击唤起问答 */}
      <button
        onClick={onBuddyClick}
        onPointerDown={onBuddyPointerDown}
        onPointerMove={onBuddyPointerMove}
        aria-label="打开 AI 问答"
        style={
          pos
            ? { left: pos.x - 28, top: pos.y - 28, right: "auto", bottom: "auto" }
            : undefined
        }
        className={`group fixed bottom-6 right-6 z-50 flex h-[56px] w-[56px] cursor-grab touch-none items-center justify-center rounded-full bg-paper-card ring-1 ring-line shadow-lg shadow-[#3b5bdb]/40 transition-all duration-300 active:cursor-grabbing hover:scale-105 ${
          open ? "pointer-events-none scale-90 opacity-0" : "opacity-100"
        }`}
      >
        <AiBuddy size={50} />
        <span className="pointer-events-none absolute -top-9 right-0 whitespace-nowrap rounded-md border border-line bg-elevated px-2.5 py-1 text-xs text-ivory opacity-0 transition-opacity duration-200 group-hover:opacity-100">
          点我聊聊 · 可以拖走
        </span>
      </button>

      {/* 聊天面板 */}
      {open && (
        <div className="fixed bottom-6 right-6 z-50 flex h-[min(560px,calc(100dvh-6rem))] w-[min(380px,calc(100vw-2rem))] flex-col overflow-hidden rounded-2xl border border-line bg-surface shadow-2xl">
          <div className="flex items-center justify-between border-b border-line bg-elevated px-4 py-3">
            <div className="flex items-center gap-2.5">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-paper-card ring-1 ring-line">
                <AiBuddy size={24} />
              </span>
              <div>
                <p className="text-sm font-semibold text-ivory">问问 AI · 关于许隆鑫</p>
                <p className="text-[11px] text-faint">基于作品集内容回答 · 仅供参考</p>
              </div>
            </div>
            <button onClick={() => setOpen(false)} aria-label="关闭" className="text-muted transition-colors hover:text-ivory">
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
                {QUICK_PROMPTS.map((p) => (
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
      )}
    </>
  );
}
