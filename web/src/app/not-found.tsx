import Link from "next/link";

export default function NotFound() {
  return (
    <div className="w-full max-w-5xl">
      <p className="text-lg text-red-500 m-4">ページが見つかりませんでした</p>
      <Link href="/" className="btn-link">
        ＜ 戻る
      </Link>
    </div>
  );
}
