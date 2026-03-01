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

const Demo = dynamic(
  () =>
    import("./_components/instanced-demo").then((m) => ({
      default: m.InstancedDemo,
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
    title: "Forgetting instanceMatrix.needsUpdate",
    subtitle: "Instances don't appear or stay stuck at the origin",
    wrongCode: `for (let i = 0; i < COUNT; i++) {
  dummy.position.set(Math.random() * 10, 0, 0)
  dummy.updateMatrix()
  meshRef.current.setMatrixAt(i, dummy.matrix)
}
// Oops! GPU never gets the memo.`,
    rightCode: `for (let i = 0; i < COUNT; i++) {
  dummy.position.set(Math.random() * 10, 0, 0)
  dummy.updateMatrix()
  meshRef.current.setMatrixAt(i, dummy.matrix)
}
meshRef.current.instanceMatrix.needsUpdate = true`,
    filename: "Instances.tsx",
    explanation:
      "setMatrixAt writes to a CPU-side buffer. The GPU still has old data until you flip needsUpdate to true. Think of it like editing a spreadsheet offline -- you have to hit 'sync' before the cloud copy updates.",
  },
  {
    title: "Forgetting dummy.updateMatrix()",
    subtitle: "All instances pile up at the origin",
    wrongCode: `dummy.position.set(i * 2, 0, 0)
dummy.rotation.set(0, i * 0.1, 0)
// dummy.matrix is still the identity!
meshRef.current.setMatrixAt(i, dummy.matrix)`,
    rightCode: `dummy.position.set(i * 2, 0, 0)
dummy.rotation.set(0, i * 0.1, 0)
dummy.updateMatrix() // bake pos/rot/scale into the matrix
meshRef.current.setMatrixAt(i, dummy.matrix)`,
    filename: "Instances.tsx",
    explanation:
      "Position, rotation, and scale are separate properties. The matrix is only recalculated when you call updateMatrix(). Skip it and you hand over a stale identity matrix every time.",
  },
  {
    title: "Using 1,000 individual meshes instead of instancing",
    subtitle: "Frame rate tanks because the CPU issues 1,000 draw calls",
    wrongCode: `// 1000 meshes = 1000 draw calls = slideshow
{Array.from({ length: 1000 }, (_, i) => (
  <mesh key={i} position={[i, 0, 0]}>
    <boxGeometry />
    <meshStandardMaterial />
  </mesh>
))}`,
    rightCode: `// 1 InstancedMesh = 1 draw call = buttery smooth
<instancedMesh ref={meshRef} args={[undefined, undefined, 1000]}>
  <boxGeometry />
  <meshStandardMaterial />
</instancedMesh>`,
    filename: "Forest.tsx",
    explanation:
      "Each separate mesh is a separate conversation between CPU and GPU. InstancedMesh bundles the entire conversation into one message. The GPU handles thousands of copies just as easily as one.",
  },
];

export default function InstancedMeshPage() {
  return (
    <div className="relative max-w-4xl">
      <div className="absolute -top-10 -left-10 w-72 h-72 bg-gradient-to-br from-teal-500/10 via-emerald-500/10 to-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
      {/* ── 1. Title + Badge + Intro ── */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-3">
          <Badge variant="outline">Meshes & Objects</Badge>
        </div>
        <h1 className="text-3xl font-bold tracking-tight mb-3">
          Instanced Mesh
        </h1>
        <p className="text-lg text-muted-foreground">
          Need to render a forest of 10,000 trees? A galaxy of stars? A swarm
          of particles? Placing 10,000 individual meshes would grind your app to
          a halt. InstancedMesh lets you stamp out thousands of copies in a
          single draw call -- same geometry, same material, different positions
          and colors.
        </p>
      </div>

      {/* ── 2. WhatCouldGoWrong ── */}
      <WhatCouldGoWrong
        scenario={`You build a beautiful particle field with 5,000 individual <mesh> components. It looks amazing in your head. Then you run it. Your fan spins up, your FPS counter reads "4", and your laptop starts warming your coffee.`}
        error={`WARNING: 5000 draw calls detected. Frame time: 243ms (4 FPS).
CPU bottleneck: the GPU is idle, waiting for the CPU to finish
issuing draw commands. Consider using InstancedMesh.`}
        errorType="Performance"
      />

      <Separator className="my-8" />

      {/* ── 3. Story Analogy ── */}
      <ScrollReveal>
        <ConversationalCallout type="story">
          <p>
            Think of a cookie cutter. Instead of hand-sculpting 1,000 cookies
            one by one (1,000 draw calls), you grab one cookie cutter and stamp
            them all out from a single sheet of dough (1 draw call). Every
            cookie has the same shape, but you can place them anywhere on the
            baking sheet and frost each one a different color.
          </p>
          <p>
            That is exactly what InstancedMesh does. One shape, one material,
            thousands of stamps -- and the GPU barely breaks a sweat.
          </p>
        </ConversationalCallout>
      </ScrollReveal>

      <Separator className="my-8" />

      {/* ── 4. SimpleFlow ── */}
      <ScrollReveal>
        <h2 className="text-2xl font-bold mb-4">How Instancing Works</h2>
        <SimpleFlow
          steps={[
            { label: "Create InstancedMesh", detail: "Define shape + material + count" },
            { label: "Position each copy", detail: "Set transform via dummy Object3D" },
            { label: "Bake the matrix", detail: "dummy.updateMatrix()" },
            { label: "Upload to GPU", detail: "needsUpdate = true" },
            { label: "1 draw call", detail: "GPU renders all copies at once", status: "success" },
          ]}
        />
      </ScrollReveal>

      <Separator className="my-8" />

      {/* ── 5. Demo ── */}
      <ScrollReveal>
        <h2 className="text-2xl font-bold mb-4">See It In Action</h2>
        <p className="text-muted-foreground mb-4">
          The demo below renders hundreds of instances with a single draw call.
          Each one has its own position and color, but they all share one
          geometry and one material.
        </p>
      </ScrollReveal>
      <Demo />

      <Separator className="my-8" />

      {/* ── 6. Guided Walkthrough ── */}
      <ScrollReveal>
        <h2 className="text-2xl font-bold mb-4">Building It Step by Step</h2>

        {/* Step 1 */}
        <div className="rounded-lg border bg-card p-4 mb-4">
          <p className="text-sm font-semibold mb-2">
            Step 1 -- Declare the InstancedMesh
          </p>
          <p className="text-sm text-muted-foreground mb-3">
            Tell R3F what shape to stamp, what material to use, and how many
            copies you need. Pass <code>undefined</code> for geometry and
            material since you provide them as children.
          </p>
          <CodeBlock
            code={`<instancedMesh ref={meshRef} args={[undefined, undefined, 1000]}>
  <boxGeometry args={[0.5, 0.5, 0.5]} />
  <meshStandardMaterial color="#6c5ce7" />
</instancedMesh>`}
            filename="Forest.tsx"
          />
          <p className="text-sm text-muted-foreground mt-2">
            The third value in <code>args</code> is the instance count. This
            tells the GPU how much buffer space to allocate up front.
          </p>
        </div>

        {/* Step 2 */}
        <div className="rounded-lg border bg-card p-4 mb-4">
          <p className="text-sm font-semibold mb-2">
            Step 2 -- Position each instance with a dummy Object3D
          </p>
          <p className="text-sm text-muted-foreground mb-3">
            You cannot set position directly on each instance. Instead, use a
            temporary Object3D as a stamp -- set its position, bake its matrix,
            and hand that matrix to the InstancedMesh.
          </p>
          <CodeBlock
            code={`const dummy = useMemo(() => new THREE.Object3D(), [])

useEffect(() => {
  for (let i = 0; i < 1000; i++) {
    dummy.position.set(
      (Math.random() - 0.5) * 20,
      (Math.random() - 0.5) * 20,
      (Math.random() - 0.5) * 20
    )
    dummy.updateMatrix()
    meshRef.current.setMatrixAt(i, dummy.matrix)
  }
  meshRef.current.instanceMatrix.needsUpdate = true
}, [dummy])`}
            filename="Forest.tsx"
          />
          <p className="text-sm text-muted-foreground mt-2">
            Notice the two critical lines at the end:{" "}
            <code>dummy.updateMatrix()</code> bakes position/rotation/scale into
            a 4x4 matrix, and <code>needsUpdate = true</code> ships that data
            to the GPU.
          </p>
        </div>

        {/* Step 3 */}
        <div className="rounded-lg border bg-card p-4 mb-4">
          <p className="text-sm font-semibold mb-2">
            Step 3 -- Give each instance its own color
          </p>
          <p className="text-sm text-muted-foreground mb-3">
            Optionally, you can assign a unique color to every instance using
            <code> setColorAt()</code>. Just remember to flip the color
            buffer&apos;s <code>needsUpdate</code> flag too.
          </p>
          <CodeBlock
            code={`const color = useMemo(() => new THREE.Color(), [])

useEffect(() => {
  for (let i = 0; i < 1000; i++) {
    color.setHSL(i / 1000, 0.8, 0.5)
    meshRef.current.setColorAt(i, color)
  }
  meshRef.current.instanceColor.needsUpdate = true
}, [color])`}
            filename="Forest.tsx"
          />
          <p className="text-sm text-muted-foreground mt-2">
            One gotcha: the base material color multiplies with instance colors.
            If your material is black, everything stays black. Use white or omit
            the color prop on the material.
          </p>
        </div>
      </ScrollReveal>

      <Separator className="my-8" />

      {/* ── 7. WhatYouJustLearned ── */}
      <WhatYouJustLearned
        points={[
          "InstancedMesh renders thousands of identical shapes in 1 draw call",
          "A dummy Object3D acts as your stamp -- set its transform, bake the matrix, hand it over",
          "Always call dummy.updateMatrix() before setMatrixAt()",
          "Always set instanceMatrix.needsUpdate = true after a batch of updates",
          "Per-instance color is optional via setColorAt() + instanceColor.needsUpdate",
        ]}
      />

      <Separator className="my-8" />

      {/* ── 8. Question Callout ── */}
      <ScrollReveal>
        <ConversationalCallout type="question">
          <p>
            What if you need instances with different geometries -- say, a mix
            of cubes and spheres? InstancedMesh requires all instances to share
            the same geometry. For mixed shapes, you would use multiple
            InstancedMesh components (one per shape) or look into drei&apos;s{" "}
            <code>&lt;Merged&gt;</code> component which batches different
            geometries into a single draw call using geometry merging.
          </p>
        </ConversationalCallout>
      </ScrollReveal>

      <Separator className="my-8" />

      {/* ── 9. AhaMoment ── */}
      <AhaMoment
        setup="Why is InstancedMesh so fast when it renders the exact same number of triangles as individual meshes?"
        reveal="The bottleneck is not the GPU drawing triangles -- it is the CPU telling the GPU what to draw. Each draw call has overhead: binding buffers, setting uniforms, dispatching commands. With 5,000 individual meshes, the CPU spends all its time talking to the GPU instead of letting it work. InstancedMesh packs everything into one conversation: 'Here is the shape, here are 5,000 transforms, go.' The GPU chews through it instantly."
      />

      <Separator className="my-8" />

      {/* ── 10. MentalModelChallenge ── */}
      <MentalModelChallenge
        question="You have 2,000 instances that never move after the initial setup. Where should you set their matrices?"
        options={[
          {
            label: "Inside useFrame, every frame",
            correct: false,
            explanation:
              "This re-uploads 2,000 matrices to the GPU 60 times per second for no reason. Massive waste.",
          },
          {
            label: "Inside useEffect, once on mount",
            correct: true,
            explanation:
              "Since they never move, set it once and forget it. The GPU keeps the buffer until you tell it otherwise.",
          },
          {
            label: "Inside useState initializer",
            correct: false,
            explanation:
              "useState runs before the ref is attached, so meshRef.current would be null.",
          },
        ]}
        answer="Use useEffect for static instances. The matrices are set once, uploaded once, and the GPU keeps them forever. No per-frame work needed. Only use useFrame if instances actually move every frame."
      />

      <Separator className="my-8" />

      {/* Try These Challenges */}
      <ScrollReveal>
        <TryThisList challenges={[
          { challenge: "Set count to 100 vs 1000 -- can you feel the performance difference?", hint: "Open your browser's performance monitor (F12 > Performance tab) and compare frame times.", solution: "At 100 instances, frame times are nearly instant because it is still just 1 draw call. At 1000 instances, the GPU does more work per frame but it is still a single draw call. You might notice slightly lower FPS at very high counts, but the key insight is that 1000 instances is vastly faster than 1000 individual meshes.", difficulty: "beginner" },
          { challenge: "Max out waveHeight -- watch the cubes fly!", hint: "waveHeight controls the amplitude of the sine wave animation. Higher values mean bigger waves.", solution: "With maximum waveHeight, the cubes oscillate wildly, flying far above and below their rest positions. The sine wave animation multiplies by waveHeight, so large values create dramatic waves. This is all happening in a single draw call -- updating 1000 matrices per frame is cheap because it is just math on the CPU side.", difficulty: "beginner" },
          { challenge: "Set cubeSize to 0.5 -- chunky cubes!", hint: "cubeSize controls the args passed to boxGeometry, which sets the dimensions of every instance.", solution: "All instances become larger chunky cubes because they all share the same geometry. This is a fundamental property of InstancedMesh -- every instance has the same shape and material. You cannot make individual instances different shapes. For that, you would need multiple InstancedMesh components or drei's Merged.", difficulty: "beginner" },
        ]} />
      </ScrollReveal>

      <Separator className="my-8" />

      {/* ── 11. CommonMistakes ── */}
      <ScrollReveal>
        <CommonMistakes mistakes={mistakes} />
      </ScrollReveal>

      <Separator className="my-8" />

      {/* ── 12. Best Practices ── */}
      <ScrollReveal>
        <section className="space-y-4">
          <h2 className="text-2xl font-bold">Best Practices</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-lg border bg-card p-4 space-y-2">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="size-4 text-green-500" />
                <h3 className="font-semibold text-sm">Keep geometry simple</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Total vertices = instance count x vertices per shape. Low-poly
                geometry is key for massive instance counts.
              </p>
            </div>
            <div className="rounded-lg border bg-card p-4 space-y-2">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="size-4 text-green-500" />
                <h3 className="font-semibold text-sm">Reuse the dummy Object3D</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Create one dummy with <code>useMemo</code> and reuse it in
                every loop. Never create Object3D inside a loop.
              </p>
            </div>
            <div className="rounded-lg border bg-card p-4 space-y-2">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="size-4 text-green-500" />
                <h3 className="font-semibold text-sm">
                  Set matrices once for static scenes
                </h3>
              </div>
              <p className="text-sm text-muted-foreground">
                If instances never move, set their matrices in{" "}
                <code>useEffect</code> and never touch them again. Zero per-frame cost.
              </p>
            </div>
            <div className="rounded-lg border bg-card p-4 space-y-2">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="size-4 text-green-500" />
                <h3 className="font-semibold text-sm">
                  Disable frustum culling for spread-out instances
                </h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Three.js culls the entire InstancedMesh based on one bounding
                box. If instances are spread far apart, set{" "}
                <code>frustumCulled={"{false}"}</code>.
              </p>
            </div>
          </div>
        </section>
      </ScrollReveal>
    </div>
  );
}
