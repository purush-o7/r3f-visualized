import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Go Live",
  description:
    "Deploy your Three.js app — build optimization, tree-shaking, asset compression, and Vercel hosting.",
  openGraph: {
    title: "Go Live",
    description:
      "Deploy your Three.js app — build optimization, tree-shaking, asset compression, and Vercel hosting.",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
