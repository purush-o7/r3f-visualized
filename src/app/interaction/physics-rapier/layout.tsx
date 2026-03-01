import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Physics with Rapier",
  description:
    "Add realistic physics simulation — gravity, collisions, rigid bodies, and forces with @react-three/rapier.",
  openGraph: {
    title: "Physics with Rapier",
    description:
      "Add realistic physics simulation — gravity, collisions, rigid bodies, and forces with @react-three/rapier.",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
