import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sky & Stars",
  description:
    "Create atmospheric skies with dynamic sun position and starfield backgrounds.",
  openGraph: {
    title: "Sky & Stars",
    description:
      "Create atmospheric skies with dynamic sun position and starfield backgrounds.",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
