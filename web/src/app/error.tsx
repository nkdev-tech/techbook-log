"use client";

import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

type Props = {
  _error: Error;
  reset: () => void;
};

export default function Error({ reset }: Props) {
  return (
    <div className="flex flex-col items-center justify-center py-20 gap-4">
      <AlertCircle size={64} className="text-muted-foreground" />
      <h2 className="text-2xl font-bold text-muted-foreground">
        エラーが発生しました
      </h2>
      <p className="text-muted-foreground">
        予期せぬエラーが発生しました。しばらくしてから再度お試しください。
      </p>
      <Button variant="link" onClick={reset}>
        再試行
      </Button>
    </div>
  );
}
