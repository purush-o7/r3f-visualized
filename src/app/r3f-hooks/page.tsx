import Link from "next/link";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Zap, Settings, Download } from "lucide-react";

const topics = [
  {
    href: "/r3f-hooks/use-frame",
    label: "useFrame",
    icon: Zap,
    description:
      "The animation loop hook that runs every frame, giving you access to the clock and delta time for smooth animations.",
  },
  {
    href: "/r3f-hooks/use-three",
    label: "useThree",
    icon: Settings,
    description:
      "Access the internal R3F state including the renderer, scene, camera, viewport size, and more.",
  },
  {
    href: "/r3f-hooks/use-loader",
    label: "useLoader",
    icon: Download,
    description:
      "Load external assets like textures, models, and fonts using Three.js loaders with built-in caching and Suspense.",
  },
];

export default function R3FHooksPage() {
  return (
    <div className="max-w-4xl">
      <div className="flex items-center gap-3 mb-2">
        <div className="rounded-lg p-2 bg-green-500/10 text-green-500">
          <Zap className="size-5" />
        </div>
        <h1 className="text-2xl font-bold">R3F Hooks</h1>
        <Badge variant="secondary">{topics.length} topics</Badge>
      </div>
      <p className="text-muted-foreground mb-8">
        Master the core hooks provided by React Three Fiber for animation loops,
        accessing internal state, and loading external assets into your 3D
        scenes.
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
