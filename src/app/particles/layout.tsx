import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Particles & Lines",
  description:
    "Create particle systems, curved lines, billboard sprites, and render-to-texture effects.",
  openGraph: {
    title: "Particles & Lines",
    description:
      "Create particle systems, curved lines, billboard sprites, and render-to-texture effects.",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
