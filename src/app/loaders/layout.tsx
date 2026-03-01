import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Loaders & Models",
  description:
    "Load 3D models, textures, and assets — GLTF format, Draco compression, and the useGLTF hook.",
  openGraph: {
    title: "Loaders & Models",
    description:
      "Load 3D models, textures, and assets — GLTF format, Draco compression, and the useGLTF hook.",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
