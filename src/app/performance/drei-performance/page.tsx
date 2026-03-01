"use client";

import dynamic from "next/dynamic";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollReveal } from "@/components/scroll-reveal";
import { CodeBlock } from "@/components/code-block";
import { WhatCouldGoWrong } from "@/components/what-could-go-wrong";
import { ConversationalCallout } from "@/components/conversational-callout";
import { SimpleFlow } from "@/components/simple-flow";
import { WhatYouJustLearned } from "@/components/what-you-just-learned";
import { AhaMoment } from "@/components/aha-moment";
import { MentalModelChallenge } from "@/components/mental-model-challenge";
import { CommonMistakes, type Mistake } from "@/components/common-mistakes";
import { TryThisList } from "@/components/try-this-challenge";
import { CheckCircle2 } from "lucide-react";

const DreiPerfDemo = dynamic(
  () =>
    import("./_components/drei-perf-demo").then((m) => ({
      default: m.DreiPerfDemo,
    })),
  {
    ssr: false,
    loading: () => (
      <div className="w-full aspect-[2/1] rounded-xl border bg-scene-bg animate-pulse" />
    ),
  }
);

const mistakes: Mistake[] = [
  {
    title: "Using individual meshes when Instances would work",
    subtitle: "Hundreds of separate meshes create hundreds of draw calls",
    wrongCode: `// 500 meshes = 500 draw calls
{Array.from({ length: 500 }).map((_, i) => (
  <mesh key={i} position={[Math.random() * 20, 0, 0]}>
    <sphereGeometry args={[0.1, 8, 8]} />
    <meshStandardMaterial />
  </mesh>
))}`,
    rightCode: `// 500 instances = 1 draw call
<Instances limit={500} range={500}>
  <sphereGeometry args={[0.1, 8, 8]} />
  <meshStandardMaterial />
  {Array.from({ length: 500 }).map((_, i) => (
    <Instance key={i} position={[Math.random() * 20, 0, 0]} />
  ))}
</Instances>`,
    filename: "InstancesVsMeshes.tsx",
    explanation:
      "Each individual mesh creates a separate draw call -- a CPU-GPU round trip. Drei's Instances component batches all child Instance components into a single InstancedMesh, reducing hundreds of draw calls to one. Use Instances whenever you have many copies of the same geometry.",
  },
  {
    title: "Not using BVH for interactive complex geometry",
    subtitle: "Raycasting without BVH tests every triangle individually",
    wrongCode: `// Raycasting a 100K-triangle model checks ALL triangles
<primitive
  object={scene}
  onClick={(e) => console.log(e.point)}
/>`,
    rightCode: `// BVH makes raycasting nearly instant
<Bvh firstHitOnly>
  <primitive
    object={scene}
    onClick={(e) => console.log(e.point)}
  />
</Bvh>`,
    filename: "BvhRaycast.tsx",
    explanation:
      "Without BVH, every pointer event (hover, click) tests the ray against every triangle in the geometry. For a detailed model, that is 100,000+ tests per frame while the mouse moves. The Bvh component builds a spatial tree that skips entire regions, reducing tests from thousands to about 20-30 bounding box checks.",
  },
  {
    title: "Not preloading assets before components mount",
    subtitle: "Assets download one at a time as components render",
    wrongCode: `// Downloads happen sequentially as each component mounts
<Suspense fallback={<Loader />}>
  <Character />   {/* Downloads character.glb */}
  <Terrain />     {/* Waits, then downloads textures */}
</Suspense>`,
    rightCode: `// Preload at module level — all downloads start in parallel
useGLTF.preload('/models/character.glb')
useTexture.preload('/textures/terrain.jpg')

<Suspense fallback={<Loader />}>
  <Character />   {/* Already cached! */}
  <Terrain />     {/* Already cached! */}
</Suspense>`,
    filename: "PreloadAssets.tsx",
    explanation:
      "Without preloading, each component downloads its resources only when it first mounts. In a Suspense tree, this creates a waterfall: one finishes, the next starts. Calling preload() at the module level starts all downloads in parallel as soon as the JavaScript file loads, long before components render.",
  },
];

export default function DreiPerformancePage() {
  return (
    <div className="max-w-4xl ambient-canvas">
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-3">
          <Badge variant="outline">Performance</Badge>
        </div>
        <h1 className="text-3xl font-bold tracking-tight mb-3">
          Drei Performance Helpers
        </h1>
        <p className="text-lg text-muted-foreground">
          You know the optimization theory -- reduce draw calls, avoid
          re-renders, measure everything. But writing low-level instancing
          code and spatial trees from scratch is tedious. Drei gives you
          ready-made performance tools that solve the most common bottlenecks
          with just a few components.
        </p>
      </div>

      {/* What Could Go Wrong */}
      <WhatCouldGoWrong
        scenario="You load a detailed car model (100K triangles) and add onClick and onPointerOver handlers. Every time you move the mouse, the frame rate drops to 15 FPS. The scene is not even that complex -- what is eating all the performance?"
        error="Performance: Frame time 65ms (15 FPS) | Raycast: testing 102,400 triangles per pointer event"
        errorType="Raycast Bottleneck"
        accentColor="red"
      />

      <Separator className="my-8" />

      {/* Story Analogy */}
      <ConversationalCallout type="story">
        <p>
          Think of drei performance helpers like kitchen prep in a restaurant.
        </p>
        <p>
          A great chef does not start cooking when the customer orders.
          They <strong>prep ingredients ahead of time</strong> (preload
          assets). They <strong>use one big pan for batch frying</strong>
          (Instances). They <strong>only cook what customers ordered</strong>
          (demand rendering). And they <strong>organize the kitchen so any
          ingredient is found instantly</strong> (BVH for fast raycasting).
        </p>
      </ConversationalCallout>

      <Separator className="my-8" />

      {/* Mental Model Flow */}
      <SimpleFlow
        steps={[
          { label: "Preload", detail: "Download assets early" },
          { label: "Instance", detail: "Batch similar meshes" },
          { label: "BVH", detail: "Speed up raycasting" },
          { label: "Adapt", detail: "Lower quality under load", status: "success" },
        ]}
        accentColor="blue"
      />

      <Separator className="my-8" />

      {/* Interactive Demo */}
      <DreiPerfDemo />

      <Separator className="my-8" />

      {/* Guided Walkthrough */}
      <ScrollReveal>
        <section className="space-y-4">
          <h2 className="text-2xl font-bold">
            The Drei Performance Toolkit
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            Drei provides four categories of performance helpers. Each one
            tackles a different bottleneck. Let&apos;s walk through them.
          </p>

          <div className="rounded-lg border bg-card p-4 space-y-3">
            <p className="text-sm font-medium">
              Instances -- one draw call for hundreds of objects
            </p>
            <CodeBlock
              code={`<Instances limit={1000} range={1000}>
  <boxGeometry args={[0.2, 1, 0.2]} />
  <meshStandardMaterial />
  {items.map((_, i) => (
    <Instance key={i} position={pos[i]} color={col[i]} />
  ))}
</Instances>`}
              filename="InstancesComponent.tsx"
            />
            <p className="text-sm text-muted-foreground">
              Each Instance is a regular React component with position,
              rotation, scale, and color props. Behind the scenes, they all
              render in a single draw call. Use this whenever you have 10+
              copies of the same geometry.
            </p>
          </div>

          <div className="rounded-lg border bg-card p-4 space-y-3">
            <p className="text-sm font-medium">
              Bvh -- fast raycasting for complex models
            </p>
            <CodeBlock
              code={`<Bvh firstHitOnly>
  <mesh onClick={(e) => console.log(e.point)}>
    <torusKnotGeometry args={[1, 0.3, 256, 64]} />
    <meshStandardMaterial />
  </mesh>
</Bvh>`}
              filename="BvhAcceleration.tsx"
            />
            <p className="text-sm text-muted-foreground">
              Without BVH, every pointer event tests the ray against every
              triangle. With it, the test drops from O(n) to O(log n). A 100K
              triangle model goes from 100,000 tests to about 20 bounding box
              checks. Use firstHitOnly when you only need the nearest hit.
            </p>
          </div>

          <div className="rounded-lg border bg-card p-4 space-y-3">
            <p className="text-sm font-medium">
              Adaptive Performance -- auto-degrade under load
            </p>
            <CodeBlock
              code={`<Canvas dpr={[1, 2]}>
  <AdaptiveDpr pixelated />
  <AdaptiveEvents />
  <PerformanceMonitor
    onDecline={() => setQuality('low')}
    flipflops={3}
  />
</Canvas>`}
              filename="AdaptivePerformance.tsx"
            />
            <p className="text-sm text-muted-foreground">
              AdaptiveDpr lowers the pixel ratio when the GPU struggles.
              AdaptiveEvents reduces pointer event frequency. And
              PerformanceMonitor lets you trigger custom quality changes
              (lowering shadow resolution, reducing particle count) when
              performance dips.
            </p>
          </div>

          <div className="rounded-lg border bg-card p-4 space-y-3">
            <p className="text-sm font-medium">
              Preloading + Demand Rendering -- load early, render lazy
            </p>
            <CodeBlock
              code={`// Start downloads immediately at module level
useGLTF.preload('/models/character.glb')
useTexture.preload('/textures/ground.jpg')

// Only render when something changes
<Canvas frameloop="demand">
  <OrbitControls />  {/* Auto-invalidates on move */}
</Canvas>`}
              filename="PreloadAndDemand.tsx"
            />
            <p className="text-sm text-muted-foreground">
              Preload starts all downloads in parallel before components
              mount, eliminating the loading waterfall. Demand rendering
              only draws a new frame when the scene actually changes, saving
              GPU and battery on static or rarely-updated scenes.
            </p>
          </div>
        </section>
      </ScrollReveal>

      <Separator className="my-8" />

      {/* What You Just Learned */}
      <WhatYouJustLearned
        points={[
          "Instances batches hundreds of identical meshes into a single draw call with a declarative React API.",
          "Bvh builds a spatial tree that makes raycasting nearly instant on complex geometry (O(log n) instead of O(n)).",
          "AdaptiveDpr and PerformanceMonitor automatically lower quality when the GPU struggles.",
          "Preloading assets at module level parallelizes downloads and eliminates the loading waterfall.",
          "Demand rendering with frameloop='demand' only renders when something changes, saving GPU and battery.",
        ]}
      />

      <Separator className="my-8" />

      {/* Question */}
      <ConversationalCallout type="question">
        <p>
          If BVH makes raycasting so much faster, why is it not enabled by
          default on every mesh in Three.js? What is the tradeoff?
        </p>
      </ConversationalCallout>

      <Separator className="my-8" />

      {/* Aha Moment */}
      <AhaMoment
        setup="You might think preloading assets is just a nice-to-have. But there is a subtle reason it makes a massive difference in Suspense-based apps..."
        reveal="Without preloading, Suspense creates a waterfall. Component A mounts, starts downloading, suspends. When it resolves, Component B mounts, starts downloading, suspends. Each download is sequential. With preloading at the module level, ALL downloads start the moment the JavaScript file is imported -- even before React renders anything. Five models that took 10 seconds sequentially now load in 2 seconds in parallel. The user sees a single loading screen instead of a series of pop-ins."
      />

      <Separator className="my-8" />

      {/* Mental Model Challenge */}
      <MentalModelChallenge
        question="You have a 3D product viewer with a detailed model (50K triangles) and OrbitControls. The user can hover over parts to highlight them. The scene is mostly static -- the camera only moves when the user drags. Which drei helpers would give you the biggest wins?"
        options={[
          {
            label: "Instances + AdaptiveDpr",
            correct: false,
            explanation:
              "Instances batches identical meshes. A single detailed model is not a good candidate for instancing since there is only one of it.",
          },
          {
            label: "Bvh + frameloop='demand'",
            correct: true,
            explanation:
              "BVH speeds up the hover raycasting on the 50K triangle model. Demand rendering means the GPU only works when the camera moves, saving power on this mostly-static scene.",
          },
          {
            label: "PerformanceMonitor + Preloading",
            correct: false,
            explanation:
              "These help, but the main bottlenecks are the expensive raycasting on hover and the continuous rendering of a static scene. BVH and demand rendering address those directly.",
          },
          {
            label: "AdaptiveEvents + AdaptiveDpr",
            correct: false,
            explanation:
              "These are fallback mechanisms for when performance dips. Better to fix the root causes (slow raycasting, unnecessary rendering) than to degrade quality.",
          },
        ]}
        hint="What are the two main performance problems? Hover is slow (raycasting bottleneck), and the scene renders 60 FPS even when nothing moves (wasted GPU work)."
        answer="Bvh solves the hover bottleneck by reducing triangle tests from 50,000 to about 20 bounding box checks. frameloop='demand' stops the continuous render loop -- the scene only re-renders when the user moves the camera or interacts. Together, these two changes can turn a janky viewer into a buttery-smooth one that barely uses any GPU when idle."
      />

      <Separator className="my-8" />

      {/* Try This */}
      <Separator className="my-8" />
      <ScrollReveal>
        <TryThisList challenges={[
          { challenge: "Set count to 1000 — still smooth!", hint: "Increase the instance count to 1000.", solution: "Thanks to drei Instances, 1000 objects still render in a single draw call, maintaining smooth performance.", difficulty: "beginner" },
          { challenge: "Max waveHeight — dramatic waves", hint: "Push the wave height slider to its maximum.", solution: "The instanced objects animate with exaggerated wave motion, showing that animation is cheap when using instances.", difficulty: "beginner" },
          { challenge: "Set cubeSize to 0.05 — pixel art", hint: "Shrink the cube size to 0.05.", solution: "Tiny cubes look like pixel art or voxels, demonstrating how instancing enables thousands of tiny objects.", difficulty: "beginner" },
        ]} />
      </ScrollReveal>

      <Separator className="my-8" />

      {/* Common Mistakes */}
      <ScrollReveal>
        <CommonMistakes mistakes={mistakes} />
      </ScrollReveal>

      <Separator className="my-8" />

      {/* Best Practices */}
      <ScrollReveal>
        <section className="space-y-4">
          <h2 className="text-2xl font-bold">Best Practices</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-lg border bg-card p-4 space-y-2">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="size-4 text-green-500" />
                <h3 className="font-semibold text-sm">
                  Instance Similar Objects
                </h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Whenever you have 10+ copies of the same geometry, use
                Instances. Same declarative React API, but everything renders
                in a single draw call.
              </p>
            </div>
            <div className="rounded-lg border bg-card p-4 space-y-2">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="size-4 text-green-500" />
                <h3 className="font-semibold text-sm">
                  BVH for Any Interactive Model
                </h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Wrap any clickable or hoverable scene with Bvh, especially
                models over 10K triangles. Without it, pointer events on
                complex geometry will tank your frame rate.
              </p>
            </div>
            <div className="rounded-lg border bg-card p-4 space-y-2">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="size-4 text-green-500" />
                <h3 className="font-semibold text-sm">Preload Everything</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Call useGLTF.preload() and useTexture.preload() at module
                level for all assets. This parallelizes downloads and
                eliminates Suspense loading waterfalls.
              </p>
            </div>
            <div className="rounded-lg border bg-card p-4 space-y-2">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="size-4 text-green-500" />
                <h3 className="font-semibold text-sm">
                  Use Detailed for LOD
                </h3>
              </div>
              <p className="text-sm text-muted-foreground">
                For large outdoor scenes, use drei&apos;s Detailed component
                to swap models based on camera distance. Reduces triangle
                count by 80%+ for distant objects.
              </p>
            </div>
          </div>
        </section>
      </ScrollReveal>
    </div>
  );
}
