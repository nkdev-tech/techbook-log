"use client";

import { useState, useEffect } from "react";
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "sonner";
import Navigation from "@/components/Navigation";
import { Eye, EyeOff, Pencil } from "lucide-react";

export default function SettingsPage() {
  const { data: session } = authClient.useSession();
  const [editingField, setEditingField] = useState<"name" | "email" | null>(
    null
  );
  const [passwordDialogOpen, setPasswordDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [hasPassword, setHasPassword] = useState(false);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  useEffect(() => {
    authClient.listAccounts().then(({ data }) => {
      if (data) setHasPassword(data.some((a) => a.providerId === "credential"));
    });
  }, []);

  const handleNameChange = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    const formData = new FormData(e.currentTarget);
    const name = formData.get("name") as string;

    await authClient.updateUser(
      {
        name,
      },
      {
        onSuccess: () => {
          setEditingField(null);
          toast.success("ユーザー名を変更しました");
          setIsLoading(false);
        },
        onError: (ctx) => {
          toast.error(ctx.error.message);
          setIsLoading(false);
        },
      }
    );
  };

  const handleEmailChange = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    const formData = new FormData(e.currentTarget);
    const newEmail = formData.get("newEmail") as string;

    await authClient.changeEmail(
      {
        newEmail,
        callbackURL: `${window.location.origin}/login`,
      },
      {
        onSuccess: () => {
          window.location.href = "/verify-email";
        },
        onError: (ctx) => {
          toast.error(ctx.error.message);
          setIsLoading(false);
        },
      }
    );
  };

  const handlePasswordChange = async (
    e: React.SubmitEvent<HTMLFormElement>
  ) => {
    e.preventDefault();
    setIsLoading(true);
    const formData = new FormData(e.currentTarget);
    const currentPassword = formData.get("currentPassword") as string;
    const newPassword = formData.get("newPassword") as string;
    const confirmPassword = formData.get("confirmPassword") as string;

    if (newPassword !== confirmPassword) {
      setPasswordError("新しいパスワードが一致していません");
      setIsLoading(false);
      return;
    }
    setPasswordError(null);

    await authClient.changePassword(
      {
        newPassword,
        currentPassword,
        revokeOtherSessions: true,
      },
      {
        onSuccess: () => {
          setPasswordDialogOpen(false);
          toast.success("パスワードを変更しました");
          setIsLoading(false);
        },
        onError: (ctx) => {
          toast.error(ctx.error.message);
          setIsLoading(false);
        },
      }
    );
  };

  const handleDelete = async () => {
    setIsLoading(true);
    try {
      await authClient.deleteUser(
        {
          callbackURL: `${window.location.origin}/login`,
        },
        {
          onSuccess: () => {
            window.location.href = "/verify-email";
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
      <div className="px-8 pb-8 flex flex-col gap-4">
        <div>
          <h2 className="text-sm font-medium">プロフィール</h2>
          <div className="flex flex-col gap-8 mx-6 my-4">
            <div className="flex flex-col gap-1">
              <p className="text-xs text-muted-foreground">名前</p>
              {editingField === "name" ? (
                <form
                  className="flex flex-col gap-2 max-w-xs"
                  onSubmit={handleNameChange}
                >
                  <Input
                    name="name"
                    type="text"
                    defaultValue={session?.user?.name ?? ""}
                    autoFocus
                    required
                  />
                  <div className="flex items-center justify-end gap-2">
                    <Button
                      type="button"
                      size="sm"
                      variant="ghost"
                      onClick={() => setEditingField(null)}
                    >
                      キャンセル
                    </Button>
                    <Button type="submit" size="sm" disabled={isLoading}>
                      保存
                    </Button>
                  </div>
                </form>
              ) : (
                <div className="flex items-center gap-2">
                  <p>{session?.user?.name}</p>
                  <button
                    type="button"
                    onClick={() => setEditingField("name")}
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <Pencil size={14} />
                  </button>
                </div>
              )}
            </div>

            {hasPassword && (
              <>
                <div className="flex flex-col gap-1">
                  <p className="text-xs text-muted-foreground">
                    メールアドレス
                  </p>
                  {editingField === "email" ? (
                    <form
                      onSubmit={handleEmailChange}
                      className="flex flex-col gap-2 max-w-xs"
                    >
                      <Input name="newEmail" type="email" autoFocus required />
                      <p className="text-xs text-muted-foreground">
                        確認メールを現在のアドレスに送信します
                      </p>
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          type="button"
                          size="sm"
                          variant="ghost"
                          onClick={() => setEditingField(null)}
                        >
                          キャンセル
                        </Button>
                        <Button type="submit" size="sm" disabled={isLoading}>
                          保存
                        </Button>
                      </div>
                    </form>
                  ) : (
                    <div className="flex items-center gap-2">
                      <p>{session?.user?.email}</p>
                      <button
                        type="button"
                        onClick={() => setEditingField("email")}
                        className="text-muted-foreground hover:text-foreground transition-colors"
                      >
                        <Pencil size={14} />
                      </button>
                    </div>
                  )}
                </div>

                <div className="flex flex-col gap-1">
                  <p className="text-xs text-muted-foreground">パスワード</p>
                  <div className="flex items-center gap-2">
                    <p className="tracking-widest">••••••••</p>
                    <Dialog
                      open={passwordDialogOpen}
                      onOpenChange={setPasswordDialogOpen}
                    >
                      <DialogTrigger asChild>
                        <button
                          type="button"
                          className="text-muted-foreground hover:text-foreground transition-colors"
                        >
                          <Pencil size={14} />
                        </button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>パスワードを変更</DialogTitle>
                        </DialogHeader>
                        <form
                          onSubmit={handlePasswordChange}
                          className="flex flex-col gap-4"
                        >
                          <FieldGroup>
                            <Field>
                              <FieldLabel
                                htmlFor="currentPassword"
                                className="text-xs"
                              >
                                現在のパスワード
                              </FieldLabel>
                              <div className="relative">
                                <Input
                                  id="currentPassword"
                                  name="currentPassword"
                                  type={
                                    showCurrentPassword ? "text" : "password"
                                  }
                                  required
                                />
                                <button
                                  type="button"
                                  onClick={() =>
                                    setShowCurrentPassword(!showCurrentPassword)
                                  }
                                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                                >
                                  {showCurrentPassword ? (
                                    <EyeOff size={16} />
                                  ) : (
                                    <Eye size={16} />
                                  )}
                                </button>
                              </div>
                            </Field>
                            <Field>
                              <FieldLabel
                                htmlFor="newPassword"
                                className="text-xs"
                              >
                                新しいパスワード
                              </FieldLabel>
                              <div className="relative">
                                <Input
                                  id="newPassword"
                                  name="newPassword"
                                  type={showNewPassword ? "text" : "password"}
                                  required
                                />
                                <button
                                  type="button"
                                  onClick={() =>
                                    setShowNewPassword(!showNewPassword)
                                  }
                                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                                >
                                  {showNewPassword ? (
                                    <EyeOff size={16} />
                                  ) : (
                                    <Eye size={16} />
                                  )}
                                </button>
                              </div>
                            </Field>
                            <Field>
                              <FieldLabel
                                htmlFor="confirmPassword"
                                className="text-xs"
                              >
                                新しいパスワード（確認）
                              </FieldLabel>
                              <div className="relative">
                                <Input
                                  id="confirmPassword"
                                  name="confirmPassword"
                                  type={showNewPassword ? "text" : "password"}
                                  required
                                />
                                <button
                                  type="button"
                                  onClick={() =>
                                    setShowNewPassword(!showNewPassword)
                                  }
                                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                                >
                                  {showNewPassword ? (
                                    <EyeOff size={16} />
                                  ) : (
                                    <Eye size={16} />
                                  )}
                                </button>
                              </div>
                            </Field>
                          </FieldGroup>
                          <FieldError>{passwordError}</FieldError>
                          <div className="flex items-center justify-end gap-2">
                            <Button
                              type="button"
                              size="sm"
                              variant="ghost"
                              onClick={() => setPasswordDialogOpen(false)}
                            >
                              キャンセル
                            </Button>
                            <Button
                              type="submit"
                              size="sm"
                              disabled={isLoading}
                            >
                              保存
                            </Button>
                          </div>
                        </form>
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-1 pt-4 border-t">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                type="button"
                variant="destructive"
                className="w-fit mt-1"
                disabled={isLoading}
              >
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
    </div>
  );
}
