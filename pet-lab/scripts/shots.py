"""
pet-lab 截图脚本 —— 本地验证像素骨架与行为引擎，不参与站点构建。

用法（Windows）：
    D:\\anaconda3\\python.exe pet-lab\\scripts\\shots.py

脚本自带一个临时静态服务（ES module 不能走 file://），跑完自动关闭。
产出：pet-lab/shots/*.png
"""
import functools
import http.server
import socketserver
import threading
from pathlib import Path

from playwright.sync_api import sync_playwright

ROOT = Path(__file__).resolve().parents[1]
PROTO = ROOT / "prototype"
SHOTS = ROOT / "shots"
SHOTS.mkdir(exist_ok=True)


class Quiet(http.server.SimpleHTTPRequestHandler):
    def log_message(self, *a):  # noqa: D102
        pass


def serve() -> tuple[socketserver.TCPServer, int]:
    handler = functools.partial(Quiet, directory=str(PROTO))
    httpd = socketserver.TCPServer(("127.0.0.1", 0), handler)
    port = httpd.server_address[1]
    threading.Thread(target=httpd.serve_forever, daemon=True).start()
    return httpd, port


def main() -> None:
    httpd, port = serve()
    base = f"http://127.0.0.1:{port}"
    print(f"[serve] {base}")

    with sync_playwright() as pw:
        browser = pw.chromium.launch()
        page = browser.new_page(viewport={"width": 1440, "height": 900},
                                device_scale_factor=2)

        # 1) 姿态总览
        page.goto(f"{base}/poses.html", wait_until="networkidle")
        page.wait_for_timeout(400)
        page.screenshot(path=str(SHOTS / "poses.png"), full_page=True)
        print("[shot] poses.png")

        # 2) 调参台：默认状态
        page.goto(f"{base}/index.html", wait_until="networkidle")
        page.wait_for_timeout(900)
        page.screenshot(path=str(SHOTS / "lab-idle.png"))
        print("[shot] lab-idle.png")

        # 3) 点击宠物 → 唤起问答（等宠物小跑到面板旁边）
        pet = page.locator(".pet-hitzone")
        box = pet.bounding_box()
        page.mouse.click(box["x"] + box["width"] / 2, box["y"] + box["height"] / 2)
        page.wait_for_timeout(3200)
        page.screenshot(path=str(SHOTS / "lab-chat-open.png"))
        print("[shot] lab-chat-open.png")

        # 4) 关闭面板 → 拖拽 → 自由落体
        page.click("[data-act='close']")
        page.wait_for_timeout(400)
        box = pet.bounding_box()
        cx, cy = box["x"] + box["width"] / 2, box["y"] + box["height"] / 2
        page.mouse.move(cx, cy)
        page.mouse.down()
        page.mouse.move(520, 180, steps=14)
        page.wait_for_timeout(160)
        page.screenshot(path=str(SHOTS / "lab-dragging.png"))
        print("[shot] lab-dragging.png")
        page.mouse.up()
        page.wait_for_timeout(150)
        page.screenshot(path=str(SHOTS / "lab-falling.png"))
        print("[shot] lab-falling.png")
        page.wait_for_timeout(1600)
        page.screenshot(path=str(SHOTS / "lab-landed.png"))
        print("[shot] lab-landed.png")

        # 5) 气泡 + 引导提问
        page.click("[data-act='sayq']")
        page.wait_for_timeout(600)
        page.screenshot(path=str(SHOTS / "lab-bubble.png"))
        print("[shot] lab-bubble.png")

        # 6) 移动端视口
        page.set_viewport_size({"width": 390, "height": 780})
        page.wait_for_timeout(700)
        page.click("[data-act='reset']")
        page.wait_for_timeout(600)
        page.screenshot(path=str(SHOTS / "lab-mobile.png"))
        print("[shot] lab-mobile.png")

        # 控制台报错检查
        errors = []
        page.on("pageerror", lambda e: errors.append(str(e)))
        page.reload(wait_until="networkidle")
        page.wait_for_timeout(1200)
        print("[console] errors:", errors or "none")

        browser.close()
    httpd.shutdown()
    print("[done] ->", SHOTS)


if __name__ == "__main__":
    main()
