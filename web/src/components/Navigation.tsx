"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Fragment } from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

export const PageRoute = {
  HOME: { pattern: /^\/books$/, label: "書籍一覧" },
  BOOKS_NEW: { pattern: /^\/books\/new$/, label: "新規登録" },
  BOOKS_DETAIL: { pattern: /^\/books\/\d+$/, label: "詳細" },
  BOOKS_EDIT: { pattern: /^\/books\/\d+\/edit$/, label: "編集" },
  MEMOS: { pattern: /^\/memos$/, label: "メモ検索" },
  SETTINGS: { pattern: /^\/settings$/, label: "設定" },
} as const;

function generateBreadcrumbs(segments: string[]) {
  let currentPath = "";
  return segments.map((item) => {
    currentPath += `/${item}`;
    const matched = Object.values(PageRoute).find(({ pattern }) =>
      pattern.test(currentPath)
    );
    return {
      path: currentPath,
      label: matched?.label ?? item,
    };
  });
}

export default function Navigation() {
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean);
  const breadcrumbPaths = generateBreadcrumbs(segments);

  return (
    <div className="flex items-center mb-2 h-6">
      <Breadcrumb className="h-full">
        <BreadcrumbList className="h-full">
          {breadcrumbPaths.map(({ path, label }, index) => (
            <Fragment key={path}>
              {index !== 0 && <BreadcrumbSeparator />}
              <BreadcrumbItem>
                {index !== breadcrumbPaths.length - 1 && (
                  <BreadcrumbLink asChild>
                    <Link href={path}>{label}</Link>
                  </BreadcrumbLink>
                )}
                {index === breadcrumbPaths.length - 1 && (
                  <BreadcrumbPage>{label}</BreadcrumbPage>
                )}
              </BreadcrumbItem>
            </Fragment>
          ))}
        </BreadcrumbList>
      </Breadcrumb>
    </div>
  );
}
