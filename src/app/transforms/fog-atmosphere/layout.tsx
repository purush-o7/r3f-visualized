import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Fog & Atmosphere",
  description:
    "Add depth with fog effects — linear and exponential fog for atmospheric 3D scenes.",
  openGraph: {
    title: "Fog & Atmosphere",
    description:
      "Add depth with fog effects — linear and exponential fog for atmospheric 3D scenes.",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
