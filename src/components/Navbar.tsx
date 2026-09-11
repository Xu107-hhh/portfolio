"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu, X, ArrowUpRight } from "lucide-react";
import FadeImage from "@/components/FadeImage";
import { NAV_LINKS, PERSONAL } from "@/lib/constants";

export default function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <header className="fixed inset-x-0 top-3 z-50 px-3 sm:px-4">
      <nav className="mx-auto flex h-14 max-w-4xl items-center justify-between gap-3 rounded-full border border-line bg-ink/70 pl-2 pr-2 backdrop-blur-xl">
        <Link href="/" className="group flex min-w-0 items-center gap-2.5">
          <span className="relative h-9 w-9 shrink-0 overflow-hidden rounded-full border border-line">
            <FadeImage
              src={PERSONAL.avatar}
              alt={PERSONAL.name}
              fill
              sizes="36px"
              className="object-cover"
            />
          </span>
          <span className="truncate font-display text-sm font-bold tracking-wide text-ivory">
            {PERSONAL.name}
          </span>
          <span className="hidden rounded-full border border-line px-2 py-0.5 text-[10px] uppercase tracking-wider text-faint lg:inline">
            AI PM
          </span>
        </Link>

        <ul className="hidden items-center gap-1 md:flex">
          {NAV_LINKS.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className={`rounded-full px-3.5 py-1.5 text-sm transition-colors ${
                  isActive(link.href)
                    ? "bg-elevated text-ivory"
                    : "text-muted hover:text-ivory"
                }`}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-2">
          <Link
            href="/contact"
            className="hidden items-center gap-1.5 rounded-full bg-ivory px-4 py-2 text-sm font-medium text-ink transition-colors hover:bg-accent hover:text-ivory md:flex"
          >
            联系我
            <ArrowUpRight size={14} />
          </Link>
          <button
            onClick={() => setOpen(!open)}
            aria-label="打开菜单"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-line text-ivory md:hidden"
          >
            {open ? <X size={17} /> : <Menu size={17} />}
          </button>
        </div>
      </nav>

      {open && (
        <div className="mx-auto mt-2 max-w-4xl rounded-2xl border border-line bg-ink/95 p-3 backdrop-blur-xl md:hidden">
          <ul className="space-y-0.5">
            {NAV_LINKS.map((link, i) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={`flex items-center justify-between rounded-xl px-4 py-3 text-base ${
                    isActive(link.href) ? "bg-elevated text-accent-soft" : "text-ivory"
                  }`}
                >
                  <span>{link.label}</span>
                  <span className="text-xs text-faint">0{i + 1}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </header>
  );
}
