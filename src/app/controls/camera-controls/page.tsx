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

const CameraDemo = dynamic(
  () => import("./_components/camera-demo").then((m) => ({ default: m.CameraDemo })),
  {
    ssr: false,
    loading: () => (
      <div className="w-full aspect-[2/1] rounded-xl border bg-scene-bg animate-pulse" />
    ),
  }
);

const mistakes: Mistake[] = [
  {
    title: "Using OrbitControls when you need animated transitions",
    subtitle: "Camera snaps instantly instead of gliding smoothly",
    wrongCode: `const controls = useRef<OrbitControlsImpl>(null)

const focusOnPart = (pos) => {
  // OrbitControls has no animation system!
  // This snaps instantly — jarring for users
  controls.current.target.set(...pos)
  controls.current.update()
}`,
    rightCode: `const controls = useRef<CameraControlsImpl>(null)

const focusOnPart = (pos) => {
  // setLookAt smoothly flies to the new view
  controls.current?.setLookAt(
    pos[0] + 3, pos[1] + 2, pos[2] + 3,
    ...pos,
    true // animate = true
  )
}`,
    filename: "ProductViewer.tsx",
    explanation:
      "OrbitControls has no built-in animation. Setting the target or position snaps the camera instantly. CameraControls wraps the camera-controls library which provides smooth, configurable transitions. If your app needs click-to-focus, guided tours, or preset views, CameraControls is the right choice.",
  },
  {
    title: "Forgetting to set smoothTime",
    subtitle: "Transitions feel too abrupt or too sluggish",
    wrongCode: `const controls = useRef<CameraControlsImpl>(null)

// Uses default smoothTime — might feel snappy
controls.current?.setLookAt(5, 5, 5, 0, 0, 0, true)`,
    rightCode: `<CameraControls
  ref={controls}
  smoothTime={0.5}
  makeDefault
/>

// Or change it before a specific transition
controls.current.smoothTime = 0.8
controls.current?.setLookAt(5, 5, 5, 0, 0, 0, true)`,
    filename: "SmoothTransition.tsx",
    explanation:
      "The smoothTime property controls transition duration in seconds. The default may feel too fast for cinematic moves or too slow for quick switches. Set it as a prop for the default, or change it dynamically before specific transitions. Values between 0.3 and 1.0 seconds feel natural for most cases.",
  },
  {
    title: "Using both OrbitControls and CameraControls",
    subtitle: "Two control systems fighting over the same camera",
    wrongCode: `function Experience() {
  return (
    <>
      {/* Both attach listeners and move the camera! */}
      <OrbitControls makeDefault />
      <CameraControls makeDefault />
    </>
  )
}`,
    rightCode: `function Experience() {
  // Pick ONE control system
  return (
    <>
      <CameraControls makeDefault smoothTime={0.5} />
      <Scene />
    </>
  )
}`,
    filename: "Experience.tsx",
    explanation:
      "Both controls attach event listeners to the canvas and move the camera. Having both active causes jitter, broken transitions, and unpredictable input. Pick one. CameraControls can do everything OrbitControls can plus animated transitions, so it is a safe default for most projects.",
  },
];

export default function CameraControlsPage() {
  return (
    <div className="max-w-4xl ambient-drei">
      {/* 1. Title + Badge + Intro */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-3">
          <Badge variant="outline">Controls</Badge>
        </div>
        <h1 className="text-3xl font-bold tracking-tight mb-3">
          Camera Controls
        </h1>
        <p className="text-lg text-muted-foreground">
          CameraControls is the upgraded version of OrbitControls. It gives you
          the same orbit, zoom, and pan, but adds smooth animated transitions,
          auto-framing, and full programmatic control. If your app needs to fly
          the camera from point A to point B, this is the component you want.
        </p>
      </div>

      {/* 2. What Could Go Wrong */}
      <WhatCouldGoWrong
        scenario="You build a product viewer with OrbitControls. The client asks you to add a 'click on a part to zoom in' feature. You try setting the camera position directly, but it snaps instantly. There is no way to animate the transition. You end up rewriting half your camera logic to switch to CameraControls."
        error="Camera jumps to new position with no animation. OrbitControls.target.set() provides no transition support."
        errorType="No Animation"
      />

      <Separator className="my-8" />

      {/* 3. Story Analogy */}
      <ScrollReveal>
        <ConversationalCallout type="story">
          <p>
            Think of CameraControls as a drone camera. OrbitControls is like
            spinning a globe on your desk — simple and direct. But a drone can
            do much more. You give it a flight plan: &quot;Fly from here to
            there, point at that building, and zoom in smoothly.&quot;
          </p>
          <p>
            That flight plan is setLookAt. You tell the drone where to go
            (camera position) and what to look at (target position), and it
            glides there gracefully. You can even chain multiple flight plans
            for a guided tour.
          </p>
        </ConversationalCallout>
      </ScrollReveal>

      <Separator className="my-8" />

      {/* 4. SimpleFlow — Mental Model */}
      <ScrollReveal>
        <section className="space-y-4">
          <h2 className="text-2xl font-bold">The setLookAt Flight Plan</h2>
          <p className="text-muted-foreground leading-relaxed">
            Every animated camera move follows the same pattern.
          </p>
          <SimpleFlow
            steps={[
              {
                label: "Get ref",
                detail: "useRef to access controls",
              },
              {
                label: "Call setLookAt",
                detail: "(posX, posY, posZ, targetX, targetY, targetZ, animate)",
              },
              {
                label: "Camera flies",
                detail: "Smooth transition over smoothTime seconds",
              },
              {
                label: "Promise resolves",
                detail: "Chain the next move with await",
                status: "success",
              },
            ]}
          />
        </section>
      </ScrollReveal>

      <Separator className="my-8" />

      {/* 5. Interactive Demo */}
      <CameraDemo />

      <Separator className="my-8" />

      {/* 6. Guided Walkthrough */}
      <ScrollReveal>
        <section className="space-y-6">
          <h2 className="text-2xl font-bold">Guided Walkthrough</h2>
          <p className="text-muted-foreground leading-relaxed">
            Let us build a camera system that can fly between views.
          </p>

          <div className="bg-card border rounded-lg p-4 space-y-3">
            <h3 className="font-semibold text-sm">
              Step 1 — Set up CameraControls with a ref
            </h3>
            <CodeBlock
              code={`import { CameraControls } from '@react-three/drei'
import { useRef } from 'react'

function Experience() {
  const controls = useRef(null)

  return (
    <CameraControls
      ref={controls}
      smoothTime={0.5}
      makeDefault
    />
  )
}`}
              filename="Experience.tsx"
            />
            <p className="text-sm text-muted-foreground">
              The ref gives you access to all the camera methods. smoothTime
              controls how long transitions take. makeDefault keeps everything
              in sync just like with OrbitControls.
            </p>
          </div>

          <div className="bg-card border rounded-lg p-4 space-y-3">
            <h3 className="font-semibold text-sm">
              Step 2 — Fly to a position with setLookAt
            </h3>
            <CodeBlock
              code={`const goToFront = () =>
  controls.current?.setLookAt(
    0, 0, 5,     // camera position
    0, 0, 0,     // look-at target
    true          // animate the transition
  )

const goToTop = () =>
  controls.current?.setLookAt(
    0, 5, 0.01,  // slightly off-axis to avoid gimbal lock
    0, 0, 0,
    true
  )`}
              filename="ViewButtons.tsx"
            />
            <p className="text-sm text-muted-foreground">
              setLookAt takes six numbers: where to put the camera, and where
              to point it. The last argument enables smooth animation. Without
              it, the camera teleports.
            </p>
          </div>

          <div className="bg-card border rounded-lg p-4 space-y-3">
            <h3 className="font-semibold text-sm">
              Step 3 — Chain transitions for a guided tour
            </h3>
            <CodeBlock
              code={`async function guidedTour(controls) {
  await controls.setLookAt(10, 8, 10, 0, 0, 0, true)
  await new Promise(r => setTimeout(r, 2000))
  await controls.setLookAt(2, 1, 2, 1, 0, 0, true)
  await controls.setLookAt(5, 5, 5, 0, 0, 0, true)
}`}
              filename="GuidedTour.tsx"
            />
            <p className="text-sm text-muted-foreground">
              Every transition method returns a Promise. Use await to wait for
              one move to finish before starting the next. Add pauses with
              setTimeout between stops for a cinematic feel.
            </p>
          </div>
        </section>
      </ScrollReveal>

      <Separator className="my-8" />

      {/* 7. What You Just Learned */}
      <ScrollReveal>
        <WhatYouJustLearned
          points={[
            "CameraControls gives you orbit + zoom + pan, plus smooth animated transitions",
            "setLookAt is the core method: tell it where to go and what to look at",
            "smoothTime controls how long transitions take (0.3 to 1.0 seconds feels natural)",
            "All methods return Promises so you can chain transitions with await",
            "Use fitToBox to automatically frame an object into view",
          ]}
        />
      </ScrollReveal>

      <Separator className="my-8" />

      {/* 8. Thought-Provoking Question */}
      <ScrollReveal>
        <ConversationalCallout type="question">
          <p>
            CameraControls can do everything OrbitControls does, plus animated
            transitions. So why would you ever pick OrbitControls? Think about
            bundle size, simplicity, and the principle of using the smallest
            tool that gets the job done.
          </p>
        </ConversationalCallout>
      </ScrollReveal>

      <Separator className="my-8" />

      {/* 9. Aha Moment */}
      <ScrollReveal>
        <AhaMoment
          setup="Why does setLookAt need both a camera position AND a target position? Can you not just point the camera somewhere?"
          reveal="The camera position says WHERE you are standing. The target position says WHAT you are looking at. You need both to define a view. Imagine standing on a rooftop: your position is the roof, but you could be looking at the street below, the horizon, or a building across the way. Same position, completely different views."
        />
      </ScrollReveal>

      <Separator className="my-8" />

      {/* 10. Mental Model Challenge */}
      <ScrollReveal>
        <MentalModelChallenge
          question="You call setLookAt(0, 0, 5, 0, 0, 0, true) and then immediately call setLookAt(10, 10, 10, 0, 0, 0, true). What happens?"
          options={[
            {
              label: "The camera goes to (0,0,5) first, then to (10,10,10)",
              correct: false,
              explanation:
                "Without await, the second call interrupts the first mid-flight.",
            },
            {
              label: "The second call cancels the first and flies directly to (10,10,10)",
              correct: true,
              explanation:
                "Calling setLookAt again before the previous transition finishes interrupts it. The camera redirects to the new target.",
            },
            {
              label: "Both transitions run at the same time and the camera goes haywire",
              correct: false,
              explanation:
                "CameraControls is smart enough to cancel the previous transition. It does not run two at once.",
            },
            {
              label: "An error is thrown because a transition is already in progress",
              correct: false,
              explanation:
                "No error. CameraControls gracefully handles interrupting transitions.",
            },
          ]}
          answer="The second setLookAt interrupts the first. The camera smoothly redirects from wherever it currently is toward (10,10,10). If you want both to complete in sequence, use await on the first call before starting the second."
        />
      </ScrollReveal>

      <Separator className="my-8" />

      {/* Try These Challenges */}
      <ScrollReveal>
        <TryThisList challenges={[
          { challenge: "Set smoothTime to 2 -- slow-motion camera flight!", hint: "smoothTime controls how long transitions take in seconds. Higher values mean slower, more cinematic movement.", solution: "Camera transitions take a full 2 seconds, creating a slow, cinematic flight effect. The camera glides smoothly from its current position to the target. This is great for dramatic reveals or guided tours. For quick UI interactions, stick to 0.3-0.5 seconds.", difficulty: "beginner" },
          { challenge: "Click all 3 objects quickly -- does the camera queue up?", hint: "What happens when you call setLookAt while a previous transition is still in progress?", solution: "The camera does not queue transitions -- each new setLookAt call interrupts the previous one. The camera smoothly redirects toward the latest target from wherever it currently is mid-flight. To queue transitions, you would need to await each setLookAt call before starting the next.", difficulty: "intermediate" },
          { challenge: "Set transitionSpeed to 5 -- snappy transitions!", hint: "Higher speed values make the camera reach its target faster.", solution: "Camera transitions become much faster and snappier, reaching their targets almost instantly. This feels responsive for UI-driven interactions like clicking parts in a product viewer. The trade-off is less cinematic feel -- fast transitions look functional, slow transitions look dramatic. Match the speed to your use case.", difficulty: "beginner" },
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
                <h3 className="font-semibold text-sm">Set smoothTime</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Configure <code>smoothTime</code> in seconds. Values between
                0.3 and 1.0 feel natural. Change it dynamically before
                specific transitions if needed.
              </p>
            </div>
            <div className="rounded-lg border bg-card p-4 space-y-2">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="size-4 text-green-500" />
                <h3 className="font-semibold text-sm">Use fitToBox</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Call <code>fitToBox(mesh, true, padding)</code> to
                automatically frame any object into view. Perfect for product
                viewers where models vary in size.
              </p>
            </div>
            <div className="rounded-lg border bg-card p-4 space-y-2">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="size-4 text-green-500" />
                <h3 className="font-semibold text-sm">Chain with await</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                All transition methods return Promises. Use await to sequence
                camera moves for guided tours and cinematic fly-throughs.
              </p>
            </div>
            <div className="rounded-lg border bg-card p-4 space-y-2">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="size-4 text-green-500" />
                <h3 className="font-semibold text-sm">
                  Add collision boundaries
                </h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Use distance limits, polar/azimuth constraints, and
                <code> colliderMeshes</code> to prevent the camera from going
                through walls or flying off into space.
              </p>
            </div>
          </div>
        </section>
      </ScrollReveal>
    </div>
  );
}
