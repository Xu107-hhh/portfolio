import { MARQUEE_ITEMS } from "@/lib/constants";

export default function Marquee() {
  const items = [...MARQUEE_ITEMS, ...MARQUEE_ITEMS];
  return (
    <div className="overflow-hidden border-y border-line bg-surface py-4">
      <div className="animate-marquee flex w-max items-center">
        {items.map((item, i) => (
          <span key={i} className="flex items-center">
            <span className="font-display text-sm uppercase tracking-widest text-muted">
              {item}
            </span>
            <span className="mx-6 h-1.5 w-1.5 rotate-45 bg-accent" />
          </span>
        ))}
      </div>
    </div>
  );
}
