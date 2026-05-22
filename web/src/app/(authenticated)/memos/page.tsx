"use client";

import { useRef } from "react";
import { keepPreviousData } from "@tanstack/react-query";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useGetApiMemos } from "@/external/api";
import { PageNo } from "@/components/books/PageNo";
import { Thumbnail } from "@/components/books/Thumbnail";
import { Button } from "@/components/ui/button";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { Spinner } from "@/components/ui/spinner";
import { Search, SearchX } from "lucide-react";
import Navigation from "@/components/Navigation";

export default function MemosPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const keyword = searchParams.get("q") ?? "";
  const inputRef = useRef<HTMLInputElement>(null);

  const { data, isLoading, error } = useGetApiMemos(
    { q: keyword },
    {
      query: { enabled: keyword.length > 0, placeholderData: keepPreviousData },
    }
  );

  const handleSearch = (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    const value = inputRef.current?.value;
    if (!value) return;
    router.push(`memos?q=${encodeURIComponent(value)}`);
  };

  if (error) {
    throw error;
  }

  const memos = data?.data ?? [];

  const highlightKeyword = (content: string) => {
    const escaped = keyword.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const [before, target, after] = content.split(
      new RegExp(`(${escaped})`, "i")
    );
    return (
      <span>
        {before && (
          <>
            {before.length > 20 && <span>...</span>}
            {before.slice(-20)}
          </>
        )}
        <span className="font-medium bg-yellow-200 px-0.5">{target}</span>
        {after && (
          <>
            {after.slice(0, 20)}
            {after.length > 20 && <span>...</span>}
          </>
        )}
      </span>
    );
  };

  return (
    <div className="w-full">
      <div className="border-b px-8 pt-4 pb-4 mb-6">
        <Navigation />
        <h1 className="font-serif italic font-normal text-3xl tracking-[-0.02em]">
          Search your notes.
        </h1>
      </div>
      <div className="px-8 pb-8">
        <div className="flex items-center gap-2 mt-1 mb-3 max-w-xl">
          <form id="memo-search" onSubmit={handleSearch} className="flex-1">
            <InputGroup>
              <InputGroupAddon>
                <Search className="text-muted-foreground" />
              </InputGroupAddon>
              <InputGroupInput
                id="keyword"
                name="keyword"
                defaultValue={keyword}
                placeholder="キーワードで検索する"
                ref={inputRef}
                autoFocus
              />
            </InputGroup>
          </form>
          <Button type="submit" form="memo-search" disabled={isLoading}>
            検索
          </Button>
        </div>
        {isLoading ? (
          <div className="flex justify-center items-center h-full min-h-[60vh]">
            <Spinner className="size-12" />
          </div>
        ) : keyword.length > 0 && memos.length === 0 ? (
          <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
            <SearchX size={80} className="text-muted-foreground" />
            <p className="text-2xl font-bold text-muted-foreground">
              一致するメモが見つかりませんでした
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {memos.map((memo) => (
              <Link
                key={memo.id}
                href={`/books/${memo.bookId}`}
                className="flex gap-3 p-4 border rounded-lg hover:bg-muted/50 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <Thumbnail
                  thumbnailUrl={memo.bookThumbnailUrl}
                  title={memo.bookTitle}
                  size="sm"
                />
                <div className="flex flex-col gap-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm truncate">{memo.bookTitle}</span>
                    <PageNo pageNo={memo.pageNo} />
                  </div>
                  <p>{highlightKeyword(memo.content)}</p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
