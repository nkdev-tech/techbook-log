"use client";

import { useState } from "react";
import { authClient } from "@/lib/auth-client";
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
import Image from "next/image";
import Link from "next/link";
import { LogoMark, Wordmark } from "@/components/Logo";

export default function SignupPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);

  const handleEmailSignup = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const confirmPassword = formData.get("confirmPassword") as string;

    let hasError = false;

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setEmailError("正しいメールアドレスを入力してください");
      hasError = true;
    } else {
      setEmailError(null);
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
        name: email.split("@")[0],
        email: email,
        password: password,
      },
      {
        onSuccess: () => {
          window.location.href = "/books";
        },
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
      <aside className="hidden lg:flex w-[480px] shrink-0 bg-primary flex-col justify-between p-10">
        <div className="flex items-center gap-3 text-primary-foreground">
          <LogoMark size={28} color="white" />
          <Wordmark size={24} color="currentColor" />
        </div>
        <div className="flex flex-col gap-5">
          <p className="font-mono text-[11px] tracking-[0.2em] uppercase text-primary-foreground/70">
            A quiet place
            <br />
            for your technical reading notes
          </p>
          <h2 className="font-serif italic text-[38px] font-normal text-primary-foreground leading-[1.15] tracking-[-0.015em]">
            Every book you read
            <br />
            builds your knowledge.
          </h2>
          <p className="text-[13.5px] text-primary-foreground/75 leading-relaxed max-w-[360px]">
            技術書を読んで、学びを蓄積しましょう。本ごとに記録したメモは横断検索できます。ここはあなただけの読書記録が残せる場所です。
          </p>
        </div>
        <div />
      </aside>
      <main className="flex-1 flex flex-col px-14 py-8 overflow-auto">
        <div className="flex justify-end items-center gap-3">
          <span className="font-mono text-[10.5px] tracking-[0.05em] text-muted-foreground">
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

        <div className="flex-1 flex items-center">
          <div className="w-full max-w-[380px] mx-auto flex flex-col gap-6">
            <div>
              <p className="font-mono text-[10.5px] tracking-[0.2em] uppercase text-primary">
                はじめましょう
              </p>
              <h1 className="mt-2.5 font-serif italic text-[38px] font-normal tracking-[-0.02em] leading-[1.05]">
                Start a new reading log.
              </h1>
              <p className="mt-1.5 text-sm text-muted-foreground leading-relaxed">
                メールアドレスまたは外部アカウントで新規登録
              </p>
            </div>

            <form onSubmit={handleEmailSignup} className="flex flex-col gap-3">
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
                  {emailError && <FieldError>{emailError}</FieldError>}
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
              <span className="font-mono text-[10px] tracking-[0.15em] uppercase text-muted-foreground">
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
                src="/google-signup.svg"
                alt="Sign up with Google"
                width={175}
                height={40}
              />
            </button>
            <p className="text-[10px] text-muted-foreground text-center leading-relaxed">
              登録すると{" "}
              <Link
                href="/terms"
                className="underline underline-offset-2 hover:text-foreground transition-colors"
              >
                利用規約
              </Link>{" "}
              および{" "}
              <Link
                href="/privacy"
                className="underline underline-offset-2 hover:text-foreground transition-colors"
              >
                プライバシーポリシー
              </Link>{" "}
              に同意したことになります。
            </p>
          </div>
        </div>
        <div className="flex justify-between items-center text-[11px] font-mono text-muted-foreground pt-3 border-t border-border/50">
          <span>© 2026 memetec.</span>
          <div className="flex gap-4">
            <Link
              href="/terms"
              className="hover:text-foreground transition-colors"
            >
              利用規約
            </Link>
            <Link
              href="/privacy"
              className="hover:text-foreground transition-colors"
            >
              プライバシーポリシー
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
