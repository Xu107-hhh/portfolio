import Reveal from "@/components/Reveal";

interface PageHeaderProps {
  index: string;
  eyebrow: string;
  title: string;
  description?: string;
}

export default function PageHeader({ index, eyebrow, title, description }: PageHeaderProps) {
  return (
    <header className="bg-grid border-b border-line">
      <div className="mx-auto max-w-6xl px-5 pb-16 pt-20 md:px-8 md:pb-20 md:pt-24">
        <Reveal>
          <p className="flex items-center gap-3 text-xs uppercase tracking-[0.25em] text-faint">
            <span className="text-accent">{index}</span>
            <span className="h-px w-10 bg-line" />
            {eyebrow}
          </p>
        </Reveal>
        <Reveal delay={0.08}>
          <h1 className="mt-6 font-display text-4xl font-bold leading-tight tracking-tight md:text-6xl">
            {title}
          </h1>
        </Reveal>
        {description && (
          <Reveal delay={0.16}>
            <p className="mt-5 max-w-2xl text-base leading-relaxed text-muted md:text-lg">
              {description}
            </p>
          </Reveal>
        )}
      </div>
    </header>
  );
}
