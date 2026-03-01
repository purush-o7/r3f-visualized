import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Uniforms & Varyings",
  description:
    "Pass data to shaders — uniforms for global values, varyings for per-pixel interpolation.",
  openGraph: {
    title: "Uniforms & Varyings",
    description:
      "Pass data to shaders — uniforms for global values, varyings for per-pixel interpolation.",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
