import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowDownWideNarrow, ArrowUpNarrowWide } from "lucide-react";

export function Sort() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const sortByParam = searchParams.get("sortBy") ?? undefined;
  const orderParam = searchParams.get("order") ?? undefined;

  const handleChangeSortBy = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("sortBy", value);
    router.replace(`/books?${params.toString()}`);
  };

  const handleChangeOrder = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("order", value);
    router.replace(`/books?${params.toString()}`);
  };

  return (
    <div className="flex gap-1 items-center">
      <Select
        value={sortByParam ?? "createdAt"}
        onValueChange={handleChangeSortBy}
      >
        <SelectTrigger className="w-[100px]">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectItem value="createdAt">作成日</SelectItem>
            <SelectItem value="title">タイトル</SelectItem>
            <SelectItem value="rating">評価</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
      {orderParam === undefined || orderParam === "desc" ? (
        <Button
          type="button"
          variant="outline"
          size="icon"
          aria-label="降順"
          onClick={() => handleChangeOrder("asc")}
        >
          <ArrowDownWideNarrow />
        </Button>
      ) : (
        <Button
          type="button"
          variant="outline"
          size="icon"
          aria-label="昇順"
          onClick={() => handleChangeOrder("desc")}
        >
          <ArrowUpNarrowWide />
        </Button>
      )}
    </div>
  );
}
