import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Text & HTML",
  description:
    "Render 3D text and overlay HTML elements in your Three.js scene.",
  openGraph: {
    title: "Text & HTML",
    description:
      "Render 3D text and overlay HTML elements in your Three.js scene.",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
