import Link from "next/link";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Download, FileBox, Package } from "lucide-react";

const topics = [
  {
    href: "/loaders/gltf-models",
    label: "GLTF Models",
    icon: FileBox,
    description:
      "Load and display 3D models in GLTF/GLB format, the standard interchange format for web-ready 3D assets.",
  },
  {
    href: "/loaders/use-gltf",
    label: "useGLTF Hook",
    icon: Package,
    description:
      "Use drei's useGLTF hook for convenient model loading with automatic draco decompression and asset preloading.",
  },
];

export default function LoadersPage() {
  return (
    <div className="max-w-4xl">
      <div className="flex items-center gap-3 mb-2">
        <div className="rounded-lg p-2 bg-orange-500/10 text-orange-500">
          <Download className="size-5" />
        </div>
        <h1 className="text-2xl font-bold">Loaders</h1>
        <Badge variant="secondary">{topics.length} topics</Badge>
      </div>
      <p className="text-muted-foreground mb-8">
        Load external 3D models and assets into your React Three Fiber scenes.
        Learn to work with GLTF models using both native loaders and drei
        convenience hooks.
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
