import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Procedural Terrain",
  description:
    "Sculpt mountains from math — FBM noise, height-based biomes, and derivative normals.",
  openGraph: {
    title: "Procedural Terrain",
    description:
      "Sculpt mountains from math — FBM noise, height-based biomes, and derivative normals.",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
