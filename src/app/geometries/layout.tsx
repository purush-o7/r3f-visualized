import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Geometries",
  description:
    "Explore built-in shapes, BufferGeometry internals, and custom geometry creation in Three.js.",
  openGraph: {
    title: "Geometries",
    description:
      "Explore built-in shapes, BufferGeometry internals, and custom geometry creation in Three.js.",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
