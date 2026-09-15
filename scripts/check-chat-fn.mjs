import("file://" + process.cwd().replaceAll("\\", "/") + "/edge-functions/api/chat.js")
  .then(() => { console.log("chat.js module OK"); process.exit(0); })
  .catch((e) => { console.error("FAIL:", e.message); process.exit(1); });
