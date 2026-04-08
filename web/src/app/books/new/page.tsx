"use client";

import { useRouter } from "next/navigation";
import { PostApiBooksBodyStatus, usePostApiBooks } from "@/external/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { STATUS_LABEL } from "@/shared/utils/book";
import { StarRating } from "@/components/books/StarRating";
import { useState } from "react";
import { ChevronDownIcon } from "lucide-react";
import { format } from "date-fns";
import { useForm } from "@tanstack/react-form";
import z from "zod";

const bookSchema = z.object({
  title: z
    .string()
    .min(1, "タイトルを入力してください")
    .max(100, "タイトルは100文字以内で入力してください"),
  author: z.string().max(100, "著者名は100文字以内で入力してください"),
});

export default function BookNewPage() {
  const router = useRouter();
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [status, setStatus] = useState<PostApiBooksBodyStatus>("unread");
  const [rating, setRating] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { mutate } = usePostApiBooks({});

  const form = useForm({
    defaultValues: {
      title: "",
      author: "",
    },
    validators: {
      onSubmit: bookSchema,
    },
    onSubmit: async ({ value }) => {
      mutate(
        {
          data: {
            title: value.title as string,
            author: value.author as string,
            status: status,
            rating: rating,
            finishedAt:
              status == "done" && date
                ? date.toISOString().split("T")[0]
                : null,
          },
        },
        {
          onSuccess(data) {
            if (data.status !== 201) {
              const errorData = data.data as { error: { message: string } };
              const errors = JSON.parse(errorData.error.message);
              setError(errors[0].message);
              return;
            }
            router.replace("/books");
          },
          onError(error) {
            throw error;
          },
        }
      );
    },
  });

  return (
    <div className="mx-auto px-5 py-10">
      <div className="m-2 text-2xl font-bold">新規登録</div>
      <Card className="w-full">
        <CardContent className="space-y-1">
          <form
            id="form-create"
            onSubmit={(e) => {
              e.preventDefault();
              form.handleSubmit();
            }}
          >
            <FieldGroup>
              {error && <FieldError>{error}</FieldError>}
              <form.Field name="title">
                {(field) => (
                  <Field>
                    <FieldLabel>タイトル</FieldLabel>
                    <Input
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                    />
                    {!field.state.meta.isValid && (
                      <FieldError>
                        {field.state.meta.errors
                          .map((e) => (typeof e === "string" ? e : e?.message))
                          .join(",")}
                      </FieldError>
                    )}
                  </Field>
                )}
              </form.Field>
              <form.Field name="author">
                {(field) => (
                  <Field>
                    <FieldLabel>著者名</FieldLabel>
                    <Input
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                    />
                    {!field.state.meta.isValid && (
                      <FieldError>
                        {field.state.meta.errors
                          .map((e) => (typeof e === "string" ? e : e?.message))
                          .join(",")}
                      </FieldError>
                    )}
                  </Field>
                )}
              </form.Field>
              <Field>
                <FieldLabel>ステータス</FieldLabel>
                <Select
                  value={status}
                  onValueChange={(value) => {
                    setStatus(value as PostApiBooksBodyStatus);
                    if (value !== "done") setDate(undefined);
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {Object.entries(STATUS_LABEL).map(([key, value]) => (
                        <SelectItem key={key} value={key}>
                          {value}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </Field>
              {status === "done" && (
                <Field>
                  <FieldLabel>読了日</FieldLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        data-empty={!date}
                        className="w-[212px] justify-between text-left font-normal data-[empty=true]:text-muted-foreground"
                      >
                        {date ? format(date, "yyyy/MM/dd") : <span></span>}
                        <ChevronDownIcon />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={date}
                        onSelect={setDate}
                        defaultMonth={date}
                      />
                    </PopoverContent>
                  </Popover>
                </Field>
              )}
              <Field>
                <FieldLabel>評価</FieldLabel>
                <StarRating
                  rating={rating}
                  onChange={(value) => setRating(value)}
                />
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
        <CardFooter>
          <Field orientation="horizontal" className="justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
            >
              キャンセル
            </Button>
            <Button type="submit" form="form-create">
              登録
            </Button>
          </Field>
        </CardFooter>
      </Card>
    </div>
  );
}
