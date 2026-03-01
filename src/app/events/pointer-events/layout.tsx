import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pointer Events",
  description:
    "Add click, hover, and drag interactions to 3D objects — just like DOM event handlers.",
  openGraph: {
    title: "Pointer Events",
    description:
      "Add click, hover, and drag interactions to 3D objects — just like DOM event handlers.",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
