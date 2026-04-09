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
  status: z.enum(["unread", "reading", "done"]),
  rating: z.number().min(1).max(5).nullable(),
  finishedAt: z.date().nullable(),
});

export default function BookNewPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const { mutate } = usePostApiBooks({});

  const form = useForm({
    defaultValues: {
      title: "",
      author: "",
      status: "unread" as PostApiBooksBodyStatus,
      rating: null as number | null,
      finishedAt: null as Date | null,
    },
    validators: {
      onSubmit: bookSchema,
    },
    onSubmit: async ({ value }) => {
      mutate(
        {
          data: {
            title: value.title,
            author: value.author,
            status: value.status,
            rating: value.rating,
            finishedAt:
              value.status === "done" && value.finishedAt
                ? value.finishedAt.toISOString().split("T")[0]
                : null,
          },
        },
        {
          onSuccess() {
            router.replace("/books");
          },
          onError(error) {
            setError(error.error.message);
            return;
          },
        }
      );
    },
  });

  return (
    <div className="container mx-auto px-5 py-10">
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
              <form.Field name="status">
                {(field) => (
                  <Field>
                    <FieldLabel>ステータス</FieldLabel>
                    <Select
                      value={field.state.value}
                      onValueChange={(value) => {
                        field.handleChange(value as PostApiBooksBodyStatus);
                        if (value !== "done") {
                          form.setFieldValue("finishedAt", null);
                        }
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
                )}
              </form.Field>
              <form.Subscribe selector={(state) => state.values.status}>
                {(status) =>
                  status === "done" && (
                    <form.Field name="finishedAt">
                      {(field) => (
                        <Field>
                          <FieldLabel>読了日</FieldLabel>
                          <Popover>
                            <PopoverTrigger asChild>
                              <Button
                                variant="outline"
                                data-empty={!field.state.value}
                                className="w-[212px] justify-between text-left font-normal data-[empty=true]:text-muted-foreground"
                              >
                                {field.state.value ? (
                                  format(field.state.value, "yyyy/MM/dd")
                                ) : (
                                  <span></span>
                                )}
                                <ChevronDownIcon />
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent
                              className="w-auto p-0"
                              align="start"
                            >
                              <Calendar
                                mode="single"
                                selected={field.state.value ?? undefined}
                                onSelect={(date) =>
                                  field.handleChange(date ?? null)
                                }
                                defaultMonth={field.state.value ?? undefined}
                              />
                            </PopoverContent>
                          </Popover>
                        </Field>
                      )}
                    </form.Field>
                  )
                }
              </form.Subscribe>
              <form.Field name="rating">
                {(field) => (
                  <Field>
                    <FieldLabel>評価</FieldLabel>
                    <StarRating
                      rating={field.state.value}
                      onChange={(value) => field.handleChange(value)}
                    />
                  </Field>
                )}
              </form.Field>
            </FieldGroup>
          </form>
        </CardContent>
        <CardFooter className="">
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
