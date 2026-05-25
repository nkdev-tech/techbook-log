"use client";

import { useCallback } from "react";
import Link from "next/link";
import { LogoMark, Wordmark } from "@/components/Logo";
import { Button } from "@/components/ui/button";
import { useIntersectionObserver } from "@/shared/hooks/useIntersectionObserver";

export default function AboutPage() {
  const section1ref = useIntersectionObserver(
    useCallback((el: Element) => {
      el.classList.add("opacity-100");
    }, [])
  );
  const section2ref = useIntersectionObserver(
    useCallback((el: Element) => {
      el.classList.add("opacity-100");
    }, [])
  );

  return (
    <div className="flex flex-col">
      <section className="h-screen bg-primary flex flex-col justify-center px-10 py-20 text-primary-foreground">
        <div
          ref={section1ref}
          className="max-w-2xl mx-auto w-full flex flex-col gap-10 opacity-0 transition-all duration-700"
        >
          <div className="flex items-center gap-3">
            <LogoMark size={28} color="white" />
            <Wordmark size={24} color="currentColor" />
          </div>
          <div className="flex flex-col gap-5">
            <p className="font-mono text-xs tracking-[0.2em] uppercase text-primary-foreground/70">
              About memetec.
            </p>
            <h1 className="font-serif italic text-5xl font-normal leading-[1.15] tracking-[-0.015em]">
              A quiet place
              <br />
              for your technical reading notes.
            </h1>
            <p className="text-primary-foreground/75 text-sm/8">
              技術書を読んでも、時間が経つと内容を忘れてしまう。自分でノートにまとめるのは面倒くさい。
              <br />
              memetec.
              はそういう悩みを解決するための、技術書に特化した読書記録アプリです。
              <br />
              読んだ本はタグでジャンルやテーマごとに分類できます。本を読みながら気づいたことや学んだことはメモに残しておきましょう。メモは横断検索できるので、必要なときにすぐ知識を引き出せます。
              <br />
              このアプリは学びを蓄積してあなたの成長を助けます。
            </p>
          </div>
          <Button variant="link" className="text-white" asChild>
            <Link href="/login">はじめましょう →</Link>
          </Button>
        </div>
      </section>

      <section className="min-h-screen bg-background flex flex-col justify-center px-10 py-20">
        <div
          ref={section2ref}
          className="max-w-2xl mx-auto w-full flex flex-col gap-10 opacity-0 transition-all duration-700"
        >
          <div>
            <p className="font-mono text-xs tracking-[0.2em] uppercase text-muted-foreground">
              Tech Stack
            </p>
            <h2 className="mt-3 font-serif italic text-4xl font-normal tracking-[-0.015em]">
              Built with.
            </h2>
          </div>
          <table className="w-full text-sm border-collapse">
            <tbody>
              {[
                {
                  label: "フロントエンド",
                  value: "Next.js · Tailwind CSS · shadcn/ui",
                },
                { label: "API", value: "Hono" },
                {
                  label: "DB / ORM",
                  value: "Cloudflare D1 · Drizzle ORM",
                },
                { label: "インフラ", value: "Cloudflare Workers" },
                { label: "認証", value: "Better Auth" },
                {
                  label: "状態管理・フォーム",
                  value: "TanStack Query · TanStack Form",
                },
                { label: "外部サービス", value: "Resend · Google Books API" },
              ].map(({ label, value }) => (
                <tr
                  key={label}
                  className="border-b border-border last:border-0"
                >
                  <td className="py-3 pr-8 font-mono text-xs tracking-wide uppercase text-muted-foreground w-44 align-top">
                    {label}
                  </td>
                  <td className="py-3 text-foreground">{value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
