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
    <div className="container mx-auto px-5 py-10">
      <div className="flex justify-end my-3">
        <Button type="button" onClick={() => router.push("/books/new")}>
          新規登録
        </Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {data?.data.map((book) => {
          return (
            <Card key={book.id}>
              <CardHeader>
                <CardTitle className="text-lg font-bold">
                  {book.title}
                </CardTitle>
                <CardDescription className="text-xs">
                  {book.author}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-1">
                <div>
                  {STATUS_LABEL[book.status as keyof typeof STATUS_LABEL] ??
                    book.status}
                </div>
                <StarRating rating={book.rating} size={16} disabled={true} />
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
