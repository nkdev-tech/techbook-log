"use client";

import { useGetApiBooks } from "@/external/api";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { STATUS_LABEL } from "@/shared/utils/book";
import { StarRating } from "@/components/books/StarRating";
import { Tag } from "@/components/books/Tag";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function BooksPage() {
  const router = useRouter();
  const { data, isLoading, error } = useGetApiBooks();

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
      <div className="flex justify-end mt-1 mb-3 h-[2rem]">
        <Button type="button" onClick={() => router.push("/books/new")}>
          新規登録
        </Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {data?.data.map((book) => {
          return (
            <Card
              key={book.id}
              className="gap-1"
              onClick={() => router.push(`/books/${book.id}`)}
            >
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
                <StarRating rating={book.rating} size={16} disabled={true} />
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
