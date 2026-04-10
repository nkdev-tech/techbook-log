"use client";

import { useParams, useRouter, notFound } from "next/navigation";
import { useGetApiBooksId } from "@/external/api";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { STATUS_LABEL } from "@/shared/utils/book";
import { StarRating } from "@/components/books/StarRating";
import { format } from "date-fns";

export default function BookDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const id = params.id;
  const { data, isLoading, error } = useGetApiBooksId(id);

  if (isLoading) {
    return (
      <div className="w-full max-w-5xl">
        <p className="text-lg">Loading...</p>
      </div>
    );
  }

  if (error) {
    if (error instanceof Error && error.message.includes("Not Found")) {
      notFound();
    }
    throw error;
  }

  if (!data || data.status !== 200) {
    notFound();
  }

  const book = data.data;

  return (
    <div className="container mx-auto px-5 py-10">
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">{book.title}</CardTitle>
          <CardDescription className="">{book.author}</CardDescription>
          <CardAction>
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push(`/books/${id}/edit`)}
            >
              編集
            </Button>
          </CardAction>
        </CardHeader>
        <CardContent className="space-y-2 text-base">
          <div className="flex gap-1">
            <span>{STATUS_LABEL[book.status] ?? book.status}</span>
            {book.finishedAt && (
              <span className="text-xs self-end pb-1 text-muted-foreground">{`(${format(new Date(book.finishedAt), "yyyy/MM/dd")})`}</span>
            )}
          </div>
          <StarRating rating={book.rating} disabled={true} />
        </CardContent>
        <CardFooter>
          <div className="flex">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
            >
              戻る
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
