import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Groups & Hierarchy",
  description:
    "Organize objects with groups — nested transforms for robot arms, solar systems, and more.",
  openGraph: {
    title: "Groups & Hierarchy",
    description:
      "Organize objects with groups — nested transforms for robot arms, solar systems, and more.",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
