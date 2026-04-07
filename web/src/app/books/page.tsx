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
import { StarLabel } from "@/components/books/StarLabel";

export default function BooksPage() {
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
                  {STATUS_LABEL[book.status as keyof typeof STATUS_LABEL] ?? book.status}
                </div>
                <StarLabel rating={book.rating} />
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
