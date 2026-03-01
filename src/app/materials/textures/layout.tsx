import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Textures",
  description:
    "Load and apply 2D images to 3D objects — UV mapping, wrapping modes, filtering, and color spaces.",
  openGraph: {
    title: "Textures",
    description:
      "Load and apply 2D images to 3D objects — UV mapping, wrapping modes, filtering, and color spaces.",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
