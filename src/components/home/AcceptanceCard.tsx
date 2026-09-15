"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Check } from "lucide-react";

// 验收单：全站唯一的大动效。行入场 → 印章落下。
// 数字口径与首页证据条/精选案例严格一致，增删须同步 constants.ts。
const ROWS = [
  { no: "01", label: "工具与作品进入真实生产", value: "11 项" },
  { no: "02", label: "单剧本资料整理", value: "30 min → 3~5 min" },
  { no: "03", label: "真实判错数据分析", value: "8 万条" },
  { no: "04", label: "多智能体全球信息源", value: "136 个" },
];

export default function AcceptanceCard() {
  const reduce = useReducedMotion();
  const base = reduce ? 0 : 1.15;
  const step = reduce ? 0 : 0.26;
  const stampDelay = base + ROWS.length * step + 0.2;

  return (
    <motion.div
      initial={reduce ? false : { opacity: 0, y: 28 }}
      animate={{ opacity: 1, y: 0, rotate: -1.6 }}
      transition={{ duration: 0.7, delay: reduce ? 0 : 0.6, ease: [0.21, 0.5, 0.2, 1] }}
      className="relative mx-auto w-full max-w-sm"
    >
      <span aria-hidden className="tape" />

      <div className="relative border border-ink/10 bg-paper-card px-7 pb-14 pt-7 text-ink shadow-paper-card">
        <div className="flex items-baseline justify-between gap-3">
          <h3 className="font-display text-xl font-black" style={{ letterSpacing: "0.55em" }}>
            验收单
          </h3>
          <span className="font-mono text-[10px] text-paper-muted">NO. XLX-2027</span>
        </div>
        <p className="mt-1.5 text-xs text-paper-muted">AI 产品能力 · 许隆鑫</p>

        <div className="tear-line mt-5" />

        <motion.ul
          initial="hidden"
          animate="show"
          variants={{
            hidden: {},
            show: { transition: { delayChildren: base, staggerChildren: step } },
          }}
          className="py-2"
        >
          {ROWS.map((row) => (
            <motion.li
              key={row.no}
              variants={{
                hidden: { opacity: 0, x: -10 },
                show: { opacity: 1, x: 0, transition: { duration: 0.4 } },
              }}
              className="grid grid-cols-[30px_1fr_auto] items-baseline gap-2 py-2.5"
            >
              <span className="font-mono text-[10px] text-faint">{row.no}</span>
              <span className="text-[13px] text-paper-muted">{row.label}</span>
              <span className="flex items-center gap-1.5 font-display text-sm font-bold">
                <Check size={13} strokeWidth={3} className="text-accent" aria-hidden />
                {row.value}
              </span>
            </motion.li>
          ))}
        </motion.ul>

        <div className="tear-line" />

        <p className="mt-3 font-mono text-[10px] leading-relaxed text-faint">
          备注：以上数字均可在「精选案例」中复现溯源。
        </p>

        <motion.div
          initial={reduce ? false : { opacity: 0, scale: 2.1, rotate: -22 }}
          animate={{ opacity: 0.92, scale: 1, rotate: -9 }}
          transition={reduce ? { duration: 0 } : { delay: stampDelay, type: "spring", stiffness: 380, damping: 17 }}
          className="stamp absolute bottom-9 right-5 px-3.5 py-2 text-center text-accent"
        >
          <p className="font-display text-sm font-black" style={{ letterSpacing: "0.3em" }}>
            验收通过
          </p>
          <p className="mt-0.5 font-mono text-[8px]" style={{ letterSpacing: "0.18em" }}>
            口径可溯
          </p>
        </motion.div>
      </div>
    </motion.div>
  );
}
