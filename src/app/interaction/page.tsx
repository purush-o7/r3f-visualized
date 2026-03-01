import Link from "next/link";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Zap, Activity, Waves, Box } from "lucide-react";

const topics = [
  {
    href: "/interaction/animation-libraries",
    label: "Animation Libraries",
    icon: Activity,
    description:
      "Compare raw useFrame animation, spring physics, and smooth lerp interpolation. Understand when each approach shines and how to combine them.",
  },
  {
    href: "/interaction/physics-rapier",
    label: "Physics with Rapier",
    icon: Box,
    description:
      "Turn your scene into a physics playground with gravity, collisions, and rigid bodies using @react-three/rapier.",
  },
  {
    href: "/interaction/audio-spatial",
    label: "Spatial Audio",
    icon: Waves,
    description:
      "Understand positional audio concepts -- how sound exists in 3D space with distance-based falloff and directional awareness.",
  },
];

export default function InteractionPage() {
  return (
    <div className="max-w-4xl">
      <div className="flex items-center gap-3 mb-2">
        <div className="rounded-lg p-2 bg-violet-500/10 text-violet-500">
          <Zap className="size-5" />
        </div>
        <h1 className="text-2xl font-bold">Animation & Physics</h1>
        <Badge variant="secondary">{topics.length} topics</Badge>
      </div>
      <p className="text-muted-foreground mb-8">
        Bring your scenes to life with animation techniques, real-time physics
        simulations, and spatial audio. From simple tweens to full rigid-body
        dynamics, this section covers the tools that make 3D scenes feel alive.
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
