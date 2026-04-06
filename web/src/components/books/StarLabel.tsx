import { Star } from "lucide-react";

type Props = {
  rating?: number | null;
};

export function StarLabel({ rating }: Props) {
  return (
    <div className="flex">
      {Array.from({ length: 5 }, (_, i) => (
        <Star
          key={i}
          size={16}
          color="gray"
          fill={i < (rating ?? 0) ? "gray" : "none"}
        />
      ))}
    </div>
  );
}
