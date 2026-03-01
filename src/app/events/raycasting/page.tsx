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
    import("./_components/raycast-demo").then((m) => ({
      default: m.RaycastDemo,
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
    title: "Raycasting against complex geometry",
    subtitle: "Testing 50,000 triangles per click when a simple box would do",
    wrongCode: `// 50k polygon model -- 50k triangle tests per click
<mesh onClick={() => console.log('Clicked!')}>
  <primitive object={gltf.scene} />
</mesh>`,
    rightCode: `// Invisible simple collider for fast raycasting
<group>
  <primitive object={gltf.scene} raycast={() => null} />
  <mesh visible={false} onClick={() => console.log('Clicked!')}>
    <sphereGeometry args={[1.5, 8, 8]} />
  </mesh>
</group>`,
    filename: "Model.tsx",
    explanation:
      "Raycasting tests the ray against every triangle in the geometry. A 50,000 polygon model means 50,000 triangle intersection tests per pointer event. Instead, overlay a simple invisible collider (sphere, box, or capsule) that approximates the shape, and disable raycasting on the visual mesh with raycast={() => null}.",
  },
  {
    title: "Not using layers for selective raycasting",
    subtitle: "Testing every object in the scene when you only need a few",
    wrongCode: `// Tests EVERYTHING in the scene
const hits = raycaster.current.intersectObjects(
  scene.children, true
)`,
    rightCode: `// Only test against specific targets
const hits = raycaster.current.intersectObjects(
  targetsRef.current, false
)

// Or use Three.js layers:
// raycaster.current.layers.set(1)
// targetMesh.layers.enable(1)`,
    filename: "Shooter.tsx",
    explanation:
      "intersectObjects(scene.children, true) recursively tests every object in the scene. If you only care about a few targets, maintain an array of target refs or use Three.js layers to partition the scene. Set the raycaster to check only specific layers.",
  },
  {
    title: "Creating new objects inside useFrame for raycasting",
    subtitle: "Allocating memory every frame causes stutter",
    wrongCode: `useFrame(() => {
  // NEW objects every frame = garbage collection stutter
  const origin = new THREE.Vector3(0, 5, 0)
  const direction = new THREE.Vector3(0, -1, 0)
  const raycaster = new THREE.Raycaster(origin, direction)
})`,
    rightCode: `const origin = useRef(new THREE.Vector3(0, 5, 0))
const direction = useRef(new THREE.Vector3(0, -1, 0))
const raycaster = useRef(new THREE.Raycaster())

useFrame(() => {
  raycaster.current.set(origin.current, direction.current)
  // Same objects reused -- zero garbage
})`,
    filename: "FrameRaycast.tsx",
    explanation:
      "Creating new Vector3 and Raycaster objects inside useFrame allocates memory 60 times per second. The garbage collector eventually pauses your app to clean them up, causing visible stutter. Store these in useRef and reuse them with .set() or .copy().",
  },
];

export default function RaycastingPage() {
  return (
    <div className="max-w-4xl ambient-canvas">
      {/* ── 1. Title + Badge + Intro ── */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-3">
          <Badge variant="outline">Events & Interaction</Badge>
        </div>
        <h1 className="text-3xl font-bold tracking-tight mb-3">Raycasting</h1>
        <p className="text-lg text-muted-foreground">
          Pointer events feel like magic -- you click a 3D cube and it responds.
          But how does the computer know which object you clicked? It cannot
          just check pixel colors like a 2D app. It needs to fire an invisible
          ray from your mouse into the 3D world and see what it hits. That
          process is called raycasting, and understanding it unlocks everything
          from click detection to shooting mechanics to AI line-of-sight.
        </p>
      </div>

      {/* ── 2. WhatCouldGoWrong ── */}
      <WhatCouldGoWrong
        scenario={`You attach onClick to a detailed 3D character model with 100,000 triangles. Every time the user clicks anywhere on the canvas, R3F raycasts against all 100,000 triangles to check if the click hit the model. Your click response takes 50ms and the whole scene stutters.`}
        error={`Performance: intersectObject() took 47ms for mesh "Character"
  - Geometry faces: 100,000
  - Triangle intersection tests: 100,000
  - Consider using a simplified collider or meshBounds.`}
        errorType="Performance"
      />

      <Separator className="my-8" />

      {/* ── 3. Story Analogy ── */}
      <ScrollReveal>
        <ConversationalCallout type="story">
          <p>
            Imagine you are in a dark room full of people, and you have a laser
            pointer. You aim it straight ahead and the beam travels in a
            straight line until it hits the first person. You now know exactly
            who is standing in that direction, how far away they are, and which
            part of them the beam touched.
          </p>
          <p>
            That is raycasting. An invisible ray shoots from your camera through
            the mouse position into the 3D world. It tests every object along
            its path and reports what it hit first, where it hit, and how far
            away. R3F does this automatically for pointer events, but you can
            also cast rays manually for custom mechanics.
          </p>
        </ConversationalCallout>
      </ScrollReveal>

      <Separator className="my-8" />

      {/* ── 4. SimpleFlow ── */}
      <ScrollReveal>
        <h2 className="text-2xl font-bold mb-4">The Raycasting Pipeline</h2>
        <SimpleFlow
          steps={[
            { label: "Camera + Mouse", detail: "Pointer position mapped to normalized coordinates" },
            { label: "Cast a Ray", detail: "From camera origin through mouse point" },
            { label: "Test Intersections", detail: "Ray vs. triangles of each mesh" },
            { label: "Sort by Distance", detail: "Nearest hit comes first" },
            { label: "Dispatch Event", detail: "onClick fires on the closest object", status: "success" },
          ]}
        />
      </ScrollReveal>

      <Separator className="my-8" />

      {/* ── 5. Demo ── */}
      <ScrollReveal>
        <h2 className="text-2xl font-bold mb-4">See It In Action</h2>
        <p className="text-muted-foreground mb-4">
          The demo below visualizes raycasting in real time. Watch the ray
          extend from the camera and see which objects it intersects as you
          move your mouse.
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
            Step 1 -- Understand automatic raycasting
          </p>
          <p className="text-sm text-muted-foreground mb-3">
            When you add <code>onClick</code> or <code>onPointerOver</code> to
            a mesh, R3F automatically raycasts against that object. You do not
            need to set up a raycaster yourself. Only meshes with event
            handlers are tested -- everything else is invisible to the ray.
          </p>
          <CodeBlock
            code={`// R3F raycasts against this mesh automatically
<mesh onClick={(e) => {
  console.log('Hit at:', e.point)
  console.log('Distance:', e.distance)
}}>
  <sphereGeometry args={[1, 32, 32]} />
  <meshStandardMaterial />
</mesh>`}
            filename="AutoRaycast.tsx"
          />
          <p className="text-sm text-muted-foreground mt-2">
            The event object gives you the exact 3D hit position, the distance
            from the camera, the face that was hit, and more. No manual setup
            required.
          </p>
        </div>

        {/* Step 2 */}
        <div className="rounded-lg border bg-card p-4 mb-4">
          <p className="text-sm font-semibold mb-2">
            Step 2 -- Use meshBounds for fast approximate hits
          </p>
          <p className="text-sm text-muted-foreground mb-3">
            For complex geometry where pixel-perfect accuracy is not critical,
            drei&apos;s <code>meshBounds</code> replaces per-triangle raycasting
            with a single bounding-box test. Thousands of times faster.
          </p>
          <CodeBlock
            code={`import { meshBounds } from '@react-three/drei'

<mesh
  raycast={meshBounds}
  onClick={() => console.log('Bounding box hit!')}
>
  <torusKnotGeometry args={[1, 0.3, 256, 64]} />
  <meshStandardMaterial color="purple" />
</mesh>`}
            filename="FastClick.tsx"
          />
          <p className="text-sm text-muted-foreground mt-2">
            For a 16,000-triangle torus knot, this turns 16,000 intersection
            tests into just 1 box test. Clicks near the edges may register
            outside the actual geometry, but for buttons and UI that is fine.
          </p>
        </div>

        {/* Step 3 */}
        <div className="rounded-lg border bg-card p-4 mb-4">
          <p className="text-sm font-semibold mb-2">
            Step 3 -- Cast rays manually for custom mechanics
          </p>
          <p className="text-sm text-muted-foreground mb-3">
            For shooting, line-of-sight, or ground detection, create a
            Raycaster yourself and cast rays in any direction, not just from
            the mouse.
          </p>
          <CodeBlock
            code={`const raycaster = useRef(new THREE.Raycaster())
const down = useRef(new THREE.Vector3(0, -1, 0))

useFrame(() => {
  raycaster.current.set(player.position, down.current)
  const hits = raycaster.current.intersectObjects(ground)
  if (hits.length > 0) {
    player.position.y = hits[0].point.y + 1
  }
})`}
            filename="GroundSnap.tsx"
          />
          <p className="text-sm text-muted-foreground mt-2">
            This casts a ray straight down from the player to find the ground,
            then snaps the player to the surface. The same idea powers
            shooters (ray from gun barrel), AI vision (ray toward target), and
            physics (collision probes).
          </p>
        </div>
      </ScrollReveal>

      <Separator className="my-8" />

      {/* ── 7. WhatYouJustLearned ── */}
      <WhatYouJustLearned
        points={[
          "Raycasting shoots an invisible ray and reports what it hits in the 3D scene",
          "R3F raycasts automatically for pointer events -- only objects with handlers are tested",
          "meshBounds from drei replaces per-triangle testing with a fast bounding-box check",
          "You can cast rays manually for shooting, line-of-sight, and ground detection",
          "Always store Raycaster and Vector3 objects in refs to avoid garbage collection stutter",
        ]}
      />

      <Separator className="my-8" />

      {/* ── 8. Question Callout ── */}
      <ScrollReveal>
        <ConversationalCallout type="question">
          <p>
            How does raycasting work with InstancedMesh? By default, R3F does
            not raycast individual instances -- it tests the base bounding box.
            For per-instance click detection, you need to implement a custom
            raycast function or use drei&apos;s{" "}
            <code>&lt;Instances&gt;</code> component which provides
            per-instance event support out of the box.
          </p>
        </ConversationalCallout>
      </ScrollReveal>

      <Separator className="my-8" />

      {/* ── 9. AhaMoment ── */}
      <AhaMoment
        setup="If R3F only raycasts against objects with event handlers, what happens to all the other objects in the scene?"
        reveal="They are completely invisible to the raycaster. This is a brilliant performance optimization. If you have 500 decorative objects and 5 interactive buttons, only those 5 buttons are tested on each pointer event. The 500 decorative objects cost exactly zero raycasting time. This is why you should never add empty event handlers to objects you do not need to interact with -- each handler adds that object to the raycasting pool."
      />

      <Separator className="my-8" />

      {/* ── 10. MentalModelChallenge ── */}
      <MentalModelChallenge
        question="You have a 3D car model with 80,000 triangles. You want users to click it to open a detail panel. What is the fastest approach?"
        options={[
          {
            label: "Attach onClick directly to the car mesh",
            correct: false,
            explanation:
              "This raycasts against all 80,000 triangles on every click event. Extremely slow.",
          },
          {
            label: "Use meshBounds on the car mesh",
            correct: true,
            explanation:
              "This replaces 80,000 triangle tests with 1 bounding-box test. Fast but slightly imprecise at the edges.",
          },
          {
            label: "Add an invisible box collider and disable raycasting on the car",
            correct: true,
            explanation:
              "A simple invisible box with onClick handles the interaction. Set raycast={() => null} on the visual mesh. Maximum performance with reasonable accuracy.",
          },
        ]}
        answer="Both meshBounds and invisible colliders work well. meshBounds is simpler (one prop), while a custom collider gives you more control over the hit area. The key principle: never raycast against complex geometry when a simple approximation will do. Users rarely notice the difference between clicking a 80,000-triangle mesh and clicking its bounding box."
      />

      <Separator className="my-8" />

      {/* Try These Challenges */}
      <ScrollReveal>
        <TryThisList challenges={[
          { challenge: "Toggle showRay off -- do events still work?", hint: "The visible ray is just a visual helper. The actual raycasting is done internally by R3F.", solution: "Yes, events still work perfectly. The visible ray line is just a debug visualization. R3F performs raycasting internally and invisibly on every pointer event. Hiding the visual ray does not affect the raycasting logic at all -- it just removes the debug helper from the scene.", difficulty: "beginner" },
          { challenge: "Set targetSize to 2 -- easier to hit!", hint: "Larger geometry means more triangles for the ray to test against, but also a bigger target area.", solution: "The target objects become larger, making them much easier to click. Raycasting tests the ray against the geometry's triangles, so larger geometry means a larger hit area. In game design, making interactive targets slightly larger than they appear (using invisible colliders) is a common trick to improve usability.", difficulty: "beginner" },
          { challenge: "Switch rayColor -- is it cosmetic only?", hint: "The ray color is a visual property of the debug line. Does it affect intersection testing?", solution: "Changing the ray color is purely cosmetic. It only affects the color of the visible debug line in the scene. The actual raycasting math does not use color at all -- it only cares about ray origin, direction, and the geometry of potential targets. Color is just a visual aid for understanding what is happening.", difficulty: "beginner" },
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
                <h3 className="font-semibold text-sm">Use simplified colliders</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                For complex models, overlay an invisible simple mesh for
                raycasting. Disable raycasting on the visual mesh with{" "}
                <code>raycast={"{() => null}"}</code>.
              </p>
            </div>
            <div className="rounded-lg border bg-card p-4 space-y-2">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="size-4 text-green-500" />
                <h3 className="font-semibold text-sm">Minimize event handlers</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Every mesh with a handler is a raycasting target. Fewer
                handlers means fewer intersection tests per pointer event.
              </p>
            </div>
            <div className="rounded-lg border bg-card p-4 space-y-2">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="size-4 text-green-500" />
                <h3 className="font-semibold text-sm">
                  Reuse objects in useFrame
                </h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Store Raycaster and Vector3 objects in refs. Never create new
                instances inside the frame loop.
              </p>
            </div>
            <div className="rounded-lg border bg-card p-4 space-y-2">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="size-4 text-green-500" />
                <h3 className="font-semibold text-sm">
                  meshBounds for UI elements
                </h3>
              </div>
              <p className="text-sm text-muted-foreground">
                For buttons and clickable items, <code>meshBounds</code> from
                drei provides near-instant raycasting with minimal code.
              </p>
            </div>
          </div>
        </section>
      </ScrollReveal>
    </div>
  );
}
