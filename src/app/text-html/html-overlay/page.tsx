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

const HtmlDemo = dynamic(
  () => import("./_components/html-demo").then((m) => ({ default: m.HtmlDemo })),
  {
    ssr: false,
    loading: () => (
      <div className="w-full aspect-[2/1] rounded-xl border bg-scene-bg animate-pulse" />
    ),
  }
);

const mistakes: Mistake[] = [
  {
    title: "HTML content is not clickable",
    subtitle: "Missing pointer-events on the Html wrapper",
    wrongCode: `<Html position={[0, 1.5, 0]} center>
  <button onClick={() => console.log('clicked')}>
    Click me
  </button>
</Html>`,
    rightCode: `<Html
  position={[0, 1.5, 0]}
  center
  style={{ pointerEvents: 'auto' }}
>
  <button onClick={() => console.log('clicked')}>
    Click me
  </button>
</Html>`,
    filename: "InteractiveHtml.tsx",
    explanation:
      "The Html component's wrapper often has pointer-events: none by default, which prevents clicks from reaching your content. Add style={{ pointerEvents: 'auto' }} to the Html component to re-enable mouse interactions on your buttons and inputs.",
  },
  {
    title: "HTML label feels disconnected from the scene",
    subtitle: "Not using the transform prop for embedded panels",
    wrongCode: `<Html position={[0, 1, 0]}>
  <div className="info-panel">
    <h3>Product Details</h3>
  </div>
</Html>`,
    rightCode: `<Html
  transform
  position={[0, 1, 0]}
  distanceFactor={10}
  occlude
>
  <div className="info-panel">
    <h3>Product Details</h3>
  </div>
</Html>`,
    filename: "TransformHtml.tsx",
    explanation:
      "Without the transform prop, Html renders as a screen-space overlay that always faces the camera at a fixed pixel size. Use transform to make it scale and rotate with the 3D scene, as if it were a flat plane floating in 3D space. Combine with distanceFactor to control the base scale.",
  },
  {
    title: "HTML shows through objects behind it",
    subtitle: "Not using the occlude prop for depth-correct rendering",
    wrongCode: `<mesh ref={wallRef}>
  <boxGeometry args={[4, 4, 0.2]} />
  <meshStandardMaterial />
</mesh>

<Html position={[0, 0, -2]}>
  <p>I should be hidden behind the wall</p>
</Html>`,
    rightCode: `<mesh ref={wallRef}>
  <boxGeometry args={[4, 4, 0.2]} />
  <meshStandardMaterial />
</mesh>

<Html position={[0, 0, -2]} occlude={[wallRef]}>
  <p>Now I hide behind the wall</p>
</Html>`,
    filename: "OccludedHtml.tsx",
    explanation:
      "Html elements are DOM overlays that render on top of the WebGL canvas regardless of depth. Use the occlude prop to enable depth-testing. Pass an array of mesh refs, or use occlude='blending' for a smooth fade when the label goes behind objects.",
  },
];

export default function HtmlOverlayPage() {
  return (
    <div className="max-w-4xl ambient-drei">
      {/* Title + Badge + Intro */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-3">
          <Badge variant="outline">Text &amp; HTML</Badge>
        </div>
        <h1 className="text-3xl font-bold tracking-tight mb-3">
          HTML Overlay
        </h1>
        <p className="text-lg text-muted-foreground">
          Imagine wearing augmented reality glasses. You look at a building and
          a floating info card appears next to it -- the name, the address, a
          star rating. You turn your head, the label follows the building
          perfectly. That is exactly what the Html component does: it pins real
          HTML content to 3D positions in your scene.
        </p>
      </div>

      {/* What Could Go Wrong */}
      <WhatCouldGoWrong
        scenario="You place an Html component with a button inside your 3D scene. The button appears at the right position, but when you click it... nothing happens. The click seems to pass straight through the button into the canvas below."
        error="onClick handler never fires. Pointer events are being captured by the canvas layer underneath the HTML overlay."
        errorType="Interaction Bug"
        accentColor="red"
      />

      <Separator className="my-8" />

      {/* Story Analogy */}
      <ConversationalCallout type="story">
        <p>
          Think of AR glasses. When you look at a real-world object through the
          lenses, you see digital labels floating next to it. The labels are not
          part of the physical world -- they are a separate layer projected onto
          your view. Move the object, and the label follows.
        </p>
        <p>
          The Html component works the same way. Your 3D objects live on the WebGL
          canvas. Html creates a separate DOM layer on top and projects regular
          HTML elements to match 3D positions every frame. The HTML is not inside
          the 3D world -- it is a sticker on the glass that tracks what is behind it.
        </p>
      </ConversationalCallout>

      <Separator className="my-8" />

      {/* SimpleFlow */}
      <SimpleFlow
        steps={[
          { label: "3D Object", detail: "A mesh in your scene" },
          { label: "Html Component", detail: "Attach as child" },
          { label: "DOM Overlay", detail: "Real HTML on top" },
          { label: "AR Label!", detail: "Follows the object", status: "success" },
        ]}
        accentColor="blue"
      />

      <Separator className="my-8" />

      {/* Demo */}
      <HtmlDemo />

      <Separator className="my-8" />

      {/* Guided Walkthrough */}
      <ScrollReveal>
        <section className="space-y-4">
          <h2 className="text-2xl font-bold">Attaching Your First AR Label</h2>
          <p className="text-muted-foreground leading-relaxed">
            The Html component from drei makes this surprisingly simple. Place
            it inside any mesh or group, and it will track that object&apos;s
            position automatically.
          </p>

          <div className="rounded-lg border bg-card p-4 space-y-3">
            <p className="text-sm font-medium">Step 1: Place Html inside a mesh</p>
            <CodeBlock
              code={`<mesh position={[2, 1, 0]}>
  <sphereGeometry args={[0.5]} />
  <meshStandardMaterial color="tomato" />
  <Html center>
    <div className="label">This is a sphere</div>
  </Html>
</mesh>`}
              filename="BasicLabel.tsx"
            />
            <p className="text-sm text-muted-foreground">
              By nesting Html inside the mesh, the label automatically follows
              wherever the mesh goes. The center prop keeps the label centered
              on the object rather than anchored to its top-left corner.
            </p>
          </div>

          <div className="rounded-lg border bg-card p-4 space-y-3">
            <p className="text-sm font-medium">Step 2: Make it feel embedded with transform</p>
            <CodeBlock
              code={`<Html transform distanceFactor={10}>
  <div className="panel">
    <h3>Info Panel</h3>
    <p>Scales with the scene</p>
  </div>
</Html>`}
              filename="TransformLabel.tsx"
            />
            <p className="text-sm text-muted-foreground">
              Without transform, the label stays a fixed pixel size no matter
              how far the camera is. With transform, it scales and rotates
              with the 3D perspective -- like a card that is actually in the scene
              rather than taped to your glasses.
            </p>
          </div>

          <div className="rounded-lg border bg-card p-4 space-y-3">
            <p className="text-sm font-medium">Step 3: Add interactivity and occlusion</p>
            <CodeBlock
              code={`<Html
  center
  occlude={[wallRef]}
  style={{ pointerEvents: 'auto' }}
>
  <button onClick={handleClick}>
    Click me
  </button>
</Html>`}
              filename="InteractiveLabel.tsx"
            />
            <p className="text-sm text-muted-foreground">
              Two crucial extras: pointerEvents lets clicks reach your HTML
              elements, and occlude hides the label when it goes behind a 3D
              object. Without occlude, labels awkwardly float on top of walls
              they should be hidden behind.
            </p>
          </div>
        </section>
      </ScrollReveal>

      <Separator className="my-8" />

      {/* What You Just Learned */}
      <WhatYouJustLearned
        points={[
          "Html creates real DOM elements projected onto 3D positions -- like AR labels on glasses.",
          "Nest Html inside a mesh or group and it automatically tracks that object's position.",
          "Use the transform prop to make labels scale and rotate with the 3D scene perspective.",
          "Add style={{ pointerEvents: 'auto' }} to make buttons and inputs clickable inside Html.",
          "Use the occlude prop to hide labels behind 3D objects for realistic depth behavior.",
        ]}
      />

      <Separator className="my-8" />

      {/* Question */}
      <ConversationalCallout type="question">
        <p>
          If Html creates real DOM elements, does that mean you can use any React
          library inside it? What about a chart library, a form, or even a video
          player?
        </p>
      </ConversationalCallout>

      <Separator className="my-8" />

      {/* Aha Moment */}
      <AhaMoment
        setup="Html elements are regular DOM nodes above the canvas. So what's stopping you from putting 50 labels in your scene?"
        reveal="Performance. Every Html element creates a separate DOM node that gets repositioned via CSS transforms on every single frame. With 5-10 labels, this is fine. With 50, you start thrashing the browser's layout engine, and frame rates drop fast. For many labels, use the flat Text component from drei instead -- it renders entirely on the GPU with no DOM overhead."
      />

      <Separator className="my-8" />

      {/* Mental Model Challenge */}
      <MentalModelChallenge
        question="You want to add a tooltip to 200 trees in a forest scene. Each tree should show its species name on hover. Which approach would you use?"
        options={[
          {
            label: "200 Html components, one per tree",
            correct: false,
            explanation: "200 DOM elements updating their CSS transform every frame would crush your frame rate. The browser's layout engine cannot keep up.",
          },
          {
            label: "One shared Html component that moves to the hovered tree",
            correct: true,
            explanation: "Use a single Html component and reposition it to the hovered tree's location. One DOM element is cheap. You can also show/hide it based on hover state.",
          },
          {
            label: "Use Text3D for each tree label",
            correct: false,
            explanation: "Text3D creates heavy geometry for each label. 200 Text3D instances would be even more expensive than 200 Html components.",
          },
        ]}
        hint="Think about how many DOM elements the browser can update at 60fps..."
        answer="Use a single shared Html component. When the user hovers over a tree, move the Html to that tree's position and update the text content. This keeps the DOM footprint minimal (one element) while still giving you rich HTML formatting. The pattern is: one label, many targets."
      />

      <Separator className="my-8" />

      {/* Try This */}
      <Separator className="my-8" />
      <ScrollReveal>
        <TryThisList challenges={[
          { challenge: "Toggle showLabels off — labels vanish", hint: "Find the showLabels toggle in the demo controls and turn it off.", solution: "The HTML labels disappear, showing just the 3D objects without any DOM overlay.", difficulty: "beginner" },
          { challenge: "Set sphereSize to 1 — big planets", hint: "Increase the sphere size slider to 1.", solution: "Larger spheres make the labels feel more embedded in the scene, like orbiting planets with info cards.", difficulty: "beginner" },
          { challenge: "Max bobSpeed — bouncy spheres", hint: "Crank the bob speed slider to its maximum.", solution: "The spheres bob rapidly up and down, and the HTML labels track their position perfectly every frame.", difficulty: "beginner" },
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
                <h3 className="font-semibold text-sm">Limit Html Count</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Each Html component creates a DOM element updated every frame.
                Keep the total under 20 to avoid layout thrashing. For many
                labels, use the flat Text component or a shared Html pattern.
              </p>
            </div>
            <div className="rounded-lg border bg-card p-4 space-y-2">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="size-4 text-green-500" />
                <h3 className="font-semibold text-sm">Use wrapperClass</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Style the outer positioning div with wrapperClass instead of
                inline styles. This keeps your CSS organized and avoids
                unnecessary object recreation on re-renders.
              </p>
            </div>
            <div className="rounded-lg border bg-card p-4 space-y-2">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="size-4 text-green-500" />
                <h3 className="font-semibold text-sm">Always Occlude</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Use the occlude prop whenever labels should hide behind
                objects. Without it, labels float on top of everything,
                which breaks the spatial illusion completely.
              </p>
            </div>
            <div className="rounded-lg border bg-card p-4 space-y-2">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="size-4 text-green-500" />
                <h3 className="font-semibold text-sm">Set Pointer Events Explicitly</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Always add pointerEvents: &apos;auto&apos; on interactive Html
                elements. Without it, clicks pass through to the canvas
                and your buttons silently do nothing.
              </p>
            </div>
          </div>
        </section>
      </ScrollReveal>
    </div>
  );
}
