"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { usePostApiBooks } from "@/external/api";
import { BookForm, BookFormValues } from "@/components/books/BookForm";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";

export default function BookNewPage() {
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
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
          setErrorMessage(error.error.message);
          return;
        },
      }
    );
  };

  return (
    <div className="container mx-auto px-5 py-10">
      <Card className="w-full">
        <CardContent className="space-y-1">
          <BookForm
            defaultValues={defaultValues}
            onSubmit={onSubmit}
            errorMessage={errorMessage}
          />
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
    </div>
  );
}
