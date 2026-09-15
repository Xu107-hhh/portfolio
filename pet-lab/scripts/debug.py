"""临时诊断脚本：点一下宠物，把引擎内部状态打出来。"""
import functools
import http.server
import json
import socketserver
import threading
from pathlib import Path

from playwright.sync_api import sync_playwright

ROOT = Path(__file__).resolve().parents[1]
PROTO = ROOT / "prototype"


class Quiet(http.server.SimpleHTTPRequestHandler):
    def log_message(self, *a):
        pass


handler = functools.partial(Quiet, directory=str(PROTO))
httpd = socketserver.TCPServer(("127.0.0.1", 0), handler)
port = httpd.server_address[1]
threading.Thread(target=httpd.serve_forever, daemon=True).start()

with sync_playwright() as pw:
    browser = pw.chromium.launch()
    page = browser.new_page(viewport={"width": 1440, "height": 900})
    page.on("pageerror", lambda e: print("[pageerror]", e))
    page.on("console", lambda m: print("[console]", m.type, m.text))
    page.goto(f"http://127.0.0.1:{port}/index.html", wait_until="networkidle")
    page.wait_for_timeout(600)

    print("before:", json.dumps(page.evaluate("() => { const s = window.petLab.pet.state; return {mode:s.mode, x:Math.round(s.x), targetX:s.targetX, chatOpen:s.chatOpen, raf:s.raf, running:s.running}; }")))
    page.wait_for_timeout(4500)
    print("after wander wait:", json.dumps(page.evaluate("() => { const s = window.petLab.pet.state; return {mode:s.mode, x:Math.round(s.x), targetX:s.targetX, raf:s.raf}; }")))

    box = page.locator(".pet-hitzone").bounding_box()
    print("hitbox:", box)
    page.mouse.click(box["x"] + box["width"] / 2, box["y"] + box["height"] / 2)
    for i in range(5):
        page.wait_for_timeout(800)
        print(f"t+{(i+1)*0.8:.1f}s:", json.dumps(page.evaluate(
            "() => { const s = window.petLab.pet.state; return {mode:s.mode, x:Math.round(s.x), targetX:s.targetX, chatOpen:s.chatOpen, running:s.running, pose:s.pose}; }")))
    print("chatSideX:", page.evaluate("() => { const s = window.petLab.pet.state; return [window.innerWidth, s.x]; }"))
    browser.close()

httpd.shutdown()
