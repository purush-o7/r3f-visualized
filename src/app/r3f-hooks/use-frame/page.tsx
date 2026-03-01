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

const FrameDemo = dynamic(
  () =>
    import("./_components/frame-demo").then((m) => ({
      default: m.FrameDemo,
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
    title: "Using setState inside useFrame",
    subtitle: "Triggers 60 React re-renders per second",
    wrongCode: `function SpinningBox() {
  const [rotation, setRotation] = useState(0)

  useFrame(() => {
    setRotation(r => r + 0.01) // React re-render!
  })

  return <mesh rotation-y={rotation}>...</mesh>
}`,
    rightCode: `function SpinningBox() {
  const meshRef = useRef<THREE.Mesh>(null)

  useFrame((state, delta) => {
    meshRef.current.rotation.y += delta // direct mutation
  })

  return <mesh ref={meshRef}>...</mesh>
}`,
    filename: "SpinningBox.tsx",
    explanation:
      "Calling setState inside useFrame triggers a full React reconciliation cycle on every frame. At 60fps that is 60 re-renders per second -- your app will stutter, lag, and eventually freeze. Instead, mutate Three.js objects directly through refs. R3F renders from the scene graph, not from React state.",
  },
  {
    title: "Allocating objects inside useFrame",
    subtitle: "Creates garbage collection pressure every frame",
    wrongCode: `useFrame((state) => {
  // NEW Vector3 every frame = 60 allocations/sec
  const target = new THREE.Vector3(
    state.pointer.x * 3, state.pointer.y * 2, 0
  )
  meshRef.current.position.lerp(target, 0.1)
})`,
    rightCode: `const targetVec = new THREE.Vector3() // allocate once

useFrame((state) => {
  targetVec.set(state.pointer.x * 3, state.pointer.y * 2, 0)
  meshRef.current.position.lerp(targetVec, 0.1)
})`,
    filename: "FollowMouse.tsx",
    explanation:
      "Creating new objects inside useFrame means 60+ allocations per second. The JavaScript garbage collector eventually pauses your app to clean them up, causing unpredictable frame stutters. Allocate once outside the loop and reuse with .set() or .copy().",
  },
  {
    title: "Not using delta for frame-rate independence",
    subtitle: "Animation runs 2x faster on 120Hz monitors",
    wrongCode: `useFrame(() => {
  // 60Hz: 0.01 * 60 = 0.6 rad/sec
  // 120Hz: 0.01 * 120 = 1.2 rad/sec (2x faster!)
  meshRef.current.rotation.y += 0.01
})`,
    rightCode: `useFrame((state, delta) => {
  // Always 1 radian per second, regardless of Hz
  meshRef.current.rotation.y += 1 * delta
})`,
    filename: "RotatingMesh.tsx",
    explanation:
      "The delta parameter is the elapsed time in seconds since the last frame. Without it, a 120Hz monitor calls useFrame twice as often as a 60Hz monitor, making animations run 2x faster. Always multiply movement by delta for consistent behavior on all devices.",
  },
];

export default function UseFramePage() {
  return (
    <div className="max-w-4xl ambient-canvas">
      {/* ── 1. Title + Badge + Intro ── */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-3">
          <Badge variant="outline">R3F Hooks</Badge>
        </div>
        <h1 className="text-3xl font-bold tracking-tight mb-3">useFrame</h1>
        <p className="text-lg text-muted-foreground">
          Static 3D scenes are nice, but animation is where the magic happens.
          The <code>useFrame</code> hook is how you bring your scene to life --
          it calls your function on every single rendered frame, roughly 60
          times per second, giving you the power to rotate, move, scale, or
          change anything in real time.
        </p>
      </div>

      {/* ── 2. WhatCouldGoWrong ── */}
      <WhatCouldGoWrong
        scenario={`You try to animate a spinning cube by storing rotation in React state and calling setState inside useFrame. The cube spins... but everything else on the page freezes, your devtools show 60 re-renders per second, and your browser tab starts begging for mercy.`}
        error={`Warning: Maximum update depth exceeded. This can happen when a
component calls setState inside useFrame.

React rendered 60 times in the last second.
Consider using refs for per-frame mutations.`}
        errorType="Performance"
      />

      <Separator className="my-8" />

      {/* ── 3. Story Analogy ── */}
      <ScrollReveal>
        <ConversationalCallout type="story">
          <p>
            Think of useFrame as your scene&apos;s heartbeat. It beats roughly
            60 times per second. On each beat, you get a tiny window of time to
            nudge objects -- rotate a cube a fraction of a degree, slide a
            sphere a pixel to the left, pulse a light a shade brighter.
          </p>
          <p>
            Stop the heartbeat and the scene freezes. Overload it with heavy
            work and the heartbeat slows down, causing visible stutter. Keep
            each beat lean and fast, and your scene feels alive and buttery
            smooth.
          </p>
        </ConversationalCallout>
      </ScrollReveal>

      <Separator className="my-8" />

      {/* ── 4. SimpleFlow ── */}
      <ScrollReveal>
        <h2 className="text-2xl font-bold mb-4">The Animation Loop</h2>
        <SimpleFlow
          steps={[
            { label: "Frame starts", detail: "Browser says it is time to paint" },
            { label: "useFrame fires", detail: "Your callback runs with (state, delta)" },
            { label: "Mutate via refs", detail: "Rotate, move, scale objects directly" },
            { label: "R3F renders", detail: "Scene graph is drawn to screen" },
            { label: "Repeat ~60x/sec", detail: "Next frame begins", status: "success" },
          ]}
        />
      </ScrollReveal>

      <Separator className="my-8" />

      {/* ── 5. Demo ── */}
      <ScrollReveal>
        <h2 className="text-2xl font-bold mb-4">See It In Action</h2>
        <p className="text-muted-foreground mb-4">
          Watch how useFrame drives continuous animation. Every object below is
          being nudged on each frame tick -- no React re-renders involved.
        </p>
      </ScrollReveal>
      <FrameDemo />

      <Separator className="my-8" />

      {/* ── 6. Guided Walkthrough ── */}
      <ScrollReveal>
        <h2 className="text-2xl font-bold mb-4">Building It Step by Step</h2>

        {/* Step 1 */}
        <div className="rounded-lg border bg-card p-4 mb-4">
          <p className="text-sm font-semibold mb-2">
            Step 1 -- Grab a ref to your mesh
          </p>
          <p className="text-sm text-muted-foreground mb-3">
            You need a direct handle to the Three.js object so you can mutate
            it without going through React. That is what refs are for.
          </p>
          <CodeBlock
            code={`const meshRef = useRef<THREE.Mesh>(null)

return (
  <mesh ref={meshRef}>
    <boxGeometry />
    <meshNormalMaterial />
  </mesh>
)`}
            filename="SpinningBox.tsx"
          />
        </div>

        {/* Step 2 */}
        <div className="rounded-lg border bg-card p-4 mb-4">
          <p className="text-sm font-semibold mb-2">
            Step 2 -- Animate inside useFrame
          </p>
          <p className="text-sm text-muted-foreground mb-3">
            The callback receives the full R3F state and <code>delta</code> --
            the time in seconds since the last frame. Multiply your movement by
            delta so it runs at the same speed on all monitors.
          </p>
          <CodeBlock
            code={`useFrame((state, delta) => {
  if (!meshRef.current) return
  meshRef.current.rotation.x += delta
  meshRef.current.rotation.y += delta * 0.5
})`}
            filename="SpinningBox.tsx"
          />
          <p className="text-sm text-muted-foreground mt-2">
            That is it. No setState, no re-renders. You directly poke the
            Three.js object and R3F takes care of drawing the result.
          </p>
        </div>

        {/* Step 3 */}
        <div className="rounded-lg border bg-card p-4 mb-4">
          <p className="text-sm font-semibold mb-2">
            Step 3 -- Use the state object for fancier effects
          </p>
          <p className="text-sm text-muted-foreground mb-3">
            The first argument gives you access to <code>clock</code>,{" "}
            <code>camera</code>, <code>pointer</code>, and more. Use{" "}
            <code>clock.elapsedTime</code> with Math.sin for smooth oscillation.
          </p>
          <CodeBlock
            code={`useFrame((state) => {
  const t = state.clock.elapsedTime
  mesh.position.x = Math.cos(t) * 2
  mesh.position.y = Math.sin(t * 2) * 0.3
})`}
            filename="OrbitingSphere.tsx"
          />
          <p className="text-sm text-muted-foreground mt-2">
            <code>clock.elapsedTime</code> counts up from zero in seconds. Plug
            it into sine and cosine for looping, organic motion.
          </p>
        </div>
      </ScrollReveal>

      <Separator className="my-8" />

      {/* ── 7. WhatYouJustLearned ── */}
      <WhatYouJustLearned
        points={[
          "useFrame runs your callback on every rendered frame (~60fps)",
          "Always mutate Three.js objects via refs -- never call setState",
          "Multiply movement by delta for frame-rate independent animation",
          "The state object gives you clock, camera, pointer, viewport, and more",
          "When the component unmounts, useFrame automatically unsubscribes -- no cleanup needed",
        ]}
      />

      <Separator className="my-8" />

      {/* ── 8. Question Callout ── */}
      <ScrollReveal>
        <ConversationalCallout type="question">
          <p>
            Can you use React state together with useFrame? Yes, but carefully.
            Use state to set a <em>target</em> value (like a target position
            on click), then use useFrame to smoothly interpolate toward that
            target with <code>lerp()</code>. The state update only happens on
            the click (once), not on every frame.
          </p>
        </ConversationalCallout>
      </ScrollReveal>

      <Separator className="my-8" />

      {/* ── 9. AhaMoment ── */}
      <AhaMoment
        setup="Why can't you just use setState inside useFrame like you would in a normal React component?"
        reveal="React's job is to manage UI state and reconcile the DOM. Three.js's job is to render 3D graphics from a scene graph. These are two separate systems. When you call setState, React re-runs your component, diffs the virtual DOM, and patches the real DOM -- 60 times per second, that is a catastrophe. But Three.js doesn't need React to re-render. It reads directly from the scene graph. So you skip React entirely and mutate the scene graph through refs. React never knows, and never needs to."
      />

      <Separator className="my-8" />

      {/* ── 10. MentalModelChallenge ── */}
      <MentalModelChallenge
        question="You want a cube to rotate at the same speed on both a 60Hz laptop and a 144Hz gaming monitor. Which approach works?"
        options={[
          {
            label: "meshRef.current.rotation.y += 0.01",
            correct: false,
            explanation:
              "This adds a fixed amount per frame. On 144Hz, it fires 2.4x more often than on 60Hz, so the cube spins 2.4x faster.",
          },
          {
            label: "meshRef.current.rotation.y += delta",
            correct: true,
            explanation:
              "Delta is smaller on faster monitors (less time per frame), so the total rotation per second is always the same.",
          },
          {
            label: "meshRef.current.rotation.y = clock.elapsedTime",
            correct: true,
            explanation:
              "ElapsedTime is absolute, not per-frame. The rotation is always the same value at the same wall-clock time, regardless of frame rate.",
          },
        ]}
        answer="Both delta-based and elapsedTime-based approaches work. The key insight: delta compensates for frame rate differences by measuring actual elapsed time. elapsedTime sidesteps the issue entirely by using an absolute clock. The only wrong answer is a fixed increment per frame."
      />

      <Separator className="my-8" />

      {/* Try These Challenges */}
      <ScrollReveal>
        <TryThisList challenges={[
          { challenge: "Toggle useDelta off -- which cube goes faster on a high-refresh monitor?", hint: "Without delta, each frame adds a fixed amount. Higher refresh rate means more frames per second.", solution: "Without delta, the cube using a fixed increment (like += 0.01) will spin faster on a 120Hz or 144Hz monitor because useFrame fires more often. The delta-based cube stays consistent because delta is smaller on faster monitors. This is why multiplying by delta is critical for frame-rate independent animation.", difficulty: "beginner" },
          { challenge: "Set speed to 0 -- everything freezes.", hint: "Speed multiplies the rotation increment. What is anything multiplied by zero?", solution: "All rotation stops because the rotation increment becomes 0 * delta = 0 per frame. The useFrame callback still fires 60 times per second, but each call adds zero rotation. This is a clean way to pause animations without unmounting components or conditional logic.", difficulty: "beginner" },
          { challenge: "Change colorA to match colorB -- twins!", hint: "Both cubes use different color props. Set them to the same value.", solution: "Both cubes become visually identical -- same color, same shape. If both also use delta-based rotation at the same speed, they spin in perfect sync. This demonstrates that the only difference between the cubes is their props. useFrame does not care about visual appearance -- it just mutates whatever ref you give it.", difficulty: "beginner" },
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
                <h3 className="font-semibold text-sm">Always multiply by delta</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                This guarantees your animation runs at the same speed on 60Hz,
                120Hz, and 144Hz monitors. No exceptions.
              </p>
            </div>
            <div className="rounded-lg border bg-card p-4 space-y-2">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="size-4 text-green-500" />
                <h3 className="font-semibold text-sm">
                  Mutate refs, never setState
                </h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Directly mutate Three.js objects via refs. React state setters
                inside useFrame cause 60 re-renders per second.
              </p>
            </div>
            <div className="rounded-lg border bg-card p-4 space-y-2">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="size-4 text-green-500" />
                <h3 className="font-semibold text-sm">Pre-allocate temp objects</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Create Vector3, Color, and other helpers outside the loop.
                Reuse them with <code>.set()</code> inside useFrame.
              </p>
            </div>
            <div className="rounded-lg border bg-card p-4 space-y-2">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="size-4 text-green-500" />
                <h3 className="font-semibold text-sm">Keep the callback lean</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Your callback runs 60 times per second. Heavy logic belongs in
                a Web Worker or at a lower frequency -- not inside useFrame.
              </p>
            </div>
            <div className="rounded-lg border bg-card p-4 space-y-2">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="size-4 text-green-500" />
                <h3 className="font-semibold text-sm">Use lerp for smoothness</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Use <code>.lerp()</code> for silky-smooth transitions instead
                of snapping to target values instantly.
              </p>
            </div>
            <div className="rounded-lg border bg-card p-4 space-y-2">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="size-4 text-green-500" />
                <h3 className="font-semibold text-sm">Auto-cleanup on unmount</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                When your component unmounts, useFrame automatically
                unsubscribes. No manual cleanup needed.
              </p>
            </div>
          </div>
        </section>
      </ScrollReveal>
    </div>
  );
}
