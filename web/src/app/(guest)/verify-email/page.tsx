export default function VerifyEmail() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="max-w-120 w-full mx-auto flex flex-col gap-4 text-center px-8">
        <p className="font-mono text-xs tracking-[0.2em] uppercase text-primary">
          確認メールを送信しました
        </p>
        <h1 className="font-serif italic text-2xl font-normal tracking-[-0.02em] leading-[1.1]">
          メールをご確認ください。
        </h1>
        <p className="text-sm text-muted-foreground leading-relaxed">
          メール内のリンクをクリックして確認を完了してください。
        </p>
        <p className="text-xs text-muted-foreground">
          メールが届かない場合は迷惑メールフォルダをご確認ください。
        </p>
      </div>
    </div>
  );
}
