"use client";

import { useState } from "react";
import { CheckCircle2, Send } from "lucide-react";
import { PERSONAL } from "@/lib/constants";

// 与 AskAI / ChatPanel 同一 CloudBase 网关；函数侧 CORS 白名单一致
const CONTACT_API = "https://xu-d9gozqmzc1ff7c219.service.tcloudbase.com/api/contact";

type Status = "idle" | "sending" | "success" | "error";

const inputClass =
  "w-full border border-line bg-ink px-4 py-3 text-sm text-ivory placeholder:text-faint outline-none transition-colors focus:border-accent";

export default function ContactForm() {
  const [form, setForm] = useState({ name: "", email: "", message: "", website: "" });
  const [status, setStatus] = useState<Status>("idle");

  const mailtoHref = `mailto:${PERSONAL.email}?subject=${encodeURIComponent(
    `【作品集联系】来自 ${form.name || "访客"}`
  )}&body=${encodeURIComponent(`${form.message}\n\n—\n${form.name}\n${form.email}`)}`;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (status === "sending") return;
    // 蜜罐字段被填充 → 机器人特征，静默假装成功
    if (form.website) {
      setStatus("success");
      return;
    }
    setStatus("sending");
    try {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), 10000);
      const res = await fetch(CONTACT_API, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          message: form.message,
          website: form.website,
        }),
        signal: controller.signal,
      });
      clearTimeout(timer);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      setStatus("success");
    } catch {
      setStatus("error");
    }
  };

  if (status === "success") {
    return (
      <div className="border border-line bg-surface p-6 md:p-8">
        <h2 className="flex items-center gap-2 font-display text-xl font-semibold">
          <CheckCircle2 size={20} className="text-accent" />
          已收到，谢谢！
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-muted">
          消息已送达许隆鑫，他会尽快查看并回复。着急的话也可以直接
          <a href={mailtoHref} className="mx-1 text-accent underline underline-offset-2">
            发送邮件
          </a>
          或拨打页面底部的电话。
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="relative border border-line bg-surface p-6 md:p-8">
      <h2 className="font-display text-xl font-semibold">发送消息</h2>
      <p className="mt-1.5 text-sm text-muted">
        填写以下信息，消息会直接送达许隆鑫。
      </p>

      <div className="mt-6 space-y-4">
        <div>
          <label htmlFor="name" className="mb-1.5 block text-xs uppercase tracking-wider text-faint">
            你的称呼
          </label>
          <input
            id="name"
            type="text"
            required
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            placeholder="怎么称呼你？"
            className={inputClass}
          />
        </div>
        <div>
          <label htmlFor="email" className="mb-1.5 block text-xs uppercase tracking-wider text-faint">
            邮箱
          </label>
          <input
            id="email"
            type="email"
            required
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            placeholder="name@example.com"
            className={inputClass}
          />
        </div>
        <div>
          <label htmlFor="message" className="mb-1.5 block text-xs uppercase tracking-wider text-faint">
            想聊点什么
          </label>
          <textarea
            id="message"
            required
            rows={5}
            value={form.message}
            onChange={(e) => setForm({ ...form, message: e.target.value })}
            placeholder="机会介绍、案例交流，或者只是打个招呼……"
            className={`${inputClass} resize-none`}
          />
        </div>
      </div>

      {/* 蜜罐字段：对人类不可见，机器人自动填表时会带上 */}
      <div aria-hidden="true" className="absolute -left-[9999px] top-0 h-px w-px overflow-hidden">
        <label htmlFor="website">网站</label>
        <input
          id="website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          value={form.website}
          onChange={(e) => setForm({ ...form, website: e.target.value })}
        />
      </div>

      <button
        type="submit"
        disabled={status === "sending"}
        className="group mt-6 inline-flex w-full items-center justify-center gap-2 bg-accent px-6 py-3.5 font-medium text-ink transition-colors hover:bg-accent-soft disabled:cursor-wait disabled:opacity-70"
      >
        {status === "sending" ? "发送中…" : "发送消息"}
        <Send size={15} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
      </button>

      {status === "error" && (
        <p className="mt-4 text-sm leading-relaxed text-muted">
          通道好像开小差了，内容还留在上面。
          <a href={mailtoHref} className="mx-1 text-accent underline underline-offset-2">
            点这里用邮件客户端发送
          </a>
          ，或直接发到 {PERSONAL.email}。
        </p>
      )}
    </form>
  );
}
