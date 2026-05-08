import { useRouter } from "next/navigation";
import { GetApiBooks200Item } from "@/external/api";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { STATUS_LABEL } from "@/shared/utils/book";
import { StarRating } from "@/components/books/StarRating";
import { Tag } from "@/components/books/Tag";
import { Thumbnail } from "@/components/books/Thumbnail";

type Props = {
  books?: GetApiBooks200Item[];
};

export function BookTableView({ books }: Props) {
  const router = useRouter();
  return (
    <div className="w-full border-1 rounded-lg overflow-x-auto">
      <Table className="w-full min-w-[680px] table-fixed">
        <TableHeader className="bg-muted">
          <TableRow>
            <TableHead className="w-full text-center text-muted-foreground">
              タイトル/著者
            </TableHead>
            <TableHead className="w-[120px] text-center text-muted-foreground">
              ステータス
            </TableHead>
            <TableHead className="w-[120px] text-center text-muted-foreground">
              評価
            </TableHead>
            <TableHead className="w-[250px] text-center text-muted-foreground">
              タグ
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {books?.map((book) => {
            return (
              <TableRow
                key={book.id}
                onClick={() => router.push(`/books/${book.id}/`)}
                className="cursor-pointer"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    router.push(`/books/${book.id}/`);
                  }
                }}
              >
                <TableCell className="w-full max-w-0">
                  <div className="flex items-center gap-4 overflow-hidden">
                    <Thumbnail
                      thumbnailUrl={book.thumbnailUrl}
                      title={book.title}
                      size="sm"
                    />
                    <div className="min-w-0">
                      <div className="text-base font-bold truncate">
                        {book.title}
                      </div>
                      <div className="text-xs text-muted-foreground truncate">
                        {book.author}
                      </div>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="w-[120px] text-center">
                  {STATUS_LABEL[book.status] ?? book.status}
                </TableCell>
                <TableCell className="w-[120px]">
                  <div className="flex justify-center">
                    <StarRating
                      rating={book.rating}
                      size="sm"
                      disabled={true}
                    />
                  </div>
                </TableCell>
                <TableCell className="w-[250px]">
                  <Tag
                    tags={book.tags ?? []}
                    iconSize={12}
                    textSize="text-xs"
                  />
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
