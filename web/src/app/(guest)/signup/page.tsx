"use client";

import { useState } from "react";
import { authClient } from "@/lib/auth-client";
import BrandPanel from "@/components/BrandPanel";
import SocialLogin from "@/components/SocialLogin";
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
import { Eye, EyeOff, MoveRight } from "lucide-react";
import Link from "next/link";

export default function SignupPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [nameError, setNameError] = useState<string | null>(null);

  const handleEmailSignup = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    const formData = new FormData(e.currentTarget);
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const confirmPassword = formData.get("confirmPassword") as string;

    let hasError = false;

    if (name.length > 20) {
      setNameError("20文字以下で入力してください");
      hasError = true;
    } else {
      setNameError(null);
    }

    if (password.length < 8 || password.length > 128) {
      setPasswordError("8文字以上128文字以下で入力してください");
      hasError = true;
    } else if (password !== confirmPassword) {
      setPasswordError("パスワードが一致しません");
      hasError = true;
    } else {
      setPasswordError(null);
    }

    if (hasError) {
      setIsLoading(false);
      return;
    }

    await authClient.signUp.email(
      {
        name: name || email.split("@")[0],
        email: email,
        password: password,
        callbackURL: `${window.location.origin}/welcome`,
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

  return (
    <div className="flex min-h-screen">
      <BrandPanel />
      <main className="flex-1 flex flex-col px-14 py-8 overflow-auto">
        <div className="flex justify-end items-center gap-3">
          <span className="font-mono text-xs tracking-[0.05em] text-muted-foreground">
            アカウントをお持ちの方は
          </span>
          <Link
            href="/login"
            className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-border text-sm font-medium hover:bg-muted transition-colors"
          >
            ログイン
            <MoveRight size={16} />
          </Link>
        </div>

        <div className="flex-1 flex items-center my-10">
          <div className="w-full max-w-95 mx-auto flex flex-col gap-6">
            <div>
              <p className="font-mono text-xs tracking-[0.2em] uppercase text-primary">
                はじめましょう
              </p>
              <h1 className="mt-2.5 font-serif italic text-4xl font-normal tracking-[-0.02em] leading-[1.05]">
                Start a new reading log.
              </h1>
              <p className="mt-1.5 text-sm text-muted-foreground leading-relaxed">
                メールアドレスまたは外部アカウントで新規登録
              </p>
            </div>

            <form onSubmit={handleEmailSignup} className="flex flex-col gap-3">
              <FieldGroup>
                <Field>
                  <FieldLabel htmlFor="name" className="text-xs">
                    ユーザー名
                  </FieldLabel>
                  <Input
                    id="name"
                    name="name"
                    type="text"
                    autoComplete="name"
                  />
                  {nameError && <FieldError>{nameError}</FieldError>}
                </Field>
                <Field>
                  <FieldLabel htmlFor="email" className="text-xs">
                    メールアドレス<span className="text-destructive">*</span>
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
                    パスワード<span className="text-destructive">*</span>
                  </FieldLabel>
                  <div className="relative">
                    <Input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      autoComplete="new-password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                  {passwordError && <FieldError>{passwordError}</FieldError>}
                </Field>
                <Field>
                  <FieldLabel htmlFor="confirmPassword" className="text-xs">
                    パスワード（確認）
                    <span className="text-destructive">*</span>
                  </FieldLabel>
                  <div className="relative">
                    <Input
                      id="confirmPassword"
                      name="confirmPassword"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      autoComplete="new-password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                  {passwordError && <FieldError>{passwordError}</FieldError>}
                </Field>
              </FieldGroup>
              <Button
                type="submit"
                className="w-full mt-1"
                disabled={isLoading}
              >
                {isLoading && <Spinner data-icon="inline-start" />}
                新規登録
              </Button>
            </form>

            <div className="flex items-center gap-3">
              <span className="flex-1 h-px bg-border" />
              <span className="font-mono text-xs tracking-[0.15em] uppercase text-muted-foreground">
                または
              </span>
              <span className="flex-1 h-px bg-border" />
            </div>

            <SocialLogin mode="signUp" />

            <p className="text-xs text-muted-foreground text-center leading-relaxed">
              登録すると{" "}
              <Link
                href="/terms"
                className="underline underline-offset-2 hover:text-foreground transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                利用規約
              </Link>{" "}
              および{" "}
              <Link
                href="/privacy"
                className="underline underline-offset-2 hover:text-foreground transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                プライバシーポリシー
              </Link>{" "}
              に同意したことになります。
            </p>
          </div>
        </div>
        <div className="flex justify-between items-center text-xs font-mono text-muted-foreground pt-3 border-t border-border/50">
          <span>© 2026 memetec.</span>
          <div className="flex gap-4">
            <Link
              href="/about"
              className="hover:text-foreground transition-colors"
            >
              memetec.について
            </Link>
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
