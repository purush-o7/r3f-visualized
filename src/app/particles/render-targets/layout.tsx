import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Render Targets",
  description:
    "Render scenes to textures for mirrors, portals, minimaps, and picture-in-picture effects.",
  openGraph: {
    title: "Render Targets",
    description:
      "Render scenes to textures for mirrors, portals, minimaps, and picture-in-picture effects.",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
