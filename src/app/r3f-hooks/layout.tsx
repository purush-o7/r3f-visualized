import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "R3F Hooks",
  description:
    "Master useFrame for animations, useThree for scene access, and useLoader for asset management.",
  openGraph: {
    title: "R3F Hooks",
    description:
      "Master useFrame for animations, useThree for scene access, and useLoader for asset management.",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
