"use client";

import { useState } from "react";
import { Send } from "lucide-react";
import { PERSONAL } from "@/lib/constants";

const inputClass =
  "w-full border border-line bg-ink px-4 py-3 text-sm text-ivory placeholder:text-faint outline-none transition-colors focus:border-accent";

export default function ContactForm() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const subject = encodeURIComponent(`【作品集联系】来自 ${form.name || "访客"}`);
    const body = encodeURIComponent(
      `${form.message}\n\n—\n${form.name}\n${form.email}`
    );
    window.location.href = `mailto:${PERSONAL.email}?subject=${subject}&body=${body}`;
  };

  return (
    <form onSubmit={handleSubmit} className="border border-line bg-surface p-6 md:p-8">
      <h2 className="font-display text-xl font-semibold">发送消息</h2>
      <p className="mt-1.5 text-sm text-muted">
        填写以下信息，将通过邮件客户端发送。
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

      <button
        type="submit"
        className="group mt-6 inline-flex w-full items-center justify-center gap-2 bg-accent px-6 py-3.5 font-medium text-ink transition-colors hover:bg-accent-soft"
      >
        发送消息
        <Send size={15} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
      </button>
    </form>
  );
}
