import { useEffect, useState } from "react";

type ViewMode = "grid" | "table";

export function useViewMode() {
  const [viewMode, setViewMode] = useState<ViewMode>("table");

  useEffect(() => {
    const stored = localStorage.getItem("book-view-mode");
    if (stored === "grid" || stored === "table") setViewMode(stored);
  }, []);

  const changeViewMode = (select: ViewMode) => {
    setViewMode(select);
    localStorage.setItem("book-view-mode", select);
  };

  return [viewMode, { changeViewMode }] as const;
}
