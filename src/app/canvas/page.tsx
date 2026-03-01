import Link from "next/link";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Monitor, FileCode, Network } from "lucide-react";

const topics = [
  {
    href: "/canvas/canvas-component",
    label: "Canvas Component",
    icon: Monitor,
    description:
      "The root component that creates a WebGL context and sets up the Three.js renderer, scene, and camera.",
  },
  {
    href: "/canvas/jsx-to-three",
    label: "JSX to Three.js",
    icon: FileCode,
    description:
      "How R3F maps JSX elements to Three.js objects and the declarative approach to 3D scenes.",
  },
  {
    href: "/canvas/scene-graph",
    label: "Scene Graph",
    icon: Network,
    description:
      "Understanding the Three.js scene graph structure and how R3F manages parent-child relationships.",
  },
];

export default function CanvasPage() {
  return (
    <div className="max-w-4xl">
      <div className="flex items-center gap-3 mb-2">
        <div className="rounded-lg p-2 bg-green-500/10 text-green-500">
          <Monitor className="size-5" />
        </div>
        <h1 className="text-2xl font-bold">Canvas & Setup</h1>
        <Badge variant="secondary">{topics.length} topics</Badge>
      </div>
      <p className="text-muted-foreground mb-8">
        Learn how to set up a React Three Fiber scene, understand the Canvas
        component, and explore how JSX maps to Three.js objects in the scene
        graph.
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
