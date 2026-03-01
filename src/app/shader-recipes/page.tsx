import Link from "next/link";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Waves, Scan, Sparkles, Mountain } from "lucide-react";
import { CategoryBg } from "@/components/category-bg-loader";


const topics = [
  {
    href: "/shader-recipes/raging-sea",
    label: "Raging Sea",
    icon: Waves,
    description:
      "Build a stormy ocean with vertex displacement. Layer sine waves for realistic water, color valleys deep blue and peaks foamy white.",
  },
  {
    href: "/shader-recipes/hologram-effect",
    label: "Hologram Effect",
    icon: Scan,
    description:
      "Create a sci-fi holographic projection with fresnel glow, animated scan lines, and glitch flickering on any 3D shape.",
  },
  {
    href: "/shader-recipes/galaxy-generator",
    label: "Galaxy Generator",
    icon: Sparkles,
    description:
      "Procedurally generate a spiral galaxy from thousands of particles using polar coordinates, spiral arms, and per-particle coloring.",
  },
  {
    href: "/shader-recipes/procedural-terrain",
    label: "Procedural Terrain",
    icon: Mountain,
    description:
      "Sculpt mountains from math. Stack layers of noise (octaves) in a vertex shader to create realistic terrain with snow-capped peaks.",
  },
];

export default function ShaderRecipesPage() {
  return (
    <div className="relative max-w-4xl">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <CategoryBg category="shader-recipes" />
        <div className="absolute inset-0 bg-gradient-to-b from-background/30 via-background/60 to-background" />
      </div>
      <div className="relative z-10">
      <div className="flex items-center gap-3 mb-2">
        <div className="rounded-lg p-2 bg-violet-500/10 text-violet-500">
          <Sparkles className="size-5" />
        </div>
        <h1 className="text-2xl font-bold">Shader Recipes</h1>
        <Badge variant="secondary">{topics.length} topics</Badge>
      </div>
      <p className="text-muted-foreground mb-8">
        Creative shader projects that teach unique GLSL techniques. Each recipe
        combines vertex and fragment shaders to produce a complete visual effect
        -- from stormy oceans to holographic projections to procedural galaxies
        and terrain.
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
