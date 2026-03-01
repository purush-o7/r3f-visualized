import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Built-in Geometries",
  description:
    "Explore Box, Sphere, Cylinder, Torus, and other pre-made shapes in Three.js.",
  openGraph: {
    title: "Built-in Geometries",
    description:
      "Explore Box, Sphere, Cylinder, Torus, and other pre-made shapes in Three.js.",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
