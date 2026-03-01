import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Shadows",
  description:
    "Enable realistic shadows — shadow maps, bias, frustum tuning, and performance optimization.",
  openGraph: {
    title: "Shadows",
    description:
      "Enable realistic shadows — shadow maps, bias, frustum tuning, and performance optimization.",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
