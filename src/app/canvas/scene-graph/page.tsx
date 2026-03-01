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
    import("./_components/solar-system-demo").then((m) => ({
      default: m.SolarSystemDemo,
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
    title: "Assuming child position is in world space",
    subtitle: "Child transforms are relative to their parent",
    wrongCode: `// Moon at [5,0,0] is relative to Earth!
// World position = [4 + 5, 0, 0] = [9, 0, 0]
<mesh position={[4, 0, 0]}> {/* Earth */}
  <mesh position={[5, 0, 0]}> {/* Moon */}
    <sphereGeometry args={[0.08, 16, 16]} />
  </mesh>
</mesh>`,
    rightCode: `// Place moon relative to Earth (its parent)
<mesh position={[4, 0, 0]}> {/* Earth */}
  <mesh position={[0.6, 0, 0]}> {/* 0.6 from Earth */}
    <sphereGeometry args={[0.08, 16, 16]} />
  </mesh>
</mesh>`,
    filename: "SolarSystem.tsx",
    explanation:
      "A child's position is always in the parent's local coordinate space. position={[0.6, 0, 0]} on a child means 0.6 units from the parent's origin, not 0.6 units from the world origin.",
  },
  {
    title: "Sharing the same ref between two objects",
    subtitle: "Each scene graph node needs its own ref",
    wrongCode: `const ref = useRef<THREE.Group>(null)
// Second one overwrites the first!
<group ref={ref} position={[0, 0, 0]} />
<group ref={ref} position={[2, 0, 0]} />`,
    rightCode: `const groupA = useRef<THREE.Group>(null)
const groupB = useRef<THREE.Group>(null)
<group ref={groupA} position={[0, 0, 0]} />
<group ref={groupB} position={[2, 0, 0]} />`,
    filename: "Scene.tsx",
    explanation:
      "Each Three.js object is a unique instance. If you assign the same ref to multiple elements, only the last one rendered will be stored. Use separate refs for each object.",
  },
  {
    title: "Using the same object in two places",
    subtitle: "A Three.js object can only have one parent",
    wrongCode: `// Same scene object in two spots -- second steals it
<primitive object={gltf.scene} position={[0,0,0]} />
<primitive object={gltf.scene} position={[3,0,0]} />`,
    rightCode: `// Clone it for each instance
const clone1 = useMemo(() => gltf.scene.clone(), [gltf])
const clone2 = useMemo(() => gltf.scene.clone(), [gltf])

<primitive object={clone1} position={[0, 0, 0]} />
<primitive object={clone2} position={[3, 0, 0]} />`,
    filename: "ModelClone.tsx",
    explanation:
      "A Three.js Object3D can only have one parent in the scene graph. Adding it to a second parent removes it from the first. Clone the object for multiple instances.",
  },
];

export default function SceneGraphPage() {
  return (
    <div className="max-w-4xl ambient-canvas">
      {/* 1. Title + Badge + Intro */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-3">
          <Badge variant="outline">Canvas & Setup</Badge>
          <Badge variant="secondary" className="text-[10px]">
            Core Concept
          </Badge>
        </div>
        <h1 className="text-3xl font-bold tracking-tight mb-3">Scene Graph</h1>
        <p className="text-lg text-muted-foreground leading-relaxed">
          Every 3D scene is a tree of objects. Parents and children. When a
          parent moves, all its children follow. When a parent rotates, the
          children orbit along with it. This tree is called the scene graph,
          and in R3F, your JSX nesting IS the scene graph. Nest a{" "}
          <code>&lt;mesh&gt;</code> inside a <code>&lt;group&gt;</code>, and
          you have just built a parent-child relationship in 3D space.
        </p>
      </div>

      {/* 2. WhatCouldGoWrong */}
      <ScrollReveal>
        <WhatCouldGoWrong
          scenario={`You position the Moon at [5, 0, 0], thinking that is its world position. But it is a child of Earth, which is at [4, 0, 0]. The Moon ends up at [9, 0, 0] -- way out past Pluto. Your solar system looks ridiculous.`}
          error={`Moon world position: [9, 0, 0]
Expected: [5, 0, 0]
Actual: Earth(4) + Moon(5) = 9 units from center`}
          errorType="Logic Error"
        />
      </ScrollReveal>

      {/* 3. ConversationalCallout - Story Analogy */}
      <ScrollReveal>
        <ConversationalCallout type="story">
          <p>
            A scene graph works exactly like a family tree. If grandpa moves
            to a new city, the whole family goes with him. His children inherit
            his position. Their children inherit theirs.
          </p>
          <p>
            Now picture our solar system: the Sun is grandpa. Earth orbits the
            Sun (Earth is a child of the Sun). The Moon orbits Earth (Moon is a
            child of Earth). Rotate the Sun, and Earth moves. Rotate Earth,
            and the Moon moves. But the Moon does not need to know where the
            Sun is -- it only cares about its position relative to Earth.
          </p>
        </ConversationalCallout>
      </ScrollReveal>

      {/* 4. SimpleFlow - Mental Model */}
      <ScrollReveal>
        <SimpleFlow
          steps={[
            { label: "JSX Nesting", detail: "<group> > <mesh> > <mesh>" },
            { label: "Scene Graph", detail: "Parent-child tree in 3D" },
            { label: "Transform Inheritance", detail: "Children follow parents" },
            { label: "Local Coordinates", detail: "Positions are relative" },
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
          <h2 className="text-2xl font-bold">Building a Solar System</h2>
          <p className="text-muted-foreground leading-relaxed">
            The scene graph is easiest to understand with an example. Let us
            build a tiny solar system where each orbit is just parent-child
            nesting.
          </p>

          {/* Step 1 */}
          <div className="rounded-lg border bg-card p-4 space-y-3">
            <div className="flex items-center gap-2">
              <Badge variant="secondary">Step 1</Badge>
              <span className="font-semibold text-sm">
                Place the Sun at the center
              </span>
            </div>
            <p className="text-sm text-muted-foreground">
              The Sun sits at the origin [0, 0, 0]. It is the root of our
              little solar system.
            </p>
            <CodeBlock
              code={`<group>
  <mesh> {/* Sun */}
    <sphereGeometry args={[1, 32, 32]} />
    <meshStandardMaterial emissive="orange" />
  </mesh>
</group>`}
              filename="SolarSystem.tsx"
            />
            <p className="text-sm text-muted-foreground">
              Nothing fancy yet. Just a glowing sphere at the center.
            </p>
          </div>

          {/* Step 2 */}
          <div className="rounded-lg border bg-card p-4 space-y-3">
            <div className="flex items-center gap-2">
              <Badge variant="secondary">Step 2</Badge>
              <span className="font-semibold text-sm">
                Add Earth as a child
              </span>
            </div>
            <p className="text-sm text-muted-foreground">
              Earth is 4 units from the Sun. We put it inside a rotating group
              so that when we spin the group, Earth orbits.
            </p>
            <CodeBlock
              code={`<group rotation={[0, angle, 0]}>
  <mesh position={[4, 0, 0]}> {/* Earth */}
    <sphereGeometry args={[0.3, 32, 32]} />
    <meshStandardMaterial color="dodgerblue" />
  </mesh>
</group>`}
              filename="SolarSystem.tsx"
            />
            <p className="text-sm text-muted-foreground">
              Earth is at [4, 0, 0] relative to its parent group. Rotate the
              group, and Earth sweeps in a circle. The key insight: Earth does
              not know about the Sun. It just knows it is 4 units from its
              parent.
            </p>
          </div>

          {/* Step 3 */}
          <div className="rounded-lg border bg-card p-4 space-y-3">
            <div className="flex items-center gap-2">
              <Badge variant="secondary">Step 3</Badge>
              <span className="font-semibold text-sm">
                Nest the Moon inside Earth
              </span>
            </div>
            <p className="text-sm text-muted-foreground">
              The Moon is a child of Earth. It orbits Earth, and since Earth
              orbits the Sun, the Moon comes along for both rides.
            </p>
            <CodeBlock
              code={`<mesh position={[4, 0, 0]}> {/* Earth */}
  <sphereGeometry args={[0.3, 32, 32]} />
  <mesh position={[0.6, 0, 0]}> {/* Moon */}
    <sphereGeometry args={[0.08, 16, 16]} />
  </mesh>
</mesh>`}
              filename="SolarSystem.tsx"
            />
            <p className="text-sm text-muted-foreground">
              The Moon is at [0.6, 0, 0] -- that is 0.6 units from Earth, not
              from the Sun. Its world position is Earth's position plus 0.6.
              That is transform inheritance in action.
            </p>
          </div>
        </section>
      </ScrollReveal>

      <Separator className="my-8" />

      {/* 7. WhatYouJustLearned */}
      <ScrollReveal>
        <WhatYouJustLearned
          points={[
            "The scene graph is a tree where children inherit parent transforms",
            "JSX nesting directly creates the scene graph hierarchy",
            "Child positions are relative to their parent, not the world",
            "Moving a parent moves all of its children automatically",
            "You can use React patterns (map, conditional rendering) to build dynamic scene graphs",
          ]}
        />
      </ScrollReveal>

      <Separator className="my-8" />

      {/* 8. ConversationalCallout - Thought Question */}
      <ScrollReveal>
        <ConversationalCallout type="question">
          <p>
            If a child only knows its local position relative to its parent,
            how do you figure out where something actually is in the world?
          </p>
          <p>
            Three.js provides <code>object.getWorldPosition()</code>. It walks
            up the tree, multiplying all the parent transforms together, to
            give you the final world-space position. You rarely need this, but
            it is there when you do -- like for collision detection or
            snapping objects together.
          </p>
        </ConversationalCallout>
      </ScrollReveal>

      <Separator className="my-8" />

      {/* 9. AhaMoment */}
      <ScrollReveal>
        <AhaMoment
          setup="Wait -- if my JSX tree IS the scene graph, does that mean React conditional rendering controls what exists in the 3D scene?"
          reveal="Exactly. When you conditionally render a mesh with {showBox && <mesh>...</mesh>}, R3F calls scene.add() when it appears and scene.remove() when it disappears. Array.map() creates multiple scene graph nodes. React state drives the 3D world. This is the fundamental insight of R3F: React IS your scene graph manager."
        />
      </ScrollReveal>

      <Separator className="my-8" />

      {/* 10. MentalModelChallenge */}
      <ScrollReveal>
        <MentalModelChallenge
          question="A group is at position [3, 0, 0]. Inside it, a mesh is at position [0, 2, 0]. What is the mesh's world position?"
          options={[
            {
              label: "[0, 2, 0]",
              correct: false,
              explanation:
                "That is the local position. The parent's transform is added on top.",
            },
            {
              label: "[3, 0, 0]",
              correct: false,
              explanation:
                "That is only the parent's position. The child adds its own offset.",
            },
            {
              label: "[3, 2, 0]",
              correct: true,
              explanation:
                "Correct! Parent [3,0,0] + child [0,2,0] = world [3,2,0]. Transforms add up through the hierarchy.",
            },
            {
              label: "[0, 0, 0]",
              correct: false,
              explanation:
                "The positions do not cancel out. They accumulate from parent to child.",
            },
          ]}
          hint="Think about the family tree analogy: if grandpa is 3 blocks east, and you are 2 blocks north of grandpa..."
          answer="World position is the sum of all parent transforms. The group contributes [3,0,0] and the mesh adds [0,2,0], giving a final world position of [3,2,0]. Each level of nesting adds its own offset."
        />
      </ScrollReveal>

      <Separator className="my-8" />

      {/* Try These Challenges */}
      <ScrollReveal>
        <TryThisList challenges={[
          { challenge: "Move the Earth group to [5,0,0] -- does the Moon follow?", hint: "Children inherit their parent's transforms. The Moon's position is relative to Earth.", solution: "Yes, the Moon follows. Since the Moon is a child of Earth in the scene graph, moving Earth moves the Moon along with it. The Moon's local position stays the same, but its world position shifts by the same amount as Earth's.", difficulty: "beginner" },
          { challenge: "Scale the Sun to 3 -- do the orbits change?", hint: "Scale affects the visual size of the object, but what about the orbit group's rotation?", solution: "The Sun appears 3x larger, but the orbits do not change. Scaling the Sun mesh only affects its geometry size. The orbit distances are controlled by the position offsets in the parent groups, which are unchanged. Scale and position are independent transforms.", difficulty: "beginner" },
          { challenge: "Nest a third level -- give the Moon its own moon!", hint: "Just add another mesh inside the Moon's group with a smaller offset and smaller radius.", solution: "Add a tiny sphere as a child of the Moon with a small offset like [0.2, 0, 0]. It will orbit the Moon, which orbits Earth, which orbits the Sun. Each level of nesting creates another layer of transform inheritance. The mini-moon's world position is the sum of all parent transforms.", difficulty: "intermediate" },
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
                <h3 className="font-semibold text-sm">
                  Use groups for logical units
                </h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Wrap related meshes in a <code>&lt;group&gt;</code> so you can
                move, rotate, or hide them as a single unit. Groups cost
                nothing to render.
              </p>
            </div>
            <div className="rounded-lg border bg-card p-4 space-y-2">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="size-4 text-green-500" />
                <h3 className="font-semibold text-sm">Name your objects</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Add a <code>name</code> prop for easier debugging. It shows up
                in the Three.js inspector and makes console logs readable.
              </p>
            </div>
            <div className="rounded-lg border bg-card p-4 space-y-2">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="size-4 text-green-500" />
                <h3 className="font-semibold text-sm">Clone loaded models</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                A Three.js object can only have one parent. If you need the
                same model in multiple places, call <code>.clone()</code> for
                each instance.
              </p>
            </div>
            <div className="rounded-lg border bg-card p-4 space-y-2">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="size-4 text-green-500" />
                <h3 className="font-semibold text-sm">
                  Use keys for dynamic lists
                </h3>
              </div>
              <p className="text-sm text-muted-foreground">
                When rendering meshes with <code>.map()</code>, provide stable
                unique keys. Without them, React cannot properly track which
                3D objects to add, update, or remove.
              </p>
            </div>
          </div>
        </section>
      </ScrollReveal>
    </div>
  );
}
