import { useEffect, useRef } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useForm } from "@tanstack/react-form";
import { useParams } from "next/navigation";
import {
  usePostApiBooksIdMemos,
  getGetApiBooksIdMemosQueryKey,
} from "@/external/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Field, FieldError, FieldGroup } from "@/components/ui/field";
import { Textarea } from "@/components/ui/textarea";
import { SendHorizontal } from "lucide-react";

type Props = {
  onSuccess?: () => void;
  onCancel?: () => void;
};

export function MemoForm({ onSuccess, onCancel }: Props) {
  const { id } = useParams<{ id: string }>();
  const ref = useRef<HTMLDivElement>(null);
  const queryClient = useQueryClient();
  const { mutate, error } = usePostApiBooksIdMemos();
  const form = useForm({
    defaultValues: {
      content: "",
    },
    onSubmit: async ({ value }) => {
      mutate(
        {
          id,
          data: value,
        },
        {
          onSuccess() {
            onSuccess?.();
            form.reset();
            queryClient.invalidateQueries({
              queryKey: getGetApiBooksIdMemosQueryKey(id),
            });
          },
          onError(error) {
            throw error;
          },
        }
      );
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

  if (error) {
    throw error;
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
                    className="form-textarea border-none resize-none p-0 focus:ring-0 focus-visible:ring-0 rounded-none min-h-[6.5rem] px-3"
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
          <div className="flex justify-end bg-yellow-100 border-none">
            <Button type="submit" variant="ghost" size="icon">
              <SendHorizontal />
            </Button>
          </div>
        </CardContent>
      </form>
    </Card>
  );
}
