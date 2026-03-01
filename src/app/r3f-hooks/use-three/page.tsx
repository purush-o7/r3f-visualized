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

const ViewportDemo = dynamic(
  () =>
    import("./_components/viewport-demo").then((m) => ({
      default: m.ViewportDemo,
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
    title: "Not using a selector (subscribing to everything)",
    subtitle: "Component re-renders on every mouse move, resize, and clock tick",
    wrongCode: `function MyComponent() {
  // Subscribes to the ENTIRE state object
  const state = useThree()
  const { camera } = state
  // Re-renders when ANYTHING changes!
}`,
    rightCode: `function MyComponent() {
  // Only subscribes to the camera
  const camera = useThree((s) => s.camera)
  // Only re-renders when camera ref changes
}`,
    filename: "MyComponent.tsx",
    explanation:
      "Calling useThree() with no arguments subscribes to the entire R3F state store. Every mouse movement, every resize, every clock tick triggers a re-render. Passing a selector like (s) => s.camera uses zustand's shallow equality check to only re-render when that specific value changes.",
  },
  {
    title: "Confusing size (pixels) with viewport (3D units)",
    subtitle: "Your 'fullscreen' plane is 1920 Three.js units wide",
    wrongCode: `const { size } = useThree()
// size.width = 1920 (pixels!)
// This plane is 1920 Three.js units wide!
<planeGeometry args={[size.width, size.height]} />`,
    rightCode: `const viewport = useThree((s) => s.viewport)
// viewport.width = ~11.5 (Three.js units)
// Perfectly fills the screen
<planeGeometry args={[viewport.width, viewport.height]} />`,
    filename: "FullScreenPlane.tsx",
    explanation:
      "size gives you CSS pixels (e.g. 1920x1080). viewport gives you Three.js world units visible at the camera's current distance (e.g. 11.5x6.5). When sizing or positioning 3D objects, you almost always want viewport. Use size only for responsive breakpoints.",
  },
  {
    title: "Calling invalidate() without demand mode",
    subtitle: "invalidate() does nothing with the default always-rendering loop",
    wrongCode: `// Default frameloop="always"
<Canvas>
  <Scene />
</Canvas>

function Scene() {
  const invalidate = useThree((s) => s.invalidate)
  // This does nothing -- canvas already renders every frame
  invalidate()
}`,
    rightCode: `// On-demand rendering
<Canvas frameloop="demand">
  <Scene />
</Canvas>

function Scene() {
  const invalidate = useThree((s) => s.invalidate)
  // NOW this triggers exactly one re-render
  invalidate()
}`,
    filename: "OnDemand.tsx",
    explanation:
      "invalidate() tells R3F to render the next frame. With the default frameloop='always', R3F already renders every frame continuously, so the call has no effect. Switch to frameloop='demand' for static scenes that only update on interaction. This saves significant GPU and battery.",
  },
];

export default function UseThreePage() {
  return (
    <div className="relative max-w-4xl">
      <div className="absolute -top-10 -left-10 w-72 h-72 bg-gradient-to-br from-teal-500/10 via-emerald-500/10 to-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
      {/* ── 1. Title + Badge + Intro ── */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-3">
          <Badge variant="outline">R3F Hooks</Badge>
        </div>
        <h1 className="text-3xl font-bold tracking-tight mb-3">useThree</h1>
        <p className="text-lg text-muted-foreground">
          Sometimes you need more than just animating a mesh. You need the
          camera. The renderer. The viewport size. The mouse position. The
          entire internal state of your 3D scene.{" "}
          <code>useThree</code> is the hook that gives you the keys to
          everything.
        </p>
      </div>

      {/* ── 2. WhatCouldGoWrong ── */}
      <WhatCouldGoWrong
        scenario={`You call useThree() with no arguments to grab the camera. It works, but now your component re-renders on every mouse movement, every window resize, every single frame tick. Your FPS drops and you can't figure out why.`}
        error={`React DevTools: "MyComponent" rendered 847 times in 10 seconds.
Profiler shows useThree() causing re-renders on every pointer move.
Cause: subscribing to entire state store without a selector.`}
        errorType="Performance"
      />

      <Separator className="my-8" />

      {/* ── 3. Story Analogy ── */}
      <ScrollReveal>
        <ConversationalCallout type="story">
          <p>
            Imagine walking into a film studio&apos;s control room. There are
            monitors showing every camera angle, buttons for every light, dials
            for resolution and frame rate, and a readout of mouse position
            relative to the set.
          </p>
          <p>
            useThree gives you access to this control room. You can read any
            monitor, press any button, twist any dial. But you do not want a
            notification every time any dial twitches -- you want to subscribe
            to only the monitors you care about. That is what selectors do.
          </p>
        </ConversationalCallout>
      </ScrollReveal>

      <Separator className="my-8" />

      {/* ── 4. SimpleFlow ── */}
      <ScrollReveal>
        <h2 className="text-2xl font-bold mb-4">What Lives in the State</h2>
        <SimpleFlow
          steps={[
            { label: "gl", detail: "The WebGL renderer" },
            { label: "scene", detail: "The root scene object" },
            { label: "camera", detail: "Active camera" },
            { label: "viewport", detail: "Visible area in 3D units" },
            { label: "pointer", detail: "Normalized mouse position" },
            { label: "clock", detail: "Elapsed time + delta" },
          ]}
        />
      </ScrollReveal>

      <Separator className="my-8" />

      {/* ── 5. Demo ── */}
      <ScrollReveal>
        <h2 className="text-2xl font-bold mb-4">See It In Action</h2>
        <p className="text-muted-foreground mb-4">
          This demo uses useThree to read viewport dimensions and adapt the
          scene layout in real time. Try resizing your browser window.
        </p>
      </ScrollReveal>
      <ViewportDemo />

      <Separator className="my-8" />

      {/* ── 6. Guided Walkthrough ── */}
      <ScrollReveal>
        <h2 className="text-2xl font-bold mb-4">Building It Step by Step</h2>

        {/* Step 1 */}
        <div className="rounded-lg border bg-card p-4 mb-4">
          <p className="text-sm font-semibold mb-2">
            Step 1 -- Select only what you need
          </p>
          <p className="text-sm text-muted-foreground mb-3">
            Always pass a selector function. This tells R3F to only re-render
            your component when that specific value changes -- not when anything
            in the entire state store changes.
          </p>
          <CodeBlock
            code={`const camera = useThree((s) => s.camera)
const viewport = useThree((s) => s.viewport)
const gl = useThree((s) => s.gl)`}
            filename="Selectors.tsx"
          />
          <p className="text-sm text-muted-foreground mt-2">
            Each selector creates a targeted subscription. Your component stays
            quiet until its specific value changes.
          </p>
        </div>

        {/* Step 2 */}
        <div className="rounded-lg border bg-card p-4 mb-4">
          <p className="text-sm font-semibold mb-2">
            Step 2 -- Use viewport for 3D layout
          </p>
          <p className="text-sm text-muted-foreground mb-3">
            <code>viewport.width</code> and <code>viewport.height</code> tell
            you how much of the 3D world is visible at the camera&apos;s
            distance. Use these to position objects edge-to-edge.
          </p>
          <CodeBlock
            code={`function EdgeToEdgePlane() {
  const { width, height } = useThree((s) => s.viewport)

  return (
    <mesh>
      <planeGeometry args={[width, height]} />
      <meshBasicMaterial color="#1a1a2e" />
    </mesh>
  )
}`}
            filename="EdgeToEdgePlane.tsx"
          />
          <p className="text-sm text-muted-foreground mt-2">
            The plane now fills the entire camera view perfectly, regardless of
            window size or aspect ratio.
          </p>
        </div>

        {/* Step 3 */}
        <div className="rounded-lg border bg-card p-4 mb-4">
          <p className="text-sm font-semibold mb-2">
            Step 3 -- Use size for responsive breakpoints
          </p>
          <p className="text-sm text-muted-foreground mb-3">
            <code>size</code> gives you the canvas dimensions in CSS pixels.
            Use it for mobile vs. desktop layout decisions, not for positioning
            3D objects.
          </p>
          <CodeBlock
            code={`function ResponsiveScene() {
  const size = useThree((s) => s.size)
  const isMobile = size.width < 768

  return (
    <mesh position={[isMobile ? 0 : -2, 0, 0]}>
      <boxGeometry />
      <meshStandardMaterial />
    </mesh>
  )
}`}
            filename="ResponsiveScene.tsx"
          />
          <p className="text-sm text-muted-foreground mt-2">
            <code>size</code> = pixels (1920x1080).{" "}
            <code>viewport</code> = Three.js units (~11x6). Use the right one
            for the right job.
          </p>
        </div>
      </ScrollReveal>

      <Separator className="my-8" />

      {/* ── 7. WhatYouJustLearned ── */}
      <WhatYouJustLearned
        points={[
          "useThree gives you access to the entire R3F internal state (renderer, camera, scene, etc.)",
          "Always pass a selector to avoid unnecessary re-renders",
          "viewport gives 3D world units -- use it for positioning 3D objects",
          "size gives CSS pixels -- use it for responsive breakpoints",
          "invalidate() only works with frameloop='demand' for on-demand rendering",
        ]}
      />

      <Separator className="my-8" />

      {/* ── 8. Question Callout ── */}
      <ScrollReveal>
        <ConversationalCallout type="question">
          <p>
            Can you use useThree outside of a Canvas? No. useThree accesses an
            internal context that only exists inside the Canvas component tree.
            If you need R3F state in a regular React component outside Canvas,
            use R3F&apos;s <code>createRoot</code> API and manage the
            connection yourself.
          </p>
        </ConversationalCallout>
      </ScrollReveal>

      <Separator className="my-8" />

      {/* ── 9. AhaMoment ── */}
      <AhaMoment
        setup="Why does useThree with no selector cause so many re-renders?"
        reveal="Under the hood, useThree is powered by zustand -- a tiny state management library. When you call useThree() with no selector, you subscribe to the entire store. The store updates when the pointer moves, when the window resizes, when the clock ticks -- basically on every frame. With a selector like (s) => s.camera, zustand only notifies you when that specific reference changes, which might be never after the initial render."
      />

      <Separator className="my-8" />

      {/* ── 10. MentalModelChallenge ── */}
      <MentalModelChallenge
        question="You want to make a 3D plane that perfectly fills the screen. Which value do you use for its width and height?"
        options={[
          {
            label: "size.width and size.height",
            correct: false,
            explanation:
              "These are in CSS pixels (e.g. 1920x1080). Your plane would be 1920 Three.js units wide -- way too big.",
          },
          {
            label: "viewport.width and viewport.height",
            correct: true,
            explanation:
              "These are in Three.js world units at the camera's distance. A plane with these dimensions fills the view exactly.",
          },
          {
            label: "window.innerWidth and window.innerHeight",
            correct: false,
            explanation:
              "These are DOM pixel values and don't account for DPR or camera perspective. Also, they bypass R3F's reactive system.",
          },
        ]}
        answer="Always use viewport for sizing 3D objects. It converts the camera's visible area into Three.js world units, accounting for camera distance, FOV, and aspect ratio. size is only useful for responsive breakpoint checks (e.g. 'is this a phone?')."
      />

      <Separator className="my-8" />

      {/* Try These Challenges */}
      <ScrollReveal>
        <TryThisList challenges={[
          { challenge: "Toggle showCorners off -- where do the corner objects go?", hint: "The corner objects are positioned using viewport dimensions. Toggling them off removes them from the scene.", solution: "The corner objects disappear from the scene because they are conditionally rendered. They use viewport.width and viewport.height to calculate their positions at the screen edges. This demonstrates how useThree's viewport values enable responsive 3D layouts that adapt to the camera's visible area.", difficulty: "beginner" },
          { challenge: "Set centerScale to 3 -- giant center object!", hint: "Scale multiplies the object's size uniformly in all directions.", solution: "The center object becomes 3x its normal size. Since it uses viewport-relative positioning, it stays centered regardless of size. If it gets large enough, it may overlap with corner objects -- this shows why viewport-aware layout is important for avoiding visual clutter.", difficulty: "beginner" },
          { challenge: "Resize your browser window -- watch the viewport values update.", hint: "viewport.width and viewport.height change when the canvas resizes. Objects positioned with these values reposition automatically.", solution: "As you resize the browser, the viewport dimensions change and any objects positioned using viewport values automatically reposition. Corner objects stay in the corners, and edge-to-edge planes resize to fill the view. This reactive layout is powered by useThree's selector subscription system -- components re-render only when the viewport changes.", difficulty: "intermediate" },
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
                <h3 className="font-semibold text-sm">Always use selectors</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                <code>useThree(s =&gt; s.camera)</code> prevents re-renders
                from unrelated state changes. Never call useThree() bare.
              </p>
            </div>
            <div className="rounded-lg border bg-card p-4 space-y-2">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="size-4 text-green-500" />
                <h3 className="font-semibold text-sm">
                  viewport for 3D, size for 2D
                </h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Use <code>viewport</code> (Three.js units) for 3D positioning.
                Use <code>size</code> (pixels) for responsive breakpoints.
              </p>
            </div>
            <div className="rounded-lg border bg-card p-4 space-y-2">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="size-4 text-green-500" />
                <h3 className="font-semibold text-sm">
                  Demand mode for static scenes
                </h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Use <code>frameloop=&quot;demand&quot;</code> with{" "}
                <code>invalidate()</code> for scenes that only change on user
                interaction. Saves GPU and battery.
              </p>
            </div>
            <div className="rounded-lg border bg-card p-4 space-y-2">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="size-4 text-green-500" />
                <h3 className="font-semibold text-sm">
                  Use set() sparingly
                </h3>
              </div>
              <p className="text-sm text-muted-foreground">
                <code>state.set()</code> overrides R3F internals. Only use it
                when you need a custom camera or raycaster. The defaults work
                for most cases.
              </p>
            </div>
          </div>
        </section>
      </ScrollReveal>
    </div>
  );
}
