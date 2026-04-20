import { Card, CardContent } from "@/components/ui/card";
import { Pen } from "lucide-react";
import { Button } from "../ui/button";

type Props = {
  memo: {
    id: number;
    content: string;
  };
  onEdit: () => void;
};

export function Memo({ memo, onEdit }: Props) {
  return (
    <Card
      key={memo.id}
      className="relative bg-yellow-100 rounded-none min-h-40 py-5 group"
    >
      <CardContent className="h-full px-5">
        <p className="whitespace-pre-wrap">{memo.content}</p>
      </CardContent>
      <Button
        type="button"
        variant="ghost"
        className="absolute top-3 right-3 invisible group-hover:visible bg-yellow-100/80 hover:bg-yellow-100/80 backdrop-blur-xs rounded-full"
        onClick={() => onEdit()}
      >
        <Pen
          size={16}
          className="text-muted-foreground hover:text-foreground"
        />
      </Button>
    </Card>
  );
}
