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

const EffectsDemo = dynamic(
  () =>
    import("./_components/effects-demo").then((m) => ({
      default: m.EffectsDemo,
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
    title: "Bloom has no visible effect on objects",
    subtitle: "Objects need emissive materials with values above the threshold",
    wrongCode: `// This mesh won't glow — color is clamped to [0,1]
<mesh>
  <sphereGeometry />
  <meshStandardMaterial color="white" />
</mesh>`,
    rightCode: `// Emissive materials push brightness past the threshold
<mesh>
  <sphereGeometry />
  <meshStandardMaterial
    color="cyan"
    emissive="cyan"
    emissiveIntensity={2}
    toneMapped={false}
  />
</mesh>`,
    filename: "BloomGlow.tsx",
    explanation:
      "Bloom extracts pixels brighter than the luminanceThreshold and blurs them. Standard colors are clamped to [0, 1], which may not exceed that threshold. Use emissive materials with emissiveIntensity > 1 and toneMapped={false} to push brightness high enough for Bloom to detect.",
  },
  {
    title: "Depth of Field blurs the entire scene",
    subtitle: "Focus distance is misconfigured",
    wrongCode: `// Everything is blurred — focus is wrong
<DepthOfField
  focusDistance={0}  // Normalized 0-1, not world units!
  focalLength={0.02}
  bokehScale={6}
/>`,
    rightCode: `// Use the target prop for world-space focus
<DepthOfField
  target={[0, 0, 5]}  // Focus on this point
  focalLength={0.5}
  bokehScale={6}
/>`,
    filename: "DepthOfFieldFocus.tsx",
    explanation:
      "focusDistance uses a normalized 0-1 range, not world units. This is unintuitive to set correctly. Use the target prop instead, which accepts world-space coordinates. Pass the position of the object you want in focus and the math is handled for you.",
  },
  {
    title: "SSAO creates visible banding or noise",
    subtitle: "AO settings don't match the scene scale",
    wrongCode: `// Too aggressive — visible artifacts
<N8AO
  aoRadius={5}
  intensity={10}
/>`,
    rightCode: `// Subtle settings, paired with anti-aliasing
<N8AO
  aoRadius={0.5}
  intensity={2}
  quality="medium"
/>
<SMAA />`,
    filename: "SSAOQuality.tsx",
    explanation:
      "SSAO artifacts usually come from aoRadius being too large for your scene or intensity being cranked too high. Keep radius as a fraction of your scene scale, start with low intensity, and always pair N8AO with SMAA anti-aliasing to smooth the contact edges.",
  },
];

export default function BuiltInEffectsPage() {
  return (
    <div className="relative max-w-4xl">
      <div className="absolute -top-10 -left-10 w-72 h-72 bg-gradient-to-br from-teal-500/10 via-emerald-500/10 to-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-3">
          <Badge variant="outline">Post-Processing</Badge>
        </div>
        <h1 className="text-3xl font-bold tracking-tight mb-3">
          Built-in Effects
        </h1>
        <p className="text-lg text-muted-foreground">
          Your 3D scene looks good, but it feels flat. No glow around bright
          lights, no blurry background behind the hero object, no cinematic
          mood. The built-in effects library gives you camera-lens-quality
          polish with just a few props.
        </p>
      </div>

      {/* What Could Go Wrong */}
      <WhatCouldGoWrong
        scenario="You add a Bloom effect to your scene. The glow slider goes up, but nothing glows. Every object looks exactly the same. You try intensity={10} and still nothing. What is going on?"
        error="Bloom has no visible effect. Objects use meshStandardMaterial with toneMapped={true} (default) — brightness is clamped to 1.0 before Bloom can detect it."
        errorType="Visual Bug"
        accentColor="red"
      />

      <Separator className="my-8" />

      {/* Story Analogy */}
      <ConversationalCallout type="story">
        <p>
          Each built-in effect mimics something that happens with a real camera
          lens.
        </p>
        <p>
          <strong>Bloom</strong> is the glow you see when a bright streetlight
          bleeds into the surrounding darkness -- lens flare in a movie.
        </p>
        <p>
          <strong>Depth of Field</strong> is the blurry background behind a
          portrait -- photographers call it bokeh.
        </p>
        <p>
          <strong>Vignette</strong> is the natural darkening at the edges of
          old photographs, drawing your eye to the center.
        </p>
        <p>
          <strong>Chromatic Aberration</strong> is the subtle rainbow fringing
          you see in cheap lenses when colors don&apos;t converge at the same point.
        </p>
        <p>
          These effects trick the brain into thinking your WebGL scene was
          captured through a real lens. Subtlety is everything -- dial them
          down, not up.
        </p>
      </ConversationalCallout>

      <Separator className="my-8" />

      {/* Mental Model Flow */}
      <SimpleFlow
        steps={[
          { label: "Bright Pixel", detail: "Emissive > threshold" },
          { label: "Extract", detail: "Bloom finds it" },
          { label: "Blur", detail: "Soft glow spreads" },
          { label: "Composite", detail: "Layered back", status: "success" },
        ]}
        accentColor="purple"
      />

      <Separator className="my-8" />

      {/* Interactive Demo */}
      <EffectsDemo />

      <Separator className="my-8" />

      {/* Guided Walkthrough */}
      <ScrollReveal>
        <section className="space-y-4">
          <h2 className="text-2xl font-bold">
            The Effects Toolkit
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            Each effect is a React component you drop inside EffectComposer.
            Let&apos;s walk through the ones you will reach for most often.
          </p>

          <div className="rounded-lg border bg-card p-4 space-y-3">
            <p className="text-sm font-medium">
              Bloom -- make things glow
            </p>
            <CodeBlock
              code={`<Bloom intensity={1.5} luminanceThreshold={0.6} mipmapBlur />

{/* The material that actually glows */}
<meshStandardMaterial
  emissive="cyan"
  emissiveIntensity={2}
  toneMapped={false}
/>`}
              filename="BloomEffect.tsx"
            />
            <p className="text-sm text-muted-foreground">
              Bloom finds pixels brighter than the luminanceThreshold and
              blurs them outward. The trick: your material must push
              brightness past that threshold. Use emissiveIntensity above 1
              and toneMapped=false so the values are not clamped.
            </p>
          </div>

          <div className="rounded-lg border bg-card p-4 space-y-3">
            <p className="text-sm font-medium">
              Depth of Field -- blurry backgrounds
            </p>
            <CodeBlock
              code={`<DepthOfField
  target={[0, 0, 5]}
  focalLength={0.5}
  bokehScale={8}
/>`}
              filename="DepthOfField.tsx"
            />
            <p className="text-sm text-muted-foreground">
              Point the target at the object you want in focus. Everything
              closer or farther gets progressively blurry, just like a
              portrait photo. Increase bokehScale for a stronger blur.
            </p>
          </div>

          <div className="rounded-lg border bg-card p-4 space-y-3">
            <p className="text-sm font-medium">
              Vignette + Noise + Chromatic Aberration -- cinematic mood
            </p>
            <CodeBlock
              code={`<Vignette offset={0.3} darkness={0.9} />
<Noise opacity={0.15} />
<ChromaticAberration offset={[0.002, 0.002]} />`}
              filename="CinematicEffects.tsx"
            />
            <p className="text-sm text-muted-foreground">
              These lightweight effects merge into a single shader pass.
              Keep Chromatic Aberration offset tiny (0.001 to 0.005) and
              Noise opacity below 0.2 for a film-like look. Going higher
              looks amateurish.
            </p>
          </div>

          <div className="rounded-lg border bg-card p-4 space-y-3">
            <p className="text-sm font-medium">
              N8AO -- ambient occlusion (darkened crevices)
            </p>
            <CodeBlock
              code={`<N8AO aoRadius={0.5} intensity={2} quality="medium" />
<SMAA />`}
              filename="SSAOEffect.tsx"
            />
            <p className="text-sm text-muted-foreground">
              N8AO darkens corners and crevices where light would naturally
              be blocked. Always pair it with SMAA anti-aliasing to clean up
              the noise that AO produces at contact edges.
            </p>
          </div>
        </section>
      </ScrollReveal>

      <Separator className="my-8" />

      {/* What You Just Learned */}
      <WhatYouJustLearned
        points={[
          "Bloom needs emissive materials with emissiveIntensity > 1 and toneMapped={false} to actually glow.",
          "Depth of Field is easiest to configure with the target prop using world-space coordinates.",
          "Lightweight effects (Vignette, Noise, Chromatic Aberration) merge into one pass and are nearly free.",
          "N8AO for ambient occlusion should always be paired with SMAA anti-aliasing for clean results.",
          "Subtlety is key: small values look professional, big values look amateur.",
        ]}
      />

      <Separator className="my-8" />

      {/* Question */}
      <ConversationalCallout type="question">
        <p>
          You set Bloom intensity to 5 and everything looks washed out. You
          set it to 0.5 and nothing seems to glow. What is the real knob you
          should be turning to control how much glow an individual object gets?
        </p>
      </ConversationalCallout>

      <Separator className="my-8" />

      {/* Aha Moment */}
      <AhaMoment
        setup="Beginners crank up Bloom intensity when their objects don't glow. But that is like turning up the volume when the microphone is off..."
        reveal="The real control is emissiveIntensity on the material, not Bloom intensity. Bloom intensity amplifies whatever glow it finds. If nothing exceeds the luminanceThreshold, there is nothing to amplify. The fix is always on the material side: set emissive to a color, emissiveIntensity above 1, and toneMapped={false}. Then even a gentle Bloom intensity of 1 produces beautiful results."
      />

      <Separator className="my-8" />

      {/* Mental Model Challenge */}
      <MentalModelChallenge
        question="You want a neon sign to glow brightly in your scene. Which combination of props makes it work?"
        options={[
          {
            label: "Bloom intensity={10} on a meshStandardMaterial with color='cyan'",
            correct: false,
            explanation:
              "Color is clamped to [0,1] by tone mapping. Bloom has nothing bright enough to extract, no matter how high the intensity.",
          },
          {
            label: "Bloom intensity={1.5} on a meshStandardMaterial with emissive='cyan', emissiveIntensity={3}, toneMapped={false}",
            correct: true,
            explanation:
              "The emissive color pushes brightness past the threshold, and toneMapped={false} prevents clamping. Bloom finds and amplifies the bright pixels.",
          },
          {
            label: "Bloom luminanceThreshold={0} on any material",
            correct: false,
            explanation:
              "Setting threshold to 0 means everything glows, not just the neon sign. You lose all contrast.",
          },
          {
            label: "Just set the material color to a very bright white",
            correct: false,
            explanation:
              "Standard color values are clamped to [0,1] by tone mapping. 'Very bright white' is still just 1.0.",
          },
        ]}
        hint="Think about what Bloom is actually looking for -- which pixels exceed the luminance threshold?"
        answer="Bloom works by finding pixels brighter than the luminanceThreshold. Standard color values are clamped to 1.0 by tone mapping, so they never exceed the threshold. The secret is emissive materials: set emissive to a color, emissiveIntensity above 1, and toneMapped={false} to let the brightness pass through unclamped."
      />

      <Separator className="my-8" />

      {/* Try This */}
      <Separator className="my-8" />
      <ScrollReveal>
        <TryThisList challenges={[
          { challenge: "Max emissiveIntensity — blinding!", hint: "Push the emissive intensity to its maximum value.", solution: "Extremely high emissive values create a massive bloom glow that overwhelms the scene — this is why subtlety matters.", difficulty: "beginner" },
          { challenge: "Set floorReflectivity to 0 — matte floor", hint: "Drag the floor reflectivity slider to zero.", solution: "The floor loses its mirror-like quality and becomes a flat matte surface.", difficulty: "beginner" },
          { challenge: "Set pulseSpeed to 0 — frozen orbs", hint: "Set the pulse speed to zero to stop the animation.", solution: "The orbs stop pulsing, creating a static scene where you can study the effect layering.", difficulty: "beginner" },
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
                <h3 className="font-semibold text-sm">
                  toneMapped=false for Glow
                </h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Any material that should glow with Bloom must have
                toneMapped=false and emissiveIntensity greater than 1.
                Without this, tone mapping clamps brightness before Bloom
                can detect it.
              </p>
            </div>
            <div className="rounded-lg border bg-card p-4 space-y-2">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="size-4 text-green-500" />
                <h3 className="font-semibold text-sm">
                  Use target for Depth of Field
                </h3>
              </div>
              <p className="text-sm text-muted-foreground">
                The target prop accepts world-space coordinates and is much
                easier to use than focusDistance (which requires a normalized
                0-1 value). Point it at the object you want sharp.
              </p>
            </div>
            <div className="rounded-lg border bg-card p-4 space-y-2">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="size-4 text-green-500" />
                <h3 className="font-semibold text-sm">Keep Effects Subtle</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Chromatic Aberration offset of 0.002, Vignette darkness of 0.7,
                and Noise opacity of 0.15 are good starting points. Professional
                effects are barely noticeable -- if someone spots the effect
                immediately, it is probably too strong.
              </p>
            </div>
            <div className="rounded-lg border bg-card p-4 space-y-2">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="size-4 text-green-500" />
                <h3 className="font-semibold text-sm">
                  Pair AO with Anti-Aliasing
                </h3>
              </div>
              <p className="text-sm text-muted-foreground">
                N8AO produces noise at contact edges. Always add SMAA
                anti-aliasing alongside it to smooth out the artifacts and
                get clean contact shadows.
              </p>
            </div>
          </div>
        </section>
      </ScrollReveal>
    </div>
  );
}
