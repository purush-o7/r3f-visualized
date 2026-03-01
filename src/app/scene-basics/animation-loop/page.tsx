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

const AnimationDemo = dynamic(
  () =>
    import("./_components/animation-demo").then((m) => ({
      default: m.AnimationDemo,
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
    title: "Creating objects inside the animation loop",
    subtitle: "Memory usage grows every frame, eventually crashing the tab",
    wrongCode: `useFrame(() => {
  // WRONG: new Vector3 every frame = memory leak!
  const dir = new Vector3(1, 0, 0);
  ref.current.position.add(
    dir.multiplyScalar(0.01)
  );
});`,
    rightCode: `// Create OUTSIDE the loop, reuse inside
const dir = useMemo(() => new Vector3(), []);

useFrame(() => {
  dir.set(1, 0, 0).multiplyScalar(0.01);
  ref.current.position.add(dir);
});`,
    filename: "SpinningBox.tsx",
    explanation:
      "Every 'new' keyword inside useFrame allocates memory 60 times per second. Over time this causes garbage collection pauses that appear as stuttering. Pre-allocate reusable objects outside the loop and mutate them with .set() or .copy().",
  },
  {
    title: "Using fixed values instead of delta time",
    subtitle: "Animation runs at different speeds on different monitors",
    wrongCode: `useFrame(() => {
  // WRONG: on a 144Hz monitor, this runs
  // 2.4x faster than on a 60Hz monitor!
  ref.current.rotation.y += 0.01;
});`,
    rightCode: `useFrame((_, delta) => {
  // Speed is consistent on ALL monitors
  ref.current.rotation.y += 1.0 * delta;
  // 1 radian per second, always
});`,
    filename: "SpinningBox.tsx",
    explanation:
      "useFrame fires once per display refresh. A 60Hz monitor calls it 60 times/sec, a 144Hz monitor calls it 144 times/sec. If you add a fixed value, the animation is 2.4x faster on the faster monitor. Multiply by delta to make speed consistent.",
  },
  {
    title: "Heavy computations blocking the frame",
    subtitle: "Scene drops to 10fps because the loop does too much work",
    wrongCode: `useFrame(() => {
  // WRONG: sorting 10,000 items every frame
  const sorted = particles.sort((a, b) =>
    a.distanceTo(camera) - b.distanceTo(camera)
  );
  updatePositions(sorted);
});`,
    rightCode: `const frameCount = useRef(0);

useFrame(() => {
  frameCount.current++;
  // Sort only every 10th frame
  if (frameCount.current % 10 === 0) {
    particles.sort(/* ... */);
  }
  updatePositions(particles);
});`,
    filename: "Particles.tsx",
    explanation:
      "You have about 16 milliseconds per frame at 60fps. Expensive operations like sorting large arrays, raycasting thousands of objects, or heavy math will blow past that budget and cause visible stuttering. Spread heavy work across frames or use web workers.",
  },
];

export default function AnimationLoopPage() {
  return (
    <div className="relative max-w-4xl">
      <div className="absolute -top-10 -left-10 w-72 h-72 bg-gradient-to-br from-teal-500/10 via-emerald-500/10 to-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-3">
          <Badge variant="outline">Scene Basics</Badge>
        </div>
        <h1 className="text-3xl font-bold tracking-tight mb-3">
          Animation Loop
        </h1>
        <p className="text-lg text-muted-foreground">
          A 3D scene is not a static picture. It redraws itself many times per second,
          and each redraw is your chance to move things, spin things, or react to
          user input. This is the animation loop — the heartbeat of every 3D experience.
        </p>
      </div>

      {/* What Could Go Wrong */}
      <WhatCouldGoWrong
        scenario="You test your spinning cube on your laptop and it looks perfect — a smooth, gentle rotation. Your friend opens it on their gaming monitor and the cube is spinning twice as fast. Another friend on an old tablet sees it moving in slow motion. Same code, three different speeds."
        error="Animation speed varies across devices. Cube rotates 2.4x faster on 144Hz vs 60Hz."
        errorType="Frame-Rate Bug"
        accentColor="red"
      />

      <Separator className="my-8" />

      {/* Story Analogy */}
      <ConversationalCallout type="story">
        <p>Remember those flipbooks you made as a kid? You draw a slightly different picture on each page, then flip through them fast and it looks like smooth animation.</p>
        <p>Your computer does the same thing — it draws about <strong>60 &quot;pages&quot; per second</strong>. Each page is called a <strong>frame</strong>.</p>
        <p>On each frame, you get a chance to change things: rotate an object a tiny bit, move a character slightly forward, update a color. Flip through all these tiny changes fast enough, and you get smooth motion.</p>
        <p>But here&apos;s the catch: some flipbooks have 60 pages per second, others have 144. If you move an object &quot;1 step per page&quot;, faster flipbooks mean faster movement. That&apos;s why we need <strong>delta time</strong>.</p>
      </ConversationalCallout>

      <Separator className="my-8" />

      {/* Mental Model Flow */}
      <SimpleFlow
        steps={[
          { label: "Frame Starts", detail: "Browser says: time to draw!" },
          { label: "Update", detail: "Move objects, apply physics" },
          { label: "Render", detail: "Draw the new picture" },
          { label: "Repeat", detail: "~60 times per second", status: "success" },
        ]}
        accentColor="blue"
      />

      <Separator className="my-8" />

      {/* Interactive Demo */}
      <AnimationDemo />

      <Separator className="my-8" />

      {/* Guided Walkthrough */}
      <ScrollReveal>
        <section className="space-y-4">
          <h2 className="text-2xl font-bold">Hands-On: Making Things Move</h2>
          <p className="text-muted-foreground leading-relaxed">
            In R3F, the useFrame hook is your animation loop. It runs once per frame
            and gives you everything you need to create smooth animations.
          </p>

          <div className="rounded-lg border bg-card p-4 space-y-3">
            <p className="text-sm font-medium">Step 1: The simplest animation</p>
            <CodeBlock
              code={`function SpinningBox() {\n  const ref = useRef<Mesh>(null!);\n\n  useFrame(() => {\n    ref.current.rotation.y += 0.01;\n  });\n\n  return (\n    <mesh ref={ref}>\n      <boxGeometry />\n      <meshStandardMaterial color="tomato" />\n    </mesh>\n  );\n}`}
              filename="SpinningBox.tsx"
            />
            <p className="text-sm text-muted-foreground">
              useFrame runs your callback every single frame. Here, we add 0.01 radians
              to the Y rotation each frame, making the cube spin. But there&apos;s a
              problem — this spins faster on a 144Hz monitor than on a 60Hz one.
            </p>
          </div>

          <div className="rounded-lg border bg-card p-4 space-y-3">
            <p className="text-sm font-medium">Step 2: Fix it with delta time</p>
            <CodeBlock
              code={`useFrame((state, delta) => {\n  // 1 radian per second, on ANY device\n  ref.current.rotation.y += 1.0 * delta;\n});`}
              filename="SpinningBox.tsx"
            />
            <p className="text-sm text-muted-foreground">
              The second argument, delta, is the time in seconds since the last frame.
              On a 60Hz monitor, delta is ~0.016s. On 144Hz, it&apos;s ~0.007s. Multiply
              your speed by delta, and the rotation is always 1 radian per second
              regardless of frame rate. Problem solved!
            </p>
          </div>

          <div className="rounded-lg border bg-card p-4 space-y-3">
            <p className="text-sm font-medium">Step 3: Use the clock for oscillation</p>
            <CodeBlock
              code={`useFrame((state) => {\n  const t = state.clock.elapsedTime;\n  ref.current.position.y = Math.sin(t) * 0.5;\n  // Bobs up and down smoothly forever\n});`}
              filename="BobbingBox.tsx"
            />
            <p className="text-sm text-muted-foreground">
              state.clock.elapsedTime gives you the total seconds since the scene started.
              Feed it into Math.sin() and you get a smooth wave that oscillates between -1 and 1.
              Multiply by 0.5 to bob half a unit up and down. Try changing 0.5 to 2 for a bigger bounce!
            </p>
          </div>
        </section>
      </ScrollReveal>

      <Separator className="my-8" />

      {/* What You Just Learned */}
      <WhatYouJustLearned
        points={[
          "The animation loop (useFrame) runs once per frame — about 60 times per second — and is where you update positions, rotations, and other properties.",
          "Always multiply speeds by 'delta' (time since last frame) to make animations look the same on 60Hz and 144Hz monitors.",
          "state.clock.elapsedTime gives the total time since the scene started — perfect for smooth oscillations with Math.sin().",
          "Never create new objects (new Vector3, new Color) inside useFrame — pre-allocate them outside to avoid memory issues.",
        ]}
      />

      <Separator className="my-8" />

      {/* Thought-Provoking Question */}
      <ConversationalCallout type="question">
        <p>
          If the animation loop runs 60 times per second, that means you have about
          16 milliseconds to do all your work per frame. What happens if your update
          logic takes 20 milliseconds? What would the user see?
        </p>
      </ConversationalCallout>

      <Separator className="my-8" />

      {/* Aha Moment */}
      <AhaMoment
        setup="You might think 'delta time' is just a nice-to-have optimization. But there's a deeper reason it matters..."
        reveal="Delta time doesn't just fix speed differences between monitors. It also handles the case when a frame takes longer than expected — like when the browser is busy processing a network request or garbage collecting. Without delta time, your animation would 'freeze' and then 'jump' forward. With delta time, it smoothly catches up because the next frame's delta is larger, moving objects proportionally further."
      />

      <Separator className="my-8" />

      {/* Mental Model Challenge */}
      <MentalModelChallenge
        question="You have a cube rotating with 'ref.current.rotation.y += 0.01' in useFrame. On a 60Hz monitor it completes one full rotation in ~10.5 seconds. How long does the same rotation take on a 144Hz monitor?"
        options={[
          { label: "~10.5 seconds (same speed)", correct: false, explanation: "Without delta time, the speed depends on frame rate. The animation runs faster on faster monitors." },
          { label: "~4.4 seconds (2.4x faster)", correct: true, explanation: "Correct! 144Hz fires 2.4x more frames than 60Hz. Each frame adds 0.01, so it completes 2.4x faster." },
          { label: "~21 seconds (half speed)", correct: false, explanation: "Higher refresh rates mean MORE frames per second, not fewer." },
          { label: "Depends on the GPU", correct: false, explanation: "It depends on the monitor's refresh rate, not the GPU. useFrame syncs with the display." },
        ]}
        hint="Think about how many times useFrame fires per second on each monitor..."
        answer="Without delta time, adding a fixed value each frame means more frames = faster animation. A 144Hz monitor fires useFrame 144 times per second, vs 60 on a 60Hz monitor. That's 2.4x more frames, so the animation runs 2.4x faster. Use delta time to fix this!"
      />

      <Separator className="my-8" />

      {/* Try This Challenges */}
      <ScrollReveal>
        <TryThisList challenges={[
          {
            challenge: "Set speed to 5 — which cube goes crazy?",
            hint: "The cube without delta time multiplies 5 by a fixed amount each frame, while the delta-time cube moves 5 radians per second regardless.",
            solution: "The non-delta cube spins wildly fast (5 * 0.01 per frame = very fast). The delta cube spins at 5 radians/second — fast but consistent across all monitors.",
            difficulty: "beginner",
          },
          {
            challenge: "Try Math.sin(clock.elapsedTime) for oscillation",
            hint: "Math.sin produces a smooth wave between -1 and 1. Use state.clock.elapsedTime as the input.",
            solution: "The object smoothly bobs between -1 and 1 on whatever axis you apply it to. Multiply by a value to control the amplitude: Math.sin(t) * 2 bobs between -2 and 2.",
            difficulty: "intermediate",
          },
          {
            challenge: "Use delta * 0.1 for slow-motion",
            hint: "Multiplying delta by a fraction slows everything down proportionally.",
            solution: "The rotation becomes 10x slower than normal. delta * 0.1 means '10% of real-time speed' — perfect for dramatic slow-motion effects or debugging animations.",
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
                <h3 className="font-semibold text-sm">Always Use Delta Time</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Multiply all movement and rotation speeds by delta. This ensures your animation
                runs at the same real-world speed on 60Hz, 144Hz, and variable-refresh displays.
              </p>
            </div>
            <div className="rounded-lg border bg-card p-4 space-y-2">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="size-4 text-green-500" />
                <h3 className="font-semibold text-sm">Pre-Allocate Reusable Objects</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Create Vector3, Color, and other objects outside useFrame using useRef or useMemo.
                Reuse them with .set() and .copy() to avoid garbage collection pauses.
              </p>
            </div>
            <div className="rounded-lg border bg-card p-4 space-y-2">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="size-4 text-green-500" />
                <h3 className="font-semibold text-sm">Keep useFrame Lightweight</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                You have about 16ms per frame at 60fps. Heavy computations like sorting large
                arrays or complex raycasting should be spread across frames or offloaded to workers.
              </p>
            </div>
            <div className="rounded-lg border bg-card p-4 space-y-2">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="size-4 text-green-500" />
                <h3 className="font-semibold text-sm">Render On Demand When Possible</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                For static scenes that only change on user interaction (like model viewers),
                use R3F&apos;s frameloop=&quot;demand&quot; prop. This can reduce GPU usage from 100% to nearly
                0% when idle, saving battery life.
              </p>
            </div>
          </div>
        </section>
      </ScrollReveal>
    </div>
  );
}
