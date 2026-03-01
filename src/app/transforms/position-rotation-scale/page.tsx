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

const TransformDemo = dynamic(
  () =>
    import("./_components/transform-demo").then((m) => ({
      default: m.TransformDemo,
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
    title: "Using degrees instead of radians for rotation",
    subtitle: "rotation={[90, 0, 0]} rotates WAY more than 90 degrees",
    wrongCode: `// WRONG: 90 here means 90 RADIANS!
// That's about 14.3 full rotations!
<mesh rotation={[90, 0, 0]}>
  <boxGeometry />
</mesh>`,
    rightCode: `// Use Math.PI for radians
// 90 degrees = Math.PI / 2
<mesh rotation={[Math.PI / 2, 0, 0]}>
  <boxGeometry />
</mesh>

// Or use THREE.MathUtils.degToRad
import * as THREE from "three";
<mesh rotation={[
  THREE.MathUtils.degToRad(90), 0, 0
]}>`,
    filename: "App.tsx",
    explanation:
      "Three.js uses radians, not degrees. 90 radians is about 5,157 degrees — you'll get unexpected results. Use Math.PI (180 degrees) or THREE.MathUtils.degToRad() for conversions.",
  },
  {
    title: "Scaling non-uniformly without understanding side effects",
    subtitle: "Normals get distorted, lighting looks wrong",
    wrongCode: `// Non-uniform scale distorts normals!
<mesh scale={[1, 5, 1]}>
  <sphereGeometry args={[1, 32, 32]} />
  <meshStandardMaterial />
</mesh>
// Lighting looks wrong on the stretched parts`,
    rightCode: `// Option 1: Scale the geometry args instead
<mesh>
  <sphereGeometry args={[1, 32, 32]} />
  <meshStandardMaterial />
</mesh>
// Adjust radius/params, not scale

// Option 2: If you must non-uniform scale,
// use computeVertexNormals after
geometry.computeVertexNormals();`,
    filename: "App.tsx",
    explanation:
      "Non-uniform scaling (different X/Y/Z values) distorts surface normals, making lighting appear incorrect. When possible, adjust geometry dimensions directly rather than using non-uniform scale. If you must, recompute normals afterward.",
  },
  {
    title: "Forgetting that transform order matters",
    subtitle: "Rotating then translating gives a different result than translating then rotating",
    wrongCode: `// In Three.js, transforms apply as:
// Scale -> Rotate -> Translate
// This is built-in and you can't change it

// But if you WANT a different order,
// just setting position and rotation
// won't give orbital movement:
mesh.position.set(2, 0, 0);
mesh.rotation.y = angle;
// This rotates in place, doesn't orbit!`,
    rightCode: `// For orbital motion, use a parent group
<group rotation={[0, angle, 0]}>
  <mesh position={[2, 0, 0]}>
    {/* Mesh is offset, then group rotates */}
    {/* Result: mesh orbits the origin */}
    <boxGeometry />
    <meshStandardMaterial />
  </mesh>
</group>`,
    filename: "App.tsx",
    explanation:
      "Three.js applies transforms in a fixed order: Scale, then Rotate, then Translate. If you need a different order (like orbiting), use parent groups. The child's position becomes the orbit radius, and the parent's rotation drives the orbit.",
  },
];

export default function PositionRotationScalePage() {
  return (
    <div className="max-w-4xl ambient-transform">
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-3">
          <Badge variant="outline">Transforms & Color</Badge>
        </div>
        <h1 className="text-3xl font-bold tracking-tight mb-3">
          Position, Rotation & Scale
        </h1>
        <p className="text-lg text-muted-foreground">
          Every object in 3D space has three fundamental transforms: where it is
          (position), which way it faces (rotation), and how big it is (scale).
          Mastering these three properties is the foundation of all 3D work —
          from placing a button in a UI to choreographing a cinematic camera move.
        </p>
      </div>

      {/* What Could Go Wrong */}
      <WhatCouldGoWrong
        scenario="You set rotation={[90, 0, 0]} expecting a nice 90-degree tilt. Instead, the object spins wildly because Three.js uses radians, not degrees. 90 radians is about 14 full rotations. Your mesh is facing some random direction and you have no idea why."
        error="Mesh rotated to unexpected angle. rotation={[90, 0, 0]} but object is not at 90 degrees."
        errorType="Logic"
        accentColor="red"
      />

      <Separator className="my-8" />

      {/* Story Analogy */}
      <ConversationalCallout type="story">
        <p>Think of transforms as <strong>dance choreography</strong>.</p>
        <p><strong>Position</strong> is where the dancer stands on stage — stage left, center, downstage. <strong>Rotation</strong> is which direction they face — toward the audience, turned sideways, looking up. <strong>Scale</strong> is like a spotlight zoom — making them appear larger or smaller to the audience.</p>
        <p>Just like in dance, <strong>order matters</strong>. If you tell a dancer &quot;take two steps forward, then turn right,&quot; they end up in a different place than &quot;turn right, then take two steps forward.&quot; Three.js applies transforms in a fixed order: Scale, then Rotate, then Translate.</p>
      </ConversationalCallout>

      <Separator className="my-8" />

      {/* Mental Model Flow */}
      <SimpleFlow
        steps={[
          { label: "Scale", detail: "Resize the object" },
          { label: "Rotate", detail: "Spin it to face a direction" },
          { label: "Translate", detail: "Move it to a position", status: "success" },
        ]}
        accentColor="violet"
      />

      <Separator className="my-8" />

      {/* Interactive Demo */}
      <TransformDemo />

      <Separator className="my-8" />

      {/* Guided Walkthrough */}
      <ScrollReveal>
        <section className="space-y-4">
          <h2 className="text-2xl font-bold">Hands-On: Moving Things Around</h2>
          <p className="text-muted-foreground leading-relaxed">
            Let&apos;s place, rotate, and scale objects step by step. Every 3D
            interaction you&apos;ll ever build starts with these fundamentals.
          </p>

          <div className="rounded-lg border bg-card p-4 space-y-3">
            <p className="text-sm font-medium">Step 1: Position — where in space</p>
            <CodeBlock
              code={`// Position is [x, y, z]
// x = left/right, y = up/down, z = forward/back
<mesh position={[2, 0, 0]}>   {/* 2 units right */}
  <boxGeometry />
  <meshStandardMaterial color="coral" />
</mesh>

<mesh position={[0, 1.5, 0]}> {/* 1.5 units up */}
  <sphereGeometry args={[0.5]} />
  <meshStandardMaterial color="skyblue" />
</mesh>

<mesh position={[-1, 0, 3]}>  {/* left and forward */}
  <coneGeometry args={[0.5, 1]} />
  <meshStandardMaterial color="gold" />
</mesh>`}
              filename="App.tsx"
            />
            <p className="text-sm text-muted-foreground">
              Position takes an [x, y, z] array. In Three.js, Y points up (not Z
              like some other tools). Positive X is right, positive Y is up,
              positive Z comes toward the camera.
            </p>
          </div>

          <div className="rounded-lg border bg-card p-4 space-y-3">
            <p className="text-sm font-medium">Step 2: Rotation — which way it faces</p>
            <CodeBlock
              code={`// Rotation is in RADIANS, not degrees!
// Math.PI = 180 degrees
// Math.PI / 2 = 90 degrees
// Math.PI / 4 = 45 degrees

<mesh rotation={[Math.PI / 4, 0, 0]}>
  {/* Tilted 45 degrees on X axis */}
  <boxGeometry />
  <meshStandardMaterial color="coral" />
</mesh>

// Rotate on multiple axes
<mesh rotation={[0, Math.PI / 3, Math.PI / 6]}>
  <boxGeometry />
  <meshStandardMaterial color="skyblue" />
</mesh>`}
              filename="App.tsx"
            />
            <p className="text-sm text-muted-foreground">
              Three.js uses Euler angles in radians. Each value rotates around
              its respective axis: X tilts forward/back, Y spins left/right,
              Z rolls clockwise/counter-clockwise. The default rotation order
              is XYZ.
            </p>
          </div>

          <div className="rounded-lg border bg-card p-4 space-y-3">
            <p className="text-sm font-medium">Step 3: Scale — how big it is</p>
            <CodeBlock
              code={`// Uniform scale — same on all axes
<mesh scale={1.5}>
  <boxGeometry />
  <meshStandardMaterial color="coral" />
</mesh>

// Non-uniform scale — different per axis
<mesh scale={[2, 0.5, 1]}>
  {/* Wide and flat */}
  <boxGeometry />
  <meshStandardMaterial color="skyblue" />
</mesh>

// Scale 0 on an axis = flat (invisible from side)
<mesh scale={[1, 0, 1]}>
  {/* Completely flat! */}
</mesh>`}
              filename="App.tsx"
            />
            <p className="text-sm text-muted-foreground">
              Scale can be a single number (uniform) or an [x, y, z] array
              (non-uniform). A scale of 1 is the original size. Scale 2 doubles
              it. Scale 0.5 halves it. Be careful with non-uniform scale — it
              can distort normals and break lighting.
            </p>
          </div>
        </section>
      </ScrollReveal>

      <Separator className="my-8" />

      {/* What You Just Learned */}
      <WhatYouJustLearned
        points={[
          "Position [x, y, z] places objects in world space. Y is up in Three.js.",
          "Rotation uses radians, not degrees. Math.PI = 180 degrees, Math.PI/2 = 90 degrees.",
          "Scale can be uniform (single number) or per-axis [x, y, z]. Non-uniform scale can distort normals.",
          "Three.js applies transforms in order: Scale first, then Rotate, then Translate. Use parent groups for different ordering.",
        ]}
      />

      <Separator className="my-8" />

      {/* Thought-Provoking Question */}
      <ConversationalCallout type="question">
        <p>
          If you want a mesh to orbit around a point (like a planet orbiting the
          sun), you need to translate then rotate. But Three.js always rotates
          before translating. How would you solve this using the scene graph?
        </p>
      </ConversationalCallout>

      <Separator className="my-8" />

      {/* Aha Moment */}
      <AhaMoment
        setup="You might think the order Scale-Rotate-Translate is a limitation."
        reveal="It's actually a design choice that simplifies everything. If you need a different order, you don't hack the transform — you add a parent group. Want to orbit? Put the mesh inside a group, offset the mesh's position (radius), and rotate the group. Want to rotate around a corner instead of the center? Offset the mesh inside a group, rotate the group. The scene graph hierarchy IS your transform ordering tool. This is why understanding parent-child relationships is more powerful than any custom matrix math."
      />

      <Separator className="my-8" />

      {/* Mental Model Challenge */}
      <MentalModelChallenge
        question="You have a mesh at position [3, 0, 0] with rotation [0, Math.PI/2, 0]. Where does it end up?"
        options={[
          { label: "At [3, 0, 0], rotated 90 degrees around its Y axis", correct: true, explanation: "Correct! Three.js applies rotation first (locally), then translates to the position. The mesh sits at [3, 0, 0] and is spun 90 degrees in place." },
          { label: "At [0, 0, -3], facing backward", correct: false, explanation: "This would happen if translate applied before rotation (orbital motion). Three.js does rotate-then-translate, so position is in world space." },
          { label: "At [3, 0, 0], rotated 90 radians", correct: false, explanation: "Math.PI/2 IS approximately 1.57 radians, which equals exactly 90 degrees. The rotation is correct, but remember this is already specified in radians." },
          { label: "At [0, 0, 3], facing left", correct: false, explanation: "The position [3, 0, 0] is a world-space coordinate. The rotation doesn't change where the mesh is, only which direction it faces." },
        ]}
        hint="Remember: Three.js positions are world-space coordinates, and rotations happen locally around the object's center..."
        answer="Position sets where the object is in world space. Rotation spins it around its own center. They're independent: rotation doesn't affect position, and position doesn't affect rotation. The mesh is at [3, 0, 0] and turned 90 degrees to face along the X axis."
      />

      <Separator className="my-8" />

      {/* Try This */}
      <Separator className="my-8" />
      <ScrollReveal>
        <TryThisList challenges={[
          { challenge: "Set all scale to 2 — double size!", hint: "Change the scale values to 2 on all axes.", solution: "The object doubles in size uniformly, maintaining its proportions.", difficulty: "beginner" },
          { challenge: "Rotate Y to PI — face backward", hint: "Set the Y rotation to Math.PI (approximately 3.14).", solution: "The object rotates 180 degrees, facing the opposite direction.", difficulty: "beginner" },
          { challenge: "Toggle autoRotate — constant spin", hint: "Enable the auto-rotate toggle in the demo controls.", solution: "The object spins continuously, showing how useFrame drives smooth rotation.", difficulty: "beginner" },
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
                <h3 className="font-semibold text-sm">Always Use Radians</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Three.js uses radians everywhere. Create a mental map: Math.PI/6 = 30deg,
                Math.PI/4 = 45deg, Math.PI/2 = 90deg, Math.PI = 180deg.
              </p>
            </div>
            <div className="rounded-lg border bg-card p-4 space-y-2">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="size-4 text-green-500" />
                <h3 className="font-semibold text-sm">Prefer Uniform Scale</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Use the same value for X, Y, Z scale when possible. Non-uniform scale
                distorts normals and can cause lighting artifacts on PBR materials.
              </p>
            </div>
            <div className="rounded-lg border bg-card p-4 space-y-2">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="size-4 text-green-500" />
                <h3 className="font-semibold text-sm">Use Groups for Complex Transforms</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Need orbital motion or pivot points? Nest meshes inside groups. The
                group&apos;s transform applies to all children, giving you layered
                transform control.
              </p>
            </div>
            <div className="rounded-lg border bg-card p-4 space-y-2">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="size-4 text-green-500" />
                <h3 className="font-semibold text-sm">Animate with useFrame, Not State</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                For smooth animation, modify transforms directly in useFrame using refs.
                Avoid setting React state 60 times per second — it causes unnecessary
                re-renders.
              </p>
            </div>
          </div>
        </section>
      </ScrollReveal>
    </div>
  );
}
