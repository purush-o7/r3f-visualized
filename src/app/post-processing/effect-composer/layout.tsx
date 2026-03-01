import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "EffectComposer",
  description:
    "Set up the post-processing pipeline to stack visual effects on your rendered scene.",
  openGraph: {
    title: "EffectComposer",
    description:
      "Set up the post-processing pipeline to stack visual effects on your rendered scene.",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
