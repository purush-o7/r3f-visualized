import Link from "next/link";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Type, TextCursorInput, Code } from "lucide-react";

const topics = [
  {
    href: "/text-html/text3d",
    label: "Text3D",
    icon: Type,
    description:
      "Render extruded 3D typography in your scene using font files, with full control over geometry and materials.",
  },
  {
    href: "/text-html/html-overlay",
    label: "HTML Overlay",
    icon: Code,
    description:
      "Embed interactive HTML elements inside your 3D scene that track and follow 3D object positions.",
  },
];

export default function TextHtmlPage() {
  return (
    <div className="max-w-4xl">
      <div className="flex items-center gap-3 mb-2">
        <div className="rounded-lg p-2 bg-violet-500/10 text-violet-500">
          <TextCursorInput className="size-5" />
        </div>
        <h1 className="text-2xl font-bold">Text & HTML</h1>
        <Badge variant="secondary">{topics.length} topics</Badge>
      </div>
      <p className="text-muted-foreground mb-8">
        Add text and HTML content to your 3D scenes. Create extruded 3D
        typography or overlay interactive HTML elements that track positions in
        3D space.
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
