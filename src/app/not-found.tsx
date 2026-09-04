import Link from "next/link";
import { ArrowLeft, Home } from "lucide-react";

export default function NotFound() {
  return (
    <section className="bg-grid flex min-h-[70vh] items-center">
      <div className="mx-auto max-w-6xl px-5 py-20 md:px-8">
        <p className="text-outline font-display text-8xl font-bold md:text-9xl">404</p>
        <h1 className="mt-6 font-display text-2xl font-bold md:text-3xl">
          这个页面还在构建中
        </h1>
        <p className="mt-3 max-w-md text-muted">
          你访问的地址不存在或已被移动——像一次未通过 G1 验证门的发布，先回到主线吧。
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href="/"
            className="inline-flex items-center gap-2 bg-accent px-5 py-3 text-sm font-medium text-ink transition-colors hover:bg-accent-soft"
          >
            <Home size={15} />
            返回首页
          </Link>
          <Link
            href="/works"
            className="inline-flex items-center gap-2 border border-line px-5 py-3 text-sm font-medium text-ivory transition-colors hover:border-accent hover:text-accent-soft"
          >
            <ArrowLeft size={15} />
            浏览作品
          </Link>
        </div>
      </div>
    </section>
  );
}
