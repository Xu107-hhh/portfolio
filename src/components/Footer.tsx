import Link from "next/link";
import { Mail, Phone, FileText, MapPin } from "lucide-react";
import { GithubIcon } from "@/components/GithubIcon";
import { PERSONAL, NAV_LINKS } from "@/lib/constants";

export default function Footer() {
  return (
    <footer className="border-t border-line">
      <div className="mx-auto max-w-6xl px-5 py-14 md:px-8">
        <div className="grid gap-10 md:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            <p className="font-display text-xl font-semibold">
              {PERSONAL.nameEn}
            </p>
            <p className="mt-2 max-w-sm text-sm leading-relaxed text-muted">
              {PERSONAL.roleDetail}——把前沿模型能力，翻译成可落地的产品体验。
            </p>
            <p className="mt-4 flex items-center gap-1.5 text-sm text-muted">
              <MapPin size={14} className="text-accent" />
              {PERSONAL.location}
            </p>
          </div>

          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-faint">导航</p>
            <ul className="mt-4 space-y-2.5">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted transition-colors hover:text-ivory"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-faint">社交</p>
            <ul className="mt-4 space-y-2.5">
              {[
                { icon: GithubIcon, label: "GitHub", href: "https://github.com/" },
                { icon: Mail, label: PERSONAL.email, href: `mailto:${PERSONAL.email}` },
                { icon: Phone, label: PERSONAL.phone, href: `tel:${PERSONAL.phone}` },
                { icon: FileText, label: "下载简历", href: PERSONAL.resume },
              ].map((item) => (
                <li key={item.label}>
                  <a
                    href={item.href}
                    className="group flex items-center gap-2.5 text-sm text-muted transition-colors hover:text-ivory"
                  >
                    <item.icon size={14} className="text-faint transition-colors group-hover:text-accent" />
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-start justify-between gap-3 border-t border-line pt-6 text-xs text-faint md:flex-row md:items-center">
          <p>© 2026 {PERSONAL.name} · {PERSONAL.role}</p>
          <p className="font-display tracking-widest">DESIGNED & BUILT WITH NEXT.JS</p>
        </div>
      </div>
    </footer>
  );
}
