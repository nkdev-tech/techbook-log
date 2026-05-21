"use client";

import { useState } from "react";
import { authClient } from "@/lib/auth-client";
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
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "sonner";

export default function SettingsPage() {
  const [isLoading, setIsLoading] = useState(false);
  const handleDelete = async () => {
    setIsLoading(true);
    await authClient.deleteUser(
      {},
      {
        onSuccess: () => {
          toast.success("アカウントを削除しました");
          window.location.href = "/login";
        },
        onError: (ctx) => {
          toast.error(ctx.error.message);
          setIsLoading(false);
        },
      }
    );
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">設定</h1>
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button type="button" variant="destructive" disabled={isLoading}>
            {isLoading && <Spinner data-icon="inline-start" />}
            アカウントを削除
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>アカウントを削除</AlertDialogTitle>
            <AlertDialogDescription>
              本当にアカウントを削除しますか？この操作は元に戻すことができません。
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel autoFocus>キャンセル</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>削除</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
