import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Environment",
  description:
    "Add realistic reflections and image-based lighting with HDRI environment presets.",
  openGraph: {
    title: "Environment",
    description:
      "Add realistic reflections and image-based lighting with HDRI environment presets.",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
