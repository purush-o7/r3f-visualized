import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Performance",
  description:
    "Optimize your Three.js app — reduce draw calls, instance objects, and profile with dev tools.",
  openGraph: {
    title: "Performance",
    description:
      "Optimize your Three.js app — reduce draw calls, instance objects, and profile with dev tools.",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
