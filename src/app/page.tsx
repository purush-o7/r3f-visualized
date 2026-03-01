import Link from "next/link";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Box,
  Shapes,
  Paintbrush,
  Sun,
  Monitor,
  Layers,
  Atom,
  MousePointer,
  Orbit,
  Globe,
  Type,
  Download,
  Palette,
  Sparkles,
  Gauge,
  ArrowRight,
  BookOpen,
  Gamepad2,
  Eye,
} from "lucide-react";

const highlights = [
  {
    icon: BookOpen,
    title: "Three.js First",
    description:
      "Scene, camera, renderer, geometries, materials, and lights — the 3D foundations every R3F component builds on. Start here before diving into React.",
    accent: "text-blue-500 bg-blue-500/10",
  },
  {
    icon: Gamepad2,
    title: "Interactive Scenes",
    description:
      "Each concept comes with a live 3D scene you can interact with. Rotate, zoom, click — learn 3D by playing with 3D.",
    accent: "text-purple-500 bg-purple-500/10",
  },
  {
    icon: Eye,
    title: "Visual Learning",
    description:
      "See every concept rendered in real-time. From basic meshes to custom shaders, every page has live demos you can tinker with.",
    accent: "text-emerald-500 bg-emerald-500/10",
  },
];

const threeJsFundamentals = [
  {
    href: "/scene-basics",
    label: "Scene Basics",
    icon: Box,
    description:
      "How the 3D pipeline works — scene, camera, renderer, and the animation loop that brings everything to life.",
    topicCount: 3,
    accent: "text-blue-500 bg-blue-500/10 border-blue-500/20",
  },
  {
    href: "/geometries",
    label: "Geometries",
    icon: Shapes,
    description:
      "Built-in shapes, buffer geometry internals, and creating custom geometry from vertices and faces.",
    topicCount: 3,
    accent: "text-teal-500 bg-teal-500/10 border-teal-500/20",
  },
  {
    href: "/materials",
    label: "Materials",
    icon: Paintbrush,
    description:
      "From basic flat colors to physically-based rendering, plus texture mapping and UV coordinates.",
    topicCount: 3,
    accent: "text-purple-500 bg-purple-500/10 border-purple-500/20",
  },
  {
    href: "/lights",
    label: "Lights",
    icon: Sun,
    description:
      "Light types, shadow casting and receiving, and environment maps for realistic reflections.",
    topicCount: 3,
    accent: "text-amber-500 bg-amber-500/10 border-amber-500/20",
  },
];

const r3fCategories = [
  {
    href: "/canvas",
    label: "Canvas & Setup",
    icon: Monitor,
    description:
      "The Canvas component, how JSX maps to Three.js objects, and the declarative scene graph.",
    topicCount: 3,
  },
  {
    href: "/meshes",
    label: "Meshes & Objects",
    icon: Layers,
    description:
      "Mesh component, groups and hierarchy, and instanced rendering for thousands of objects.",
    topicCount: 3,
  },
  {
    href: "/r3f-hooks",
    label: "R3F Hooks",
    icon: Atom,
    description:
      "useFrame for animations, useThree for scene access, and useLoader for async resources.",
    topicCount: 3,
  },
  {
    href: "/events",
    label: "Events & Interaction",
    icon: MousePointer,
    description:
      "Pointer events on 3D objects and raycasting for precise hit detection.",
    topicCount: 2,
  },
];

const dreiCategories = [
  {
    href: "/controls",
    label: "Controls",
    icon: Orbit,
    description:
      "OrbitControls, camera controls, and other navigation helpers.",
    topicCount: 2,
  },
  {
    href: "/staging",
    label: "Staging & Environment",
    icon: Globe,
    description:
      "Environment maps, the Stage component, sky, and stars for scene setup.",
    topicCount: 3,
  },
  {
    href: "/text-html",
    label: "Text & HTML",
    icon: Type,
    description:
      "3D text rendering and overlaying HTML elements in 3D space.",
    topicCount: 2,
  },
  {
    href: "/loaders",
    label: "Loaders & Models",
    icon: Download,
    description:
      "Loading GLTF/GLB models and the useGLTF hook for optimized model loading.",
    topicCount: 2,
  },
];

const advancedCategories = [
  {
    href: "/shaders",
    label: "Shaders",
    icon: Palette,
    description:
      "Custom ShaderMaterial, vertex and fragment shaders, uniforms and varyings.",
    topicCount: 2,
  },
  {
    href: "/post-processing",
    label: "Post-Processing",
    icon: Sparkles,
    description:
      "EffectComposer setup and built-in effects like bloom, vignette, and SSAO.",
    topicCount: 2,
  },
  {
    href: "/performance",
    label: "Performance",
    icon: Gauge,
    description:
      "Optimization tips, instancing, LOD, drei performance helpers, and profiling.",
    topicCount: 2,
  },
];

export default function Home() {
  return (
    <div className="max-w-4xl">
      {/* Hero */}
      <div className="mb-10">
        <h1 className="text-3xl font-bold tracking-tight mb-2">
          Learn React Three Fiber
        </h1>
        <p className="text-muted-foreground">
          An interactive guide to 3D on the web — from Three.js fundamentals to production R3F.
        </p>
      </div>

      {/* How it works */}
      <section className="mb-12">
        <div className="grid gap-4 sm:grid-cols-3">
          {highlights.map((item) => (
            <div key={item.title} className="space-y-2">
              <div
                className={`inline-flex rounded-lg p-2 ${item.accent}`}
              >
                <item.icon className="size-4" />
              </div>
              <h3 className="font-semibold text-sm">{item.title}</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      <Separator className="my-8" />

      {/* Three.js Fundamentals */}
      <section className="mb-10">
        <div className="flex items-center gap-2 mb-2">
          <h2 className="text-xl font-semibold">Three.js Fundamentals</h2>
          <Badge
            variant="default"
            className="bg-gradient-to-r from-blue-500 to-cyan-500 border-0"
          >
            Start Here
          </Badge>
        </div>
        <p className="text-sm text-muted-foreground mb-6">
          These are the core Three.js concepts that R3F abstracts over. Understanding them
          makes everything else click — geometry, materials, lights, and the render loop.
        </p>
        <div className="grid gap-4 sm:grid-cols-2">
          {threeJsFundamentals.map((category) => (
            <Link key={category.href} href={category.href}>
              <Card className="group h-full transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 cursor-pointer border-border/50 hover:border-border">
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <div className={`rounded-md p-1 ${category.accent}`}>
                      <category.icon className="size-4" />
                    </div>
                    <CardTitle className="text-base">
                      {category.label}
                    </CardTitle>
                    <Badge
                      variant="secondary"
                      className="ml-auto text-[10px]"
                    >
                      {category.topicCount} topics
                    </Badge>
                  </div>
                  <CardDescription className="line-clamp-2">
                    {category.description}
                  </CardDescription>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground/70 pt-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <span>Explore</span>
                    <ArrowRight className="size-3" />
                  </div>
                </CardHeader>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      <Separator className="my-8" />

      {/* React Three Fiber */}
      <section className="mb-10">
        <div className="flex items-center gap-2 mb-2">
          <h2 className="text-xl font-semibold">React Three Fiber</h2>
          <Badge variant="outline">@react-three/fiber</Badge>
        </div>
        <p className="text-sm text-muted-foreground mb-6">
          The React renderer for Three.js. Write 3D scenes as JSX components with
          hooks, state, and the full React ecosystem.
        </p>
        <div className="grid gap-4 sm:grid-cols-2">
          {r3fCategories.map((category) => (
            <Link key={category.href} href={category.href}>
              <Card className="group h-full transition-all duration-300 hover:shadow-md hover:-translate-y-0.5 cursor-pointer border-border/50 hover:border-border">
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <category.icon className="size-4 text-muted-foreground" />
                    <CardTitle className="text-base">
                      {category.label}
                    </CardTitle>
                    <Badge
                      variant="secondary"
                      className="ml-auto text-[10px]"
                    >
                      {category.topicCount} topics
                    </Badge>
                  </div>
                  <CardDescription>{category.description}</CardDescription>
                </CardHeader>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      <Separator className="my-8" />

      {/* Drei & Ecosystem */}
      <section className="mb-10">
        <div className="flex items-center gap-2 mb-2">
          <h2 className="text-xl font-semibold">Drei & Ecosystem</h2>
          <Badge variant="secondary">@react-three/drei</Badge>
        </div>
        <p className="text-sm text-muted-foreground mb-6">
          Ready-made helpers, controls, loaders, and abstractions that make R3F development
          faster. The batteries-included toolkit.
        </p>
        <div className="grid gap-4 sm:grid-cols-2">
          {dreiCategories.map((category) => (
            <Link key={category.href} href={category.href}>
              <Card className="group h-full transition-all duration-300 hover:shadow-md hover:-translate-y-0.5 cursor-pointer border-border/50 hover:border-border">
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <category.icon className="size-4 text-muted-foreground" />
                    <CardTitle className="text-base">
                      {category.label}
                    </CardTitle>
                    <Badge
                      variant="secondary"
                      className="ml-auto text-[10px]"
                    >
                      {category.topicCount} topics
                    </Badge>
                  </div>
                  <CardDescription>{category.description}</CardDescription>
                </CardHeader>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      <Separator className="my-8" />

      {/* Advanced */}
      <section>
        <div className="flex items-center gap-2 mb-2">
          <h2 className="text-xl font-semibold">Advanced</h2>
          <Badge variant="outline">Deep Dive</Badge>
        </div>
        <p className="text-sm text-muted-foreground mb-6">
          Custom shaders, post-processing effects, and performance optimization.
          These topics take your 3D scenes to the next level.
        </p>
        <div className="grid gap-4 sm:grid-cols-2">
          {advancedCategories.map((category) => (
            <Link key={category.href} href={category.href}>
              <Card className="group h-full transition-all duration-300 hover:shadow-md hover:-translate-y-0.5 cursor-pointer border-border/50 hover:border-border">
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <category.icon className="size-4 text-muted-foreground" />
                    <CardTitle className="text-base">
                      {category.label}
                    </CardTitle>
                    <Badge
                      variant="secondary"
                      className="ml-auto text-[10px]"
                    >
                      {category.topicCount} topics
                    </Badge>
                  </div>
                  <CardDescription>{category.description}</CardDescription>
                </CardHeader>
              </Card>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
