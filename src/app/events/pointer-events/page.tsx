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
    import("./_components/click-demo").then((m) => ({
      default: m.ClickDemo,
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
    title: "Binding onPointerMove on many objects",
    subtitle: "Raycasting against 100+ objects on every mouse movement",
    wrongCode: `// Each mesh triggers raycasting on pointer move
{Array.from({ length: 100 }, (_, i) => (
  <mesh key={i}
    onPointerMove={(e) => console.log(i)}>
    <boxGeometry />
    <meshStandardMaterial />
  </mesh>
))}`,
    rightCode: `// One handler on parent -- events bubble up
<group onPointerMove={(e) => {
  e.stopPropagation()
  console.log(e.object.name)
}}>
  {Array.from({ length: 100 }, (_, i) => (
    <mesh key={i} name={\`mesh-\${i}\`}>
      <boxGeometry />
      <meshStandardMaterial />
    </mesh>
  ))}
</group>`,
    filename: "Scene.tsx",
    explanation:
      "R3F raycasts against every object that has event handlers. onPointerMove fires on every mouse movement, and raycasting 100+ objects each time is expensive. Use event delegation: attach one handler to a parent group and use event.object to identify which child was hit.",
  },
  {
    title: "Forgetting stopPropagation",
    subtitle: "Parent handlers fire unexpectedly when clicking children",
    wrongCode: `<group onClick={() => console.log('Background')}>
  {/* Clicking this also fires the parent! */}
  <mesh onClick={() => console.log('Button')}>
    <boxGeometry args={[0.5, 0.5, 0.1]} />
  </mesh>
</group>`,
    rightCode: `<group onClick={() => console.log('Background')}>
  <mesh onClick={(e) => {
    e.stopPropagation()
    console.log('Button clicked')
  }}>
    <boxGeometry args={[0.5, 0.5, 0.1]} />
  </mesh>
</group>`,
    filename: "Scene.tsx",
    explanation:
      "R3F events bubble up through the scene graph, just like DOM events. Clicking a child mesh fires its handler, then propagates to all ancestor groups with handlers. Call stopPropagation() on the child to prevent the parent from also firing.",
  },
  {
    title: "Not restoring cursor on pointer out",
    subtitle: "Cursor stays as pointer after moving away from the object",
    wrongCode: `<mesh
  onPointerOver={() => {
    document.body.style.cursor = 'pointer'
  }}
  // Forgot onPointerOut! Cursor stuck forever.
>`,
    rightCode: `<mesh
  onPointerOver={() => {
    document.body.style.cursor = 'pointer'
  }}
  onPointerOut={() => {
    document.body.style.cursor = 'auto'
  }}
>`,
    filename: "Button.tsx",
    explanation:
      "Changing the CSS cursor in onPointerOver without resetting it in onPointerOut leaves the cursor stuck. Always pair them. Or use drei's useCursor hook which handles this automatically based on a boolean state.",
  },
];

export default function PointerEventsPage() {
  return (
    <div className="relative max-w-4xl">
      <div className="absolute -top-10 -left-10 w-72 h-72 bg-gradient-to-br from-teal-500/10 via-emerald-500/10 to-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
      {/* ── 1. Title + Badge + Intro ── */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-3">
          <Badge variant="outline">Events & Interaction</Badge>
        </div>
        <h1 className="text-3xl font-bold tracking-tight mb-3">
          Pointer Events
        </h1>
        <p className="text-lg text-muted-foreground">
          A 3D scene you can only look at is like a painting -- beautiful but
          passive. Pointer events let your users reach into the scene and
          interact. Click a button, hover a card, drag a slider -- all with the
          same React event handler syntax you already know from regular HTML
          elements.
        </p>
      </div>

      {/* ── 2. WhatCouldGoWrong ── */}
      <WhatCouldGoWrong
        scenario={`You attach onPointerMove to 200 individual meshes in your scene. It works, but every time the user moves their mouse, R3F raycasts against all 200 objects. Your frame rate drops from 60fps to 15fps on mobile, and users think your app is broken.`}
        error={`Performance warning: 200 meshes with onPointerMove handlers.
Raycasting 200 objects per mouse movement (60x/sec).
Total intersection tests: 12,000/sec. Frame time: 67ms (15 FPS).
Consider event delegation on a parent group.`}
        errorType="Performance"
      />

      <Separator className="my-8" />

      {/* ── 3. Story Analogy ── */}
      <ScrollReveal>
        <ConversationalCallout type="story">
          <p>
            Imagine your 3D scene is a giant touchscreen. Hover over a cube and
            it glows. Click a sphere and it bounces. Drag a shape and it follows
            your finger. That is what pointer events give you.
          </p>
          <p>
            Just like a touchscreen, the system needs to figure out what you are
            touching. Behind the scenes, R3F shoots an invisible ray from your
            mouse into the 3D world to detect which object is under the cursor.
            Then it fires the matching event handler -- just like a button click
            in regular HTML.
          </p>
        </ConversationalCallout>
      </ScrollReveal>

      <Separator className="my-8" />

      {/* ── 4. SimpleFlow ── */}
      <ScrollReveal>
        <h2 className="text-2xl font-bold mb-4">How Pointer Events Work</h2>
        <SimpleFlow
          steps={[
            { label: "User clicks", detail: "Browser fires a pointer event" },
            { label: "R3F raycasts", detail: "Invisible ray from camera through mouse" },
            { label: "Find intersections", detail: "Which objects does the ray hit?" },
            { label: "Sort by distance", detail: "Nearest object fires first" },
            { label: "Event fires", detail: "onClick runs on the hit mesh", status: "success" },
          ]}
        />
      </ScrollReveal>

      <Separator className="my-8" />

      {/* ── 5. Demo ── */}
      <ScrollReveal>
        <h2 className="text-2xl font-bold mb-4">See It In Action</h2>
        <p className="text-muted-foreground mb-4">
          Click and hover over the objects below. Each one responds to pointer
          events -- changing color, scale, or position in response to your
          interactions.
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
            Step 1 -- Add click and hover handlers
          </p>
          <p className="text-sm text-muted-foreground mb-3">
            Attach event handlers directly to mesh components. It is the same
            syntax you use for HTML buttons -- <code>onClick</code>,{" "}
            <code>onPointerOver</code>, <code>onPointerOut</code>.
          </p>
          <CodeBlock
            code={`<mesh
  onClick={(e) => {
    e.stopPropagation()
    setClicked(!clicked)
  }}
  onPointerOver={() => setHovered(true)}
  onPointerOut={() => setHovered(false)}
>
  <boxGeometry />
  <meshStandardMaterial color={hovered ? 'hotpink' : 'orange'} />
</mesh>`}
            filename="InteractiveBox.tsx"
          />
          <p className="text-sm text-muted-foreground mt-2">
            Notice <code>stopPropagation()</code> on the click handler. Without
            it, the click would bubble up to parent groups, just like in the
            DOM.
          </p>
        </div>

        {/* Step 2 */}
        <div className="rounded-lg border bg-card p-4 mb-4">
          <p className="text-sm font-semibold mb-2">
            Step 2 -- Read the event object
          </p>
          <p className="text-sm text-muted-foreground mb-3">
            The event gives you rich 3D data: exactly where the click landed in
            world space, which face was hit, the distance from the camera, and
            the UV coordinates at the hit point.
          </p>
          <CodeBlock
            code={`<mesh onClick={(e) => {
  e.stopPropagation()
  console.log(e.point)    // Vector3 world position
  console.log(e.object)   // the mesh that was hit
  console.log(e.distance) // distance from camera
  console.log(e.face)     // hit face + normal
  console.log(e.uv)       // UV at hit point
}}>
  <sphereGeometry />
  <meshStandardMaterial />
</mesh>`}
            filename="EventData.tsx"
          />
          <p className="text-sm text-muted-foreground mt-2">
            <code>event.point</code> is especially useful -- it tells you the
            exact 3D coordinate where the user clicked, so you can spawn
            particles, place markers, or trigger effects at that spot.
          </p>
        </div>

        {/* Step 3 */}
        <div className="rounded-lg border bg-card p-4 mb-4">
          <p className="text-sm font-semibold mb-2">
            Step 3 -- Change the cursor for hover feedback
          </p>
          <p className="text-sm text-muted-foreground mb-3">
            Give users visual feedback by changing the CSS cursor when they
            hover over interactive objects. Always pair the over and out
            handlers.
          </p>
          <CodeBlock
            code={`<mesh
  onPointerOver={() => {
    document.body.style.cursor = 'pointer'
  }}
  onPointerOut={() => {
    document.body.style.cursor = 'auto'
  }}
>
  <boxGeometry />
  <meshStandardMaterial />
</mesh>`}
            filename="CursorHint.tsx"
          />
          <p className="text-sm text-muted-foreground mt-2">
            For a cleaner approach, drei provides a <code>useCursor(hovered)</code>{" "}
            hook that handles cursor management automatically based on a boolean.
          </p>
        </div>
      </ScrollReveal>

      <Separator className="my-8" />

      {/* ── 7. WhatYouJustLearned ── */}
      <WhatYouJustLearned
        points={[
          "Pointer events work just like React HTML events -- onClick, onPointerOver, onPointerOut",
          "R3F uses raycasting behind the scenes to detect which 3D object is under the cursor",
          "Events bubble up through the scene graph -- use stopPropagation() to prevent it",
          "The event object gives you 3D data: hit position, face, distance, UV coordinates",
          "Always pair onPointerOver cursor changes with onPointerOut resets",
        ]}
      />

      <Separator className="my-8" />

      {/* ── 8. Question Callout ── */}
      <ScrollReveal>
        <ConversationalCallout type="question">
          <p>
            What about drag events? R3F does not have built-in drag handlers,
            but drei provides a <code>&lt;DragControls&gt;</code> component
            and a <code>useDrag</code> hook. Under the hood, they combine
            onPointerDown, onPointerMove, and onPointerUp to track drag
            gestures and update object positions.
          </p>
        </ConversationalCallout>
      </ScrollReveal>

      <Separator className="my-8" />

      {/* ── 9. AhaMoment ── */}
      <AhaMoment
        setup="Why do R3F events bubble through the scene graph instead of just firing on the hit object?"
        reveal="Bubbling enables event delegation -- a powerful pattern from the DOM. Instead of attaching handlers to 100 individual objects (which means 100 raycasting targets), you attach one handler to a parent group. When any child is hit, the event bubbles up to the parent, and you use event.object to see which child was involved. This turns 100 raycasting targets into however many the group naturally contains, dramatically improving performance."
      />

      <Separator className="my-8" />

      {/* ── 10. MentalModelChallenge ── */}
      <MentalModelChallenge
        question="You have a group containing a background plane and a floating button mesh. Both have onClick handlers. The user clicks the button. What happens?"
        options={[
          {
            label: "Only the button's onClick fires",
            correct: false,
            explanation:
              "Without stopPropagation, the event bubbles up and the group's onClick also fires.",
          },
          {
            label: "Both the button's and the group's onClick fire",
            correct: true,
            explanation:
              "Events bubble through the scene graph. The nearest hit (button) fires first, then the event propagates to the parent group.",
          },
          {
            label: "Only the group's onClick fires",
            correct: false,
            explanation:
              "The nearest intersection fires first. The button is closer to the camera than the background, so it fires first.",
          },
        ]}
        answer="Both handlers fire because R3F events bubble through the scene graph, just like DOM events. The button fires first (nearest hit), then the event propagates to the group. To prevent the group from firing, call e.stopPropagation() in the button's onClick handler."
      />

      <Separator className="my-8" />

      {/* Try These Challenges */}
      <ScrollReveal>
        <TryThisList challenges={[
          { challenge: "Set hoverScale to 2 -- giant on hover!", hint: "The hover scale controls how much the object grows when you hover over it.", solution: "Objects become twice their normal size when hovered. This creates a dramatic visual effect. The scale change is driven by React state (hovered), which triggers a re-render to update the scale prop. For smoother scaling, you could use useFrame with lerp to animate the transition.", difficulty: "beginner" },
          { challenge: "Max out bounceHeight -- objects fly on click!", hint: "bounceHeight controls how high objects jump when clicked.", solution: "Objects launch upward dramatically on click, creating a fun bouncy effect. The animation uses the click event to set a target Y position, then useFrame interpolates the object back to rest. Large bounce values make the physics look exaggerated but demonstrate how pointer events drive animations.", difficulty: "beginner" },
          { challenge: "Set rotationSpeed to 0 -- still objects.", hint: "rotationSpeed multiplies the rotation increment in useFrame.", solution: "All automatic rotation stops. Objects become static and only respond to hover and click interactions. This shows the separation between continuous animation (useFrame) and event-driven behavior (pointer events). The pointer events still work perfectly even without continuous animation.", difficulty: "beginner" },
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
                  Always call stopPropagation
                </h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Prevent parent handlers from firing unexpectedly. This is the
                single most common source of event bugs in R3F.
              </p>
            </div>
            <div className="rounded-lg border bg-card p-4 space-y-2">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="size-4 text-green-500" />
                <h3 className="font-semibold text-sm">
                  Disable raycasting on decorative meshes
                </h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Use <code>raycast={"{() => null}"}</code> on non-interactive
                meshes to skip intersection testing entirely.
              </p>
            </div>
            <div className="rounded-lg border bg-card p-4 space-y-2">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="size-4 text-green-500" />
                <h3 className="font-semibold text-sm">
                  Use event delegation
                </h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Attach one handler to a parent group and use{" "}
                <code>event.object</code> to identify the child. Much faster
                than individual handlers on many objects.
              </p>
            </div>
            <div className="rounded-lg border bg-card p-4 space-y-2">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="size-4 text-green-500" />
                <h3 className="font-semibold text-sm">
                  Always pair cursor changes
                </h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Every <code>onPointerOver</code> cursor change needs a matching{" "}
                <code>onPointerOut</code> reset. Or use drei&apos;s{" "}
                <code>useCursor</code> hook.
              </p>
            </div>
          </div>
        </section>
      </ScrollReveal>
    </div>
  );
}
