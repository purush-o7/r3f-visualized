import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Staging & Environment",
  description:
    "Set up realistic environments, lighting presets, and atmospheric sky effects with drei helpers.",
  openGraph: {
    title: "Staging & Environment",
    description:
      "Set up realistic environments, lighting presets, and atmospheric sky effects with drei helpers.",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
