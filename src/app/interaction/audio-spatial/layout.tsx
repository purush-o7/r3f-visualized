import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Spatial Audio",
  description:
    "Create 3D positional audio — sounds that exist in space with distance-based falloff.",
  openGraph: {
    title: "Spatial Audio",
    description:
      "Create 3D positional audio — sounds that exist in space with distance-based falloff.",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
