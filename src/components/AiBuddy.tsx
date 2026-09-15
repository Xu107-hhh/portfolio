type Props = {
  size?: number;
  className?: string;
};

/* ---------- 2D 像素小人（Codex-pet 风格 sprite，人设=黑短发+深蓝连帽卫衣） ---------- */

const W = 28;
const H = 34;

const C = {
  hair: "#262631",
  hairHi: "#3a3a4a",
  skin: "#f2c9a4",
  skinSh: "#e2b189",
  eye: "#262631",
  blush: "#f0a488",
  mouth: "#b8564a",
  hoodie: "#3b5bdb",
  hoodieDk: "#2f49b5",
  string: "#f2efe9",
  pants: "#2a2f45",
  shoe: "#1d1d27",
  glow: "#a3b8ff",
  outline: "#1d1d27",
} as const;

type Cell = string | null;
const grid: Cell[][] = Array.from({ length: H }, () => Array<Cell>(W).fill(null));

function rect(x: number, y: number, w: number, h: number, c: string) {
  for (let yy = y; yy < y + h; yy++)
    for (let xx = x; xx < x + w; xx++) if (grid[yy]?.[xx] !== undefined) grid[yy][xx] = c;
}

/** 挥手手臂的像素收集到独立层，肩点 (19.5, 21) 做摆动支点 */
const armLayer = new Set<string>();
function armRect(x: number, y: number, w: number, h: number, c: string) {
  rect(x, y, w, h, c);
  for (let yy = y; yy < y + h; yy++)
    for (let xx = x; xx < x + w; xx++) armLayer.add(`${xx},${yy}`);
}

/** 眼睛像素（眨眼动画目标）用坐标标记，避免与同色头发混淆 */
const eyeLayer = new Set<string>();
function eyeRect(x: number, y: number, w: number, h: number) {
  rect(x, y, w, h, C.eye);
  for (let yy = y; yy < y + h; yy++)
    for (let xx = x; xx < x + w; xx++) eyeLayer.add(`${xx},${yy}`);
}

function buildSprite() {
  /* --- 头：先脸后发，斜刘海左长右短 --- */
  rect(6, 9, 16, 8, C.skin); // 脸 y9-16
  rect(8, 2, 12, 1, C.hair); // 发顶尖
  rect(7, 3, 14, 1, C.hair);
  rect(5, 4, 18, 5, C.hair); // 主发 y4-8
  rect(6, 9, 9, 1, C.hair); // 斜刘海左段（长）
  rect(18, 9, 4, 1, C.hair); // 斜刘海右段（短），露额头 x15-17
  rect(5, 9, 1, 3, C.hair); // 左鬓角
  rect(22, 9, 1, 3, C.hair); // 右鬓角
  rect(9, 2, 4, 1, C.hairHi); // 发顶高光
  // 五官（与刘海间隔 2 行，腮红/嘴分排）
  eyeRect(8, 11, 2, 2);
  eyeRect(17, 11, 2, 2);
  rect(7, 14, 2, 1, C.blush);
  rect(19, 14, 2, 1, C.blush);
  rect(12, 15, 4, 1, C.mouth);
  rect(11, 16, 1, 1, C.mouth);
  rect(16, 16, 1, 1, C.mouth); // 两端下挂凑成微笑弧

  /* --- 身体：深蓝连帽卫衣 --- */
  rect(12, 17, 4, 2, C.skin); // 脖子
  rect(8, 19, 12, 2, C.hoodie);
  rect(7, 21, 14, 8, C.hoodie); // 下摆加宽
  rect(6, 19, 2, 3, C.hoodieDk); // 帽褶（左肩）
  rect(20, 19, 2, 3, C.hoodieDk); // 帽褶（右肩）
  rect(11, 21, 1, 4, C.string); // 抽绳左
  rect(16, 21, 1, 4, C.string); // 抽绳右
  rect(10, 25, 7, 1, C.hoodieDk); // 口袋上沿

  /* --- 左臂（垂放） --- */
  rect(5, 20, 2, 5, C.hoodie);
  rect(5, 25, 2, 2, C.skin);

  /* --- 右臂（挥手，独立层） --- */
  armRect(19, 19, 2, 2, C.hoodie); // 肩
  armRect(20, 17, 2, 2, C.hoodie); // 上臂抬
  armRect(21, 15, 2, 2, C.hoodie); // 前臂举
  armRect(22, 13, 2, 2, C.skin); // 手

  /* --- 腿鞋 --- */
  rect(9, 29, 4, 2, C.pants);
  rect(15, 29, 4, 2, C.pants);
  rect(8, 31, 5, 1, C.shoe);
  rect(15, 31, 5, 1, C.shoe);

  /* --- 星光（挥手旁，与手保持距离） --- */
  rect(26, 8, 1, 3, C.glow);
  rect(25, 9, 3, 1, C.glow);
}

buildSprite();

/** 自动描边：紧邻实心像素的空格填 outline */
const outlined: Cell[][] = grid.map((row) => [...row]);
for (let y = 0; y < H; y++)
  for (let x = 0; x < W; x++) {
    if (grid[y][x]) continue;
    const near =
      grid[y - 1]?.[x] || grid[y + 1]?.[x] || grid[y][x - 1] || grid[y][x + 1];
    if (near) outlined[y][x] = C.outline;
  }

/** 像素分层：实心像素按 armLayer；描边像素看四邻（接缝描边归手臂层随摆动） */
const layerAt = (x: number, y: number): "arm" | "body" | null => {
  const solid = grid[y]?.[x];
  if (solid) return armLayer.has(`${x},${y}`) ? "arm" : "body";
  const neighbors = [
    [x, y - 1],
    [x, y + 1],
    [x - 1, y],
    [x + 1, y],
  ];
  let arm = false;
  let body = false;
  for (const [nx, ny] of neighbors) {
    if (!grid[ny]?.[nx]) continue;
    if (armLayer.has(`${nx},${ny}`)) arm = true;
    else body = true;
  }
  if (arm) return "arm";
  if (body) return "body";
  return null;
};

const toRects = (want: "body" | "arm") => {
  const rects: { x: number; y: number; c: string; eye?: boolean; glow?: boolean }[] = [];
  for (let y = 0; y < H; y++)
    for (let x = 0; x < W; x++) {
      const c = outlined[y][x];
      if (!c) continue;
      if (layerAt(x, y) !== want) continue;
      rects.push({
        x,
        y,
        c,
        eye: eyeLayer.has(`${x},${y}`),
        glow: c === C.glow,
      });
    }
  return rects;
};

/** 主体（含描边）与手臂层分开；手臂层连同其描边一起平移到肩点坐标系 */
const SHOULDER = { x: 19.5, y: 19.5 };
const bodyRects = toRects("body");
const armRects = toRects("arm");

/**
 * Ask AI 的 2D 像素小人。挥手/眨眼/漂浮/星光动画由 globals.css 的 .vox-* 类驱动。
 */
export default function AiBuddy({ size = 36, className = "" }: Props) {
  const render = (rects: typeof bodyRects, dx = 0, dy = 0) =>
    rects.map((r, i) => (
      <rect
        key={i}
        x={r.x - dx}
        y={r.y - dy}
        width={1}
        height={1}
        fill={r.c}
        className={r.eye ? "vox-eye" : r.glow ? "vox-glow" : undefined}
      />
    ));

  return (
    <svg
      width={size}
      height={size}
      viewBox="3 0 26 34"
      xmlns="http://www.w3.org/2000/svg"
      shapeRendering="crispEdges"
      className={className}
      aria-hidden="true"
    >
      <g className="vox-float">
        {render(bodyRects)}
        <g transform={`translate(${SHOULDER.x} ${SHOULDER.y})`}>
          <g className="vox-arm">{render(armRects, SHOULDER.x, SHOULDER.y)}</g>
        </g>
      </g>
    </svg>
  );
}
