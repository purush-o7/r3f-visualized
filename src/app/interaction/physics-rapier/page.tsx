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
    import("./_components/physics-demo").then((m) => ({
      default: m.PhysicsDemo,
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
    title: "Moving physics objects with position props",
    subtitle: "Setting position directly bypasses the physics engine",
    wrongCode: `function Ball({ pos }) {
  // This teleports the object, ignoring physics!
  return (
    <RigidBody position={pos}>
      <mesh>
        <sphereGeometry />
      </mesh>
    </RigidBody>
  )
}
// Updating pos re-renders and teleports
<Ball pos={[newX, newY, newZ]} />`,
    rightCode: `function Ball() {
  const body = useRef(null)

  const push = () => {
    // Use the physics API to apply forces
    body.current.applyImpulse(
      { x: 0, y: 5, z: 0 }, true
    )
  }

  return (
    <RigidBody ref={body}>
      <mesh onClick={push}>
        <sphereGeometry />
      </mesh>
    </RigidBody>
  )
}`,
    filename: "PhysicsBall.tsx",
    explanation:
      "RigidBody position is the initial position. To move physics objects after creation, use applyImpulse, applyForce, setLinvel, or setTranslation on the rigid body ref. Direct position changes bypass collision detection.",
  },
  {
    title: "Forgetting to wrap scene in <Physics>",
    subtitle: "RigidBody components silently do nothing without a Physics provider",
    wrongCode: `<Canvas>
  {/* No <Physics> wrapper! */}
  <RigidBody>
    <mesh>
      <boxGeometry />
    </mesh>
  </RigidBody>
</Canvas>`,
    rightCode: `<Canvas>
  <Physics gravity={[0, -9.81, 0]}>
    <RigidBody>
      <mesh>
        <boxGeometry />
      </mesh>
    </RigidBody>
  </Physics>
</Canvas>`,
    filename: "Scene.tsx",
    explanation:
      "RigidBody needs a Physics provider as an ancestor. Without it, physics simply does not run. The Physics component initializes the Rapier world, sets up the simulation loop, and manages all rigid bodies within it.",
  },
  {
    title: "No fixed floor for objects to land on",
    subtitle: "Everything falls through infinity",
    wrongCode: `<Physics>
  {/* Balls just fall forever */}
  <RigidBody>
    <mesh>
      <sphereGeometry />
    </mesh>
  </RigidBody>
</Physics>`,
    rightCode: `<Physics>
  <RigidBody>
    <mesh>
      <sphereGeometry />
    </mesh>
  </RigidBody>

  {/* Fixed body = immovable ground */}
  <RigidBody type="fixed">
    <mesh>
      <boxGeometry args={[10, 0.5, 10]} />
    </mesh>
  </RigidBody>
</Physics>`,
    filename: "Scene.tsx",
    explanation:
      "Without a fixed rigid body acting as the ground, dynamic objects fall indefinitely. Set type='fixed' on floor and wall objects so they have collision shapes but are not affected by gravity.",
  },
];

export default function PhysicsRapierPage() {
  return (
    <div className="max-w-4xl ambient-canvas">
      {/* ── 1. Title + Badge + Intro ── */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-3">
          <Badge variant="outline">Animation & Physics</Badge>
        </div>
        <h1 className="text-3xl font-bold tracking-tight mb-3">
          Physics with Rapier
        </h1>
        <p className="text-lg text-muted-foreground">
          Drop a ball on a table and it bounces. Push a box and it slides. Stack
          blocks and they topple. Rapier turns your 3D scene into a real physics
          simulation where gravity, collisions, and forces just work. The
          react-three/rapier library brings the Rapier physics engine to R3F
          with a declarative API that feels like regular React components.
        </p>
      </div>

      {/* ── 2. WhatCouldGoWrong ── */}
      <WhatCouldGoWrong
        scenario={`You build a game where clicking a ball should launch it upward. Instead of using the physics API, you update the ball's position prop with React state. The ball teleports to the new position, clipping through walls and floors because the physics engine never knew it moved.`}
        error={`RigidBody position changed via React props.
Object teleported from [0, 0, 0] to [0, 5, 0].
Collision detection skipped -- object passed through floor collider.
Use rigidBodyRef.current.applyImpulse() for physics-driven movement.`}
        errorType="Logic"
      />

      <Separator className="my-8" />

      {/* ── 3. Story Analogy ── */}
      <ScrollReveal>
        <ConversationalCallout type="story">
          <p>
            Imagine building a Rube Goldberg machine. You place a ball at the
            top of a ramp, a domino chain in the middle, and a bucket at the
            end. You do not animate each piece individually -- you set up the
            initial conditions and let gravity do the rest.
          </p>
          <p>
            That is exactly what Rapier does. You describe the shapes, masses,
            and materials. You tell it about gravity. Then you press play and
            the physics engine calculates what happens -- 60 times per second,
            with proper collision detection, friction, and bouncing.
          </p>
          <p>
            <code>&lt;Physics&gt;</code> is your universe.{" "}
            <code>&lt;RigidBody&gt;</code> is any object that lives in that
            universe and obeys its laws.
          </p>
        </ConversationalCallout>
      </ScrollReveal>

      <Separator className="my-8" />

      {/* ── 4. SimpleFlow ── */}
      <ScrollReveal>
        <h2 className="text-2xl font-bold mb-4">How Rapier Physics Works</h2>
        <SimpleFlow
          steps={[
            { label: "Wrap in <Physics>", detail: "Creates a Rapier world with gravity" },
            { label: "Add <RigidBody>", detail: "Each one becomes a physics-simulated object" },
            { label: "Auto colliders", detail: "Rapier generates collision shapes from your meshes" },
            { label: "Simulation runs", detail: "Forces, gravity, collisions computed each frame" },
            { label: "Meshes sync", detail: "Visual positions update to match physics state", status: "success" },
          ]}
        />
      </ScrollReveal>

      <Separator className="my-8" />

      {/* ── 5. Demo ── */}
      <ScrollReveal>
        <h2 className="text-2xl font-bold mb-4">Newton&apos;s Playground</h2>
        <p className="text-muted-foreground mb-4">
          A physics sandbox. Boxes are stacked on a floor, ready to be knocked
          over. Use the controls to drop balls from above, adjust gravity
          strength, and change bounciness. Watch how objects interact, stack,
          bounce, and topple with real-time physics.
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
            Step 1 -- Set up the physics world
          </p>
          <p className="text-sm text-muted-foreground mb-3">
            Wrap your scene content in a <code>&lt;Physics&gt;</code> component.
            This creates the Rapier simulation world. The <code>gravity</code>
            prop takes a <code>[x, y, z]</code> vector -- Earth gravity is
            roughly <code>[0, -9.81, 0]</code>.
          </p>
          <CodeBlock
            code={`import { Physics, RigidBody } from "@react-three/rapier"

function Scene() {
  return (
    <Canvas>
      <Physics gravity={[0, -9.81, 0]}>
        {/* Everything inside here is part of the simulation */}
      </Physics>
    </Canvas>
  )
}`}
            filename="Scene.tsx"
          />
        </div>

        {/* Step 2 */}
        <div className="rounded-lg border bg-card p-4 mb-4">
          <p className="text-sm font-semibold mb-2">
            Step 2 -- Add rigid bodies
          </p>
          <p className="text-sm text-muted-foreground mb-3">
            Wrap any mesh in <code>&lt;RigidBody&gt;</code> to make it a
            physics object. By default it is dynamic (affected by gravity and
            forces). Use <code>type=&quot;fixed&quot;</code> for immovable
            objects like floors and walls.
          </p>
          <CodeBlock
            code={`<Physics gravity={[0, -9.81, 0]}>
  {/* Dynamic -- falls and bounces */}
  <RigidBody restitution={0.7} friction={0.5}>
    <mesh>
      <sphereGeometry args={[0.5, 32, 32]} />
      <meshStandardMaterial color="tomato" />
    </mesh>
  </RigidBody>

  {/* Fixed -- immovable ground */}
  <RigidBody type="fixed">
    <mesh>
      <boxGeometry args={[10, 0.5, 10]} />
      <meshStandardMaterial color="slategray" />
    </mesh>
  </RigidBody>
</Physics>`}
            filename="Scene.tsx"
          />
          <p className="text-sm text-muted-foreground mt-2">
            <code>restitution</code> controls bounciness (0 = no bounce, 1 =
            perfect bounce). <code>friction</code> controls sliding resistance.
          </p>
        </div>

        {/* Step 3 */}
        <div className="rounded-lg border bg-card p-4 mb-4">
          <p className="text-sm font-semibold mb-2">
            Step 3 -- Apply forces and impulses
          </p>
          <p className="text-sm text-muted-foreground mb-3">
            To move physics objects, use the rigid body API. Get a ref to the
            RigidBody and call methods like <code>applyImpulse</code> (instant
            push) or <code>applyForce</code> (continuous push).
          </p>
          <CodeBlock
            code={`import { useRef } from "react"
import { RigidBody, RapierRigidBody } from "@react-three/rapier"

function LaunchBall() {
  const body = useRef<RapierRigidBody>(null)

  const launch = () => {
    body.current?.applyImpulse(
      { x: 0, y: 8, z: 0 },  // upward push
      true                      // wake up if sleeping
    )
  }

  return (
    <RigidBody ref={body} colliders="ball">
      <mesh onClick={launch}>
        <sphereGeometry args={[0.4]} />
        <meshStandardMaterial color="dodgerblue" />
      </mesh>
    </RigidBody>
  )
}`}
            filename="LaunchBall.tsx"
          />
        </div>
      </ScrollReveal>

      <Separator className="my-8" />

      {/* ── 7. WhatYouJustLearned ── */}
      <WhatYouJustLearned
        points={[
          "<Physics> creates a Rapier simulation world with configurable gravity",
          "<RigidBody> makes any mesh a physics object -- dynamic by default, or type='fixed' for static",
          "Colliders are auto-generated from mesh geometry, or you can specify 'ball', 'cuboid', etc.",
          "Move physics objects with applyImpulse or applyForce, never by changing position props",
          "Restitution controls bounciness (0-1+), friction controls sliding resistance",
        ]}
      />

      <Separator className="my-8" />

      {/* ── 8. Question Callout ── */}
      <ScrollReveal>
        <ConversationalCallout type="question">
          <p>
            What is the difference between <code>applyImpulse</code> and{" "}
            <code>applyForce</code>? An impulse is an instant push -- like
            hitting a billiard ball with a cue. A force is continuous -- like
            wind pushing a sail. Use impulse for one-time events (clicks, jumps)
            and force for ongoing effects (thrusters, magnets) applied inside
            useFrame.
          </p>
        </ConversationalCallout>
      </ScrollReveal>

      <Separator className="my-8" />

      {/* ── 9. AhaMoment ── */}
      <AhaMoment
        setup='Why does Rapier use a separate "physics world" instead of just adding forces to Three.js objects directly?'
        reveal="Physics simulation is computationally expensive and needs to run at a fixed timestep (e.g., 60Hz) regardless of rendering frame rate. If physics ran inside the render loop, a frame rate drop would cause objects to move in slow motion. Rapier runs its own fixed-rate simulation loop, accumulating time between renders. This means physics stays consistent whether you render at 30fps or 144fps -- the ball always falls at the same speed."
      />

      <Separator className="my-8" />

      {/* ── 10. MentalModelChallenge ── */}
      <MentalModelChallenge
        question="You set restitution to 1.0 on both a ball and the floor. You drop the ball from 3 meters. What happens?"
        options={[
          {
            label: "The ball bounces back to exactly 3 meters, forever",
            correct: true,
            explanation:
              "Restitution 1.0 means a perfectly elastic collision -- no energy is lost. In theory, the ball bounces to the same height indefinitely (in practice, floating point errors may cause tiny drift).",
          },
          {
            label: "The ball bounces higher than 3 meters",
            correct: false,
            explanation:
              "Restitution 1.0 means 100% energy conservation, not amplification. The ball returns to its original height, never higher (unless you set restitution above 1.0, which Rapier allows as a cheat).",
          },
          {
            label: "The ball bounces a few times then stops",
            correct: false,
            explanation:
              "That would happen with restitution less than 1.0, where energy is lost on each bounce. At 1.0, the collision is perfectly elastic.",
          },
        ]}
        answer="Restitution 1.0 creates a perfectly elastic collision. The ball bounces back to its drop height because no kinetic energy is lost. In real physics this is impossible, but in simulation it is the default for 'no energy loss.' Values above 1.0 actually add energy, making the ball bounce higher each time."
      />

      <Separator className="my-8" />

      {/* Try This */}
      <Separator className="my-8" />
      <ScrollReveal>
        <TryThisList challenges={[
          { challenge: "Set gravity to -1 — moon gravity!", hint: "Lower the gravity value to -1 in the physics controls.", solution: "Objects fall in slow motion like on the Moon, bouncing gently and floating longer.", difficulty: "beginner" },
          { challenge: "Set bounciness to 1.2 — super bouncy!", hint: "Set the restitution (bounciness) above 1.0.", solution: "Objects bounce higher than where they fell from! Values above 1 add energy on each bounce.", difficulty: "beginner" },
          { challenge: "Drop 15 balls at once — chaos!", hint: "Click the spawn button rapidly to drop many balls at once.", solution: "Multiple physics bodies collide and interact simultaneously, showing Rapier handling complex multi-body simulation.", difficulty: "beginner" },
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
                  Use simple colliders when possible
                </h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Sphere and cuboid colliders are much faster than trimesh
                colliders. Use <code>colliders=&quot;ball&quot;</code> or{" "}
                <code>colliders=&quot;cuboid&quot;</code> instead of the
                auto-generated mesh shape for better performance.
              </p>
            </div>
            <div className="rounded-lg border bg-card p-4 space-y-2">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="size-4 text-green-500" />
                <h3 className="font-semibold text-sm">
                  Set type=&quot;fixed&quot; on static objects
                </h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Floors, walls, and platforms should be <code>fixed</code>. This
                tells Rapier they never move, allowing major performance
                optimizations in collision detection.
              </p>
            </div>
            <div className="rounded-lg border bg-card p-4 space-y-2">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="size-4 text-green-500" />
                <h3 className="font-semibold text-sm">
                  Limit active rigid bodies
                </h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Each dynamic rigid body adds computational cost. For scenes
                with many objects, use <code>type=&quot;kinematicPosition&quot;</code>
                for objects you control manually, and keep truly dynamic
                objects under ~100 for smooth performance.
              </p>
            </div>
            <div className="rounded-lg border bg-card p-4 space-y-2">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="size-4 text-green-500" />
                <h3 className="font-semibold text-sm">
                  Use events for game logic
                </h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Rapier fires collision events via <code>onCollisionEnter</code>
                and <code>onCollisionExit</code> on RigidBody. Use these to
                trigger game logic (scoring, damage, sound effects) instead of
                checking positions manually.
              </p>
            </div>
          </div>
        </section>
      </ScrollReveal>
    </div>
  );
}
