import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Animation Libraries",
  description:
    "Compare animation approaches — raw useFrame, spring physics, and smooth lerp transitions.",
  openGraph: {
    title: "Animation Libraries",
    description:
      "Compare animation approaches — raw useFrame, spring physics, and smooth lerp transitions.",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
