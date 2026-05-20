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
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "sonner";
import { ChevronDown, LogOut } from "lucide-react";
import Link from "next/link";

export default function Header({
  requireAuth = true,
}: {
  requireAuth?: boolean;
}) {
  const [isLoading, setIsLoading] = useState(false);
  const { data: session, isPending } = authClient.useSession();

  useEffect(() => {
    if (requireAuth && !isPending && !session) {
      window.location.href = "/login";
    }
  }, [requireAuth, session, isPending]);

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
    <header className="sticky top-0 z-10 h-(--header-height) px-4 bg-background border-b">
      <div className="flex justify-between items-center h-full">
        <Link
          className="flex items-center gap-2 focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none rounded-sm"
          href="/"
        >
          <LogoMark />
          <Wordmark />
        </Link>
        {session && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                type="button"
                variant="outline"
                className="px-1 rounded-full"
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
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  variant="destructive"
                  onClick={handleLogout}
                  disabled={isLoading}
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
