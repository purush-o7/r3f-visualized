import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "useThree",
  description:
    "Access the renderer, camera, scene, and viewport from any component with useThree.",
  openGraph: {
    title: "useThree",
    description:
      "Access the renderer, camera, scene, and viewport from any component with useThree.",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
