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

const EnvDemo = dynamic(
  () => import("./_components/env-demo").then((m) => ({ default: m.EnvDemo })),
  {
    ssr: false,
    loading: () => (
      <div className="w-full aspect-[2/1] rounded-xl border bg-scene-bg animate-pulse" />
    ),
  }
);

const mistakes: Mistake[] = [
  {
    title: "Using Environment background AND a Sky component",
    subtitle: "Two components fight over the same scene background",
    wrongCode: `<>
  {/* Both try to set scene.background! */}
  <Environment preset="sunset" background />
  <Sky sunPosition={[1, 0.5, 0]} />
</>`,
    rightCode: `{/* Option A: Environment for everything */}
<Environment preset="sunset" background />

{/* Option B: Sky for background, Environment for lighting */}
<Sky sunPosition={[1, 0.5, 0]} />
<Environment preset="sunset" />`,
    filename: "Experience.tsx",
    explanation:
      "When you set background={true} on Environment, it assigns the HDRI as the scene background. Sky also sets the scene background. Both fight over the same property, causing visual conflicts. Choose one approach: Environment with background for both IBL and skybox, or Sky for the visible background and Environment without background for lighting only.",
  },
  {
    title: "Sharp HDRI background distracting from the product",
    subtitle: "The background competes with your model for attention",
    wrongCode: `<Environment
  preset="warehouse"
  background   // Sharp warehouse walls everywhere
/>`,
    rightCode: `<Environment
  preset="warehouse"
  background
  blur={0.6}                 // Soft background
  backgroundIntensity={0.5}  // Dimmed
  environmentIntensity={1.5} // Lighting stays strong
/>`,
    filename: "ProductShot.tsx",
    explanation:
      "For product shots, a sharp HDRI background competes for attention. The blur prop softens the background while keeping reflections crisp. Combined with dimmed backgroundIntensity and boosted environmentIntensity, you get a professional studio look that keeps focus on the product.",
  },
  {
    title: "Loading a huge 4K HDR file when a preset works",
    subtitle: "Users wait 15-30 seconds to download the environment",
    wrongCode: `// 20MB 4K HDRI from a CDN
<Environment
  files="countryside_4k.hdr"
  path="https://cdn.example.com/hdri/"
  background
/>`,
    rightCode: `// Built-in presets are tiny and cached
<Environment preset="sunset" background />

// If custom, use the smallest resolution that works
// <Environment files="countryside_1k.hdr" blur={0.4} />`,
    filename: "Optimized.tsx",
    explanation:
      "A 4K HDR file can be 15-30MB. Built-in presets are optimized and much smaller. If you need a custom HDRI, use 1K or 2K instead of 4K, especially if you blur the background. For lighting-only use (no background prop), even lower resolutions work because the IBL is already blurred for rough materials.",
  },
];

export default function EnvironmentPage() {
  return (
    <div className="relative max-w-4xl">
      <div className="absolute -top-10 -left-10 w-72 h-72 bg-gradient-to-br from-teal-500/10 via-emerald-500/10 to-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
      {/* 1. Title + Badge + Intro */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-3">
          <Badge variant="outline">Staging</Badge>
        </div>
        <h1 className="text-3xl font-bold tracking-tight mb-3">Environment</h1>
        <p className="text-lg text-muted-foreground">
          The Environment component wraps a panoramic image around your scene
          to create realistic lighting and reflections. Without it, metallic
          surfaces look flat and lifeless. With it, every shiny object reflects
          the world around it, and the whole scene feels grounded in a real
          place.
        </p>
      </div>

      {/* 2. What Could Go Wrong */}
      <WhatCouldGoWrong
        scenario="You model a beautiful chrome car, export it, and load it into R3F. But the chrome looks dull grey, almost matte. You add more lights, crank up metalness — still flat. The problem? Chrome needs something to reflect. Without an Environment providing a 360-degree image, there is nothing for the metal to mirror."
        error="Metallic materials appear flat grey. Reflections show nothing because scene.environment is null."
        errorType="Flat Reflections"
      />

      <Separator className="my-8" />

      {/* 3. Story Analogy */}
      <ScrollReveal>
        <ConversationalCallout type="story">
          <p>
            Photographers who shoot product photos use a technique called HDRI
            lighting. They go to a real location — a sunset beach, a city
            street, a warehouse — and take a full 360-degree photo using a
            special camera.
          </p>
          <p>
            Back in the studio, they wrap that photo around the scene like a
            giant dome. Now when they photograph a shiny watch, it reflects the
            sunset. A chrome vase mirrors the warehouse walls. The product
            looks like it is actually there.
          </p>
          <p>
            The Environment component does exactly this. It takes an HDRI photo
            and wraps it around your 3D scene. Every reflective surface picks
            up the colors, light, and shapes from that photo.
          </p>
        </ConversationalCallout>
      </ScrollReveal>

      <Separator className="my-8" />

      {/* 4. SimpleFlow — Mental Model */}
      <ScrollReveal>
        <section className="space-y-4">
          <h2 className="text-2xl font-bold">What Environment Does</h2>
          <p className="text-muted-foreground leading-relaxed">
            It serves two purposes, and you can use one or both.
          </p>
          <SimpleFlow
            steps={[
              {
                label: "HDRI Image",
                detail: "A 360-degree photo of a real place",
              },
              {
                label: "IBL Lighting",
                detail: "Light comes from all directions naturally",
              },
              {
                label: "Reflections",
                detail: "Shiny objects mirror the environment",
                status: "success",
              },
              {
                label: "Background",
                detail: "Optional: show the HDRI as a skybox",
                status: "success",
              },
            ]}
          />
        </section>
      </ScrollReveal>

      <Separator className="my-8" />

      {/* 5. Interactive Demo */}
      <EnvDemo />

      <Separator className="my-8" />

      {/* 6. Guided Walkthrough */}
      <ScrollReveal>
        <section className="space-y-6">
          <h2 className="text-2xl font-bold">Guided Walkthrough</h2>
          <p className="text-muted-foreground leading-relaxed">
            Let us go from a dull scene to a photorealistic one in three steps.
          </p>

          <div className="bg-card border rounded-lg p-4 space-y-3">
            <h3 className="font-semibold text-sm">
              Step 1 — Add a preset for instant IBL
            </h3>
            <CodeBlock
              code={`import { Environment } from '@react-three/drei'

{/* Presets: sunset, dawn, night, warehouse,
    forest, apartment, studio, city, park, lobby */}
<Environment preset="sunset" />

<mesh>
  <sphereGeometry args={[1, 64, 64]} />
  <meshStandardMaterial metalness={0.9} roughness={0.1} />
</mesh>`}
              filename="BasicEnvironment.tsx"
            />
            <p className="text-sm text-muted-foreground">
              One line gives you physically accurate lighting from all
              directions. The metallic sphere now reflects warm sunset colors
              instead of looking flat grey. Presets are small and cached.
            </p>
          </div>

          <div className="bg-card border rounded-lg p-4 space-y-3">
            <h3 className="font-semibold text-sm">
              Step 2 — Show the environment as a background
            </h3>
            <CodeBlock
              code={`{/* Lighting only — black background */}
<Environment preset="city" />

{/* Now the HDRI is visible behind everything */}
<Environment preset="city" background />

{/* Blurred for a product-shot look */}
<Environment
  preset="warehouse"
  background
  blur={0.6}
  backgroundIntensity={0.5}
/>`}
              filename="BackgroundOptions.tsx"
            />
            <p className="text-sm text-muted-foreground">
              The background prop renders the HDRI as a visible skybox behind
              your objects. Add blur to soften it for a product photography
              feel. Dim it with backgroundIntensity to keep the focus on your
              model.
            </p>
          </div>

          <div className="bg-card border rounded-lg p-4 space-y-3">
            <h3 className="font-semibold text-sm">
              Step 3 — Build a custom environment with Lightformers
            </h3>
            <CodeBlock
              code={`import { Environment, Lightformer } from '@react-three/drei'

<Environment background>
  <Lightformer
    form="ring" intensity={2}
    position={[0, 5, -5]}
    scale={[10, 10, 1]}
    color="cyan"
  />
  <Lightformer
    form="rect" intensity={1}
    position={[5, 0, 0]}
    scale={[20, 2, 1]}
    color="white"
  />
</Environment>`}
              filename="CustomEnvironment.tsx"
            />
            <p className="text-sm text-muted-foreground">
              Instead of loading an HDRI, you can build a procedural
              environment from scratch using Lightformer shapes. You get
              pixel-perfect control over every reflection — great for car
              configurators and branded product shots.
            </p>
          </div>
        </section>
      </ScrollReveal>

      <Separator className="my-8" />

      {/* 7. What You Just Learned */}
      <ScrollReveal>
        <WhatYouJustLearned
          points={[
            "Environment provides image-based lighting (IBL) from a 360-degree photo",
            "Without it, metallic and reflective materials look flat and lifeless",
            "Built-in presets cover common scenarios and are small and cached",
            "The background prop renders the HDRI as a visible skybox",
            "Lightformers let you build custom environments with precise control over reflections",
          ]}
        />
      </ScrollReveal>

      <Separator className="my-8" />

      {/* 8. Thought-Provoking Question */}
      <ScrollReveal>
        <ConversationalCallout type="question">
          <p>
            If Environment provides beautiful lighting from all directions, do
            you still need to add directional lights and ambient lights to your
            scene? Think about what IBL gives you versus what a directional
            light gives you (like cast shadows).
          </p>
        </ConversationalCallout>
      </ScrollReveal>

      <Separator className="my-8" />

      {/* 9. Aha Moment */}
      <ScrollReveal>
        <AhaMoment
          setup="Why does a chrome sphere look completely different with 'sunset' versus 'warehouse' preset, even though the material is identical?"
          reveal="The material just says 'I am 90% metallic and 10% rough.' It is the environment that decides WHAT gets reflected. A sunset environment fills the sphere with warm oranges and purples. A warehouse fills it with grey walls and fluorescent lights. The material is a mirror — the environment is what appears in the mirror."
        />
      </ScrollReveal>

      <Separator className="my-8" />

      {/* 10. Mental Model Challenge */}
      <ScrollReveal>
        <MentalModelChallenge
          question="You have a scene with <Environment preset='sunset' /> (no background prop). What does the user see behind the 3D objects?"
          options={[
            {
              label: "A beautiful sunset skybox",
              correct: false,
              explanation:
                "The background prop is needed to render the HDRI visually.",
            },
            {
              label: "The default canvas clear color (usually black or transparent)",
              correct: true,
              explanation:
                "Without the background prop, the HDRI is used only for lighting and reflections, not as a visible backdrop.",
            },
            {
              label: "A blurred version of the sunset",
              correct: false,
              explanation:
                "Blur only applies when background is enabled. Without background, nothing is shown.",
            },
            {
              label: "An error because you forgot the background prop",
              correct: false,
              explanation:
                "No error. Lighting-only mode is a perfectly valid use case.",
            },
          ]}
          answer="Without the background prop, the HDRI is used invisibly. It lights the scene and fills reflections, but the area behind your objects shows the canvas clear color. This is useful when you want realistic lighting but a custom or transparent background."
        />
      </ScrollReveal>

      <Separator className="my-8" />

      {/* Try This */}
      <Separator className="my-8" />
      <ScrollReveal>
        <TryThisList challenges={[
          { challenge: "Switch preset to 'night' — dark reflections!", hint: "Change the preset prop on the Environment component to 'night'.", solution: "Set preset='night' and watch how metallic objects reflect a darker sky.", difficulty: "beginner" },
          { challenge: "Set backgroundBlur to 0 — sharp background", hint: "The blur prop controls background softness. Try setting it to 0.", solution: "Set blur={0} on the Environment component to see a crisp, unblurred HDRI background.", difficulty: "beginner" },
          { challenge: "Set envIntensity to 0 — no reflections at all", hint: "The environmentIntensity prop controls how much the HDRI affects reflections.", solution: "Set environmentIntensity={0} — metallic surfaces go flat grey, proving that reflections come entirely from the environment.", difficulty: "beginner" },
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
                <h3 className="font-semibold text-sm">Start with presets</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Built-in presets are optimized and small. Only switch to
                custom HDRIs when you need a specific look that no preset
                matches.
              </p>
            </div>
            <div className="rounded-lg border bg-card p-4 space-y-2">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="size-4 text-green-500" />
                <h3 className="font-semibold text-sm">Blur product backgrounds</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Use <code>blur=&#123;0.4-0.7&#125;</code> with a dimmed
                backgroundIntensity for professional product shots that keep
                focus on the model.
              </p>
            </div>
            <div className="rounded-lg border bg-card p-4 space-y-2">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="size-4 text-green-500" />
                <h3 className="font-semibold text-sm">
                  Use Sky for sky backgrounds
                </h3>
              </div>
              <p className="text-sm text-muted-foreground">
                If you just need a sky background, the Sky component is
                cheaper and more configurable. Use Environment for IBL
                and Sky for the visible backdrop.
              </p>
            </div>
            <div className="rounded-lg border bg-card p-4 space-y-2">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="size-4 text-green-500" />
                <h3 className="font-semibold text-sm">
                  Lightformers for branding
                </h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Procedural environments with Lightformers give you
                pixel-perfect control over reflections. Essential for car
                configurators and branded product pages.
              </p>
            </div>
          </div>
        </section>
      </ScrollReveal>
    </div>
  );
}
