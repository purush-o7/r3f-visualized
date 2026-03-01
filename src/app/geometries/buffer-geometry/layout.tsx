import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "BufferGeometry",
  description:
    "Understand typed arrays, buffer attributes, and how geometry data flows to the GPU.",
  openGraph: {
    title: "BufferGeometry",
    description:
      "Understand typed arrays, buffer attributes, and how geometry data flows to the GPU.",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
