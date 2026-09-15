"use client";

import { memo, useEffect } from "react";
import type { PoseName } from "./pixelRig";
import { FRAME_SRC, POSE_TO_FRAME, preloadPetFrames, type FrameKey } from "./petFrames";

type Props = {
  /** 直接指定显示帧（优先） */
  frame?: FrameKey;
  /** 或传行为动作，内部映射到帧（兼容旧调用） */
  pose?: PoseName;
  className?: string;
};

/**
 * 小鑫精灵：只负责把当前帧的 PNG 画出来。
 * 呼吸 / 走路起伏 / 翻转 / 落地挤压由外层 .pet-flip/.pet-breathe/.pet-land 承担，
 * ? / Zzz 等情绪符号由 DesktopPet 在翻转层之外叠加（避免被镜像）。
 */
function PetSprite({ frame, pose = "idle", className = "" }: Props) {
  const key: FrameKey = frame ?? POSE_TO_FRAME[pose] ?? "idle";

  useEffect(() => {
    preloadPetFrames();
  }, []);

  return (
    // 复用 .pet-svg 的尺寸与投影约定；.pet-img 负责 <img> 自身的防拖拽/裁切
    <span className={`pet-svg pet-sprite ${className}`}>
      <img
        className="pet-img"
        src={FRAME_SRC[key]}
        alt=""
        draggable={false}
        aria-hidden="true"
      />
    </span>
  );
}

export default memo(PetSprite);
