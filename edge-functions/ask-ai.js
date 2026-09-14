// 探针：/ask-ai — 验证非 /api 路径的函数路由（与 /api/chat 同逻辑的轻量版）
const GATEWAY_URL = "https://ai-gateway.edgeone.link/v1/chat/completions";
const DEFAULT_MODEL = "@makers/deepseek-v4-flash";

export async function onRequest(context) {
  const { request, env } = context;
  if (request.method !== "POST")
    return new Response("ping: ask-ai edge function live (POST only)", { status: 405, headers: { "content-type": "text/plain; charset=utf-8" } });
  const apiKey = (env && (env.MAKERS_MODELS_KEY || env.AI_GATEWAY_KEY)) || "";
  if (!apiKey) return new Response("missing key", { status: 503 });
  let question = "你好";
  try {
    const body = await request.json();
    const m = (body.messages || []).filter((x) => x.role === "user");
    if (m.length) question = m[m.length - 1].content.slice(0, 800);
  } catch {}
  const upstream = await fetch(GATEWAY_URL, {
    method: "POST",
    headers: { "content-type": "application/json", authorization: `Bearer ${apiKey}` },
    body: JSON.stringify({
      model: (env && env.AI_MODEL) || DEFAULT_MODEL,
      stream: false,
      max_tokens: 500,
      messages: [{ role: "user", content: question }],
    }),
  });
  if (!upstream.ok) return new Response("gateway " + upstream.status, { status: 502 });
  const data = await upstream.json();
  return new Response(JSON.stringify(data), { status: 200, headers: { "content-type": "application/json; charset=utf-8" } });
}
export default onRequest;
