import Link from "next/link";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Navigation, Orbit, Video } from "lucide-react";
import { CategoryBg } from "@/components/category-bg-loader";


const topics = [
  {
    href: "/controls/orbit-controls",
    label: "OrbitControls",
    icon: Orbit,
    description:
      "Add interactive camera controls that let users orbit, zoom, and pan around your 3D scene with mouse or touch input.",
  },
  {
    href: "/controls/camera-controls",
    label: "Camera Controls",
    icon: Video,
    description:
      "Advanced camera control system with smooth transitions, boundaries, and programmatic camera movement.",
  },
];

export default function ControlsPage() {
  return (
    <div className="relative max-w-4xl">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <CategoryBg category="controls" />
        <div className="absolute inset-0 bg-gradient-to-b from-background/30 via-background/60 to-background" />
      </div>
      <div className="relative z-10">
      <div className="flex items-center gap-3 mb-2">
        <div className="rounded-lg p-2 bg-cyan-500/10 text-cyan-500">
          <Navigation className="size-5" />
        </div>
        <h1 className="text-2xl font-bold">Controls</h1>
        <Badge variant="secondary">{topics.length} topics</Badge>
      </div>
      <p className="text-muted-foreground mb-8">
        Learn how to add interactive camera controls to your scenes using drei
        helpers. From simple orbit controls to advanced camera systems with
        smooth transitions and constraints.
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
