import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "OrbitControls",
  description:
    "Spin, zoom, and pan around objects with orbit controls — the most common camera interaction.",
  openGraph: {
    title: "OrbitControls",
    description:
      "Spin, zoom, and pan around objects with orbit controls — the most common camera interaction.",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
