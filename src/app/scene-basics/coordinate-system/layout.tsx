import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Coordinate System",
  description:
    "Understand the 3D coordinate system — X, Y, Z axes, position, rotation, scale, and world vs local space.",
  openGraph: {
    title: "Coordinate System",
    description:
      "Understand the 3D coordinate system — X, Y, Z axes, position, rotation, scale, and world vs local space.",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
