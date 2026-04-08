"use client";

import { useRouter } from "next/navigation";
import { usePostApiBooks } from "@/external/api";
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

export default function BookNewPage() {
  const router = useRouter();
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [status, setStatus] = useState<string>("unread");
  const [rating, setRating] = useState<number | null>(null);
  const { mutate } = usePostApiBooks({});

  const handleSubmit = (event: React.SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formdata = new FormData(event.currentTarget);
    mutate(
      {
        data: {
          title: formdata.get("title") as string,
          author: formdata.get("author") as string,
          status: status,
          rating: rating,
          finishedAt: date ? date.toISOString().split("T")[0] : null,
        },
      },
      {
        onSuccess(data) {
          router.replace("/");
        },
        onError(error) {
          throw error;
        },
      }
    );
  };

  return (
    <div className="mx-auto px-5 py-10">
      <div className="m-2 text-2xl font-bold">新規登録</div>
      <Card className="w-full">
        <CardContent className="space-y-1">
          <form id="form-create" onSubmit={handleSubmit}>
            <FieldGroup>
              <Field>
                <FieldLabel>タイトル</FieldLabel>
                <Input name="title" />
              </Field>
              <Field>
                <FieldLabel>著者</FieldLabel>
                <Input name="author" />
              </Field>
              <Field>
                <FieldLabel>ステータス</FieldLabel>
                <Select value={status} onValueChange={setStatus}>
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
