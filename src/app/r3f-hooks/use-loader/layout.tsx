import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "useLoader",
  description:
    "Load textures, models, and assets with automatic caching and Suspense integration.",
  openGraph: {
    title: "useLoader",
    description:
      "Load textures, models, and assets with automatic caching and Suspense integration.",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
