"use client";

import Image from "next/image";
import { useState } from "react";

// GitHub Pages 子路径部署：unoptimized 模式下 next/image 不会自动给
// public 目录的字符串 src 加 basePath，这里统一补前缀。
const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

type FadeImageProps = React.ComponentProps<typeof Image>;

export default function FadeImage({ className = "", src, ...props }: FadeImageProps) {
  const [loaded, setLoaded] = useState(false);
  const resolvedSrc =
    typeof src === "string" && src.startsWith("/") ? `${BASE_PATH}${src}` : src;
  return (
    <Image
      {...props}
      src={resolvedSrc}
      onLoad={() => setLoaded(true)}
      className={`${className} img-fade ${loaded ? "img-loaded" : ""}`}
    />
  );
}
