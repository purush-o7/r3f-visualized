import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "ShaderMaterial",
  description:
    "Write your first GLSL shader — vertex position, fragment color, and the GPU rendering pipeline.",
  openGraph: {
    title: "ShaderMaterial",
    description:
      "Write your first GLSL shader — vertex position, fragment color, and the GPU rendering pipeline.",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
