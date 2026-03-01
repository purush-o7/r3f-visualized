import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Drei Performance",
  description:
    "Use drei's Instances, BVH, AdaptiveDpr, and demand rendering for optimized scenes.",
  openGraph: {
    title: "Drei Performance",
    description:
      "Use drei's Instances, BVH, AdaptiveDpr, and demand rendering for optimized scenes.",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
