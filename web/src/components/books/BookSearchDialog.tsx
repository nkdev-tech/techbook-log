import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Spinner } from "@/components/ui/spinner";
import { GetApiBookSearch200Item, useGetApiBookSearch } from "@/external/api";
import { useState } from "react";
import Image from "next/image";
import { Search } from "lucide-react";

type Props = {
  onSelect: (book: GetApiBookSearch200Item) => void;
};

export function BookSearchDialog({ onSelect }: Props) {
  const [open, setOpen] = useState(false);
  const [keyword, setKeyword] = useState("");
  const { data, refetch, isLoading, error } = useGetApiBookSearch(
    { q: keyword },
    { query: { enabled: false } }
  );

  const handleSearch = () => {
    if (keyword === "") return;
    refetch();
  };

  let content = null;
  if (isLoading) {
    content = (
      <div className="flex justify-center items-center h-full">
        <Spinner className="size-12" />
      </div>
    );
  } else if (error || (data && data.status !== 200)) {
    content = (
      <p className="text-sm text-destructive py-4">
        サーバーエラーが発生しました。
      </p>
    );
  } else if (data && data.data.length === 0) {
    content = (
      <p className="text-sm text-muted-foreground py-4">
        見つかりませんでした。
      </p>
    );
  } else if (data) {
    content = (
      <ScrollArea className="h-full">
        <div className="space-y-1 pr-3">
          {data.data.map((book, i) => (
            <button
              key={i}
              type="button"
              className="flex w-full text-left gap-3 items-start p-2 rounded-md hover:bg-accent transition-colors"
              onClick={() => {
                setOpen(false);
                onSelect(book);
              }}
            >
              <div className="flex w-[80px] h-[100px] shrink-0 justify-center items-center">
                {book.thumbnailUrl ? (
                  <Image
                    src={book.thumbnailUrl}
                    alt={book.title}
                    unoptimized
                    width={0}
                    height={0}
                    className="rounded-sm shrink-0 max-h-[100px] max-w-full w-auto h-auto object-contain"
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center w-full h-full rounded-sm bg-muted/50 shrink-0 gap-1">
                    <span className="text-xs text-muted-foreground">
                      No Image
                    </span>
                  </div>
                )}
              </div>
              <div className="flex flex-col gap-0.5 min-w-0">
                <p className="text-sm font-medium leading-snug line-clamp-2">
                  {book.title}
                </p>
                <p className="text-xs text-muted-foreground">{book.author}</p>
                {book.publisher && (
                  <p className="text-xs text-muted-foreground">
                    {book.publisher}
                  </p>
                )}
              </div>
            </button>
          ))}
        </div>
      </ScrollArea>
    );
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="secondary">書籍検索</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>書籍検索</DialogTitle>
          <DialogDescription>タイトルを入力してください</DialogDescription>
        </DialogHeader>
        <div className="flex gap-2">
          <InputGroup className="flex-1">
            <InputGroupAddon>
              <Search className="text-muted-foreground" />
            </InputGroupAddon>
            <InputGroupInput
              id="keyword"
              name="keyword"
              onChange={(e) => setKeyword(e.target.value)}
            />
          </InputGroup>
          <Button type="button" onClick={handleSearch} disabled={isLoading}>
            検索
          </Button>
        </div>
        <div className="h-80">{content}</div>
      </DialogContent>
    </Dialog>
  );
}
