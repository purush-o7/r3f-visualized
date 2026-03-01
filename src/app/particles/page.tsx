import Link from "next/link";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CircleDot, Spline, Square, Frame } from "lucide-react";
import { CategoryBg } from "@/components/category-bg-loader";


const topics = [
  {
    href: "/particles/points-systems",
    label: "Points & Particle Systems",
    icon: CircleDot,
    description:
      "Render thousands of lightweight points in 3D space — snow, rain, fire, stars, confetti — using Points and BufferGeometry.",
  },
  {
    href: "/particles/lines-curves",
    label: "Lines & Curves",
    icon: Spline,
    description:
      "Draw in 3D space with lines and curves. Connect points, smooth them with CatmullRom, and give them thickness with tubes.",
  },
  {
    href: "/particles/sprites-billboards",
    label: "Sprites & Billboards",
    icon: Square,
    description:
      "Flat images that always face the camera — perfect for health bars, labels, icons, and lightweight particle effects.",
  },
  {
    href: "/particles/render-targets",
    label: "Render Targets",
    icon: Frame,
    description:
      "Render a scene to a texture instead of the screen. Build mirrors, portals, security cameras, minimaps, and picture-in-picture.",
  },
];

export default function ParticlesPage() {
  return (
    <div className="relative max-w-4xl">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <CategoryBg category="particles" />
        <div className="absolute inset-0 bg-gradient-to-b from-background/30 via-background/60 to-background" />
      </div>
      <div className="relative z-10">
      <div className="flex items-center gap-3 mb-2">
        <div className="rounded-lg p-2 bg-cyan-500/10 text-cyan-500">
          <CircleDot className="size-5" />
        </div>
        <h1 className="text-2xl font-bold">Particles & Lines</h1>
        <Badge variant="secondary">{topics.length} topics</Badge>
      </div>
      <p className="text-muted-foreground mb-8">
        Go beyond solid meshes. Particles let you render thousands of
        lightweight points for effects like snow, fire, and stars. Lines and
        curves let you draw paths through 3D space. Sprites give you
        camera-facing billboards, and render targets let you capture scenes as
        textures for portals and mirrors.
      </p>
      <div className="grid gap-4 sm:grid-cols-2">
        {topics.map((topic) => (
          <Link key={topic.href} href={topic.href}>
            <Card className="group h-full transition-all duration-300 hover:shadow-md hover:-translate-y-0.5 cursor-pointer border-border/50 hover:border-border">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <topic.icon className="size-4 text-muted-foreground" />
                  <CardTitle className="text-base">{topic.label}</CardTitle>
                </div>
                <CardDescription>{topic.description}</CardDescription>
              </CardHeader>
            </Card>
          </Link>
        ))}
      </div>
      </div>    </div>
  );
}
