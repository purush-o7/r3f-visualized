import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Hologram Effect",
  description:
    "Create a sci-fi hologram with fresnel glow, animated scanlines, and glitch effects.",
  openGraph: {
    title: "Hologram Effect",
    description:
      "Create a sci-fi hologram with fresnel glow, animated scanlines, and glitch effects.",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
