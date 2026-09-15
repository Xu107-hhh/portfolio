// 从 origin/main 删除探针文件（gh api Git Data API，sha:null 表示删除）
import { execFileSync } from "node:child_process";

const REPO = "Xu107-hhh/portfolio";
const DELETE = ["edge-functions/ping.js", "edge-functions/ask-ai.js"];
const MESSAGE = "chore: remove probe edge functions (ping/ask-ai)\n\n/ask-ai would bypass the knowledge system prompt once routing is fixed — keep only /api/chat.";

const gh = (args, stdin) =>
  execFileSync("gh", ["api", ...args], { encoding: "utf8", maxBuffer: 32 * 1024 * 1024, input: stdin });

const ref = JSON.parse(gh([`repos/${REPO}/git/ref/heads/main`]));
const headSha = ref.object.sha;
const commit = JSON.parse(gh([`repos/${REPO}/git/commits/${headSha}`]));

const tree = DELETE.map((path) => ({ path, mode: "100644", type: "blob", sha: null }));
const newTree = JSON.parse(gh(["repos/" + REPO + "/git/trees", "--input", "-"], JSON.stringify({ base_tree: commit.tree.sha, tree })));
const newCommit = JSON.parse(
  gh(["repos/" + REPO + "/git/commits", "--input", "-"], JSON.stringify({ message: MESSAGE, tree: newTree.sha, parents: [headSha] })),
);
const updated = JSON.parse(gh(["-X", "PATCH", `repos/${REPO}/git/refs/heads/main`, "--input", "-"], JSON.stringify({ sha: newCommit.sha })));
console.log("deleted probes, pushed:", updated.object.sha);
