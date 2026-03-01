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

const OrbitDemo = dynamic(
  () => import("./_components/orbit-demo").then((m) => ({ default: m.OrbitDemo })),
  {
    ssr: false,
    loading: () => (
      <div className="w-full aspect-[2/1] rounded-xl border bg-scene-bg animate-pulse" />
    ),
  }
);

const mistakes: Mistake[] = [
  {
    title: "Not using makeDefault",
    subtitle: "Camera state gets out of sync with controls",
    wrongCode: `<OrbitControls />
<TransformControls>
  <mesh />
</TransformControls>
// TransformControls can't disable OrbitControls
// because it doesn't know they exist`,
    rightCode: `<OrbitControls makeDefault />
<TransformControls>
  <mesh />
</TransformControls>
// Now TransformControls can pause orbit while dragging`,
    filename: "Experience.tsx",
    explanation:
      "The makeDefault prop registers OrbitControls in R3F's internal state store. Without it, other drei components like TransformControls or GizmoHelper cannot disable orbit when they need exclusive camera control. It also keeps the camera state synchronized with R3F's event system. Always add makeDefault unless you have a specific reason not to.",
  },
  {
    title: "Scene freezes with demand rendering",
    subtitle: "Damping animation stops mid-deceleration",
    wrongCode: `<Canvas frameloop="demand">
  <OrbitControls enableDamping dampingFactor={0.05} />
  {/* Scene freezes mid-deceleration when you
      release the mouse — no one calls invalidate() */}
</Canvas>`,
    rightCode: `<Canvas frameloop="demand">
  <OrbitControls makeDefault enableDamping />
  {/* makeDefault auto-invalidates during damping */}
</Canvas>`,
    filename: "DemandMode.tsx",
    explanation:
      "In demand mode, the canvas only renders when told to. Damping needs extra frames after you release the mouse because the camera is still decelerating. Without invalidation, the scene freezes mid-motion. Using makeDefault handles this automatically.",
  },
  {
    title: "Controls on the wrong camera",
    subtitle: "Custom camera is ignored, default camera moves instead",
    wrongCode: `<perspectiveCamera ref={camRef} position={[5, 5, 5]} />
<OrbitControls />
// Attaches to the DEFAULT camera, not yours!`,
    rightCode: `// Set camera through Canvas props instead
<Canvas camera={{ position: [5, 5, 5], fov: 50 }}>
  <OrbitControls makeDefault />
</Canvas>`,
    filename: "CustomCamera.tsx",
    explanation:
      "OrbitControls attaches to whatever camera is in R3F's state — the Canvas default camera. If you create a separate <perspectiveCamera>, OrbitControls will not use it. Configure the camera through the Canvas camera prop and let OrbitControls pick it up via makeDefault.",
  },
];

export default function OrbitControlsPage() {
  return (
    <div className="max-w-4xl ambient-drei">
      {/* 1. Title + Badge + Intro */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-3">
          <Badge variant="outline">Controls</Badge>
        </div>
        <h1 className="text-3xl font-bold tracking-tight mb-3">
          OrbitControls
        </h1>
        <p className="text-lg text-muted-foreground">
          OrbitControls is the simplest way to let users explore a 3D scene.
          Drop it in, and people can drag to rotate, scroll to zoom, and
          right-click to pan. It is the default choice for almost every
          R3F project.
        </p>
      </div>

      {/* 2. What Could Go Wrong */}
      <WhatCouldGoWrong
        scenario="You add OrbitControls to your scene and everything works great. Then you add TransformControls to let users move an object. Now when you drag the gizmo, the entire camera spins at the same time. Both controls fight for the mouse, and the scene becomes unusable."
        error="Camera orbits while TransformControls gizmo is being dragged. Both controls respond to the same mouse events simultaneously."
        errorType="Controls Conflict"
      />

      <Separator className="my-8" />

      {/* 3. Story Analogy */}
      <ScrollReveal>
        <ConversationalCallout type="story">
          <p>
            Picture a globe on a desk stand. You grab the globe and spin it to
            see different continents. You scroll the stand up and down to zoom
            in on a country. You slide the whole stand left or right to re-center
            your view.
          </p>
          <p>
            That is exactly what OrbitControls does. Your 3D object is the globe,
            and the camera orbits around it on an invisible stand. Left-drag to
            spin, scroll to zoom, right-drag to slide. The object stays put
            while you move around it.
          </p>
        </ConversationalCallout>
      </ScrollReveal>

      <Separator className="my-8" />

      {/* 4. SimpleFlow — Mental Model */}
      <ScrollReveal>
        <section className="space-y-4">
          <h2 className="text-2xl font-bold">How OrbitControls Works</h2>
          <p className="text-muted-foreground leading-relaxed">
            Every mouse action maps to a camera movement around a fixed target
            point.
          </p>
          <SimpleFlow
            steps={[
              {
                label: "Left Drag",
                detail: "Orbit (rotate around target)",
              },
              {
                label: "Scroll Wheel",
                detail: "Dolly (zoom in/out)",
              },
              {
                label: "Right Drag",
                detail: "Pan (shift target sideways)",
              },
              {
                label: "Camera Moves",
                detail: "Object stays still",
                status: "success",
              },
            ]}
          />
        </section>
      </ScrollReveal>

      <Separator className="my-8" />

      {/* 5. Interactive Demo */}
      <OrbitDemo />

      <Separator className="my-8" />

      {/* 6. Guided Walkthrough */}
      <ScrollReveal>
        <section className="space-y-6">
          <h2 className="text-2xl font-bold">Guided Walkthrough</h2>
          <p className="text-muted-foreground leading-relaxed">
            Let us go from zero to a polished orbit setup in three steps.
          </p>

          <div className="bg-card border rounded-lg p-4 space-y-3">
            <h3 className="font-semibold text-sm">
              Step 1 — Drop in OrbitControls
            </h3>
            <CodeBlock
              code={`import { OrbitControls } from '@react-three/drei'

function Experience() {
  return (
    <>
      <OrbitControls makeDefault />
      <mesh>
        <boxGeometry />
        <meshStandardMaterial color="royalblue" />
      </mesh>
      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 5, 5]} />
    </>
  )
}`}
              filename="Experience.tsx"
            />
            <p className="text-sm text-muted-foreground">
              One line and you get full orbit, zoom, and pan. The makeDefault
              prop tells R3F &quot;these are my controls&quot; so everything
              stays in sync.
            </p>
          </div>

          <div className="bg-card border rounded-lg p-4 space-y-3">
            <h3 className="font-semibold text-sm">
              Step 2 — Constrain the movement
            </h3>
            <CodeBlock
              code={`<OrbitControls
  makeDefault
  minPolarAngle={Math.PI / 6}    // can't look from above
  maxPolarAngle={Math.PI / 2}    // can't go underground
  minDistance={2}                  // closest zoom
  maxDistance={10}                 // farthest zoom
/>`}
              filename="ConstrainedOrbit.tsx"
            />
            <p className="text-sm text-muted-foreground">
              Polar angles control the vertical range. Distance limits prevent
              users from zooming through the object or losing it in the
              distance. Essential for product viewers.
            </p>
          </div>

          <div className="bg-card border rounded-lg p-4 space-y-3">
            <h3 className="font-semibold text-sm">
              Step 3 — Add damping and auto-rotate
            </h3>
            <CodeBlock
              code={`<OrbitControls
  makeDefault
  enableDamping
  dampingFactor={0.05}
  autoRotate
  autoRotateSpeed={2}
/>`}
              filename="SmoothOrbit.tsx"
            />
            <p className="text-sm text-muted-foreground">
              Damping adds smooth momentum so the camera glides after you
              release the mouse. Auto-rotate slowly spins the scene, which
              looks great on landing pages and product showcases.
            </p>
          </div>
        </section>
      </ScrollReveal>

      <Separator className="my-8" />

      {/* 7. What You Just Learned */}
      <ScrollReveal>
        <WhatYouJustLearned
          points={[
            "OrbitControls gives you orbit, zoom, and pan with a single component",
            "makeDefault registers the controls so R3F and other drei components stay in sync",
            "Polar angles and distance limits constrain the camera to a comfortable range",
            "Damping adds smooth momentum, auto-rotate keeps the scene spinning",
          ]}
        />
      </ScrollReveal>

      <Separator className="my-8" />

      {/* 8. Thought-Provoking Question */}
      <ScrollReveal>
        <ConversationalCallout type="question">
          <p>
            OrbitControls always rotates the camera around a target point. But
            what if you need the camera to fly smoothly from one spot to
            another, like clicking on a part of a car to zoom into it? Can
            OrbitControls do that? (Hint: check out CameraControls.)
          </p>
        </ConversationalCallout>
      </ScrollReveal>

      <Separator className="my-8" />

      {/* 9. Aha Moment */}
      <ScrollReveal>
        <AhaMoment
          setup="Why does the makeDefault prop matter so much? It seems like OrbitControls works fine without it."
          reveal="makeDefault does not change how the controls feel. It registers them in R3F's internal state so that other components can find them. For example, TransformControls needs to temporarily disable orbit while you drag a gizmo. Without makeDefault, it has no way to pause orbit, and both controls fight over the mouse at the same time."
        />
      </ScrollReveal>

      <Separator className="my-8" />

      {/* 10. Mental Model Challenge */}
      <ScrollReveal>
        <MentalModelChallenge
          question="You set maxPolarAngle to Math.PI / 2 on your OrbitControls. What happens when a user tries to drag the camera below the ground plane?"
          options={[
            {
              label: "The camera passes through the ground",
              correct: false,
              explanation:
                "maxPolarAngle prevents the camera from going below the equator.",
            },
            {
              label: "The camera stops exactly at the horizon",
              correct: true,
              explanation:
                "Math.PI / 2 is 90 degrees, which is the equator of the orbit sphere. The camera cannot go further down.",
            },
            {
              label: "The controls throw an error",
              correct: false,
              explanation:
                "No error — the camera simply stops at the limit and the drag is ignored beyond that point.",
            },
            {
              label: "The camera snaps back to the top",
              correct: false,
              explanation:
                "There is no snapping. The camera smoothly stops at the polar angle limit.",
            },
          ]}
          answer="maxPolarAngle={Math.PI / 2} means the camera cannot orbit past 90 degrees from the top. That places the lowest camera position right at the horizon line. Users can look at the object from the side or above, but never from below. This is the most common constraint for architectural and product scenes."
        />
      </ScrollReveal>

      <Separator className="my-8" />

      {/* Try These Challenges */}
      <ScrollReveal>
        <TryThisList challenges={[
          { challenge: "Enable autoRotate and set autoRotateSpeed to 10 -- dizzy cam!", hint: "autoRotate makes the camera orbit automatically. Speed controls how fast.", solution: "The camera spins around the target at high speed, creating a dizzying effect. autoRotate is great for showcases and landing pages at low speeds (1-3), but at 10 it is disorienting. The user can still grab and override the rotation, then auto-rotate resumes when they release.", difficulty: "beginner" },
          { challenge: "Enable the constrained polar angle -- can you look underneath?", hint: "maxPolarAngle limits how far down the camera can orbit. PI/2 is the horizon.", solution: "With maxPolarAngle set to Math.PI / 2, the camera stops at the horizon and cannot orbit below the ground plane. This is the most common constraint for product viewers and architectural scenes where looking from underneath does not make sense.", difficulty: "beginner" },
          { challenge: "Toggle damping off -- feels snappy!", hint: "Damping adds smooth deceleration after you release the mouse. Without it, the camera stops immediately.", solution: "Without damping, the camera stops instantly when you release the mouse. There is no momentum or glide effect. It feels more responsive but less polished. Damping adds a professional feel by simulating inertia -- the camera keeps moving briefly after release, then gradually slows to a stop.", difficulty: "beginner" },
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
                <h3 className="font-semibold text-sm">Always use makeDefault</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                It costs nothing and prevents hard-to-debug conflicts with
                other drei components like TransformControls and GizmoHelper.
              </p>
            </div>
            <div className="rounded-lg border bg-card p-4 space-y-2">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="size-4 text-green-500" />
                <h3 className="font-semibold text-sm">Enable damping</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Always enable <code>enableDamping</code> for a polished feel.
                The default dampingFactor of 0.05 works well for most scenes.
              </p>
            </div>
            <div className="rounded-lg border bg-card p-4 space-y-2">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="size-4 text-green-500" />
                <h3 className="font-semibold text-sm">Constrain for UX</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Set <code>maxPolarAngle</code> to prevent going underground
                and <code>minDistance/maxDistance</code> to keep the object in
                a comfortable zoom range.
              </p>
            </div>
            <div className="rounded-lg border bg-card p-4 space-y-2">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="size-4 text-green-500" />
                <h3 className="font-semibold text-sm">
                  Switch to CameraControls for animation
                </h3>
              </div>
              <p className="text-sm text-muted-foreground">
                If you need smooth programmatic camera transitions like
                click-to-focus or guided tours, CameraControls is the right
                tool for the job.
              </p>
            </div>
          </div>
        </section>
      </ScrollReveal>
    </div>
  );
}
