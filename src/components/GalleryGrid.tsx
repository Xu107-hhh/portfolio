"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Expand, X } from "lucide-react";
import FadeImage from "@/components/FadeImage";
import {
  GALLERY,
  GALLERY_CATEGORIES,
  type GalleryCategory,
  type GalleryItem,
} from "@/lib/constants";

type Filter = GalleryCategory | "all";

export default function GalleryGrid() {
  const [filter, setFilter] = useState<Filter>("all");
  const [active, setActive] = useState<number | null>(null);

  const filtered = useMemo(
    () => GALLERY.filter((g) => filter === "all" || g.category === filter),
    [filter]
  );

  const close = useCallback(() => setActive(null), []);
  const step = useCallback(
    (dir: 1 | -1) =>
      setActive((i) => (i === null ? null : (i + dir + filtered.length) % filtered.length)),
    [filtered.length]
  );

  useEffect(() => {
    if (active === null) return;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight") step(1);
      if (e.key === "ArrowLeft") step(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [active, close, step]);

  const current: GalleryItem | null = active !== null ? filtered[active] : null;
  const categoryLabel = (key: GalleryCategory) =>
    GALLERY_CATEGORIES.find((c) => c.key === key)?.label ?? "";

  return (
    <>
      {/* 筛选 */}
      <div className="flex flex-wrap gap-2">
        {GALLERY_CATEGORIES.map((c) => (
          <button
            key={c.key}
            onClick={() => {
              setFilter(c.key);
              setActive(null);
            }}
            className={`border px-4 py-2 text-sm transition-colors ${
              filter === c.key
                ? "border-accent bg-accent text-ink"
                : "border-line text-muted hover:border-accent/50 hover:text-ivory"
            }`}
          >
            {c.label}
            <span className="ml-2 font-display text-xs opacity-60">
              {c.key === "all" ? GALLERY.length : GALLERY.filter((g) => g.category === c.key).length}
            </span>
          </button>
        ))}
      </div>

      {/* 网格 */}
      <motion.div layout className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
        <AnimatePresence mode="popLayout">
          {filtered.map((item, i) => (
            <motion.button
              layout
              key={item.src}
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.35, ease: "easeOut" }}
              onClick={() => setActive(i)}
              className={`group relative overflow-hidden border border-line text-left ${
                item.span2 ? "col-span-2 aspect-[8/5]" : "aspect-[4/5]"
              }`}
              aria-label={`查看大图：${item.title}`}
            >
              <FadeImage
                src={item.src}
                alt={item.alt}
                fill
                sizes={item.span2 ? "(max-width: 1024px) 100vw, 640px" : "(max-width: 768px) 50vw, 320px"}
                className="object-cover transition-transform duration-700 group-hover:scale-[1.05]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/10 to-transparent opacity-70 transition-opacity duration-300 group-hover:opacity-95" />
              <div className="absolute inset-x-0 bottom-0 p-4">
                <p className="text-[10px] uppercase tracking-[0.2em] text-accent-soft">
                  {categoryLabel(item.category)}
                </p>
                <p className="mt-1 font-display text-sm font-semibold md:text-base">{item.title}</p>
                <p className="mt-1 hidden text-xs leading-relaxed text-ivory/70 md:block">
                  {item.caption}
                </p>
              </div>
              <span className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center border border-ivory/20 bg-ink/50 text-ivory/80 opacity-0 backdrop-blur-sm transition-opacity duration-300 group-hover:opacity-100">
                <Expand size={14} />
              </span>
            </motion.button>
          ))}
        </AnimatePresence>
      </motion.div>

      {/* 灯箱 */}
      <AnimatePresence>
        {current && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-[100] flex flex-col bg-ink/95 backdrop-blur-md"
            onClick={close}
          >
            <div className="flex items-center justify-between px-5 py-4 md:px-8">
              <p className="font-display text-xs uppercase tracking-[0.25em] text-faint">
                {String((active ?? 0) + 1).padStart(2, "0")} / {String(filtered.length).padStart(2, "0")}
              </p>
              <button
                onClick={close}
                aria-label="关闭预览"
                className="flex h-10 w-10 items-center justify-center border border-line text-ivory transition-colors hover:border-accent hover:text-accent"
              >
                <X size={18} />
              </button>
            </div>

            <div
              className="relative mx-auto w-full max-w-5xl flex-1 px-5 md:px-8"
              onClick={(e) => e.stopPropagation()}
            >
              <motion.div
                key={current.src}
                initial={{ opacity: 0, scale: 0.985 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
                className="relative h-full max-h-[70vh] w-full overflow-hidden border border-line"
              >
                <FadeImage
                  src={current.src}
                  alt={current.alt}
                  fill
                  sizes="(max-width: 1024px) 100vw, 1024px"
                  className="object-contain"
                  priority
                />
              </motion.div>
            </div>

            <div
              className="mx-auto flex w-full max-w-5xl items-end justify-between gap-4 px-5 py-6 md:px-8"
              onClick={(e) => e.stopPropagation()}
            >
              <div>
                <p className="font-display text-lg font-semibold">{current.title}</p>
                <p className="mt-1 max-w-xl text-sm text-muted">{current.caption}</p>
              </div>
              <div className="flex shrink-0 gap-2">
                <button
                  onClick={() => step(-1)}
                  aria-label="上一张"
                  className="flex h-11 w-11 items-center justify-center border border-line text-ivory transition-colors hover:border-accent hover:text-accent"
                >
                  <ChevronLeft size={18} />
                </button>
                <button
                  onClick={() => step(1)}
                  aria-label="下一张"
                  className="flex h-11 w-11 items-center justify-center border border-line text-ivory transition-colors hover:border-accent hover:text-accent"
                >
                  <ChevronRight size={18} />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
