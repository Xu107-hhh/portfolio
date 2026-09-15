import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import Hero from "@/components/home/Hero";
import VolumeTag from "@/components/home/VolumeTag";
import FadeImage from "@/components/FadeImage";
import WorkCard from "@/components/WorkCard";
import { FEATURED_WORK, GALLERY, METHODOLOGY, SKILLS } from "@/lib/constants";

export default function Home() {
  return (
    <>
      {/* ---------- Hero · 墨场开场（验收单 + 履历轨迹） ---------- */}
      <Hero />

      {/* ---------- 卷一 · 精选案例 · 纸面报告 ---------- */}
      <section className="section-paper relative overflow-hidden">
        <div className="relative mx-auto max-w-6xl px-5 py-24 md:px-8 md:py-32">
          <VolumeTag volume="卷一" tone="paper" />
          <div className="mt-5 flex flex-wrap items-end justify-between gap-6">
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

          <div className="mt-12 grid gap-6 md:grid-cols-2">
            {FEATURED_WORK.slice(0, 5).map((study, i) => (
              <div key={study.slug} className={i === 0 ? "md:col-span-2" : ""}>
                <WorkCard study={study} large={i === 0} tone="paper" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- 卷二 · 能力矩阵 · 档案卡 ---------- */}
      <section className="section-paper border-t border-paper-line">
        <div className="relative mx-auto max-w-6xl px-5 py-24 md:px-8 md:py-32">
          <VolumeTag volume="卷二" tone="paper" />
          <h2 className="mt-5 font-display text-4xl font-black tracking-tight md:text-6xl">
            能力矩阵
          </h2>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {SKILLS.map((group, i) => {
              const isLast = i === SKILLS.length - 1;
              return (
                <div key={group.category} className={isLast ? "col-span-full" : ""}>
                  <div className="file-card file-shadow h-full bg-paper-card p-6">
                    <p className="font-mono text-[10px] text-paper-muted">NO.0{i + 1}</p>
                    <h3 className="mt-3 font-display text-lg font-bold">
                      {group.category}
                      {group.featured && (
                        <span
                          className="ml-2 inline-block rounded-full bg-accent/10 px-2.5 py-0.5 align-middle font-mono text-[10px] text-accent"
                          style={{ letterSpacing: "0.08em" }}
                        >
                          Core
                        </span>
                      )}
                    </h3>
                    <ul className={isLast ? "mt-4 flex flex-wrap gap-x-8 gap-y-2" : "mt-4 space-y-2"}>
                      {group.items.map((item) => (
                        <li key={item} className="flex items-start gap-2 text-sm text-paper-muted">
                          <span className="mt-[7px] h-1 w-1 shrink-0 rotate-45 bg-accent" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ---------- 卷三 · 方法论沉淀 · 墨场回归 ---------- */}
      <section className="relative bg-ink">
        <div className="mx-auto max-w-6xl px-5 py-24 md:px-8 md:py-32">
          <div className="grid gap-6 md:grid-cols-[1fr_1.4fr] md:items-end">
            <div>
              <VolumeTag volume="卷三" tone="ink" />
              <h2 className="mt-5 font-display text-4xl font-black tracking-tight md:text-6xl">
                方法论沉淀
              </h2>
            </div>
            <p className="text-sm leading-relaxed text-muted md:text-base">
              {METHODOLOGY.description}
            </p>
          </div>

          <div className="mt-14 divide-y divide-line border-y border-line">
            {METHODOLOGY.blocks.map((block) => (
              <div
                key={block.index}
                className="group grid items-baseline gap-2 py-7 transition-colors hover:bg-surface/60 md:grid-cols-[96px_1fr_2fr] md:gap-8 md:py-9"
              >
                <span className="text-outline font-display text-5xl font-black transition-all group-hover:text-accent md:text-6xl">
                  {block.index}
                </span>
                <div>
                  <h3 className="font-display text-xl font-bold transition-colors group-hover:text-accent-soft">
                    {block.name}
                  </h3>
                  <p className="mt-1.5 text-xs uppercase tracking-[0.2em] text-faint">{block.en}</p>
                </div>
                <p className="text-sm leading-relaxed text-muted">{block.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- 卷四 · 项目实录 · 纸面 ---------- */}
      <section className="section-paper border-t border-paper-line">
        <div className="relative mx-auto max-w-6xl px-5 py-24 md:px-8 md:py-32">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <VolumeTag volume="卷四" tone="paper" />
              <h2 className="mt-5 font-display text-4xl font-black tracking-tight md:text-6xl">
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

          <div className="mt-12 grid grid-cols-2 gap-5 md:grid-cols-4">
            {GALLERY.filter((g) => g.src.includes("real-")).slice(0, 4).map((item) => (
              <Link
                key={item.src}
                href="/gallery"
                className="group shadow-paper-card relative block aspect-[4/5] overflow-hidden rounded-2xl border border-paper-line"
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
            ))}
          </div>
        </div>
      </section>

      {/* ---------- 卷终 · CTA · 墨场收束 ---------- */}
      <section className="bg-noise relative overflow-hidden border-t border-line">
        <div className="relative mx-auto max-w-6xl px-5 py-28 text-center md:px-8 md:py-36">
          <VolumeTag volume="卷终" tone="ink" />
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
        </div>
      </section>
    </>
  );
}
