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
    import("./_components/robot-arm-demo").then((m) => ({
      default: m.RobotArmDemo,
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
    title: "Setting world-space positions on children",
    subtitle: "Child transforms are LOCAL to their parent",
    wrongCode: `// Group at [5,0,0], child at [3,0,0]
// World result: [8,0,0] -- not [3,0,0]!
<group position={[5, 0, 0]}>
  <mesh position={[3, 0, 0]}>
    <boxGeometry />
  </mesh>
</group>`,
    rightCode: `// Think in local coordinates
<group position={[5, 0, 0]}>
  <mesh position={[0, 0, 0]}> {/* centered */}
    <boxGeometry />
  </mesh>
  <mesh position={[3, 0, 0]}> {/* 3 from group */}
    <boxGeometry />
  </mesh>
</group>`,
    filename: "Scene.tsx",
    explanation:
      "All child transforms are in the parent's local coordinate space. A child at [0,0,0] appears at the parent's world position. Design children relative to the parent's origin, and move the parent to position the whole group.",
  },
  {
    title: "Non-uniform scale on parent groups",
    subtitle: "Parent scale multiplies into all children",
    wrongCode: `// Parent stretches all children along X!
<group scale={[2, 1, 1]}>
  <mesh> {/* Sphere becomes an ellipsoid */}
    <sphereGeometry args={[0.5, 32, 32]} />
  </mesh>
</group>`,
    rightCode: `// Use uniform scale on groups
<group scale={1.5}>
  <mesh>
    <sphereGeometry args={[0.5, 32, 32]} />
  </mesh>
</group>`,
    filename: "Scene.tsx",
    explanation:
      "Parent scale is inherited by all children. A non-uniform scale like [2,1,1] stretches every child along X, distorting spheres into ellipsoids. Use uniform scaling on groups (a single number).",
  },
  {
    title: "Rotating the wrong object for orbiting",
    subtitle: "Objects rotate around their own origin",
    wrongCode: `// This spins the cube IN PLACE, not orbiting
const ref = useRef<THREE.Mesh>(null)
useFrame((_, d) => {
  ref.current!.rotation.y += d
})
<mesh ref={ref} position={[3, 0, 0]} />`,
    rightCode: `// Wrap in a group and rotate the GROUP
const groupRef = useRef<THREE.Group>(null)
useFrame((_, d) => {
  groupRef.current!.rotation.y += d
})
<group ref={groupRef}>
  <mesh position={[3, 0, 0]} />
</group>`,
    filename: "Orbit.tsx",
    explanation:
      "Rotating an object spins it around its own local origin. To orbit around a different point, wrap the mesh in a group centered at the orbit point and rotate the group instead.",
  },
];

export default function GroupsHierarchyPage() {
  return (
    <div className="max-w-4xl ambient-canvas">
      {/* 1. Title + Badge + Intro */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-3">
          <Badge variant="outline">Meshes & Objects</Badge>
          <Badge variant="secondary" className="text-[10px]">
            Organization
          </Badge>
        </div>
        <h1 className="text-3xl font-bold tracking-tight mb-3">
          Groups & Hierarchy
        </h1>
        <p className="text-lg text-muted-foreground leading-relaxed">
          Imagine Russian nesting dolls. The biggest doll is a group. Inside
          it are smaller dolls -- meshes, lights, or even more groups. Move
          the outer doll, and everything inside moves with it. Rotate it, and
          everything rotates together. That is what a{" "}
          <code>&lt;group&gt;</code> does in R3F: it bundles objects so you
          can transform them as one unit.
        </p>
      </div>

      {/* 2. WhatCouldGoWrong */}
      <ScrollReveal>
        <WhatCouldGoWrong
          scenario={`You build a robot arm. You want the forearm to swing, but when you rotate the forearm mesh directly, the hand stays in place. The arm separates at the elbow like a broken toy. The hand should follow the forearm, but it does not because the hand is not nested inside the forearm group.`}
          error={`Forearm rotates but hand stays stationary.
Hand is a sibling of forearm, not a child.
Expected: hand follows forearm rotation.
Actual: hand is disconnected from forearm transform.`}
          errorType="Hierarchy Bug"
        />
      </ScrollReveal>

      {/* 3. ConversationalCallout - Story Analogy */}
      <ScrollReveal>
        <ConversationalCallout type="story">
          <p>
            Think of Russian nesting dolls (matryoshka). The outermost doll
            is the biggest group. Open it, and there is a smaller doll inside.
            Open that one, another inside. Move the outer doll to a shelf, and
            every doll inside comes along for the ride.
          </p>
          <p>
            Now imagine a robot arm. The base is the outer doll. Inside the
            base is the upper arm (smaller doll). Inside the upper arm is the
            forearm. Inside the forearm is the hand. Rotate the base, and the
            entire arm swings. Rotate just the forearm, and only the hand
            follows. Each level only affects its children.
          </p>
        </ConversationalCallout>
      </ScrollReveal>

      {/* 4. SimpleFlow - Mental Model */}
      <ScrollReveal>
        <SimpleFlow
          steps={[
            { label: "Outer Group", detail: "Move this, everything moves" },
            { label: "Inner Group", detail: "A joint in the chain" },
            { label: "Mesh", detail: "The visible part" },
          ]}
          direction="vertical"
        />
      </ScrollReveal>

      <Separator className="my-8" />

      {/* 5. Interactive Demo */}
      <Demo />

      <Separator className="my-8" />

      {/* 6. Guided Walkthrough */}
      <ScrollReveal>
        <section className="space-y-4">
          <h2 className="text-2xl font-bold">Building a Robot Arm</h2>
          <p className="text-muted-foreground leading-relaxed">
            Let us build a simple robot arm with three joints. Each joint is
            a group, and the nesting creates the hierarchy. Rotate one joint
            and everything below it follows.
          </p>

          {/* Step 1 */}
          <div className="rounded-lg border bg-card p-4 space-y-3">
            <div className="flex items-center gap-2">
              <Badge variant="secondary">Step 1</Badge>
              <span className="font-semibold text-sm">
                Create the base (outer doll)
              </span>
            </div>
            <p className="text-sm text-muted-foreground">
              The base sits on the ground and rotates left to right. It is the
              outermost group -- everything else is inside it.
            </p>
            <CodeBlock
              code={`<group ref={baseRef}> {/* Base joint */}
  <mesh> {/* Base platform */}
    <cylinderGeometry args={[0.5, 0.5, 0.2]} />
    <meshStandardMaterial color="gray" />
  </mesh>
</group>`}
              filename="RobotArm.tsx"
            />
            <p className="text-sm text-muted-foreground">
              Rotate <code>baseRef</code> around the Y axis and the entire arm
              swings left and right. The base is the root of our hierarchy.
            </p>
          </div>

          {/* Step 2 */}
          <div className="rounded-lg border bg-card p-4 space-y-3">
            <div className="flex items-center gap-2">
              <Badge variant="secondary">Step 2</Badge>
              <span className="font-semibold text-sm">
                Add the upper arm (middle doll)
              </span>
            </div>
            <p className="text-sm text-muted-foreground">
              The upper arm group is nested inside the base. It sits on top
              of the base and tilts forward and backward.
            </p>
            <CodeBlock
              code={`<group ref={baseRef}>
  {/* base mesh... */}
  <group ref={upperArmRef} position={[0, 0.15, 0]}>
    <mesh position={[0, 0.75, 0]}> {/* Arm */}
      <boxGeometry args={[0.2, 1.5, 0.2]} />
      <meshStandardMaterial color="steelblue" />
    </mesh>
  </group>
</group>`}
              filename="RobotArm.tsx"
            />
            <p className="text-sm text-muted-foreground">
              Notice the upper arm is positioned at [0, 0.15, 0] -- that is
              relative to the base. When the base rotates, the upper arm
              follows because it is a child.
            </p>
          </div>

          {/* Step 3 */}
          <div className="rounded-lg border bg-card p-4 space-y-3">
            <div className="flex items-center gap-2">
              <Badge variant="secondary">Step 3</Badge>
              <span className="font-semibold text-sm">
                Nest the forearm (inner doll)
              </span>
            </div>
            <p className="text-sm text-muted-foreground">
              The forearm goes inside the upper arm group. Now we have three
              levels of nesting, and each joint affects everything below it.
            </p>
            <CodeBlock
              code={`<group ref={upperArmRef} position={[0, 0.15, 0]}>
  {/* upper arm mesh... */}
  <group ref={forearmRef} position={[0, 1.5, 0]}>
    <mesh position={[0, 0.5, 0]}> {/* Forearm */}
      <boxGeometry args={[0.15, 1, 0.15]} />
      <meshStandardMaterial color="orange" />
    </mesh>
  </group>
</group>`}
              filename="RobotArm.tsx"
            />
            <p className="text-sm text-muted-foreground">
              The forearm is at [0, 1.5, 0] relative to the upper arm group.
              Rotate the base? Everything moves. Rotate the upper arm? The
              forearm follows. Rotate the forearm? Only it moves. Each joint
              is independent but cascades downward.
            </p>
          </div>
        </section>
      </ScrollReveal>

      <Separator className="my-8" />

      {/* 7. WhatYouJustLearned */}
      <ScrollReveal>
        <WhatYouJustLearned
          points={[
            "A <group> is an invisible container that transforms all its children together",
            "Groups cost nothing to render -- no vertices, no draw calls",
            "Nested groups create transform chains (like joints in an arm)",
            "Each level only controls its own rotation, but the effect cascades down",
            "Child positions are always relative to their parent group",
            "Groups are perfect for toggling visibility of many objects at once",
          ]}
        />
      </ScrollReveal>

      <Separator className="my-8" />

      {/* 8. ConversationalCallout - Thought Question */}
      <ScrollReveal>
        <ConversationalCallout type="question">
          <p>
            If you want a cube to orbit around a point (like a planet around
            a star), do you rotate the cube or something else?
          </p>
          <p>
            You rotate a parent group, not the cube itself. Place the cube at
            an offset from the group's center (like [3, 0, 0]), then rotate
            the group. The cube sweeps in a circle around the group's origin.
            Rotating the cube directly would just spin it in place -- like a
            basketball spinning on a finger instead of orbiting the court.
          </p>
        </ConversationalCallout>
      </ScrollReveal>

      <Separator className="my-8" />

      {/* 9. AhaMoment */}
      <ScrollReveal>
        <AhaMoment
          setup="Groups seem simple -- just containers. But why are they so essential for 3D? Could you not just position every mesh individually?"
          reveal="You could, but it would be a nightmare. Imagine positioning every bone in a character's skeleton individually -- 50+ meshes that all need to move together when the character walks. With groups, you position the hip, and legs follow. Position the shoulder, and the arm follows. Without groups, moving one mesh means recalculating positions for every connected mesh manually. Groups turn an O(n) problem into an O(1) operation: move the parent, done."
        />
      </ScrollReveal>

      <Separator className="my-8" />

      {/* 10. MentalModelChallenge */}
      <ScrollReveal>
        <MentalModelChallenge
          question="A group at position [2, 0, 0] is rotated 90 degrees around the Y axis. Inside it, a mesh is at position [3, 0, 0]. Where does the mesh end up in world space?"
          options={[
            {
              label: "[5, 0, 0]",
              correct: false,
              explanation:
                "That would be correct without rotation. But the 90-degree Y rotation changes the child's effective offset direction.",
            },
            {
              label: "[2, 0, -3]",
              correct: true,
              explanation:
                "Correct! The child's local X offset of 3 gets rotated 90 degrees around Y, turning it into a Z offset of -3. Add the parent's position [2,0,0] and you get [2, 0, -3].",
            },
            {
              label: "[2, 0, 3]",
              correct: false,
              explanation:
                "Close! But a 90-degree Y rotation transforms +X into -Z, not +Z.",
            },
            {
              label: "[3, 0, 2]",
              correct: false,
              explanation:
                "The parent position and child offset do not swap. The rotation affects the direction of the child's offset.",
            },
          ]}
          hint="Rotation changes the DIRECTION of the child's offset. A 90-degree Y rotation turns the X axis into the -Z axis."
          answer="When the parent rotates 90 degrees around Y, the child's local X offset becomes a world Z offset (negative direction). The child at local [3,0,0] ends up 3 units in the -Z direction from the parent, giving a world position of [2, 0, -3]. This is why groups are so powerful -- rotation naturally cascades through the hierarchy."
        />
      </ScrollReveal>

      <Separator className="my-8" />

      {/* Try These Challenges */}
      <ScrollReveal>
        <TryThisList challenges={[
          { challenge: "Set speed to 0 -- use manual sliders to pose the arm.", hint: "When speed is 0, the automatic animation stops. Use the rotation sliders to move each joint individually.", solution: "With speed at 0, the arm freezes and you can manually rotate each joint to create specific poses. This demonstrates that each group is an independent joint -- rotating the base swings everything, rotating the upper arm moves the forearm and hand, and rotating the forearm moves only the hand.", difficulty: "beginner" },
          { challenge: "Set baseRotation to PI (3.14) -- the arm faces backward!", hint: "PI radians equals 180 degrees. The base rotates around the Y axis.", solution: "Setting the base rotation to PI (approximately 3.14) rotates the entire arm 180 degrees. Everything nested inside the base group rotates with it -- upper arm, forearm, and hand all swing to face backward. This is transform inheritance in action.", difficulty: "beginner" },
          { challenge: "Max out elbowAngle -- does the arm break?", hint: "What happens when you rotate a joint past its natural range? Does the forearm clip through the upper arm?", solution: "At extreme angles, the forearm can clip through the upper arm because there is no collision detection. In 3D, objects pass through each other unless you add physics constraints. Real robot arms have joint limits to prevent this. You would add min/max angle constraints to prevent unrealistic poses.", difficulty: "intermediate" },
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
                  Use groups as pivot points
                </h3>
              </div>
              <p className="text-sm text-muted-foreground">
                To orbit an object around a point, wrap it in a group
                centered at the orbit point and rotate the group. The child
                sweeps in a circle.
              </p>
            </div>
            <div className="rounded-lg border bg-card p-4 space-y-2">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="size-4 text-green-500" />
                <h3 className="font-semibold text-sm">
                  Keep uniform scale on groups
                </h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Non-uniform scale distorts all children and breaks normals.
                Apply non-uniform scale only to individual meshes that need
                it, not to group containers.
              </p>
            </div>
            <div className="rounded-lg border bg-card p-4 space-y-2">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="size-4 text-green-500" />
                <h3 className="font-semibold text-sm">
                  Toggle visibility with groups
                </h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Setting <code>visible={"{false}"}</code> on a group hides
                everything inside it with a single prop. Much cleaner than
                hiding each mesh individually.
              </p>
            </div>
            <div className="rounded-lg border bg-card p-4 space-y-2">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="size-4 text-green-500" />
                <h3 className="font-semibold text-sm">
                  Think in local coordinates
                </h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Design child positions relative to the parent center, not
                world space. This makes compound objects portable -- move the
                parent and everything stays intact.
              </p>
            </div>
          </div>
        </section>
      </ScrollReveal>
    </div>
  );
}
