import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight, GraduationCap, Trophy } from "lucide-react";
import PageHeader from "@/components/PageHeader";
import Reveal from "@/components/Reveal";
import FadeImage from "@/components/FadeImage";
import { PERSONAL, ABOUT, EDUCATION, EXPERIENCE, SKILLS, AWARDS, METHODOLOGY } from "@/lib/constants";

export const metadata: Metadata = {
  title: "关于我",
  description:
    "许隆鑫 — AI 产品经理。情报学硕士（信息资源管理 · 数据科学系 · 人工智能应用研究方向），从模型评测到产品落地的完整实战经验，坚持五级证据分级与「先验证、再扩张」的工作纪律。",
};

export default function AboutPage() {
  return (
    <>
      <PageHeader
        index="01"
        eyebrow="About Me"
        title="关于我"
        description="一个相信「先验证、再扩张」的 AI 实战派产品经理。"
      />

      {/* ---------- 个人简介 ---------- */}
      <section className="mx-auto max-w-6xl px-5 py-16 md:px-8 md:py-24">
        <div className="grid gap-12 lg:grid-cols-[1fr_1.7fr]">
          <Reveal>
            <div className="relative w-full max-w-sm border border-line bg-surface p-3">
              <div className="relative aspect-[4/5] overflow-hidden">
                <FadeImage
                  src={PERSONAL.avatar}
                  alt={`${PERSONAL.name} 形象照`}
                  fill
                  sizes="(max-width: 1024px) 100vw, 384px"
                  className="object-cover transition-transform duration-700 hover:scale-[1.03]"
                  priority
                />
              </div>
              <div className="flex items-center justify-between px-1 pt-3">
                <div>
                  <p className="font-display font-semibold">{PERSONAL.name}</p>
                  <p className="text-xs text-muted">{PERSONAL.role}</p>
                </div>
                <p className="font-display text-xs uppercase tracking-[0.2em] text-faint">
                  Tianjin · CN
                </p>
              </div>
            </div>
          </Reveal>

          <div>
            {ABOUT.paragraphs.map((p, i) => (
              <Reveal key={i} delay={i * 0.06}>
                <p className="mb-5 text-base leading-loose text-muted first:text-lg first:text-ivory">
                  {p}
                </p>
              </Reveal>
            ))}

            <Reveal delay={0.1}>
              <dl className="mt-8 grid grid-cols-2 gap-px border border-line bg-line md:grid-cols-3">
                {ABOUT.highlights.map((h) => (
                  <div key={h.label} className="bg-ink p-5">
                    <dt className="font-display text-xl font-bold text-accent-soft">{h.value}</dt>
                    <dd className="mt-1 text-xs leading-relaxed text-muted">{h.label}</dd>
                  </div>
                ))}
              </dl>
            </Reveal>
          </div>
        </div>

        {/* 基本信息 */}
        <Reveal>
          <dl className="mt-10 grid grid-cols-2 gap-px border border-line bg-line md:grid-cols-5">
            {[
              { label: "届别学历", value: "2027 届硕士" },
              {
                label: "院校专业",
                value: (
                  <>
                    情报学
                    {/* 移动端随文自然换行；md+ 括号段独立一行（缩号+禁折行，防溢出到第三行） */}
                    <span className="md:hidden">（信息资源管理 · 数据科学系）</span>
                    <span className="hidden md:block md:whitespace-nowrap md:text-[11px] md:font-normal md:text-muted md:mt-1">
                      （信息资源管理·数据科学系）
                    </span>
                  </>
                ),
              },
              { label: "研究方向", value: "人工智能应用研究" },
              { label: "政治面貌", value: "中共党员" },
              { label: "求职意向", value: "AI 产品经理" },
            ].map((item) => (
              <div
                key={item.label}
                className={`bg-ink p-5 ${item.label === "求职意向" ? "max-md:col-span-2" : ""}`}
              >
                <dt className="text-[10px] uppercase tracking-[0.2em] text-faint">
                  {item.label}
                </dt>
                <dd className="mt-1.5 text-sm font-medium text-ivory">{item.value}</dd>
              </div>
            ))}
          </dl>
        </Reveal>

        {/* 关注方向 */}
        <div className="mt-16 grid gap-px border border-line bg-line md:grid-cols-3">
          {ABOUT.focus.map((f, i) => (
            <Reveal key={f.title} delay={i * 0.06} className="bg-ink">
              <div className="h-full p-6">
                <p className="font-display text-xs text-faint">0{i + 1}</p>
                <h3 className="mt-3 font-display text-lg font-semibold">{f.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{f.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ---------- 履历 ---------- */}
      <section className="border-y border-line bg-surface">
        <div className="mx-auto max-w-6xl px-5 py-16 md:px-8 md:py-24">
          <Reveal>
            <p className="flex items-center gap-3 text-xs uppercase tracking-[0.25em] text-faint">
              <span className="text-accent">02</span>
              <span className="h-px w-10 bg-line" />
              Experience
            </p>
            <h2 className="mt-4 font-display text-3xl font-bold md:text-4xl">工作履历</h2>
          </Reveal>

          <div className="mt-10 space-y-px bg-line">
            {EXPERIENCE.map((exp, i) => (
              <Reveal key={exp.company} delay={i * 0.05}>
                <article className="bg-surface p-6 md:p-8">
                  <div className="flex flex-wrap items-baseline justify-between gap-3">
                    <h3 className="font-display text-xl font-semibold">
                      {exp.company}
                    </h3>
                    <p className="font-display text-sm text-faint">{exp.period}</p>
                  </div>
                  <p className="mt-1 text-sm text-accent-soft">{exp.role}</p>
                  <ul className="mt-4 space-y-2.5">
                    {exp.details.map((d, j) => (
                      <li key={j} className="flex items-start gap-3 text-sm leading-relaxed text-muted">
                        <span className="mt-[9px] h-1 w-1 shrink-0 rotate-45 bg-accent" />
                        {d}
                      </li>
                    ))}
                  </ul>
                  {exp.caseSlug && (
                    <Link
                      href={`/works/${exp.caseSlug}`}
                      className="group mt-5 inline-flex items-center gap-1.5 border-b border-accent/50 pb-0.5 text-sm text-accent-soft transition-colors hover:border-accent"
                    >
                      查看完整案例拆解
                      <ArrowUpRight size={14} className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                    </Link>
                  )}
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- 方法论 ---------- */}
      <section className="border-y border-line bg-surface">
        <div className="mx-auto max-w-6xl px-5 py-16 md:px-8 md:py-24">
          <Reveal>
            <p className="flex items-center gap-3 text-xs uppercase tracking-[0.25em] text-faint">
              <span className="text-accent">03</span>
              <span className="h-px w-10 bg-line" />
              Methodology
            </p>
            <h2 className="mt-4 font-display text-3xl font-bold md:text-4xl">
              {METHODOLOGY.title}
            </h2>
            <p className="mt-4 max-w-2xl leading-relaxed text-muted">
              {METHODOLOGY.description}
            </p>
          </Reveal>

          <div className="mt-10 grid gap-px border border-line bg-line md:grid-cols-2">
            {METHODOLOGY.blocks.map((block, i) => (
              <Reveal key={block.index} delay={i * 0.06} className="bg-surface">
                <div className="group h-full p-6 transition-colors hover:bg-elevated md:p-8">
                  <div className="flex items-baseline gap-4">
                    <span className="text-outline font-display text-5xl font-bold transition-all group-hover:text-accent">
                      {block.index}
                    </span>
                    <div>
                      <h3 className="font-display text-lg font-semibold transition-colors group-hover:text-accent-soft">
                        {block.name}
                      </h3>
                      <p className="mt-0.5 text-xs uppercase tracking-[0.2em] text-faint">
                        {block.en}
                      </p>
                    </div>
                  </div>
                  <p className="mt-4 text-sm leading-relaxed text-muted">{block.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- 教育 ---------- */}
      <section className="mx-auto max-w-6xl px-5 py-16 md:px-8 md:py-24">
        <Reveal>
          <p className="flex items-center gap-3 text-xs uppercase tracking-[0.25em] text-faint">
            <span className="text-accent">04</span>
            <span className="h-px w-10 bg-line" />
            Education
          </p>
          <h2 className="mt-4 font-display text-3xl font-bold md:text-4xl">教育背景</h2>
        </Reveal>

        <div className="mt-10 grid gap-6 md:grid-cols-2">
          {EDUCATION.map((edu, i) => (
            <Reveal key={edu.school} delay={i * 0.08}>
              <article className="h-full border border-line bg-surface p-6 transition-colors hover:border-accent/40 md:p-8">
                <div className="flex items-center justify-between">
                  <GraduationCap size={20} className="text-accent" />
                  <span className="font-display text-xs text-faint">{edu.period}</span>
                </div>
                <h3 className="mt-4 font-display text-xl font-semibold">
                  {edu.school}
                  <span className="ml-2 text-sm font-normal text-muted">{edu.degree}</span>
                </h3>
                <p className="mt-1 text-sm text-accent-soft">{edu.major}</p>
                {"gpa" in edu && edu.gpa && (
                  <p className="mt-2 text-xs text-muted">GPA：{edu.gpa}</p>
                )}
                <p className="mt-4 border-t border-line pt-4 text-xs leading-relaxed text-faint">
                  <span className="text-muted">主修课程：</span>{edu.courses}
                </p>
                {edu.research && (
                  <p className="mt-2 text-xs leading-relaxed text-faint">
                    <span className="text-muted">研究方向：</span>{edu.research}
                  </p>
                )}
                {"highlights" in edu && edu.highlights && (
                  <p className="mt-2 text-xs leading-relaxed text-faint">
                    <span className="text-muted">亮点：</span>{edu.highlights}
                  </p>
                )}
              </article>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ---------- 技能 ---------- */}
      <section className="border-y border-line bg-surface">
        <div className="mx-auto max-w-6xl px-5 py-16 md:px-8 md:py-24">
          <Reveal>
            <p className="flex items-center gap-3 text-xs uppercase tracking-[0.25em] text-faint">
              <span className="text-accent">05</span>
              <span className="h-px w-10 bg-line" />
              Skills
            </p>
            <h2 className="mt-4 font-display text-3xl font-bold md:text-4xl">技能栈</h2>
          </Reveal>

          <div className="mt-10 grid gap-px border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
            {SKILLS.map((group, i) => (
              <Reveal key={group.category} delay={i * 0.06} className="bg-surface">
                <div className="h-full p-6">
                  <h3 className="font-display text-base font-semibold">
                    {group.category}
                    {group.featured && (
                      <span className="ml-2 inline-block bg-accent/15 px-1.5 py-0.5 align-middle text-[10px] uppercase tracking-wider text-accent">
                        Core
                      </span>
                    )}
                  </h3>
                  <ul className="mt-4 flex flex-wrap gap-2">
                    {group.items.map((item) => (
                      <li
                        key={item}
                        className="border border-line px-2.5 py-1 text-xs text-muted transition-colors hover:border-accent/50 hover:text-ivory"
                      >
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- 奖项 ---------- */}
      <section className="mx-auto max-w-6xl px-5 py-16 md:px-8 md:py-24">
        <Reveal>
          <p className="flex items-center gap-3 text-xs uppercase tracking-[0.25em] text-faint">
            <span className="text-accent">06</span>
            <span className="h-px w-10 bg-line" />
            Honors
          </p>
          <h2 className="mt-4 font-display text-3xl font-bold md:text-4xl">荣誉奖项</h2>
        </Reveal>

        <div className="mt-10 grid gap-px border border-line bg-line sm:grid-cols-2 lg:grid-cols-3">
          {AWARDS.map((award, i) => (
            <Reveal key={award.title} delay={i * 0.04} className="bg-ink">
              <div className="group flex h-full items-start gap-4 p-6 transition-colors hover:bg-surface">
                <Trophy size={18} className="mt-0.5 shrink-0 text-accent" />
                <div className="flex-1">
                  <div className="flex items-baseline justify-between gap-2">
                    <h3 className="text-sm font-medium leading-snug">{award.title}</h3>
                    <span className="font-display text-xs text-faint">{award.year}</span>
                  </div>
                  <p className="mt-1 text-xs text-muted">{award.detail}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>
    </>
  );
}
