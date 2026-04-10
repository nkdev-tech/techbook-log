import { useRouter } from "next/navigation";
import { useDeleteApiBooksId } from "@/external/api";
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
import { Trash2 } from "lucide-react";
import { toast } from "sonner";
import { ApiError } from "@/shared/types/api";

type Props = {
  id: string;
};

export function DeleteButton({ id }: Props) {
  const router = useRouter();
  const { mutate } = useDeleteApiBooksId();

  const handleDelete = () => {
    mutate(
      {
        id: id,
      },
      {
        onSuccess() {
          router.replace("/books");
        },
        onError(error) {
          const err = error as ApiError;
          if (err.status === 404) {
            router.replace("/books");
          } else {
            toast.error(err.message ?? "サーバーエラーが発生しました");
          }
        },
      }
    );
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <button type="button" aria-label="削除" className="cursor-pointer">
          <Trash2 color="red" />
        </button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="font-bold">本の削除</AlertDialogTitle>
          <AlertDialogDescription>
            <span className="block">この本を削除します。よろしいですか？</span>
            <span className="block">この操作は元に戻せません。</span>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel autoFocus>キャンセル</AlertDialogCancel>
          <AlertDialogAction onClick={handleDelete}>削除</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
