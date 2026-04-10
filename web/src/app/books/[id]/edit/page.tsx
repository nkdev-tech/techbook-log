"use client";

import { useState } from "react";
import { notFound, useParams, useRouter } from "next/navigation";
import { useGetApiBooksId, usePatchApiBooksId } from "@/external/api";
import { BookForm, BookFormValues } from "@/components/books/BookForm";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";

export default function BookEditPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const id = params.id;
  const { data, isLoading, error } = useGetApiBooksId(id);
  const { mutate } = usePatchApiBooksId({});
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (isLoading) {
    return (
      <div className="w-full max-w-5xl">
        <p className="text-lg">Loading...</p>
      </div>
    );
  }

  if (error) {
    if ((error as unknown as { status?: number }).status === 404) {
      notFound();
    }
    throw error;
  }

  if (!data || data.status !== 200) {
    notFound();
  }

  const onSubmit = (value: BookFormValues) => {
    mutate(
      {
        id: id,
        data: value,
      },
      {
        onSuccess() {
          router.replace(`/books/${id}`);
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
            defaultValues={data.data}
            onSubmit={onSubmit}
            errorMessage={errorMessage}
          />
        </CardContent>
        <CardFooter className="">
          <div className="flex justify-end w-full gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
            >
              キャンセル
            </Button>
            <Button type="submit" form="form-create">
              更新
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
