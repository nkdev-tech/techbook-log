"use client";

import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function LoginPage() {
  const handleLogin = async () => {
    try {
      await authClient.signIn.social({
        provider: "google",
        callbackURL: `${window.location.origin}/books`,
      });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : String(error));
    }
  };
  return (
    <div className="flex flex-col items-center justify-center py-20 gap-4">
      <Button type="button" onClick={handleLogin}>
        Googleでログイン
      </Button>
    </div>
  );
}
