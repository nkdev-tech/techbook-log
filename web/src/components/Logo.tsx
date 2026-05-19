type LogoMarkProps = { size?: number; color?: string };
type WordmarkProps = { size?: number; color?: string };

// memetec. ロゴ: 2 層の湾曲した見開き。上が淡く、下が濃い。
export function LogoMark({
  size = 22,
  color = "var(--color-primary)",
}: LogoMarkProps) {
  const w = size * 1.2;
  return (
    <svg
      width={w}
      height={size}
      viewBox="0 0 72 60"
      fill="none"
      style={{ display: "block" }}
    >
      <path
        d="M4 30 Q18 14 36 24 Q54 14 68 30 L68 38 Q54 22 36 32 Q18 22 4 38 Z"
        fill={color}
        opacity="0.45"
      />
      <path
        d="M4 42 Q18 26 36 36 Q54 26 68 42 L68 50 Q54 34 36 44 Q18 34 4 50 Z"
        fill={color}
      />
    </svg>
  );
}

// memetec. ワードマーク (Newsreader)
export function Wordmark({
  size = 22,
  color = "var(--color-primary)",
}: WordmarkProps) {
  return (
    <span
      className="font-serif font-medium tracking-[-0.02em] inline-flex items-baseline leading-none"
      style={{ fontSize: size }}
    >
      <span style={{ opacity: 0.7 }}>meme</span>
      <span style={color ? { color } : undefined}>tec.</span>
    </span>
  );
}
