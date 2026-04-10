import { FileQuestion } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center py-20 gap-4">
      <FileQuestion size={80} className="text-muted-foreground" />
      <h2 className="text-2xl font-bold text-muted-foreground">
        ページが見つかりません
      </h2>
      <p className="text-muted-foreground">
        お探しのページは存在しないか、移動した可能性があります。
      </p>
      <Button asChild variant="link">
        <Link href="/books">ホームに戻る</Link>
      </Button>
    </div>
  );
}
