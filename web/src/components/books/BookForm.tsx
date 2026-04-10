import { format } from "date-fns";
import z from "zod";
import { useForm } from "@tanstack/react-form";
import { ChevronDownIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
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
import { StarRating } from "@/components/books/StarRating";
import { STATUS_LABEL } from "@/shared/utils/book";

export type BookFormValues = {
  title: string;
  author: string;
  status: "unread" | "reading" | "done";
  rating: number | null;
  finishedAt: string | null;
};

type Props = {
  defaultValues: BookFormValues;
  onSubmit: (value: BookFormValues) => void;
  errorMessage: string | null;
};

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

export function BookForm({ defaultValues, onSubmit, errorMessage }: Props) {
  const form = useForm({
    defaultValues: {
      title: defaultValues.title,
      author: defaultValues.author,
      status: defaultValues.status,
      rating: defaultValues.rating,
      finishedAt: defaultValues.finishedAt
        ? new Date(defaultValues.finishedAt)
        : null,
    },
    validators: {
      onSubmit: bookSchema,
    },
    onSubmit: async ({ value }) => {
      onSubmit({
        ...value,
        finishedAt:
          value.status === "done" && value.finishedAt
            ? format(value.finishedAt, "yyyy-MM-dd")
            : null,
      });
    },
  });

  return (
    <form
      id="book-form"
      onSubmit={(e) => {
        e.preventDefault();
        form.handleSubmit();
      }}
    >
      <FieldGroup>
        {errorMessage && <FieldError>{errorMessage}</FieldError>}
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
                  field.handleChange(value as "unread" | "reading" | "done");
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
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.state.value ?? undefined}
                          onSelect={(date) => field.handleChange(date ?? null)}
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
  );
}
