"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import AcceptanceCard from "@/components/home/AcceptanceCard";
import { PERSONAL } from "@/lib/constants";

// Hero 下方证据条改为「履历轨迹」：验收数字已在右侧验收单中，不再重复。
const TIMELINE = [
  { period: "2024.09", event: "天津师范大学 · 情报学硕士入学" },
  { period: "2025.07", event: "中科院武汉文献情报中心 · 科研助理" },
  { period: "2026.01", event: "精准学 · AI 产品经理实习" },
  { period: "2027", event: "应届毕业 · 全国可到岗" },
];

const EASE: [number, number, number, number] = [0.21, 0.5, 0.2, 1];

export default function Hero() {
  const reduce = useReducedMotion();
  const fade = (delay: number) => ({
    initial: reduce ? false : { opacity: 0, y: 22 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.65, delay: reduce ? 0 : delay, ease: EASE },
  });

  return (
    <section className="bg-grid bg-noise relative overflow-hidden">
      <div className="relative mx-auto grid w-full max-w-6xl items-center gap-16 px-5 pb-20 pt-16 md:grid-cols-[1.12fr_0.88fr] md:px-8 md:pb-24 md:pt-20">
        {/* 左列：名字与主张 */}
        <div>
          <motion.p
            {...fade(0.05)}
            className="inline-flex items-center gap-2.5 rounded-full border border-line bg-surface/70 px-4 py-1.5 text-[11px] uppercase tracking-[0.18em] text-muted"
          >
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-70" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-accent" />
            </span>
            {PERSONAL.available}
          </motion.p>

          <motion.h1
            {...fade(0.14)}
            className="mt-8 font-display text-[72px] font-black leading-[1.04] md:text-[108px]"
          >
            许隆鑫
          </motion.h1>

          <motion.p {...fade(0.24)} className="mt-5 font-display text-xl text-accent-soft md:text-2xl">
            从模型评测，到产品落地。
          </motion.p>

          <motion.p {...fade(0.32)} className="mt-5 max-w-xl text-sm leading-relaxed text-muted md:text-base">
            情报学硕士 · 精准学（阿里战投 · 准独角兽）AI
            产品实习——擅长把模糊的「AI 提效」需求，拆成场景、流程、验证指标与可交付的方案。
          </motion.p>

          <motion.div {...fade(0.4)} className="mt-9 flex flex-wrap items-center gap-3.5">
            <Link
              href="/works"
              className="group inline-flex items-center gap-2 rounded-full bg-accent px-7 py-3.5 text-sm font-medium text-ivory transition-colors hover:bg-accent-soft hover:text-ink"
            >
              查看精选案例
              <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
            </Link>
            <Link
              href="/gallery"
              className="inline-flex items-center gap-2 rounded-full border border-ivory/20 px-7 py-3.5 text-sm font-medium text-ivory transition-colors hover:border-accent hover:text-accent-soft"
            >
              浏览项目实录
            </Link>
          </motion.div>
        </div>

        {/* 右列：验收单（签名元素） */}
        <AcceptanceCard />
      </div>

      {/* 履历轨迹条 */}
      <div className="relative border-t border-line">
        <dl className="mx-auto grid w-full max-w-6xl grid-cols-2 md:grid-cols-4">
          {TIMELINE.map((t, i) => (
            <div
              key={t.period}
              className={`group px-6 py-6 transition-colors hover:bg-surface/60 md:py-7 ${
                i > 0 ? "border-l border-line" : ""
              } ${i === 2 ? "border-t border-line md:border-t-0 md:border-l" : ""} ${
                i === 3 ? "border-t border-line md:border-t-0 md:border-l" : ""
              }`}
            >
              <dt className="font-mono text-sm text-accent-soft transition-colors group-hover:text-accent-soft">
                {t.period}
              </dt>
              <dd className="mt-1.5 text-xs leading-relaxed text-muted">{t.event}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
