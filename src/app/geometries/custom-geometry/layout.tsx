import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Custom Geometry",
  description:
    "Build shapes from scratch — define vertices, faces, normals, and UVs by hand.",
  openGraph: {
    title: "Custom Geometry",
    description:
      "Build shapes from scratch — define vertices, faces, normals, and UVs by hand.",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
