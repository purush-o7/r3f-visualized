import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "useGLTF",
  description:
    "Load and destructure GLTF models into individual nodes and materials with drei's useGLTF hook.",
  openGraph: {
    title: "useGLTF",
    description:
      "Load and destructure GLTF models into individual nodes and materials with drei's useGLTF hook.",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
