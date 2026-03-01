import Link from "next/link";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Box, Layers, Copy } from "lucide-react";
import { CategoryBg } from "@/components/category-bg-loader";


const topics = [
  {
    href: "/meshes/mesh-component",
    label: "Mesh Component",
    icon: Box,
    description:
      "The fundamental building block combining geometry and material to create visible 3D objects.",
  },
  {
    href: "/meshes/groups-hierarchy",
    label: "Groups & Hierarchy",
    icon: Layers,
    description:
      "Organize objects with groups and nested transforms to build complex scene structures.",
  },
  {
    href: "/meshes/instanced-mesh",
    label: "Instanced Mesh",
    icon: Copy,
    description:
      "Render thousands of identical objects efficiently using GPU instancing for high-performance scenes.",
  },
];

export default function MeshesPage() {
  return (
    <div className="relative max-w-4xl">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <CategoryBg category="meshes" />
        <div className="absolute inset-0 bg-gradient-to-b from-background/30 via-background/60 to-background" />
      </div>
      <div className="relative z-10">
      <div className="flex items-center gap-3 mb-2">
        <div className="rounded-lg p-2 bg-green-500/10 text-green-500">
          <Box className="size-5" />
        </div>
        <h1 className="text-2xl font-bold">Meshes & Objects</h1>
        <Badge variant="secondary">{topics.length} topics</Badge>
      </div>
      <p className="text-muted-foreground mb-8">
        Explore how to create, compose, and optimize 3D objects in React Three
        Fiber using meshes, groups, and instancing techniques.
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
