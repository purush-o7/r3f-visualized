import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Realistic Render",
  description:
    "Fine-tune tone mapping, color space, shadows, and anti-aliasing for photorealistic output.",
  openGraph: {
    title: "Realistic Render",
    description:
      "Fine-tune tone mapping, color space, shadows, and anti-aliasing for photorealistic output.",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
