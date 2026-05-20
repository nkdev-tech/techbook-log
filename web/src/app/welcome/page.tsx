import Link from "next/link";
import { Button } from "@/components/ui/button";
import { MoveRight } from "lucide-react";

export default function WelcomePage() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="max-w-120 w-full mx-auto flex flex-col gap-6 text-center px-8">
        <div className="flex flex-col gap-3">
          <p className="font-mono text-xs tracking-[0.2em] uppercase text-primary">
            登録完了
          </p>
          <h1 className="font-serif italic text-4xl font-normal tracking-[-0.02em] leading-[1.1]">
            Welcome aboard.
          </h1>
          <p className="text-sm text-muted-foreground leading-relaxed">
            アカウントの登録が完了しました。さっそく技術書の記録を始めましょう。
          </p>
        </div>
        <div>
          <Button asChild>
            <Link href="/books" className="gap-2">
              書籍一覧へ
              <MoveRight size={16} />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
