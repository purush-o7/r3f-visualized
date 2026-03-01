import Link from "next/link";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Cpu, Palette, GitBranch } from "lucide-react";

const topics = [
  {
    href: "/shaders/shader-material",
    label: "Shader Material",
    icon: Palette,
    description:
      "Create custom materials by writing vertex and fragment shaders in GLSL, giving you full control over rendering.",
  },
  {
    href: "/shaders/uniforms-varyings",
    label: "Uniforms & Varyings",
    icon: GitBranch,
    description:
      "Pass data from JavaScript to shaders with uniforms and transfer data between vertex and fragment stages with varyings.",
  },
];

export default function ShadersPage() {
  return (
    <div className="max-w-4xl">
      <div className="flex items-center gap-3 mb-2">
        <div className="rounded-lg p-2 bg-pink-500/10 text-pink-500">
          <Cpu className="size-5" />
        </div>
        <h1 className="text-2xl font-bold">Shaders</h1>
        <Badge variant="secondary">{topics.length} topics</Badge>
      </div>
      <p className="text-muted-foreground mb-8">
        Dive into custom GPU programming with GLSL shaders. Learn how to write
        vertex and fragment shaders, pass data between CPU and GPU, and create
        stunning visual effects.
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
