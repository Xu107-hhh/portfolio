/**
 * pet-rig.js — 像素精灵骨架（参考实现 / 调参台）
 * ---------------------------------------------------------------------------
 * 与生产实现 src/components/pet/pixelRig.ts 保持同一套几何与调色板。
 *
 * 人设：IP「江海阔」正面像 —— 黑短发斜刘海 + 深蓝连帽卫衣 + 白 T 领口
 *       + 深色长裤 + 白球鞋。
 *
 * 分层设计（每层可独立做帧位移动画）：
 *   body  躯干 / 头 / 五官        —— 呼吸缩放
 *   armL  左臂                    —— 垂放 / 捧物 / 举手
 *   armR  右臂                    —— 挥手 / 举手 / 托腮 / 竖拇指 / 指向
 *   legL  左腿                    —— 行走时前后交替
 *   legR  右腿
 *   prop  道具与情绪符号          —— ? / Zzz / ★ / 咖啡杯 / 笔记本 / 灯泡
 *
 * 绘图纪律（决定成品好不好看，改之前先读）：
 *  1. 横向中心线 HC = 17（整数）。任何区间都写成 `fill(a, y, w, h)` 且满足
 *     `a + w - 1 = 34 - a`，这样左右严格对称。写不等宽的双侧元素时，
 *     右侧区间 = 左侧区间的镜像 `{34-x}`。
 *  2. 手臂与躯干之间留 1 列空位（x11 / x23），双腿之间留 1 列空位（x17）。
 *     这些空位会被自动描边填成暗色，形成**肢体分离的暗缝**——像素画里让
 *     手臂、腿「看得出是单独部件」靠的就是这道缝，别为省宽度把它们贴上去。
 *  3. 描边比底色暗得有限，所以裤子 / 鞋要用比背景亮的中性色，否则剪影糊掉。
 */

export const W = 34;
export const H = 40;

/** 身体横向中心线（整数，所有区间以它镜像） */
export const HC = 17;

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
};

export const LAYERS = ["body", "armL", "armR", "legL", "legR", "prop"];

/** 视口：固定不变（不随姿态浮动），保证宠物换道具时不会跳位置 */
export const VB = { x: 2, y: 4, w: 30, h: 34 };
export const VIEWBOX = `${VB.x} ${VB.y} ${VB.w} ${VB.h}`;

/* ------------------------------------------------------------------ *
 * 网格与图层
 * ------------------------------------------------------------------ */

const emptyGrid = () => Array.from({ length: H }, () => Array(W).fill(null));

function makeCanvas() {
  return { px: emptyGrid(), tag: emptyGrid() };
}

function put(cv, x, y, c, tag) {
  if (x < 0 || y < 0 || x >= W || y >= H) return;
  cv.px[y][x] = c;
  cv.tag[y][x] = tag;
}

function fill(cv, x, y, w, h, c, tag = "body") {
  for (let yy = y; yy < y + h; yy++) for (let xx = x; xx < x + w; xx++) put(cv, xx, yy, c, tag);
}

/** 自动描边：紧邻实心像素的空格填 outline，图层标签继承邻居（描边跟着层一起动） */
function outline(cv) {
  const px = emptyGrid();
  const tag = emptyGrid();
  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      if (cv.px[y][x]) {
        px[y][x] = cv.px[y][x];
        tag[y][x] = cv.tag[y][x];
        continue;
      }
      for (const [nx, ny] of [
        [x, y - 1],
        [x, y + 1],
        [x - 1, y],
        [x + 1, y],
      ]) {
        if (ny < 0 || ny >= H || nx < 0 || nx >= W) continue;
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

/** 左右眼球锚点（3×3 盒子的左上角）：镜像于 HC */
export const EYE_BOX = [
  [13, 16],
  [19, 16],
];

function drawEyes(cv, kind) {
  switch (kind) {
    case "blink":
    case "closed":
      for (const [ox, oy] of EYE_BOX) fill(cv, ox, oy + 2, 3, 1, C.eye, "body");
      break;
    case "happy": // 上弧 ^ 笑眼
      for (const [ox, oy] of EYE_BOX) {
        fill(cv, ox, oy + 2, 1, 1, C.eye, "body");
        fill(cv, ox + 1, oy + 1, 1, 1, C.eye, "body");
        fill(cv, ox + 2, oy + 2, 1, 1, C.eye, "body");
      }
      break;
    case "wide": // 睁大（惊讶 / 兴奋）
      for (const [ox, oy] of EYE_BOX) fill(cv, ox, oy, 3, 2, C.eye, "body");
      break;
    case "star": // 星星眼
      for (const [ox, oy] of EYE_BOX) {
        fill(cv, ox + 1, oy, 1, 1, C.glow, "body");
        fill(cv, ox, oy + 1, 3, 1, C.glow, "body");
        fill(cv, ox + 1, oy + 2, 1, 1, C.glow, "body");
      }
      break;
    case "half": // 半眯（专注 / 淡定）
      for (const [ox, oy] of EYE_BOX) fill(cv, ox, oy + 1, 3, 2, C.eye, "body");
      break;
    case "lookL":
      for (const [ox, oy] of EYE_BOX) fill(cv, ox, oy + 1, 2, 2, C.eye, "body");
      break;
    case "lookR":
      for (const [ox, oy] of EYE_BOX) fill(cv, ox + 1, oy + 1, 2, 2, C.eye, "body");
      break;
    case "open":
    default:
      // 2×2 实心眼 + 1px 高光，是「有神」的关键
      for (const [ox, oy] of EYE_BOX) {
        fill(cv, ox, oy + 1, 2, 2, C.eye, "body");
        put(cv, ox + 1, oy + 1, "#ffffff", "body");
      }
      break;
  }
}

function drawMouth(cv, kind) {
  switch (kind) {
    case "open":
      fill(cv, 15, 20, 5, 2, C.mouth, "body");
      break;
    case "grin":
      fill(cv, 15, 20, 5, 1, C.mouth, "body");
      fill(cv, 16, 21, 3, 1, C.mouth, "body");
      break;
    case "flat":
      fill(cv, 16, 20, 3, 1, C.mouth, "body");
      break;
    case "o":
      fill(cv, 16, 20, 3, 2, C.mouth, "body");
      break;
    case "smile":
    default:
      fill(cv, 16, 20, 3, 1, C.mouth, "body");
      fill(cv, 15, 21, 1, 1, C.mouth, "body");
      fill(cv, 18, 21, 1, 1, C.mouth, "body");
      break;
  }
}

/* ------------------------------------------------------------------ *
 * 身体
 * ------------------------------------------------------------------ */

function drawHead(cv) {
  fill(cv, 12, 14, 11, 8, C.skin, "body"); // 脸 x12-22 / y14-21
  fill(cv, 14, 10, 7, 1, C.hair, "body"); // 发顶
  fill(cv, 13, 11, 9, 1, C.hair, "body");
  fill(cv, 12, 12, 11, 2, C.hair, "body"); // 主发 y12-13
  fill(cv, 12, 14, 8, 1, C.hair, "body"); // 左长刘海 → x12-19
  fill(cv, 22, 14, 1, 1, C.hair, "body"); // 右短刘海 → 露额头 x20-21
  fill(cv, 12, 14, 1, 3, C.hair, "body"); // 左鬓角
  fill(cv, 22, 14, 1, 3, C.hair, "body"); // 右鬓角
  fill(cv, 15, 10, 3, 1, C.hairHi, "body"); // 发顶高光
  fill(cv, 13, 19, 2, 1, C.blush, "body"); // 腮红
  fill(cv, 20, 19, 2, 1, C.blush, "body");
}

function drawTorso(cv) {
  fill(cv, 16, 22, 3, 2, C.skin, "body"); // 脖子
  fill(cv, 16, 22, 3, 1, C.tee, "body"); // 白 T 领口
  fill(cv, 13, 24, 9, 1, C.hoodie, "body"); // 肩线
  fill(cv, 12, 25, 11, 9, C.hoodie, "body"); // 卫衣主体 y25-33
  fill(cv, 12, 25, 2, 3, C.hoodieDk, "body"); // 帽褶（左肩）
  fill(cv, 21, 25, 2, 3, C.hoodieDk, "body"); // 帽褶（右肩）
  fill(cv, 15, 24, 3, 1, C.hoodieHi, "body"); // 肩部受光
  fill(cv, 16, 27, 1, 4, C.string, "body"); // 抽绳左
  fill(cv, 18, 27, 1, 4, C.string, "body"); // 抽绳右
  fill(cv, 14, 31, 7, 1, C.hoodieDk, "body"); // 口袋上沿
}

function drawLegs(cv) {
  fill(cv, 13, 34, 4, 3, C.pants, "legL"); // 左腿 x13-16
  fill(cv, 18, 34, 4, 3, C.pants, "legR"); // 右腿 x18-21（中间 x17 留缝）
  fill(cv, 12, 37, 5, 1, C.shoe, "legL"); // 左鞋
  fill(cv, 18, 37, 5, 1, C.shoe, "legR"); // 右鞋
}

function drawArmL(cv, pose) {
  if (pose === "up") {
    fill(cv, 9, 24, 2, 3, C.hoodie, "armL");
    fill(cv, 8, 21, 2, 3, C.hoodie, "armL");
    fill(cv, 7, 18, 2, 3, C.skin, "armL");
    return;
  }
  if (pose === "thumb") {
    fill(cv, 8, 24, 2, 2, C.hoodie, "armL");
    fill(cv, 9, 26, 2, 2, C.hoodie, "armL");
    fill(cv, 10, 28, 3, 2, C.skin, "armL");
    fill(cv, 12, 27, 1, 1, C.skin, "armL"); // 拇指
    return;
  }
  if (pose === "hold") {
    fill(cv, 10, 26, 2, 2, C.hoodie, "armL");
    fill(cv, 12, 29, 2, 2, C.hoodie, "armL");
    fill(cv, 14, 30, 2, 2, C.skin, "armL");
    return;
  }
  // down：自然垂放
  fill(cv, 9, 25, 2, 6, C.hoodie, "armL");
  fill(cv, 9, 31, 2, 2, C.skin, "armL");
}

function drawArmR(cv, pose) {
  if (pose === "wave") {
    fill(cv, 24, 24, 2, 2, C.hoodie, "armR"); // 肩
    fill(cv, 25, 22, 2, 2, C.hoodie, "armR");
    fill(cv, 26, 20, 2, 2, C.hoodie, "armR");
    fill(cv, 26, 18, 2, 2, C.skin, "armR"); // 手掌
    return;
  }
  if (pose === "up") {
    fill(cv, 24, 24, 2, 3, C.hoodie, "armR");
    fill(cv, 25, 21, 2, 3, C.hoodie, "armR");
    fill(cv, 26, 18, 2, 3, C.skin, "armR");
    return;
  }
  if (pose === "chin") {
    // 托腮：手抬到下颌
    fill(cv, 24, 25, 2, 2, C.hoodie, "armR");
    fill(cv, 24, 22, 2, 3, C.hoodie, "armR");
    fill(cv, 22, 20, 3, 2, C.skin, "armR");
    return;
  }
  if (pose === "thumb") {
    fill(cv, 24, 24, 2, 2, C.hoodie, "armR");
    fill(cv, 23, 26, 2, 2, C.hoodie, "armR");
    fill(cv, 21, 28, 3, 2, C.skin, "armR");
    fill(cv, 21, 27, 1, 1, C.skin, "armR"); // 拇指
    return;
  }
  if (pose === "hold") {
    fill(cv, 23, 26, 2, 2, C.hoodie, "armR");
    fill(cv, 21, 29, 2, 2, C.hoodie, "armR");
    fill(cv, 18, 30, 2, 2, C.skin, "armR");
    return;
  }
  if (pose === "point") {
    // 指向右上方
    fill(cv, 24, 24, 2, 2, C.hoodie, "armR");
    fill(cv, 25, 22, 2, 2, C.hoodie, "armR");
    fill(cv, 27, 21, 2, 2, C.hoodie, "armR");
    fill(cv, 29, 20, 2, 2, C.skin, "armR");
    return;
  }
  // down：自然垂放
  fill(cv, 24, 25, 2, 6, C.hoodie, "armR");
  fill(cv, 24, 31, 2, 2, C.skin, "armR");
}

/* ------------------------------------------------------------------ *
 * 道具 / 情绪符号（一律放在身体右侧或头顶，避免遮挡五官）
 * ------------------------------------------------------------------ */

function drawProp(cv, prop) {
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
      fill(cv, 28, 5, 2, 1, C.bulb, "prop"); // 光线（上）
      fill(cv, 25, 7, 1, 1, C.bulb, "prop"); // 光线（左）
      fill(cv, 32, 7, 1, 1, C.bulb, "prop"); // 光线（右）
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

export const POSES = {
  idle: { eyes: "open", mouth: "smile", armL: "down", armR: "down", prop: null },
  walk: { eyes: "open", mouth: "smile", armL: "down", armR: "down", prop: null },
  wave: { eyes: "happy", mouth: "grin", armL: "down", armR: "wave", prop: "sparkle" },
  cheer: { eyes: "happy", mouth: "open", armL: "up", armR: "up", prop: "sparkle" },
  thumb: { eyes: "happy", mouth: "grin", armL: "thumb", armR: "thumb", prop: null },
  think: { eyes: "lookL", mouth: "flat", armL: "down", armR: "chin", prop: "question" },
  hmm: { eyes: "lookR", mouth: "flat", armL: "down", armR: "chin", prop: "dots" },
  idea: { eyes: "wide", mouth: "open", armL: "down", armR: "point", prop: "bulb" },
  focus: { eyes: "half", mouth: "flat", armL: "hold", armR: "hold", prop: "laptop" },
  sip: { eyes: "half", mouth: "smile", armL: "hold", armR: "hold", prop: "coffee" },
  sleep: { eyes: "closed", mouth: "smile", armL: "down", armR: "down", prop: "zzz" },
  listen: { eyes: "open", mouth: "smile", armL: "down", armR: "chin", prop: "dots" },
  point: { eyes: "happy", mouth: "grin", armL: "down", armR: "point", prop: "sparkle" },
};

/** 构建某一姿态的最终像素分组 */
export function buildPose(name) {
  const p = POSES[name] || POSES.idle;
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
  const groups = {};
  for (const l of LAYERS) groups[l] = [];
  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      const c = final.px[y][x];
      if (!c) continue;
      groups[final.tag[y][x] || "body"].push({ x, y, c });
    }
  }
  return { groups, eyes: p.eyes };
}
