import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Basic Materials",
  description:
    "Compare MeshBasicMaterial, NormalMaterial, LambertMaterial, and PhongMaterial for different visual styles.",
  openGraph: {
    title: "Basic Materials",
    description:
      "Compare MeshBasicMaterial, NormalMaterial, LambertMaterial, and PhongMaterial for different visual styles.",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
