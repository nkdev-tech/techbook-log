"use client";

import { useState } from "react";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "sonner";

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false)
  const handleLogin = async () => {
    setIsLoading(true)
    await authClient.signIn.social(
      {
        provider: "google",
        callbackURL: `${window.location.origin}/books`,
        errorCallbackURL: `${window.location.origin}/login`,
      },
      {
        onSuccess: () => {
          setIsLoading(false)
        },
        onError: (ctx) => {
          toast.error(ctx.error.message);
          setIsLoading(false)
        },
      }
    );
  };
  return (
    <div className="flex flex-col items-center justify-center py-20 gap-4">
      <Button type="button" onClick={handleLogin} disabled={isLoading}>
        {isLoading && <Spinner data-icon="inline-start" />}
        Googleでログイン
      </Button>
    </div>
  );
}
