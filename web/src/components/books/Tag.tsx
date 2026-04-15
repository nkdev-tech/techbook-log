import { Badge } from "@/components/ui/badge";
import { Hash } from "lucide-react";
import { cn } from "@/lib/utils";

type Props = {
  tags: { name: string }[];
  iconSize: number;
  textSize: string;
};

const colors = [
  "bg-red-100 text-red-700",
  "bg-blue-100 text-blue-700",
  "bg-green-100 text-green-700",
  "bg-yellow-100 text-yellow-700",
  "bg-purple-100 text-purple-700",
  "bg-pink-100 text-pink-700",
  "bg-orange-100 text-orange-700",
  "bg-teal-100 text-teal-700",
  "bg-indigo-100 text-indigo-700",
  "bg-cyan-100 text-cyan-700",
  "bg-lime-100 text-lime-700",
  "bg-emerald-100 text-emerald-700",
];

export const getTagColor = (name: string) => {
  const hash = name
    .split("")
    .reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return colors[hash % colors.length];
};

export function Tag({ tags, iconSize, textSize }: Props) {
  return (
    <div className="flex flex-wrap gap-1">
      {tags.map((tag) => (
        <Badge
          key={tag.name}
          variant="secondary"
          className={cn("my-1 p-3 text-sm", textSize, getTagColor(tag.name))}
        >
          <Hash data-icon="inline-start" size={iconSize} />
          {tag.name}
        </Badge>
      ))}
    </div>
  );
}
