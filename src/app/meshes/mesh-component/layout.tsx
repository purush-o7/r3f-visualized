import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Mesh Component",
  description:
    "Combine geometry and material into visible 3D objects — the building block of every scene.",
  openGraph: {
    title: "Mesh Component",
    description:
      "Combine geometry and material into visible 3D objects — the building block of every scene.",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
