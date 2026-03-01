import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Animation Loop",
  description:
    "Master the render loop, delta time for smooth animations, and frame-rate independent motion.",
  openGraph: {
    title: "Animation Loop",
    description:
      "Master the render loop, delta time for smooth animations, and frame-rate independent motion.",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
