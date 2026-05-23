"use client";

import { useParams, useRouter, notFound } from "next/navigation";
import { useGetApiBooksId } from "@/external/api";
import {
  Card,
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
import { Thumbnail } from "@/components/books/Thumbnail";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { ApiError } from "@/shared/types/api";
import Navigation from "@/components/Navigation";

function BookDetailHeader({ id, onEdit }: { id: string; onEdit: () => void }) {
  return (
    <div className="flex justify-between border-b px-8 py-4 mb-6">
      <div>
        <Navigation />
        <h1 className="font-serif italic font-normal text-3xl tracking-[-0.02em]">
          In detail.
        </h1>
      </div>
      <div className="flex items-center gap-1">
        <DeleteButton id={id} />
        <Button type="button" variant="default" onClick={onEdit}>
          編集
        </Button>
      </div>
    </div>
  );
}

export default function BookDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const id = params.id;
  const { data, isLoading, error } = useGetApiBooksId(id);

  if (isLoading) {
    return (
      <div className="w-full mx-auto">
        <BookDetailHeader
          id={id}
          onEdit={() => router.push(`/books/${id}/edit`)}
        />
        <div className="flex justify-center items-center min-h-[60vh]">
          <Spinner className="size-12" />
        </div>
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
      <BookDetailHeader
        id={id}
        onEdit={() => router.push(`/books/${id}/edit`)}
      />
      <div className="px-8 pb-8">
        <Card className="flex flex-row w-full mx-auto p-6">
          <Thumbnail
            thumbnailUrl={book.thumbnailUrl}
            title={book.title}
            size="lg"
          />
          <div className="flex flex-col w-full gap-2">
            <CardHeader>
              <CardTitle className="text-lg font-bold">{book.title}</CardTitle>
              <CardDescription className="flex flex-col gap-1">
                <span className="text-base">{book.author}</span>
                {book.publisher && <span>{book.publisher}</span>}
              </CardDescription>
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
    </div>
  );
}
