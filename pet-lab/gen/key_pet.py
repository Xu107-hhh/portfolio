# -*- coding: utf-8 -*-
"""
key_pet.py — 豆包生图绿幕帧 -> 网页可用的归一化透明 PNG 精灵

流程：
  1) 读取 raw/<state>.png（纯绿幕背景的 Q 版全身立绘）
  2) 基于「绿色通道相对红/蓝的主导度」做色键（角色配色里没有绿色，因此稳健），
     双阈值做抗锯齿半透明边，alpha 轻微羽化；并做 despill 去边缘绿溢色
  3) 裁出角色包围盒 -> 统一身高缩放 -> 底部对齐、水平居中到固定方形画布
     （保证不同状态切换时角色不跳位置、大小一致）
  4) 输出 public/pet/<state>.png（网页实际引用）与 proc/<state>.png（同内容备份）
  5) 拼一张 preview.png：棋盘格 / 深色圆底（悬浮球）/ 奶油圆底，多尺寸验证缩小后清晰度

用法：python key_pet.py            # 处理 raw 下全部 *.png
只增不改：raw 原图不动，可反复调参重跑。
"""
import os
import sys
import numpy as np
from PIL import Image, ImageDraw, ImageFilter, ImageFont

ROOT = os.path.dirname(os.path.abspath(__file__))
RAW = os.path.join(ROOT, "raw")
PROC = os.path.join(ROOT, "proc")
PUB = os.path.join(ROOT, "..", "..", "public", "pet")
for d in (PROC, PUB):
    os.makedirs(d, exist_ok=True)

CANVAS = 320          # 最终精灵画布边长（px，方形）
H_FRAC = 0.90         # 角色身高占画布比例（留一点上下呼吸空间）
BOTTOM = 0.035        # 脚底距画布下沿比例（统一基线）


def load_rgb(path):
    im = Image.open(path).convert("RGB")
    return np.asarray(im, dtype=np.float32) / 255.0


def _smooth(x, e0, e1):
    t = np.clip((x - e0) / (e1 - e0), 0, 1)
    return t * t * (3 - 2 * t)


def rgb2hsv(rgb):
    r, g, b = rgb[..., 0], rgb[..., 1], rgb[..., 2]
    mx = np.max(rgb, axis=-1)
    mn = np.min(rgb, axis=-1)
    delta = mx - mn
    h = np.zeros_like(mx)
    mask = delta > 1e-6
    # r 通道最大
    m = mask & (mx == r)
    h[m] = ((g[m] - b[m]) / delta[m]) % 6
    m = mask & (mx == g)
    h[m] = (b[m] - r[m]) / delta[m] + 2
    m = mask & (mx == b)
    h[m] = (r[m] - g[m]) / delta[m] + 4
    h = h * 60
    s = np.where(mx > 1e-6, delta / np.maximum(mx, 1e-6), 0)
    return h, s, mx


def key_alpha(rgb):
    """以 HSV 绿色相带为主：角色配色（肤色~30°/藏青~220°/黑白低饱和）不在带内，安全。
    饱和度/明度做软门限，得到抗锯齿的连续 alpha。"""
    h, s, v = rgb2hsv(rgb)
    enter = _smooth(h, 50, 64)      # 进入绿色相带下沿
    leave = 1 - _smooth(h, 156, 172)  # 离开上沿
    score_h = np.clip(np.minimum(enter, leave), 0, 1)
    score_s = _smooth(s, 0.08, 0.22)
    score_v = _smooth(v, 0.18, 0.32)
    bg = score_h * score_s * score_v
    # 很暗的像素（黑发/描边）额外保护
    bg = np.where(v < 0.16, 0.0, bg)
    a = np.clip(1 - bg, 0, 1)
    alpha = (a * 255).astype(np.uint8)
    im = Image.fromarray(alpha, "L").filter(ImageFilter.GaussianBlur(0.8))
    return np.asarray(im, dtype=np.uint8)


def despill(rgb, alpha):
    r, g, b = rgb[..., 0], rgb[..., 1], rgb[..., 2]
    other = np.maximum(r, b)
    # 把超过 max(r,b) 的绿压回去（仅对仍可见的像素），消除绿边
    g2 = np.minimum(g, other + 0.03)
    out = np.stack([r, g2, b], axis=-1)
    keep = (alpha > 200)[..., None]
    out = np.where(keep, out, rgb)
    return (np.clip(out, 0, 1) * 255).astype(np.uint8)


def normalize(rgba):
    arr = np.asarray(rgba)
    ys, xs = np.where(arr[..., 3] > 24)
    if len(xs) == 0:
        return rgba
    x0, x1, y0, y1 = xs.min(), xs.max(), ys.min(), ys.max()
    crop = rgba.crop((x0, y0, x1 + 1, y1 + 1))
    cw, ch = crop.size
    target_h = CANVAS * H_FRAC
    target_w = CANVAS * 0.92
    s = min(target_h / ch, target_w / cw)
    nw, nh = max(1, round(cw * s)), max(1, round(ch * s))
    crop = crop.resize((nw, nh), Image.LANCZOS)
    canvas = Image.new("RGBA", (CANVAS, CANVAS), (0, 0, 0, 0))
    px = (CANVAS - nw) // 2
    py = CANVAS - nh - round(CANVAS * BOTTOM)
    canvas.alpha_composite(crop, (px, py))
    return canvas


def checker(size, cell=16):
    img = Image.new("RGB", (size, size), (255, 255, 255))
    d = ImageDraw.Draw(img)
    c1, c2 = (226, 226, 226), (250, 250, 250)
    for y in range(0, size, cell):
        for x in range(0, size, cell):
            if ((x // cell) + (y // cell)) % 2 == 0:
                d.rectangle([x, y, x + cell, y + cell], fill=c1)
    return img


def process(state, src):
    rgb = load_rgb(src)
    alpha = key_alpha(rgb)
    fg = despill(rgb, alpha)
    rgba = Image.fromarray(fg, "RGB").convert("RGBA")
    rgba.putalpha(Image.fromarray(alpha, "L"))
    rgba = normalize(rgba)
    for out in (os.path.join(PUB, state + ".png"), os.path.join(PROC, state + ".png")):
        rgba.save(out)
    return rgba


def build_preview(sprites):
    pad, label_h = 18, 22
    cols = [("transparent", None), ("#1b2030 dark ball", (27, 32, 48)),
            ("#f4efe4 cream ball", (244, 239, 228))]
    sizes = [CANVAS, 96, 56]
    row_h = label_h + CANVAS + pad
    w = pad + len(cols) * (CANVAS + pad) + 120
    h = pad + len(sprites) * row_h
    sheet = Image.new("RGB", (w, h), (255, 255, 255))
    d = ImageDraw.Draw(sheet)
    try:
        font = ImageFont.truetype("arial.ttf", 16)
    except Exception:
        font = ImageFont.load_default()
    y = pad
    for state, sp in sprites:
        d.text((pad, y + 4), state, fill=(20, 20, 20), font=font)
        x = 110
        for (_, bg), sz in zip(cols, sizes):
            if bg is None:
                tile = checker(CANVAS).convert("RGBA")
                tile.alpha_composite(sp)
                sheet.paste(tile.convert("RGB"), (x, y + label_h))
            else:
                box = CANVAS
                tile = Image.new("RGBA", (box, box), bg + (255,))
                inner = sp.resize((sz, sz), Image.LANCZOS)
                tile.alpha_composite(inner, ((box - sz) // 2, (box - sz) // 2))
                sheet.paste(tile.convert("RGB"), (x, y + label_h))
            x += CANVAS + pad
        y += row_h
    out = os.path.join(ROOT, "preview.png")
    sheet.save(out)
    print("preview ->", out)


def main():
    states = []
    for fn in sorted(os.listdir(RAW)):
        if not fn.lower().endswith(".png"):
            continue
        state = os.path.splitext(fn)[0]
        sp = process(state, os.path.join(RAW, fn))
        states.append((state, sp))
        print("processed", state)
    if "--preview" in sys.argv or True:
        build_preview(states)


if __name__ == "__main__":
    main()
