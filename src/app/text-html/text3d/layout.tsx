import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Text3D",
  description:
    "Render extruded 3D text with custom fonts, materials, and animations.",
  openGraph: {
    title: "Text3D",
    description:
      "Render extruded 3D text with custom fonts, materials, and animations.",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
