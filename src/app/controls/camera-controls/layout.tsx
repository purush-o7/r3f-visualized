import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Camera Controls",
  description:
    "Fly the camera smoothly between positions with programmatic transitions and setLookAt.",
  openGraph: {
    title: "Camera Controls",
    description:
      "Fly the camera smoothly between positions with programmatic transitions and setLookAt.",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
