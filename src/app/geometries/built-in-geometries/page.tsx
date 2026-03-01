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

const GeometryShowcase = dynamic(
  () =>
    import("./_components/geometry-showcase").then((m) => ({
      default: m.GeometryShowcase,
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
    title: "Way too many segments on simple objects",
    subtitle: "A sphere with 512 segments that nobody will ever notice",
    wrongCode: `// 512x512 = 524,288 triangles for ONE sphere!
<sphereGeometry args={[1, 512, 512]} />

// 20 of these = 10 million triangles
{Array.from({ length: 20 }).map((_, i) => (
  <mesh key={i}><sphereGeometry args={[1, 512, 512]} />`,
    rightCode: `// 32 segments is smooth enough for most cases
<sphereGeometry args={[1, 32, 32]} />
// = 1,920 triangles. Looks identical!

// Background objects need even fewer
<sphereGeometry args={[1, 16, 16]} />

// High detail ONLY for hero objects
<sphereGeometry args={[1, 64, 64]} />`,
    filename: "App.tsx",
    explanation:
      "Each segment adds vertices the GPU must process. A 512-segment sphere has over 500,000 triangles but looks identical to a 64-segment sphere at most viewing distances. Start with 16-32 segments and only increase if you can actually see faceting.",
  },
  {
    title: "Not sharing geometry between meshes",
    subtitle: "100 identical spheres each create their own geometry data",
    wrongCode: `// WRONG: 100 separate geometry instances!
{items.map((item, i) => (
  <mesh key={i} position={item.pos}>
    <sphereGeometry args={[0.3, 16, 16]} />
    <meshStandardMaterial color="coral" />
  </mesh>
))}`,
    rightCode: `// Share one geometry and one material
const geo = useMemo(
  () => new SphereGeometry(0.3, 16, 16), []
);
const mat = useMemo(
  () => new MeshStandardMaterial({ color: "coral" }), []
);

{items.map((item, i) => (
  <mesh key={i} position={item.pos}
    geometry={geo} material={mat} />
))}`,
    filename: "App.tsx",
    explanation:
      "R3F's JSX creates new geometry per element by default. For many identical objects, share a single geometry and material instance. The GPU stores the vertex buffer once and each mesh just references it with its own transform.",
  },
  {
    title: "Not disposing geometry when removing objects",
    subtitle: "GPU memory leaks as objects are created and removed",
    wrongCode: `// Removing mesh from scene does NOT free GPU memory!
scene.remove(oldMesh);
// Memory leak: geometry buffers stay on GPU`,
    rightCode: `// Dispose GPU resources before removing
oldMesh.geometry.dispose();
oldMesh.material.dispose();
scene.remove(oldMesh);

// In R3F, cleanup happens automatically
// when components unmount — one of its big perks!`,
    filename: "App.tsx",
    explanation:
      "In vanilla Three.js, removing a mesh does NOT free its GPU memory. You must call .dispose() explicitly. The good news: R3F handles disposal automatically when components unmount. This is one of the biggest quality-of-life improvements R3F offers.",
  },
];

export default function BuiltInGeometriesPage() {
  return (
    <div className="relative max-w-4xl">
      <div className="absolute -top-10 -left-10 w-72 h-72 bg-gradient-to-br from-teal-500/10 via-emerald-500/10 to-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-3">
          <Badge variant="outline">Geometries</Badge>
        </div>
        <h1 className="text-3xl font-bold tracking-tight mb-3">
          Built-in Geometries
        </h1>
        <p className="text-lg text-muted-foreground">
          Three.js comes with a toybox full of pre-made shapes — cubes, spheres,
          cylinders, toruses, and more. You don&apos;t need to define a single vertex.
          Just pick a shape, set some parameters, and you&apos;re building in 3D.
        </p>
      </div>

      {/* What Could Go Wrong */}
      <WhatCouldGoWrong
        scenario="Your scene has 50 spheres and it should run smoothly. But it's crawling at 15fps on your laptop. You check the geometry — you set each sphere to 512 segments because 'more detail is better', right? That single decision created over 25 million triangles."
        error="Scene renders at 15fps. GPU usage at 100%. Fans spinning loudly."
        errorType="Performance"
        accentColor="red"
      />

      <Separator className="my-8" />

      {/* Story Analogy */}
      <ConversationalCallout type="story">
        <p>Think of built-in geometries like <strong>LEGO bricks</strong>.</p>
        <p>LEGO gives you pre-made pieces — flat plates, cubes, cylinders, arches. You don&apos;t need to sculpt each piece from scratch. You just grab the right brick and snap it in place.</p>
        <p>Three.js works the same way. Need a cube? <strong>boxGeometry</strong>. A ball? <strong>sphereGeometry</strong>. A donut? <strong>torusGeometry</strong>.</p>
        <p>Each &quot;brick&quot; comes with knobs you can adjust — width, height, how smooth the curves are. And just like LEGO, you can combine simple shapes to build surprisingly complex things.</p>
      </ConversationalCallout>

      <Separator className="my-8" />

      {/* Mental Model Flow */}
      <SimpleFlow
        steps={[
          { label: "Geometry", detail: "The shape (cube, sphere, etc.)" },
          { label: "Material", detail: "The appearance (color, texture)" },
          { label: "Mesh", detail: "Shape + Appearance = Visible object", status: "success" },
        ]}
        accentColor="blue"
      />

      <Separator className="my-8" />

      {/* Interactive Demo */}
      <GeometryShowcase />

      <Separator className="my-8" />

      {/* Guided Walkthrough */}
      <ScrollReveal>
        <section className="space-y-4">
          <h2 className="text-2xl font-bold">Hands-On: Building with Shapes</h2>
          <p className="text-muted-foreground leading-relaxed">
            Let&apos;s grab some LEGO bricks from the Three.js toybox and build
            something. Every shape just needs a geometry and a material.
          </p>

          <div className="rounded-lg border bg-card p-4 space-y-3">
            <p className="text-sm font-medium">Step 1: The basic shapes</p>
            <CodeBlock
              code={`{/* A 1x1x1 cube */}\n<mesh>\n  <boxGeometry args={[1, 1, 1]} />\n  <meshStandardMaterial color="orange" />\n</mesh>\n\n{/* A sphere with radius 0.5 */}\n<mesh position={[2, 0, 0]}>\n  <sphereGeometry args={[0.5, 32, 32]} />\n  <meshStandardMaterial color="royalblue" />\n</mesh>`}
              filename="App.tsx"
            />
            <p className="text-sm text-muted-foreground">
              The args prop passes parameters to the geometry constructor. For a box,
              it&apos;s [width, height, depth]. For a sphere, it&apos;s [radius, widthSegments,
              heightSegments]. The segments control how smooth the curve looks.
            </p>
          </div>

          <div className="rounded-lg border bg-card p-4 space-y-3">
            <p className="text-sm font-medium">Step 2: More shapes from the toybox</p>
            <CodeBlock
              code={`{/* A cylinder */}\n<mesh position={[-2, 0, 0]}>\n  <cylinderGeometry args={[0.5, 0.5, 2, 32]} />\n  <meshStandardMaterial color="mediumseagreen" />\n</mesh>\n\n{/* A donut (torus) */}\n<mesh position={[0, 2, 0]}>\n  <torusGeometry args={[1, 0.4, 16, 48]} />\n  <meshStandardMaterial color="gold" />\n</mesh>`}
              filename="App.tsx"
            />
            <p className="text-sm text-muted-foreground">
              A cylinder takes [topRadius, bottomRadius, height, segments]. Make the
              top radius 0 and you get a cone! The torus (donut) takes [radius, tubeRadius,
              radialSegments, tubularSegments]. Play with the numbers to see how they change.
            </p>
          </div>

          <div className="rounded-lg border bg-card p-4 space-y-3">
            <p className="text-sm font-medium">Step 3: Control the smoothness</p>
            <CodeBlock
              code={`{/* Low-poly look: 8 segments */}\n<sphereGeometry args={[1, 8, 8]} />\n\n{/* Smooth enough: 32 segments */}\n<sphereGeometry args={[1, 32, 32]} />\n\n{/* Ultra-smooth hero: 64 segments */}\n<sphereGeometry args={[1, 64, 64]} />`}
              filename="App.tsx"
            />
            <p className="text-sm text-muted-foreground">
              Segments are like how many flat panels make up a curved surface. More segments
              = smoother curves, but also more work for the GPU. 32 segments is the sweet spot
              for most cases. You usually can&apos;t tell the difference between 64 and 128.
            </p>
          </div>
        </section>
      </ScrollReveal>

      <Separator className="my-8" />

      {/* What You Just Learned */}
      <WhatYouJustLearned
        points={[
          "Three.js provides pre-made shapes (box, sphere, cylinder, torus, cone, plane, and more) that you can use immediately.",
          "A mesh = geometry (shape) + material (appearance). You need both to see something on screen.",
          "The 'args' prop passes parameters to the geometry constructor — dimensions, radius, segments, etc.",
          "Segments control smoothness of curved shapes. Start with 32 and only increase if you see visible flat edges.",
        ]}
      />

      <Separator className="my-8" />

      {/* Thought-Provoking Question */}
      <ConversationalCallout type="question">
        <p>
          If a sphere with 32 segments looks smooth from 5 meters away, do you need
          more segments for a sphere that&apos;s 50 meters away? What about one that fills
          the entire screen?
        </p>
      </ConversationalCallout>

      <Separator className="my-8" />

      {/* Aha Moment */}
      <AhaMoment
        setup="You might think adding more segments is always 'safer' — better to have too many than too few, right?"
        reveal="Here's the cost: doubling the segments of a sphere roughly quadruples the triangle count. A 32-segment sphere has ~2,000 triangles. A 64-segment sphere has ~8,000. A 128-segment sphere has ~32,000. If you have 100 spheres in your scene, that's the difference between 200,000 and 3,200,000 triangles. The human eye can't tell the difference, but your GPU certainly can."
      />

      <Separator className="my-8" />

      {/* Mental Model Challenge */}
      <MentalModelChallenge
        question="You want to create a cone shape. Which geometry would you use?"
        options={[
          { label: "coneGeometry", correct: true, explanation: "Yes! Three.js has a dedicated ConeGeometry. You could also use CylinderGeometry with a top radius of 0." },
          { label: "cylinderGeometry with zero height", correct: false, explanation: "Zero height would make a flat disc, not a cone. But you're close — a cylinder with top radius of 0 would work!" },
          { label: "sphereGeometry stretched on Y", correct: false, explanation: "Stretching a sphere would give you an egg shape, not a cone. The tip wouldn't be pointy." },
          { label: "torusGeometry with small tube", correct: false, explanation: "A torus is a donut shape. No amount of parameter tweaking makes it a cone." },
        ]}
        hint="Three.js has a dedicated geometry for this, but there's also a clever trick with another shape..."
        answer="ConeGeometry is the direct answer, but here's a fun fact: ConeGeometry is actually just CylinderGeometry with the top radius set to 0. Many built-in geometries are variations of each other under the hood."
      />

      <Separator className="my-8" />

      {/* Try This Challenges */}
      <ScrollReveal>
        <TryThisList challenges={[
          {
            challenge: "Switch to TorusKnot — how many segments feel smooth?",
            hint: "TorusKnotGeometry takes args like [radius, tube, tubularSegments, radialSegments]. Try different segment values.",
            solution: "Around 64 tubular segments and 16 radial segments looks smooth. Below 32 tubular segments you start seeing visible flat edges on the curves.",
            difficulty: "beginner",
          },
          {
            challenge: "Set wireframe to true — count the triangles",
            hint: "Add wireframe={true} to your material props to see the underlying triangle mesh.",
            solution: "Wireframe reveals the triangle grid that makes up every shape. A box has 12 triangles (2 per face). A sphere with 32 segments has around 1,920 triangles. This is what the GPU actually renders.",
            difficulty: "beginner",
          },
          {
            challenge: "Scale to 2x — does the segment count change?",
            hint: "Think about what scale does versus what segments do. One is a transform, the other is geometry detail.",
            solution: "No! Scaling only changes the size of the mesh transform — the underlying geometry still has the same number of vertices and triangles. To add more detail, you need more segments, not more scale.",
            difficulty: "intermediate",
          },
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
                <h3 className="font-semibold text-sm">Start with Low Segments</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Begin with 16-32 segments for curved shapes. Only increase if you can actually see
                flat edges at your target camera distance. Distant objects need even fewer.
              </p>
            </div>
            <div className="rounded-lg border bg-card p-4 space-y-2">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="size-4 text-green-500" />
                <h3 className="font-semibold text-sm">Reuse Geometry Instances</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                For many identical objects, share a single geometry instance with useMemo.
                The GPU stores the vertex buffer once — each mesh just adds its own position.
              </p>
            </div>
            <div className="rounded-lg border bg-card p-4 space-y-2">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="size-4 text-green-500" />
                <h3 className="font-semibold text-sm">Let R3F Handle Disposal</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                When you remove a component from the tree, R3F automatically disposes its geometry
                and material. No manual cleanup needed — one of the biggest wins of using R3F.
              </p>
            </div>
            <div className="rounded-lg border bg-card p-4 space-y-2">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="size-4 text-green-500" />
                <h3 className="font-semibold text-sm">Use PlaneGeometry for Floors</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                PlaneGeometry faces the camera by default. Rotate it -90 degrees on X to make
                a horizontal floor. Add segments only if you plan to deform it (waves, terrain).
              </p>
            </div>
          </div>
        </section>
      </ScrollReveal>
    </div>
  );
}
