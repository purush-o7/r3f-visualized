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
    import("./_components/spring-demo").then((m) => ({
      default: m.SpringDemo,
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
    title: "Creating new Vector3 objects every frame",
    subtitle: "Allocating memory 60 times per second inside useFrame",
    wrongCode: `useFrame(() => {
  // New Vector3 every frame = garbage collection stutter
  mesh.current.position.lerp(
    new THREE.Vector3(targetX, targetY, targetZ),
    0.1
  )
})`,
    rightCode: `// Create once, reuse every frame
const target = useRef(new THREE.Vector3())

useFrame(() => {
  target.current.set(targetX, targetY, targetZ)
  mesh.current.position.lerp(target.current, 0.1)
})`,
    filename: "AnimatedMesh.tsx",
    explanation:
      "Creating objects inside useFrame triggers garbage collection, causing micro-stutters. Allocate once outside the loop and reuse via a ref.",
  },
  {
    title: "Using setState inside useFrame",
    subtitle: "Triggering a React re-render 60 times per second",
    wrongCode: `useFrame(() => {
  // This re-renders the component every frame!
  setPosition(mesh.current.position.y)
})`,
    rightCode: `useFrame(() => {
  // Mutate the ref directly -- no re-render
  mesh.current.position.y += delta * speed
})`,
    filename: "AnimatedMesh.tsx",
    explanation:
      "setState inside useFrame causes 60 re-renders per second, destroying performance. useFrame is for direct mutation of refs and Three.js objects -- never React state.",
  },
  {
    title: "Lerp factor that depends on frame rate",
    subtitle: "Animation runs faster on 144Hz monitors than 60Hz",
    wrongCode: `useFrame(() => {
  // 0.1 per frame: at 60fps that's different than 144fps
  mesh.current.position.x = THREE.MathUtils.lerp(
    mesh.current.position.x, target, 0.1
  )
})`,
    rightCode: `useFrame((_, delta) => {
  // Frame-rate independent: use delta to normalize
  const factor = 1 - Math.pow(0.001, delta)
  mesh.current.position.x = THREE.MathUtils.lerp(
    mesh.current.position.x, target, factor
  )
})`,
    filename: "AnimatedMesh.tsx",
    explanation:
      "A fixed lerp factor like 0.1 means 'move 10% closer per frame.' On a 144Hz monitor that is 144 steps per second versus 60 on a standard display. Use delta to make the speed consistent across frame rates.",
  },
];

export default function AnimationLibrariesPage() {
  return (
    <div className="relative max-w-4xl">
      <div className="absolute -top-10 -left-10 w-72 h-72 bg-gradient-to-br from-teal-500/10 via-emerald-500/10 to-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
      {/* ── 1. Title + Badge + Intro ── */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-3">
          <Badge variant="outline">Animation & Physics</Badge>
        </div>
        <h1 className="text-3xl font-bold tracking-tight mb-3">
          Animation Libraries
        </h1>
        <p className="text-lg text-muted-foreground">
          A 3D scene without animation is a statue garden. Beautiful, sure, but
          lifeless. Animation is what makes objects feel alive -- a box that
          bounces when clicked, a camera that smoothly glides to a new viewpoint,
          a character that breathes. Let us look at three fundamentally different
          ways to animate in R3F and understand when to reach for each one.
        </p>
      </div>

      {/* ── 2. WhatCouldGoWrong ── */}
      <WhatCouldGoWrong
        scenario={`You animate a menu by setting React state 60 times per second inside useFrame. Each setState triggers a full component re-render. Your scene grinds to a halt because React is reconciling the virtual DOM on every single frame while also trying to render 3D graphics.`}
        error={`Warning: Maximum update depth exceeded.
React has detected setState being called inside useFrame at 60fps.
Component re-rendered 3,847 times in the last second.
Frame time: 142ms (7 FPS). Expected: 16ms (60 FPS).`}
        errorType="Performance"
      />

      <Separator className="my-8" />

      {/* ── 3. Story Analogy ── */}
      <ScrollReveal>
        <ConversationalCallout type="story">
          <p>
            Think of animation as choreography. You have three choreographers,
            each with a different style.
          </p>
          <p>
            The first is a <strong>flipbook artist</strong>. They draw every
            single frame by hand -- position at frame 1, position at frame 2,
            position at frame 3. Total control, but you do all the work. That
            is <code>useFrame</code>.
          </p>
          <p>
            The second is a <strong>rubber band</strong>. You pull it to a new
            position and let go. It overshoots, bounces back, and settles
            naturally. You did not plan each frame -- you just described the
            destination and the rubber band figured out the journey. That is
            spring physics.
          </p>
          <p>
            The third is a <strong>GPS navigation</strong>. "Drive from A to B
            in exactly 2 seconds, easing in at the start and out at the end."
            Precise, predictable, no surprises. That is lerp with easing.
          </p>
        </ConversationalCallout>
      </ScrollReveal>

      <Separator className="my-8" />

      {/* ── 4. SimpleFlow ── */}
      <ScrollReveal>
        <h2 className="text-2xl font-bold mb-4">Choosing Your Approach</h2>
        <SimpleFlow
          steps={[
            { label: "Need full control?", detail: "useFrame with manual math" },
            { label: "Want organic feel?", detail: "Spring physics (stiffness + damping)" },
            { label: "Need exact timing?", detail: "Lerp with easing curves" },
            { label: "Combine them", detail: "useFrame drives everything -- springs and lerps run inside it", status: "success" },
          ]}
        />
      </ScrollReveal>

      <Separator className="my-8" />

      {/* ── 5. Demo ── */}
      <ScrollReveal>
        <h2 className="text-2xl font-bold mb-4">See It In Action</h2>
        <p className="text-muted-foreground mb-4">
          Three boxes, three animation styles. Click each one to toggle its
          position. The red box uses raw <code>useFrame</code> -- it just
          teleports. The blue box uses spring physics -- notice how it
          overshoots and bounces. The green box uses lerp -- smooth and
          predictable. Try adjusting stiffness, damping, and smoothness in the
          controls.
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
            Step 1 -- Raw animation with useFrame
          </p>
          <p className="text-sm text-muted-foreground mb-3">
            <code>useFrame</code> gives you a callback that runs every frame.
            You get the clock state and delta time. Mutate refs directly --
            never use setState here.
          </p>
          <CodeBlock
            code={`import { useFrame } from "@react-three/fiber"
import { useRef } from "react"

function SpinningBox() {
  const ref = useRef<THREE.Mesh>(null)

  useFrame((state, delta) => {
    if (!ref.current) return
    // Rotate a little each frame
    ref.current.rotation.y += delta * 0.5
    // Bob up and down with a sine wave
    ref.current.position.y = Math.sin(state.clock.elapsedTime) * 0.3
  })

  return (
    <mesh ref={ref}>
      <boxGeometry />
      <meshStandardMaterial color="tomato" />
    </mesh>
  )
}`}
            filename="SpinningBox.tsx"
          />
        </div>

        {/* Step 2 */}
        <div className="rounded-lg border bg-card p-4 mb-4">
          <p className="text-sm font-semibold mb-2">
            Step 2 -- Spring physics (manual implementation)
          </p>
          <p className="text-sm text-muted-foreground mb-3">
            A spring is defined by three values: stiffness (how hard it pulls),
            damping (how fast oscillations die), and mass (how heavy the
            object). The math is surprisingly simple.
          </p>
          <CodeBlock
            code={`const velocity = useRef(0)
const current = useRef(0)

useFrame((_, delta) => {
  const target = toggled ? 2 : 0
  const stiffness = 120
  const damping = 8
  const mass = 1

  // Spring force: F = -k * displacement
  const displacement = current.current - target
  const springForce = -stiffness * displacement
  const dampingForce = -damping * velocity.current
  const acceleration = (springForce + dampingForce) / mass

  velocity.current += acceleration * delta
  current.current += velocity.current * delta
  mesh.current.position.y = current.current
})`}
            filename="SpringBox.tsx"
          />
          <p className="text-sm text-muted-foreground mt-2">
            High stiffness = snappy. High damping = no overshoot. High mass =
            sluggish. Play with the controls in the demo above to feel the
            difference.
          </p>
        </div>

        {/* Step 3 */}
        <div className="rounded-lg border bg-card p-4 mb-4">
          <p className="text-sm font-semibold mb-2">
            Step 3 -- Smooth lerp interpolation
          </p>
          <p className="text-sm text-muted-foreground mb-3">
            <code>THREE.MathUtils.lerp(a, b, t)</code> returns a value that
            is <code>t</code> percent of the way from <code>a</code> to{" "}
            <code>b</code>. Called every frame with a small <code>t</code>, it
            creates an exponential ease-out -- fast at first, slower as it
            approaches the target.
          </p>
          <CodeBlock
            code={`import * as THREE from "three"

useFrame(() => {
  const target = toggled ? 2 : 0
  mesh.current.position.y = THREE.MathUtils.lerp(
    mesh.current.position.y,  // current
    target,                    // destination
    0.05                       // 5% closer each frame
  )
})`}
            filename="SmoothBox.tsx"
          />
          <p className="text-sm text-muted-foreground mt-2">
            Lerp is dead simple but has a quirk: with a fixed factor, it
            technically never arrives (it just gets infinitely close). In
            practice, the difference becomes sub-pixel and invisible.
          </p>
        </div>
      </ScrollReveal>

      <Separator className="my-8" />

      {/* ── 7. WhatYouJustLearned ── */}
      <WhatYouJustLearned
        points={[
          "useFrame gives you per-frame control -- mutate refs directly, never setState",
          "Spring physics use stiffness, damping, and mass to create organic, bouncy motion",
          "Lerp creates smooth exponential ease-out by moving a percentage closer each frame",
          "All three approaches run inside useFrame -- it is the engine that drives everything",
          "Allocate objects (Vector3, etc.) outside useFrame to avoid garbage collection stutters",
        ]}
      />

      <Separator className="my-8" />

      {/* ── 8. Question Callout ── */}
      <ScrollReveal>
        <ConversationalCallout type="question">
          <p>
            When should I use a library like react-spring instead of manual
            spring math? If you need to animate React state (opacity, color,
            CSS transforms) alongside 3D properties, a library handles the
            coordination. For pure 3D animation inside useFrame, manual springs
            are often simpler and avoid an extra dependency.
          </p>
        </ConversationalCallout>
      </ScrollReveal>

      <Separator className="my-8" />

      {/* ── 9. AhaMoment ── */}
      <AhaMoment
        setup="Why does lerp with a fixed factor feel different from a spring, even though both move toward a target?"
        reveal="Lerp with a fixed factor always decelerates -- it moves a fixed percentage of the remaining distance each frame, so it slows down exponentially as it approaches. A spring can overshoot because it has velocity and momentum. When the spring reaches the target, it is still moving, so it flies past, reverses, and oscillates. That overshoot and settle is what makes spring animations feel organic and physical."
      />

      <Separator className="my-8" />

      {/* ── 10. MentalModelChallenge ── */}
      <MentalModelChallenge
        question="You set lerp factor to 0.5 inside useFrame (no delta correction). On a 60Hz monitor your animation takes about 0.2 seconds. What happens on a 144Hz monitor?"
        options={[
          {
            label: "Same speed -- lerp is frame-rate independent",
            correct: false,
            explanation:
              "A fixed lerp factor means 'move 50% closer per frame.' More frames per second means more steps, so it converges faster.",
          },
          {
            label: "The animation runs about 2.4x faster",
            correct: true,
            explanation:
              "At 144fps you take 144 steps per second instead of 60. Each step halves the remaining distance, so the object reaches its target much sooner.",
          },
          {
            label: "The animation runs slower because each frame is shorter",
            correct: false,
            explanation:
              "Each frame does move less in absolute terms, but there are 2.4x more frames per second. The net result is faster convergence, not slower.",
          },
        ]}
        answer="A fixed lerp factor is frame-rate dependent. At 0.5 per frame, on 60Hz you halve the distance 60 times/sec, on 144Hz you halve it 144 times/sec. Use delta to normalize: const factor = 1 - Math.pow(0.001, delta)."
      />

      <Separator className="my-8" />

      {/* Try This */}
      <Separator className="my-8" />
      <ScrollReveal>
        <TryThisList challenges={[
          { challenge: "Click all 3 boxes — watch spring vs lerp", hint: "Click each animated box and observe how each animation style feels different.", solution: "Spring physics produces a bouncy overshoot, while lerp creates a smooth ease. Each has a distinct feel.", difficulty: "beginner" },
          { challenge: "Max stiffness — snappy spring", hint: "Push the spring stiffness slider to its maximum.", solution: "High stiffness makes the spring animation snap to the target almost instantly, with minimal bounce.", difficulty: "beginner" },
          { challenge: "Set smoothness to 0.01 — instant lerp", hint: "Lower the lerp smoothness value to 0.01.", solution: "With near-zero smoothness, the lerp interpolation is almost instant — the object teleports to its target.", difficulty: "beginner" },
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
                <h3 className="font-semibold text-sm">
                  Mutate refs, not state
                </h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Inside <code>useFrame</code>, always work with refs and Three.js
                objects directly. React state triggers re-renders -- that is
                the opposite of what you want at 60fps.
              </p>
            </div>
            <div className="rounded-lg border bg-card p-4 space-y-2">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="size-4 text-green-500" />
                <h3 className="font-semibold text-sm">
                  Use delta for consistency
                </h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Always multiply movement by <code>delta</code> from useFrame.
                This ensures your animation runs at the same speed regardless
                of the monitor refresh rate.
              </p>
            </div>
            <div className="rounded-lg border bg-card p-4 space-y-2">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="size-4 text-green-500" />
                <h3 className="font-semibold text-sm">
                  Pre-allocate reusable objects
                </h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Create <code>Vector3</code>, <code>Quaternion</code>, and other
                temporary objects once in a ref or outside the component. Reuse
                them inside useFrame to avoid garbage collection hitches.
              </p>
            </div>
            <div className="rounded-lg border bg-card p-4 space-y-2">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="size-4 text-green-500" />
                <h3 className="font-semibold text-sm">
                  Springs for interaction, lerp for cameras
                </h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Springs feel great for user-triggered actions (click, drag)
                because the overshoot gives tactile feedback. Lerp is better
                for camera movement where overshoot feels nauseating.
              </p>
            </div>
          </div>
        </section>
      </ScrollReveal>
    </div>
  );
}
