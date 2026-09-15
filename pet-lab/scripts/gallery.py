# -*- coding: utf-8 -*-
"""把当前像素骨架渲染成一张高清预览图，用于人工过目造型。"""
from pathlib import Path
from playwright.sync_api import sync_playwright

BASE = "http://127.0.0.1:4173"
ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / "shots"

NOTE = {
    "idle": "站立", "walk": "迈步", "wave": "打招呼", "cheer": "加油", "thumb": "点赞",
    "point": "指向", "think": "思考", "hmm": "疑惑", "idea": "灵光一闪",
    "focus": "专注", "sip": "喝咖啡", "sleep": "打盹", "listen": "听你说",
}

PAGE = """<!doctype html><html lang="zh-CN"><head><meta charset="utf-8">
<title>gallery</title><style>
 *{box-sizing:border-box}
 body{margin:0;background:#14141a;color:#f3f1ec;
   font:14px/1.5 ui-sans-serif,system-ui,"PingFang SC","Microsoft YaHei",sans-serif;
   padding:22px 24px 30px}
 h1{font-size:17px;margin:0 0 3px;letter-spacing:.06em}
 .sub{color:#7c7973;margin:0 0 18px;font-size:12px}
 .grid{display:grid;grid-template-columns:repeat(5,1fr);gap:12px}
 .cell{border:1px solid rgba(243,241,236,.1);border-radius:12px;background:#1b1b23;
   padding:12px 8px 9px;text-align:center}
 .cell svg{width:100%;height:auto;display:block;image-rendering:pixelated}
 .cell b{display:block;margin-top:7px;font-size:12px;color:#a9bcff;font-weight:600;letter-spacing:.04em}
 .cell small{color:#7c7973;font-size:11px}
 .row{display:flex;align-items:flex-end;gap:22px;margin-top:20px;
   padding:16px 18px;border:1px solid rgba(243,241,236,.1);border-radius:12px;background:#1b1b23}
 .row .tag{font-size:11px;color:#7c7973;align-self:center;margin-right:4px;line-height:1.7}
 .row figure{margin:0;text-align:center}
 .row figcaption{font-size:10.5px;color:#7c7973;margin-top:5px}
 .light{margin-top:16px;padding:16px 18px;border-radius:12px;background:#f4f2ee;
   display:flex;align-items:flex-end;gap:22px}
 .light .tag{font-size:11px;color:#8a8783;align-self:center;line-height:1.7}
 .light figcaption{font-size:10.5px;color:#8a8783;margin-top:5px}
</style></head><body>
<h1>PET-LAB · 小宠物造型预览</h1>
<p class="sub">同一套像素骨架切换表情 / 手臂 / 道具层 —— 基于你的 IP 图（黑短发 + 深蓝连帽卫衣 + 咖啡杯）绘制</p>
<div class="grid" id="grid"></div>
<div class="row" id="sizes"><div class="tag">真实尺寸<br>对照 →</div></div>
<div class="light" id="light"><div class="tag">浅色页底<br>对照 →</div></div>
<script type="module">
import { buildPose, VB, VIEWBOX, POSES } from "./pet-rig.js";
const render = (name) => {
  const { groups } = buildPose(name);
  const inner = Object.entries(groups).map(([layer, rects]) =>
    "<g>" + rects.map(r => `<rect x="${r.x}" y="${r.y}" width="1" height="1" fill="${r.c}"/>`).join("") + "</g>"
  ).join("");
  return `<svg viewBox="${VIEWBOX}" shape-rendering="crispEdges">${inner}</svg>`;
};
const NOTE = __NOTE__;
const grid = document.getElementById("grid");
for (const name of Object.keys(POSES)) {
  const d = document.createElement("div");
  d.className = "cell";
  d.innerHTML = render(name) + `<b>${name}</b><small>${NOTE[name] || ""}</small>`;
  grid.appendChild(d);
}
for (const host of [document.getElementById("sizes"), document.getElementById("light")]) {
  for (const s of [2, 3, 4]) {
    const f = document.createElement("figure");
    const w = Math.round(VB.w * s);
    f.innerHTML = render("idle").replace("<svg ", `<svg style="width:${w}px" `) +
      `<figcaption>${w}px 宽</figcaption>`;
    host.appendChild(f);
  }
  const f2 = document.createElement("figure");
  f2.innerHTML = render("wave").replace("<svg ", `<svg style="width:${Math.round(VB.w*3)}px" `) +
    `<figcaption>打招呼</figcaption>`;
  host.appendChild(f2);
}
document.title = "ready";
</script></body></html>"""


def main():
    import json
    html = PAGE.replace("__NOTE__", json.dumps(NOTE, ensure_ascii=False))
    (ROOT / "prototype" / "gallery.html").write_text(html, encoding="utf-8")

    with sync_playwright() as p:
        b = p.chromium.launch()
        pg = b.new_page(viewport={"width": 1180, "height": 1000}, device_scale_factor=2)
        pg.goto(f"{BASE}/gallery.html", wait_until="networkidle")
        pg.wait_for_timeout(900)
        pg.screenshot(path=str(OUT / "gallery.png"), full_page=True)
        print("[shot] gallery.png")
        b.close()


if __name__ == "__main__":
    main()
