"use client";

import Link from "next/link";
import { useSelectedLayoutSegments } from "next/navigation";
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
  HOME: { pattern: /^\/books$/, label: "ホーム" },
  BOOKS_NEW: { pattern: /^\/books\/new$/, label: "新規登録" },
  BOOKS_DETAIL: { pattern: /^\/books\/\d+$/, label: "詳細" },
  BOOKS_EDIT: { pattern: /^\/books\/\d+\/edit$/, label: "編集" },
} as const;

function generateBreadcrumbs(segments: string[]) {
  if (segments.length < 2) return null;

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
  const segments = useSelectedLayoutSegments();
  const breadcrumbPaths = generateBreadcrumbs(segments);

  if (breadcrumbPaths === null) return;

  return (
    <div className="flex item-center my-3 h-[2rem]">
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
                  <BreadcrumbPage className="font-medium">
                    {label}
                  </BreadcrumbPage>
                )}
              </BreadcrumbItem>
            </Fragment>
          ))}
        </BreadcrumbList>
      </Breadcrumb>
    </div>
  );
}
