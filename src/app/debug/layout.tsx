import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Debug & Helpers",
  description:
    "Debug your 3D scenes with wireframe mode, axes helpers, grid helpers, and camera type switching.",
  openGraph: {
    title: "Debug & Helpers",
    description:
      "Debug your 3D scenes with wireframe mode, axes helpers, grid helpers, and camera type switching.",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
