import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Canvas Component",
  description:
    "Set up the R3F Canvas — the bridge between React and Three.js that handles everything automatically.",
  openGraph: {
    title: "Canvas Component",
    description:
      "Set up the R3F Canvas — the bridge between React and Three.js that handles everything automatically.",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
