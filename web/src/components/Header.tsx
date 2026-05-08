"use client";

import { useEffect, useState } from "react";
import { authClient } from "@/lib/auth-client";
import { LogoMark, Wordmark } from "@/components/Logo";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "sonner";
import { ChevronDown, LogOut } from "lucide-react";

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
      <div className="flex justify-between items-center mt-3 mb-2">
        <div className="flex items-center gap-2">
          <LogoMark />
          <Wordmark />
        </div>
        {session && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                type="button"
                variant="outline"
                className="pl-[4px] rounded-full"
              >
                <Avatar size="sm">
                  <AvatarImage src={session.user.image ?? ""} />
                  <AvatarFallback>
                    {session.user.name?.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div className="text-xs">{session.user.name}</div>
                <ChevronDown />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className="w-40"
              align="start"
              collisionPadding={16}
            >
              <DropdownMenuGroup>
                <DropdownMenuLabel className="truncate">
                  {session.user.email}
                </DropdownMenuLabel>
                <DropdownMenuItem
                  variant="destructive"
                  onClick={handleLogout}
                  disabled={isLoading}
                  className="gap-2"
                >
                  <LogOut />
                  ログアウト
                  {isLoading && <Spinner data-icon="inline-start" />}
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </header>
  );
}
