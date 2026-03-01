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

const EnvMapDemoComponent = dynamic(
  () =>
    import("./_components/env-map-demo").then((m) => ({
      default: m.EnvMapDemo,
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
    title: "HDR panorama shows as the scene background when you only wanted lighting",
    subtitle: "Setting both environment and background to the same texture",
    wrongCode: `// This sets BOTH lighting AND visible background
<Environment preset="sunset" background />

// The HDR panorama is now the scene backdrop
// which may not match your design`,
    rightCode: `// Lighting only — no visible panorama background
<Environment preset="studio" />

// Or use a separate solid color/image as background
// while keeping the HDR for lighting
<color attach="background" args={["#111111"]} />`,
    filename: "env-vs-bg.tsx",
    explanation:
      "scene.environment provides image-based lighting for PBR materials. scene.background is what appears behind all objects. You can use the same HDR for both, or use completely different images. Setting background when you only wanted lighting puts an unwanted panoramic backdrop in your scene.",
  },
  {
    title: "Metallic surfaces appear completely black",
    subtitle: "No environment map for the metal to reflect",
    wrongCode: `<meshStandardMaterial
  color="#ffffff"
  roughness={0}
  metalness={1}
/>
// No environment map = nothing to reflect = black`,
    rightCode: `import { Environment } from '@react-three/drei'

<Environment preset="studio" />
<meshStandardMaterial
  color="#ffffff"
  roughness={0}
  metalness={1}
/>
// Now the chrome has something to reflect`,
    filename: "black-metal.tsx",
    explanation:
      "Metals get their visible color entirely from reflections. Unlike wood or plastic, metals have no diffuse scattering. If there is nothing to reflect — no environment map, no lights — the surface is pure black. Always provide an environment map when using metallic PBR materials.",
  },
  {
    title: "GPU memory leak from unused source texture",
    subtitle: "Not disposing the original HDR after PMREM processing",
    wrongCode: `rgbeLoader.load('/hdri/studio.hdr', (texture) => {
  const envMap = pmrem.fromEquirectangular(texture).texture;
  scene.environment = envMap;
  // Original HDR still in GPU memory — wasted!
});`,
    rightCode: `rgbeLoader.load('/hdri/studio.hdr', (texture) => {
  const envMap = pmrem.fromEquirectangular(texture).texture;
  scene.environment = envMap;
  texture.dispose();  // free the source HDR
  pmrem.dispose();    // free the generator
});`,
    filename: "pmrem-dispose.tsx",
    explanation:
      "PMREMGenerator creates a new prefiltered texture from the source HDR. After processing, the original HDR is no longer needed. Failing to dispose it leaves a large texture in GPU memory permanently. Always call dispose() on both the source and the generator.",
  },
];

export default function EnvironmentMapsPage() {
  return (
    <div className="max-w-4xl ambient-lights">
      {/* 1. Title + Badge + Intro */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-3">
          <Badge variant="outline">Lights</Badge>
        </div>
        <h1 className="text-3xl font-bold tracking-tight mb-3">
          Environment Maps
        </h1>
        <p className="text-lg text-muted-foreground">
          Environment maps are panoramic images that wrap around your entire
          scene. They provide realistic reflections and ambient lighting that
          make PBR materials look stunning — especially metals and glossy
          surfaces.
        </p>
      </div>

      {/* 2. What Could Go Wrong */}
      <WhatCouldGoWrong
        scenario="You spend an hour crafting a perfect chrome sphere with metalness=1 and roughness=0, but it renders as a solid black ball. You try different colors, different positions, different cameras — still black. The chrome has nothing to reflect. Without an environment map, metallic surfaces are blind mirrors in a pitch-black void."
        error="Metallic PBR material renders as pure black with no visible reflections."
        errorType="Missing Env Map"
      />

      <Separator className="my-8" />

      {/* 3. Story Analogy */}
      <ScrollReveal>
        <ConversationalCallout type="story">
          <p>
            Have you ever seen a photographer place a shiny chrome ball in the
            middle of a room? They photograph the ball, and in its reflection
            you can see a complete 360-degree view of the entire room — walls,
            ceiling, windows, everything.
          </p>
          <p>
            Environment maps do the exact same thing, but in reverse. Instead
            of capturing the world into a ball, you take a panoramic photo of
            the world and <strong>project it onto your objects</strong>.
          </p>
          <p>
            Every shiny surface in your scene uses that panoramic image to
            figure out what it should be reflecting. A chrome faucet shows a
            blurry version of the room. A polished marble floor shows the
            ceiling. A car's paint reflects the sky. All from one single image
            wrapped around the scene.
          </p>
        </ConversationalCallout>
      </ScrollReveal>

      <Separator className="my-8" />

      {/* 4. SimpleFlow */}
      <ScrollReveal>
        <section className="space-y-4">
          <h2 className="text-2xl font-bold">
            What an Environment Map Does
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            An environment map serves two separate purposes. You can use it for
            one, the other, or both.
          </p>
          <SimpleFlow
            steps={[
              {
                label: "HDR Image",
                detail: "Panoramic photo of a scene",
              },
              {
                label: "scene.environment",
                detail: "Lighting + reflections for PBR materials",
                status: "success",
              },
              {
                label: "scene.background",
                detail: "Visible backdrop behind all objects",
                status: "success",
              },
            ]}
          />
        </section>
      </ScrollReveal>

      <Separator className="my-8" />

      {/* 5. Interactive Demo */}
      <EnvMapDemoComponent />

      <Separator className="my-8" />

      {/* 6. Guided Walkthrough */}
      <ScrollReveal>
        <section className="space-y-6">
          <h2 className="text-2xl font-bold">Guided Walkthrough</h2>
          <p className="text-muted-foreground leading-relaxed">
            Let us go from a black chrome sphere to a stunning reflective
            scene in three steps.
          </p>

          {/* Step 1 */}
          <div className="bg-card border rounded-lg p-4 space-y-3">
            <h3 className="font-semibold text-sm">
              Step 1 — Add an environment map with a drei preset
            </h3>
            <CodeBlock
              code={`import { Environment } from '@react-three/drei'

{/* One line — provides IBL to all PBR materials */}
<Environment preset="studio" />`}
              filename="step-1-preset.tsx"
            />
            <p className="text-sm text-muted-foreground">
              The Environment component from drei handles all the HDR loading
              and processing for you. The "studio" preset gives you clean,
              neutral lighting perfect for product shots. Every PBR material in
              the scene automatically picks up the reflections.
            </p>
          </div>

          {/* Step 2 */}
          <div className="bg-card border rounded-lg p-4 space-y-3">
            <h3 className="font-semibold text-sm">
              Step 2 — Show it as a visible background too
            </h3>
            <CodeBlock
              code={`{/* background makes the HDR panorama visible */}
{/* backgroundBlurriness softens it so it does not compete */}
<Environment
  preset="sunset"
  background
  backgroundBlurriness={0.5}
/>`}
              filename="step-2-background.tsx"
            />
            <p className="text-sm text-muted-foreground">
              Adding the background prop makes the panoramic image visible
              behind your objects. The backgroundBlurriness prop softens it so
              your objects remain the focal point rather than the backdrop.
            </p>
          </div>

          {/* Step 3 */}
          <div className="bg-card border rounded-lg p-4 space-y-3">
            <h3 className="font-semibold text-sm">
              Step 3 — Control reflection strength per material
            </h3>
            <CodeBlock
              code={`{/* Strong reflections on chrome */}
<meshStandardMaterial
  metalness={1} roughness={0}
  envMapIntensity={1.5}
/>

{/* Subtle reflections on plastic */}
<meshStandardMaterial
  metalness={0} roughness={0.3}
  envMapIntensity={0.3}
/>`}
              filename="step-3-intensity.tsx"
            />
            <p className="text-sm text-muted-foreground">
              The envMapIntensity prop lets you control how much each material
              reflects the environment. Crank it up for chrome and mirrors,
              dial it down for matte surfaces that should not look too shiny.
            </p>
          </div>
        </section>
      </ScrollReveal>

      <Separator className="my-8" />

      {/* 7. What You Just Learned */}
      <ScrollReveal>
        <WhatYouJustLearned
          points={[
            "Environment maps provide both ambient lighting (IBL) and reflections for PBR materials",
            "scene.environment controls lighting; scene.background controls the visible backdrop — they are independent",
            "HDR images are critical because they store brightness values beyond 1.0 for realistic specular highlights",
            "envMapIntensity lets you fine-tune reflection strength per material",
          ]}
        />
      </ScrollReveal>

      <Separator className="my-8" />

      {/* 8. Thought-Provoking Question */}
      <ScrollReveal>
        <ConversationalCallout type="question">
          <p>
            If you use a studio HDR for scene.environment (lighting) but a
            sunset HDR for scene.background (backdrop), the reflections on your
            objects will show the studio, not the sunset. When would this
            mismatch actually be desirable? Think about product visualization.
          </p>
        </ConversationalCallout>
      </ScrollReveal>

      <Separator className="my-8" />

      {/* 9. Aha Moment */}
      <ScrollReveal>
        <AhaMoment
          setup="Why do HDR environment maps make metallic surfaces look dramatically better than a regular JPG panorama?"
          reveal="Regular JPG images cap brightness at 1.0 (white). But in real life, the sun is thousands of times brighter than the sky around it. HDR images store these extreme brightness values, so when a metallic surface reflects the sun in the HDR, you get a blindingly bright specular highlight — just like real chrome in sunlight. With a JPG, the sun and the sky are both capped at the same 'white,' so reflections look flat and lifeless. The extra dynamic range is what makes HDR environments look real."
        />
      </ScrollReveal>

      <Separator className="my-8" />

      {/* 10. Mental Model Challenge */}
      <ScrollReveal>
        <MentalModelChallenge
          question="You have a scene with an Environment preset providing lighting. You add a separate directional light for shadows. The objects look overly bright. What is the best way to balance them?"
          options={[
            {
              label: "Remove the environment map entirely",
              correct: false,
              explanation:
                "That would fix the brightness but lose all the ambient lighting and reflections that make PBR materials look good.",
            },
            {
              label: "Reduce envMapIntensity on the materials",
              correct: true,
              explanation:
                "This lets you keep the environment for reflections while reducing how much ambient light it contributes, making room for your direct lights.",
            },
            {
              label: "Set the directional light intensity to 0.1",
              correct: false,
              explanation:
                "This weakens your shadow-casting light so much that shadows will be barely visible.",
            },
            {
              label: "Change the environment map to a darker preset",
              correct: false,
              explanation:
                "This works but gives you less control than adjusting envMapIntensity, and you may lose desirable reflection detail.",
            },
          ]}
          answer="Lower envMapIntensity on your materials (or use the environmentIntensity prop on the Environment component) to reduce the ambient light contribution while keeping reflections. This lets your directional light be the dominant light source for contrast and shadows, while the environment map fills in ambient reflections."
        />
      </ScrollReveal>

      <Separator className="my-8" />

      {/* Try This Challenges */}
      <ScrollReveal>
        <TryThisList challenges={[
          {
            challenge: "Set roughness to 1 — where did the reflections go?",
            hint: "Roughness controls how much the surface scatters reflected light.",
            solution: "At roughness 1, the surface is completely matte — like sandpaper. Light scatters in all directions, so you see soft ambient color instead of sharp reflections. The environment map still contributes to lighting, but no visible reflections remain.",
            difficulty: "beginner",
          },
          {
            challenge: "Set metalness to 0 — it's plastic now",
            hint: "Non-metals (metalness 0) show their own diffuse color instead of reflecting the environment.",
            solution: "The sphere now looks like plastic or rubber. It shows its own color from diffuse scattering instead of reflecting the environment. Non-metals still get subtle specular highlights from the env map, but the dominant color comes from the material itself.",
            difficulty: "beginner",
          },
          {
            challenge: "Try 'night' preset — dark reflections",
            hint: "The environment preset changes what the scene reflects and how it's lit.",
            solution: "With a dark/night preset, reflections become much dimmer and moodier. Metallic surfaces appear darker because they can only reflect what's around them — and in a night environment, there's less light to reflect. The overall scene feels dramatically different.",
            difficulty: "intermediate",
          },
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
                  Always use HDR over JPG for PBR
                </h3>
              </div>
              <p className="text-sm text-muted-foreground">
                HDR environment maps store brightness values above 1.0, which
                create the specular highlights that make metallic and glossy
                surfaces look real. JPG panoramas look flat in comparison.
              </p>
            </div>
            <div className="rounded-lg border bg-card p-4 space-y-2">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="size-4 text-green-500" />
                <h3 className="font-semibold text-sm">
                  Separate environment from background
                </h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Use a studio HDR for clean lighting and a different texture or
                solid color for the backdrop. This gives you artistic control
                over both independently.
              </p>
            </div>
            <div className="rounded-lg border bg-card p-4 space-y-2">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="size-4 text-green-500" />
                <h3 className="font-semibold text-sm">
                  Dispose source textures after PMREM
                </h3>
              </div>
              <p className="text-sm text-muted-foreground">
                If you manually load HDR files, always dispose the original
                texture and PMREM generator after processing. The processed
                output is all you need — keeping the source wastes GPU memory.
              </p>
            </div>
            <div className="rounded-lg border bg-card p-4 space-y-2">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="size-4 text-green-500" />
                <h3 className="font-semibold text-sm">
                  Use envMapIntensity for fine control
                </h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Adjust envMapIntensity per material to balance environment
                reflections against direct lights. Reduce it on matte surfaces
                to prevent them from looking overly reflective.
              </p>
            </div>
          </div>
        </section>
      </ScrollReveal>
    </div>
  );
}
