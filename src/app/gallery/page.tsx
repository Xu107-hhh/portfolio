import type { Metadata } from "next";
import PageHeader from "@/components/PageHeader";
import GalleryGrid from "@/components/GalleryGrid";

export const metadata: Metadata = {
  title: "项目实录",
  description:
    "许隆鑫的真实项目界面合集：动画生产平台、SciAgent 多智能体系统、大模型测评报告、产业情报报告、竞赛与课程项目的实际截图，支持按项目筛选与大图预览。",
};

export default function GalleryPage() {
  return (
    <>
      <PageHeader
        index="03"
        eyebrow="Project Archive"
        title="项目实录"
        description="26 张真实界面与文档截图——全部来自本人交付的系统、报告与项目作品，无任何示意图或素材图。点击进入大图预览，支持键盘 ← → 切换。"
      />
      <section className="mx-auto max-w-6xl px-5 py-14 md:px-8 md:py-20">
        <GalleryGrid />
      </section>
    </>
  );
}
