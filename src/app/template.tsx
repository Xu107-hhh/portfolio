"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";

// 路由切换时的淡入上移动效；template.tsx 保证每次导航都重新挂载
export default function Template({ children }: { children: ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: [0.21, 0.5, 0.2, 1] }}
    >
      {children}
    </motion.div>
  );
}
