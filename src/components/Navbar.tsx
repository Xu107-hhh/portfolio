"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu, X, ArrowUpRight } from "lucide-react";
import { NAV_LINKS } from "@/lib/constants";

export default function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-line bg-ink/75 backdrop-blur-xl">
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5 md:px-8">
        <Link href="/" className="group flex items-center gap-3">
          <span className="flex h-8 w-8 items-center justify-center bg-accent font-display text-sm font-bold text-ink transition-transform duration-300 group-hover:rotate-6">
            X
          </span>
          <span className="font-display text-sm font-semibold tracking-widest text-ivory">
            XU LONGXIN
          </span>
        </Link>

        <ul className="hidden items-center gap-7 md:flex">
          {NAV_LINKS.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className={`relative text-sm tracking-wide transition-colors ${
                  isActive(link.href) ? "text-ivory" : "text-muted hover:text-ivory"
                }`}
              >
                {link.label}
                <span
                  className={`absolute -bottom-1.5 left-0 h-px bg-accent transition-all duration-300 ${
                    isActive(link.href) ? "w-full" : "w-0"
                  }`}
                />
              </Link>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-3">
          <Link
            href="/contact"
            className="hidden items-center gap-1.5 bg-ivory px-4 py-2 text-sm font-medium text-ink transition-colors hover:bg-accent-soft md:flex"
          >
            联系我
            <ArrowUpRight size={15} />
          </Link>
          <button
            onClick={() => setOpen(!open)}
            aria-label="打开菜单"
            className="flex h-9 w-9 items-center justify-center border border-line text-ivory md:hidden"
          >
            {open ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </nav>

      {open && (
        <div className="border-t border-line bg-ink/95 backdrop-blur-xl md:hidden">
          <ul className="space-y-1 px-5 py-4">
            {NAV_LINKS.map((link, i) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={`flex items-center justify-between py-2.5 text-base ${
                    isActive(link.href) ? "text-accent" : "text-ivory"
                  }`}
                >
                  <span>{link.label}</span>
                  <span className="font-display text-xs text-faint">
                    0{i + 1}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </header>
  );
}
