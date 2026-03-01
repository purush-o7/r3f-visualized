import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Animation & Physics",
  description:
    "Add spring animations, Rapier physics simulation, and spatial audio to your 3D scenes.",
  openGraph: {
    title: "Animation & Physics",
    description:
      "Add spring animations, Rapier physics simulation, and spatial audio to your 3D scenes.",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
