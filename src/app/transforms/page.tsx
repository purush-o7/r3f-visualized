import Link from "next/link";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { RotateCcw, Move3D, Droplets, Smartphone, CloudFog } from "lucide-react";

const topics = [
  {
    href: "/transforms/position-rotation-scale",
    label: "Position, Rotation & Scale",
    icon: Move3D,
    description:
      "Move, spin, and resize objects in 3D space. Understand transform order and local vs world coordinates.",
  },
  {
    href: "/transforms/colors-spaces",
    label: "Colors & Color Spaces",
    icon: Droplets,
    description:
      "RGB, HSL, hex, named colors, and the critical difference between sRGB and Linear color spaces.",
  },
  {
    href: "/transforms/responsive-resize",
    label: "Responsive & Resize",
    icon: Smartphone,
    description:
      "Make your 3D scenes adapt to any screen size — from phones to ultrawide monitors.",
  },
  {
    href: "/transforms/fog-atmosphere",
    label: "Fog & Atmosphere",
    icon: CloudFog,
    description:
      "Add depth and mood with fog. Linear fog fades at a distance, exponential fog creates dense atmospheric haze.",
  },
];

export default function TransformsPage() {
  return (
    <div className="max-w-4xl">
      <div className="flex items-center gap-3 mb-2">
        <div className="rounded-lg p-2 bg-violet-500/10 text-violet-500">
          <RotateCcw className="size-5" />
        </div>
        <h1 className="text-2xl font-bold">Transforms & Color</h1>
        <Badge variant="secondary">{topics.length} topics</Badge>
      </div>
      <p className="text-muted-foreground mb-8">
        Every visible object in a 3D scene has a transform (where it is, how it&apos;s
        rotated, how big it is) and a color. These fundamentals control how your
        scene looks and feels — from precise object placement to atmospheric fog
        that fades distant objects into mist.
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
