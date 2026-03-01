import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Wireframe & Helpers",
  description:
    "Toggle wireframe mode and use AxesHelper, GridHelper, and BoxHelper to debug your scene.",
  openGraph: {
    title: "Wireframe & Helpers",
    description:
      "Toggle wireframe mode and use AxesHelper, GridHelper, and BoxHelper to debug your scene.",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
