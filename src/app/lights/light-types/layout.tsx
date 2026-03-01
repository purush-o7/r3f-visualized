import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Light Types",
  description:
    "Master Ambient, Directional, Point, Spot, Hemisphere, and RectArea lights.",
  openGraph: {
    title: "Light Types",
    description:
      "Master Ambient, Directional, Point, Spot, Hemisphere, and RectArea lights.",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
