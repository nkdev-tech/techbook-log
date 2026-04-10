import { useParams, useRouter } from "next/navigation";
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

export function DeleteButton() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const id = params.id;
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
          const err = error as { status?: number; message?: string };
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
        <Trash2 color="red" />
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
