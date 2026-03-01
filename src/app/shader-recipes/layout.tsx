import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Shader Recipes",
  description:
    "Creative GLSL shader projects — raging seas, holograms, galaxies, and procedural terrain.",
  openGraph: {
    title: "Shader Recipes",
    description:
      "Creative GLSL shader projects — raging seas, holograms, galaxies, and procedural terrain.",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
