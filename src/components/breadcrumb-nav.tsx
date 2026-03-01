"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";
import { Fragment } from "react";

const labelMap: Record<string, string> = {
  // Three.js Fundamentals
  "scene-basics": "Scene Basics",
  "scene-camera-renderer": "Scene, Camera & Renderer",
  "coordinate-system": "Coordinate System",
  "animation-loop": "Animation Loop",
  geometries: "Geometries",
  "built-in-geometries": "Built-in Geometries",
  "buffer-geometry": "BufferGeometry",
  "custom-geometry": "Custom Geometry",
  materials: "Materials",
  "basic-materials": "Basic Materials",
  "standard-physical": "Standard & Physical",
  textures: "Textures",
  lights: "Lights",
  "light-types": "Light Types",
  shadows: "Shadows",
  "environment-maps": "Environment Maps",
  // React Three Fiber
  canvas: "Canvas & Setup",
  "canvas-component": "Canvas Component",
  "jsx-to-three": "JSX to Three.js",
  "scene-graph": "Scene Graph",
  meshes: "Meshes & Objects",
  "mesh-component": "Mesh Component",
  "groups-hierarchy": "Groups & Hierarchy",
  "instanced-mesh": "InstancedMesh",
  "r3f-hooks": "R3F Hooks",
  "use-frame": "useFrame",
  "use-three": "useThree",
  "use-loader": "useLoader",
  events: "Events & Interaction",
  "pointer-events": "Pointer Events",
  raycasting: "Raycasting",
  // Drei & Ecosystem
  controls: "Controls",
  "orbit-controls": "OrbitControls",
  "camera-controls": "Camera Controls",
  staging: "Staging & Environment",
  environment: "Environment",
  "stage-component": "Stage Component",
  "sky-stars": "Sky & Stars",
  "text-html": "Text & HTML",
  text3d: "Text3D",
  "html-overlay": "HTML Overlay",
  loaders: "Loaders & Models",
  "gltf-models": "GLTF Models",
  "use-gltf": "useGLTF",
  // Core Basics
  debug: "Debug & Helpers",
  "wireframe-helpers": "Wireframe & Helpers",
  "camera-types": "Camera Types",
  transforms: "Transforms & Color",
  "position-rotation-scale": "Position, Rotation & Scale",
  "colors-spaces": "Colors & Color Spaces",
  "responsive-resize": "Responsive & Resize",
  "fog-atmosphere": "Fog & Atmosphere",
  // Visual Effects
  particles: "Particles & Lines",
  "points-systems": "Points & Particle Systems",
  "lines-curves": "Lines & Curves",
  "sprites-billboards": "Sprites & Billboards",
  "render-targets": "Render Targets",
  // Interactivity
  interaction: "Animation & Physics",
  "animation-libraries": "Animation Libraries",
  "physics-rapier": "Physics (Rapier)",
  "audio-spatial": "Spatial Audio",
  // Shader Recipes
  "shader-recipes": "Shader Recipes",
  "raging-sea": "Raging Sea",
  "hologram-effect": "Hologram Effect",
  "galaxy-generator": "Galaxy Generator",
  "procedural-terrain": "Procedural Terrain",
  // Production
  production: "Production",
  "realistic-render": "Realistic Render",
  "loading-progress": "Loading Progress",
  "code-structuring": "Code Structuring",
  "go-live": "Go Live",
  // Advanced
  shaders: "Shaders",
  "shader-material": "ShaderMaterial",
  "uniforms-varyings": "Uniforms & Varyings",
  "post-processing": "Post-Processing",
  "effect-composer": "EffectComposer",
  "built-in-effects": "Built-in Effects",
  performance: "Performance",
  optimization: "Optimization Tips",
  "drei-performance": "Drei Performance",
};

export function BreadcrumbNav() {
  const pathname = usePathname();

  if (pathname === "/") return null;

  const segments = pathname.split("/").filter(Boolean);

  return (
    <nav className="flex items-center gap-1.5 text-sm text-muted-foreground">
      <Link
        href="/"
        className="hover:text-foreground transition-colors"
      >
        <Home className="size-3.5" />
      </Link>
      {segments.map((segment, i) => {
        const href = "/" + segments.slice(0, i + 1).join("/");
        const isLast = i === segments.length - 1;
        const label = labelMap[segment] || segment.replace(/-/g, " ");

        return (
          <Fragment key={href}>
            <ChevronRight className="size-3 text-muted-foreground/50" />
            {isLast ? (
              <span className="text-foreground font-medium truncate max-w-[200px]">
                {label}
              </span>
            ) : (
              <Link
                href={href}
                className="hover:text-foreground transition-colors truncate max-w-[150px]"
              >
                {label}
              </Link>
            )}
          </Fragment>
        );
      })}
    </nav>
  );
}
