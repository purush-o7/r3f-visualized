import Link from "next/link";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Sun, Lightbulb, Eclipse, Globe } from "lucide-react";
import { CategoryBg } from "@/components/category-bg-loader";


const topics = [
  {
    href: "/lights/light-types",
    label: "Light Types",
    icon: Lightbulb,
    description:
      "Ambient, directional, point, spot, hemisphere, and rect area — each light type and when to use it.",
  },
  {
    href: "/lights/shadows",
    label: "Shadows",
    icon: Eclipse,
    description:
      "Enabling shadow maps, configuring shadow cameras, and tuning quality vs performance.",
  },
  {
    href: "/lights/environment-maps",
    label: "Environment Maps",
    icon: Globe,
    description:
      "HDR environment maps for realistic image-based lighting and reflections on PBR materials.",
  },
];

export default function LightsPage() {
  return (
    <div className="relative max-w-4xl">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <CategoryBg category="lights" />
        <div className="absolute inset-0 bg-gradient-to-b from-background/30 via-background/60 to-background" />
      </div>
      <div className="relative z-10">
      <div className="flex items-center gap-3 mb-2">
        <div className="rounded-lg p-2 bg-amber-500/10 text-amber-500">
          <Sun className="size-5" />
        </div>
        <h1 className="text-2xl font-bold">Lights</h1>
        <Badge variant="secondary">{topics.length} topics</Badge>
      </div>
      <p className="text-muted-foreground mb-8">
        Lighting brings a 3D scene to life. Without lights, PBR materials appear
        completely black. Three.js provides several light types that simulate
        real-world lighting, plus shadow mapping for grounded, realistic visuals
        and environment maps for ambient illumination.
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
