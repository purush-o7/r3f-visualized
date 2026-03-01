import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Meshes & Objects",
  description:
    "Build 3D objects with meshes, organize with groups, and render thousands with instancing.",
  openGraph: {
    title: "Meshes & Objects",
    description:
      "Build 3D objects with meshes, organize with groups, and render thousands with instancing.",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
