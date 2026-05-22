"use client";

import { useRouter } from "next/navigation";
import { usePostApiBooks } from "@/external/api";
import { BookForm, BookFormValues } from "@/components/books/BookForm";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "sonner";
import { ApiError } from "@/shared/types/api";
import Navigation from "@/components/Navigation";

export default function BookNewPage() {
  const router = useRouter();
  const { mutate, isPending } = usePostApiBooks({});

  const defaultValues: BookFormValues = {
    isbn: null,
    title: "",
    author: "",
    publisher: "",
    thumbnailUrl: null,
    status: "unread",
    rating: null,
    finishedAt: null,
    tags: [],
  };

  const onSubmit = (value: BookFormValues) => {
    mutate(
      {
        data: value,
      },
      {
        onSuccess() {
          router.replace("/books");
        },
        onError(error) {
          const err = error as ApiError;
          toast.error(err.message ?? "サーバーエラーが発生しました");
        },
      }
    );
  };

  return (
    <div className="w-full">
      <div className="border-b px-8 py-4 mb-6">
        <Navigation />
        <h1 className="font-serif italic font-normal text-3xl tracking-[-0.02em]">
          Log a new book.
        </h1>
      </div>
      <div className="px-8 pb-8">
        <Card className="w-full max-w-2xl mx-auto">
          <CardContent className="space-y-1">
            <BookForm defaultValues={defaultValues} onSubmit={onSubmit} />
          </CardContent>
          <CardFooter className="">
            <div className="flex justify-end w-full gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push("/books")}
              >
                キャンセル
              </Button>
              <Button type="submit" form="book-form" disabled={isPending}>
                {isPending && <Spinner data-icon="inline-start" />}
                登録
              </Button>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
