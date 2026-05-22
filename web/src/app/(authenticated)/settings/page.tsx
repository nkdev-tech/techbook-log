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
import Navigation from "@/components/Navigation";

export default function SettingsPage() {
  const [isLoading, setIsLoading] = useState(false);
  const handleDelete = async () => {
    setIsLoading(true);
    try {
      await authClient.deleteUser(
        {
          callbackURL: `${window.location.origin}/login`,
        },
        {
          onSuccess: () => {
            toast.success("確認メールを送信しました");
          },
          onError: (ctx) => {
            toast.error(ctx.error.message);
          },
        }
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full">
      <div className="border-b px-8 py-4 mb-6">
        <Navigation />
        <h1 className="font-serif italic font-normal text-3xl tracking-[-0.02em]">
          Change your preferences.
        </h1>
      </div>
      <div className="px-8 pb-8">
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
                確認メールを送信します。メール内のリンクをクリックした時点でアカウントとすべてのデータが完全に削除されます。この操作は元に戻せません。
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel autoFocus>キャンセル</AlertDialogCancel>
              <AlertDialogAction onClick={handleDelete} disabled={isLoading}>
                削除
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
}
