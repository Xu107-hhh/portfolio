import type { Metadata } from "next";
import { IBM_Plex_Mono, Noto_Serif_SC } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BackToTop from "@/components/BackToTop";
import { PERSONAL } from "@/lib/constants";

const notoSerifSC = Noto_Serif_SC({
  subsets: ["latin"],
  weight: ["700", "900"],
  variable: "--font-noto-serif",
  display: "swap",
});

const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-plex-mono",
  display: "swap",
});

const SITE_URL = "https://xu107-hhh.github.io/portfolio";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "许隆鑫 — AI 产品经理",
    template: "%s | 许隆鑫 · AI 产品经理",
  },
  description:
    "许隆鑫的个人作品集网站：AI 产品经理，专注从模型评测到产品落地。精选案例、真实项目实录、个人履历与联系方式。",
  keywords: ["AI 产品经理", "作品集", "Portfolio", "Prompt Engineering", "AI Agent", "许隆鑫"],
  openGraph: {
    type: "website",
    locale: "zh_CN",
    url: SITE_URL,
    siteName: "许隆鑫 · AI 产品经理作品集",
    title: "许隆鑫 — AI 产品经理",
    description:
      "从模型评测到产品落地：精选 AI 产品案例拆解、真实项目实录与完整履历。",
  },
  twitter: {
    card: "summary_large_image",
    title: "许隆鑫 — AI 产品经理",
    description:
      "从模型评测到产品落地：精选 AI 产品案例拆解、真实项目实录与完整履历。",
  },
};

const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "许隆鑫",
  alternateName: "Xu Longxin",
  jobTitle: "AI Product Manager",
  email: "mailto:1079466805@qq.com",
  telephone: "+86 16603798810",
  url: SITE_URL,
  address: { "@type": "PostalAddress", addressCountry: "CN" },
  alumniOf: [
    { "@type": "CollegeOrUniversity", name: "天津师范大学" },
    { "@type": "CollegeOrUniversity", name: "郑州航空工业管理学院" },
  ],
  knowsAbout: [
    "Prompt Engineering",
    "AI Agent",
    "RAG",
    "Multi-Agent Systems",
    "大模型评测",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" className={`${notoSerifSC.variable} ${plexMono.variable}`}>
      <body className="bg-ink font-sans text-ivory antialiased">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
        />
        <Navbar />
        <main className="pt-24">{children}</main>
        <Footer />
        <BackToTop />
      </body>
    </html>
  );
}
