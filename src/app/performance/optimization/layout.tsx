import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Optimization Tips",
  description:
    "Reduce draw calls, use instancing, avoid React re-renders, and measure with profiling tools.",
  openGraph: {
    title: "Optimization Tips",
    description:
      "Reduce draw calls, use instancing, avoid React re-renders, and measure with profiling tools.",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
