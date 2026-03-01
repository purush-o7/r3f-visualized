import Link from "next/link";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Shapes, Box, Cpu, Pen } from "lucide-react";

const topics = [
  {
    href: "/geometries/built-in-geometries",
    label: "Built-in Geometries",
    icon: Box,
    description:
      "Boxes, spheres, planes, tori, and more — the ready-made shapes that ship with Three.js.",
  },
  {
    href: "/geometries/buffer-geometry",
    label: "Buffer Geometry",
    icon: Cpu,
    description:
      "How BufferGeometry stores vertex data in typed arrays for efficient GPU transfer.",
  },
  {
    href: "/geometries/custom-geometry",
    label: "Custom Geometry",
    icon: Pen,
    description:
      "Building geometry from scratch with custom vertices, normals, UVs, and indices.",
  },
];

export default function GeometriesPage() {
  return (
    <div className="max-w-4xl">
      <div className="flex items-center gap-3 mb-2">
        <div className="rounded-lg p-2 bg-teal-500/10 text-teal-500">
          <Shapes className="size-5" />
        </div>
        <h1 className="text-2xl font-bold">Geometries</h1>
        <Badge variant="secondary">{topics.length} topics</Badge>
      </div>
      <p className="text-muted-foreground mb-8">
        Geometry defines the shape of 3D objects — the vertices, edges, and faces
        that make up every mesh. Three.js provides a library of built-in shapes and
        a powerful BufferGeometry API for creating anything you can imagine.
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
