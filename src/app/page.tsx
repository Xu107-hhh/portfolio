import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import Reveal from "@/components/Reveal";
import FadeImage from "@/components/FadeImage";
import WorkCard from "@/components/WorkCard";
import { PERSONAL, SKILLS, FEATURED_WORK, GALLERY, METHODOLOGY } from "@/lib/constants";

const STATS = [
  { value: "11 项", label: "工具与作品 · 多款进真实生产" },
  { value: "3~5 min", label: "单剧本资料整理 · 原约 30 分钟" },
  { value: "8 万条", label: "判错数据分析" },
  { value: "136 个", label: "多智能体全球信息源" },
];

export default function Home() {
  return (
    <>
      {/* ---------- Hero · 墨场开场 ---------- */}
      <section className="bg-noise relative flex min-h-[calc(100vh-6rem)] flex-col overflow-hidden">
        <div aria-hidden className="pointer-events-none absolute inset-0">
          <div className="absolute -top-44 left-[22%] h-[460px] w-[640px] rounded-full bg-accent/15 blur-[160px]" />
          <div className="absolute -bottom-52 right-[-10%] h-[440px] w-[600px] rounded-full bg-[#27356b]/25 blur-[150px]" />
        </div>

        <div className="relative mx-auto flex w-full max-w-6xl flex-1 flex-col items-center justify-center px-5 pb-16 pt-14 text-center md:px-8">
          <Reveal>
            <p className="inline-flex items-center gap-2.5 rounded-full border border-line bg-surface/70 px-4 py-1.5 text-[11px] uppercase tracking-[0.18em] text-muted">
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-70" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-accent" />
              </span>
              {PERSONAL.available}
            </p>
          </Reveal>

          <Reveal delay={0.06}>
            <h1 className="mt-9 font-display text-[64px] font-black leading-[1.02] md:text-[124px]">
              许隆鑫
            </h1>
          </Reveal>

          <Reveal delay={0.12}>
            <p className="mt-6 font-display text-xl text-accent-soft md:text-2xl">
              从模型评测，到产品落地。
            </p>
          </Reveal>

          <Reveal delay={0.18}>
            <p className="mx-auto mt-5 max-w-xl text-sm leading-relaxed text-muted md:text-base">
              情报学硕士 · 精准学（阿里战投 · 准独角兽）AI 产品实习——擅长把模糊的「AI
              提效」需求，拆成场景、流程、验证指标与可交付的方案。
            </p>
          </Reveal>

          <Reveal delay={0.24}>
            <div className="mt-10 flex flex-wrap items-center justify-center gap-3.5">
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
            </div>
          </Reveal>
        </div>

        {/* 证据条 */}
        <div className="relative border-t border-line">
          <dl className="mx-auto grid w-full max-w-6xl grid-cols-2 md:grid-cols-4">
            {STATS.map((s, i) => (
              <div
                key={s.label}
                className={`group px-6 py-6 transition-colors hover:bg-surface/60 md:py-7 ${
                  i > 0 ? "border-l border-line" : ""
                } ${i === 2 ? "border-t border-line md:border-t-0 md:border-l" : ""} ${
                  i === 3 ? "border-t border-line md:border-t-0 md:border-l" : ""
                }`}
              >
                <dt className="font-display text-2xl font-bold text-ivory transition-colors group-hover:text-accent-soft md:text-3xl">
                  {s.value}
                </dt>
                <dd className="mt-1.5 text-xs leading-relaxed text-muted">{s.label}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* ---------- 01 精选案例 · 纸面报告 ---------- */}
      <section className="section-paper relative overflow-hidden">
        <div className="relative mx-auto max-w-6xl px-5 py-24 md:px-8 md:py-32">
          <Reveal>
            <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-accent">
              01 — Selected Works
            </p>
            <div className="mt-4 flex flex-wrap items-end justify-between gap-6">
              <h2 className="font-display text-4xl font-black tracking-tight md:text-6xl">
                精选案例
              </h2>
              <Link
                href="/works"
                className="group flex items-center gap-1.5 text-sm text-paper-muted transition-colors hover:text-ink"
              >
                全部作品
                <ArrowUpRight
                  size={15}
                  className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                />
              </Link>
            </div>
            <p className="mt-4 max-w-xl text-sm leading-relaxed text-paper-muted">
              9 个案例按经历阶段分区：问题定义、策略路径与量化结果——数据永远落在决策上。
            </p>
          </Reveal>

          <div className="mt-12 grid gap-6 md:grid-cols-2">
            {FEATURED_WORK.slice(0, 5).map((study, i) => (
              <Reveal key={study.slug} delay={i * 0.08} className={i === 0 ? "md:col-span-2" : ""}>
                <WorkCard study={study} large={i === 0} tone="paper" />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- 02 能力矩阵 · 纸面延续 ---------- */}
      <section className="section-paper border-t border-paper-line">
        <div className="relative mx-auto max-w-6xl px-5 py-24 md:px-8 md:py-32">
          <Reveal>
            <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-accent">
              02 — Capabilities
            </p>
            <h2 className="mt-4 font-display text-4xl font-black tracking-tight md:text-6xl">
              能力矩阵
            </h2>
          </Reveal>

          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {SKILLS.map((group, i) => {
              const isLast = i === SKILLS.length - 1;
              return (
                <Reveal
                  key={group.category}
                  delay={i * 0.06}
                  className={isLast ? "col-span-full" : ""}
                >
                  <div
                    className={`shadow-paper-card h-full rounded-2xl border border-paper-line bg-paper-card p-6 transition-transform duration-300 hover:-translate-y-1`}
                  >
                    <p className="font-mono text-xs text-paper-muted">0{i + 1}</p>
                    <h3 className="mt-3 font-display text-lg font-bold">
                      {group.category}
                      {group.featured && (
                        <span className="ml-2 inline-block rounded-full bg-accent/10 px-2.5 py-0.5 align-middle font-mono text-[10px] uppercase tracking-wider text-accent">
                          Core
                        </span>
                      )}
                    </h3>
                    <ul
                      className={
                        isLast
                          ? "mt-4 flex flex-wrap gap-x-8 gap-y-2"
                          : "mt-4 space-y-2"
                      }
                    >
                      {group.items.map((item) => (
                        <li
                          key={item}
                          className="flex items-start gap-2 text-sm text-paper-muted"
                        >
                          <span className="mt-[7px] h-1 w-1 shrink-0 rotate-45 bg-accent" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* ---------- 03 方法论 · 墨场回归 ---------- */}
      <section className="relative bg-ink">
        <div className="mx-auto max-w-6xl px-5 py-24 md:px-8 md:py-32">
          <Reveal>
            <div className="grid gap-6 md:grid-cols-[1fr_1.4fr] md:items-end">
              <div>
                <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-accent-soft">
                  03 — Methodology
                </p>
                <h2 className="mt-4 font-display text-4xl font-black tracking-tight md:text-6xl">
                  方法论沉淀
                </h2>
              </div>
              <p className="text-sm leading-relaxed text-muted md:text-base">
                {METHODOLOGY.description}
              </p>
            </div>
          </Reveal>

          <div className="mt-14 divide-y divide-line border-y border-line">
            {METHODOLOGY.blocks.map((block, i) => (
              <Reveal key={block.index} delay={i * 0.05}>
                <div className="group grid items-baseline gap-2 py-7 transition-colors hover:bg-surface/60 md:grid-cols-[96px_1fr_2fr] md:gap-8 md:py-9">
                  <span className="text-outline font-display text-5xl font-black transition-all group-hover:text-accent md:text-6xl">
                    {block.index}
                  </span>
                  <div>
                    <h3 className="font-display text-xl font-bold transition-colors group-hover:text-accent-soft">
                      {block.name}
                    </h3>
                    <p className="mt-1.5 text-xs uppercase tracking-[0.2em] text-faint">
                      {block.en}
                    </p>
                  </div>
                  <p className="text-sm leading-relaxed text-muted">{block.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- 04 项目实录 · 纸面 ---------- */}
      <section className="section-paper border-t border-paper-line">
        <div className="relative mx-auto max-w-6xl px-5 py-24 md:px-8 md:py-32">
          <Reveal>
            <div className="flex flex-wrap items-end justify-between gap-6">
              <div>
                <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-accent">
                  04 — Project Archive
                </p>
                <h2 className="mt-4 font-display text-4xl font-black tracking-tight md:text-6xl">
                  项目实录
                </h2>
              </div>
              <Link
                href="/gallery"
                className="group flex items-center gap-1.5 text-sm text-paper-muted transition-colors hover:text-ink"
              >
                浏览全部实录
                <ArrowUpRight
                  size={15}
                  className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                />
              </Link>
            </div>
          </Reveal>

          <div className="mt-12 grid grid-cols-2 gap-5 md:grid-cols-4">
            {GALLERY.filter((g) => g.src.includes("real-")).slice(0, 4).map((item, i) => (
              <Reveal key={item.src} delay={i * 0.06}>
                <Link
                  href="/gallery"
                  className="group shadow-paper-card relative block aspect-[4/5] overflow-hidden rounded-2xl border border-paper-line transition-transform duration-300 hover:-translate-y-1"
                >
                  <FadeImage
                    src={item.src}
                    alt={item.alt}
                    fill
                    sizes="(max-width: 768px) 50vw, 25vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                  <p className="absolute bottom-3 left-3 translate-y-2 text-sm font-medium text-ivory opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                    {item.title}
                  </p>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- 05 CTA · 墨场收束 ---------- */}
      <section className="bg-noise relative overflow-hidden border-t border-line">
        <div aria-hidden className="pointer-events-none absolute inset-0">
          <div className="absolute -bottom-40 left-1/2 h-[420px] w-[720px] -translate-x-1/2 rounded-full bg-accent/12 blur-[150px]" />
        </div>
        <div className="relative mx-auto max-w-6xl px-5 py-28 text-center md:px-8 md:py-36">
          <Reveal>
            <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-accent-soft">
              05 — Next Step
            </p>
            <h2 className="mx-auto mt-7 max-w-3xl font-display text-4xl font-black leading-tight md:text-6xl">
              把 AI 做成
              <span className="text-accent-soft">可验收的产品</span>
            </h2>
            <p className="mx-auto mt-6 max-w-xl text-sm leading-relaxed text-muted md:text-base">
              从模型评测做到产品落地——如果你正在找这样的 AI 产品经理，欢迎与我聊聊。
            </p>
            <Link
              href="/contact"
              className="group mt-10 inline-flex items-center gap-2 rounded-full bg-accent px-8 py-4 text-sm font-medium text-ivory transition-colors hover:bg-accent-soft hover:text-ink"
            >
              与我联系
              <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
            </Link>
          </Reveal>
        </div>
      </section>
    </>
  );
}
