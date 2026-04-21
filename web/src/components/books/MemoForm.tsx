import { useEffect, useRef } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useForm } from "@tanstack/react-form";
import { useParams } from "next/navigation";
import {
  usePostApiBooksIdMemos,
  getGetApiBooksIdMemosQueryKey,
  usePatchApiBooksIdMemosMemoId,
} from "@/external/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Field, FieldError, FieldGroup } from "@/components/ui/field";
import { Textarea } from "@/components/ui/textarea";
import { SendHorizontal, X } from "lucide-react";

type Props = {
  memo?: {
    id: number;
    content: string;
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
      content: memo?.content || "",
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
      className="bg-yellow-100 rounded-none min-h-40 pt-5 pb-1"
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
          <FieldGroup>
            <form.Field
              name="content"
              validators={{
                onSubmit: ({ value }) => {
                  if (!value) {
                    return "内容を入力してください";
                  } else if (value.length > 140) {
                    return "内容は140文字以内で入力してください";
                  }
                  return undefined;
                },
              }}
            >
              {(field) => (
                <Field>
                  <Textarea
                    value={field.state.value}
                    className="form-textarea border-none resize-none p-0 focus:ring-0 focus-visible:ring-0 rounded-none min-h-26 px-3"
                    onChange={(e) => field.handleChange(e.target.value)}
                    autoFocus
                  />
                  {!field.state.meta.isValid && (
                    <FieldError>{field.state.meta.errors.join(",")}</FieldError>
                  )}
                </Field>
              )}
            </form.Field>
          </FieldGroup>
          <div className="flex justify-between bg-yellow-100 border-none">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={onCancel}
            >
              <X className="text-muted-foreground" />
            </Button>
            <Button type="submit" variant="ghost" size="icon">
              <SendHorizontal className="text-primary" />
            </Button>
          </div>
        </CardContent>
      </form>
    </Card>
  );
}
