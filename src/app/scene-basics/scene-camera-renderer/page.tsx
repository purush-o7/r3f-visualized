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
import { BeforeAfterCode } from "@/components/before-after";
import { CheckCircle2 } from "lucide-react";

const SceneDemo = dynamic(
  () =>
    import("./_components/scene-demo").then((m) => ({
      default: m.SceneDemo,
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
    title: "Forgetting to position the camera",
    subtitle: "The scene renders but the screen is completely black",
    wrongCode: `// Camera is at (0,0,0) — inside the cube!
<Canvas camera={{ position: [0, 0, 0] }}>
  <mesh>
    <boxGeometry />
    <meshStandardMaterial color="orange" />
  </mesh>
</Canvas>`,
    rightCode: `// Move the camera back so it can see the scene
<Canvas camera={{ position: [0, 2, 5] }}>
  <ambientLight />
  <mesh>
    <boxGeometry />
    <meshStandardMaterial color="orange" />
  </mesh>
</Canvas>`,
    filename: "App.tsx",
    explanation:
      "By default the camera starts at the origin (0, 0, 0). If your objects are also at the origin, the camera is literally inside them and you see nothing. Always move the camera back (positive Z) and make sure you have a light source.",
  },
  {
    title: "Not adding a light source",
    subtitle: "Objects exist but appear completely black",
    wrongCode: `<Canvas>
  <mesh>
    <boxGeometry />
    <meshStandardMaterial color="orange" />
  </mesh>
  {/* No lights! Like a room with no windows. */}
</Canvas>`,
    rightCode: `<Canvas>
  <ambientLight intensity={0.5} />
  <directionalLight position={[5, 5, 5]} />
  <mesh>
    <boxGeometry />
    <meshStandardMaterial color="orange" />
  </mesh>
</Canvas>`,
    filename: "App.tsx",
    explanation:
      "MeshStandardMaterial is a physically-based material that requires light to be visible. Without any light, everything appears black. Add an ambientLight for general illumination and a directionalLight for shadows and depth.",
  },
  {
    title: "Enabling preserveDrawingBuffer unnecessarily",
    subtitle: "Performance degrades for no visible benefit",
    wrongCode: `<Canvas gl={{
  antialias: true,
  preserveDrawingBuffer: true,
  alpha: true,
}}>`,
    rightCode: `<Canvas gl={{ antialias: true }}>
  {/* Only enable preserveDrawingBuffer if you
      need to take screenshots of the canvas.
      Only enable alpha for transparent backgrounds. */}`,
    filename: "App.tsx",
    explanation:
      "preserveDrawingBuffer prevents the GPU from discarding the frame buffer after compositing, which costs performance. Only enable it if you need to capture screenshots with canvas.toDataURL(). Start minimal and add features as needed.",
  },
];

export default function SceneCameraRendererPage() {
  return (
    <div className="relative max-w-4xl">
      <div className="absolute -top-10 -left-10 w-72 h-72 bg-gradient-to-br from-teal-500/10 via-emerald-500/10 to-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-3">
          <Badge variant="outline">Scene Basics</Badge>
        </div>
        <h1 className="text-3xl font-bold tracking-tight mb-3">
          Scene, Camera & Renderer
        </h1>
        <p className="text-lg text-muted-foreground">
          Every 3D scene needs three things to work: a place to put your objects,
          a viewpoint to look from, and something to draw the picture on your screen.
          Miss any one of these, and you get a blank canvas.
        </p>
      </div>

      {/* What Could Go Wrong */}
      <WhatCouldGoWrong
        scenario="You just wrote your first React Three Fiber code. You create a Canvas, add a box, and... nothing. The screen is completely black. You check the code three times — everything looks right. What happened?"
        error="Canvas renders but shows only a black screen. No errors in console."
        errorType="Black Screen"
        accentColor="red"
      />

      <Separator className="my-8" />

      {/* Story Analogy */}
      <ConversationalCallout type="story">
        <p>Think of it like making a movie. You need three things:</p>
        <p><strong>A movie set</strong> (the Scene) — where you place your actors, props, and lights.</p>
        <p><strong>A cameraman</strong> (the Camera) — who decides what angle to film from.</p>
        <p><strong>A projector</strong> (the Renderer) — that takes the film and shows it on a screen.</p>
        <p>Miss any one of these, and you get... a black screen. Just like our beginner above. They forgot the lights on set!</p>
      </ConversationalCallout>

      <Separator className="my-8" />

      {/* Mental Model Flow */}
      <SimpleFlow
        steps={[
          { label: "Scene", detail: "The movie set" },
          { label: "Camera", detail: "The cameraman" },
          { label: "Renderer", detail: "The projector" },
          { label: "Screen", detail: "What you see!", status: "success" },
        ]}
        accentColor="blue"
      />

      <Separator className="my-8" />

      {/* Interactive Demo */}
      <SceneDemo />

      <Separator className="my-8" />

      {/* Guided Walkthrough */}
      <ScrollReveal>
        <section className="space-y-4">
          <h2 className="text-2xl font-bold">Hands-On: Your First Scene</h2>
          <p className="text-muted-foreground leading-relaxed">
            The good news? In React Three Fiber, one component sets up
            the Scene, Camera, and Renderer all at once. Let&apos;s build something
            you can see in three quick steps.
          </p>

          <div className="rounded-lg border bg-card p-4 space-y-3">
            <p className="text-sm font-medium">Step 1: Set up the film studio</p>
            <CodeBlock
              code={`<Canvas>\n  {/* Your 3D world starts here */}\n</Canvas>`}
              filename="App.tsx"
            />
            <p className="text-sm text-muted-foreground">
              The Canvas component creates your Scene, Camera, and Renderer automatically.
              Think of it as building the entire film studio with one line. The camera
              defaults to position [0, 0, 5] — five steps back from center stage.
            </p>
          </div>

          <div className="rounded-lg border bg-card p-4 space-y-3">
            <p className="text-sm font-medium">Step 2: Place an actor on set</p>
            <CodeBlock
              code={`<Canvas>\n  <mesh>\n    <boxGeometry />\n    <meshStandardMaterial color="orange" />\n  </mesh>\n</Canvas>`}
              filename="App.tsx"
            />
            <p className="text-sm text-muted-foreground">
              A mesh is like an actor: it has a body (boxGeometry = cube shape)
              and a costume (meshStandardMaterial = orange surface). But wait — the
              screen is still black! Can you guess why?
            </p>
          </div>

          <div className="rounded-lg border bg-card p-4 space-y-3">
            <p className="text-sm font-medium">Step 3: Turn on the lights!</p>
            <CodeBlock
              code={`<Canvas>\n  <ambientLight intensity={0.5} />\n  <directionalLight position={[5, 5, 5]} />\n  <mesh>\n    <boxGeometry />\n    <meshStandardMaterial color="orange" />\n  </mesh>\n</Canvas>`}
              filename="App.tsx"
            />
            <p className="text-sm text-muted-foreground">
              Now your orange cube is visible! The ambientLight is like turning on the room
              lights — everything gets evenly lit. The directionalLight adds sunlight from a
              direction, giving your cube depth and shadows. Try changing &quot;orange&quot; to &quot;hotpink&quot; and see
              what happens.
            </p>
          </div>

          <BeforeAfterCode
            beforeCode={`<Canvas>\n  <mesh>\n    <boxGeometry />\n    <meshBasicMaterial color="orange" />\n  </mesh>\n</Canvas>`}
            afterCode={`<Canvas>\n  <ambientLight intensity={0.5} />\n  <directionalLight position={[5, 5, 5]} />\n  <mesh>\n    <boxGeometry />\n    <meshStandardMaterial color="orange" />\n  </mesh>\n</Canvas>`}
            beforeLabel="Without Lighting"
            afterLabel="With Lighting"
            filename="Scene.tsx"
            description={{
              before: "MeshBasicMaterial doesn't need light — but looks flat with no depth or shading.",
              after: "MeshStandardMaterial reacts to light — gives the cube realistic depth and shadows.",
            }}
          />
        </section>
      </ScrollReveal>

      <Separator className="my-8" />

      {/* What You Just Learned */}
      <WhatYouJustLearned
        points={[
          "A 3D scene needs three things: a Scene (the set), a Camera (the viewpoint), and a Renderer (the screen output).",
          "In R3F, the <Canvas> component creates all three automatically — no manual setup needed.",
          "Most materials need at least one light source to be visible. No light = black screen.",
          "The camera defaults to position [0, 0, 5], meaning it looks at the origin from 5 units back.",
        ]}
      />

      <Separator className="my-8" />

      {/* Thought-Provoking Question */}
      <ConversationalCallout type="question">
        <p>
          If the Camera is like a cameraman, what happens if you move the cameraman
          inside the box? Can they see anything? What if you point the camera the wrong way?
        </p>
      </ConversationalCallout>

      <Separator className="my-8" />

      {/* Aha Moment */}
      <AhaMoment
        setup="You might think the Renderer does the 'hard work' of 3D graphics. But here's something most beginners don't realize..."
        reveal="In R3F, you almost never interact with the Renderer directly. The <Canvas> handles it for you. It automatically sets the pixel ratio, resizes when the window changes, and manages the render loop. The real power of R3F is that it turns Three.js's imperative setup into declarative React components — you describe WHAT you want, not HOW to build it."
      />

      <Separator className="my-8" />

      {/* Mental Model Challenge */}
      <MentalModelChallenge
        question="You create a Canvas with a mesh inside, but the screen is black. What's most likely missing?"
        options={[
          { label: "A renderer", correct: false, explanation: "R3F creates the renderer automatically inside Canvas. You never need to set it up manually." },
          { label: "A light source", correct: true, explanation: "Bingo! MeshStandardMaterial needs light to be visible. It's like a room with no windows — everything exists, but you can't see it." },
          { label: "A camera", correct: false, explanation: "Canvas creates a default PerspectiveCamera for you at position [0, 0, 5]." },
          { label: "The color prop", correct: false, explanation: "Without a color, the material defaults to white — but you'd still need light to see it." },
        ]}
        hint="Think about what happens in a real room when the lights are off..."
        answer="You need at least one light source! Add <ambientLight /> to light up the entire scene evenly, or <directionalLight /> for sunlight-like directional lighting. Most materials in Three.js are physically-based, which means they behave like real surfaces — no light, no visibility."
      />

      <Separator className="my-8" />

      {/* Try This Challenges */}
      <ScrollReveal>
        <TryThisList challenges={[
          {
            challenge: "Change the camera position to [0, 10, 0] — what do you see?",
            hint: "Think about where the camera is looking from when it's directly above the scene.",
            solution: "You're looking straight down at the top of the cube. It appears as a flat square because you're viewing it from directly above.",
            difficulty: "beginner",
          },
          {
            challenge: "Add a second mesh next to the first one",
            hint: "Use the position prop to offset the new mesh, e.g. position={[2, 0, 0]}.",
            solution: "Add another <mesh position={[2, 0, 0]}> with its own geometry and material. Both cubes share the same lights and camera automatically.",
            difficulty: "beginner",
          },
          {
            challenge: "Remove the ambientLight — what happens?",
            hint: "Think about which sides of the cube are facing the directional light and which are in shadow.",
            solution: "Without ambient light, only the sides directly hit by the directional light are visible. The shadowed sides become completely black because there's no fill light.",
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
                <h3 className="font-semibold text-sm">Cap the Pixel Ratio</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                R3F caps at 2 by default, which is great. High-DPI screens (3x) render
                9x the pixels — a huge performance hit with barely any visual difference.
              </p>
            </div>
            <div className="rounded-lg border bg-card p-4 space-y-2">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="size-4 text-green-500" />
                <h3 className="font-semibold text-sm">Keep Objects Near the Origin</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Center your content around (0, 0, 0). Objects at extreme positions like
                (100000, 0, 0) will visibly jitter due to floating-point precision limits.
              </p>
            </div>
            <div className="rounded-lg border bg-card p-4 space-y-2">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="size-4 text-green-500" />
                <h3 className="font-semibold text-sm">Tight Near/Far Planes</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                The camera has a near and far clipping plane — like minimum and maximum focus
                distance. Keep them as tight as possible. A near of 0.001 and far of 100000
                wastes precision and causes visual glitches.
              </p>
            </div>
            <div className="rounded-lg border bg-card p-4 space-y-2">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="size-4 text-green-500" />
                <h3 className="font-semibold text-sm">Start Minimal</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Don&apos;t enable alpha, preserveDrawingBuffer, or stencil unless you need them.
                Each adds overhead. Start with just antialias: true and add features as required.
              </p>
            </div>
          </div>
        </section>
      </ScrollReveal>
    </div>
  );
}
