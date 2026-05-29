import { useEffect, useRef } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useForm } from "@tanstack/react-form";
import { useParams } from "next/navigation";
import {
  usePostApiBooksIdMemos,
  getGetApiBooksIdMemosQueryKey,
  usePatchApiBooksIdMemosMemoId,
} from "@/external/api";
import { MarkdownContent } from "@/components/books/MarkdownContent";
import { PageNo } from "@/components/books/PageNo";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Field, FieldError, FieldGroup } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { SendHorizontal, X } from "lucide-react";

type Props = {
  memo?: {
    id: number;
    content: string;
    pageNo: number | null;
  };
  onSuccess?: () => void;
  onCancel?: () => void;
};

export function MemoForm({ memo, onSuccess, onCancel }: Props) {
  const { id } = useParams<{ id: string }>();
  const ref = useRef<HTMLDivElement>(null);
  const queryClient = useQueryClient();

  const create = usePostApiBooksIdMemos();

  const update = usePatchApiBooksIdMemosMemoId();

  const mutationOptions = {
    onSuccess() {
      onSuccess?.();
      form.reset();
      queryClient.invalidateQueries({
        queryKey: getGetApiBooksIdMemosQueryKey(id),
      });
    },
    onError(error: unknown) {
      throw error;
    },
  };

  const form = useForm({
    defaultValues: {
      content: memo?.content ?? "",
      pageNo: memo?.pageNo ?? null,
    },
    onSubmit: async ({ value }) => {
      if (memo) {
        update.mutate(
          {
            id,
            memoId: String(memo.id),
            data: value,
          },
          mutationOptions
        );
      } else {
        create.mutate(
          {
            id,
            data: value,
          },
          mutationOptions
        );
      }
    },
  });

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        onCancel?.();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onCancel]);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key !== "Tab") return;

      const focusable = Array.from(
        el.querySelectorAll<HTMLElement>(
          'button, textarea, input, [tabindex]:not([tabindex="-1"])'
        )
      );
      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (e.shiftKey) {
        if (document.activeElement === first) {
          e.preventDefault();
          last.focus();
        }
      } else {
        if (document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    el.addEventListener("keydown", handleKeyDown);
    return () => el.removeEventListener("keydown", handleKeyDown);
  }, []);

  if (update.error || create.error) {
    throw update.error || create.error;
  }

  return (
    <Card
      key="new"
      ref={ref}
      className="min-h-40 pt-2 pb-1 border-l-[6px] border-l-primary"
    >
      <form
        id="card-form"
        onSubmit={(e) => {
          e.preventDefault();
          form.handleSubmit();
        }}
        className="h-full"
      >
        <CardContent className="flex flex-col h-full px-2">
          <Tabs defaultValue="edit">
            <TabsList>
              <TabsTrigger value="edit">編集</TabsTrigger>
              <TabsTrigger value="show">プレビュー</TabsTrigger>
            </TabsList>
            <TabsContent value="edit">
              <FieldGroup className="gap-1">
                <form.Field
                  name="content"
                  validators={{
                    onSubmit: ({ value }) => {
                      if (!value) {
                        return "内容を入力してください";
                      } else if (value.length > 20000) {
                        return "内容は20000文字以内で入力してください";
                      }
                      return undefined;
                    },
                  }}
                >
                  {(field) => (
                    <Field>
                      <Textarea
                        value={field.state.value}
                        className="form-textarea border-none resize-none p-0 min-h-22 px-2 focus:ring-0 focus-visible:ring-0 rounded-none"
                        onChange={(e) => field.handleChange(e.target.value)}
                        onFocus={(e) => {
                          const len = e.currentTarget.value.length;
                          e.currentTarget.setSelectionRange(len, len);
                        }}
                        autoFocus
                      />
                      {!field.state.meta.isValid && (
                        <FieldError>
                          {field.state.meta.errors.join(",")}
                        </FieldError>
                      )}
                    </Field>
                  )}
                </form.Field>
                <form.Field name="pageNo">
                  {(field) => (
                    <Field>
                      <div className="px-2 my-1">
                        <div className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-xs font-medium bg-primary/10 text-primary">
                          p.
                          <Input
                            type="number"
                            value={field.state.value ?? ""}
                            placeholder="---"
                            min={1}
                            className="w-7 border-none bg-transparent shadow-none p-0 h-auto !text-xs text-primary font-medium rounded-none focus:ring-0 focus-visible:ring-0 [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                            onChange={(e) =>
                              field.handleChange(
                                e.target.value === ""
                                  ? null
                                  : Number(e.target.value)
                              )
                            }
                          />
                        </div>
                      </div>
                    </Field>
                  )}
                </form.Field>
              </FieldGroup>
            </TabsContent>
            <TabsContent value="show">
              <form.Subscribe selector={(state) => state.values}>
                {(values) => (
                  <div className="px-2">
                    <div className="min-h-22">
                      <MarkdownContent content={values.content} />
                    </div>
                    <PageNo pageNo={values.pageNo} />
                  </div>
                )}
              </form.Subscribe>
            </TabsContent>
          </Tabs>
          <div className="flex justify-between">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={onCancel}
            >
              <X className="text-muted-foreground" />
            </Button>
            <Button
              type="submit"
              variant="ghost"
              size="icon"
              disabled={create.isPending || update.isPending}
            >
              {create.isPending || update.isPending ? (
                <Spinner data-icon="inline-start" />
              ) : (
                <SendHorizontal className="text-primary" />
              )}
            </Button>
          </div>
        </CardContent>
      </form>
    </Card>
  );
}
