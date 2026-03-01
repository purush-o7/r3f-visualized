import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Standard & Physical Materials",
  description:
    "Create photorealistic surfaces with PBR — roughness, metalness, clearcoat, and transmission.",
  openGraph: {
    title: "Standard & Physical Materials",
    description:
      "Create photorealistic surfaces with PBR — roughness, metalness, clearcoat, and transmission.",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
