import { Star } from "lucide-react";

type Props = {
  rating: number | null;
  size?: number;
  disabled?: boolean;
  onChange?: (value: number | null) => void;
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
          color="var(--color-border)"
          fill={i < (rating ?? 0) ? "var(--color-border)" : "none"}
          onClick={() => {
            if (disabled) return;
            const newValue = i + 1 === rating ? null : i + 1;
            onChange?.(newValue);
          }}
          style={{ cursor: disabled ? "default" : "pointer" }}
        />
      ))}
    </div>
  );
}
