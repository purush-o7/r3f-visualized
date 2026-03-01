import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "JSX to Three.js",
  description:
    "Understand how React JSX maps to Three.js objects — lowercase tags, args, props, and attach.",
  openGraph: {
    title: "JSX to Three.js",
    description:
      "Understand how React JSX maps to Three.js objects — lowercase tags, args, props, and attach.",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
