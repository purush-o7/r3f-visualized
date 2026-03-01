import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sprites & Billboards",
  description:
    "Create always-facing-camera sprites for labels, health bars, and particle effects.",
  openGraph: {
    title: "Sprites & Billboards",
    description:
      "Create always-facing-camera sprites for labels, health bars, and particle effects.",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
