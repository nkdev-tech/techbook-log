import { GetApiBooks200Item } from "@/external/api";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { STATUS_LABEL } from "@/shared/utils/book";
import { StarRating } from "@/components/books/StarRating";
import { Tag } from "@/components/books/Tag";
import { Thumbnail } from "@/components/books/Thumbnail";
import Link from "next/link";

type Props = {
  books?: GetApiBooks200Item[];
};

export function BookGridView({ books }: Props) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
      {books?.map((book) => {
        return (
          <Link
            key={book.id}
            href={`/books/${book.id}`}
            className="block h-full rounded-lg"
          >
            <Card className="cursor-pointer h-full gap-0">
              <Thumbnail
                thumbnailUrl={book.thumbnailUrl}
                title={book.title}
                size="md"
              />
              <div className="flex flex-col w-full gap-1 my-1">
                <CardHeader>
                  <CardTitle className="text-sm font-bold line-clamp-2 min-h-[2.6rem]">
                    {book.title}
                  </CardTitle>
                  <CardDescription className="text-xs truncate min-h-[1rem]">
                    {book.author}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-1">
                  <div>{STATUS_LABEL[book.status] ?? book.status}</div>
                  <StarRating rating={book.rating} size="sm" disabled={true} />
                  <div className="overflow-hidden max-h-[2.1rem] min-h-[2.1rem]">
                    <Tag
                      tags={book.tags ?? []}
                      iconSize={12}
                      textSize="text-xs"
                    />
                  </div>
                </CardContent>
              </div>
            </Card>
          </Link>
        );
      })}
    </div>
  );
}
