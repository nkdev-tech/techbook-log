import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";

export function StatusFilter() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const statusParams = searchParams.get("status") ?? undefined;

  const handleSearch = (values: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (values.length > 0) {
      params.set("status", values);
    } else {
      params.delete("status");
    }
    router.push(`/books?${params.toString()}`);
  };

  return (
    <div className="flex gap-1">
      <Button
        type="button"
        variant={statusParams === undefined ? "default" : "outline"}
        className="rounded-full"
        onClick={() => handleSearch("")}
      >
        全て
      </Button>
      <Button
        type="button"
        variant={statusParams === "unread" ? "default" : "outline"}
        className="rounded-full"
        onClick={() => handleSearch("unread")}
      >
        積読
      </Button>
      <Button
        type="button"
        variant={statusParams === "reading" ? "default" : "outline"}
        className="rounded-full"
        onClick={() => handleSearch("reading")}
      >
        読書中
      </Button>
      <Button
        type="button"
        variant={statusParams === "done" ? "default" : "outline"}
        className="rounded-full"
        onClick={() => handleSearch("done")}
      >
        読了
      </Button>
    </div>
  );
}
