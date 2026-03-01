import Link from "next/link";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Gauge, Zap, PackageCheck } from "lucide-react";
import { CategoryBg } from "@/components/category-bg-loader";


const topics = [
  {
    href: "/performance/optimization",
    label: "Optimization Techniques",
    icon: Zap,
    description:
      "Core strategies for keeping your R3F scenes running at 60fps — geometry merging, draw call reduction, and memoization.",
  },
  {
    href: "/performance/drei-performance",
    label: "Drei Performance Helpers",
    icon: PackageCheck,
    description:
      "Leverage drei utilities like Instances, Merged, Bvh, and adaptive rendering for production-grade performance.",
  },
];

export default function PerformancePage() {
  return (
    <div className="relative max-w-4xl">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <CategoryBg category="performance" />
        <div className="absolute inset-0 bg-gradient-to-b from-background/30 via-background/60 to-background" />
      </div>
      <div className="relative z-10">
      <div className="flex items-center gap-3 mb-2">
        <div className="rounded-lg p-2 bg-red-500/10 text-red-500">
          <Gauge className="size-5" />
        </div>
        <h1 className="text-2xl font-bold">Performance</h1>
        <Badge variant="secondary">{topics.length} topics</Badge>
      </div>
      <p className="text-muted-foreground mb-8">
        Optimize your React Three Fiber applications for smooth, consistent
        frame rates. Learn core optimization patterns and leverage drei helpers
        built for production performance.
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
