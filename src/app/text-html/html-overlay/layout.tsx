import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "HTML Overlay",
  description:
    "Float HTML elements in 3D space — labels, tooltips, and interactive UI attached to objects.",
  openGraph: {
    title: "HTML Overlay",
    description:
      "Float HTML elements in 3D space — labels, tooltips, and interactive UI attached to objects.",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
