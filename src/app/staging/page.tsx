import Link from "next/link";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Lightbulb, Sun, Theater, Sparkles } from "lucide-react";
import { CategoryBg } from "@/components/category-bg-loader";


const topics = [
  {
    href: "/staging/environment",
    label: "Environment",
    icon: Sun,
    description:
      "Add realistic image-based lighting and skyboxes to your scene using HDRI environment maps.",
  },
  {
    href: "/staging/stage-component",
    label: "Stage Component",
    icon: Theater,
    description:
      "Quickly set up professional lighting and shadows with a single component for product-style presentations.",
  },
  {
    href: "/staging/sky-stars",
    label: "Sky & Stars",
    icon: Sparkles,
    description:
      "Create dynamic sky backgrounds with sun positioning and starfield particle systems for outdoor and space scenes.",
  },
];

export default function StagingPage() {
  return (
    <div className="relative max-w-4xl">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <CategoryBg category="staging" />
        <div className="absolute inset-0 bg-gradient-to-b from-background/30 via-background/60 to-background" />
      </div>
      <div className="relative z-10">
      <div className="flex items-center gap-3 mb-2">
        <div className="rounded-lg p-2 bg-green-500/10 text-green-500">
          <Lightbulb className="size-5" />
        </div>
        <h1 className="text-2xl font-bold">Staging & Environment</h1>
        <Badge variant="secondary">{topics.length} topics</Badge>
      </div>
      <p className="text-muted-foreground mb-8">
        Set up professional scene environments with HDRI lighting, pre-built
        stage setups, and atmospheric effects like skies and star fields using
        drei helpers.
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
