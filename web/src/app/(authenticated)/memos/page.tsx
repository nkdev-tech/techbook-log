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
import { FileSearchCorner, Search, SearchX } from "lucide-react";

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

  const handleSearch = () => {
    const value = inputRef.current?.value;
    if (!value) return;
    router.push(`memos?q=${value}`);
  };

  if (isLoading) {
    return (
      <div className="w-full">
        <p className="text-lg">Loading...</p>
      </div>
    );
  }

  if (error) {
    throw error;
  }

  const memos = data?.status === 200 ? data?.data : [];

  const highlightKeyword = (content: string) => {
    const [before, target, after] = content.split(
      new RegExp(`(${keyword})`, "i")
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
      <div className="flex items-center gap-2 mt-1 mb-3 max-w-xl">
        <InputGroup className="flex-1">
          <InputGroupAddon>
            <Search className="text-muted-foreground" />
          </InputGroupAddon>
          <InputGroupInput
            id="keyword"
            name="keyword"
            defaultValue={keyword}
            ref={inputRef}
          />
        </InputGroup>
        <Button type="button" onClick={handleSearch} disabled={isLoading}>
          検索
        </Button>
      </div>
      {memos.length === 0 ? (
        <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
          {keyword.length === 0 ? (
            <>
              <FileSearchCorner size={80} className="text-muted-foreground" />
              <p className="text-2xl font-bold text-muted-foreground">
                メモを検索しましょう！
              </p>
            </>
          ) : (
            <>
              <SearchX size={80} className="text-muted-foreground" />
              <p className="text-2xl font-bold text-muted-foreground">
                一致するメモが見つかりませんでした
              </p>
            </>
          )}
        </div>
      ) : (
        <div className="space-y-2">
          {memos.map((memo) => (
            <Link
              key={memo.id}
              href={`/books/${memo.bookId}`}
              className="flex gap-3 p-4 border rounded-lg hover:bg-muted/50 transition-colors"
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
  );
}
