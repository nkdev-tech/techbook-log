"use client";

import { Suspense, useCallback, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { PageNo } from "@/components/books/PageNo";
import { Tag } from "@/components/books/Tag";
import { Thumbnail } from "@/components/books/Thumbnail";
import { Button } from "@/components/ui/button";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { Spinner } from "@/components/ui/spinner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, SearchX, X } from "lucide-react";
import Navigation from "@/components/Navigation";
import { useInfiniteBooks } from "@/shared/hooks/useInfiniteBooks";
import { useInfiniteMemoSearch } from "@/shared/hooks/useInfiniteMemoSearch";
import { useIntersectionObserver } from "@/shared/hooks/useIntersectionObserver";

function SearchContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const keyword = searchParams.get("q") ?? "";
  const inputRef = useRef<HTMLInputElement>(null);
  const {
    books,
    fetchNextPage: booksFetchNextPage,
    hasNextPage: booksHasNextPage,
    isFetchingNextPage: booksIsFetchingNextPage,
    isLoading: booksIsLoading,
    error: booksError,
  } = useInfiniteBooks({ q: keyword });
  const {
    memos,
    fetchNextPage: memosFetchNextPage,
    hasNextPage: memosHasNextPage,
    isFetchingNextPage: memosIsFetchingNextPage,
    isLoading: memosIsLoading,
    error: memosError,
  } = useInfiniteMemoSearch({ q: keyword });

  const booksSentinelRef = useIntersectionObserver(
    useCallback(() => {
      if (booksHasNextPage && !booksIsFetchingNextPage) {
        booksFetchNextPage();
      }
    }, [booksHasNextPage, booksIsFetchingNextPage, booksFetchNextPage])
  );

  const memosSentinelRef = useIntersectionObserver(
    useCallback(() => {
      if (memosHasNextPage && !memosIsFetchingNextPage) {
        memosFetchNextPage();
      }
    }, [memosHasNextPage, memosIsFetchingNextPage, memosFetchNextPage])
  );

  const handleSearch = (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    const value = inputRef.current?.value;
    if (!value) return;
    router.push(`/search?q=${encodeURIComponent(value)}`);
  };

  if (booksError || memosError) {
    throw booksError || memosError;
  }

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
      <div className="border-b px-8 py-4 mb-6">
        <Navigation />
        <h1 className="font-serif italic font-normal text-3xl tracking-[-0.02em]">
          Search your notes.
        </h1>
      </div>
      <div className="px-8 pb-8">
        <div className="flex items-center gap-2 mt-1 mb-3 max-w-xl">
          <form id="search" onSubmit={handleSearch} className="flex-1">
            <InputGroup className="h-12 px-2">
              <InputGroupAddon align="inline-start">
                <Search className="text-muted-foreground" />
              </InputGroupAddon>
              <InputGroupInput
                id="keyword"
                name="keyword"
                key={keyword}
                defaultValue={keyword}
                placeholder="キーワードで検索する"
                ref={inputRef}
                autoFocus
              />
              <InputGroupAddon align="inline-end">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-xs"
                  className="shrink-0"
                  onClick={() => {
                    router.push("/search");
                  }}
                >
                  <X />
                </Button>
              </InputGroupAddon>
            </InputGroup>
          </form>
        </div>
        <Tabs defaultValue="books">
          <TabsList>
            <TabsTrigger value="books">本</TabsTrigger>
            <TabsTrigger value="memos">メモ</TabsTrigger>
          </TabsList>
          <TabsContent value="books">
            {booksIsLoading ? (
              <div className="flex justify-center items-center h-full min-h-[60vh]">
                <Spinner className="size-12" />
              </div>
            ) : keyword.length === 0 ? null : keyword.length > 0 &&
              books.length === 0 ? (
              <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
                <SearchX size={80} className="text-muted-foreground" />
                <p className="text-2xl font-bold text-muted-foreground">
                  一致する本が見つかりませんでした
                </p>
              </div>
            ) : (
              <div>
                <div className="space-y-2">
                  {books.map((book) => (
                    <Link
                      key={book.id}
                      href={`/books/${book.id}`}
                      className="flex gap-3 p-4 border rounded-lg hover:bg-muted/50 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    >
                      <Thumbnail
                        thumbnailUrl={book.thumbnailUrl}
                        title={book.title}
                        size="sm"
                      />
                      <div className="flex flex-col justify-center min-w-0 gap-1">
                        <div className="text-base font-bold">{book.title}</div>
                        <div className="text-xs text-muted-foreground truncate">
                          {book.author}
                        </div>
                        <Tag
                          tags={book.tags ?? []}
                          iconSize={12}
                          textSize="text-xs"
                        />
                      </div>
                    </Link>
                  ))}
                </div>
                {booksHasNextPage && !booksIsLoading ? (
                  <div ref={booksSentinelRef} />
                ) : null}
                {booksIsFetchingNextPage ? (
                  <div className="flex justify-center my-4">
                    <Spinner className="size-12" />
                  </div>
                ) : null}
              </div>
            )}
          </TabsContent>
          <TabsContent value="memos">
            {memosIsLoading ? (
              <div className="flex justify-center items-center h-full min-h-[60vh]">
                <Spinner className="size-12" />
              </div>
            ) : keyword.length === 0 ? null : keyword.length > 0 &&
              memos.length === 0 ? (
              <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
                <SearchX size={80} className="text-muted-foreground" />
                <p className="text-2xl font-bold text-muted-foreground">
                  一致するメモが見つかりませんでした
                </p>
              </div>
            ) : (
              <div>
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
                          <span className="text-sm truncate">
                            {memo.bookTitle}
                          </span>
                          <PageNo pageNo={memo.pageNo} />
                        </div>
                        <p>{highlightKeyword(memo.content)}</p>
                      </div>
                    </Link>
                  ))}
                </div>
                {memosHasNextPage && !memosIsLoading ? (
                  <div ref={memosSentinelRef} />
                ) : null}
                {memosIsFetchingNextPage ? (
                  <div className="flex justify-center my-4">
                    <Spinner className="size-12" />
                  </div>
                ) : null}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense>
      <SearchContent />
    </Suspense>
  );
}
