import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Raycasting",
  description:
    "Detect what the mouse is pointing at — the invisible laser behind every 3D interaction.",
  openGraph: {
    title: "Raycasting",
    description:
      "Detect what the mouse is pointing at — the invisible laser behind every 3D interaction.",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
