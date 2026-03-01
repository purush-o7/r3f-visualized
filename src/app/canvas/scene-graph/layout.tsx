import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Scene Graph",
  description:
    "Build parent-child hierarchies where transforms cascade — the foundation of complex 3D scenes.",
  openGraph: {
    title: "Scene Graph",
    description:
      "Build parent-child hierarchies where transforms cascade — the foundation of complex 3D scenes.",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
