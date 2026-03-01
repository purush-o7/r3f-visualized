import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Materials",
  description:
    "From basic flat colors to physically-based rendering — learn how materials define surface appearance.",
  openGraph: {
    title: "Materials",
    description:
      "From basic flat colors to physically-based rendering — learn how materials define surface appearance.",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
