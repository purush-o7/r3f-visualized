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

const ResponsiveDemo = dynamic(
  () =>
    import("./_components/responsive-demo").then((m) => ({
      default: m.ResponsiveDemo,
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
    title: "Setting a fixed pixel size on the Canvas",
    subtitle: "Your 3D scene doesn't resize when the browser window changes",
    wrongCode: `// WRONG: Fixed pixel dimensions
<Canvas style={{ width: 800, height: 600 }}>
  <MyScene />
</Canvas>
// Scene stays 800x600 regardless of viewport`,
    rightCode: `// Let the parent container control size
<div className="w-full aspect-video">
  <Canvas>
    <MyScene />
  </Canvas>
</div>

// Canvas fills its parent by default
// Use CSS on the wrapper, not on Canvas
// R3F handles resize events automatically`,
    filename: "App.tsx",
    explanation:
      "R3F's Canvas component automatically fills its parent container and listens for resize events. Set dimensions on a wrapper div using CSS, and the Canvas adapts. Fixed pixel sizes break responsiveness.",
  },
  {
    title: "Not accounting for device pixel ratio (DPR)",
    subtitle: "Scene looks blurry on Retina displays or too expensive on mobile",
    wrongCode: `// No DPR control — uses device default
// Retina Mac: DPR 2 = 4x the pixels!
// That's a LOT of GPU work
<Canvas>
  <ExpensiveScene />
</Canvas>`,
    rightCode: `// Clamp DPR for performance control
<Canvas dpr={[1, 2]}>
  <ExpensiveScene />
</Canvas>

// Or set a fixed DPR
<Canvas dpr={1}>     {/* Always 1x */}
<Canvas dpr={1.5}>   {/* Balance of quality/perf */}

// Read current DPR in the scene
const dpr = useThree((s) => s.viewport.dpr);`,
    filename: "App.tsx",
    explanation:
      "Device pixel ratio determines how many physical pixels fill one CSS pixel. DPR 2 means 4x the rendering work. Pass dpr={[min, max]} to Canvas to cap it. Use lower DPR for complex scenes, higher for crisp text and simple visuals.",
  },
  {
    title: "Hardcoding object positions for one aspect ratio",
    subtitle: "Objects clip off-screen on portrait phones or pile up on ultrawide monitors",
    wrongCode: `// Positions hardcoded for 16:9
<mesh position={[-6, 0, 0]}> {/* Off screen on phone! */}
<mesh position={[6, 0, 0]}>  {/* Also off screen! */}`,
    rightCode: `// Scale positions based on viewport
function ResponsiveLayout() {
  const { viewport } = useThree();
  const spacing = viewport.width / 4;

  return (
    <>
      <mesh position={[-spacing, 0, 0]}>
        <boxGeometry />
      </mesh>
      <mesh position={[spacing, 0, 0]}>
        <boxGeometry />
      </mesh>
    </>
  );
}`,
    filename: "App.tsx",
    explanation:
      "useThree gives you viewport dimensions in Three.js units. Use these to compute positions and scales that adapt to any screen size. Objects stay within view on phones and spread out naturally on wider screens.",
  },
];

export default function ResponsiveResizePage() {
  return (
    <div className="relative max-w-4xl">
      <div className="absolute -top-10 -left-10 w-72 h-72 bg-gradient-to-br from-teal-500/10 via-emerald-500/10 to-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-3">
          <Badge variant="outline">Transforms & Color</Badge>
        </div>
        <h1 className="text-3xl font-bold tracking-tight mb-3">
          Responsive & Resize
        </h1>
        <p className="text-lg text-muted-foreground">
          Your 3D scene will be viewed on phones, tablets, laptops, and ultrawide
          monitors. It needs to adapt gracefully to every screen size and pixel
          density. R3F handles the heavy lifting — you just need to know how to
          work with the viewport and device pixel ratio.
        </p>
      </div>

      {/* What Could Go Wrong */}
      <WhatCouldGoWrong
        scenario="You build a beautiful 3D landing page on your 27-inch monitor. It looks perfect. Then you open it on your phone — objects are clipped off the edges, text is unreadable, and the frame rate is 12fps because the Retina display is rendering at 4x the pixels. Your 'responsive' website is only responsive in 2D."
        error="Scene renders at 12fps on iPhone. Objects clipped on portrait screens. Blurry on some devices."
        errorType="Responsive"
        accentColor="red"
      />

      <Separator className="my-8" />

      {/* Story Analogy */}
      <ConversationalCallout type="story">
        <p>Think of your 3D scene as <strong>liquid layout</strong> — like water filling any container.</p>
        <p>Pour water into a tall glass and it rises high and narrow. Pour it into a wide bowl and it spreads flat. The water adapts to the shape of its container. Your scene should do the same.</p>
        <p>R3F&apos;s Canvas is the container. It automatically fills its parent div and updates the renderer when the browser resizes. Your job is to make the <em>content</em> inside adapt — spacing objects based on viewport width, scaling elements for readability, and capping pixel density for performance.</p>
      </ConversationalCallout>

      <Separator className="my-8" />

      {/* Mental Model Flow */}
      <SimpleFlow
        steps={[
          { label: "Browser Resize", detail: "Window or container changes" },
          { label: "Canvas Adapts", detail: "R3F updates renderer size" },
          { label: "Viewport Updates", detail: "useThree provides new dims" },
          { label: "Scene Responds", detail: "Objects reposition/rescale", status: "success" },
        ]}
        accentColor="violet"
      />

      <Separator className="my-8" />

      {/* Interactive Demo */}
      <ResponsiveDemo />

      <Separator className="my-8" />

      {/* Guided Walkthrough */}
      <ScrollReveal>
        <section className="space-y-4">
          <h2 className="text-2xl font-bold">Hands-On: Making Scenes Responsive</h2>
          <p className="text-muted-foreground leading-relaxed">
            Let&apos;s make a 3D scene that adapts to any screen size, from phone
            to ultrawide. The key tools are CSS container sizing, the viewport
            object, and DPR control.
          </p>

          <div className="rounded-lg border bg-card p-4 space-y-3">
            <p className="text-sm font-medium">Step 1: Let CSS control the container</p>
            <CodeBlock
              code={`// The Canvas fills its parent container
// Control size with CSS on the wrapper

// Full viewport hero
<div className="w-full h-screen">
  <Canvas><MyScene /></Canvas>
</div>

// Aspect-ratio constrained
<div className="w-full aspect-video">
  <Canvas><MyScene /></Canvas>
</div>

// Responsive max-width
<div className="w-full max-w-4xl mx-auto aspect-[2/1]">
  <Canvas><MyScene /></Canvas>
</div>`}
              filename="App.tsx"
            />
            <p className="text-sm text-muted-foreground">
              Never set fixed pixel sizes on Canvas. Wrap it in a div and use
              CSS classes for sizing. R3F detects changes to the container and
              updates the renderer, camera aspect ratio, and viewport automatically.
            </p>
          </div>

          <div className="rounded-lg border bg-card p-4 space-y-3">
            <p className="text-sm font-medium">Step 2: Read viewport dimensions</p>
            <CodeBlock
              code={`function AdaptiveScene() {
  const { viewport, size } = useThree();

  // size = pixel dimensions { width, height }
  // viewport = Three.js world units at z=0
  //   { width, height, factor, dpr }

  const isMobile = size.width < 768;
  const scale = Math.min(viewport.width / 8, 1);

  return (
    <mesh scale={scale}>
      <boxGeometry />
      <meshStandardMaterial color="coral" />
    </mesh>
  );
}`}
              filename="App.tsx"
            />
            <p className="text-sm text-muted-foreground">
              The viewport object tells you how much 3D space is visible at the
              camera&apos;s current settings. Use viewport.width and viewport.height
              to position and scale objects relative to the visible area.
            </p>
          </div>

          <div className="rounded-lg border bg-card p-4 space-y-3">
            <p className="text-sm font-medium">Step 3: Control device pixel ratio</p>
            <CodeBlock
              code={`// DPR controls rendering resolution
// Higher = sharper but more GPU work

// Auto-detect but clamp
<Canvas dpr={[1, 2]}>
  {/* Uses device DPR but never above 2 */}
</Canvas>

// Performance mode: always 1x
<Canvas dpr={1}>
  {/* Best performance, slightly less sharp */}
</Canvas>

// Check DPR at runtime
function Scene() {
  const dpr = useThree((s) => s.viewport.dpr);
  // Reduce particle count on low DPR
  const count = dpr > 1 ? 10000 : 5000;
}`}
              filename="App.tsx"
            />
            <p className="text-sm text-muted-foreground">
              A DPR of 2 means rendering 4x the pixels (width x 2 and height x 2).
              This can tank performance on complex scenes. The dpr prop accepts
              a [min, max] range to cap it while still looking sharp on Retina displays.
            </p>
          </div>
        </section>
      </ScrollReveal>

      <Separator className="my-8" />

      {/* What You Just Learned */}
      <WhatYouJustLearned
        points={[
          "R3F's Canvas automatically fills its parent container and handles resize events.",
          "Use CSS on a wrapper div to control the Canvas size — never set fixed pixels on Canvas itself.",
          "useThree provides viewport dimensions in Three.js units for positioning objects relative to the visible area.",
          "Control DPR with the dpr prop on Canvas: dpr={[1, 2]} balances sharpness and performance.",
        ]}
      />

      <Separator className="my-8" />

      {/* Thought-Provoking Question */}
      <ConversationalCallout type="question">
        <p>
          If a Retina display with DPR 3 renders at 3x resolution, and your
          scene already struggles at 30fps — should you prioritize visual
          sharpness or smooth frame rate? At what DPR do diminishing returns
          make higher resolution imperceptible?
        </p>
      </ConversationalCallout>

      <Separator className="my-8" />

      {/* Aha Moment */}
      <AhaMoment
        setup="You might think responsive 3D is just about resizing the canvas element."
        reveal="That's only half the story. The canvas resizing is automatic — R3F handles it. The real challenge is content responsiveness: making objects reposition, rescale, and even change detail level based on screen size. A phone might show 3 objects instead of 10, use lower-poly meshes, and reduce particle counts. This is the same philosophy as responsive web design — progressively enhance for larger screens instead of degrading for smaller ones. Think 'mobile-first' for your 3D scenes too."
      />

      <Separator className="my-8" />

      {/* Mental Model Challenge */}
      <MentalModelChallenge
        question="You have 5 objects spaced evenly across the screen. On a wide monitor they look great, but on a phone they overlap. How do you fix this using useThree?"
        options={[
          { label: "Use viewport.width to calculate spacing dynamically", correct: true, explanation: "Correct! Divide viewport.width by the number of objects to get responsive spacing that adapts to any screen width." },
          { label: "Set a smaller FOV on mobile to fit more", correct: false, explanation: "Changing FOV would zoom out, making everything smaller. This doesn't solve the spacing — it just makes objects tinier." },
          { label: "Use CSS media queries on the Canvas", correct: false, explanation: "CSS media queries affect the container size but don't change how objects are positioned in 3D space. You need viewport-aware positioning." },
          { label: "Hide objects on smaller screens", correct: false, explanation: "This works as a last resort but it's better to reposition objects first. Progressive disclosure, not removal, should be the first strategy." },
        ]}
        hint="The useThree hook gives you viewport dimensions in Three.js world units..."
        answer="The viewport object from useThree tells you exactly how much 3D space is visible at the camera's depth. Divide viewport.width by the number of objects to get spacing, or multiply by a fraction to get margin. This ensures objects always fit within the visible area, regardless of screen size."
      />

      <Separator className="my-8" />

      {/* Try This */}
      <Separator className="my-8" />
      <ScrollReveal>
        <TryThisList challenges={[
          { challenge: "Set DPR to 1 — pixelated!", hint: "Force the device pixel ratio to 1.", solution: "On a Retina display, the scene looks noticeably blurrier but runs significantly faster.", difficulty: "beginner" },
          { challenge: "Resize your browser — shapes adapt", hint: "Drag the browser window to different sizes and watch the scene.", solution: "Objects reposition and rescale based on viewport dimensions, staying within the visible area.", difficulty: "beginner" },
          { challenge: "Set DPR to 3 — crispy but slow", hint: "Force the device pixel ratio to 3.", solution: "The scene renders at 9x the pixels. It looks razor sharp but the GPU works much harder.", difficulty: "beginner" },
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
                <h3 className="font-semibold text-sm">Size with CSS, Not Props</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Wrap Canvas in a div and control sizing with Tailwind or CSS.
                R3F auto-fills its parent and handles all resize events.
              </p>
            </div>
            <div className="rounded-lg border bg-card p-4 space-y-2">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="size-4 text-green-500" />
                <h3 className="font-semibold text-sm">Cap DPR at 2</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Use dpr={"{[1, 2]}"} on Canvas. DPR above 2 rarely improves visual
                quality but significantly increases rendering cost.
              </p>
            </div>
            <div className="rounded-lg border bg-card p-4 space-y-2">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="size-4 text-green-500" />
                <h3 className="font-semibold text-sm">Use viewport for Positioning</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Read viewport.width and viewport.height from useThree to position
                objects relative to the visible area, ensuring they adapt to any
                aspect ratio.
              </p>
            </div>
            <div className="rounded-lg border bg-card p-4 space-y-2">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="size-4 text-green-500" />
                <h3 className="font-semibold text-sm">Test on Real Devices</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Browser DevTools device emulation doesn&apos;t accurately represent
                mobile GPU performance. Test on actual phones to catch frame rate
                issues early.
              </p>
            </div>
          </div>
        </section>
      </ScrollReveal>
    </div>
  );
}
