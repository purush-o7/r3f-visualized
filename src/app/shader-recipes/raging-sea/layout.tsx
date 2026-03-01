import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Raging Sea",
  description:
    "Build an animated ocean with layered sine waves, vertex displacement, and depth-based coloring.",
  openGraph: {
    title: "Raging Sea",
    description:
      "Build an animated ocean with layered sine waves, vertex displacement, and depth-based coloring.",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
