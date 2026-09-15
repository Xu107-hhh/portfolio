"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Check } from "lucide-react";

// 验收单：全站唯一的大动效。行入场 → 印章落下。
// 五行按 AI PM 能力项对表，每个数字都必须经得起冷提问（对齐 9.3/9.11 简历口径台账）：
// - 3 大主环节：矩阵条规模词（课件加工/PPT+AI 动画/录屏剪辑）
// - 6 组：磐石大模型对照测试用例（人工核查基准、支撑选型）——不用 13+ 款：交接文档
//   无字面清单，用户记不全具名列表，留案例页待核实后再考虑
// - 近 8 万条：听写判错，必须带"近"（交接文档 79,667 条，写死会被追问凑整）
// - 30→3~5 min：剧本资料整理插件，白名单口径（实测单剧本省约 30 分钟）
// - 4 款：交接文档工具状态表实锤"已完成试点并推广"（数学静态/理科 Web/PPAM/剪辑 V2，
//   =2 自研+1 封装王荣川脚本+1 推广郑森溪 PPAM）；"多款"是 BOSS 短文案黑名单替代词，
//   网站有案例页上下文垫底，用精确数字更有力。严禁写"11 项进生产"（11 项=做出来的
//   工具与作品总数，含未落地探索）
// 已清除数字严禁回墙：89% 同事跑通 / 综合提效 15-20% / 问卷满意度 4.3/5 / 素材可用率 60%
const ROWS = [
  { no: "01", name: "需求拆解", desc: "场景 → 流程 → 指标", value: "3 大主环节" },
  { no: "02", name: "模型评测", desc: "对照测试支撑选型", value: "6 组" },
  { no: "03", name: "数据决策", desc: "归因 → 分级建议", value: "近 8 万条" },
  { no: "04", name: "提效落地", desc: "单剧本资料整理", value: "30→3~5 min" },
  { no: "05", name: "落地采纳", desc: "11 项工具与作品中进真实生产", value: "4 款" },
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
        <p className="mt-1.5 text-xs text-paper-muted">AI 产品能力 · 证据清单</p>

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
              <span className="text-[13px]">
                <span className="font-medium text-ink">{row.name}</span>
                <span className="text-paper-muted"> · {row.desc}</span>
              </span>
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
