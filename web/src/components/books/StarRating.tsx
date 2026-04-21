import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Star } from "lucide-react";

const sizeClassMap = {
  sm: "size-4",
  md: "size-6",
  lg: "size-8",
} as const;

type Props = {
  rating: number | null;
  size?: keyof typeof sizeClassMap;
  disabled?: boolean;
  onChange?: (value: number | null) => void;
};

export function StarRating({
  rating,
  size = "md",
  disabled = false,
  onChange,
}: Props) {
  return (
    <div className="flex">
      {Array.from({ length: 5 }, (_, i) => (
        <Button
          key={i}
          type="button"
          variant="ghost"
          className={cn("h-auto w-auto p-0", disabled && "pointer-events-none")}
          tabIndex={disabled ? -1 : 0}
          onClick={() => {
            const newValue = i + 1 === rating ? null : i + 1;
            onChange?.(newValue);
          }}
        >
          <Star
            className={sizeClassMap[size]}
            color="gold"
            fill={i < (rating ?? 0) ? "gold" : "none"}
          />
        </Button>
      ))}
    </div>
  );
}
