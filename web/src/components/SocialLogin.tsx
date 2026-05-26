"use client";

import { useState } from "react";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
import Image from "next/image";

type Props = {
  mode: "signIn" | "signUp";
}

export default function SocialLogin({ mode }: Props) {
  const [isLoading, setIsLoading] = useState(false);

  const handleSocialLogin = async (provider: string) => {
    setIsLoading(true);
    await authClient.signIn.social(
      {
        provider: provider,
        callbackURL: `${window.location.origin}/books`,
        errorCallbackURL: `${window.location.origin}${mode === "signUp" ? "/signup" : "/login"}`,
      },
      {
        onError: (ctx) => {
          toast.error(ctx.error.message);
          setIsLoading(false);
        },
      }
    );
  };

  return(
    <div className="flex flex-col items-center gap-2">
      <button
        type="button"
        onClick={() => handleSocialLogin("google")}
        disabled={isLoading}
        className="disabled:opacity-50 mx-auto block rounded-full"
      >
        <Image
          src={mode === "signIn" ? "/google-signin.svg": "/google-signup.svg"}
          alt={mode === "signIn" ? "Sign in with Google" : "Sign up with Google"}
          width={175}
          height={40}
        />
      </button>
      <button
        type="button"
        onClick={() => handleSocialLogin("github")}
        disabled={isLoading}
        className="disabled:opacity-50 flex items-center justify-center gap-1.5 h-10 w-[175px] border border-black/60 rounded-full whitespace-nowrap"
      >
        <Image
          src="/github-mark.svg"
          alt="GitHub"
          width={22}
          height={22}
        />
        <span className="text-sm font-medium tracking-tight inline-block scale-x-95">{mode === "signIn" ? "Sign in with GitHub" : "Sign up with GitHub"}</span>
      </button>
    </div>
  )
}
