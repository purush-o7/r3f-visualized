import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Camera Types",
  description:
    "Compare PerspectiveCamera and OrthographicCamera — FOV, frustum, and when to use each.",
  openGraph: {
    title: "Camera Types",
    description:
      "Compare PerspectiveCamera and OrthographicCamera — FOV, frustum, and when to use each.",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
