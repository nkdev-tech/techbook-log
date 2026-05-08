"use client";

import { useParams, useRouter, notFound } from "next/navigation";
import Image from "next/image";
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
import { Button } from "@/components/ui/button";
import { SquarePen } from "lucide-react";
import { ApiError } from "@/shared/types/api";

export default function BookDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const id = params.id;
  const { data, isLoading, error } = useGetApiBooksId(id);

  if (isLoading) {
    return (
      <div className="w-full">
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
    <div className="w-full mx-auto">
      <Card className="flex flex-row w-full mx-auto p-6">
        <div className="flex items-center shrink-0">
          {book.thumbnailUrl ? (
            <Image
              src={book.thumbnailUrl}
              alt={book.title}
              unoptimized
              width={0}
              height={0}
              className="rounded-sm shrink-0 max-w-[128px] max-h-[160px] w-auto h-auto object-contain"
            />
          ) : (
            <div className="flex flex-col items-center justify-center w-[128px] h-[160px] rounded-sm bg-muted/50 shrink-0 gap-1">
              <span className="text-xs text-muted-foreground">No Image</span>
            </div>
          )}
        </div>
        <div className="flex flex-col w-full gap-2">
          <CardHeader>
            <CardTitle className="text-2xl font-bold">{book.title}</CardTitle>
            <CardDescription className="">{book.author}</CardDescription>
            <CardAction className="flex gap-1">
              <DeleteButton id={id} />
              <Button
                type="button"
                variant="ghost"
                aria-label="本を編集"
                size="icon-lg"
                onClick={() => router.push(`/books/${id}/edit`)}
              >
                <SquarePen className="text-primary size-6" />
              </Button>
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
        </div>
      </Card>
      <MemoList />
    </div>
  );
}
