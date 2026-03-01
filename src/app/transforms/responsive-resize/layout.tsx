import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Responsive & Resize",
  description:
    "Make your 3D scene adapt to any screen size — viewport units, DPR, and responsive layouts.",
  openGraph: {
    title: "Responsive & Resize",
    description:
      "Make your 3D scene adapt to any screen size — viewport units, DPR, and responsive layouts.",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
