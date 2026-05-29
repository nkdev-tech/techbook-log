import { useQueryClient } from "@tanstack/react-query";
import {
  useDeleteApiBooksIdMemosMemoId,
  getGetApiBooksIdMemosQueryKey,
} from "@/external/api";
import { MarkdownContent } from "@/components/books/MarkdownContent";
import { PageNo } from "@/components/books/PageNo";
import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
} from "@/components/ui/card";
import { ApiError } from "@/shared/types/api";
import { SquarePen, Trash2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "../ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { toast } from "sonner";
import { format, formatDistanceToNow } from "date-fns";
import { ja } from "date-fns/locale";

type Props = {
  bookId: string;
  memo: {
    id: number;
    content: string;
    pageNo: number | null;
    updatedAt: string;
  };
  onEdit: () => void;
};

export function Memo({ bookId, memo, onEdit }: Props) {
  const queryClient = useQueryClient();
  const { mutate, isPending } = useDeleteApiBooksIdMemosMemoId();

  const handleDelete = () => {
    mutate(
      {
        id: bookId,
        memoId: String(memo.id),
      },
      {
        onSuccess() {
          queryClient.invalidateQueries({
            queryKey: getGetApiBooksIdMemosQueryKey(bookId),
          });
        },
        onError(error) {
          const err = error as ApiError;
          if (err.status === 404) {
            queryClient.invalidateQueries({
              queryKey: getGetApiBooksIdMemosQueryKey(bookId),
            });
          } else {
            toast.error(err.message ?? "メモの削除に失敗しました");
          }
        },
      }
    );
  };
  return (
    <Card className="py-2 group rounded-lg">
      <CardHeader className="px-6 pt-2">
        <div className="flex items-center text-xs text-muted-foreground gap-3">
          {memo.pageNo && <PageNo pageNo={memo.pageNo} />}
          <Tooltip>
            <TooltipTrigger>
              {formatDistanceToNow(new Date(memo.updatedAt), {
                addSuffix: true,
                locale: ja,
              })}
            </TooltipTrigger>
            <TooltipContent side="bottom">
              {format(new Date(memo.updatedAt), "yyyy-MM-dd HH:mm:ss")}
            </TooltipContent>
          </Tooltip>
        </div>
        <CardAction className="opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                disabled={isPending}
                aria-label="メモを削除"
              >
                <Trash2 className="text-destructive" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle className="font-bold">
                  メモの削除
                </AlertDialogTitle>
                <AlertDialogDescription>
                  <span className="block">
                    このメモを削除します。よろしいですか？
                  </span>
                  <span className="block">この操作は元に戻せません。</span>
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel autoFocus>キャンセル</AlertDialogCancel>
                <AlertDialogAction onClick={handleDelete}>
                  削除
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={onEdit}
            aria-label="メモを編集"
          >
            <SquarePen className="text-primary" />
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent className="flex flex-col flex-1 px-5 gap-2">
        <div className="flex-1">
          <MarkdownContent content={memo.content} />
        </div>
      </CardContent>
    </Card>
  );
}
