"use client";

import { useState } from "react";
import { authClient } from "@/lib/auth-client";
import BrandPanel from "@/components/BrandPanel";
import { Button } from "@/components/ui/button";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "sonner";
import { Eye, EyeOff, MoveRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleEmailLogin = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    await authClient.signIn.email(
      {
        email,
        password,
        rememberMe: true,
        callbackURL: `${window.location.origin}/books`,
      },
      {
        onError: (ctx) => {
          toast.error(ctx.error.message);
          setIsLoading(false);
        },
      }
    );
  };

  const handleSocialLogin = async () => {
    setIsLoading(true);
    await authClient.signIn.social(
      {
        provider: "google",
        callbackURL: `${window.location.origin}/books`,
        errorCallbackURL: `${window.location.origin}/login`,
      },
      {
        onError: (ctx) => {
          toast.error(ctx.error.message);
          setIsLoading(false);
        },
      }
    );
  };

  return (
    <div className="flex min-h-screen">
      <BrandPanel />
      <main className="flex-1 flex flex-col px-14 py-8 overflow-auto">
        <div className="flex justify-end items-center gap-3">
          <span className="font-mono text-xs tracking-[0.05em] text-muted-foreground">
            アカウントをお持ちでない方は
          </span>
          <Link
            href="/signup"
            className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-border text-sm font-medium hover:bg-muted transition-colors"
          >
            新規登録
            <MoveRight size={16} />
          </Link>
        </div>

        <div className="flex-1 flex items-center my-10">
          <div className="w-full max-w-95 mx-auto flex flex-col gap-6">
            <div>
              <p className="font-mono text-xs tracking-[0.2em] uppercase text-primary">
                おかえりなさい
              </p>
              <h1 className="mt-2.5 font-serif italic text-4xl font-normal tracking-[-0.02em] leading-[1.05]">
                Open your library.
              </h1>
              <p className="mt-1.5 text-sm text-muted-foreground leading-relaxed">
                メールアドレスまたは外部アカウントでログイン
              </p>
            </div>

            <form onSubmit={handleEmailLogin} className="flex flex-col gap-3">
              <FieldGroup>
                <Field>
                  <FieldLabel htmlFor="email" className="text-xs">
                    メールアドレス
                  </FieldLabel>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="name@example.com"
                    autoComplete="email"
                  />
                </Field>
                <Field>
                  <FieldLabel htmlFor="password" className="text-xs">
                    パスワード
                  </FieldLabel>
                  <div className="relative">
                    <Input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      autoComplete="current-password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </Field>
              </FieldGroup>
              <Button
                type="submit"
                className="w-full mt-1"
                disabled={isLoading}
              >
                {isLoading && <Spinner data-icon="inline-start" />}
                ログイン
              </Button>
            </form>

            <div className="flex items-center gap-3">
              <span className="flex-1 h-px bg-border" />
              <span className="font-mono text-xs tracking-[0.15em] uppercase text-muted-foreground">
                または
              </span>
              <span className="flex-1 h-px bg-border" />
            </div>

            <button
              type="button"
              onClick={handleSocialLogin}
              disabled={isLoading}
              className="disabled:opacity-50 mx-auto block"
            >
              <Image
                src="/google-signin.svg"
                alt="Sign in with Google"
                width={175}
                height={40}
              />
            </button>
          </div>
        </div>
        <div className="flex justify-between items-center text-xs font-mono text-muted-foreground pt-3 border-t border-border/50">
          <span>© 2026 memetec.</span>
          <div className="flex gap-4">
            <Link
              href="/terms"
              className="hover:text-foreground transition-colors"
              target="_blank"
              rel="noopener noreferrer"
            >
              利用規約
            </Link>
            <Link
              href="/privacy"
              className="hover:text-foreground transition-colors"
              target="_blank"
              rel="noopener noreferrer"
            >
              プライバシーポリシー
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
