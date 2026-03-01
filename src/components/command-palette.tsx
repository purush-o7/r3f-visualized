"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
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
  Search,
  Bug,
  RotateCcw,
  CircleDot,
  Waypoints,
  Waves,
  Rocket,
} from "lucide-react";
import {
  CommandDialog,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from "@/components/ui/command";

type NavItem = {
  href: string;
  label: string;
};

type NavGroup = {
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  items: NavItem[];
};

const navGroups: NavGroup[] = [
  {
    label: "Scene Basics",
    icon: Box,
    items: [
      { href: "/scene-basics", label: "Scene Basics Overview" },
      { href: "/scene-basics/scene-camera-renderer", label: "Scene, Camera & Renderer" },
      { href: "/scene-basics/coordinate-system", label: "Coordinate System" },
      { href: "/scene-basics/animation-loop", label: "Animation Loop" },
    ],
  },
  {
    label: "Geometries",
    icon: Shapes,
    items: [
      { href: "/geometries", label: "Geometries Overview" },
      { href: "/geometries/built-in-geometries", label: "Built-in Geometries" },
      { href: "/geometries/buffer-geometry", label: "BufferGeometry" },
      { href: "/geometries/custom-geometry", label: "Custom Geometry" },
    ],
  },
  {
    label: "Materials",
    icon: Paintbrush,
    items: [
      { href: "/materials", label: "Materials Overview" },
      { href: "/materials/basic-materials", label: "Basic Materials" },
      { href: "/materials/standard-physical", label: "Standard & Physical" },
      { href: "/materials/textures", label: "Textures" },
    ],
  },
  {
    label: "Lights",
    icon: Sun,
    items: [
      { href: "/lights", label: "Lights Overview" },
      { href: "/lights/light-types", label: "Light Types" },
      { href: "/lights/shadows", label: "Shadows" },
      { href: "/lights/environment-maps", label: "Environment Maps" },
    ],
  },
  {
    label: "Canvas & Setup",
    icon: Monitor,
    items: [
      { href: "/canvas", label: "Canvas Overview" },
      { href: "/canvas/canvas-component", label: "Canvas Component" },
      { href: "/canvas/jsx-to-three", label: "JSX to Three.js" },
      { href: "/canvas/scene-graph", label: "Scene Graph" },
    ],
  },
  {
    label: "Meshes & Objects",
    icon: Layers,
    items: [
      { href: "/meshes", label: "Meshes Overview" },
      { href: "/meshes/mesh-component", label: "Mesh Component" },
      { href: "/meshes/groups-hierarchy", label: "Groups & Hierarchy" },
      { href: "/meshes/instanced-mesh", label: "InstancedMesh" },
    ],
  },
  {
    label: "R3F Hooks",
    icon: Atom,
    items: [
      { href: "/r3f-hooks", label: "R3F Hooks Overview" },
      { href: "/r3f-hooks/use-frame", label: "useFrame" },
      { href: "/r3f-hooks/use-three", label: "useThree" },
      { href: "/r3f-hooks/use-loader", label: "useLoader" },
    ],
  },
  {
    label: "Events & Interaction",
    icon: MousePointer,
    items: [
      { href: "/events", label: "Events Overview" },
      { href: "/events/pointer-events", label: "Pointer Events" },
      { href: "/events/raycasting", label: "Raycasting" },
    ],
  },
  {
    label: "Controls",
    icon: Orbit,
    items: [
      { href: "/controls", label: "Controls Overview" },
      { href: "/controls/orbit-controls", label: "OrbitControls" },
      { href: "/controls/camera-controls", label: "Camera Controls" },
    ],
  },
  {
    label: "Staging & Environment",
    icon: Globe,
    items: [
      { href: "/staging", label: "Staging Overview" },
      { href: "/staging/environment", label: "Environment" },
      { href: "/staging/stage-component", label: "Stage Component" },
      { href: "/staging/sky-stars", label: "Sky & Stars" },
    ],
  },
  {
    label: "Text & HTML",
    icon: Type,
    items: [
      { href: "/text-html", label: "Text & HTML Overview" },
      { href: "/text-html/text3d", label: "Text3D" },
      { href: "/text-html/html-overlay", label: "HTML Overlay" },
    ],
  },
  {
    label: "Loaders & Models",
    icon: Download,
    items: [
      { href: "/loaders", label: "Loaders Overview" },
      { href: "/loaders/gltf-models", label: "GLTF Models" },
      { href: "/loaders/use-gltf", label: "useGLTF" },
    ],
  },
  {
    label: "Debug & Helpers",
    icon: Bug,
    items: [
      { href: "/debug", label: "Debug Overview" },
      { href: "/debug/wireframe-helpers", label: "Wireframe & Helpers" },
      { href: "/debug/camera-types", label: "Camera Types" },
    ],
  },
  {
    label: "Transforms & Color",
    icon: RotateCcw,
    items: [
      { href: "/transforms", label: "Transforms Overview" },
      { href: "/transforms/position-rotation-scale", label: "Position, Rotation & Scale" },
      { href: "/transforms/colors-spaces", label: "Colors & Color Spaces" },
      { href: "/transforms/responsive-resize", label: "Responsive & Resize" },
      { href: "/transforms/fog-atmosphere", label: "Fog & Atmosphere" },
    ],
  },
  {
    label: "Particles & Lines",
    icon: CircleDot,
    items: [
      { href: "/particles", label: "Particles Overview" },
      { href: "/particles/points-systems", label: "Points & Particle Systems" },
      { href: "/particles/lines-curves", label: "Lines & Curves" },
      { href: "/particles/sprites-billboards", label: "Sprites & Billboards" },
      { href: "/particles/render-targets", label: "Render Targets" },
    ],
  },
  {
    label: "Animation & Physics",
    icon: Waypoints,
    items: [
      { href: "/interaction", label: "Interaction Overview" },
      { href: "/interaction/animation-libraries", label: "Animation Libraries" },
      { href: "/interaction/physics-rapier", label: "Physics (Rapier)" },
      { href: "/interaction/audio-spatial", label: "Spatial Audio" },
    ],
  },
  {
    label: "Shader Recipes",
    icon: Waves,
    items: [
      { href: "/shader-recipes", label: "Shader Recipes Overview" },
      { href: "/shader-recipes/raging-sea", label: "Raging Sea" },
      { href: "/shader-recipes/hologram-effect", label: "Hologram Effect" },
      { href: "/shader-recipes/galaxy-generator", label: "Galaxy Generator" },
      { href: "/shader-recipes/procedural-terrain", label: "Procedural Terrain" },
    ],
  },
  {
    label: "Shaders",
    icon: Palette,
    items: [
      { href: "/shaders", label: "Shaders Overview" },
      { href: "/shaders/shader-material", label: "ShaderMaterial" },
      { href: "/shaders/uniforms-varyings", label: "Uniforms & Varyings" },
    ],
  },
  {
    label: "Post-Processing",
    icon: Sparkles,
    items: [
      { href: "/post-processing", label: "Post-Processing Overview" },
      { href: "/post-processing/effect-composer", label: "EffectComposer" },
      { href: "/post-processing/built-in-effects", label: "Built-in Effects" },
    ],
  },
  {
    label: "Performance",
    icon: Gauge,
    items: [
      { href: "/performance", label: "Performance Overview" },
      { href: "/performance/optimization", label: "Optimization Tips" },
      { href: "/performance/drei-performance", label: "Drei Performance" },
    ],
  },
  {
    label: "Production",
    icon: Rocket,
    items: [
      { href: "/production", label: "Production Overview" },
      { href: "/production/realistic-render", label: "Realistic Render" },
      { href: "/production/loading-progress", label: "Loading Progress" },
      { href: "/production/code-structuring", label: "Code Structuring" },
      { href: "/production/go-live", label: "Go Live" },
    ],
  },
];

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setOpen((prev) => !prev);
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleSelect = useCallback(
    (href: string) => {
      setOpen(false);
      router.push(href);
    },
    [router]
  );

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-2 rounded-md text-sm text-muted-foreground ring-offset-background transition-colors hover:bg-accent hover:text-accent-foreground h-7 px-2"
      >
        <Search className="size-4" />
        <kbd className="hidden sm:inline-flex h-5 items-center gap-0.5 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground">
          <span className="text-xs">⌘</span>K
        </kbd>
      </button>
      <CommandDialog
        open={open}
        onOpenChange={setOpen}
        title="Navigate"
        description="Search topics across all sections"
      >
        <CommandInput placeholder="Search topics..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          {navGroups.map((group) => (
            <CommandGroup key={group.label} heading={group.label}>
              {group.items.map((item) => (
                <CommandItem
                  key={item.href}
                  value={`${group.label} ${item.label}`}
                  onSelect={() => handleSelect(item.href)}
                >
                  <group.icon className="size-4 text-muted-foreground" />
                  <span>{item.label}</span>
                </CommandItem>
              ))}
            </CommandGroup>
          ))}
        </CommandList>
      </CommandDialog>
    </>
  );
}
