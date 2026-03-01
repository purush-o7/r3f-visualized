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
    import("./_components/canvas-demo").then((m) => ({
      default: m.CanvasDemo,
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
    title: "Canvas with no parent height",
    subtitle: "The canvas collapses to 0px",
    wrongCode: `// The Canvas has no height constraint
function App() {
  return (
    <div>
      <Canvas>
        <mesh />
      </Canvas>
    </div>
  )
}`,
    rightCode: `// Give the parent an explicit height
function App() {
  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <Canvas>
        <mesh />
      </Canvas>
    </div>
  )
}`,
    filename: "App.tsx",
    explanation:
      "Canvas fills its parent container. If the parent div has no height, the canvas will be 0px tall and invisible. Always give the parent a defined height via CSS, such as h-screen, 100vh, or a fixed pixel value.",
  },
  {
    title: "Using R3F hooks outside Canvas",
    subtitle: "useFrame, useThree only work inside Canvas",
    wrongCode: `function App() {
  // This is OUTSIDE the Canvas tree!
  useFrame(() => { /* ... */ })

  return (
    <Canvas>
      <mesh />
    </Canvas>
  )
}`,
    rightCode: `function AnimatedBox() {
  // Hooks go in components INSIDE Canvas
  useFrame((_, delta) => { /* ... */ })
  return <mesh />
}

function App() {
  return (
    <Canvas>
      <AnimatedBox />
    </Canvas>
  )
}`,
    filename: "App.tsx",
    explanation:
      "R3F hooks like useFrame and useThree depend on the internal context that Canvas provides. Any component calling these hooks must be a descendant of <Canvas>.",
  },
  {
    title: "Forgetting lights with Standard materials",
    subtitle: "Scene appears completely black",
    wrongCode: `<Canvas>
  {/* No lights! */}
  <mesh>
    <boxGeometry />
    <meshStandardMaterial color="orange" />
  </mesh>
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
      "MeshStandardMaterial simulates real lighting. Without light sources, everything renders black. Add at least an ambientLight plus a directionalLight.",
  },
];

export default function CanvasComponentPage() {
  return (
    <div className="max-w-4xl ambient-canvas">
      {/* 1. Title + Badge + Intro */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-3">
          <Badge variant="outline">Canvas & Setup</Badge>
          <Badge variant="secondary" className="text-[10px]">
            Foundation
          </Badge>
        </div>
        <h1 className="text-3xl font-bold tracking-tight mb-3">
          Canvas Component
        </h1>
        <p className="text-lg text-muted-foreground leading-relaxed">
          Before you can show anything in 3D, you need a place to put it.
          The <code>&lt;Canvas&gt;</code> component is that place. Think of
          your React webpage as a wall -- the Canvas is a picture frame you
          hang on it. Everything 3D lives inside that frame. Outside? Normal
          React. Inside? A whole 3D universe.
        </p>
      </div>

      {/* 2. WhatCouldGoWrong */}
      <ScrollReveal>
        <WhatCouldGoWrong
          scenario={`You write your first <Canvas> with a beautiful orange box inside. You save, refresh the browser, and... nothing. A blank white page stares back at you. No errors in the console. The box exists in code, but it is invisible.`}
          error={`The <Canvas> rendered, but its parent <div> has height: auto (which is 0px).
Your entire 3D scene is there -- just squished into zero pixels.`}
          errorType="Invisible"
        />
      </ScrollReveal>

      {/* 3. ConversationalCallout - Story Analogy */}
      <ScrollReveal>
        <ConversationalCallout type="story">
          <p>
            Imagine hanging a picture frame on your wall. The wall is your
            React webpage. The frame is the <code>&lt;Canvas&gt;</code>.
            The picture inside is your 3D world -- meshes, lights, cameras,
            everything.
          </p>
          <p>
            But here is the thing: if you do not give the frame a size,
            it collapses flat. No frame, no picture. That is why the Canvas
            needs its parent container to have a width and height.
          </p>
        </ConversationalCallout>
      </ScrollReveal>

      {/* 4. SimpleFlow - Mental Model */}
      <ScrollReveal>
        <SimpleFlow
          steps={[
            { label: "<Canvas>", detail: "You write this in JSX" },
            { label: "Scene + Camera + Renderer", detail: "R3F creates these for you" },
            { label: "Render Loop", detail: "60fps animation automatically" },
            { label: "Pixels on Screen", detail: "Your 3D world appears!" },
          ]}
        />
      </ScrollReveal>

      <Separator className="my-8" />

      {/* 5. Interactive Demo */}
      <Demo />

      <Separator className="my-8" />

      {/* 6. Guided Walkthrough */}
      <ScrollReveal>
        <section className="space-y-4">
          <h2 className="text-2xl font-bold">Building Your First Canvas</h2>
          <p className="text-muted-foreground leading-relaxed">
            Let us set up a Canvas step by step. It is simpler than you
            think -- three steps and you have a 3D scene running.
          </p>

          {/* Step 1 */}
          <div className="rounded-lg border bg-card p-4 space-y-3">
            <div className="flex items-center gap-2">
              <Badge variant="secondary">Step 1</Badge>
              <span className="font-semibold text-sm">
                Give the parent a size
              </span>
            </div>
            <p className="text-sm text-muted-foreground">
              The Canvas fills whatever container it is inside. No container
              size means no visible canvas. A full-screen scene? Just make
              the parent fill the viewport.
            </p>
            <CodeBlock
              code={`<div style={{ width: '100vw', height: '100vh' }}>
  <Canvas>
    {/* 3D stuff goes here */}
  </Canvas>
</div>`}
              filename="App.tsx"
            />
            <p className="text-sm text-muted-foreground">
              That <code>div</code> is now the size of the entire browser
              window, and the Canvas stretches to fill it.
            </p>
          </div>

          {/* Step 2 */}
          <div className="rounded-lg border bg-card p-4 space-y-3">
            <div className="flex items-center gap-2">
              <Badge variant="secondary">Step 2</Badge>
              <span className="font-semibold text-sm">
                Add lights so you can see things
              </span>
            </div>
            <p className="text-sm text-muted-foreground">
              Most materials need light to be visible, just like real life.
              No light in a room? Everything is black.
            </p>
            <CodeBlock
              code={`<Canvas>
  <ambientLight intensity={0.5} />
  <directionalLight position={[5, 5, 5]} />
</Canvas>`}
              filename="App.tsx"
            />
            <p className="text-sm text-muted-foreground">
              <code>ambientLight</code> is like opening the curtains -- soft
              light everywhere. <code>directionalLight</code> is like the sun
              shining from a specific direction.
            </p>
          </div>

          {/* Step 3 */}
          <div className="rounded-lg border bg-card p-4 space-y-3">
            <div className="flex items-center gap-2">
              <Badge variant="secondary">Step 3</Badge>
              <span className="font-semibold text-sm">
                Drop in a 3D object
              </span>
            </div>
            <p className="text-sm text-muted-foreground">
              A mesh is a visible 3D thing. It needs a shape (geometry) and
              a surface look (material). Together they make something you
              can actually see.
            </p>
            <CodeBlock
              code={`<Canvas>
  <ambientLight intensity={0.5} />
  <directionalLight position={[5, 5, 5]} />
  <mesh>
    <boxGeometry args={[1, 1, 1]} />
    <meshStandardMaterial color="orange" />
  </mesh>
</Canvas>`}
              filename="App.tsx"
            />
            <p className="text-sm text-muted-foreground">
              That is it. A lit, orange box floating in 3D space. The Canvas
              gave you a camera at position [0, 0, 5] looking at the origin,
              so the box is right in view.
            </p>
          </div>
        </section>
      </ScrollReveal>

      <Separator className="my-8" />

      {/* 7. WhatYouJustLearned */}
      <ScrollReveal>
        <WhatYouJustLearned
          points={[
            "Canvas is the boundary between normal React and the 3D world",
            "It automatically creates a Scene, Camera, and Renderer for you",
            "Canvas fills its parent, so the parent must have a defined size",
            "Lights are needed for most materials to be visible",
            "R3F hooks (useFrame, useThree) only work inside Canvas",
          ]}
        />
      </ScrollReveal>

      <Separator className="my-8" />

      {/* 8. ConversationalCallout - Thought Question */}
      <ScrollReveal>
        <ConversationalCallout type="question">
          <p>
            If Canvas creates its own camera automatically, what happens when
            you want two different camera angles? Can you have two Canvases
            on the same page?
          </p>
          <p>
            Yes, you can. Each Canvas is a completely independent 3D world
            with its own camera, scene, and renderer. Some apps use multiple
            canvases for split-screen views or picture-in-picture effects.
          </p>
        </ConversationalCallout>
      </ScrollReveal>

      <Separator className="my-8" />

      {/* 9. AhaMoment */}
      <ScrollReveal>
        <AhaMoment
          setup="Canvas seems like a lot of magic. It creates a scene, camera, renderer, handles resizing, runs a render loop... What is actually happening behind the curtain?"
          reveal="Canvas is a React component that wraps all the tedious Three.js boilerplate. Without R3F, you would manually create a WebGLRenderer, set up a PerspectiveCamera, build a Scene, write a requestAnimationFrame loop, handle window resize events, and manage pixel ratios. Canvas does ALL of that in a single JSX tag. That is the entire point of React Three Fiber: declarative 3D without the plumbing."
        />
      </ScrollReveal>

      <Separator className="my-8" />

      {/* 10. MentalModelChallenge */}
      <ScrollReveal>
        <MentalModelChallenge
          question="You render a <Canvas> inside a <div> that has no CSS height. What will you see on screen?"
          options={[
            {
              label: "A black rectangle with default dimensions",
              correct: false,
              explanation:
                "Canvas does not have default dimensions. It inherits size from its parent.",
            },
            {
              label: "An error in the console",
              correct: false,
              explanation:
                "No error is thrown. The Canvas renders successfully -- it is just 0 pixels tall.",
            },
            {
              label: "Nothing -- the Canvas is 0px tall",
              correct: true,
              explanation:
                "Exactly right. The parent div has height: auto, which with no content height collapses to 0. Canvas fills its parent, so it becomes invisible.",
            },
            {
              label: "A full-screen 3D scene",
              correct: false,
              explanation:
                "Canvas does not default to full-screen. It fills its parent, and a default div has 0 height.",
            },
          ]}
          answer="The Canvas collapses to 0px tall because it fills its parent container. A div with no explicit height and no content defaults to height: 0. Always give the Canvas wrapper a defined height."
        />
      </ScrollReveal>

      <Separator className="my-8" />

      {/* Try These Challenges */}
      <ScrollReveal>
        <TryThisList challenges={[
          { challenge: "Remove the parent div height -- what happens?", hint: "The Canvas fills its parent container. What height does a div have by default?", solution: "The Canvas collapses to 0px tall and becomes invisible. A div with no explicit height defaults to height: auto, which is 0 when it has no content height. Always give the Canvas wrapper a defined height.", difficulty: "beginner" },
          { challenge: "Add dpr={[1, 2]} to the Canvas -- does it look sharper?", hint: "dpr stands for device pixel ratio. On Retina displays, the default ratio can be 2 or 3.", solution: "On high-DPI screens (Retina), capping dpr at [1, 2] renders at up to 2x resolution, making edges look sharper. Without it, the default may render at the full device ratio (e.g. 3x), which is barely noticeable but costs significantly more GPU power.", difficulty: "beginner" },
          { challenge: "Set frameloop='demand' and drag to rotate -- what changes?", hint: "In demand mode, the Canvas only re-renders when something calls invalidate().", solution: "With frameloop='demand', the scene only renders when explicitly told to (via invalidate()). If you have OrbitControls with makeDefault, dragging still works because the controls call invalidate internally. But any useFrame animations will freeze because the loop is no longer running continuously.", difficulty: "intermediate" },
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
                <h3 className="font-semibold text-sm">Set dpr limits</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Use <code>dpr={"{[1, 2]}"}</code> to cap the pixel ratio. On
                Retina displays, without this your GPU works 4x harder for
                barely noticeable quality gains.
              </p>
            </div>
            <div className="rounded-lg border bg-card p-4 space-y-2">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="size-4 text-green-500" />
                <h3 className="font-semibold text-sm">
                  Use demand mode for static scenes
                </h3>
              </div>
              <p className="text-sm text-muted-foreground">
                If nothing is animating, set{" "}
                <code>frameloop=&quot;demand&quot;</code> so the GPU only
                renders when something changes. Your laptop fan will thank you.
              </p>
            </div>
            <div className="rounded-lg border bg-card p-4 space-y-2">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="size-4 text-green-500" />
                <h3 className="font-semibold text-sm">
                  Enable shadows explicitly
                </h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Shadows are off by default (they are expensive). Add the{" "}
                <code>shadows</code> prop only when needed, and mark meshes
                with <code>castShadow</code> and <code>receiveShadow</code>.
              </p>
            </div>
            <div className="rounded-lg border bg-card p-4 space-y-2">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="size-4 text-green-500" />
                <h3 className="font-semibold text-sm">
                  Keep the Canvas wrapper sized
                </h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Canvas fills its parent. Always ensure the parent has explicit
                dimensions. A common pattern:{" "}
                <code>className=&quot;h-screen w-full&quot;</code>.
              </p>
            </div>
          </div>
        </section>
      </ScrollReveal>
    </div>
  );
}
