import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Production",
  description:
    "Ship your 3D app — realistic rendering, loading screens, code architecture, and deployment.",
  openGraph: {
    title: "Production",
    description:
      "Ship your 3D app — realistic rendering, loading screens, code architecture, and deployment.",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
