// 探针：/ping — 验证 Edge Functions 在自定义域名上是否路由
export async function onRequest(context) {
  return new Response("pong", { status: 200, headers: { "content-type": "text/plain; charset=utf-8" } });
}
export default onRequest;
