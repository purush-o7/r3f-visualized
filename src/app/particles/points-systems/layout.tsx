import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Points & Particle Systems",
  description:
    "Create thousands of floating particles — snow, rain, fireflies, and custom particle effects.",
  openGraph: {
    title: "Points & Particle Systems",
    description:
      "Create thousands of floating particles — snow, rain, fireflies, and custom particle effects.",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
