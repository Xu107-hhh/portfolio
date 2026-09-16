// CloudBase HTTP 云函数：contact — 作品集联系表单接收（飞书群机器人推送）
// 通知通道：函数环境变量 LARK_WEBHOOK（飞书自定义群机器人 webhook URL，仅允许 open.feishu.cn 机器人路径）。
// 未配置时返回 503，前端自动降级为邮件客户端；消息内容以飞书群聊记录为存档，本函数无状态。

// 跨域白名单：仅作品集主站/镜像可调用（localhost 仅供本地 dev 预览联调）
const ALLOWED_ORIGINS = new Set([
  "https://xulongxin.cn",
  "https://www.xulongxin.cn",
  "https://xulongxin.netlify.app",
  "http://localhost:3000",
  "http://127.0.0.1:3000",
]);

// 请求约束
const MAX_NAME = 40;
const MAX_EMAIL = 120;
const MAX_MSG = 2000;
const DAILY_LIMIT_PER_IP = 5;
const DAILY_LIMIT_GLOBAL = 50; // 无 IP 可用时全局兜底

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// webhook 出站白名单：https + 飞书官方机器人路径，防 SSRF
function resolveWebhookUrl() {
  const raw = process.env.LARK_WEBHOOK || "";
  if (!raw) return null;
  try {
    const u = new URL(raw);
    if (
      u.protocol === "https:" &&
      u.hostname === "open.feishu.cn" &&
      u.pathname.startsWith("/open-apis/bot/v2/hook/")
    ) {
      return u;
    }
  } catch {}
  return null;
}

const buckets = new Map();
function nToday(key, limit) {
  const day = new Date().toISOString().slice(0, 10);
  const b = buckets.get(key);
  if (!b || b.day !== day) {
    buckets.set(key, { day, n: 1 });
    if (buckets.size > 5000) buckets.clear();
    return true;
  }
  b.n += 1;
  return b.n <= limit;
}

function respond(event, status, payload) {
  const origin =
    (event.headers && (event.headers.origin || event.headers.Origin)) || "";
  const headers = {
    "content-type": "application/json; charset=utf-8",
    "access-control-allow-origin": ALLOWED_ORIGINS.has(origin) ? origin : "",
    "access-control-allow-methods": "POST, OPTIONS",
    "access-control-allow-headers": "content-type",
    "access-control-max-age": "86400",
  };
  return { statusCode: status, headers, body: JSON.stringify(payload) };
}

function readForm(event) {
  try {
    let raw = event.body || "";
    if (typeof raw === "object") raw = JSON.stringify(raw); // 兼容网关已解析的 body
    if (event.isBase64Encoded) raw = Buffer.from(raw, "base64").toString("utf8");
    const d = JSON.parse(raw);
    const clean = (v, max) =>
      typeof v === "string" ? v.replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f]/g, "").trim().slice(0, max) : "";
    const form = {
      name: clean(d.name, MAX_NAME),
      email: clean(d.email, MAX_EMAIL),
      message: clean(d.message, MAX_MSG),
      website: typeof d.website === "string" ? d.website.slice(0, 200) : "", // 蜜罐字段
    };
    if (!form.name || !form.email || !form.message) return null;
    if (!EMAIL_RE.test(form.email)) return null;
    return form;
  } catch {
    return null;
  }
}

async function notifyFeishu(form) {
  const url = resolveWebhookUrl();
  if (!url) return false;
  const text =
    "【作品集新消息】\n称呼：" + form.name + "\n邮箱：" + form.email + "\n——\n" + form.message;
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ msg_type: "text", content: { text } }),
    });
    return res.ok;
  } catch {
    return false;
  }
}

exports.main = async function (event) {
  const method = (event.httpMethod || "GET").toUpperCase();
  if (method === "OPTIONS") return respond(event, 204, {});
  if (method !== "POST") return respond(event, 405, { error: { message: "Method Not Allowed" } });

  // 跨域白名单：非白名单来源一律拒绝
  const origin = (event.headers && (event.headers.origin || event.headers.Origin)) || "";
  if (!ALLOWED_ORIGINS.has(origin)) return respond(event, 403, { error: { message: "Forbidden" } });

  // 限流：优先按来源 IP，拿不到 IP 时全局兜底
  const h = event.headers || {};
  const ip =
    event.requestContext?.sourceIp ||
    h["x-real-ip"] ||
    (h["x-forwarded-for"] || h["X-Forwarded-For"] || "").split(",")[0].trim() ||
    "";
  if (ip && !nToday("ip:" + ip, DAILY_LIMIT_PER_IP)) {
    return respond(event, 429, { error: { message: "今天发送太频繁了，请直接邮件联系" } });
  }
  if (!ip && !nToday("global", DAILY_LIMIT_GLOBAL)) {
    return respond(event, 429, { error: { message: "今天发送太频繁了，请直接邮件联系" } });
  }

  const form = readForm(event);
  if (!form) return respond(event, 400, { error: { message: "请把称呼、邮箱和内容填写完整" } });

  // 蜜罐命中：静默丢弃，对机器人返回成功
  if (form.website) return respond(event, 200, { ok: true });

  if (!resolveWebhookUrl()) {
    return respond(event, 503, { error: { message: "通知通道未配置，请直接邮件联系" } });
  }

  const notified = await notifyFeishu(form);
  if (!notified) {
    return respond(event, 502, { error: { message: "服务暂时不可用，请直接邮件联系" } });
  }
  return respond(event, 200, { ok: true, notified });
};
