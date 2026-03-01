import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Scene, Camera & Renderer",
  description:
    "Learn the three pillars of Three.js — Scene holds your objects, Camera frames the view, Renderer draws it to screen.",
  openGraph: {
    title: "Scene, Camera & Renderer",
    description:
      "Learn the three pillars of Three.js — Scene holds your objects, Camera frames the view, Renderer draws it to screen.",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
