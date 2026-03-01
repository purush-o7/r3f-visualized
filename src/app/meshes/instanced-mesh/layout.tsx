import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "InstancedMesh",
  description:
    "Render thousands of similar objects in a single draw call for massive performance gains.",
  openGraph: {
    title: "InstancedMesh",
    description:
      "Render thousands of similar objects in a single draw call for massive performance gains.",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
