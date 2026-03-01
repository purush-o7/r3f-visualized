import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Environment Maps",
  description:
    "Add realistic reflections and lighting with HDR environment maps and drei presets.",
  openGraph: {
    title: "Environment Maps",
    description:
      "Add realistic reflections and lighting with HDR environment maps and drei presets.",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
