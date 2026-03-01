import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Scene Basics",
  description:
    "Learn the Three.js rendering pipeline — Scene, Camera, Renderer, coordinate systems, and the animation loop.",
  openGraph: {
    title: "Scene Basics",
    description:
      "Learn the Three.js rendering pipeline — Scene, Camera, Renderer, coordinate systems, and the animation loop.",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
