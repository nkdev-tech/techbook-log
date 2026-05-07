import { format } from "date-fns";
import z from "zod";
import { Fragment, useState } from "react";
import { useForm } from "@tanstack/react-form";
import { ChevronDownIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Combobox,
  ComboboxChip,
  ComboboxChips,
  ComboboxChipsInput,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxItem,
  ComboboxList,
  ComboboxValue,
  useComboboxAnchor,
} from "@/components/ui/combobox";
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
import { BookSearchDialog } from "@/components/books/BookSearchDialog";
import { StarRating } from "@/components/books/StarRating";
import { STATUS_LABEL } from "@/shared/utils/book";
import { GetApiBookSearch200Item, useGetApiTags } from "@/external/api";
import { getTagColor } from "./Tag";
import { cn } from "@/lib/utils";

export type BookFormValues = {
  isbn: string | null;
  title: string;
  author: string;
  publisher: string | null;
  thumbnailUrl: string | null;
  status: "unread" | "reading" | "done";
  rating: number | null;
  finishedAt: string | null;
  tags: { name: string }[];
};

type Props = {
  defaultValues: Partial<BookFormValues>;
  onSubmit: (value: BookFormValues) => void;
};

const bookSchema = z.object({
  isbn: z.string().nullable(),
  title: z
    .string()
    .min(1, "タイトルを入力してください")
    .max(100, "タイトルは100文字以内で入力してください"),
  author: z.string().max(100, "著者名は100文字以内で入力してください"),
  publisher: z
    .string()
    .max(100, "出版社名は100文字以内で入力してください")
    .nullable(),
  thumbnailUrl: z.string().nullable(),
  status: z.enum(["unread", "reading", "done"]),
  rating: z.number().min(1).max(5).nullable(),
  finishedAt: z.date().nullable(),
  tags: z.array(z.object({ name: z.string().max(20) })),
});

export function BookForm({ defaultValues, onSubmit }: Props) {
  const [inputValue, setInputValue] = useState("");
  const anchor = useComboboxAnchor();
  const form = useForm({
    defaultValues: {
      isbn: defaultValues.isbn ?? null,
      title: defaultValues.title ?? "",
      author: defaultValues.author ?? "",
      publisher: defaultValues.publisher ?? null,
      thumbnailUrl: defaultValues.thumbnailUrl ?? null,
      status: defaultValues.status ?? "unread",
      rating: defaultValues.rating ?? null,
      finishedAt: defaultValues.finishedAt
        ? new Date(defaultValues.finishedAt)
        : null,
      tags: defaultValues.tags ?? [],
    },
    validators: {
      onSubmit: bookSchema,
    },
    onSubmit: async ({ value }) => {
      onSubmit({
        ...value,
        finishedAt: value.finishedAt
          ? format(value.finishedAt, "yyyy-MM-dd")
          : null,
      });
    },
  });

  const { data, isLoading, error } = useGetApiTags();

  if (isLoading) {
    return (
      <div className="w-full max-w-5xl">
        <p className="text-lg">Loading...</p>
      </div>
    );
  }

  if (error) {
    throw error;
  }

  const tags = data?.data.map((item) => item.name) ?? [];

  const handleSelect = (book: GetApiBookSearch200Item) => {
    form.setFieldValue("isbn", book.isbn);
    form.setFieldValue("title", book.title);
    form.setFieldValue("author", book.author);
    form.setFieldValue("publisher", book.publisher);
    form.setFieldValue("thumbnailUrl", book.thumbnailUrl);
  };

  return (
    <form
      id="book-form"
      onSubmit={(e) => {
        e.preventDefault();
        form.handleSubmit();
      }}
    >
      <div className="mt-2 mb-4">
        <BookSearchDialog onSelect={handleSelect} />
      </div>
      <FieldGroup>
        <form.Field name="title">
          {(field) => (
            <Field>
              <FieldLabel className="font-semibold text-muted-foreground">
                タイトル
              </FieldLabel>
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
              <FieldLabel className="font-semibold text-muted-foreground">
                著者名
              </FieldLabel>
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
        <form.Field name="publisher">
          {(field) => (
            <Field>
              <FieldLabel className="font-semibold text-muted-foreground">
                出版社名
              </FieldLabel>
              <Input
                value={field.state.value ?? ""}
                onChange={(e) =>
                  field.handleChange(
                    e.target.value === "" ? null : e.target.value
                  )
                }
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
        <form.Field name="tags">
          {(field) => (
            <Field>
              <FieldLabel className="font-semibold text-muted-foreground">
                タグ
              </FieldLabel>
              <Combobox
                multiple
                autoHighlight
                items={tags}
                value={field.state.value.map((t) => t.name)}
                onValueChange={(values) =>
                  field.handleChange(
                    (values as string[]).map((v) => ({ name: v }))
                  )
                }
                inputValue={inputValue}
                onInputValueChange={(value) => setInputValue(value)}
              >
                <ComboboxChips ref={anchor}>
                  <ComboboxValue>
                    {(values) => (
                      <Fragment>
                        {(values as string[]).map((value) => (
                          <ComboboxChip
                            key={value}
                            className={cn(getTagColor(value))}
                          >
                            {value}
                          </ComboboxChip>
                        ))}
                        <ComboboxChipsInput
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              const input = inputValue.trim();
                              if (
                                input &&
                                !field.state.value.some((t) => t.name === input)
                              ) {
                                e.preventDefault();
                                field.handleChange([
                                  ...field.state.value,
                                  { name: input },
                                ]);
                                setInputValue("");
                              }
                            }
                          }}
                        />
                      </Fragment>
                    )}
                  </ComboboxValue>
                </ComboboxChips>
                <ComboboxContent anchor={anchor}>
                  <ComboboxEmpty></ComboboxEmpty>
                  <ComboboxList>
                    {(item) => (
                      <ComboboxItem key={item} value={item}>
                        {item}
                      </ComboboxItem>
                    )}
                  </ComboboxList>
                </ComboboxContent>
              </Combobox>
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
              <FieldLabel className="font-semibold text-muted-foreground">
                ステータス
              </FieldLabel>
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
                    <FieldLabel className="font-semibold text-muted-foreground">
                      読了日
                    </FieldLabel>
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
              <FieldLabel className="font-semibold text-muted-foreground">
                評価
              </FieldLabel>
              <StarRating
                rating={field.state.value}
                size="lg"
                onChange={(value) => field.handleChange(value)}
              />
            </Field>
          )}
        </form.Field>
      </FieldGroup>
    </form>
  );
}
