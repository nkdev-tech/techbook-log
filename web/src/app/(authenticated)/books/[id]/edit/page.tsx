"use client";

import { notFound, useParams, useRouter } from "next/navigation";
import { useGetApiBooksId, usePatchApiBooksId } from "@/external/api";
import { BookForm, BookFormValues } from "@/components/books/BookForm";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "sonner";
import { ApiError } from "@/shared/types/api";
import Navigation from "@/components/Navigation";

function BookEditHeader() {
  return (
    <div className="border-b px-8 py-4 mb-6">
      <Navigation />
      <h1 className="font-serif italic font-normal text-3xl tracking-[-0.02em]">
        Update the record.
      </h1>
    </div>
  );
}

export default function BookEditPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const id = params.id;
  const { data, isLoading, error } = useGetApiBooksId(id);
  const { mutate, isPending } = usePatchApiBooksId({});

  if (isLoading) {
    return (
      <div className="w-full">
        <BookEditHeader />
        <div className="flex justify-center items-center min-h-[60vh]">
          <Spinner className="size-12" />
        </div>
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
          const err = error as ApiError;
          toast.error(err.message ?? "サーバーエラーが発生しました");
          if (err.status === 404) {
            router.replace("/books");
          }
        },
      }
    );
  };

  return (
    <div className="w-full">
      <BookEditHeader />
      <div className="px-8 pb-8">
        <Card className="w-full max-w-2xl mx-auto">
          <CardContent className="space-y-1">
            <BookForm defaultValues={data.data} onSubmit={onSubmit} />
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
              <Button type="submit" form="book-form" disabled={isPending}>
                {isPending && <Spinner data-icon="inline-start" />}
                更新
              </Button>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
