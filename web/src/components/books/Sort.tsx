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
import { ArrowDown, ArrowUp } from "lucide-react";

export function Sort() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const sortByParam = searchParams.get("sortBy") ?? undefined;
  const orderParam = searchParams.get("order") ?? undefined;

  const handleChangeSortBy = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value.length > 0) {
      params.set("sortBy", value);
    } else {
      params.delete("sortBy");
    }
    router.push(`/books?${params.toString()}`);
  };

  const handleChangeOrder = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value.length > 0) {
      params.set("order", value);
    } else {
      params.delete("order");
    }
    router.push(`/books?${params.toString()}`);
  };

  return (
    <div className="flex gap-1 items-center">
      <Select
        value={sortByParam ?? "createdAt"}
        onValueChange={(value) => handleChangeSortBy(value)}
      >
        <SelectTrigger className="w-[180px]">
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
          onClick={() => handleChangeOrder("asc")}
        >
          <ArrowDown />
        </Button>
      ) : (
        <Button
          type="button"
          variant="outline"
          size="icon"
          onClick={() => handleChangeOrder("desc")}
        >
          <ArrowUp />
        </Button>
      )}
    </div>
  );
}
