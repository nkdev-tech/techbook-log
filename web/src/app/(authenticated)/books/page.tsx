"use client";

import { Suspense, useCallback } from "react";
import {
  GetApiBooksOrder,
  GetApiBooksSortBy,
  GetApiBooksStatus,
} from "@/external/api";
import { BookGridView } from "@/components/books/BookGridView";
import { BookTableView } from "@/components/books/BookTableView";
import { SearchField } from "@/components/books/SearchField";
import { Sort } from "@/components/books/Sort";
import { StatusFilter } from "@/components/books/StatusFilter";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Spinner } from "@/components/ui/spinner";
import { useInfiniteBooks } from "@/shared/hooks/useInfiniteBooks";
import { useIntersectionObserver } from "@/shared/hooks/useIntersectionObserver";
import { useViewMode } from "@/shared/hooks/useViewMode";
import { useRouter, useSearchParams } from "next/navigation";
import { BookOpen, LayoutGrid, LayoutList, Plus, SearchX } from "lucide-react";
import Navigation from "@/components/Navigation";

function BooksContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const tagsParam = searchParams.get("tags") ?? undefined;
  const statusParam = searchParams.get("status") ?? undefined;
  const sortByParam = searchParams.get("sortBy") ?? undefined;
  const orderParam = searchParams.get("order") ?? undefined;
  const validStatus = Object.values(GetApiBooksStatus).find(
    (s) => s === statusParam
  );
  const validSortBy = Object.values(GetApiBooksSortBy).find(
    (s) => s === sortByParam
  );
  const validOrder = Object.values(GetApiBooksOrder).find(
    (s) => s === orderParam
  );
  const params = {
    ...(tagsParam && { tags: tagsParam }),
    ...(validStatus && { status: validStatus }),
    ...(validSortBy && { sortBy: validSortBy }),
    ...(validOrder && { order: validOrder }),
  };
  const {
    books,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    error,
  } = useInfiniteBooks(params);

  const [viewMode, { changeViewMode }] = useViewMode();

  const sentinelRef = useIntersectionObserver(
    useCallback(() => {
      if (hasNextPage && !isFetchingNextPage) {
        fetchNextPage();
      }
    }, [hasNextPage, isFetchingNextPage, fetchNextPage])
  );

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

  return (
    <div className="w-full">
      <div className="flex justify-between border-b px-8 py-4 mb-6">
        <div>
          <Navigation />
          <h1 className="font-serif italic font-normal text-3xl tracking-[-0.02em]">
            All your reads.
          </h1>
        </div>
        <div className="flex items-center">
          <Button
            type="button"
            className="shrink-0 ml-2"
            onClick={() => router.push("/books/new")}
          >
            <Plus />
            新規登録
          </Button>
        </div>
      </div>
      <div className="px-8 pb-8">
        <div className="flex justify-between items-center mt-1 mb-3 h-[2rem]">
          <SearchField />
          <div className="flex items-center gap-3 ml-3">
            <StatusFilter />
            <Separator orientation="vertical" />
            <Sort />
            <Separator orientation="vertical" />
            <div className="flex gap-1">
              <Button
                type="button"
                variant={viewMode === "table" ? "default" : "outline"}
                size="icon-lg"
                onClick={() => changeViewMode("table")}
              >
                <LayoutList />
              </Button>
              <Button
                type="button"
                variant={viewMode === "grid" ? "default" : "outline"}
                size="icon-lg"
                onClick={() => changeViewMode("grid")}
              >
                <LayoutGrid />
              </Button>
            </div>
          </div>
        </div>
        {books.length === 0 ? (
          <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
            {tagsParam || statusParam ? (
              <>
                <SearchX size={80} className="text-muted-foreground" />
                <p className="text-2xl font-bold text-muted-foreground">
                  一致する本が見つかりませんでした
                </p>
              </>
            ) : (
              <>
                <BookOpen size={80} className="text-muted-foreground" />
                <p className="text-2xl font-bold text-muted-foreground">
                  本が登録されていません
                </p>
              </>
            )}
          </div>
        ) : viewMode === "grid" ? (
          <BookGridView books={books} />
        ) : (
          <BookTableView books={books} />
        )}
        {hasNextPage && !isLoading ? <div ref={sentinelRef} /> : null}
        {isFetchingNextPage ? (
          <div className="flex justify-center my-4">
            <Spinner className="size-12" />
          </div>
        ) : null}
      </div>
    </div>
  );
}

export default function BooksPage() {
  return (
    <Suspense>
      <BooksContent />
    </Suspense>
  );
}
