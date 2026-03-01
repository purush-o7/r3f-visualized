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

const PerfDemo = dynamic(
  () =>
    import("./_components/perf-demo").then((m) => ({
      default: m.PerfDemo,
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
    title: "Using React state for per-frame animation values",
    subtitle: "setState triggers 60 re-renders per second",
    wrongCode: `function Spinner() {
  const [rot, setRot] = useState(0)
  useFrame((_, delta) => {
    setRot((r) => r + delta) // Re-render every frame!
  })
  return <mesh rotation-y={rot} />
}`,
    rightCode: `function Spinner() {
  const ref = useRef<THREE.Mesh>(null)
  useFrame((_, delta) => {
    ref.current!.rotation.y += delta // No re-render
  })
  return <mesh ref={ref} />
}`,
    filename: "AnimationState.tsx",
    explanation:
      "Calling setState inside useFrame triggers a full React re-render 60 times per second. React must reconcile the entire component tree on every frame. Use refs to directly mutate Three.js properties without involving React. Reserve setState for discrete events like clicks or toggles.",
  },
  {
    title: "Mounting/unmounting expensive components",
    subtitle: "Conditional rendering destroys and recreates GPU resources",
    wrongCode: `// Mounts/unmounts the forest, recreating geometry
{showForest && <Forest />}`,
    rightCode: `// Toggle visibility — geometry stays in memory
<group visible={showForest}>
  <Forest />
</group>`,
    filename: "ToggleVisibility.tsx",
    explanation:
      "Conditionally rendering a complex component destroys all Three.js objects (geometry, materials, textures) and recreates them on mount. This causes a visible frame hitch. Setting visible=false skips rendering without destroying anything, making the toggle nearly free. The tradeoff is that hidden objects still use GPU memory.",
  },
  {
    title: "Using transparency when alphaTest would work",
    subtitle: "Transparent objects require expensive sorting",
    wrongCode: `// Transparent: requires sorting, double rendering
<meshStandardMaterial
  map={foliageTexture}
  transparent={true}
/>`,
    rightCode: `// alphaTest: discards pixels below threshold, no sorting
<meshStandardMaterial
  map={foliageTexture}
  alphaTest={0.5}
/>`,
    filename: "AlphaTest.tsx",
    explanation:
      "Transparent materials force the GPU to sort objects back-to-front and can cause visual artifacts with overlapping surfaces. For textures with fully opaque and fully transparent areas (foliage, fences, particles), use alphaTest instead. It discards pixels below the threshold, treating the rest as fully opaque. No sorting needed.",
  },
];

export default function OptimizationPage() {
  return (
    <div className="max-w-4xl ambient-canvas">
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-3">
          <Badge variant="outline">Performance</Badge>
        </div>
        <h1 className="text-3xl font-bold tracking-tight mb-3">
          Optimization Techniques
        </h1>
        <p className="text-lg text-muted-foreground">
          Your scene runs perfectly on your beefy desktop. Then you open it on
          a phone and it crawls at 12 frames per second. WebGL performance
          comes down to three things: fewer draw calls, less wasted work, and
          never fighting React&apos;s render cycle.
        </p>
      </div>

      {/* What Could Go Wrong */}
      <WhatCouldGoWrong
        scenario="You build a forest scene with 500 individual tree meshes. Each tree is a separate React component with its own geometry and material. On your desktop it runs fine, but the performance monitor shows 500 draw calls and the scene stutters on any device below a gaming laptop."
        error="Performance: 500 draw calls | Frame time: 42ms (24 FPS) | GPU: 95% utilization on mobile"
        errorType="Perf Warning"
        accentColor="red"
      />

      <Separator className="my-8" />

      {/* Story Analogy */}
      <ConversationalCallout type="story">
        <p>
          Think of GPU optimization like packing a suitcase for a trip.
        </p>
        <p>
          You have a <strong>limited amount of space</strong> (your GPU
          budget). Every item you throw in is a <strong>draw call</strong> --
          a round trip between the CPU and GPU. The key is to pack smart:
        </p>
        <p>
          <strong>Share clothes</strong> (reuse materials across objects).{" "}
          <strong>Fold compact</strong> (use instancing to pack 500 trees into
          one suitcase slot).{" "}
          <strong>Remove what you do not need</strong> (frustum culling hides
          objects outside the camera view). And{" "}
          <strong>do not repack every second</strong> (avoid React re-renders
          on every frame).
        </p>
      </ConversationalCallout>

      <Separator className="my-8" />

      {/* Mental Model Flow */}
      <SimpleFlow
        steps={[
          { label: "500 Trees", detail: "500 draw calls", status: "error" },
          { label: "Instancing", detail: "Batch into one" },
          { label: "1 Draw Call", detail: "Same visual result", status: "success" },
        ]}
        accentColor="blue"
      />

      <Separator className="my-8" />

      {/* Interactive Demo */}
      <PerfDemo />

      <Separator className="my-8" />

      {/* Guided Walkthrough */}
      <ScrollReveal>
        <section className="space-y-4">
          <h2 className="text-2xl font-bold">
            The Three Pillars of R3F Performance
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            Every optimization falls into one of three categories. Master
            these and you can get any scene running smoothly.
          </p>

          <div className="rounded-lg border bg-card p-4 space-y-3">
            <p className="text-sm font-medium">
              Pillar 1: Reduce draw calls
            </p>
            <CodeBlock
              code={`// Instancing: 500 meshes become 1 draw call
<instancedMesh args={[undefined, undefined, 500]}>
  <boxGeometry args={[0.12, 0.12, 0.12]} />
  <meshStandardMaterial color="green" />
</instancedMesh>`}
              filename="InstancedRendering.tsx"
            />
            <p className="text-sm text-muted-foreground">
              Every separate mesh costs at least one draw call -- a CPU-GPU
              round trip. Instancing tells the GPU to draw the same geometry
              many times with different transforms in a single call. If you
              have 10+ copies of the same shape, always instance them.
            </p>
          </div>

          <div className="rounded-lg border bg-card p-4 space-y-3">
            <p className="text-sm font-medium">
              Pillar 2: Stop fighting React
            </p>
            <CodeBlock
              code={`// Direct mutation = zero re-renders
const ref = useRef<THREE.Mesh>(null)
useFrame((_, delta) => {
  ref.current!.rotation.y += delta
})`}
              filename="PreventRerenders.tsx"
            />
            <p className="text-sm text-muted-foreground">
              The biggest mistake in R3F is storing animation values in React
              state. Every setState inside useFrame triggers a full component
              re-render 60 times per second. Use refs to mutate Three.js
              objects directly. React never knows the value changed, and
              that is exactly what you want.
            </p>
          </div>

          <div className="rounded-lg border bg-card p-4 space-y-3">
            <p className="text-sm font-medium">
              Pillar 3: Measure before optimizing
            </p>
            <CodeBlock
              code={`import { Perf } from 'r3f-perf'

// Only in development — shows FPS, draw calls, triangles
{process.env.NODE_ENV === 'development' && (
  <Perf position="top-left" />
)}`}
              filename="Profiling.tsx"
            />
            <p className="text-sm text-muted-foreground">
              Never optimize blindly. Drop r3f-perf into your scene and it
              shows real-time FPS, draw calls, triangle count, and GPU memory.
              Aim for under 100 draw calls, under 16.6ms frame time (60 FPS),
              and cap pixel ratio with dpr=&#123;[1, 2]&#125;.
            </p>
          </div>
        </section>
      </ScrollReveal>

      <Separator className="my-8" />

      {/* What You Just Learned */}
      <WhatYouJustLearned
        points={[
          "Each separate mesh costs at least one draw call. Instancing can reduce 500 draw calls to 1.",
          "Never store per-frame animation values in React state. Use refs for direct Three.js mutation.",
          "Use visible={false} instead of conditional rendering to toggle expensive components without destroying GPU resources.",
          "alphaTest is much cheaper than transparent for cutout-style textures (foliage, fences).",
          "Always measure with r3f-perf before optimizing. Target: <100 draw calls, <16.6ms frame time.",
        ]}
      />

      <Separator className="my-8" />

      {/* Question */}
      <ConversationalCallout type="question">
        <p>
          You have a scene with 200 identical cubes. A teammate suggests
          merging them all into one BufferGeometry. Another suggests using
          instancedMesh. When would you pick one over the other?
        </p>
      </ConversationalCallout>

      <Separator className="my-8" />

      {/* Aha Moment */}
      <AhaMoment
        setup="Most beginners think the GPU is the bottleneck in slow scenes. But in R3F, the biggest performance killer is often not the GPU at all..."
        reveal="It is React. Every time you call setState, React re-renders the component tree, diffs the virtual DOM, and reconciles changes. In a normal UI, this happens on user interactions -- maybe 10 times a second. But if you put setState inside useFrame, it happens 60 times a second. That is 60 full React reconciliation cycles per second, and React was never designed for that. The fix is simple: use refs for anything that changes every frame, and reserve setState for things that change on user actions."
      />

      <Separator className="my-8" />

      {/* Mental Model Challenge */}
      <MentalModelChallenge
        question="You have a scene with 100 identical spheres, and your r3f-perf shows 100 draw calls. You switch to instancedMesh and the draw calls drop to 1. But then you need 50 of those spheres to use a different material. How many draw calls will you have now?"
        options={[
          {
            label: "1 draw call (instancing handles everything)",
            correct: false,
            explanation:
              "An instancedMesh can only use one material. Different materials require separate draw calls.",
          },
          {
            label: "2 draw calls (one per material)",
            correct: true,
            explanation:
              "Each unique material needs its own instancedMesh, so you get 2 draw calls: one for the first group of 50 and one for the second.",
          },
          {
            label: "51 draw calls (50 regular + 1 instanced)",
            correct: false,
            explanation:
              "You can instance both groups. 50 spheres with material A = 1 instancedMesh. 50 with material B = another instancedMesh.",
          },
          {
            label: "100 draw calls (back to square one)",
            correct: false,
            explanation:
              "Instancing still works within each material group. You only lose the benefit if every sphere has a unique material.",
          },
        ]}
        hint="Each instancedMesh can only have one geometry and one material. How many unique materials do you have?"
        answer="An instancedMesh draws all its instances with a single geometry and material. When you need two different materials, you need two instancedMesh components -- resulting in 2 draw calls. That is still a 98% reduction from 100 draw calls. The rule: one instancedMesh per unique geometry+material combo."
      />

      <Separator className="my-8" />

      {/* Try This */}
      <Separator className="my-8" />
      <ScrollReveal>
        <TryThisList challenges={[
          { challenge: "Set count to 500 — feel the lag!", hint: "Increase the mesh count to 500 individual meshes (not instanced).", solution: "500 individual draw calls start to stress the CPU-GPU bus. Watch the frame rate drop in the performance monitor.", difficulty: "beginner" },
          { challenge: "Set spacing to 1 — dense cluster", hint: "Reduce the spacing between objects to 1.", solution: "Objects pack tightly together, making it easier to see how instancing handles dense clusters efficiently.", difficulty: "beginner" },
          { challenge: "Toggle to instanced only — smooth!", hint: "Switch to the instanced rendering mode.", solution: "All objects render in a single draw call. Frame rate jumps back to 60fps even with high counts.", difficulty: "beginner" },
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
                <h3 className="font-semibold text-sm">Limit Pixel Ratio</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Set dpr=&#123;[1, 2]&#125; on Canvas to cap the pixel ratio
                at 2. High-DPI screens (3x, 4x) render 9 to 16 times more
                pixels for minimal visual improvement. This is often the
                single biggest performance win on mobile.
              </p>
            </div>
            <div className="rounded-lg border bg-card p-4 space-y-2">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="size-4 text-green-500" />
                <h3 className="font-semibold text-sm">
                  Demand Rendering for Static Scenes
                </h3>
              </div>
              <p className="text-sm text-muted-foreground">
                For scenes that rarely change, use frameloop=&quot;demand&quot;
                on Canvas. This renders only when something changes, saving
                GPU and battery. OrbitControls auto-invalidates on camera
                movement.
              </p>
            </div>
            <div className="rounded-lg border bg-card p-4 space-y-2">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="size-4 text-green-500" />
                <h3 className="font-semibold text-sm">
                  Bake Static Lighting
                </h3>
              </div>
              <p className="text-sm text-muted-foreground">
                For scenes with fixed lighting, bake light and shadow into
                textures in Blender. This eliminates real-time shadow
                calculations, which are one of the most expensive parts of
                rendering.
              </p>
            </div>
            <div className="rounded-lg border bg-card p-4 space-y-2">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="size-4 text-green-500" />
                <h3 className="font-semibold text-sm">
                  Toggle Visibility, Not Mounting
                </h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Use visible=false instead of conditional rendering for
                expensive components. Mounting and unmounting recreates all
                GPU resources. Visibility toggling is nearly free and avoids
                frame hitches.
              </p>
            </div>
          </div>
        </section>
      </ScrollReveal>
    </div>
  );
}
