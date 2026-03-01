import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Code Structuring",
  description:
    "Organize large R3F projects — feature folders, custom hooks, state management, and lazy loading.",
  openGraph: {
    title: "Code Structuring",
    description:
      "Organize large R3F projects — feature folders, custom hooks, state management, and lazy loading.",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
