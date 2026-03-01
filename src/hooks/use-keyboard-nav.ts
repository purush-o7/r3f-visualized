"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";

type TopicLink = { href: string };

const categoryTopics: Record<string, TopicLink[]> = {
  "/scene-basics": [
    { href: "/scene-basics/scene-camera-renderer" },
    { href: "/scene-basics/coordinate-system" },
    { href: "/scene-basics/animation-loop" },
  ],
  "/geometries": [
    { href: "/geometries/built-in-geometries" },
    { href: "/geometries/buffer-geometry" },
    { href: "/geometries/custom-geometry" },
  ],
  "/materials": [
    { href: "/materials/basic-materials" },
    { href: "/materials/standard-physical" },
    { href: "/materials/textures" },
  ],
  "/lights": [
    { href: "/lights/light-types" },
    { href: "/lights/shadows" },
    { href: "/lights/environment-maps" },
  ],
  "/canvas": [
    { href: "/canvas/canvas-component" },
    { href: "/canvas/jsx-to-three" },
    { href: "/canvas/scene-graph" },
  ],
  "/meshes": [
    { href: "/meshes/mesh-component" },
    { href: "/meshes/groups-hierarchy" },
    { href: "/meshes/instanced-mesh" },
  ],
  "/r3f-hooks": [
    { href: "/r3f-hooks/use-frame" },
    { href: "/r3f-hooks/use-three" },
    { href: "/r3f-hooks/use-loader" },
  ],
  "/events": [
    { href: "/events/pointer-events" },
    { href: "/events/raycasting" },
  ],
  "/controls": [
    { href: "/controls/orbit-controls" },
    { href: "/controls/camera-controls" },
  ],
  "/staging": [
    { href: "/staging/environment" },
    { href: "/staging/stage-component" },
    { href: "/staging/sky-stars" },
  ],
  "/text-html": [
    { href: "/text-html/text3d" },
    { href: "/text-html/html-overlay" },
  ],
  "/loaders": [
    { href: "/loaders/gltf-models" },
    { href: "/loaders/use-gltf" },
  ],
  "/shaders": [
    { href: "/shaders/shader-material" },
    { href: "/shaders/uniforms-varyings" },
  ],
  "/post-processing": [
    { href: "/post-processing/effect-composer" },
    { href: "/post-processing/built-in-effects" },
  ],
  "/performance": [
    { href: "/performance/optimization" },
    { href: "/performance/drei-performance" },
  ],
};

export function useKeyboardNav() {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      ) {
        return;
      }

      const segments = pathname.split("/").filter(Boolean);
      if (segments.length < 2) return;

      const categoryPath = "/" + segments[0];
      const topics = categoryTopics[categoryPath];
      if (!topics) return;

      const currentIndex = topics.findIndex((t) => t.href === pathname);
      if (currentIndex === -1) return;

      if ((e.key === "j" || e.key === "ArrowRight") && !e.metaKey && !e.ctrlKey) {
        if (currentIndex < topics.length - 1) {
          e.preventDefault();
          router.push(topics[currentIndex + 1].href);
        }
      } else if ((e.key === "k" || e.key === "ArrowLeft") && !e.metaKey && !e.ctrlKey) {
        if (currentIndex > 0) {
          e.preventDefault();
          router.push(topics[currentIndex - 1].href);
        }
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [pathname, router]);
}
