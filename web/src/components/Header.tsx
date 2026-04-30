"use client";

import { useEffect, useState } from "react";
import { authClient } from "@/lib/auth-client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "sonner";

export default function Header() {
  const [isLoading, setIsLoading] = useState(false);
  const { data: session, isPending } = authClient.useSession();

  useEffect(() => {
    if (!isPending && !session) {
      window.location.href = "/login";
    }
  }, [session, isPending]);

  const handleLogout = async () => {
    setIsLoading(true);
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          window.location.href = "/login";
        },
        onError: () => {
          toast.error("ログアウトに失敗しました");
          setIsLoading(false);
        },
      },
    });
  };

  return (
    <header className="sticky top-0 px-4 bg-background">
      <div className="flex justify-between mt-3 mb-2">
        <h1 className="text-2xl font-bold tracking-wider text-primary">
          Techbook Log
        </h1>
        {session && (
          <div className="flex items-center mx-2 gap-4">
            <div className="flex items-center gap-2">
              <div className="text-sm">{session.user.name}</div>
              <Avatar>
                <AvatarImage src={session.user.image ?? ""} />
                <AvatarFallback>{session.user.name?.charAt(0)}</AvatarFallback>
              </Avatar>
            </div>
            <Button
              type="button"
              variant="secondary"
              onClick={handleLogout}
              disabled={isLoading}
            >
              {isLoading && <Spinner data-icon="inline-start" />}
              ログアウト
            </Button>
          </div>
        )}
      </div>
    </header>
  );
}
