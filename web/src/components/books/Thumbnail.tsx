import Image from "next/image";
import { cn } from "@/lib/utils";

const sizeClassMap = {
  sm: { maxH: "max-h-[80px]", h: "h-[80px]" },
  md: { maxH: "max-h-[120px]", h: "h-[120px]" },
  lg: { maxH: "max-h-[160px]", h: "h-[160px]" },
} as const;

type Props = {
  thumbnailUrl: string | null;
  title: string;
  size: keyof typeof sizeClassMap;
};

export function Thumbnail({ thumbnailUrl, title, size }: Props) {
  return (
    <div className="flex justify-center items-center shrink-0">
      {thumbnailUrl ? (
        <Image
          src={thumbnailUrl}
          alt={title}
          unoptimized
          width={0}
          height={0}
          className={cn(
            "rounded-sm shrink-0 aspect-[4/5] w-auto h-auto object-contain",
            sizeClassMap[size].maxH
          )}
        />
      ) : (
        <div
          className={cn(
            "flex flex-col items-center justify-center aspect-[4/5] rounded-sm bg-muted/50 shrink-0 gap-1",
            sizeClassMap[size].h
          )}
        >
          <span className="text-xs text-muted-foreground">No Image</span>
        </div>
      )}
    </div>
  );
}
