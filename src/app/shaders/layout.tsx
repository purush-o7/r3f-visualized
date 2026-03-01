import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Shaders",
  description:
    "Write custom GLSL shaders — vertex displacement, fragment coloring, uniforms, and varyings.",
  openGraph: {
    title: "Shaders",
    description:
      "Write custom GLSL shaders — vertex displacement, fragment coloring, uniforms, and varyings.",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
