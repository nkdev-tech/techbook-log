import { useState } from "react";

type ViewMode = "grid" | "table";

export function useViewMode() {
  const [viewMode, setViewMode] = useState<ViewMode>(() => {
    if (typeof window === "undefined") return "table";
    const stored = localStorage.getItem("book-view-mode");
    return stored === "grid" || stored === "table" ? stored : "table";
  });

  const changeViewMode = (select: ViewMode) => {
    setViewMode(select);
    localStorage.setItem("book-view-mode", select);
  };

  return [viewMode, { changeViewMode }] as const;
}
