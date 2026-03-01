"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { trackEvent } from "@/lib/analytics";

type TopicLink = { href: string; label: string; category: string };

const allTopics: TopicLink[] = [
  // Three.js Fundamentals — Scene Basics
  { href: "/scene-basics/scene-camera-renderer", label: "Scene, Camera & Renderer", category: "Scene Basics" },
  { href: "/scene-basics/coordinate-system", label: "Coordinate System", category: "Scene Basics" },
  { href: "/scene-basics/animation-loop", label: "Animation Loop", category: "Scene Basics" },
  // Three.js Fundamentals — Geometries
  { href: "/geometries/built-in-geometries", label: "Built-in Geometries", category: "Geometries" },
  { href: "/geometries/buffer-geometry", label: "BufferGeometry", category: "Geometries" },
  { href: "/geometries/custom-geometry", label: "Custom Geometry", category: "Geometries" },
  // Three.js Fundamentals — Materials
  { href: "/materials/basic-materials", label: "Basic Materials", category: "Materials" },
  { href: "/materials/standard-physical", label: "Standard & Physical", category: "Materials" },
  { href: "/materials/textures", label: "Textures", category: "Materials" },
  // Three.js Fundamentals — Lights
  { href: "/lights/light-types", label: "Light Types", category: "Lights" },
  { href: "/lights/shadows", label: "Shadows", category: "Lights" },
  { href: "/lights/environment-maps", label: "Environment Maps", category: "Lights" },
  // React Three Fiber — Canvas & Setup
  { href: "/canvas/canvas-component", label: "Canvas Component", category: "Canvas & Setup" },
  { href: "/canvas/jsx-to-three", label: "JSX to Three.js", category: "Canvas & Setup" },
  { href: "/canvas/scene-graph", label: "Scene Graph", category: "Canvas & Setup" },
  // React Three Fiber — Meshes & Objects
  { href: "/meshes/mesh-component", label: "Mesh Component", category: "Meshes & Objects" },
  { href: "/meshes/groups-hierarchy", label: "Groups & Hierarchy", category: "Meshes & Objects" },
  { href: "/meshes/instanced-mesh", label: "InstancedMesh", category: "Meshes & Objects" },
  // React Three Fiber — Hooks
  { href: "/r3f-hooks/use-frame", label: "useFrame", category: "R3F Hooks" },
  { href: "/r3f-hooks/use-three", label: "useThree", category: "R3F Hooks" },
  { href: "/r3f-hooks/use-loader", label: "useLoader", category: "R3F Hooks" },
  // React Three Fiber — Events
  { href: "/events/pointer-events", label: "Pointer Events", category: "Events & Interaction" },
  { href: "/events/raycasting", label: "Raycasting", category: "Events & Interaction" },
  // Drei — Controls
  { href: "/controls/orbit-controls", label: "OrbitControls", category: "Controls" },
  { href: "/controls/camera-controls", label: "Camera Controls", category: "Controls" },
  // Drei — Staging & Environment
  { href: "/staging/environment", label: "Environment", category: "Staging & Environment" },
  { href: "/staging/stage-component", label: "Stage Component", category: "Staging & Environment" },
  { href: "/staging/sky-stars", label: "Sky & Stars", category: "Staging & Environment" },
  // Drei — Text & HTML
  { href: "/text-html/text3d", label: "Text3D", category: "Text & HTML" },
  { href: "/text-html/html-overlay", label: "HTML Overlay", category: "Text & HTML" },
  // Drei — Loaders & Models
  { href: "/loaders/gltf-models", label: "GLTF Models", category: "Loaders & Models" },
  { href: "/loaders/use-gltf", label: "useGLTF", category: "Loaders & Models" },
  // Core Basics — Debug & Helpers
  { href: "/debug/wireframe-helpers", label: "Wireframe & Helpers", category: "Debug & Helpers" },
  { href: "/debug/camera-types", label: "Camera Types", category: "Debug & Helpers" },
  // Core Basics — Transforms & Color
  { href: "/transforms/position-rotation-scale", label: "Position, Rotation & Scale", category: "Transforms & Color" },
  { href: "/transforms/colors-spaces", label: "Colors & Color Spaces", category: "Transforms & Color" },
  { href: "/transforms/responsive-resize", label: "Responsive & Resize", category: "Transforms & Color" },
  { href: "/transforms/fog-atmosphere", label: "Fog & Atmosphere", category: "Transforms & Color" },
  // Visual Effects — Particles & Lines
  { href: "/particles/points-systems", label: "Points & Particle Systems", category: "Particles & Lines" },
  { href: "/particles/lines-curves", label: "Lines & Curves", category: "Particles & Lines" },
  { href: "/particles/sprites-billboards", label: "Sprites & Billboards", category: "Particles & Lines" },
  { href: "/particles/render-targets", label: "Render Targets", category: "Particles & Lines" },
  // Interactivity — Animation & Physics
  { href: "/interaction/animation-libraries", label: "Animation Libraries", category: "Animation & Physics" },
  { href: "/interaction/physics-rapier", label: "Physics (Rapier)", category: "Animation & Physics" },
  { href: "/interaction/audio-spatial", label: "Spatial Audio", category: "Animation & Physics" },
  // Shader Recipes
  { href: "/shader-recipes/raging-sea", label: "Raging Sea", category: "Shader Recipes" },
  { href: "/shader-recipes/hologram-effect", label: "Hologram Effect", category: "Shader Recipes" },
  { href: "/shader-recipes/galaxy-generator", label: "Galaxy Generator", category: "Shader Recipes" },
  { href: "/shader-recipes/procedural-terrain", label: "Procedural Terrain", category: "Shader Recipes" },
  // Advanced — Shaders
  { href: "/shaders/shader-material", label: "ShaderMaterial", category: "Shaders" },
  { href: "/shaders/uniforms-varyings", label: "Uniforms & Varyings", category: "Shaders" },
  // Advanced — Post-Processing
  { href: "/post-processing/effect-composer", label: "EffectComposer", category: "Post-Processing" },
  { href: "/post-processing/built-in-effects", label: "Built-in Effects", category: "Post-Processing" },
  // Advanced — Performance
  { href: "/performance/optimization", label: "Optimization Tips", category: "Performance" },
  { href: "/performance/drei-performance", label: "Drei Performance", category: "Performance" },
  // Production
  { href: "/production/realistic-render", label: "Realistic Render", category: "Production" },
  { href: "/production/loading-progress", label: "Loading Progress", category: "Production" },
  { href: "/production/code-structuring", label: "Code Structuring", category: "Production" },
  { href: "/production/go-live", label: "Go Live", category: "Production" },
];

export function TopicNav() {
  const pathname = usePathname();

  const currentIndex = allTopics.findIndex((t) => t.href === pathname);
  if (currentIndex === -1) return null;

  const current = allTopics[currentIndex];
  const prev = currentIndex > 0 ? allTopics[currentIndex - 1] : null;
  const next = currentIndex < allTopics.length - 1 ? allTopics[currentIndex + 1] : null;

  if (!prev && !next) return null;

  return (
    <nav className="flex items-center justify-between border-t pt-8 mt-12">
      {prev ? (
        <Link
          href={prev.href}
          onClick={() => trackEvent("topic_nav", "navigation", `prev: ${prev.label}`)}
          className="group flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ChevronLeft className="size-4 transition-transform group-hover:-translate-x-0.5" />
          <div className="text-right">
            <div className="text-xs text-muted-foreground/70">
              {prev.category !== current.category ? prev.category : "Previous"}
            </div>
            <div className="font-medium">{prev.label}</div>
          </div>
        </Link>
      ) : (
        <div />
      )}
      {next ? (
        <Link
          href={next.href}
          onClick={() => trackEvent("topic_nav", "navigation", `next: ${next.label}`)}
          className="group flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors text-right"
        >
          <div>
            <div className="text-xs text-muted-foreground/70">
              {next.category !== current.category ? next.category : "Next"}
            </div>
            <div className="font-medium">{next.label}</div>
          </div>
          <ChevronRight className="size-4 transition-transform group-hover:translate-x-0.5" />
        </Link>
      ) : (
        <div />
      )}
    </nav>
  );
}
