import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Position, Rotation & Scale",
  description:
    "Move, rotate, and resize objects in 3D space — the fundamental transform operations.",
  openGraph: {
    title: "Position, Rotation & Scale",
    description:
      "Move, rotate, and resize objects in 3D space — the fundamental transform operations.",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
