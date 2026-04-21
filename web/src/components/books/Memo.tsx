import { useQueryClient } from "@tanstack/react-query";
import {
  useDeleteApiBooksIdMemosMemoId,
  getGetApiBooksIdMemosQueryKey,
} from "@/external/api";
import { Card, CardContent } from "@/components/ui/card";
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
import { toast } from "sonner";

type Props = {
  bookId: string;
  memo: {
    id: number;
    content: string;
  };
  onEdit: () => void;
};

export function Memo({ bookId, memo, onEdit }: Props) {
  const queryClient = useQueryClient();
  const { mutate } = useDeleteApiBooksIdMemosMemoId();

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
    <Card className="relative bg-yellow-100 rounded-none min-h-40 py-5 group">
      <CardContent className="h-full px-5">
        <p className="whitespace-pre-wrap">{memo.content}</p>
      </CardContent>
      <div className="absolute top-3 right-3 invisible group-hover:visible bg-yellow-100/80 backdrop-blur-xs rounded-full">
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button type="button" variant="ghost" className="px-1">
              <Trash2 size={16} color="red" />
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
              <AlertDialogAction onClick={handleDelete}>削除</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
        <Button type="button" variant="ghost" className="px-1" onClick={onEdit}>
          <SquarePen size={16} className="text-primary" />
        </Button>
      </div>
    </Card>
  );
}
