import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "GLTF Models",
  description:
    "Load 3D models in the web-optimized GLTF format with Draco compression support.",
  openGraph: {
    title: "GLTF Models",
    description:
      "Load 3D models in the web-optimized GLTF format with Draco compression support.",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
