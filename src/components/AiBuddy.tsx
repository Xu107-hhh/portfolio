type Props = {
  size?: number;
  className?: string;
};

/* ---------- 等距体素渲染器：3D 像素小人（Codex pet 风格） ---------- */

type Vox = { x: number; y: number; z: number; c: string };

const U = 10; // 体素边长（viewBox 单位）
const SHADE = { top: 1.16, left: 0.9, right: 0.6 };

const SKIN = "#f2c19a";
const HAIR = "#26262e";
const HOODIE = "#3b5bdb";
const PANTS = "#232a4d";
const EYE = "#26262e";
const MOUTH = "#9e4a3c";
const BLUSH = "#ee8a68";
const GLOW = "#a3b8ff";

function shade(hex: string, k: number): string {
  const n = parseInt(hex.slice(1), 16);
  const f = (v: number) => Math.max(0, Math.min(255, Math.round(v * k)));
  return `rgb(${f((n >> 16) & 255)},${f((n >> 8) & 255)},${f(n & 255)})`;
}

/** 搭建体素模型：x 朝右前，y 朝左前（脸朝 y+），z 朝上 */
function buildModel(): { body: Vox[]; arm: Vox[] } {
  const m = new Map<string, string>();
  const box = (x0: number, y0: number, z0: number, x1: number, y1: number, z1: number, c: string) => {
    for (let x = x0; x < x1; x++)
      for (let y = y0; y < y1; y++)
        for (let z = z0; z < z1; z++) m.set(`${x},${y},${z}`, c);
  };

  // 腿 + 卫衣身体
  box(0, 0, 0, 4, 4, 1, PANTS);
  box(0, 0, 1, 4, 4, 3, HOODIE);
  // 右臂（垂放）
  box(-1, 0, 0, 0, 3, 3, HOODIE);
  box(-1, 0, 0, 0, 3, 1, SKIN); // 手

  // 头（7×7×7 大头，脸面 y=4）
  box(-1, -1, 3, 5, 5, 10, SKIN);
  box(-1, -1, 8, 5, 5, 10, HAIR); // 发顶
  box(-1, -1, 3, 5, 0, 8, HAIR); // 后脑勺
  box(-1, 0, 6, 0, 5, 8, HAIR); // 左鬓角
  box(4, 0, 6, 5, 5, 8, HAIR); // 右鬓角
  box(-1, 4, 7, 5, 5, 8, HAIR); // 刘海
  // 呆毛 + 星光尖
  box(1, 1, 10, 3, 3, 11, HAIR);
  box(1, 1, 11, 3, 3, 12, GLOW);

  // 五官：2×2 大眼 + 腮红 + 微笑嘴（均贴脸面 y=4）
  for (const ex of [0, 3]) {
    m.set(`${ex},4,4`, EYE);
    m.set(`${ex + 1},4,4`, EYE);
    m.set(`${ex},4,5`, EYE);
    m.set(`${ex + 1},4,5`, EYE);
  }
  m.set("1,4,3", MOUTH);
  m.set("2,4,3", MOUTH);
  m.set("-1,4,3", BLUSH);
  m.set("4,4,3", BLUSH);

  // 挥手左臂（脸侧前方举起，单独分组做摆动动画）
  const arm = new Map<string, string>();
  const armBox = (x0: number, y0: number, z0: number, x1: number, y1: number, z1: number, c: string) => {
    for (let x = x0; x < x1; x++)
      for (let y = y0; y < y1; y++)
        for (let z = z0; z < z1; z++) arm.set(`${x},${y},${z}`, c);
  };
  armBox(3, 4, 2, 5, 5, 4, HOODIE); // 上臂（右肩）
  armBox(4, 5, 4, 6, 6, 6, HOODIE); // 前臂（斜上举）
  armBox(4, 6, 4, 6, 7, 6, SKIN); // 手（头右侧）

  const solid = (set: Map<string, string>) => (k: string) => {
    const [x, y, z] = k.split(",").map(Number);
    return (
      set.has(`${x + 1},${y},${z}`) &&
      set.has(`${x - 1},${y},${z}`) &&
      set.has(`${x},${y + 1},${z}`) &&
      set.has(`${x},${y - 1},${z}`) &&
      set.has(`${x},${y},${z + 1}`) &&
      set.has(`${x},${y},${z - 1}`)
    );
  };

  const toVox = (set: Map<string, string>): Vox[] =>
    [...set.entries()]
      .filter(([k]) => !solid(set)(k))
      .map(([k, c]) => {
        const [x, y, z] = k.split(",").map(Number);
        return { x, y, z, c };
      })
      .sort((a, b) => a.x + a.y + a.z - (b.x + b.y + b.z)); // 画家算法

  return { body: toVox(m), arm: toVox(arm) };
}

function cubePolys(v: Vox, dx = 0, dy = 0) {
  const ox = (v.x - v.y) * U - dx;
  const oy = (v.x + v.y) * (U / 2) - v.z * U - dy;
  // 顶面菱形 + 左面（朝 y+，脸所在面）+ 右面（朝 x+）
  const top = `${ox},${oy - U / 2} ${ox + U},${oy} ${ox},${oy + U / 2} ${ox - U},${oy}`;
  const left = `${ox - U},${oy} ${ox},${oy + U / 2} ${ox},${oy + U * 1.5} ${ox - U},${oy + U}`;
  const right = `${ox},${oy + U / 2} ${ox + U},${oy} ${ox + U},${oy + U} ${ox},${oy + U * 1.5}`;
  return { top, left, right };
}

const MODEL = buildModel();
// 挥手摆动支点：肩部 (4, 4, 3) 的投影点；手臂多边形平移到支点系，外层再平移回来
const ARM_PX = (4 - 4) * U;
const ARM_PY = (4 + 4) * (U / 2) - 3 * U;

/**
 * Ask AI 的 3D 像素小人（等距体素投影，黑短发 + 深蓝卫衣）。
 * 漂浮/挥手/眨眼动画由 globals.css 的 .vox-* 类驱动。
 */
export default function AiBuddy({ size = 36, className = "" }: Props) {
  const render = (list: Vox[], dx = 0, dy = 0) =>
    list.map((v) => {
      const p = cubePolys(v, dx, dy);
      return (
        <g key={`${v.x},${v.y},${v.z}`}>
          <polygon points={p.top} fill={shade(v.c, SHADE.top)} />
          <polygon
            points={p.left}
            fill={shade(v.c, SHADE.left)}
            className={v.c === EYE ? "vox-eye" : v.c === GLOW ? "vox-glow" : undefined}
          />
          <polygon points={p.right} fill={shade(v.c, SHADE.right)} />
        </g>
      );
    });

  return (
    <svg
      width={size}
      height={size}
      viewBox="-93 -124 176 176"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <g className="vox-float">
        {render(MODEL.body)}
        <g transform={`translate(${ARM_PX} ${ARM_PY})`}>
          <g className="vox-arm">{render(MODEL.arm, ARM_PX, ARM_PY)}</g>
        </g>
      </g>
    </svg>
  );
}
