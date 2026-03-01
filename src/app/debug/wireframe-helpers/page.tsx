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

const WireframeDemo = dynamic(
  () =>
    import("./_components/wireframe-demo").then((m) => ({
      default: m.WireframeDemo,
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
    title: "Leaving helpers in production builds",
    subtitle: "Your users see grid lines and axis arrows on top of your beautiful scene",
    wrongCode: `// Helpers everywhere, even in production
<Canvas>
  <axesHelper args={[5]} />
  <gridHelper args={[10, 10]} />
  <boxHelper args={[mesh, "yellow"]} />
  <MyScene />
</Canvas>`,
    rightCode: `// Conditionally render helpers
const isDev = process.env.NODE_ENV === "development";

<Canvas>
  {isDev && <axesHelper args={[5]} />}
  {isDev && <gridHelper args={[10, 10]} />}
  <MyScene />
</Canvas>

// Or use Leva's hidden prop in prod
<Leva hidden={!isDev} />`,
    filename: "App.tsx",
    explanation:
      "Helpers are debugging tools, not production features. Wrap them in environment checks or use a debug toggle so they never ship to users. Leva panels should also be hidden in production.",
  },
  {
    title: "BoxHelper not updating when the mesh transforms",
    subtitle: "The bounding box stays frozen at the original position",
    wrongCode: `// BoxHelper created once, never updated
<boxHelper args={[meshRef.current, "yellow"]} />
// The box stays in the original position
// even as the mesh moves and rotates`,
    rightCode: `// Update BoxHelper every frame
useFrame(() => {
  if (boxHelperRef.current) {
    boxHelperRef.current.update();
  }
});

<boxHelper
  ref={boxHelperRef}
  args={[meshRef.current, "yellow"]}
/>`,
    filename: "App.tsx",
    explanation:
      "BoxHelper computes the bounding box once on creation. If the mesh moves, rotates, or scales, you need to call .update() every frame to keep the helper in sync.",
  },
  {
    title: "AxesHelper too small or too large for the scene",
    subtitle: "Axis lines are either invisible or they stretch to infinity",
    wrongCode: `// Default size might not fit your scene
<axesHelper />
// Size 1 is invisible in a large scene
// Size 100 overwhelms a small scene`,
    rightCode: `// Size the axes relative to your scene
// Small scene (objects ~1 unit)
<axesHelper args={[2]} />

// Large scene (objects ~100 units)
<axesHelper args={[50]} />

// Make it configurable with Leva
const { axisSize } = useControls({
  axisSize: { value: 3, min: 0.5, max: 10 }
});
<axesHelper args={[axisSize]} />`,
    filename: "App.tsx",
    explanation:
      "AxesHelper draws lines from the origin. The default size is 1, which is often too small to see. Scale the helper to match your scene dimensions, or better yet, make it adjustable with a GUI control.",
  },
];

export default function WireframeHelpersPage() {
  return (
    <div className="relative max-w-4xl">
      <div className="absolute -top-10 -left-10 w-72 h-72 bg-gradient-to-br from-teal-500/10 via-emerald-500/10 to-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-3">
          <Badge variant="outline">Debug & Helpers</Badge>
        </div>
        <h1 className="text-3xl font-bold tracking-tight mb-3">
          Wireframe & Helpers
        </h1>
        <p className="text-lg text-muted-foreground">
          3D scenes are opaque by default — you see the final rendered pixels but
          nothing about the underlying structure. Helpers are your X-ray vision:
          wireframes reveal edges, axes show directions, grids show the ground
          plane, and box helpers outline bounding volumes.
        </p>
      </div>

      {/* What Could Go Wrong */}
      <WhatCouldGoWrong
        scenario="You've placed a mesh at position [0, 0, 0] but it's not visible. Is it behind the camera? Inside another object? Too small? Too large? Without any visual reference points, you're debugging blind. You spend 20 minutes tweaking numbers before realizing the object was at the wrong scale."
        error="Object not visible. No errors in console. Scene appears empty."
        errorType="Visual"
        accentColor="red"
      />

      <Separator className="my-8" />

      {/* Story Analogy */}
      <ConversationalCallout type="story">
        <p>Think of helpers as <strong>X-ray glasses</strong> for your 3D scene.</p>
        <p>Without them, you see a finished painting. With them, you see the pencil sketch underneath. <strong>Wireframe</strong> shows you the skeleton — every triangle that makes up a surface. <strong>AxesHelper</strong> is like a compass, showing which way is X (red), Y (green), and Z (blue). <strong>GridHelper</strong> is graph paper on the floor, giving you spatial reference.</p>
        <p>And <strong>BoxHelper</strong> draws a yellow outline around objects, like a spotlight operator marking where an actor should stand. Together, they transform a mysterious black box into a transparent workspace.</p>
      </ConversationalCallout>

      <Separator className="my-8" />

      {/* Mental Model Flow */}
      <SimpleFlow
        steps={[
          { label: "Wireframe", detail: "See the triangle mesh" },
          { label: "AxesHelper", detail: "See the XYZ directions" },
          { label: "GridHelper", detail: "See the ground plane" },
          { label: "BoxHelper", detail: "See bounding boxes", status: "success" },
        ]}
        accentColor="rose"
      />

      <Separator className="my-8" />

      {/* Interactive Demo */}
      <WireframeDemo />

      <Separator className="my-8" />

      {/* Guided Walkthrough */}
      <ScrollReveal>
        <section className="space-y-4">
          <h2 className="text-2xl font-bold">Hands-On: Adding X-Ray Vision</h2>
          <p className="text-muted-foreground leading-relaxed">
            Let&apos;s add helpers one by one to see how each reveals a different
            layer of your scene structure.
          </p>

          <div className="rounded-lg border bg-card p-4 space-y-3">
            <p className="text-sm font-medium">Step 1: Wireframe mode</p>
            <CodeBlock
              code={`// Wireframe shows every triangle edge
<mesh>
  <torusKnotGeometry args={[1, 0.3, 100, 16]} />
  <meshStandardMaterial
    color="royalblue"
    wireframe={true}  // flip this on/off!
  />
</mesh>`}
              filename="App.tsx"
            />
            <p className="text-sm text-muted-foreground">
              Setting wireframe to true on any material reveals the underlying
              triangle mesh. You can see exactly how the geometry is constructed
              — more triangles means smoother curves but higher GPU cost.
            </p>
          </div>

          <div className="rounded-lg border bg-card p-4 space-y-3">
            <p className="text-sm font-medium">Step 2: AxesHelper and GridHelper</p>
            <CodeBlock
              code={`// Red = X, Green = Y, Blue = Z
<axesHelper args={[3]} />

// Grid on the XZ plane (the floor)
<gridHelper
  args={[10, 10, "#666", "#444"]}
  position={[0, -1, 0]}
/>`}
              filename="App.tsx"
            />
            <p className="text-sm text-muted-foreground">
              AxesHelper draws three colored lines from the origin. Remember:
              RGB maps to XYZ. The GridHelper draws a grid on the floor plane,
              giving you spatial reference for where objects are positioned.
            </p>
          </div>

          <div className="rounded-lg border bg-card p-4 space-y-3">
            <p className="text-sm font-medium">Step 3: BoxHelper for bounding volumes</p>
            <CodeBlock
              code={`const meshRef = useRef<THREE.Mesh>(null);
const boxRef = useRef<THREE.BoxHelper>(null);

// Update every frame to track movement
useFrame(() => {
  boxRef.current?.update();
});

<mesh ref={meshRef}>
  <torusKnotGeometry args={[1, 0.3, 100, 16]} />
  <meshStandardMaterial color="royalblue" />
</mesh>

{meshRef.current && (
  <boxHelper
    ref={boxRef}
    args={[meshRef.current, "#facc15"]}
  />
)}`}
              filename="App.tsx"
            />
            <p className="text-sm text-muted-foreground">
              BoxHelper draws a wireframe box around any object, showing its
              axis-aligned bounding box (AABB). This is useful for understanding
              the spatial extent of complex shapes and debugging collision areas.
            </p>
          </div>
        </section>
      </ScrollReveal>

      <Separator className="my-8" />

      {/* What You Just Learned */}
      <WhatYouJustLearned
        points={[
          "Wireframe mode reveals the triangle mesh that makes up any geometry by setting wireframe={true} on the material.",
          "AxesHelper draws XYZ axes (Red=X, Green=Y, Blue=Z) from the origin as a directional compass.",
          "GridHelper creates a reference grid on the floor plane, sized to match your scene scale.",
          "BoxHelper draws a bounding box around objects — call .update() every frame if the object moves.",
        ]}
      />

      <Separator className="my-8" />

      {/* Thought-Provoking Question */}
      <ConversationalCallout type="question">
        <p>
          If you can toggle helpers on and off at runtime, what would be the
          ideal debugging workflow? Would you keep all helpers on by default, or
          add them one at a time as you need specific information?
        </p>
      </ConversationalCallout>

      <Separator className="my-8" />

      {/* Aha Moment */}
      <AhaMoment
        setup="You might think helpers are just for beginners who don't know where things are yet."
        reveal="Professional 3D developers use helpers constantly. Game engines like Unity and Unreal have entire debug visualization systems built in. The difference is they toggle them contextually: wireframe to check LOD transitions, axes to verify orientations, box helpers to debug physics colliders. Helpers aren't training wheels — they're the experienced developer's diagnostic toolkit."
      />

      <Separator className="my-8" />

      {/* Mental Model Challenge */}
      <MentalModelChallenge
        question="You have a mesh that's rotating, and its BoxHelper stays frozen at the original position. What's missing?"
        options={[
          { label: "Call boxHelper.update() every frame", correct: true, explanation: "Correct! BoxHelper computes the bounding box once. You need to call .update() in useFrame to recalculate it as the mesh transforms." },
          { label: "Set boxHelper.matrixAutoUpdate = true", correct: false, explanation: "matrixAutoUpdate handles the helper's own transform matrix, not the bounding box computation. You still need to call .update() to recalculate the AABB." },
          { label: "Re-create the BoxHelper each frame", correct: false, explanation: "This would work but it's extremely wasteful. Creating and disposing objects every frame causes GC pressure. Just call .update() instead." },
          { label: "Pass the mesh's rotation to the BoxHelper", correct: false, explanation: "BoxHelper calculates an axis-aligned bounding box. It doesn't rotate with the mesh — it recalculates a new AABB that contains the rotated mesh." },
        ]}
        hint="BoxHelper calculates its bounds only once at creation time..."
        answer="BoxHelper computes an axis-aligned bounding box (AABB) at creation. As the mesh transforms, the AABB needs to be recalculated each frame via .update(). This is a common gotcha because most helpers are static by default."
      />

      <Separator className="my-8" />

      {/* Try This */}
      <Separator className="my-8" />
      <ScrollReveal>
        <TryThisList challenges={[
          { challenge: "Toggle wireframe — see the edges!", hint: "Enable the wireframe toggle on the material.", solution: "Wireframe reveals every triangle edge that makes up the geometry. More segments means smoother curves but more triangles.", difficulty: "beginner" },
          { challenge: "Set axesSize to 5 — giant compass", hint: "Increase the axes helper size to 5.", solution: "The XYZ axes extend much further, making directional orientation visible from any camera distance.", difficulty: "beginner" },
          { challenge: "Toggle BoxHelper — see the bounds", hint: "Enable the BoxHelper in the demo controls.", solution: "A yellow wireframe box appears around the object, showing its axis-aligned bounding box.", difficulty: "beginner" },
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
                <h3 className="font-semibold text-sm">Use Leva for Debug Toggles</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Add Leva controls for wireframe, helpers, and stats. Toggle them on/off
                without touching code. Hide the Leva panel in production builds.
              </p>
            </div>
            <div className="rounded-lg border bg-card p-4 space-y-2">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="size-4 text-green-500" />
                <h3 className="font-semibold text-sm">Remember RGB = XYZ</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Red is X, Green is Y, Blue is Z. This convention is universal across
                all 3D tools and engines. Burn it into memory.
              </p>
            </div>
            <div className="rounded-lg border bg-card p-4 space-y-2">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="size-4 text-green-500" />
                <h3 className="font-semibold text-sm">Scale Helpers to Your Scene</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Helpers have a size parameter. Match it to your scene scale — a 2-unit
                axis in a 100-unit scene is invisible. Use the grid to calibrate.
              </p>
            </div>
            <div className="rounded-lg border bg-card p-4 space-y-2">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="size-4 text-green-500" />
                <h3 className="font-semibold text-sm">Use GizmoHelper for Orientation</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Drei&apos;s GizmoHelper puts a small orientation cube in the corner of
                your viewport. It shows which axis you&apos;re looking along without
                cluttering the main scene.
              </p>
            </div>
          </div>
        </section>
      </ScrollReveal>
    </div>
  );
}
