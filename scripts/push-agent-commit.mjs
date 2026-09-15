// 将 Ask AI 相关文件以单次 commit 推到 origin/main（gh api Git Data API）
import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { join } from "node:path";

const REPO = "Xu107-hhh/portfolio";
const ROOT = process.cwd();
const FILES = [
  "edge-functions/api/chat.js",
  "cloudbase-fn/chat/index.js",
  "cloudbase-fn/chat/package.json",
  "src/components/AskAI.tsx",
  "src/components/BackToTop.tsx",
  "src/app/layout.tsx",
];
const MESSAGE =
  "feat: Ask AI chat widget + /api/chat edge function (Makers Models gateway proxy)\n\n" +
  "- edge-functions/api/chat.js: system-prompt knowledge (口径宪法), IP rate limit, SSE passthrough\n" +
  "- src/components/AskAI.tsx: floating chat widget (streaming, quick prompts)\n" +
  "- mount in layout; BackToTop shifted up to avoid overlap";

const gh = (args, stdin) =>
  execFileSync("gh", ["api", ...args], { encoding: "utf8", maxBuffer: 32 * 1024 * 1024, input: stdin });

const ref = JSON.parse(gh([`repos/${REPO}/git/ref/heads/main`]));
const headSha = ref.object.sha;
const commit = JSON.parse(gh([`repos/${REPO}/git/commits/${headSha}`]));
const baseTree = commit.tree.sha;
console.log("head:", headSha, "tree:", baseTree);

const tree = [];
for (const path of FILES) {
  const content = readFileSync(join(ROOT, path));
  const blob = JSON.parse(
    gh(["repos/" + REPO + "/git/blobs", "--input", "-"], JSON.stringify({ content: content.toString("base64"), encoding: "base64" })),
  );
  tree.push({ path, mode: "100644", type: "blob", sha: blob.sha });
  console.log("blob:", path, blob.sha.slice(0, 8));
}

const newTree = JSON.parse(
  gh(["repos/" + REPO + "/git/trees", "--input", "-"], JSON.stringify({ base_tree: baseTree, tree })),
);
console.log("new tree:", newTree.sha);

const newCommit = JSON.parse(
  gh(["repos/" + REPO + "/git/commits", "--input", "-"], JSON.stringify({ message: MESSAGE, tree: newTree.sha, parents: [headSha] })),
);
console.log("new commit:", newCommit.sha);

const updated = JSON.parse(gh(["-X", "PATCH", `repos/${REPO}/git/refs/heads/main`, "--input", "-"], JSON.stringify({ sha: newCommit.sha })));
console.log("pushed:", updated.object.sha === newCommit.sha ? "OK" : JSON.stringify(updated));
