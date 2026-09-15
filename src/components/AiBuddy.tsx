type Props = {
  size?: number;
  className?: string;
};

/**
 * Ask AI 网页小宠物：SVG 矢量复刻用户 IP 参考形象——
 * 黑短发碎刘海、大椭圆眼（双高光）、藏青连帽卫衣（帽塌肩后/白抽绳/袋鼠袋/罗纹）、
 * 白 T 领口、白运动鞋、深棕描边平涂。挥手/眨眼/漂浮/星光动画走 globals.css 的 .vox-*。
 */
export default function AiBuddy({ size = 36, className = "" }: Props) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="22 8 90 132"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <defs>
        {/* 平涂色板：底色 + 深一档阴影（参考图为纯色块阴影，无渐变） */}
        <clipPath id="buddy-face">
          <path d="M36,50 C36,30 46,20 60,20 C74,20 84,30 84,50 C84,64 76,72 60,72 C44,72 36,64 36,50 Z" />
        </clipPath>
      </defs>

      <g className="vox-float" stroke="#43382e" strokeWidth={1.6} strokeLinejoin="round" strokeLinecap="round">
        {/* --- 腿与鞋（藏青裤 + 白运动鞋） --- */}
        <rect x="48" y="110" width="10" height="14" rx="4" fill="#2a3a6e" stroke="none" />
        <rect x="62" y="110" width="10" height="14" rx="4" fill="#2a3a6e" stroke="none" />
        <path d="M45,128 q5,-4 11,0 v3 q-5,3 -11,0 Z" fill="#ffffff" />
        <path d="M60,128 q5,-4 11,0 v3 q-5,3 -11,0 Z" fill="#ffffff" />
        <path d="M45,131 h11 M60,131 h11" stroke="#c9cdd6" strokeWidth={1.2} />

        {/* --- 帽子（塌在肩后，比身体宽一圈的深蓝底衬） --- */}
        <path
          d="M38,88 C38,74 48,68 60,68 C72,68 82,74 82,88 L84,104 L36,104 Z"
          fill="#26378a"
        />

        {/* --- 左臂（垂放）：藏青袖 + 罗纹袖口 + 手（起端加腋下垫块补缝） --- */}
        <path d="M40,80 L46,84 L43,87 L38,83 Z" fill="#33479c" stroke="none" />
        <path d="M43,79 C37,84 34.5,93 34,102" stroke="#33479c" strokeWidth={9} fill="none" />
        <path d="M34,100 L34,104" stroke="#26378a" strokeWidth={9} fill="none" />
        <circle cx="34" cy="110" r={5} fill="#f5cba0" />

        {/* --- 卫衣身体：藏青 + 白 T 领口 + 抽绳 + 袋鼠袋 + 下摆罗纹 --- */}
        <path
          d="M42,78 C48,73 54,71 60,71 C66,71 72,73 78,78 L82,104 C82,110 74,113 60,113 C46,113 38,110 38,104 Z"
          fill="#33479c"
        />
        <path d="M48,74 C52,79 68,79 72,74 C70,71 66,70 60,70 C54,70 50,71 48,74 Z" fill="#ffffff" stroke="none" />
        <path d="M54,80 L53,93 M66,80 L67,93" stroke="#f2efe9" strokeWidth={2.4} />
        <circle cx="53" cy="94" r={1.8} fill="#f2efe9" stroke="none" />
        <circle cx="67" cy="94" r={1.8} fill="#f2efe9" stroke="none" />
        <path d="M48,97 C52,101 68,101 72,97" stroke="#26378a" strokeWidth={2.2} fill="none" />
        <path d="M38,107 L82,107 L82,112 C82,114 44,114 38,112 Z" fill="#26378a" stroke="none" />
        {/* 腋下衣褶阴影 */}
        <path d="M44,80 L48,86 L44,88 Z" fill="#2c3f8a" stroke="none" />

        {/* --- 右臂（挥手）：肩点 (74,84) 独立组摆动，手位略低更舒展 --- */}
        <g transform="translate(74 84)">
          <g className="vox-arm">
            <path d="M0,1 C6,-2 10,-6 13,-11" stroke="#33479c" strokeWidth={9} fill="none" />
            <path d="M12,-10 L14,-13" stroke="#26378a" strokeWidth={9} fill="none" />
            <circle cx="16" cy="-15" r={5} fill="#f5cba0" />
            {/* 挥手星光 */}
            <path
              className="vox-glow"
              d="M24,-28 L25.6,-23.6 L30,-22 L25.6,-20.4 L24,-16 L22.4,-20.4 L18,-22 L22.4,-23.6 Z"
              fill="#a3b8ff"
              stroke="none"
            />
          </g>
        </g>

        {/* --- 头 --- */}
        <path
          d="M36,50 C36,30 46,20 60,20 C74,20 84,30 84,50 C84,64 76,72 60,72 C44,72 36,64 36,50 Z"
          fill="#f5cba0"
        />
        {/* 头发：圆顶 + 斜碎刘海（左长右短，右段收窄避眼）+ 两侧鬓角 */}
        <path
          d="M35,52 C33,32 44,17 60,17 C76,17 87,32 85,52 C83,45 80,41 76,39 C76,42.5 75,44.5 73,45.5 C71.5,41.5 68.5,38.5 64.5,37.5 C60,39.5 55.5,39.5 51.5,41.5 C47.5,43.5 43.8,46.5 42,51 C41,53.5 40,54 39,53 C38,52 36,52 35,52 Z"
          fill="#2b2b33"
          stroke="none"
        />
        <path d="M36,50 C36,34 46,22 60,22" stroke="#3d3d4a" strokeWidth={2} fill="none" />
        {/* 下巴底阴影（平涂色块） */}
        <path d="M48,68 C52,71 68,71 72,68 C68,70 52,70 48,68 Z" fill="#e8b28c" stroke="none" />

        {/* 五官：短粗眉 / 大椭圆眼双高光 / 小鼻 / 微笑 / 腮红 */}
        <path d="M45,45 q5,-3.5 10,0" strokeWidth={2} fill="none" />
        <path d="M65,45 q5,-3.5 10,0" strokeWidth={2} fill="none" />
        <g className="vox-eye group-hover:hidden">
          <ellipse cx="51" cy="52" rx="3.6" ry="4.6" fill="#3d2b23" stroke="none" />
          <circle cx="52.3" cy="50" r={1.9} fill="#ffffff" stroke="none" />
          <circle cx="49.6" cy="54.4" r={1.1} fill="#ffffff" opacity={0.85} stroke="none" />
        </g>
        <g className="vox-eye group-hover:hidden">
          <ellipse cx="71" cy="52" rx="3.6" ry="4.6" fill="#3d2b23" stroke="none" />
          <circle cx="72.3" cy="50" r={1.9} fill="#ffffff" stroke="none" />
          <circle cx="69.6" cy="54.4" r={1.1} fill="#ffffff" opacity={0.85} stroke="none" />
        </g>
        {/* 悬停开心眼（弯月 ^ ^，配合悬浮球 group-hover 切换） */}
        <path d="M47.5,53 q3.5,-4 7,0" className="hidden group-hover:block" stroke="#3d2b23" strokeWidth={2.2} fill="none" />
        <path d="M67.5,53 q3.5,-4 7,0" className="hidden group-hover:block" stroke="#3d2b23" strokeWidth={2.2} fill="none" />
        <path d="M59,58.5 q1.2,1.4 2.4,0" strokeWidth={1.4} fill="none" />
        <path d="M55.5,63 q4.5,3.6 9,0" stroke="#7a4a3a" strokeWidth={1.8} fill="none" />
        <ellipse cx="43.5" cy="59.5" rx="3.4" ry="2" fill="#f5a98c" className="group-hover:opacity-95" opacity={0.65} stroke="none" />
        <ellipse cx="78.5" cy="59.5" rx="3.4" ry="2" fill="#f5a98c" className="group-hover:opacity-95" opacity={0.65} stroke="none" />
      </g>
    </svg>
  );
}
