import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Post-Processing",
  description:
    "Add cinematic effects to your scene — bloom, depth of field, vignette, and more.",
  openGraph: {
    title: "Post-Processing",
    description:
      "Add cinematic effects to your scene — bloom, depth of field, vignette, and more.",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
