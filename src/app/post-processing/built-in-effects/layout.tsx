import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Built-in Effects",
  description:
    "Add Bloom, Depth of Field, Vignette, Chromatic Aberration, and ambient occlusion.",
  openGraph: {
    title: "Built-in Effects",
    description:
      "Add Bloom, Depth of Field, Vignette, Chromatic Aberration, and ambient occlusion.",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
