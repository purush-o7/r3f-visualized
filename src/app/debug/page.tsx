import Link from "next/link";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Bug, ScanLine, Camera } from "lucide-react";

const topics = [
  {
    href: "/debug/wireframe-helpers",
    label: "Wireframe & Helpers",
    icon: ScanLine,
    description:
      "Toggle wireframe mode, add axes, grids, and bounding box helpers to visualize your scene structure.",
  },
  {
    href: "/debug/camera-types",
    label: "Camera Types",
    icon: Camera,
    description:
      "Perspective vs Orthographic cameras — how they differ, when to use each, and how to configure FOV, near, and far planes.",
  },
];

export default function DebugPage() {
  return (
    <div className="max-w-4xl">
      <div className="flex items-center gap-3 mb-2">
        <div className="rounded-lg p-2 bg-rose-500/10 text-rose-500">
          <Bug className="size-5" />
        </div>
        <h1 className="text-2xl font-bold">Debug & Helpers</h1>
        <Badge variant="secondary">{topics.length} topics</Badge>
      </div>
      <p className="text-muted-foreground mb-8">
        Debugging 3D scenes is hard when you can&apos;t see what&apos;s happening behind
        the pixels. Helpers give you X-ray vision into your scene — wireframes reveal
        geometry structure, axes show orientation, grids provide spatial reference,
        and camera helpers visualize frustums.
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
