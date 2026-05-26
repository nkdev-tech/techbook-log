import { LogoMark, Wordmark } from "@/components/Logo";

export default function BrandPanel() {
  return (
    <aside className="hidden lg:flex w-120 shrink-0 bg-primary flex-col justify-between p-10">
      <div className="flex items-center gap-3 text-primary-foreground">
        <LogoMark size={28} color="white" />
        <Wordmark size={24} color="currentColor" />
      </div>
      <div className="flex flex-col gap-5">
        <p className="font-mono text-xs tracking-widest uppercase text-primary-foreground/70">
          A quiet place
          <br />
          for your technical reading notes
        </p>
        <h2 className="font-serif italic text-4xl font-normal text-primary-foreground leading-[1.15] tracking-tight">
          Every book you read
          <br />
          builds your knowledge.
        </h2>
        <p className="text-sm text-primary-foreground/70 leading-relaxed max-w-90">
          技術書を読んで、学びを蓄積しましょう。本ごとに記録したメモは横断検索できます。ここはあなただけの読書記録が残せる場所です。
        </p>
      </div>
      <div />
    </aside>
  );
}
