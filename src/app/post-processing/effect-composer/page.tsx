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

const ComposerDemo = dynamic(
  () =>
    import("./_components/composer-demo").then((m) => ({
      default: m.ComposerDemo,
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
    title: "Using Canvas antialias with post-processing",
    subtitle: "Built-in MSAA has no effect when effects are active",
    wrongCode: `// Canvas AA doesn't reach the post-processing buffer
<Canvas gl={{ antialias: true }}>
  <EffectComposer>
    <Bloom intensity={1} />
  </EffectComposer>
</Canvas>`,
    rightCode: `// Use the composer's own multisampling instead
<Canvas gl={{ antialias: false }}>
  <EffectComposer multisampling={8}>
    <Bloom intensity={1} />
  </EffectComposer>
</Canvas>`,
    filename: "AntiAliasing.tsx",
    explanation:
      "Post-processing renders your scene to an offscreen buffer, not the screen. The Canvas antialias setting only applies to the default framebuffer, so it does nothing. Use the EffectComposer's multisampling prop or add an SMAA effect instead.",
  },
  {
    title: "Adding every effect at once",
    subtitle: "GPU costs stack up fast, especially on mobile",
    wrongCode: `// The kitchen sink — every effect turned on
<EffectComposer>
  <SSAO />
  <Bloom />
  <DepthOfField />
  <ChromaticAberration />
  <GodRays />
  <Noise />
  <Vignette />
</EffectComposer>`,
    rightCode: `// Start small, measure each addition
<EffectComposer multisampling={0}>
  <SMAA />
  <Bloom intensity={1} luminanceThreshold={0.8} mipmapBlur />
  <Vignette offset={0.3} darkness={0.7} />
</EffectComposer>`,
    filename: "MeasuredEffects.tsx",
    explanation:
      "Each effect processes every pixel on screen. Heavy effects like SSAO and DoF each need their own render pass. On a phone, even two heavy effects can cut your frame rate in half. Start with Bloom + Vignette, measure with r3f-perf, then add more if you have room.",
  },
  {
    title: "Toggling effects with conditional rendering",
    subtitle: "Mounting and unmounting recompiles the merged shader",
    wrongCode: `// Adding/removing the effect recompiles shaders
<EffectComposer>
  {bloom && <Bloom intensity={1.5} />}
  <Vignette />
</EffectComposer>`,
    rightCode: `// Keep it mounted, dial intensity to zero
<EffectComposer>
  <Bloom intensity={bloom ? 1.5 : 0} />
  <Vignette />
</EffectComposer>`,
    filename: "ToggleEffects.tsx",
    explanation:
      "When you conditionally render an effect, EffectComposer must rebuild and recompile the merged shader. This causes a visible frame hitch. Keep the effect mounted and set its intensity to 0 instead -- that disables it without triggering recompilation.",
  },
];

export default function EffectComposerPage() {
  return (
    <div className="max-w-4xl ambient-shaders">
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-3">
          <Badge variant="outline">Post-Processing</Badge>
        </div>
        <h1 className="text-3xl font-bold tracking-tight mb-3">
          Effect Composer
        </h1>
        <p className="text-lg text-muted-foreground">
          You have rendered a beautiful 3D scene. Now you want to make it
          look cinematic -- glowing lights, soft vignettes, maybe a dreamy
          color grade. EffectComposer is the filter pipeline that makes it
          happen.
        </p>
      </div>

      {/* What Could Go Wrong */}
      <WhatCouldGoWrong
        scenario="You add Bloom, Vignette, SSAO, Depth of Field, and Chromatic Aberration to your scene all at once. It looks amazing on your laptop. You send the link to your friend on a phone, and they report 8 frames per second and a very hot device."
        error="WebGL: CONTEXT_LOST_WEBGL: loseContext — GPU ran out of resources on mobile device."
        errorType="Performance"
        accentColor="red"
      />

      <Separator className="my-8" />

      {/* Story Analogy */}
      <ConversationalCallout type="story">
        <p>Think of EffectComposer like the Instagram filter pipeline.</p>
        <p>
          You snap a photo (your rendered 3D scene). Then you stack filters on
          top: a <strong>glow filter</strong> (Bloom), a{" "}
          <strong>dark-edges filter</strong> (Vignette), a{" "}
          <strong>color grading filter</strong>. Each filter processes the
          photo and passes the result to the next one.
        </p>
        <p>
          The clever part? Instagram merges multiple simple filters into a
          single processing step so your phone does not melt. EffectComposer
          does the exact same thing -- it merges compatible effects into one
          shader pass. That is why it is much faster than applying each effect
          separately.
        </p>
      </ConversationalCallout>

      <Separator className="my-8" />

      {/* Mental Model Flow */}
      <SimpleFlow
        steps={[
          { label: "Render Scene", detail: "Take the photo" },
          { label: "EffectComposer", detail: "The filter pipeline" },
          { label: "Merge Effects", detail: "Combine compatible filters" },
          { label: "Final Image", detail: "What you see!", status: "success" },
        ]}
        accentColor="purple"
      />

      <Separator className="my-8" />

      {/* Interactive Demo */}
      <ComposerDemo />

      <Separator className="my-8" />

      {/* Guided Walkthrough */}
      <ScrollReveal>
        <section className="space-y-4">
          <h2 className="text-2xl font-bold">
            Step by Step: Your First Filter Pipeline
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            Setting up EffectComposer is like opening Instagram and choosing
            your filters. Three quick steps and your scene goes from plain to
            cinematic.
          </p>

          <div className="rounded-lg border bg-card p-4 space-y-3">
            <p className="text-sm font-medium">
              Step 1: Install the filter pipeline
            </p>
            <CodeBlock
              code={`import { EffectComposer, Bloom, Vignette }
  from '@react-three/postprocessing'`}
              filename="Scene.tsx"
            />
            <p className="text-sm text-muted-foreground">
              The @react-three/postprocessing library wraps the
              postprocessing library in React components. Import
              EffectComposer (the pipeline) and the effects you want.
            </p>
          </div>

          <div className="rounded-lg border bg-card p-4 space-y-3">
            <p className="text-sm font-medium">
              Step 2: Add it to your Canvas
            </p>
            <CodeBlock
              code={`<Canvas>
  <Scene />
  <EffectComposer>
    <Bloom intensity={1.5} mipmapBlur />
    <Vignette offset={0.3} darkness={0.9} />
  </EffectComposer>
</Canvas>`}
              filename="App.tsx"
            />
            <p className="text-sm text-muted-foreground">
              Drop EffectComposer inside Canvas and nest effects as
              children. That is it. The pipeline processes effects in child
              order, merging compatible ones automatically.
            </p>
          </div>

          <div className="rounded-lg border bg-card p-4 space-y-3">
            <p className="text-sm font-medium">
              Step 3: Disable Canvas anti-aliasing
            </p>
            <CodeBlock
              code={`<Canvas gl={{ antialias: false }}>
  <Scene />
  <EffectComposer multisampling={8}>
    <Bloom intensity={1.5} mipmapBlur />
  </EffectComposer>
</Canvas>`}
              filename="App.tsx"
            />
            <p className="text-sm text-muted-foreground">
              The Canvas antialias prop does not work with post-processing.
              Instead, use the composer&apos;s multisampling prop or add an
              SMAA effect for anti-aliasing.
            </p>
          </div>
        </section>
      </ScrollReveal>

      <Separator className="my-8" />

      {/* Selective Bloom */}
      <ScrollReveal>
        <section className="space-y-4">
          <h2 className="text-2xl font-bold">Selective Bloom</h2>
          <p className="text-muted-foreground leading-relaxed">
            Want only certain objects to glow? Wrap your scene in Selection
            and tag glowing objects with Select.
          </p>
          <CodeBlock
            code={`<Selection>
  <EffectComposer>
    <Bloom intensity={2} mipmapBlur />
  </EffectComposer>
  <Select enabled>
    <mesh> {/* This glows */} </mesh>
  </Select>
  <mesh> {/* This does NOT glow */} </mesh>
</Selection>`}
            filename="SelectiveBloom.tsx"
          />
        </section>
      </ScrollReveal>

      <Separator className="my-8" />

      {/* What You Just Learned */}
      <WhatYouJustLearned
        points={[
          "EffectComposer is the filter pipeline that processes your rendered scene with screen-space effects.",
          "Compatible effects get merged into a single shader pass automatically, saving GPU work.",
          "Always disable Canvas antialias and use the composer's multisampling or SMAA instead.",
          "Control effects via intensity (0 = off) rather than conditional rendering to avoid shader recompilation.",
          "Selective bloom lets you make only certain objects glow using Selection and Select wrappers.",
        ]}
      />

      <Separator className="my-8" />

      {/* Question */}
      <ConversationalCallout type="question">
        <p>
          If EffectComposer merges compatible effects into one pass, why not
          add all effects and let it figure things out? What stops the merging
          from keeping everything fast?
        </p>
      </ConversationalCallout>

      <Separator className="my-8" />

      {/* Aha Moment */}
      <AhaMoment
        setup="You might think that adding more effects is always slow because each one adds a render pass. But the library is smarter than that..."
        reveal="Lightweight effects like Vignette, Noise, and Chromatic Aberration are merged into a single shader pass together. The real performance killers are heavyweight effects like SSAO, Depth of Field, and God Rays -- each needs its own pass because they require separate depth or scene data. So Bloom + Vignette + Noise might cost only 2 passes total, not 3. Start with lightweight effects and you get a lot of bang for very little GPU buck."
      />

      <Separator className="my-8" />

      {/* Mental Model Challenge */}
      <MentalModelChallenge
        question="You have a scene running at 60fps. You add Bloom, Vignette, and Noise inside EffectComposer. How many extra render passes will this cost?"
        options={[
          {
            label: "3 passes (one per effect)",
            correct: false,
            explanation:
              "If each effect were a separate pass, yes. But EffectComposer merges compatible effects.",
          },
          {
            label: "2 passes (Bloom gets its own, the other two merge)",
            correct: true,
            explanation:
              "Bloom needs its own pass for the luminance extraction and blur. Vignette and Noise are lightweight and merge into one pass.",
          },
          {
            label: "1 pass (all three merge together)",
            correct: false,
            explanation:
              "Bloom requires its own luminance and blur pass -- it cannot merge with simple color adjustments.",
          },
          {
            label: "0 passes (the composer handles everything for free)",
            correct: false,
            explanation:
              "Post-processing always costs at least one extra pass. There is no free lunch on the GPU.",
          },
        ]}
        hint="Think about which effects need to analyze the whole image (like blurring bright areas) vs. which just tweak each pixel independently."
        answer="Bloom needs its own pass because it must extract bright pixels and blur them across the screen. Vignette and Noise only modify individual pixels, so they get merged into a single pass. Total: 2 extra passes. This is why the merging system is so powerful -- you get three effects for the cost of two."
      />

      <Separator className="my-8" />

      {/* Try This */}
      <Separator className="my-8" />
      <ScrollReveal>
        <TryThisList challenges={[
          { challenge: "Set emissiveIntensity to 5 — nuclear glow", hint: "Crank the emissive intensity slider up to 5.", solution: "The glowing objects become blindingly bright, creating an intense bloom halo that bleeds across the screen.", difficulty: "beginner" },
          { challenge: "Set rotationSpeed to 0 — photo mode", hint: "Stop the rotation by setting speed to zero.", solution: "The scene freezes, letting you study the post-processing effects on a still frame.", difficulty: "beginner" },
          { challenge: "Change torus color — new mood", hint: "Use the color picker to change the torus color.", solution: "Different emissive colors produce different bloom hues, completely changing the mood of the scene.", difficulty: "beginner" },
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
                <h3 className="font-semibold text-sm">Disable Canvas AA</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Always set gl=&#123;&#123; antialias: false &#125;&#125; on Canvas when using
                post-processing. Use the composer&apos;s multisampling prop or add
                an SMAA effect for anti-aliasing instead.
              </p>
            </div>
            <div className="rounded-lg border bg-card p-4 space-y-2">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="size-4 text-green-500" />
                <h3 className="font-semibold text-sm">Start with Two Effects</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Bloom + Vignette is a great starting combo. Add effects one at
                a time, measuring GPU impact with r3f-perf after each addition.
                Mobile GPUs have much less headroom than desktop.
              </p>
            </div>
            <div className="rounded-lg border bg-card p-4 space-y-2">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="size-4 text-green-500" />
                <h3 className="font-semibold text-sm">
                  Use mipmapBlur for Bloom
                </h3>
              </div>
              <p className="text-sm text-muted-foreground">
                The mipmapBlur prop on Bloom produces physically accurate,
                high-quality glow with minimal performance cost. Always prefer
                it over the default blur method.
              </p>
            </div>
            <div className="rounded-lg border bg-card p-4 space-y-2">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="size-4 text-green-500" />
                <h3 className="font-semibold text-sm">
                  Toggle via Intensity, Not Mounting
                </h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Never use conditional rendering to toggle effects. Set intensity
                to 0 to disable an effect without triggering costly shader
                recompilation. The effect stays in memory but costs nothing.
              </p>
            </div>
          </div>
        </section>
      </ScrollReveal>
    </div>
  );
}
