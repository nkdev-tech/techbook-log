import { Star } from "lucide-react";
import { useState } from "react";

type Props = {
  rating: number | null;
  size?: number;
  disabled?: boolean;
  onChange?: (value: number) => void;
};

export function StarRating({
  rating,
  size = 24,
  disabled = false,
  onChange,
}: Props) {
  return (
    <div className="flex">
      {Array.from({ length: 5 }, (_, i) => (
        <Star
          key={i}
          size={size}
          color="gray"
          fill={i < (rating ?? 0) ? "gray" : "none"}
          onClick={() => {
            if (disabled) return;
            onChange?.(i + 1);
          }}
          style={{ cursor: disabled ? "default" : "pointer" }}
        />
      ))}
    </div>
  );
}
