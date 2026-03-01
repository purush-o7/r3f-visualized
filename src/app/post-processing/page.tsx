import Link from "next/link";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Wand2, Layers, Sparkles } from "lucide-react";
import { CategoryBg } from "@/components/category-bg-loader";


const topics = [
  {
    href: "/post-processing/effect-composer",
    label: "Effect Composer",
    icon: Layers,
    description:
      "Set up the post-processing pipeline with EffectComposer to chain and combine multiple screen-space effects.",
  },
  {
    href: "/post-processing/built-in-effects",
    label: "Built-in Effects",
    icon: Sparkles,
    description:
      "Explore ready-to-use effects like bloom, vignette, chromatic aberration, depth of field, and more.",
  },
];

export default function PostProcessingPage() {
  return (
    <div className="relative max-w-4xl">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <CategoryBg category="post-processing" />
        <div className="absolute inset-0 bg-gradient-to-b from-background/30 via-background/60 to-background" />
      </div>
      <div className="relative z-10">
      <div className="flex items-center gap-3 mb-2">
        <div className="rounded-lg p-2 bg-purple-500/10 text-purple-500">
          <Wand2 className="size-5" />
        </div>
        <h1 className="text-2xl font-bold">Post-Processing</h1>
        <Badge variant="secondary">{topics.length} topics</Badge>
      </div>
      <p className="text-muted-foreground mb-8">
        Apply cinematic post-processing effects to your rendered scenes. Learn
        how to set up the effect pipeline and use built-in effects for bloom,
        depth of field, color grading, and more.
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
