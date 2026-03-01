import Link from "next/link";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Box, Camera, Axis3D, RefreshCw } from "lucide-react";

const topics = [
  {
    href: "/scene-basics/scene-camera-renderer",
    label: "Scene, Camera & Renderer",
    icon: Camera,
    description:
      "The three pillars of every Three.js application — how they connect and what each one does.",
  },
  {
    href: "/scene-basics/coordinate-system",
    label: "Coordinate System",
    icon: Axis3D,
    description:
      "Understanding the right-handed 3D coordinate system, world vs local space, and transforms.",
  },
  {
    href: "/scene-basics/animation-loop",
    label: "Animation Loop",
    icon: RefreshCw,
    description:
      "The requestAnimationFrame render loop, delta time, and keeping your scene alive.",
  },
];

export default function SceneBasicsPage() {
  return (
    <div className="max-w-4xl">
      <div className="flex items-center gap-3 mb-2">
        <div className="rounded-lg p-2 bg-blue-500/10 text-blue-500">
          <Box className="size-5" />
        </div>
        <h1 className="text-2xl font-bold">Scene Basics</h1>
        <Badge variant="secondary">{topics.length} topics</Badge>
      </div>
      <p className="text-muted-foreground mb-8">
        The foundation of every Three.js application. Learn how the scene graph, camera,
        and renderer work together, how the 3D coordinate system maps to your screen,
        and how the animation loop drives everything forward frame by frame.
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
    </div>
  );
}
