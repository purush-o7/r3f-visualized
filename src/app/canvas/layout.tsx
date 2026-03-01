import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Canvas & Setup",
  description:
    "Set up React Three Fiber — the Canvas component, JSX-to-Three.js mapping, and the declarative scene graph.",
  openGraph: {
    title: "Canvas & Setup",
    description:
      "Set up React Three Fiber — the Canvas component, JSX-to-Three.js mapping, and the declarative scene graph.",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
