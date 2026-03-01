import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Events & Interaction",
  description:
    "Make 3D objects interactive with pointer events and raycasting in React Three Fiber.",
  openGraph: {
    title: "Events & Interaction",
    description:
      "Make 3D objects interactive with pointer events and raycasting in React Three Fiber.",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
