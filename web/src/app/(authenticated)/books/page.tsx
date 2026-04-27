"use client";

import { Suspense } from "react";
import { useGetApiBooks } from "@/external/api";
import { keepPreviousData } from "@tanstack/react-query";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { STATUS_LABEL } from "@/shared/utils/book";
import { StarRating } from "@/components/books/StarRating";
import { SearchField } from "@/components/books/SearchField";
import { Tag } from "@/components/books/Tag";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { BookOpen, SearchX } from "lucide-react";

function BooksContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const tagsParam = searchParams.get("tags") ?? undefined;
  const { data, isLoading, error } = useGetApiBooks(
    tagsParam ? { tags: tagsParam } : undefined,
    { query: { placeholderData: keepPreviousData } }
  );

  if (isLoading) {
    return (
      <div className="w-full max-w-5xl">
        <p className="text-lg">Loading...</p>
      </div>
    );
  }

  if (error) {
    throw error;
  }

  return (
    <div className="w-full">
      <div className="flex justify-between item-center mt-1 mb-3 h-[2rem]">
        <SearchField />
        <Button
          type="button"
          className="shrink-0 ml-2"
          onClick={() => router.push("/books/new")}
        >
          新規登録
        </Button>
      </div>
      {data?.data.length === 0 ? (
        <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
          {tagsParam ? (
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
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {data?.data.map((book) => {
            return (
              <Link
                key={book.id}
                href={`/books/${book.id}`}
                className="block h-full rounded-lg"
              >
                <Card className="gap-1 cursor-pointer h-full">
                  <CardHeader>
                    <CardTitle className="text-lg font-bold truncate">
                      {book.title}
                    </CardTitle>
                    <CardDescription className="text-xs truncate">
                      {book.author}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-1">
                    <div className="overflow-hidden max-h-[2.1rem]">
                      <Tag
                        tags={book.tags ?? []}
                        iconSize={12}
                        textSize="text-xs"
                      />
                    </div>
                    <div>{STATUS_LABEL[book.status] ?? book.status}</div>
                    <StarRating
                      rating={book.rating}
                      size="sm"
                      disabled={true}
                    />
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      )}
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
