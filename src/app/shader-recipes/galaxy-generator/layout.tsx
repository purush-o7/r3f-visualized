import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Galaxy Generator",
  description:
    "Generate a procedural spiral galaxy with thousands of colored particles using custom shaders.",
  openGraph: {
    title: "Galaxy Generator",
    description:
      "Generate a procedural spiral galaxy with thousands of colored particles using custom shaders.",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
