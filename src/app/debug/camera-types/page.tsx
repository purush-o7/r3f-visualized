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
  () =>
    import("./_components/camera-demo").then((m) => ({
      default: m.CameraDemo,
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
    title: "Setting near plane too close to zero",
    subtitle: "Z-fighting causes flickering surfaces everywhere",
    wrongCode: `// Near plane at 0.001 causes z-fighting
<Canvas camera={{
  near: 0.001,
  far: 10000,
  fov: 50
}}>`,
    rightCode: `// Keep near plane as large as possible
<Canvas camera={{
  near: 0.1,   // or even 1 for large scenes
  far: 1000,   // only as far as needed
  fov: 50
}}>

// Rule of thumb: far/near ratio < 10,000`,
    filename: "App.tsx",
    explanation:
      "The depth buffer has limited precision. A tiny near plane with a huge far plane spreads that precision thin, causing z-fighting — where two surfaces at nearly the same depth flicker between showing one or the other. Keep the near/far ratio as small as possible.",
  },
  {
    title: "Using wrong camera type for the job",
    subtitle: "A 2D UI built with perspective camera, or a 3D game with orthographic",
    wrongCode: `// Perspective camera for a 2D strategy game
// Objects change size as camera moves!
<Canvas camera={{ fov: 75 }}>
  <IsometricMap />
</Canvas>`,
    rightCode: `// Orthographic for isometric/2D games
<Canvas orthographic camera={{
  zoom: 50,
  position: [10, 10, 10]
}}>
  <IsometricMap />
</Canvas>

// Perspective for immersive 3D experiences
<Canvas camera={{ fov: 50 }}>
  <FirstPersonWorld />
</Canvas>`,
    filename: "App.tsx",
    explanation:
      "Perspective cameras create a sense of depth — great for immersive 3D. Orthographic cameras show everything at the same scale regardless of distance — perfect for isometric games, 2D views, and technical visualizations. Pick the right tool for the job.",
  },
  {
    title: "FOV too wide or too narrow",
    subtitle: "Scene looks like a fisheye lens or a telephoto zoom",
    wrongCode: `// 120 FOV = extreme fisheye distortion
<Canvas camera={{ fov: 120 }}>

// 10 FOV = almost no depth, flat feeling
<Canvas camera={{ fov: 10 }}>`,
    rightCode: `// 45-60 FOV for most scenes
<Canvas camera={{ fov: 50 }}>

// 75 FOV for wider immersive scenes
<Canvas camera={{ fov: 75 }}>

// Match the "feel" you want:
// 35-50 = cinematic, focused
// 50-65 = natural, balanced
// 65-90 = wide, immersive`,
    filename: "App.tsx",
    explanation:
      "FOV (Field of View) is measured in degrees and controls how wide the camera sees. Low values feel like a telephoto lens (zoomed in, flat). High values feel like a fisheye (wide, distorted edges). 45-60 degrees matches natural human vision for most display sizes.",
  },
];

export default function CameraTypesPage() {
  return (
    <div className="relative max-w-4xl">
      <div className="absolute -top-10 -left-10 w-72 h-72 bg-gradient-to-br from-teal-500/10 via-emerald-500/10 to-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-3">
          <Badge variant="outline">Debug & Helpers</Badge>
        </div>
        <h1 className="text-3xl font-bold tracking-tight mb-3">
          Camera Types
        </h1>
        <p className="text-lg text-muted-foreground">
          The camera determines how your 3D world is projected onto a flat screen.
          Two fundamental types exist: PerspectiveCamera mimics how human eyes
          see (distant things look smaller), and OrthographicCamera preserves size
          regardless of distance. Choosing the right one changes everything.
        </p>
      </div>

      {/* What Could Go Wrong */}
      <WhatCouldGoWrong
        scenario="You're building an isometric strategy game. Everything should look clean and uniform. But distant buildings appear smaller than close ones, grid lines converge toward the horizon, and your carefully designed tile layout looks warped. You're using a PerspectiveCamera for something that needs no perspective at all."
        error="Isometric game looks like a 3D FPS instead of a clean top-down view. Tile alignment is broken."
        errorType="Visual"
        accentColor="red"
      />

      <Separator className="my-8" />

      {/* Story Analogy */}
      <ConversationalCallout type="story">
        <p>Think of it as <strong>Window vs Telescope</strong>.</p>
        <p>A <strong>PerspectiveCamera</strong> is like looking through a window. Things close to you are big, things far away are small. Railroad tracks converge in the distance. This is how your eyes work — it feels natural and immersive.</p>
        <p>An <strong>OrthographicCamera</strong> is like looking through a technical scope. Everything is the same size regardless of distance. Railroad tracks stay perfectly parallel. This is how blueprints and isometric games work — clean, precise, no distortion.</p>
        <p>Neither is &quot;better&quot; — they serve different purposes. An FPS game needs perspective. An isometric city builder needs orthographic.</p>
      </ConversationalCallout>

      <Separator className="my-8" />

      {/* Mental Model Flow */}
      <SimpleFlow
        steps={[
          { label: "3D Scene", detail: "Objects in world space" },
          { label: "Camera", detail: "Projects 3D to 2D" },
          { label: "Screen", detail: "Flat image you see", status: "success" },
        ]}
        accentColor="blue"
      />

      <Separator className="my-8" />

      {/* Interactive Demo */}
      <CameraDemo />

      <Separator className="my-8" />

      {/* Guided Walkthrough */}
      <ScrollReveal>
        <section className="space-y-4">
          <h2 className="text-2xl font-bold">Hands-On: Setting Up Cameras</h2>
          <p className="text-muted-foreground leading-relaxed">
            Let&apos;s configure both camera types to understand how their
            parameters shape what you see on screen.
          </p>

          <div className="rounded-lg border bg-card p-4 space-y-3">
            <p className="text-sm font-medium">Step 1: PerspectiveCamera basics</p>
            <CodeBlock
              code={`// The default camera in R3F is Perspective
<Canvas camera={{
  fov: 50,            // Field of View (degrees)
  near: 0.1,          // Closest visible distance
  far: 1000,          // Farthest visible distance
  position: [3, 2, 3] // Where the camera sits
}}>
  <MyScene />
</Canvas>

// FOV controls "zoom" — lower = more zoomed in
// near/far define the visible range (frustum)`}
              filename="App.tsx"
            />
            <p className="text-sm text-muted-foreground">
              The four key parameters are FOV (how wide you see), near plane
              (closest visible distance), far plane (farthest visible distance),
              and position (where the camera is placed in world space).
            </p>
          </div>

          <div className="rounded-lg border bg-card p-4 space-y-3">
            <p className="text-sm font-medium">Step 2: OrthographicCamera setup</p>
            <CodeBlock
              code={`// Tell R3F to use an orthographic camera
<Canvas orthographic camera={{
  zoom: 50,             // Controls visible area
  near: 0.1,
  far: 1000,
  position: [5, 5, 5]   // Isometric angle
}}>
  <MyScene />
</Canvas>

// Zoom replaces FOV — higher = more zoomed in
// No perspective distortion at any zoom level`}
              filename="App.tsx"
            />
            <p className="text-sm text-muted-foreground">
              For orthographic cameras, zoom replaces FOV. A higher zoom value
              means you see less of the scene (more zoomed in). There is no
              perspective foreshortening — parallel lines stay parallel.
            </p>
          </div>

          <div className="rounded-lg border bg-card p-4 space-y-3">
            <p className="text-sm font-medium">Step 3: Switching cameras at runtime</p>
            <CodeBlock
              code={`// Use useThree to swap cameras dynamically
function CameraSwitch({ type }: { type: string }) {
  const { set, size } = useThree();

  useEffect(() => {
    const aspect = size.width / size.height;
    const cam = type === "perspective"
      ? new THREE.PerspectiveCamera(50, aspect, 0.1, 1000)
      : new THREE.OrthographicCamera(
          -4 * aspect, 4 * aspect, 4, -4, 0.1, 1000
        );
    cam.position.set(5, 5, 5);
    cam.lookAt(0, 0, 0);
    set({ camera: cam });
  }, [type, size, set]);

  return null;
}`}
              filename="App.tsx"
            />
            <p className="text-sm text-muted-foreground">
              You can switch between camera types at runtime using the useThree
              hook. Create a new camera instance, position it, and pass it to the
              set function. The scene re-renders with the new projection.
            </p>
          </div>
        </section>
      </ScrollReveal>

      <Separator className="my-8" />

      {/* What You Just Learned */}
      <WhatYouJustLearned
        points={[
          "PerspectiveCamera creates depth via foreshortening — distant objects appear smaller, like human vision.",
          "OrthographicCamera preserves size regardless of distance — perfect for isometric games and technical views.",
          "FOV controls the angular width of a perspective camera. 45-60 degrees feels natural for most scenes.",
          "Near and far planes define the visible depth range. Keep the near/far ratio below 10,000 to avoid z-fighting.",
        ]}
      />

      <Separator className="my-8" />

      {/* Thought-Provoking Question */}
      <ConversationalCallout type="question">
        <p>
          If you&apos;re building a product configurator where users orbit around a
          shoe, which camera type would you choose? What if the shoe needs to look
          exactly the same size from every angle for consistent marketing shots?
        </p>
      </ConversationalCallout>

      <Separator className="my-8" />

      {/* Aha Moment */}
      <AhaMoment
        setup="You might think orthographic cameras are 'less realistic' and therefore worse."
        reveal="Many blockbuster games use orthographic cameras by design. Clash of Clans, SimCity, Factorio, and most RTS games are orthographic. It's not about realism — it's about readability. When you need players to understand spatial relationships instantly (is this unit next to that building?), constant sizing is clearer than perspective distortion. The 'best' camera is the one that serves your design goal."
      />

      <Separator className="my-8" />

      {/* Mental Model Challenge */}
      <MentalModelChallenge
        question="You have two identical cubes, one at z=-2 and one at z=-20. With a PerspectiveCamera, the far cube appears smaller. What happens if you switch to OrthographicCamera?"
        options={[
          { label: "Both cubes appear the same size", correct: true, explanation: "Correct! Orthographic projection preserves size regardless of distance. Both cubes project to the same size on screen." },
          { label: "The far cube disappears", correct: false, explanation: "As long as z=-20 is within the near/far range, both cubes are visible. Orthographic cameras just remove perspective scaling." },
          { label: "The near cube appears smaller", correct: false, explanation: "Orthographic cameras don't reverse perspective — they remove it entirely. Both cubes appear identical." },
          { label: "Both cubes get distorted", correct: false, explanation: "Orthographic cameras actually reduce distortion. Parallel edges stay parallel, and sizes are preserved." },
        ]}
        hint="Think about what 'orthographic' means — no perspective scaling..."
        answer="With an orthographic camera, distance from the camera has zero effect on apparent size. A 1x1 cube at z=-2 and z=-20 both project to exactly the same screen size. This is what makes orthographic cameras ideal for technical drawings and isometric games."
      />

      <Separator className="my-8" />

      {/* Try This */}
      <Separator className="my-8" />
      <ScrollReveal>
        <TryThisList challenges={[
          { challenge: "Switch to Orthographic — no perspective!", hint: "Toggle the camera type to Orthographic in the demo controls.", solution: "All objects appear the same size regardless of distance. Parallel lines stay parallel — perfect for isometric views.", difficulty: "beginner" },
          { challenge: "Set FOV to 120 — fisheye!", hint: "Increase the field of view to 120 degrees.", solution: "Extreme FOV creates a fisheye-like distortion where edges of the scene curve and objects appear stretched.", difficulty: "beginner" },
          { challenge: "Set near to 5 — objects clip", hint: "Push the near clipping plane to 5.", solution: "Objects closer than 5 units get clipped away, as if an invisible wall cuts through them.", difficulty: "beginner" },
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
                <h3 className="font-semibold text-sm">Match Camera to Purpose</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Use perspective for immersive 3D experiences. Use orthographic for
                isometric views, 2D games, UI elements, and technical visualizations.
              </p>
            </div>
            <div className="rounded-lg border bg-card p-4 space-y-2">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="size-4 text-green-500" />
                <h3 className="font-semibold text-sm">Minimize Near/Far Range</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Set near as large and far as small as your scene allows. A tight
                range gives the depth buffer more precision and prevents z-fighting.
              </p>
            </div>
            <div className="rounded-lg border bg-card p-4 space-y-2">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="size-4 text-green-500" />
                <h3 className="font-semibold text-sm">FOV Between 45-65</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                A FOV of 50-60 degrees feels natural on most displays. Go wider for
                immersive scenes, narrower for cinematic framing. Avoid extremes.
              </p>
            </div>
            <div className="rounded-lg border bg-card p-4 space-y-2">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="size-4 text-green-500" />
                <h3 className="font-semibold text-sm">Handle Aspect Ratio Changes</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                R3F automatically updates the camera aspect ratio on resize. If you
                create cameras manually, update the projection matrix when the
                viewport changes.
              </p>
            </div>
          </div>
        </section>
      </ScrollReveal>
    </div>
  );
}
