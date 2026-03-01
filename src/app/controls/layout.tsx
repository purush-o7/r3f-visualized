import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Controls",
  description:
    "Add camera controls — OrbitControls for exploration and CameraControls for cinematic transitions.",
  openGraph: {
    title: "Controls",
    description:
      "Add camera controls — OrbitControls for exploration and CameraControls for cinematic transitions.",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
