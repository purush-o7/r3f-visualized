import Link from "next/link";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Rocket, SunMedium, Loader, FolderTree } from "lucide-react";

const topics = [
  {
    href: "/production/realistic-render",
    label: "Realistic Render",
    icon: SunMedium,
    description:
      "Master tone mapping, color spaces, shadow configuration, and anti-aliasing to make your scenes look photorealistic with minimal effort.",
  },
  {
    href: "/production/loading-progress",
    label: "Loading Progress",
    icon: Loader,
    description:
      "Build polished loading screens with React Suspense and drei's useProgress hook. Keep users engaged while assets load.",
  },
  {
    href: "/production/code-structuring",
    label: "Code Structuring",
    icon: FolderTree,
    description:
      "Organize your R3F codebase with feature-based folders, custom hooks, and clean separation between UI and 3D logic.",
  },
  {
    href: "/production/go-live",
    label: "Go Live",
    icon: Rocket,
    description:
      "Ship your app with confidence. Build optimization, bundle analysis, deployment to Vercel/Netlify, and production monitoring.",
  },
];

export default function ProductionPage() {
  return (
    <div className="max-w-4xl">
      <div className="flex items-center gap-3 mb-2">
        <div className="rounded-lg p-2 bg-orange-500/10 text-orange-500">
          <Rocket className="size-5" />
        </div>
        <h1 className="text-2xl font-bold">Production</h1>
        <Badge variant="secondary">{topics.length} topics</Badge>
      </div>
      <p className="text-muted-foreground mb-8">
        Ship-ready skills that separate prototypes from production apps. From
        photorealistic rendering and loading UX to code organization and
        deployment, these are the final touches that make your R3F project
        professional.
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
