// 搜索飞书云空间并列出本人拥有的文档
// 说明：Windows 下 lark-cli 是 .cmd 包装，需 shell:true 才能解析；
// 关键字为脚本调用方传入的固定中文词，不含 shell 元字符。
const { spawnSync } = require("child_process");

const keywords = process.argv.slice(2);
const seen = new Map();

function search(kw) {
  const r = spawnSync(
    "lark-cli",
    ["drive", "+search", "--query", kw, "--as", "user", "--format", "json"],
    {
      encoding: "utf8",
      shell: true,
      maxBuffer: 32 * 1024 * 1024,
      env: { ...process.env, LARKSUITE_CLI_NO_UPDATE_NOTIFIER: "1" },
    }
  );
  return r.stdout || "";
}

for (const kw of keywords) {
  const raw = search(kw);
  let j;
  try {
    j = JSON.parse(raw);
  } catch {
    console.log(`[${kw}] 解析失败`);
    continue;
  }
  if (!j.ok) {
    console.log(`[${kw}] 搜索失败:`, j.error && j.error.message);
    continue;
  }
  for (const r of j.data.results || []) {
    const m = r.result_meta;
    if (m.owner_name !== "许隆鑫") continue;
    const title = r.title_highlighted.replace(/<[^>]+>/g, "");
    const key = m.token;
    if (!seen.has(key)) {
      seen.set(key, {
        title,
        type: r.entity_type,
        updated: (m.update_time_iso || "").slice(0, 10),
        url: m.url,
        summary: (r.summary_highlighted || "").replace(/<[^>]+>/g, "").slice(0, 60),
      });
    }
  }
}

const list = [...seen.values()].sort((a, b) => (a.updated < b.updated ? 1 : -1));
console.log(`共 ${list.length} 篇本人文档：`);
for (const d of list) {
  console.log(`- [${d.type}] ${d.title} | ${d.updated} | ${d.url}${d.summary ? " | " + d.summary : ""}`);
}
