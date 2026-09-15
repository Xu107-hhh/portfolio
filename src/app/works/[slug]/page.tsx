import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, Building2, CalendarDays, UserRound } from "lucide-react";
import Reveal from "@/components/Reveal";
import FadeImage from "@/components/FadeImage";
import { CASE_STUDIES } from "@/lib/constants";

interface WorkDetailProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return CASE_STUDIES.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: WorkDetailProps): Promise<Metadata> {
  const { slug } = await params;
  const study = CASE_STUDIES.find((c) => c.slug === slug);
  if (!study) return { title: "案例未找到" };
  return { title: study.title, description: study.summary };
}

export default async function WorkDetailPage({ params }: WorkDetailProps) {
  const { slug } = await params;
  const study = CASE_STUDIES.find((c) => c.slug === slug);
  if (!study) notFound();

  const index = CASE_STUDIES.indexOf(study);
  const prev = CASE_STUDIES[(index - 1 + CASE_STUDIES.length) % CASE_STUDIES.length];
  const next = CASE_STUDIES[(index + 1) % CASE_STUDIES.length];

  return (
    <article className="mx-auto max-w-6xl px-5 py-14 md:px-8 md:py-20">
      <Reveal>
        <Link
          href="/works"
          className="group inline-flex items-center gap-2 text-sm text-muted transition-colors hover:text-ivory"
        >
          <ArrowLeft size={15} className="transition-transform group-hover:-translate-x-1" />
          返回作品列表
        </Link>
      </Reveal>

      {/* 头部 */}
      <header className="mt-8 border-b border-line pb-10">
        <Reveal>
          <div className="flex flex-wrap items-center gap-3">
            <span className="bg-accent/15 px-2.5 py-1 text-xs font-medium uppercase tracking-wider text-accent">
              {study.category}
            </span>
          </div>
        </Reveal>
        <Reveal delay={0.06}>
          <h1 className="mt-5 font-display text-3xl font-bold leading-tight md:text-5xl">
            {study.title}
          </h1>
          <p className="mt-3 text-base text-muted md:text-lg">{study.tagline}</p>
        </Reveal>

        <Reveal delay={0.1}>
          <div className="mt-8 flex flex-wrap gap-x-8 gap-y-3 text-sm">
            <span className="flex items-center gap-2 text-muted">
              <UserRound size={15} className="text-accent" />
              {study.role}
            </span>
            <span className="flex items-center gap-2 text-muted">
              <CalendarDays size={15} className="text-accent" />
              {study.period}
            </span>
            {study.company && (
              <span className="flex items-center gap-2 text-muted">
                <Building2 size={15} className="text-accent" />
                {study.company}
              </span>
            )}
          </div>
        </Reveal>
      </header>

      {/* 封面 */}
      {study.cover && (
        <Reveal delay={0.12}>
          <div className="relative mt-10 aspect-[16/9] overflow-hidden border border-line">
            <FadeImage
              src={study.cover}
              alt={study.title}
              fill
              sizes="(max-width: 1152px) 100vw, 1152px"
              className="object-cover"
              priority
            />
          </div>
        </Reveal>
      )}

      {/* 摘要 */}
      <Reveal>
        <p className="mt-10 max-w-3xl text-lg leading-loose text-ivory/90">{study.summary}</p>
      </Reveal>

      {/* 量化结果 */}
      <Reveal>
        <dl className="mt-10 grid grid-cols-2 gap-px border border-line bg-line md:grid-cols-4">
          {study.impact.map((m) => (
            <div key={m.label} className="bg-ink p-6">
              <dt className="font-display text-2xl font-bold text-accent-soft md:text-3xl">
                {m.value}
              </dt>
              <dd className="mt-1.5 text-xs leading-relaxed text-muted">{m.label}</dd>
            </div>
          ))}
        </dl>
      </Reveal>

      {/* 真实界面截图 */}
      {study.shots && study.shots.length > 0 && (
        <Reveal>
          <section className="mt-12">
            <h2 className="flex items-baseline gap-3 font-display text-2xl font-bold">
              <span className="font-display text-sm text-accent">✦</span>
              真实界面
            </h2>
            <div className="mt-5 flex flex-wrap items-start gap-4">
              {study.shots.map((s) => (
                <figure key={s.src} className="border border-line bg-surface p-2.5">
                  <FadeImage
                    src={s.src}
                    alt={s.alt}
                    width={s.w}
                    height={s.h}
                    className="h-auto max-h-[520px] w-auto max-w-full"
                  />
                  <figcaption className="mt-2 px-1 pb-0.5 text-xs leading-relaxed text-faint">
                    {s.caption}
                  </figcaption>
                </figure>
              ))}
            </div>
          </section>
        </Reveal>
      )}

      <div className="mt-14 grid gap-12 lg:grid-cols-[1.6fr_1fr]">
        <div>
          {/* 问题 */}
          <Reveal>
            <section>
              <h2 className="flex items-baseline gap-3 font-display text-2xl font-bold">
                <span className="font-display text-sm text-accent">01</span>
                问题定义
              </h2>
              <p className="mt-4 leading-loose text-muted">{study.problem}</p>
            </section>
          </Reveal>

          {/* 策略 */}
          <Reveal>
            <section className="mt-12">
              <h2 className="flex items-baseline gap-3 font-display text-2xl font-bold">
                <span className="font-display text-sm text-accent">02</span>
                策略与路径
              </h2>
              <ol className="mt-5 space-y-5">
                {study.approach.map((step, i) => (
                  <li key={i} className="flex items-start gap-4">
                    <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center border border-accent/40 font-display text-xs text-accent">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <p className="leading-loose text-muted">{step}</p>
                  </li>
                ))}
              </ol>
            </section>
          </Reveal>

          {/* 工具与作品全景（按工作流分组：提效矩阵 / 学习机数据线等） */}
          {study.subTools && (
            <Reveal>
              <section className="mt-12">
                <h2 className="flex items-baseline gap-3 font-display text-2xl font-bold">
                  <span className="font-display text-sm text-accent">03</span>
                  工具与作品全景
                </h2>
                {Array.from(new Set(study.subTools.map((t) => t.group ?? "提效产品矩阵"))).map((group) => (
                  <div key={group} className="mt-6 first:mt-5">
                    <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-faint">
                      {group}
                    </p>
                    <div className="mt-3 grid gap-px border border-line bg-line sm:grid-cols-2">
                      {study.subTools!
                        .filter((t) => (t.group ?? "提效产品矩阵") === group)
                        .map((tool) => (
                          <div key={tool.name} className="group bg-ink p-5 transition-colors hover:bg-surface">
                            <span className="inline-block border border-accent/40 bg-accent/10 px-2 py-0.5 text-[10px] uppercase tracking-wider text-accent">
                              {tool.form}
                            </span>
                            <h3 className="mt-2.5 text-sm font-semibold text-ivory group-hover:text-accent-soft">
                              {tool.name}
                            </h3>
                            <p className="mt-2 text-xs leading-relaxed text-muted">{tool.desc}</p>
                          </div>
                        ))}
                    </div>
                  </div>
                ))}
              </section>
            </Reveal>
          )}
          {/* 收获与反思 */}
          {study.reflection && (
            <Reveal>
              <section className="mt-12 border-l-2 border-accent bg-surface p-6 md:p-8">
                <h2 className="flex items-baseline gap-3 font-display text-2xl font-bold">
                  <span className="font-display text-sm text-accent">04</span>
                  收获与反思
                </h2>
                <p className="mt-4 text-lg leading-loose text-ivory/90">
                  {study.reflection}
                </p>
              </section>
            </Reveal>
          )}
        </div>

        {/* 侧栏：技术栈 */}
        <aside>
          <Reveal delay={0.08}>
            <div className="sticky top-24 border border-line bg-surface p-6">
              <h2 className="font-display text-sm font-semibold uppercase tracking-[0.2em] text-faint">
                Tech Stack
              </h2>
              <ul className="mt-4 flex flex-wrap gap-2">
                {study.tech.map((t) => (
                  <li
                    key={t}
                    className="border border-line bg-ink px-2.5 py-1 text-xs text-muted transition-colors hover:border-accent/50 hover:text-ivory"
                  >
                    {t}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        </aside>
      </div>

      {/* 数据口径说明 */}
      {study.dataNote && (
        <Reveal>
          <p className="mt-12 border-t border-line pt-5 text-xs leading-relaxed text-faint">
            {study.dataNote}
          </p>
        </Reveal>
      )}

      {/* 上一篇 / 下一篇 */}
      <nav className="mt-20 grid gap-px border border-line bg-line md:grid-cols-2">
        <Link
          href={`/works/${prev.slug}`}
          className="group bg-ink p-6 transition-colors hover:bg-surface"
        >
          <p className="flex items-center gap-2 text-xs text-faint">
            <ArrowLeft size={13} className="transition-transform group-hover:-translate-x-1" />
            上一案例
          </p>
          <p className="mt-2 font-display font-semibold group-hover:text-accent-soft">{prev.title}</p>
        </Link>
        <Link
          href={`/works/${next.slug}`}
          className="group bg-ink p-6 text-right transition-colors hover:bg-surface"
        >
          <p className="flex items-center justify-end gap-2 text-xs text-faint">
            下一案例
            <ArrowRight size={13} className="transition-transform group-hover:translate-x-1" />
          </p>
          <p className="mt-2 font-display font-semibold group-hover:text-accent-soft">{next.title}</p>
        </Link>
      </nav>
    </article>
  );
}
