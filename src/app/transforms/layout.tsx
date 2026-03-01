import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Transforms & Color",
  description:
    "Master position, rotation, scale, color spaces, responsive layouts, and atmospheric fog.",
  openGraph: {
    title: "Transforms & Color",
    description:
      "Master position, rotation, scale, color spaces, responsive layouts, and atmospheric fog.",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
