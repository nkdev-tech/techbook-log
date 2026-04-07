"use client";

import Link from "next/link";

export default function ErrorMessage({}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="w-full max-w-5xl">
      <p className="text-lg text-red-500 m-4">
        {"サーバーエラーが発生しました"}
      </p>
      <Link href="/" className="btn-link">
        ＜ 戻る
      </Link>
    </div>
  );
}
