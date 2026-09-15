// 卷宗签条：替代「01 — SELECTED WORKS」式英文眉标。
// 签条只承载卷号信息（卷一…卷终），实色底 + 右上斜切角。
export default function VolumeTag({
  volume,
  tone = "ink",
}: {
  volume: string;
  tone?: "ink" | "paper";
}) {
  return (
    <span
      className={`archive-chip inline-block px-3.5 py-1.5 ${
        tone === "paper" ? "bg-ink text-paper" : "bg-accent text-ivory"
      }`}
    >
      <span className="font-display text-xs font-bold" style={{ letterSpacing: "0.35em" }}>
        {volume}
      </span>
    </span>
  );
}
