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

const AxesDemo = dynamic(
  () =>
    import("./_components/axes-demo").then((m) => ({
      default: m.AxesDemo,
    })),
  {
    ssr: false,
    loading: () => (
      <div className="w-full aspect-[2/1] rounded-xl border bg-[#0a0a0a] animate-pulse" />
    ),
  }
);

const mistakes: Mistake[] = [
  {
    title: "Confusing Y-up with Z-up",
    subtitle: "Objects appear rotated or in unexpected positions",
    wrongCode: `// Coming from Blender (Z-up) and assuming Z is up
<mesh position={[0, 0, 5]}>
  {/* Thinks this moves up — actually moves TOWARD the camera! */}`,
    rightCode: `// Three.js uses Y-up coordinate system
<mesh position={[0, 5, 0]}>
  {/* Correctly moves up */}`,
    filename: "App.tsx",
    explanation:
      "Three.js uses a Y-up right-handed coordinate system. If you're coming from Blender (Z-up) or Unreal (Z-up left-handed), the axes may be different from what you expect. glTF models exported from Blender auto-convert to Y-up.",
  },
  {
    title: "Using degrees instead of radians",
    subtitle: "Rotations are wildly wrong — a 45-degree turn becomes 45 radians",
    wrongCode: `// WRONG: rotation uses radians, not degrees!
<mesh rotation={[0, 45, 0]}>
  {/* 45 radians = about 7 full spins! */}`,
    rightCode: `// Use radians: Math.PI / 4 = 45 degrees
<mesh rotation={[0, Math.PI / 4, 0]}>

// Or use the degToRad helper
import { MathUtils } from "three";
<mesh rotation={[0, MathUtils.degToRad(45), 0]}>`,
    filename: "App.tsx",
    explanation:
      "All rotation values in Three.js are in radians. A full circle is 2 * Math.PI (~6.28) radians, not 360. Passing 45 means 45 radians, which is about 7 full rotations. Always use Math.PI fractions or THREE.MathUtils.degToRad().",
  },
  {
    title: "Replacing position instead of mutating it",
    subtitle: "Object stops updating correctly",
    wrongCode: `// WRONG: Replacing the vector entirely in useFrame
useFrame(() => {
  ref.current.position = new Vector3(1, 2, 3);
  // Breaks the internal matrix update link!
});`,
    rightCode: `// Correct: mutate the existing vector
useFrame(() => {
  ref.current.position.set(1, 2, 3);
  // Or modify individual axes:
  ref.current.position.x = 1;
});`,
    filename: "App.tsx",
    explanation:
      "Three.js Object3D's position, rotation, and scale are linked to the internal matrix system. Replacing them with a new object breaks this link. Always mutate with .set(), .copy(), or direct property assignment.",
  },
];

export default function CoordinateSystemPage() {
  return (
    <div className="max-w-4xl ambient-scene">
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-3">
          <Badge variant="outline">Scene Basics</Badge>
        </div>
        <h1 className="text-3xl font-bold tracking-tight mb-3">
          Coordinate System
        </h1>
        <p className="text-lg text-muted-foreground">
          Every object in your 3D scene has an address — a position in 3D space.
          Understanding how this addressing system works is the key to placing
          objects exactly where you want them.
        </p>
      </div>

      {/* What Could Go Wrong */}
      <WhatCouldGoWrong
        scenario="You place a cube at position [0, 0, 5] expecting it to float above the ground. Instead, it flies straight toward the camera and fills the entire screen. You try [0, 5, 0] and now it's up in the sky. The axes aren't what you expected."
        error="Object appears at wrong position. Expected 'up' but got 'toward camera'."
        errorType="Wrong Axis"
        accentColor="red"
      />

      <Separator className="my-8" />

      {/* Story Analogy */}
      <ConversationalCallout type="story">
        <p>Imagine you&apos;re looking at a city map. Every building has an address based on three things:</p>
        <p><strong>X = East/West streets</strong> — Positive X is to the right (East), negative is left (West).</p>
        <p><strong>Y = Altitude</strong> — How high something is. Positive Y is up (a skyscraper), negative is underground (a subway).</p>
        <p><strong>Z = North/South avenues</strong> — Positive Z comes toward you (South), negative goes away from you (North).</p>
        <p>The origin (0, 0, 0) is city center. Every object in your scene has an address in this city.</p>
      </ConversationalCallout>

      <Separator className="my-8" />

      {/* Mental Model Flow */}
      <SimpleFlow
        steps={[
          { label: "X Axis", detail: "Left / Right" },
          { label: "Y Axis", detail: "Up / Down" },
          { label: "Z Axis", detail: "Toward / Away" },
          { label: "Origin", detail: "(0, 0, 0) = Center", status: "success" },
        ]}
        accentColor="blue"
      />

      <Separator className="my-8" />

      {/* Interactive Demo */}
      <AxesDemo />

      <Separator className="my-8" />

      {/* Guided Walkthrough */}
      <ScrollReveal>
        <section className="space-y-4">
          <h2 className="text-2xl font-bold">Hands-On: Placing Objects in 3D Space</h2>
          <p className="text-muted-foreground leading-relaxed">
            Let&apos;s place some objects and see how the coordinate system works in practice.
            Remember: X is left/right, Y is up/down, Z is toward/away.
          </p>

          <div className="rounded-lg border bg-card p-4 space-y-3">
            <p className="text-sm font-medium">Step 1: Place an object using its address</p>
            <CodeBlock
              code={`<mesh position={[2, 1, 0]}>\n  <boxGeometry />\n  <meshStandardMaterial color="coral" />\n</mesh>`}
              filename="App.tsx"
            />
            <p className="text-sm text-muted-foreground">
              This places a cube 2 units to the right and 1 unit up from the center.
              The position prop takes an array of [x, y, z]. Think of it as a street address:
              2 blocks east, 1 floor up, ground level.
            </p>
          </div>

          <div className="rounded-lg border bg-card p-4 space-y-3">
            <p className="text-sm font-medium">Step 2: Rotate and scale</p>
            <CodeBlock
              code={`<mesh\n  position={[0, 0, 0]}\n  rotation={[0, Math.PI / 4, 0]}\n  scale={[1, 2, 1]}\n>\n  <boxGeometry />\n  <meshStandardMaterial color="skyblue" />\n</mesh>`}
              filename="App.tsx"
            />
            <p className="text-sm text-muted-foreground">
              Rotation is in radians (Math.PI / 4 = 45 degrees). Scale stretches the cube — here
              it&apos;s twice as tall on Y. Notice the order: Three.js applies Scale first, then Rotation,
              then Position.
            </p>
          </div>

          <div className="rounded-lg border bg-card p-4 space-y-3">
            <p className="text-sm font-medium">Step 3: Group objects together</p>
            <CodeBlock
              code={`<group position={[3, 0, 0]}>\n  <mesh position={[0, 1, 0]}>\n    <sphereGeometry args={[0.5]} />\n    <meshStandardMaterial color="gold" />\n  </mesh>\n  <mesh>\n    <boxGeometry />\n    <meshStandardMaterial color="teal" />\n  </mesh>\n</group>`}
              filename="App.tsx"
            />
            <p className="text-sm text-muted-foreground">
              Groups are like neighborhoods. The group is at [3, 0, 0], and the sphere inside
              is at [0, 1, 0] relative to the group — so its real-world address is [3, 1, 0].
              Move the group, and everything inside moves together.
            </p>
          </div>
        </section>
      </ScrollReveal>

      <Separator className="my-8" />

      {/* What You Just Learned */}
      <WhatYouJustLearned
        points={[
          "Three.js uses a Y-up coordinate system: X = left/right, Y = up/down, Z = toward/away from the viewer.",
          "The origin (0, 0, 0) is the center of the world. Every object has a position relative to this center.",
          "Rotation is measured in radians, not degrees. Math.PI = 180 degrees, Math.PI / 2 = 90 degrees.",
          "Groups let you create local coordinate systems — children are positioned relative to their parent.",
        ]}
      />

      <Separator className="my-8" />

      {/* Thought-Provoking Question */}
      <ConversationalCallout type="question">
        <p>
          If a child mesh is at position [0, 2, 0] inside a group at [5, 0, 0],
          where is the child in world space? What happens to the child if you rotate
          the group 90 degrees around the Y axis?
        </p>
      </ConversationalCallout>

      <Separator className="my-8" />

      {/* Aha Moment */}
      <AhaMoment
        setup="You might think 'world space' and 'local space' are just fancy terms. But here's why they matter more than you'd expect..."
        reveal="Every child object's position is relative to its parent, not the world. This means you can build complex things — like a solar system where planets orbit the sun and moons orbit planets — just by nesting groups. Move the sun, and everything follows. This parent-child relationship is what makes 3D scene graphs so powerful."
      />

      <Separator className="my-8" />

      {/* Mental Model Challenge */}
      <MentalModelChallenge
        question="You set a mesh's rotation to [0, 90, 0]. Instead of rotating 90 degrees, the object spins wildly. What went wrong?"
        options={[
          { label: "The Y axis doesn't support rotation", correct: false, explanation: "Every axis supports rotation. The issue is the unit of measurement." },
          { label: "You used degrees instead of radians", correct: true, explanation: "90 radians is about 14 full rotations! You wanted Math.PI / 2, which is 90 degrees in radians." },
          { label: "The rotation order is wrong", correct: false, explanation: "Rotation order matters for complex rotations, but the main issue here is using degrees." },
          { label: "The mesh needs to be in a group first", correct: false, explanation: "Meshes can be rotated directly. No group required." },
        ]}
        hint="Remember, Three.js doesn't use degrees..."
        answer="Three.js measures rotation in radians, not degrees. A full circle is ~6.28 radians (2 * Math.PI), not 360. So 90 means 90 radians — about 14 full spins! Use Math.PI / 2 for 90 degrees, or MathUtils.degToRad(90)."
      />

      <Separator className="my-8" />

      {/* Try This Challenges */}
      <ScrollReveal>
        <TryThisList challenges={[
          {
            challenge: "Move the cube to [2, 0, -3] — where does it go?",
            hint: "Positive X is right, negative Z is away from the camera.",
            solution: "The cube moves 2 units to the right and 3 units away from you (deeper into the screen). It appears smaller because it's farther from the camera.",
            difficulty: "beginner",
          },
          {
            challenge: "Rotate by Math.PI/4 — what angle is that?",
            hint: "Math.PI is 180 degrees. What's half of half of a full circle?",
            solution: "Math.PI/4 is 45 degrees. The cube tilts halfway between its original orientation and a 90-degree turn.",
            difficulty: "beginner",
          },
          {
            challenge: "Scale to [2, 0.5, 1] — what shape do you get?",
            hint: "Scale stretches each axis independently: X is width, Y is height, Z is depth.",
            solution: "You get a wide, flat box — twice as wide on X, half as tall on Y, and normal depth on Z. It looks like a plank or shelf.",
            difficulty: "beginner",
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
                <h3 className="font-semibold text-sm">Use AxesHelper During Development</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Add an axesHelper to your scene while building. The color coding (Red=X, Green=Y, Blue=Z)
                makes it immediately obvious which direction is which.
              </p>
            </div>
            <div className="rounded-lg border bg-card p-4 space-y-2">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="size-4 text-green-500" />
                <h3 className="font-semibold text-sm">Use Groups for Hierarchies</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Group related objects together. Moving or rotating the group transforms all children
                — perfect for things like robot arms, solar systems, or UI panels.
              </p>
            </div>
            <div className="rounded-lg border bg-card p-4 space-y-2">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="size-4 text-green-500" />
                <h3 className="font-semibold text-sm">1 Unit = 1 Meter Convention</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Stick to the convention that 1 unit equals 1 meter. This keeps physics,
                lighting, shadows, and VR/AR experiences working correctly without
                constant scaling headaches.
              </p>
            </div>
            <div className="rounded-lg border bg-card p-4 space-y-2">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="size-4 text-green-500" />
                <h3 className="font-semibold text-sm">Prefer degToRad for Readability</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                When you think in degrees, use MathUtils.degToRad(45) instead of doing the math
                yourself. Your future self (and teammates) will thank you for the clarity.
              </p>
            </div>
          </div>
        </section>
      </ScrollReveal>
    </div>
  );
}
