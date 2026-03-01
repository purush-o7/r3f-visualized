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

const ParticlesDemo = dynamic(
  () =>
    import("./_components/particles-demo").then((m) => ({
      default: m.ParticlesDemo,
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
    title: "Creating new geometry every frame",
    subtitle: "Allocating thousands of objects 60 times per second",
    wrongCode: `useFrame(() => {
  // WRONG: Creates new arrays every frame!
  const newPositions = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    newPositions[i * 3] = Math.random() * 10;
    // ...
  }
  // This leaks memory and kills the GPU
});`,
    rightCode: `// Create once, update in place
const positions = useMemo(() => {
  return new Float32Array(count * 3);
}, [count]);

useFrame(() => {
  const attr = pointsRef.current.geometry
    .attributes.position;
  const arr = attr.array as Float32Array;
  // Modify arr values directly
  arr[i * 3 + 1] += 0.01; // move Y
  attr.needsUpdate = true;
});`,
    filename: "Particles.tsx",
    explanation:
      "Allocating new Float32Arrays every frame causes massive garbage collection pauses and GPU re-uploads. Pre-allocate the buffer once and mutate the existing array in place, then flag needsUpdate.",
  },
  {
    title: "Particles disappear behind other objects",
    subtitle: "depthWrite is still true on the particle material",
    wrongCode: `<pointsMaterial
  size={0.1}
  color="white"
  transparent
  opacity={0.8}
  // depthWrite defaults to true!
/>
// Particles occlude each other in wrong order`,
    rightCode: `<pointsMaterial
  size={0.1}
  color="white"
  transparent
  opacity={0.8}
  depthWrite={false}
  blending={THREE.AdditiveBlending}
/>
// Particles blend correctly now`,
    filename: "Particles.tsx",
    explanation:
      "When depthWrite is true, particles write to the depth buffer, preventing particles behind them from rendering. Set depthWrite={false} so all particles are visible. Additive blending makes overlapping particles glow brighter instead of occluding.",
  },
  {
    title: "Forgetting sizeAttenuation",
    subtitle: "Particles are the same size regardless of distance",
    wrongCode: `<pointsMaterial
  size={5}
  sizeAttenuation={false}
  // Size is in pixels — no depth!
/>`,
    rightCode: `<pointsMaterial
  size={0.1}
  sizeAttenuation={true}
  // Size is in world units, shrinks with distance
/>`,
    filename: "Particles.tsx",
    explanation:
      "With sizeAttenuation={false}, size is in screen pixels and particles look flat. With sizeAttenuation={true} (the default), size is in world units and particles shrink with distance like real objects. Much more convincing.",
  },
];

export default function PointsSystemsPage() {
  return (
    <div className="relative max-w-4xl">
      <div className="absolute -top-10 -left-10 w-72 h-72 bg-gradient-to-br from-teal-500/10 via-emerald-500/10 to-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
      {/* 1. Title + Badge + Intro */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-3">
          <Badge variant="outline">Particles & Lines</Badge>
        </div>
        <h1 className="text-3xl font-bold tracking-tight mb-3">
          Points & Particle Systems
        </h1>
        <p className="text-lg text-muted-foreground">
          A mesh renders triangles. Points render dots. Thousands of tiny dots
          dancing in 3D space become snow, rain, fire, stars, or confetti.
          Each particle is just a position, a size, and a color, but together
          they create effects that feel alive.
        </p>
      </div>

      {/* 2. What Could Go Wrong */}
      <WhatCouldGoWrong
        scenario="You create a particle system with 5,000 particles. It works great for 10 seconds, then the framerate drops to single digits. Your devtools show memory climbing every frame. The problem? You are creating new Float32Arrays inside useFrame instead of reusing a single buffer."
        error="Performance degrades over time. Memory usage grows without limit. Browser eventually freezes."
        errorType="Memory Leak"
      />

      <Separator className="my-8" />

      {/* 3. Story Analogy */}
      <ScrollReveal>
        <ConversationalCallout type="story">
          <p>
            Imagine a jar of <strong>fireflies</strong> on a warm summer night.
            You unscrew the lid and hundreds of tiny glowing dots float out
            into the darkness.
          </p>
          <p>
            Each firefly is just a <strong>point</strong> in space with a
            position (where it is), a size (how big it glows), and a color
            (warm yellow). They do not have complicated shapes or surfaces.
            They are just dots.
          </p>
          <p>
            But together, hundreds of these simple dots create something
            magical. That is exactly what a particle system does. Instead of
            rendering complex meshes, you render thousands of <strong>
              lightweight points
            </strong> and animate their positions every frame.
          </p>
        </ConversationalCallout>
      </ScrollReveal>

      <Separator className="my-8" />

      {/* 4. SimpleFlow */}
      <ScrollReveal>
        <section className="space-y-4">
          <h2 className="text-2xl font-bold">How a Particle System Works</h2>
          <p className="text-muted-foreground leading-relaxed">
            From a flat array of numbers to a cloud of glowing dots on screen.
          </p>
          <SimpleFlow
            steps={[
              {
                label: "Positions",
                detail: "Float32Array with x,y,z per particle",
              },
              {
                label: "BufferGeometry",
                detail: "Attach positions as attribute",
              },
              {
                label: "PointsMaterial",
                detail: "Size, color, blending, attenuation",
                status: "success",
              },
              {
                label: "useFrame",
                detail: "Animate positions + needsUpdate",
                status: "success",
              },
            ]}
            accentColor="cyan"
          />
        </section>
      </ScrollReveal>

      <Separator className="my-8" />

      {/* 5. Interactive Demo */}
      <ParticlesDemo />

      <Separator className="my-8" />

      {/* 6. Guided Walkthrough */}
      <ScrollReveal>
        <section className="space-y-6">
          <h2 className="text-2xl font-bold">
            Building a Particle System Step by Step
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            Let us create a floating particle cloud from scratch.
          </p>

          <div className="bg-card border rounded-lg p-4 space-y-3">
            <h3 className="font-semibold text-sm">
              Step 1 -- Generate random positions
            </h3>
            <CodeBlock
              code={`const count = 2000;
const positions = useMemo(() => {
  const arr = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    arr[i * 3]     = (Math.random() - 0.5) * 10; // x
    arr[i * 3 + 1] = (Math.random() - 0.5) * 10; // y
    arr[i * 3 + 2] = (Math.random() - 0.5) * 10; // z
  }
  return arr;
}, []);`}
              filename="Particles.tsx"
            />
            <p className="text-sm text-muted-foreground">
              Each particle needs 3 numbers: x, y, z. For 2,000 particles
              that is 6,000 numbers in a single flat array. We wrap it in
              useMemo so it only runs once.
            </p>
          </div>

          <div className="bg-card border rounded-lg p-4 space-y-3">
            <h3 className="font-semibold text-sm">
              Step 2 -- Attach positions and render as Points
            </h3>
            <CodeBlock
              code={`<points>
  <bufferGeometry>
    <bufferAttribute
      attach="attributes-position"
      array={positions}
      count={count}
      itemSize={3}
    />
  </bufferGeometry>
  <pointsMaterial
    size={0.08}
    color="#88ccff"
    sizeAttenuation
    transparent
    opacity={0.8}
    depthWrite={false}
    blending={THREE.AdditiveBlending}
  />
</points>`}
              filename="Particles.tsx"
            />
            <p className="text-sm text-muted-foreground">
              Instead of a mesh, we use a <code>points</code> element. The GPU
              renders each vertex as a tiny square billboard. AdditiveBlending
              makes overlapping particles glow brighter.
            </p>
          </div>

          <div className="bg-card border rounded-lg p-4 space-y-3">
            <h3 className="font-semibold text-sm">
              Step 3 -- Animate with useFrame
            </h3>
            <CodeBlock
              code={`const pointsRef = useRef<THREE.Points>(null);

useFrame(() => {
  const attr = pointsRef.current!.geometry
    .attributes.position as THREE.BufferAttribute;
  const arr = attr.array as Float32Array;

  for (let i = 0; i < count; i++) {
    arr[i * 3 + 1] += 0.005; // drift upward
    if (arr[i * 3 + 1] > 5) arr[i * 3 + 1] = -5;
  }
  attr.needsUpdate = true;
});`}
              filename="Particles.tsx"
            />
            <p className="text-sm text-muted-foreground">
              We modify the existing array in place — no allocations. Then we
              flag needsUpdate so the GPU re-reads the buffer. This is the
              critical performance pattern for particles.
            </p>
          </div>
        </section>
      </ScrollReveal>

      <Separator className="my-8" />

      {/* 7. What You Just Learned */}
      <ScrollReveal>
        <WhatYouJustLearned
          points={[
            "Points render vertices as tiny camera-facing squares — one draw call for thousands of particles.",
            "Particle positions live in a Float32Array with 3 values (x, y, z) per particle.",
            "useFrame + needsUpdate lets you animate particles by mutating the buffer in place every frame.",
            "depthWrite={false} and AdditiveBlending make particles layer and glow instead of occluding each other.",
          ]}
        />
      </ScrollReveal>

      <Separator className="my-8" />

      {/* 8. Thought-Provoking Question */}
      <ScrollReveal>
        <ConversationalCallout type="question">
          <p>
            A particle system with 10,000 particles renders in a single draw
            call. The same 10,000 objects as individual meshes would be 10,000
            draw calls. What does this tell you about when to use Points
            versus meshes for visual effects?
          </p>
        </ConversationalCallout>
      </ScrollReveal>

      <Separator className="my-8" />

      {/* 9. Aha Moment */}
      <ScrollReveal>
        <AhaMoment
          setup="Why can a particle system handle 50,000 particles at 60fps while 50,000 mesh cubes would destroy performance?"
          reveal="Each mesh is a separate draw call — the CPU has to tell the GPU to render it individually. 50,000 draw calls overwhelm the CPU-GPU communication bus. But a Points object sends ALL 50,000 positions in a single buffer, rendered in a single draw call. The GPU processes them in parallel on thousands of cores. The bottleneck was never the GPU's ability to render — it was the overhead of sending 50,000 separate commands."
        />
      </ScrollReveal>

      <Separator className="my-8" />

      {/* 10. Mental Model Challenge */}
      <ScrollReveal>
        <MentalModelChallenge
          question="You have a snow effect with 3,000 particles. After a few seconds, some particles disappear — they seem to be hidden behind other particles. What is the most likely fix?"
          options={[
            {
              label: "Increase particle count to fill the gaps",
              correct: false,
              explanation:
                "Adding more particles does not fix the occlusion — they will disappear too.",
            },
            {
              label: "Set depthWrite={false} on the PointsMaterial",
              correct: true,
              explanation:
                "When depthWrite is true, particles write to the depth buffer and occlude particles behind them. Setting it to false lets all particles render.",
            },
            {
              label: "Use MeshBasicMaterial instead of PointsMaterial",
              correct: false,
              explanation:
                "Points require PointsMaterial. MeshBasicMaterial is for mesh geometry.",
            },
            {
              label: "Call geometry.computeBoundingSphere()",
              correct: false,
              explanation:
                "The bounding sphere affects frustum culling, not individual particle rendering order.",
            },
          ]}
          answer="Set depthWrite={false} on your PointsMaterial. When depthWrite is true, particles that render first write to the depth buffer, telling the GPU 'nothing behind me should be visible.' This hides particles that are farther from the camera. With depthWrite off, every particle renders regardless of order."
        />
      </ScrollReveal>

      <Separator className="my-8" />

      {/* Try This */}
      <Separator className="my-8" />
      <ScrollReveal>
        <TryThisList challenges={[
          { challenge: "Set count to 5000 — galaxy!", hint: "Increase the particle count to 5000.", solution: "More particles fill the space, creating a denser, galaxy-like cloud. All rendered in a single draw call.", difficulty: "beginner" },
          { challenge: "Set size to 0.5 — big snowflakes", hint: "Increase the particle size to 0.5.", solution: "Large particles look like snowflakes or fireflies. Notice how sizeAttenuation makes them shrink with distance.", difficulty: "beginner" },
          { challenge: "Set speed to 0 — frozen in time", hint: "Set the animation speed to zero.", solution: "The particles freeze in place, creating a static point cloud. The GPU still renders them but no positions update.", difficulty: "beginner" },
        ]} />
      </ScrollReveal>

      <Separator className="my-8" />

      {/* 11. Common Mistakes */}
      <ScrollReveal>
        <CommonMistakes mistakes={mistakes} />
      </ScrollReveal>

      <Separator className="my-8" />

      {/* 12. Best Practices */}
      <ScrollReveal>
        <section className="space-y-4">
          <h2 className="text-2xl font-bold">Best Practices</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-lg border bg-card p-4 space-y-2">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="size-4 text-green-500" />
                <h3 className="font-semibold text-sm">
                  Pre-allocate buffers
                </h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Create your Float32Array once with the maximum particle count.
                Use setDrawRange to control how many are visible. Never
                allocate inside useFrame.
              </p>
            </div>
            <div className="rounded-lg border bg-card p-4 space-y-2">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="size-4 text-green-500" />
                <h3 className="font-semibold text-sm">
                  Use additive blending for glow
                </h3>
              </div>
              <p className="text-sm text-muted-foreground">
                AdditiveBlending makes overlapping particles brighter instead
                of opaque, creating natural glow effects for fire, sparks, and
                magic.
              </p>
            </div>
            <div className="rounded-lg border bg-card p-4 space-y-2">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="size-4 text-green-500" />
                <h3 className="font-semibold text-sm">
                  Move heavy work to the GPU
                </h3>
              </div>
              <p className="text-sm text-muted-foreground">
                For very large systems (100k+ particles), use a custom
                ShaderMaterial to animate positions on the GPU instead of
                looping through arrays in JavaScript.
              </p>
            </div>
            <div className="rounded-lg border bg-card p-4 space-y-2">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="size-4 text-green-500" />
                <h3 className="font-semibold text-sm">
                  Pool and recycle particles
                </h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Instead of creating and destroying particles, reset dead
                particles to new positions. Keep the buffer the same size and
                wrap positions around.
              </p>
            </div>
          </div>
        </section>
      </ScrollReveal>
    </div>
  );
}
