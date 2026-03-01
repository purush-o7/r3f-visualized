"use client";

import dynamic from "next/dynamic";

const CategoryBackground = dynamic(
  () =>
    import("@/components/category-background").then((m) => ({
      default: m.CategoryBackground,
    })),
  { ssr: false }
);

export function CategoryBg({ category }: { category: string }) {
  return <CategoryBackground category={category} />;
}
