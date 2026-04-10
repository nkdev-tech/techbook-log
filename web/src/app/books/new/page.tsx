"use client";

import { useRouter } from "next/navigation";
import { usePostApiBooks } from "@/external/api";
import { BookForm, BookFormValues } from "@/components/books/BookForm";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { toast } from "sonner";
import { ApiError } from "@/shared/types/api";

export default function BookNewPage() {
  const router = useRouter();
  const { mutate } = usePostApiBooks({});

  const defaultValues: BookFormValues = {
    title: "",
    author: "",
    status: "unread",
    rating: null,
    finishedAt: null,
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
          <Button type="submit" form="book-form">
            登録
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
