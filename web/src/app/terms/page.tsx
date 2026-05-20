import Header from "@/components/Header";

export default function TermsPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header requireAuth={false} />
      <main className="flex-1 max-w-2xl mx-auto w-full px-8 py-12">
        <h1 className="font-serif italic text-[38px] font-normal tracking-[-0.02em] leading-[1.05] mb-8">
          利用規約
        </h1>
        <p className="text-sm text-muted-foreground">準備中です。</p>
      </main>
    </div>
  );
}
