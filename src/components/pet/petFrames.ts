import type { PoseName } from "./pixelRig";

/**
 * 小鑫 · 豆包生图精灵帧
 * ---------------------------------------------------------------------------
 * 视觉素材来自豆包按用户 IP「江海阔」生成的 Q 版立绘，经 pet-lab/gen/key_pet.py
 * 绿幕抠图 + 统一身高/底部对齐后输出到 /public/pet/*.png（320×320 透明底）。
 *
 * 行为层（usePetBrain）仍用更细的 13 个 PoseName 描述动作意图，
 * 这里负责把「动作意图 / 问答阶段」收敛成实际要显示的 7 张图。
 */

export type FrameKey =
  | "idle" // 待机
  | "waiting" // 待输入（招手/倾听）
  | "thinking" // 思考（歪头托腮 + ?）
  | "working" // 生成中（低头敲笔记本）
  | "done" // 完成（举手跳）
  | "failed" // 出错（螺旋眼扶额）
  | "sleeping"; // 打盹（闭眼 + Zzz）

export const FRAME_ORDER: FrameKey[] = [
  "idle",
  "waiting",
  "thinking",
  "working",
  "done",
  "failed",
  "sleeping",
];

export const FRAME_SRC: Record<FrameKey, string> = {
  idle: "/pet/idle.png",
  waiting: "/pet/waiting.png",
  thinking: "/pet/thinking.png",
  working: "/pet/working.png",
  done: "/pet/done.png",
  failed: "/pet/failed.png",
  sleeping: "/pet/sleeping.png",
};

/**
 * 精灵外接盒（行为层坐标系单位）。
 * 生图帧是正方形，这里也用正方形，避免 <img> 被非方形盒子拉变形。
 * 历史像素骨架是 30×34（见 pixelRig.VB），改正方形后角色高度基本不变、左右更宽松。
 */
export const PET_BOX = { w: 34, h: 34 } as const;

/** 行为动作意图 → 显示帧 */
export const POSE_TO_FRAME: Record<PoseName, FrameKey> = {
  idle: "idle",
  walk: "idle", // 走路靠 .pet-breathe 起伏 + 朝向，站姿帧即可
  wave: "waiting",
  cheer: "done",
  thumb: "done",
  think: "thinking",
  hmm: "thinking",
  idea: "done",
  focus: "working",
  sip: "idle",
  sleep: "sleeping",
  listen: "waiting",
  point: "waiting",
};

/** 问答阶段（ChatPanel 回传）→ 显示帧；null 表示没有进行中的问答 */
export type ChatPhase = "thinking" | "working" | "done" | "failed" | null;

export const CHAT_PHASE_TO_FRAME: Record<NonNullable<ChatPhase>, FrameKey> = {
  thinking: "thinking",
  working: "working",
  done: "done",
  failed: "failed",
};

let preloaded = false;

/** 客户端预载全部帧，避免状态切换时图片闪一下（只执行一次） */
export function preloadPetFrames() {
  if (preloaded || typeof window === "undefined") return;
  preloaded = true;
  FRAME_ORDER.forEach((k) => {
    const img = new Image();
    img.src = FRAME_SRC[k];
  });
}
