/**
 * pixelRig — 桌面宠物的像素骨架
 * ---------------------------------------------------------------------------
 * 人设取自 IP「江海阔」正面像：黑短发斜刘海 + 深蓝连帽卫衣 + 白 T 领口
 * + 深色长裤 + 白球鞋。整套骨架是纯数据 + 纯函数，没有任何 DOM 依赖，
 * 因此可以安全地在服务端渲染阶段被引用（只在客户端被调用）。
 *
 * 分层：body / armL / armR / legL / legR / prop
 * 手臂与腿单独成层，是为了让 CSS 只做「整数位移」的帧动画——像素画里
 * 抬腿、挥手本来就是换帧，用位移实现既正宗又不用碰 SVG 那套
 * transform-origin 的浏览器差异。
 *
 * 绘图纪律（改之前先读，这几条决定了成品好不好看）：
 *  1. 横向中心线 HC = 17（整数）。每个区间写成 `fill(a, y, w, h)` 且满足
 *     `a + w - 1 = 34 - a`，左右严格镜像。
 *  2. 手臂与躯干之间留 1 列空位（x11 / x23），双腿之间留 1 列空位（x17）。
 *     这些空位会被自动描边填成暗色，形成「肢体分离的暗缝」——像素画里让
 *     手臂、腿看得出是单独部件，靠的就是这道缝，别为省宽度把它们贴上去。
 *  3. 描边比底色暗得有限，所以裤子 / 鞋要用比背景亮的中性色，否则剪影糊掉。
 *
 * 调参台：pet-lab/prototype/pet-rig.js（同一套几何，改一边记得同步另一边）
 */

export const RIG_W = 34;
export const RIG_H = 40;

/** 身体横向中心线（整数，所有区间以它镜像） */
export const HC = 17;

/** 固定视口：不随姿态浮动，换道具时宠物不会跳位置 */
export const VB = { x: 2, y: 4, w: 30, h: 34 } as const;
export const VIEWBOX = `${VB.x} ${VB.y} ${VB.w} ${VB.h}`;

export const C = {
  hair: "#191a24",
  hairHi: "#3a3d52",
  skin: "#f4cba6",
  blush: "#ef9f83",
  mouth: "#b8564a",
  eye: "#191a24",
  hoodie: "#3b5bdb",
  hoodieDk: "#2c46ae",
  hoodieHi: "#6a86f4",
  tee: "#f4f1ea",
  string: "#f2efe9",
  pants: "#39415e",
  shoe: "#f0ede4",
  shoeDk: "#b3ada0",
  glow: "#a3b8ff",
  outline: "#15151d",
  bulb: "#ffd166",
  cup: "#f4f1ea",
  cupDk: "#b3ada0",
  coffee: "#7a4a24",
  laptop: "#232838",
  laptopHi: "#8fa8ff",
} as const;

export const LAYERS = ["body", "armL", "armR", "legL", "legR", "prop"] as const;
export type LayerName = (typeof LAYERS)[number];

type Cell = string | null;
type Tag = LayerName | null;

export type Pixel = { x: number; y: number; c: string };

/* ------------------------------------------------------------------ *
 * 网格与图层
 * ------------------------------------------------------------------ */

const emptyGrid = <T,>(v: T) =>
  Array.from({ length: RIG_H }, () => Array<T>(RIG_W).fill(v));

type Canvas = { px: Cell[][]; tag: Tag[][] };

const makeCanvas = (): Canvas => ({ px: emptyGrid<Cell>(null), tag: emptyGrid<Tag>(null) });

function put(cv: Canvas, x: number, y: number, c: string, tag: LayerName) {
  if (x < 0 || y < 0 || x >= RIG_W || y >= RIG_H) return;
  cv.px[y][x] = c;
  cv.tag[y][x] = tag;
}

function fill(
  cv: Canvas,
  x: number,
  y: number,
  w: number,
  h: number,
  c: string,
  tag: LayerName = "body"
) {
  for (let yy = y; yy < y + h; yy++) for (let xx = x; xx < x + w; xx++) put(cv, xx, yy, c, tag);
}

/** 自动描边：紧邻实心像素的空格填 outline，图层标签继承邻居（描边跟着层一起动） */
function outline(cv: Canvas): Canvas {
  const px = emptyGrid<Cell>(null);
  const tag = emptyGrid<Tag>(null);
  const nb = (x: number, y: number) =>
    [
      [x, y - 1],
      [x, y + 1],
      [x - 1, y],
      [x + 1, y],
    ] as const;
  for (let y = 0; y < RIG_H; y++) {
    for (let x = 0; x < RIG_W; x++) {
      if (cv.px[y][x]) {
        px[y][x] = cv.px[y][x];
        tag[y][x] = cv.tag[y][x];
        continue;
      }
      for (const [nx, ny] of nb(x, y)) {
        if (ny < 0 || ny >= RIG_H || nx < 0 || nx >= RIG_W) continue;
        if (!cv.px[ny][nx]) continue;
        px[y][x] = C.outline;
        tag[y][x] = cv.tag[ny][nx];
        break;
      }
    }
  }
  return { px, tag };
}

/* ------------------------------------------------------------------ *
 * 五官
 * ------------------------------------------------------------------ */

/** 左右眼球锚点（3×3 盒子的左上角），镜像于 HC */
const EYE_BOX: readonly [number, number][] = [
  [13, 16],
  [19, 16],
];

type EyeKind = "open" | "blink" | "closed" | "happy" | "wide" | "star" | "half" | "lookL" | "lookR";

function drawEyes(cv: Canvas, kind: EyeKind) {
  switch (kind) {
    case "blink":
    case "closed":
      for (const [ox, oy] of EYE_BOX) fill(cv, ox, oy + 2, 3, 1, C.eye);
      break;
    case "happy": // 上弧 ^ 笑眼
      for (const [ox, oy] of EYE_BOX) {
        fill(cv, ox, oy + 2, 1, 1, C.eye);
        fill(cv, ox + 1, oy + 1, 1, 1, C.eye);
        fill(cv, ox + 2, oy + 2, 1, 1, C.eye);
      }
      break;
    case "wide": // 睁大（惊讶 / 兴奋）
      for (const [ox, oy] of EYE_BOX) fill(cv, ox, oy, 3, 2, C.eye);
      break;
    case "star": // 星星眼
      for (const [ox, oy] of EYE_BOX) {
        fill(cv, ox + 1, oy, 1, 1, C.glow);
        fill(cv, ox, oy + 1, 3, 1, C.glow);
        fill(cv, ox + 1, oy + 2, 1, 1, C.glow);
      }
      break;
    case "half": // 半眯（专注 / 淡定）
      for (const [ox, oy] of EYE_BOX) fill(cv, ox, oy + 1, 3, 2, C.eye);
      break;
    case "lookL":
      for (const [ox, oy] of EYE_BOX) fill(cv, ox, oy + 1, 2, 2, C.eye);
      break;
    case "lookR":
      for (const [ox, oy] of EYE_BOX) fill(cv, ox + 1, oy + 1, 2, 2, C.eye);
      break;
    case "open":
    default:
      // 2×2 实心眼 + 1px 高光，是「有神」的关键
      for (const [ox, oy] of EYE_BOX) {
        fill(cv, ox, oy + 1, 2, 2, C.eye);
        put(cv, ox + 1, oy + 1, "#ffffff", "body");
      }
      break;
  }
}

type MouthKind = "smile" | "open" | "grin" | "flat" | "o";

function drawMouth(cv: Canvas, kind: MouthKind) {
  switch (kind) {
    case "open":
      fill(cv, 15, 20, 5, 2, C.mouth);
      break;
    case "grin":
      fill(cv, 15, 20, 5, 1, C.mouth);
      fill(cv, 16, 21, 3, 1, C.mouth);
      break;
    case "flat":
      fill(cv, 16, 20, 3, 1, C.mouth);
      break;
    case "o":
      fill(cv, 16, 20, 3, 2, C.mouth);
      break;
    case "smile":
    default:
      fill(cv, 16, 20, 3, 1, C.mouth);
      fill(cv, 15, 21, 1, 1, C.mouth);
      fill(cv, 18, 21, 1, 1, C.mouth);
      break;
  }
}

/* ------------------------------------------------------------------ *
 * 身体
 * ------------------------------------------------------------------ */

function drawHead(cv: Canvas) {
  fill(cv, 12, 14, 11, 8, C.skin); // 脸 x12-22 / y14-21
  fill(cv, 14, 10, 7, 1, C.hair); // 发顶
  fill(cv, 13, 11, 9, 1, C.hair);
  fill(cv, 12, 12, 11, 2, C.hair); // 主发 y12-13
  fill(cv, 12, 14, 8, 1, C.hair); // 左长刘海 → x12-19
  fill(cv, 22, 14, 1, 1, C.hair); // 右短刘海 → 露额头 x20-21
  fill(cv, 12, 14, 1, 3, C.hair); // 左鬓角
  fill(cv, 22, 14, 1, 3, C.hair); // 右鬓角
  fill(cv, 15, 10, 3, 1, C.hairHi); // 发顶高光
  fill(cv, 13, 19, 2, 1, C.blush); // 腮红
  fill(cv, 20, 19, 2, 1, C.blush);
}

function drawTorso(cv: Canvas) {
  fill(cv, 16, 22, 3, 2, C.skin); // 脖子
  fill(cv, 16, 22, 3, 1, C.tee); // 白 T 领口
  fill(cv, 13, 24, 9, 1, C.hoodie); // 肩线
  fill(cv, 12, 25, 11, 9, C.hoodie); // 卫衣主体 y25-33
  fill(cv, 12, 25, 2, 3, C.hoodieDk); // 帽褶（左肩）
  fill(cv, 21, 25, 2, 3, C.hoodieDk); // 帽褶（右肩）
  fill(cv, 15, 24, 3, 1, C.hoodieHi); // 肩部受光
  fill(cv, 16, 27, 1, 4, C.string); // 抽绳左
  fill(cv, 18, 27, 1, 4, C.string); // 抽绳右
  fill(cv, 14, 31, 7, 1, C.hoodieDk); // 口袋上沿
}

function drawLegs(cv: Canvas) {
  fill(cv, 13, 34, 4, 3, C.pants, "legL"); // 左腿 x13-16
  fill(cv, 18, 34, 4, 3, C.pants, "legR"); // 右腿 x18-21（中间 x17 留缝）
  fill(cv, 12, 37, 5, 1, C.shoe, "legL"); // 左鞋
  fill(cv, 18, 37, 5, 1, C.shoe, "legR"); // 右鞋
}

type ArmPose = "down" | "up" | "wave" | "chin" | "thumb" | "hold" | "point";

function drawArmL(cv: Canvas, pose: ArmPose) {
  switch (pose) {
    case "up":
      fill(cv, 9, 24, 2, 3, C.hoodie, "armL");
      fill(cv, 8, 21, 2, 3, C.hoodie, "armL");
      fill(cv, 7, 18, 2, 3, C.skin, "armL");
      return;
    case "thumb":
      fill(cv, 8, 24, 2, 2, C.hoodie, "armL");
      fill(cv, 9, 26, 2, 2, C.hoodie, "armL");
      fill(cv, 10, 28, 3, 2, C.skin, "armL");
      fill(cv, 12, 27, 1, 1, C.skin, "armL"); // 拇指
      return;
    case "hold":
      fill(cv, 10, 26, 2, 2, C.hoodie, "armL");
      fill(cv, 12, 29, 2, 2, C.hoodie, "armL");
      fill(cv, 14, 30, 2, 2, C.skin, "armL");
      return;
    default:
      // down：自然垂放
      fill(cv, 9, 25, 2, 6, C.hoodie, "armL");
      fill(cv, 9, 31, 2, 2, C.skin, "armL");
      return;
  }
}

function drawArmR(cv: Canvas, pose: ArmPose) {
  switch (pose) {
    case "wave":
      fill(cv, 24, 24, 2, 2, C.hoodie, "armR"); // 肩
      fill(cv, 25, 22, 2, 2, C.hoodie, "armR");
      fill(cv, 26, 20, 2, 2, C.hoodie, "armR");
      fill(cv, 26, 18, 2, 2, C.skin, "armR"); // 手掌
      return;
    case "up":
      fill(cv, 24, 24, 2, 3, C.hoodie, "armR");
      fill(cv, 25, 21, 2, 3, C.hoodie, "armR");
      fill(cv, 26, 18, 2, 3, C.skin, "armR");
      return;
    case "chin":
      // 托腮：手抬到下颌侧面，不挡住嘴
      fill(cv, 24, 25, 2, 2, C.hoodie, "armR");
      fill(cv, 24, 22, 2, 3, C.hoodie, "armR");
      fill(cv, 23, 21, 3, 2, C.skin, "armR");
      return;
    case "thumb":
      fill(cv, 24, 24, 2, 2, C.hoodie, "armR");
      fill(cv, 23, 26, 2, 2, C.hoodie, "armR");
      fill(cv, 21, 28, 3, 2, C.skin, "armR");
      fill(cv, 21, 27, 1, 1, C.skin, "armR"); // 拇指
      return;
    case "hold":
      fill(cv, 23, 26, 2, 2, C.hoodie, "armR");
      fill(cv, 21, 29, 2, 2, C.hoodie, "armR");
      fill(cv, 18, 30, 2, 2, C.skin, "armR");
      return;
    case "point":
      // 指向右上方
      fill(cv, 24, 24, 2, 2, C.hoodie, "armR");
      fill(cv, 25, 22, 2, 2, C.hoodie, "armR");
      fill(cv, 27, 21, 2, 2, C.hoodie, "armR");
      fill(cv, 29, 20, 2, 2, C.skin, "armR");
      return;
    default:
      // down：自然垂放
      fill(cv, 24, 25, 2, 6, C.hoodie, "armR");
      fill(cv, 24, 31, 2, 2, C.skin, "armR");
      return;
  }
}

/* ------------------------------------------------------------------ *
 * 道具 / 情绪符号（一律放在身体右侧或头顶，避免遮挡五官）
 * ------------------------------------------------------------------ */

type PropKind = "question" | "dots" | "bulb" | "zzz" | "sparkle" | "coffee" | "laptop" | null;

function drawProp(cv: Canvas, prop: PropKind) {
  switch (prop) {
    case "question":
      fill(cv, 28, 8, 2, 1, C.glow, "prop");
      fill(cv, 30, 9, 1, 2, C.glow, "prop");
      fill(cv, 29, 11, 1, 1, C.glow, "prop");
      fill(cv, 29, 13, 1, 1, C.glow, "prop"); // 问号的点
      break;
    case "dots":
      fill(cv, 27, 14, 1, 1, C.glow, "prop");
      fill(cv, 29, 14, 1, 1, C.glow, "prop");
      fill(cv, 31, 14, 1, 1, C.glow, "prop");
      break;
    case "bulb":
      fill(cv, 27, 6, 4, 3, C.bulb, "prop");
      fill(cv, 28, 9, 2, 1, C.bulb, "prop"); // 灯头
      fill(cv, 28, 5, 2, 1, C.bulb, "prop"); // 光线
      fill(cv, 25, 7, 1, 1, C.bulb, "prop");
      fill(cv, 32, 7, 1, 1, C.bulb, "prop");
      break;
    case "zzz":
      fill(cv, 27, 14, 2, 1, C.glow, "prop");
      fill(cv, 28, 13, 1, 1, C.glow, "prop");
      fill(cv, 30, 11, 2, 1, C.glow, "prop");
      fill(cv, 31, 10, 1, 1, C.glow, "prop");
      break;
    case "sparkle":
      // 右手边大星 + 身体左侧小星，构图更平衡
      fill(cv, 29, 8, 1, 3, C.glow, "prop");
      fill(cv, 28, 9, 3, 1, C.glow, "prop");
      fill(cv, 4, 26, 1, 3, C.glow, "prop");
      fill(cv, 3, 27, 3, 1, C.glow, "prop");
      break;
    case "coffee":
      // 双手之间端着的杯子
      fill(cv, 16, 29, 3, 4, C.cup, "prop");
      fill(cv, 17, 28, 1, 1, C.coffee, "prop");
      fill(cv, 19, 30, 1, 2, C.cupDk, "prop"); // 杯耳
      break;
    case "laptop":
      // 抱在胸前的笔记本
      fill(cv, 13, 29, 9, 3, C.laptop, "prop");
      fill(cv, 15, 30, 5, 1, C.laptopHi, "prop");
      fill(cv, 12, 32, 11, 1, C.laptop, "prop");
      break;
    default:
      break;
  }
}

/* ------------------------------------------------------------------ *
 * 姿态表
 * ------------------------------------------------------------------ */

type PoseSpec = {
  eyes: EyeKind;
  mouth: MouthKind;
  armL: ArmPose;
  armR: ArmPose;
  prop: PropKind;
};

export const POSES = {
  /** 站立呼吸 */
  idle: { eyes: "open", mouth: "smile", armL: "down", armR: "down", prop: null },
  /** 迈腿走（腿由 CSS 帧位移动画驱动） */
  walk: { eyes: "open", mouth: "smile", armL: "down", armR: "down", prop: null },
  /** 打招呼 */
  wave: { eyes: "happy", mouth: "grin", armL: "down", armR: "wave", prop: "sparkle" },
  /** 冲！双手举起 */
  cheer: { eyes: "happy", mouth: "open", armL: "up", armR: "up", prop: "sparkle" },
  /** 点赞 */
  thumb: { eyes: "happy", mouth: "grin", armL: "thumb", armR: "thumb", prop: null },
  /** 思考中 */
  think: { eyes: "lookL", mouth: "flat", armL: "down", armR: "chin", prop: "question" },
  /** 疑惑 */
  hmm: { eyes: "lookR", mouth: "flat", armL: "down", armR: "chin", prop: "dots" },
  /** 有想法 */
  idea: { eyes: "wide", mouth: "open", armL: "down", armR: "point", prop: "bulb" },
  /** 专注（抱笔记本） */
  focus: { eyes: "half", mouth: "flat", armL: "hold", armR: "hold", prop: "laptop" },
  /** 喝咖啡 */
  sip: { eyes: "half", mouth: "smile", armL: "hold", armR: "hold", prop: "coffee" },
  /** 打盹 */
  sleep: { eyes: "closed", mouth: "smile", armL: "down", armR: "down", prop: "zzz" },
  /** 听你说（问答面板打开时） */
  listen: { eyes: "open", mouth: "smile", armL: "down", armR: "chin", prop: "dots" },
  /** 指向内容 */
  point: { eyes: "happy", mouth: "grin", armL: "down", armR: "point", prop: "sparkle" },
} as const satisfies Record<string, PoseSpec>;

export type PoseName = keyof typeof POSES;

export type PoseLayers = Record<LayerName, Pixel[]>;

const cache = new Map<PoseName, PoseLayers>();

/** 构建某一姿态的最终像素分组（带缓存，骨架是静态数据） */
export function buildPose(name: PoseName): PoseLayers {
  const hit = cache.get(name);
  if (hit) return hit;

  const p: PoseSpec = POSES[name] ?? POSES.idle;
  const cv = makeCanvas();
  drawLegs(cv);
  drawTorso(cv);
  drawHead(cv);
  drawEyes(cv, p.eyes);
  drawMouth(cv, p.mouth);
  drawArmL(cv, p.armL);
  drawArmR(cv, p.armR);
  drawProp(cv, p.prop);

  const final = outline(cv);
  const layers = {} as PoseLayers;
  for (const l of LAYERS) layers[l] = [];
  for (let y = 0; y < RIG_H; y++) {
    for (let x = 0; x < RIG_W; x++) {
      const c = final.px[y][x];
      if (!c) continue;
      layers[final.tag[y][x] ?? "body"].push({ x, y, c });
    }
  }
  cache.set(name, layers);
  return layers;
}
