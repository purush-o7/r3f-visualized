import Link from "next/link";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Paintbrush, CircleDot, Sparkles, Image } from "lucide-react";

const topics = [
  {
    href: "/materials/basic-materials",
    label: "Basic Materials",
    icon: CircleDot,
    description:
      "MeshBasicMaterial and MeshNormalMaterial — unlit materials for debugging, UI, and stylized effects.",
  },
  {
    href: "/materials/standard-physical",
    label: "Standard & Physical",
    icon: Sparkles,
    description:
      "MeshStandardMaterial and MeshPhysicalMaterial — physically-based rendering with roughness and metalness.",
  },
  {
    href: "/materials/textures",
    label: "Textures",
    icon: Image,
    description:
      "Loading images, UV mapping, texture wrapping, filtering, and combining multiple texture maps.",
  },
];

export default function MaterialsPage() {
  return (
    <div className="max-w-4xl">
      <div className="flex items-center gap-3 mb-2">
        <div className="rounded-lg p-2 bg-purple-500/10 text-purple-500">
          <Paintbrush className="size-5" />
        </div>
        <h1 className="text-2xl font-bold">Materials</h1>
        <Badge variant="secondary">{topics.length} topics</Badge>
      </div>
      <p className="text-muted-foreground mb-8">
        Materials define how surfaces look when light hits them — color, shininess,
        transparency, and texture. Three.js provides a range of materials from simple
        unlit colors to full physically-based rendering (PBR) with roughness,
        metalness, and environment reflections.
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
