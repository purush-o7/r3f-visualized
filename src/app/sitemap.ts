import type { MetadataRoute } from "next";

const BASE_URL = "https://r3f-visualized.vercel.app";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const home = [
    { url: BASE_URL, lastModified: now, changeFrequency: "weekly" as const, priority: 1.0 },
  ];

  const categories = [
    "/scene-basics", "/geometries", "/materials", "/lights",
    "/canvas", "/meshes", "/r3f-hooks", "/events",
    "/controls", "/staging", "/text-html", "/loaders",
    "/debug", "/transforms", "/particles", "/interaction",
    "/shader-recipes", "/shaders", "/post-processing", "/performance",
    "/production",
  ].map((path) => ({
    url: `${BASE_URL}${path}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  const topics = [
    // Scene Basics
    "/scene-basics/scene-camera-renderer", "/scene-basics/coordinate-system", "/scene-basics/animation-loop",
    // Geometries
    "/geometries/built-in-geometries", "/geometries/buffer-geometry", "/geometries/custom-geometry",
    // Materials
    "/materials/basic-materials", "/materials/standard-physical", "/materials/textures",
    // Lights
    "/lights/light-types", "/lights/shadows", "/lights/environment-maps",
    // Canvas & Setup
    "/canvas/canvas-component", "/canvas/jsx-to-three", "/canvas/scene-graph",
    // Meshes & Objects
    "/meshes/mesh-component", "/meshes/groups-hierarchy", "/meshes/instanced-mesh",
    // R3F Hooks
    "/r3f-hooks/use-frame", "/r3f-hooks/use-three", "/r3f-hooks/use-loader",
    // Events
    "/events/pointer-events", "/events/raycasting",
    // Controls
    "/controls/orbit-controls", "/controls/camera-controls",
    // Staging
    "/staging/environment", "/staging/stage-component", "/staging/sky-stars",
    // Text & HTML
    "/text-html/text3d", "/text-html/html-overlay",
    // Loaders
    "/loaders/gltf-models", "/loaders/use-gltf",
    // Debug & Helpers
    "/debug/wireframe-helpers", "/debug/camera-types",
    // Transforms & Color
    "/transforms/position-rotation-scale", "/transforms/colors-spaces",
    "/transforms/responsive-resize", "/transforms/fog-atmosphere",
    // Particles & Lines
    "/particles/points-systems", "/particles/lines-curves",
    "/particles/sprites-billboards", "/particles/render-targets",
    // Interaction
    "/interaction/animation-libraries", "/interaction/physics-rapier", "/interaction/audio-spatial",
    // Shader Recipes
    "/shader-recipes/raging-sea", "/shader-recipes/hologram-effect",
    "/shader-recipes/galaxy-generator", "/shader-recipes/procedural-terrain",
    // Shaders
    "/shaders/shader-material", "/shaders/uniforms-varyings",
    // Post-Processing
    "/post-processing/effect-composer", "/post-processing/built-in-effects",
    // Performance
    "/performance/optimization", "/performance/drei-performance",
    // Production
    "/production/realistic-render", "/production/loading-progress",
    "/production/code-structuring", "/production/go-live",
  ].map((path) => ({
    url: `${BASE_URL}${path}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  return [...home, ...categories, ...topics];
}
