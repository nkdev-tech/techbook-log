import { useState } from "react";
import { useParams } from "next/navigation";
import { useGetApiBooksIdMemos } from "@/external/api";
import { Memo } from "@/components/books/Memo";
import { MemoForm } from "@/components/books/MemoForm";
import { Plus } from "lucide-react";

export function MemoList() {
  const { id } = useParams<{ id: string }>();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingMemoId, setEditingMemoId] = useState<number | null>(null);
  const { data } = useGetApiBooksIdMemos(id);

  if (!data || data.status !== 200) {
    return null;
  }

  const memos = data.data;

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 items-start gap-4 my-4">
      {memos.map((memo) =>
        editingMemoId === memo.id ? (
          <MemoForm
            key={memo.id}
            memo={memo}
            onSuccess={() => setEditingMemoId(null)}
            onCancel={() => setEditingMemoId(null)}
          />
        ) : (
          <Memo
            key={memo.id}
            memo={memo}
            onEdit={() => setEditingMemoId(memo.id)}
          />
        )
      )}
      {isFormOpen ? (
        <MemoForm
          onSuccess={() => setIsFormOpen(false)}
          onCancel={() => setIsFormOpen(false)}
        />
      ) : (
        <button
          type="button"
          className="flex items-center justify-center border-2 border-dashed rounded-none cursor-pointer h-40 w-full"
          onClick={() => setIsFormOpen(true)}
        >
          <Plus size={48} className="text-muted-foreground" />
        </button>
      )}
    </div>
  );
}
