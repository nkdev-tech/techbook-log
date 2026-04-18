"use client";

import { useParams, useRouter, notFound } from "next/navigation";
import { useGetApiBooksId } from "@/external/api";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { STATUS_LABEL } from "@/shared/utils/book";
import { DeleteButton } from "@/components/books/DeleteButton";
import { MemoList } from "@/components/books/MemoList";
import { StarRating } from "@/components/books/StarRating";
import { Tag } from "@/components/books/Tag";
import { format } from "date-fns";
import { SquarePen } from "lucide-react";
import { ApiError } from "@/shared/types/api";

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
    const err = error as ApiError;
    if (err.status === 404) {
      notFound();
    }
    throw error;
  }

  if (!data || data.status !== 200) {
    notFound();
  }

  const book = data.data;

  return (
    <div className="w-full max-w-3xl mx-auto">
      <Card className="w-full mx-auto">
        <CardHeader>
          <CardTitle className="text-xl font-bold">{book.title}</CardTitle>
          <CardDescription className="">{book.author}</CardDescription>
          <CardAction className="flex px-2 gap-4">
            <DeleteButton id={id} />
            <button
              type="button"
              className="cursor-pointer"
              onClick={() => router.push(`/books/${id}/edit`)}
            >
              <SquarePen className="text-primary" />
            </button>
          </CardAction>
        </CardHeader>
        <CardContent className="space-y-2 text-base">
          <Tag tags={book.tags ?? []} iconSize={14} textSize="text-sm" />
          <div className="flex gap-1">
            <span>{STATUS_LABEL[book.status] ?? book.status}</span>
            {book.finishedAt && (
              <span className="text-xs self-end pb-1 text-muted-foreground">{`(${format(new Date(book.finishedAt), "yyyy/MM/dd")})`}</span>
            )}
          </div>
          <StarRating rating={book.rating} disabled={true} />
        </CardContent>
      </Card>
      <MemoList />
    </div>
  );
}
