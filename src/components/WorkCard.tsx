import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import FadeImage from "@/components/FadeImage";
import type { CaseStudy } from "@/lib/constants";

export default function WorkCard({ study, large = false }: { study: CaseStudy; large?: boolean }) {
  return (
    <Link
      href={`/works/${study.slug}`}
      className="group block border border-line bg-surface transition-colors duration-300 hover:border-accent/40"
    >
      <div className={`relative overflow-hidden ${large ? "aspect-[16/9]" : "aspect-[16/10]"}`}>
        {study.cover && (
          <FadeImage
            src={study.cover}
            alt={study.title}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-ink/60 to-transparent opacity-60" />
        <span className="absolute left-4 top-4 border border-ivory/20 bg-ink/60 px-2.5 py-1 text-[11px] uppercase tracking-widest text-ivory backdrop-blur-sm">
          {study.category}
        </span>
      </div>

      <div className="p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="font-display text-xl font-semibold leading-snug transition-colors group-hover:text-accent-soft">
              {study.title}
            </h3>
            <p className="mt-1.5 text-sm text-muted">{study.tagline}</p>
          </div>
          <span className="mt-1 flex h-9 w-9 shrink-0 items-center justify-center border border-line text-muted transition-all duration-300 group-hover:border-accent group-hover:bg-accent group-hover:text-ink">
            <ArrowUpRight size={16} />
          </span>
        </div>

        <div className="mt-5 flex flex-wrap gap-x-5 gap-y-1 border-t border-line pt-4">
          {study.impact.slice(0, 3).map((m) => (
            <span key={m.label} className="text-xs text-faint">
              <span className="font-display font-semibold text-ivory">{m.value}</span>
              <span className="ml-1.5">{m.label}</span>
            </span>
          ))}
        </div>
      </div>
    </Link>
  );
}
