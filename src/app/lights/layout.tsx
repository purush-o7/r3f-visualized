import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Lights",
  description:
    "Master light types, shadow casting, and environment maps for realistic 3D scene illumination.",
  openGraph: {
    title: "Lights",
    description:
      "Master light types, shadow casting, and environment maps for realistic 3D scene illumination.",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
