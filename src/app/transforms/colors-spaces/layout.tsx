import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Colors & Color Spaces",
  description:
    "Work with RGB, HSL, hex colors and understand the critical difference between sRGB and Linear space.",
  openGraph: {
    title: "Colors & Color Spaces",
    description:
      "Work with RGB, HSL, hex colors and understand the critical difference between sRGB and Linear space.",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
