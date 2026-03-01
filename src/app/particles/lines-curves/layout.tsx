import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Lines & Curves",
  description:
    "Draw lines and curves in 3D — CatmullRom splines, tubes, and animated path following.",
  openGraph: {
    title: "Lines & Curves",
    description:
      "Draw lines and curves in 3D — CatmullRom splines, tubes, and animated path following.",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
