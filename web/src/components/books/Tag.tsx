import { Badge } from "@/components/ui/badge";
import { Hash } from "lucide-react";
import { cn } from "@/lib/utils";

type Props = {
  tags: { name: string }[];
  iconSize: number;
  textSize: string;
};

export function Tag({ tags, iconSize, textSize }: Props) {
  return (
    <div className="flex flex-wrap gap-1">
      {tags.map((tag, i) => (
        <Badge
          key={`tag-${i}`}
          variant="secondary"
          className={cn("my-1 p-3 text-sm", textSize)}
        >
          <Hash data-icon="inline-start" size={iconSize} />
          {tag.name}
        </Badge>
      ))}
    </div>
  );
}
