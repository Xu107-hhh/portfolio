import Link from "next/link";
import { ArrowRight, ArrowUpRight, Sparkles } from "lucide-react";
import Reveal from "@/components/Reveal";
import FadeImage from "@/components/FadeImage";
import Marquee from "@/components/Marquee";
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
      {/* ---------- Hero ---------- */}
      <section className="bg-grid bg-noise relative overflow-hidden">
        <div className="pointer-events-none absolute -right-40 -top-40 h-[480px] w-[480px] rounded-full bg-accent/20 blur-[140px]" />
        <div className="pointer-events-none absolute -bottom-56 -left-40 h-[420px] w-[420px] rounded-full bg-accent/10 blur-[120px]" />

        <div className="relative mx-auto max-w-6xl px-5 pb-20 pt-16 md:px-8 md:pb-28 md:pt-24">
          <Reveal>
            <p className="inline-flex items-center gap-2 border border-line bg-surface px-3 py-1.5 text-xs tracking-wider text-muted">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-lime opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-lime" />
              </span>
              {PERSONAL.available}
            </p>
          </Reveal>

          <div className="mt-10 grid items-end gap-12 lg:grid-cols-[1.6fr_1fr]">
            <div>
              <Reveal delay={0.05}>
                <h1 className="font-display text-6xl font-bold leading-[1.05] tracking-tight md:text-8xl">
                  许隆鑫
                </h1>
                <p className="text-outline mt-3 font-display text-3xl font-bold uppercase tracking-[0.08em] md:text-5xl">
                  Xu Longxin
                </p>
              </Reveal>

              <Reveal delay={0.12}>
                <p className="mt-8 font-display text-lg text-accent-soft md:text-xl">
                  {PERSONAL.role} · {PERSONAL.roleDetail}
                </p>
                <p className="mt-4 max-w-xl text-base leading-relaxed text-muted md:text-lg">
                  情报学硕士背景，精准学（阿里战投 · 准独角兽）AI 产品实习，主导动画制作
                  环节的内部提效——擅长把模糊的「AI 提效」需求拆成场景、流程、验证指标与可交付方案，
                  把 AI 能力转化为可验证、可交付的产品价值。
                </p>
              </Reveal>

              <Reveal delay={0.18}>
                <div className="mt-10 flex flex-wrap items-center gap-4">
                  <Link
                    href="/works"
                    className="group inline-flex items-center gap-2 bg-accent px-6 py-3.5 font-medium text-ink transition-colors hover:bg-accent-soft"
                  >
                    查看作品
                    <ArrowRight size={17} className="transition-transform group-hover:translate-x-1" />
                  </Link>
                  <Link
                    href="/gallery"
                    className="inline-flex items-center gap-2 border border-line px-6 py-3.5 font-medium text-ivory transition-colors hover:border-accent hover:text-accent-soft"
                  >
                    浏览项目实录
                  </Link>
                </div>
              </Reveal>
            </div>

            <Reveal delay={0.15} className="hidden lg:block">
              <div className="relative ml-auto w-64 md:w-72">
                <span className="absolute -left-2 -top-2 h-5 w-5 border-l-2 border-t-2 border-accent" />
                <span className="absolute -bottom-2 -right-2 h-5 w-5 border-b-2 border-r-2 border-accent" />
                <div className="border border-line bg-surface p-3 transition-colors duration-300 hover:border-accent/40">
                  <div className="relative aspect-[4/5] overflow-hidden">
                    <FadeImage
                      src={PERSONAL.avatar}
                      alt={`${PERSONAL.name} 形象照`}
                      fill
                      sizes="288px"
                      className="object-cover transition-transform duration-700 hover:scale-[1.03]"
                      priority
                    />
                  </div>
                  <div className="flex items-center justify-between px-1 pt-3">
                    <span className="font-display text-xs uppercase tracking-[0.2em] text-faint">
                      Tianjin · CN
                    </span>
                    <span className="flex items-center gap-1.5">
                      <span className="h-1.5 w-1.5 rounded-full bg-lime" />
                      <Sparkles size={14} className="text-accent" />
                    </span>
                  </div>
                </div>
              </div>
            </Reveal>
          </div>

          <Reveal delay={0.22}>
            <dl className="mt-16 grid grid-cols-2 gap-px border border-line bg-line md:grid-cols-4">
              {STATS.map((s) => (
                <div key={s.label} className="group bg-ink p-6 transition-colors hover:bg-surface">
                  <dt className="font-display text-2xl font-bold text-ivory transition-colors group-hover:text-accent-soft md:text-3xl">
                    {s.value}
                  </dt>
                  <dd className="mt-1.5 text-sm text-muted">{s.label}</dd>
                </div>
              ))}
            </dl>
          </Reveal>
        </div>
      </section>

      <Marquee />

      {/* ---------- 精选案例 ---------- */}
      <section className="mx-auto max-w-6xl px-5 py-20 md:px-8 md:py-28">
        <Reveal>
          <div className="flex items-end justify-between">
            <div>
              <p className="flex items-center gap-3 text-xs uppercase tracking-[0.25em] text-faint">
                <span className="text-accent">01</span>
                <span className="h-px w-10 bg-line" />
                Selected Works
              </p>
              <h2 className="mt-4 font-display text-3xl font-bold md:text-4xl">精选案例</h2>
            </div>
            <Link
              href="/works"
              className="group hidden items-center gap-1.5 text-sm text-muted transition-colors hover:text-ivory md:flex"
            >
              全部作品
              <ArrowUpRight size={15} className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </Link>
          </div>
        </Reveal>

        <div className="mt-10 grid gap-6 md:grid-cols-2">
          {FEATURED_WORK.slice(0, 4).map((study, i) => (
            <Reveal key={study.slug} delay={i * 0.08} className={i === 0 ? "md:col-span-2" : ""}>
              <WorkCard study={study} large={i === 0} />
            </Reveal>
          ))}
        </div>
      </section>

      {/* ---------- 能力矩阵 ---------- */}
      <section className="border-y border-line bg-surface">
        <div className="mx-auto max-w-6xl px-5 py-20 md:px-8 md:py-28">
          <Reveal>
            <p className="flex items-center gap-3 text-xs uppercase tracking-[0.25em] text-faint">
              <span className="text-accent">02</span>
              <span className="h-px w-10 bg-line" />
              Capabilities
            </p>
            <h2 className="mt-4 font-display text-3xl font-bold md:text-4xl">能力矩阵</h2>
          </Reveal>

          <div className="mt-10 grid gap-px border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
            {SKILLS.map((group, i) => (
              <Reveal key={group.category} delay={i * 0.06} className="bg-surface">
                <div className="group h-full p-6 transition-colors hover:bg-elevated">
                  <p className="font-display text-xs text-faint">0{i + 1}</p>
                  <h3 className="mt-3 font-display text-lg font-semibold group-hover:text-accent-soft">
                    {group.category}
                    {group.featured && (
                      <span className="ml-2 inline-block bg-accent/15 px-1.5 py-0.5 align-middle text-[10px] uppercase tracking-wider text-accent">
                        Core
                      </span>
                    )}
                  </h3>
                  <ul className="mt-4 space-y-2">
                    {group.items.map((item) => (
                      <li key={item} className="flex items-start gap-2 text-sm text-muted">
                        <span className="mt-[7px] h-1 w-1 shrink-0 rotate-45 bg-accent" />
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

      {/* ---------- 方法论 ---------- */}
      <section className="border-t border-line">
        <div className="mx-auto max-w-6xl px-5 py-20 md:px-8 md:py-28">
          <Reveal>
            <div className="grid gap-6 md:grid-cols-[1fr_1.4fr] md:items-end">
              <div>
                <p className="flex items-center gap-3 text-xs uppercase tracking-[0.25em] text-faint">
                  <span className="text-accent">03</span>
                  <span className="h-px w-10 bg-line" />
                  Methodology
                </p>
                <h2 className="mt-4 font-display text-3xl font-bold md:text-4xl">
                  方法论沉淀
                </h2>
              </div>
              <p className="text-sm leading-relaxed text-muted md:text-base">
                {METHODOLOGY.description}
              </p>
            </div>
          </Reveal>

          <div className="mt-12 divide-y divide-line border-y border-line">
            {METHODOLOGY.blocks.map((block, i) => (
              <Reveal key={block.index} delay={i * 0.05}>
                <div className="group grid items-baseline gap-2 py-6 transition-colors hover:bg-surface/60 md:grid-cols-[80px_1fr_2fr] md:gap-8 md:py-8">
                  <span className="text-outline font-display text-4xl font-bold transition-all group-hover:text-accent md:text-5xl">
                    {block.index}
                  </span>
                  <div>
                    <h3 className="font-display text-xl font-semibold transition-colors group-hover:text-accent-soft">
                      {block.name}
                    </h3>
                    <p className="mt-1 text-xs uppercase tracking-[0.2em] text-faint">
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

      {/* ---------- 图片库预览 ---------- */}
      <section className="mx-auto max-w-6xl px-5 py-20 md:px-8 md:py-28">
        <Reveal>
          <div className="flex items-end justify-between">
            <div>
              <p className="flex items-center gap-3 text-xs uppercase tracking-[0.25em] text-faint">
                <span className="text-accent">04</span>
                <span className="h-px w-10 bg-line" />
                Project Archive
              </p>
              <h2 className="mt-4 font-display text-3xl font-bold md:text-4xl">项目实录</h2>
            </div>
            <Link
              href="/gallery"
              className="group hidden items-center gap-1.5 text-sm text-muted transition-colors hover:text-ivory md:flex"
            >
              浏览全部实录
              <ArrowUpRight size={15} className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </Link>
          </div>
        </Reveal>

        <div className="mt-10 grid grid-cols-2 gap-4 md:grid-cols-4">
          {GALLERY.filter((g) => g.src.includes("real-")).slice(0, 4).map((item, i) => (
            <Reveal key={item.src} delay={i * 0.06}>
              <Link href="/gallery" className="group relative block aspect-[4/5] overflow-hidden border border-line">
                <FadeImage
                  src={item.src}
                  alt={item.alt}
                  fill
                  sizes="(max-width: 768px) 50vw, 25vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                <p className="absolute bottom-3 left-3 translate-y-2 text-sm font-medium opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                  {item.title}
                </p>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ---------- CTA ---------- */}
      <section className="border-t border-line">
        <div className="mx-auto max-w-6xl px-5 py-20 text-center md:px-8 md:py-28">
          <Reveal>
            <p className="text-xs uppercase tracking-[0.25em] text-faint">
              <span className="text-accent">05</span> — Next Step
            </p>
            <h2 className="mx-auto mt-6 max-w-3xl font-display text-3xl font-bold leading-tight md:text-5xl">
              一起构建
              <span className="text-accent">下一代 AI 产品</span>
            </h2>
            <p className="mx-auto mt-5 max-w-xl text-muted">
              如果你正在寻找对 AI 有完整实战认知的产品经理，欢迎与我聊聊。
            </p>
            <Link
              href="/contact"
              className="group mt-9 inline-flex items-center gap-2 bg-ivory px-8 py-4 font-medium text-ink transition-colors hover:bg-accent-soft"
            >
              与我联系
              <ArrowRight size={17} className="transition-transform group-hover:translate-x-1" />
            </Link>
          </Reveal>
        </div>
      </section>
    </>
  );
}
