import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import PageHeader from "@/components/PageHeader";
import Reveal from "@/components/Reveal";
import WorkCard from "@/components/WorkCard";
import { CASE_STUDIES, WORK_GROUPS } from "@/lib/constants";

export const metadata: Metadata = {
  title: "作品展示",
  description:
    "许隆鑫的作品集：AI 动画自动化生产提效、磐石大模型系统性评测、动力电池产业情报分析、SciAgent 多智能体系统、智慧试卷设计师（全国三等奖）等 9 个案例的完整拆解。",
};

export default function WorksPage() {
  return (
    <>
      <PageHeader
        index="02"
        eyebrow="Selected Works"
        title="作品展示"
        description="9 个案例按经历阶段分区呈现——实习交付、科研与情报、竞赛与课程、独立探索：问题定义、策略路径与量化结果，数据永远落在决策上。"
      />

      <section className="mx-auto max-w-6xl px-5 py-16 md:px-8 md:py-24">
        <div className="space-y-16 md:space-y-20">
          {WORK_GROUPS.map((group) => {
            const studies = group.slugs
              .map((slug) => CASE_STUDIES.find((c) => c.slug === slug))
              .filter((c): c is (typeof CASE_STUDIES)[number] => Boolean(c));
            if (studies.length === 0) return null;
            return (
              <div key={group.key}>
                <Reveal>
                  <p className="flex items-center gap-3 text-xs uppercase tracking-[0.25em] text-faint">
                    <span className="text-accent">+</span>
                    <span className="h-px w-10 bg-line" />
                    {group.en}
                  </p>
                  <h2 className="mt-4 font-display text-2xl font-bold md:text-3xl">
                    {group.label}
                    <span className="ml-3 align-middle text-sm font-normal text-muted">
                      {studies.length} 个案例
                    </span>
                  </h2>
                </Reveal>
                {studies.length === 1 ? (
                  <div className="mt-8">
                    <Reveal>
                      <WorkCard study={studies[0]} large />
                    </Reveal>
                  </div>
                ) : (
                  <div className="mt-8 space-y-8">
                    {studies.map((study, i) => (
                      <Reveal key={study.slug} delay={i * 0.06}>
                        <WorkCard study={study} large />
                      </Reveal>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <Reveal>
          <div className="mt-20 flex flex-col items-center justify-between gap-6 border border-line bg-surface p-8 md:flex-row md:p-10">
            <div>
              <h2 className="font-display text-xl font-bold md:text-2xl">
                想深入了解某个案例的细节？
              </h2>
              <p className="mt-2 text-sm text-muted">
                案例内容均来自真实的报告、评测记录与交付文档，欢迎交流。
              </p>
            </div>
            <Link
              href="/contact"
              className="group inline-flex shrink-0 items-center gap-2 bg-accent px-6 py-3.5 font-medium text-ink transition-colors hover:bg-accent-soft"
            >
              与我联系
              <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </Reveal>
      </section>
    </>
  );
}
