"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Box,
  BookOpen,
  ChevronRight,
  Cylinder,
  Paintbrush,
  Sun,
  Image,
  Play,
  Monitor,
  Layers,
  Lightbulb,
  Camera,
  RotateCw,
  Package,
  Globe,
  Type,
  Code,
  Download,
  MousePointer,
  Atom,
  Move3D,
  Palette,
  Sparkles,
  Gauge,
  Eye,
  Orbit,
  Shapes,
  Bug,
  ScanLine,
  RotateCcw,
  Droplets,
  Smartphone,
  CloudFog,
  CircleDot,
  Spline,
  Square,
  Frame,
  Waypoints,
  Zap,
  Volume2,
  Waves,
  Ghost,
  Disc3,
  Mountain,
  SunMedium,
  Loader,
  FolderTree,
  Rocket,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuAction,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Badge } from "@/components/ui/badge";
import { SiteCredits } from "@/components/site-credits";

type TopicItem = {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
};

type Category = {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  topics: TopicItem[];
};

// Three.js Fundamentals
const threeJsCategories: Category[] = [
  {
    label: "Scene Basics",
    href: "/scene-basics",
    icon: Box,
    topics: [
      { href: "/scene-basics/scene-camera-renderer", label: "Scene, Camera & Renderer", icon: Monitor },
      { href: "/scene-basics/coordinate-system", label: "Coordinate System", icon: Move3D },
      { href: "/scene-basics/animation-loop", label: "Animation Loop", icon: Play },
    ],
  },
  {
    label: "Geometries",
    href: "/geometries",
    icon: Shapes,
    topics: [
      { href: "/geometries/built-in-geometries", label: "Built-in Geometries", icon: Cylinder },
      { href: "/geometries/buffer-geometry", label: "BufferGeometry", icon: Layers },
      { href: "/geometries/custom-geometry", label: "Custom Geometry", icon: Code },
    ],
  },
  {
    label: "Materials",
    href: "/materials",
    icon: Paintbrush,
    topics: [
      { href: "/materials/basic-materials", label: "Basic Materials", icon: Palette },
      { href: "/materials/standard-physical", label: "Standard & Physical", icon: Sparkles },
      { href: "/materials/textures", label: "Textures", icon: Image },
    ],
  },
  {
    label: "Lights",
    href: "/lights",
    icon: Sun,
    topics: [
      { href: "/lights/light-types", label: "Light Types", icon: Lightbulb },
      { href: "/lights/shadows", label: "Shadows", icon: Eye },
      { href: "/lights/environment-maps", label: "Environment Maps", icon: Globe },
    ],
  },
];

// React Three Fiber
const r3fCategories: Category[] = [
  {
    label: "Canvas & Setup",
    href: "/canvas",
    icon: Monitor,
    topics: [
      { href: "/canvas/canvas-component", label: "Canvas Component", icon: Monitor },
      { href: "/canvas/jsx-to-three", label: "JSX to Three.js", icon: Code },
      { href: "/canvas/scene-graph", label: "Scene Graph", icon: Layers },
    ],
  },
  {
    label: "Meshes & Objects",
    href: "/meshes",
    icon: Box,
    topics: [
      { href: "/meshes/mesh-component", label: "Mesh Component", icon: Box },
      { href: "/meshes/groups-hierarchy", label: "Groups & Hierarchy", icon: Layers },
      { href: "/meshes/instanced-mesh", label: "InstancedMesh", icon: Package },
    ],
  },
  {
    label: "R3F Hooks",
    href: "/r3f-hooks",
    icon: Atom,
    topics: [
      { href: "/r3f-hooks/use-frame", label: "useFrame", icon: RotateCw },
      { href: "/r3f-hooks/use-three", label: "useThree", icon: Camera },
      { href: "/r3f-hooks/use-loader", label: "useLoader", icon: Download },
    ],
  },
  {
    label: "Events & Interaction",
    href: "/events",
    icon: MousePointer,
    topics: [
      { href: "/events/pointer-events", label: "Pointer Events", icon: MousePointer },
      { href: "/events/raycasting", label: "Raycasting", icon: Eye },
    ],
  },
];

// Drei & Ecosystem
const dreiCategories: Category[] = [
  {
    label: "Controls",
    href: "/controls",
    icon: Orbit,
    topics: [
      { href: "/controls/orbit-controls", label: "OrbitControls", icon: Orbit },
      { href: "/controls/camera-controls", label: "Camera Controls", icon: Camera },
    ],
  },
  {
    label: "Staging & Environment",
    href: "/staging",
    icon: Globe,
    topics: [
      { href: "/staging/environment", label: "Environment", icon: Globe },
      { href: "/staging/stage-component", label: "Stage Component", icon: Sun },
      { href: "/staging/sky-stars", label: "Sky & Stars", icon: Sparkles },
    ],
  },
  {
    label: "Text & HTML",
    href: "/text-html",
    icon: Type,
    topics: [
      { href: "/text-html/text3d", label: "Text3D", icon: Type },
      { href: "/text-html/html-overlay", label: "HTML Overlay", icon: Code },
    ],
  },
  {
    label: "Loaders & Models",
    href: "/loaders",
    icon: Download,
    topics: [
      { href: "/loaders/gltf-models", label: "GLTF Models", icon: Download },
      { href: "/loaders/use-gltf", label: "useGLTF Hook", icon: Package },
    ],
  },
];

// Core Basics
const coreBasicsCategories: Category[] = [
  {
    label: "Debug & Helpers",
    href: "/debug",
    icon: Bug,
    topics: [
      { href: "/debug/wireframe-helpers", label: "Wireframe & Helpers", icon: ScanLine },
      { href: "/debug/camera-types", label: "Camera Types", icon: Camera },
    ],
  },
  {
    label: "Transforms & Color",
    href: "/transforms",
    icon: RotateCcw,
    topics: [
      { href: "/transforms/position-rotation-scale", label: "Position, Rotation & Scale", icon: Move3D },
      { href: "/transforms/colors-spaces", label: "Colors & Color Spaces", icon: Droplets },
      { href: "/transforms/responsive-resize", label: "Responsive & Resize", icon: Smartphone },
      { href: "/transforms/fog-atmosphere", label: "Fog & Atmosphere", icon: CloudFog },
    ],
  },
];

// Visual Effects
const visualEffectsCategories: Category[] = [
  {
    label: "Particles & Lines",
    href: "/particles",
    icon: CircleDot,
    topics: [
      { href: "/particles/points-systems", label: "Points & Particle Systems", icon: CircleDot },
      { href: "/particles/lines-curves", label: "Lines & Curves", icon: Spline },
      { href: "/particles/sprites-billboards", label: "Sprites & Billboards", icon: Square },
      { href: "/particles/render-targets", label: "Render Targets", icon: Frame },
    ],
  },
];

// Interactivity
const interactivityCategories: Category[] = [
  {
    label: "Animation & Physics",
    href: "/interaction",
    icon: Waypoints,
    topics: [
      { href: "/interaction/animation-libraries", label: "Animation Libraries", icon: Zap },
      { href: "/interaction/physics-rapier", label: "Physics (Rapier)", icon: Waypoints },
      { href: "/interaction/audio-spatial", label: "Spatial Audio", icon: Volume2 },
    ],
  },
];

// Shader Recipes
const shaderRecipesCategories: Category[] = [
  {
    label: "Shader Recipes",
    href: "/shader-recipes",
    icon: Waves,
    topics: [
      { href: "/shader-recipes/raging-sea", label: "Raging Sea", icon: Waves },
      { href: "/shader-recipes/hologram-effect", label: "Hologram Effect", icon: Ghost },
      { href: "/shader-recipes/galaxy-generator", label: "Galaxy Generator", icon: Disc3 },
      { href: "/shader-recipes/procedural-terrain", label: "Procedural Terrain", icon: Mountain },
    ],
  },
];

// Production
const productionCategories: Category[] = [
  {
    label: "Production",
    href: "/production",
    icon: Rocket,
    topics: [
      { href: "/production/realistic-render", label: "Realistic Render", icon: SunMedium },
      { href: "/production/loading-progress", label: "Loading Progress", icon: Loader },
      { href: "/production/code-structuring", label: "Code Structuring", icon: FolderTree },
      { href: "/production/go-live", label: "Go Live", icon: Rocket },
    ],
  },
];

// Advanced
const advancedCategories: Category[] = [
  {
    label: "Shaders",
    href: "/shaders",
    icon: Palette,
    topics: [
      { href: "/shaders/shader-material", label: "ShaderMaterial", icon: Code },
      { href: "/shaders/uniforms-varyings", label: "Uniforms & Varyings", icon: Layers },
    ],
  },
  {
    label: "Post-Processing",
    href: "/post-processing",
    icon: Sparkles,
    topics: [
      { href: "/post-processing/effect-composer", label: "EffectComposer", icon: Layers },
      { href: "/post-processing/built-in-effects", label: "Built-in Effects", icon: Sparkles },
    ],
  },
  {
    label: "Performance",
    href: "/performance",
    icon: Gauge,
    topics: [
      { href: "/performance/optimization", label: "Optimization Tips", icon: Gauge },
      { href: "/performance/drei-performance", label: "Drei Performance", icon: Sparkles },
    ],
  },
];

function CategoryItem({
  category,
  pathname,
}: {
  category: Category;
  pathname: string;
}) {
  const isActive =
    pathname === category.href ||
    category.topics.some((t) => pathname === t.href);

  if (category.topics.length === 0) {
    return (
      <SidebarMenuItem>
        <SidebarMenuButton asChild isActive={pathname === category.href} className="group/btn">
          <Link href={category.href}>
            <category.icon className="transition-transform duration-200 group-hover/btn:scale-110" />
            <span>{category.label}</span>
          </Link>
        </SidebarMenuButton>
      </SidebarMenuItem>
    );
  }

  return (
    <Collapsible asChild defaultOpen={isActive}>
      <SidebarMenuItem>
        <SidebarMenuButton asChild isActive={pathname === category.href} tooltip={category.label} className="group/btn">
          <Link href={category.href}>
            <category.icon className="transition-transform duration-200 group-hover/btn:scale-110" />
            <span>{category.label}</span>
          </Link>
        </SidebarMenuButton>
        <CollapsibleTrigger asChild>
          <SidebarMenuAction className="data-[state=open]:rotate-90 transition-transform duration-200">
            <ChevronRight />
          </SidebarMenuAction>
        </CollapsibleTrigger>
        <CollapsibleContent className="transition-all duration-200 ease-in-out data-[state=closed]:opacity-0 data-[state=open]:opacity-100">
          <SidebarMenuSub>
            {category.topics.map((topic) => (
              <SidebarMenuSubItem key={topic.href}>
                <SidebarMenuSubButton
                  asChild
                  isActive={pathname === topic.href}
                  className="transition-all duration-150 hover:translate-x-0.5"
                >
                  <Link href={topic.href}>
                    <span className="font-mono text-xs">{topic.label}</span>
                  </Link>
                </SidebarMenuSubButton>
              </SidebarMenuSubItem>
            ))}
          </SidebarMenuSub>
        </CollapsibleContent>
      </SidebarMenuItem>
    </Collapsible>
  );
}

export function AppSidebar() {
  const pathname = usePathname();

  return (
    <Sidebar>
      <SidebarHeader className="p-4">
        <Link href="/" className="flex items-center gap-2">
          <Box className="size-5" />
          <div>
            <p className="text-sm font-semibold leading-none">Learn R3F</p>
            <p className="text-xs text-muted-foreground">
              Three.js + React Three Fiber
            </p>
          </div>
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Three.js Fundamentals</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {threeJsCategories.map((category) => (
                <CategoryItem
                  key={category.href}
                  category={category}
                  pathname={pathname}
                />
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel>React Three Fiber</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {r3fCategories.map((category) => (
                <CategoryItem
                  key={category.href}
                  category={category}
                  pathname={pathname}
                />
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel>
            Drei & Ecosystem
            <Badge variant="secondary" className="ml-auto text-[10px]">
              @react-three/drei
            </Badge>
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {dreiCategories.map((category) => (
                <CategoryItem
                  key={category.href}
                  category={category}
                  pathname={pathname}
                />
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel>Core Basics</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {coreBasicsCategories.map((category) => (
                <CategoryItem
                  key={category.href}
                  category={category}
                  pathname={pathname}
                />
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel>Visual Effects</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {visualEffectsCategories.map((category) => (
                <CategoryItem
                  key={category.href}
                  category={category}
                  pathname={pathname}
                />
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel>Interactivity</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {interactivityCategories.map((category) => (
                <CategoryItem
                  key={category.href}
                  category={category}
                  pathname={pathname}
                />
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel>Shader Recipes</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {shaderRecipesCategories.map((category) => (
                <CategoryItem
                  key={category.href}
                  category={category}
                  pathname={pathname}
                />
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel>Advanced</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {advancedCategories.map((category) => (
                <CategoryItem
                  key={category.href}
                  category={category}
                  pathname={pathname}
                />
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel>Production</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {productionCategories.map((category) => (
                <CategoryItem
                  key={category.href}
                  category={category}
                  pathname={pathname}
                />
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="p-4">
        <SiteCredits />
      </SidebarFooter>
    </Sidebar>
  );
}
