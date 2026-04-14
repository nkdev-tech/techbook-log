import { Badge } from "@/components/ui/badge";
import { Hash } from "lucide-react";

type Props = {
  tags: { name: string }[];
};

export function Tag({ tags }: Props) {
  return (
    <div className="flex flex-wrap gap-1">
      {tags.map((tag, i) => (
        <Badge
          key={`tag-${i}`}
          variant="secondary"
          className="my-1 p-3 text-sm"
        >
          <Hash />
          {tag.name}
        </Badge>
      ))}
    </div>
  );
}
