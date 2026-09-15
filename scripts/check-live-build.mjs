// 检查线上构建版本：HTML 引用的 JS chunk 里是否包含 CloudBase 接口标记
const ORIGIN = "https://xulongxin.cn";
const html = await (await fetch(ORIGIN + "/?cb=" + Date.now(), { headers: { "cache-control": "no-cache" } })).text();
const chunks = [...new Set([...html.matchAll(/\/_next\/static\/[^"']+?\.js/g)].map((m) => m[0]))];
console.log("HTML 引用 JS 文件数:", chunks.length);
let newBuild = 0, oldBuild = 0;
for (const c of chunks) {
  const js = await (await fetch(ORIGIN + c)).text();
  const hasNew = js.includes("service.tcloudbase.com");
  const hasOldFetch = js.includes('"/api/chat"') || js.includes("'/api/chat'");
  if (hasNew) { newBuild++; console.log("  [新] ", c); }
  else if (hasOldFetch && js.includes("whitespace-pre-wrap")) { oldBuild++; console.log("  [旧] ", c); }
}
console.log(`结论: 含新接口的 chunk=${newBuild}，含旧 /api/chat 的组件 chunk=${oldBuild}`);
console.log("HTML 自身包含 tcloudbase 标记:", html.includes("service.tcloudbase.com"));
