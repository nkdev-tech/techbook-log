import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";

export function StatusFilter() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const statusParam = searchParams.get("status") ?? undefined;

  const handleSearch = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value.length > 0) {
      params.set("status", value);
    } else {
      params.delete("status");
    }
    router.push(`/books?${params.toString()}`);
  };

  return (
    <div className="flex gap-1">
      <Button
        type="button"
        variant={statusParam === undefined ? "default" : "outline"}
        className="rounded-full"
        onClick={() => handleSearch("")}
      >
        全て
      </Button>
      <Button
        type="button"
        variant={statusParam === "unread" ? "default" : "outline"}
        className="rounded-full"
        onClick={() => handleSearch("unread")}
      >
        積読
      </Button>
      <Button
        type="button"
        variant={statusParam === "reading" ? "default" : "outline"}
        className="rounded-full"
        onClick={() => handleSearch("reading")}
      >
        読書中
      </Button>
      <Button
        type="button"
        variant={statusParam === "done" ? "default" : "outline"}
        className="rounded-full"
        onClick={() => handleSearch("done")}
      >
        読了
      </Button>
    </div>
  );
}
