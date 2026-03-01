import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "useFrame",
  description:
    "Animate your scene with useFrame — the heartbeat that runs every frame for smooth motion.",
  openGraph: {
    title: "useFrame",
    description:
      "Animate your scene with useFrame — the heartbeat that runs every frame for smooth motion.",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
