type Props = {
  size?: number
}

// memetec. ロゴ: 2 層の湾曲した見開き。上が淡く、下が濃い。
export function LogoMark({ size = 22 }: Props) {
  const w = size * 1.2;
  return (
    <svg width={w} height={size} viewBox="0 0 72 60" fill="none" style={{ display: "block" }}>
      <path d="M4 30 Q18 14 36 24 Q54 14 68 30 L68 38 Q54 22 36 32 Q18 22 4 38 Z" fill="var(--color-primary)" opacity="0.45" />
      <path d="M4 42 Q18 26 36 36 Q54 26 68 42 L68 50 Q54 34 36 44 Q18 34 4 50 Z" fill="var(--color-primary)" />
    </svg>
  );
}

// memetec. ワードマーク (Newsreader)
export function Wordmark({ size = 22 }: Props) {
  return (
    <span style={{
      fontFamily: "'Newsreader', serif", fontWeight: 500,
      fontSize: size, letterSpacing: "-0.02em", color: "var(--color-foreground)",
      display: "inline-flex", alignItems: "baseline", lineHeight: 1,
    }}>
      memetec.
    </span>
  );
}
