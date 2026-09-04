import type { Metadata } from "next";
import { Mail, Phone, FileText, MapPin, Clock } from "lucide-react";
import { GithubIcon } from "@/components/GithubIcon";
import PageHeader from "@/components/PageHeader";
import Reveal from "@/components/Reveal";
import ContactForm from "@/components/ContactForm";
import { PERSONAL } from "@/lib/constants";

export const metadata: Metadata = {
  title: "联系我",
  description:
    "联系许隆鑫 — AI 产品经理（2027 届校招 · 应届生）。邮箱、电话、GitHub 与简历下载。",
};

const CONTACT_CARDS = [
  {
    icon: Mail,
    label: "Email",
    value: PERSONAL.email,
    href: `mailto:${PERSONAL.email}`,
  },
  {
    icon: Phone,
    label: "Phone",
    value: PERSONAL.phone,
    href: `tel:${PERSONAL.phone}`,
  },
  {
    icon: MapPin,
    label: "Location",
    value: PERSONAL.location,
    href: undefined,
  },
  {
    icon: Clock,
    label: "Status",
    value: PERSONAL.available,
    href: undefined,
  },
];

const SOCIAL_LINKS = [
  {
    icon: GithubIcon,
    label: "GitHub",
    desc: "代码与开源项目",
    href: "https://github.com/",
  },
  {
    icon: Mail,
    label: "Email",
    desc: "最快响应，24h 内回复",
    href: `mailto:${PERSONAL.email}`,
  },
  {
    icon: FileText,
    label: "简历下载",
    desc: "AI 产品经理 · 一页 PDF",
    href: PERSONAL.resume,
  },
];

export default function ContactPage() {
  return (
    <>
      <PageHeader
        index="04"
        eyebrow="Get in Touch"
        title="联系我"
        description="无论是一个 AI 产品的机会、一次案例交流，还是一句「你好」——都欢迎。"
      />

      <section className="mx-auto max-w-6xl px-5 py-16 md:px-8 md:py-24">
        <div className="grid gap-12 lg:grid-cols-[1.2fr_1fr]">
          <div>
            <Reveal>
              <h2 className="font-display text-2xl font-bold leading-snug md:text-3xl">
                期待与关注
                <span className="text-accent">AI 产品</span>
                的你同行。
              </h2>
            </Reveal>

            <Reveal delay={0.06}>
              <div className="mt-8 grid gap-px border border-line bg-line sm:grid-cols-2">
                {CONTACT_CARDS.map((card) => {
                  const inner = (
                    <>
                      <card.icon size={18} className="text-accent" />
                      <div>
                        <p className="text-[10px] uppercase tracking-[0.2em] text-faint">
                          {card.label}
                        </p>
                        <p className="mt-1 text-sm font-medium text-ivory">{card.value}</p>
                      </div>
                    </>
                  );
                  return card.href ? (
                    <a
                      key={card.label}
                      href={card.href}
                      className="flex items-start gap-4 bg-ink p-5 transition-colors hover:bg-surface"
                    >
                      {inner}
                    </a>
                  ) : (
                    <div key={card.label} className="flex items-start gap-4 bg-ink p-5">
                      {inner}
                    </div>
                  );
                })}
              </div>
            </Reveal>

            <Reveal delay={0.1}>
              <p className="mt-12 text-xs uppercase tracking-[0.25em] text-faint">
                Social Links
              </p>
              <ul className="mt-4 space-y-px bg-line">
                {SOCIAL_LINKS.map((s) => (
                  <li key={s.label}>
                    <a
                      href={s.href}
                      className="group flex items-center justify-between bg-ink p-5 transition-colors hover:bg-surface"
                    >
                      <span className="flex items-center gap-4">
                        <s.icon size={18} className="text-accent" />
                        <span>
                          <span className="block text-sm font-medium text-ivory">{s.label}</span>
                          <span className="block text-xs text-muted">{s.desc}</span>
                        </span>
                      </span>
                      <span className="text-faint transition-all duration-300 group-hover:translate-x-1 group-hover:text-accent">
                        →
                      </span>
                    </a>
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>

          <Reveal delay={0.12}>
            <ContactForm />
          </Reveal>
        </div>
      </section>
    </>
  );
}
