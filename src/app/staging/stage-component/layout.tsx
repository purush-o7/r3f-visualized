import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Stage Component",
  description:
    "Set up a complete photo studio — lighting, shadows, and centering — in a single component.",
  openGraph: {
    title: "Stage Component",
    description:
      "Set up a complete photo studio — lighting, shadows, and centering — in a single component.",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
