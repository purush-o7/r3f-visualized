import Link from "next/link";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MousePointer, Crosshair } from "lucide-react";

const topics = [
  {
    href: "/events/pointer-events",
    label: "Pointer Events",
    icon: MousePointer,
    description:
      "Handle clicks, hovers, and pointer interactions on 3D objects using familiar React event handlers.",
  },
  {
    href: "/events/raycasting",
    label: "Raycasting",
    icon: Crosshair,
    description:
      "Understand how R3F uses raycasting under the hood to detect intersections and dispatch events to 3D objects.",
  },
];

export default function EventsPage() {
  return (
    <div className="max-w-4xl">
      <div className="flex items-center gap-3 mb-2">
        <div className="rounded-lg p-2 bg-green-500/10 text-green-500">
          <MousePointer className="size-5" />
        </div>
        <h1 className="text-2xl font-bold">Events & Interaction</h1>
        <Badge variant="secondary">{topics.length} topics</Badge>
      </div>
      <p className="text-muted-foreground mb-8">
        Learn how to make your 3D scenes interactive with pointer events and
        understand the raycasting system that powers object picking in React
        Three Fiber.
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
