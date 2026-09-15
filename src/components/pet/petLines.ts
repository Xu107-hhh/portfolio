import type { PoseName } from "./pixelRig";

/**
 * 宠物台词库
 * ---------------------------------------------------------------------------
 * 纪律：台词只做「引路」，不承载事实结论。
 * 所有涉及数字、时间、成果的表述一律通过 `question` 交给知识库问答来回答，
 * 因为后端 KNOWLEDGE（edge-functions/api/chat.js）才是唯一事实源。
 * 这里只允许出现「结构性事实」（几组分区、几个精选、在哪个页面能看什么），
 * 且这些结构性事实必须与 src/lib/constants.ts 的实际数据一致。
 */

export type PetLine = {
  text: string;
  /** 带上它就出现「帮我问 →」，点了直接把这个问句发给知识库 */
  question?: string;
};

/** 按路由给的不同话题——宠物知道你在看哪一页 */
const ROUTE_LINES: Record<string, PetLine[]> = {
  "/": [
    {
      text: "首页这 3 个精选案例我都熟，要我挑一个讲讲吗？",
      question: "介绍一下科技前沿识别多智能体工作流系统（SciAgent）",
    },
    { text: "想快速了解的话，直接问我「实习中最有代表性的成果是什么」。" },
    { text: "点我一下，任何关于这份作品集的问题都能问。" },
  ],
  "/about": [
    {
      text: "这一页是他的履历和技能栈。要我先用一句话概括吗？",
      question: "他的技术栈和求职方向？",
    },
    { text: "教育背景、实习经历、关注方向都在这一页。" },
    { text: "想省时间的话，问我「他的技术栈和求职方向」。", question: "他的技术栈和求职方向？" },
  ],
  "/works": [
    {
      text: "作品页按经历阶段分了 5 组，实习交付那组是他主导的。要我讲讲吗？",
      question: "实习中最有代表性的成果是什么？",
    },
    { text: "每个案例都写了问题定义、策略路径和量化结果，可以直接问我某一项。" },
    {
      text: "想看点硬核的？问我多智能体那条线。",
      question: "介绍一下 SciAgent 多智能体项目",
    },
  ],
  "/gallery": [
    { text: "图库里都是真实项目的截图，没有放示意图。" },
    { text: "看到有意思的图，可以问我它是哪个项目里的。" },
  ],
  "/contact": [
    { text: "要联系他的话，邮箱、电话、简历 PDF 都在这一页。" },
    { text: "如果是招聘相关的问题，也可以先问问我。" },
  ],
};

const DEFAULT_LINES: PetLine[] = [
  { text: "点我一下，任何关于这份作品集的问题都能问。" },
  { text: "我是这份作品集的 AI 助手，实习、项目、技能都能问。" },
  { text: "犹豫问什么的话，试试问我他的求职方向。", question: "他的技术栈和求职方向？" },
];

/** 面板里默认展示的快捷问题 */
export const SEED_PROMPTS = [
  "实习中最有代表性的成果是什么？",
  "介绍一下 SciAgent 多智能体项目",
  "他的技术栈和求职方向？",
];

/** 面板头部的固定说明 */
export const PANEL_GREETING =
  "你好，我是许隆鑫作品集的 AI 助手。可以问我他的实习经历、项目案例、技能或求职意向。\n回答基于作品集公开内容生成，仅供参考，重要信息建议与本人直接确认。";

/** 按路由取一条台词（没有匹配就用默认池） */
export function pickLine(pathname: string, seed = Math.random()): PetLine {
  const routeKey = pathname.length > 1 ? pathname.replace(/\/$/, "") : "/";
  const pool =
    ROUTE_LINES[routeKey] ??
    (routeKey.startsWith("/works/") ? ROUTE_LINES["/works"] : undefined) ??
    DEFAULT_LINES;
  return pool[Math.floor(seed * pool.length) % pool.length];
}

/** 优先挑「能引导提问」的台词，用于主动搭话 */
export function pickGuidedLine(pathname: string, seed = Math.random()): PetLine {
  const routeKey = pathname.length > 1 ? pathname.replace(/\/$/, "") : "/";
  const pool = ROUTE_LINES[routeKey] ?? DEFAULT_LINES;
  const guided = pool.filter((l) => l.question);
  const from = guided.length ? guided : DEFAULT_LINES.filter((l) => l.question);
  return from[Math.floor(seed * from.length) % from.length];
}

/** 菜单里「换表情」用的中文标签 */
export const POSE_LABELS: Partial<Record<PoseName, string>> = {
  idle: "站着",
  wave: "打招呼",
  cheer: "冲一下",
  thumb: "点个赞",
  think: "思考中",
  hmm: "想不通",
  idea: "有想法",
  focus: "专注",
  sip: "喝咖啡",
  sleep: "打盹",
  point: "指方向",
};
