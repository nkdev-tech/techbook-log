import { useState } from "react";

type viewMode = "grid" | "table";

export function useViewMode() {
  const [viewMode, setViewMode] = useState<viewMode>(
    typeof window !== "undefined"
      ? ((localStorage.getItem("book-view-mode") as viewMode) ?? "table")
      : "table"
  );

  const changeViewMode = (select: viewMode) => {
    setViewMode(select);
    localStorage.setItem("book-view-mode", select);
  };

  return [viewMode, { changeViewMode }] as const;
}
