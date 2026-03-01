import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Loading Progress",
  description:
    "Build loading screens with progress bars using React Suspense and drei's useProgress hook.",
  openGraph: {
    title: "Loading Progress",
    description:
      "Build loading screens with progress bars using React Suspense and drei's useProgress hook.",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
