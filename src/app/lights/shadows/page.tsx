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
import { BeforeAfterCode } from "@/components/before-after";
import { CheckCircle2 } from "lucide-react";

const ShadowDemoComponent = dynamic(
  () =>
    import("./_components/shadow-demo").then((m) => ({
      default: m.ShadowDemo,
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
    title: "Shadows not appearing at all",
    subtitle: "Missing one of the three required enable steps",
    wrongCode: `// Only enabled on the renderer
<Canvas shadows>
  <directionalLight position={[5, 10, 5]} />
  {/* Missing: castShadow on the light */}

  <mesh>
    <boxGeometry />
    <meshStandardMaterial />
  </mesh>
  {/* Missing: castShadow and receiveShadow on meshes */}
</Canvas>`,
    rightCode: `<Canvas shadows>
  {/* Step 1: Canvas shadows (done) */}
  {/* Step 2: Light castShadow */}
  <directionalLight position={[5, 10, 5]} castShadow />

  {/* Step 3: Mesh castShadow + receiveShadow */}
  <mesh castShadow receiveShadow>
    <boxGeometry />
    <meshStandardMaterial />
  </mesh>

  <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]}>
    <planeGeometry args={[20, 20]} />
    <meshStandardMaterial />
  </mesh>
</Canvas>`,
    filename: "enable-shadows.tsx",
    explanation:
      "Shadows need three things enabled: the Canvas, the light (castShadow), and each mesh (castShadow and/or receiveShadow). Missing any one of these means no shadows. This is the single most common shadow mistake.",
  },
  {
    title: "Shadows look extremely pixelated and blocky",
    subtitle: "Shadow camera frustum is too large for the shadow map",
    wrongCode: `<directionalLight castShadow
  shadow-camera-left={-50}
  shadow-camera-right={50}
  shadow-camera-top={50}
  shadow-camera-bottom={-50}
  shadow-mapSize-width={2048}
  shadow-mapSize-height={2048}
/>
// 2048 pixels spread over 100 units = terrible quality`,
    rightCode: `<directionalLight castShadow
  shadow-camera-left={-5}
  shadow-camera-right={5}
  shadow-camera-top={5}
  shadow-camera-bottom={-5}
  shadow-mapSize-width={2048}
  shadow-mapSize-height={2048}
/>
// Same 2048 pixels over 10 units = 10x sharper!`,
    filename: "shadow-frustum.tsx",
    explanation:
      "The shadow map resolution is spread across the shadow camera frustum. A 100x100 area gets about 20 pixels per unit. A 10x10 area gets 200 pixels per unit — 10 times sharper. Always tighten the frustum to just cover the visible shadow area.",
  },
  {
    title: "Dark stripes on surfaces (shadow acne)",
    subtitle: "Missing shadow bias configuration",
    wrongCode: `<directionalLight castShadow
  shadow-mapSize-width={2048}
  shadow-mapSize-height={2048}
/>
// No bias — surfaces incorrectly shadow themselves
// creating dark striped patterns`,
    rightCode: `<directionalLight castShadow
  shadow-mapSize-width={2048}
  shadow-mapSize-height={2048}
  shadow-bias={-0.0005}
  shadow-normalBias={0.02}
/>
// Small bias fixes self-shadowing artifacts`,
    filename: "shadow-bias.tsx",
    explanation:
      "Shadow acne happens when a surface incorrectly shadows itself due to limited shadow map precision. shadow.bias offsets the depth comparison to prevent this. Start with small values like -0.0005 and adjust. Too much bias causes 'peter panning' where shadows float away from objects.",
  },
];

export default function ShadowsPage() {
  return (
    <div className="max-w-4xl ambient-lights">
      {/* 1. Title + Badge + Intro */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-3">
          <Badge variant="outline">Lights</Badge>
        </div>
        <h1 className="text-3xl font-bold tracking-tight mb-3">Shadows</h1>
        <p className="text-lg text-muted-foreground">
          Shadows are what make your 3D objects feel like they actually exist in
          a space. Without them, things look like they are floating. Getting
          shadows working takes three specific steps — miss any one and you get
          nothing.
        </p>
      </div>

      {/* 2. What Could Go Wrong */}
      <WhatCouldGoWrong
        scenario="You set up a scene with a directional light and a box on a ground plane. You expect to see a shadow beneath the box, but there is nothing — no shadow at all. You increase the light intensity, change materials, reposition the camera — still nothing. The problem? Shadows are disabled by default and you need to enable them in three separate places."
        error="No shadows visible despite having lights and meshes in the scene."
        errorType="Missing Shadows"
      />

      <Separator className="my-8" />

      {/* 3. Story Analogy */}
      <ScrollReveal>
        <ConversationalCallout type="story">
          <p>
            Think of shadows like a puppet shadow play. You need exactly three
            things for the show to work.
          </p>
          <p>
            <strong>A lamp</strong> (the light source) — without a lamp, there
            is no light to cast shadows. In Three.js, the light needs
            castShadow turned on.
          </p>
          <p>
            <strong>A puppet</strong> (the shadow caster) — this is the object
            that blocks the light. Your mesh needs castShadow turned on.
          </p>
          <p>
            <strong>A wall</strong> (the shadow receiver) — this is the surface
            where the shadow appears. Your ground plane needs receiveShadow
            turned on.
          </p>
          <p>
            Take away any one of these three, and the shadow show does not
            happen. That is exactly how Three.js shadows work — you must enable
            all three or you get nothing.
          </p>
        </ConversationalCallout>
      </ScrollReveal>

      <Separator className="my-8" />

      {/* 4. SimpleFlow — the three steps */}
      <ScrollReveal>
        <section className="space-y-4">
          <h2 className="text-2xl font-bold">The Three Things You Need</h2>
          <p className="text-muted-foreground leading-relaxed">
            Shadows are off by default for performance. You must enable them at
            three levels. Miss any one and you get zero shadows.
          </p>
          <SimpleFlow
            steps={[
              {
                label: "1. Canvas",
                detail: "<Canvas shadows>",
                status: "success",
              },
              {
                label: "2. Light",
                detail: "castShadow on the light",
                status: "success",
              },
              {
                label: "3. Meshes",
                detail: "castShadow + receiveShadow",
                status: "success",
              },
              {
                label: "Shadows appear!",
                detail: "All three enabled",
                status: "success",
              },
            ]}
          />
        </section>
      </ScrollReveal>

      <Separator className="my-8" />

      {/* 5. Interactive Demo */}
      <ShadowDemoComponent />

      <Separator className="my-8" />

      {/* 6. Guided Walkthrough */}
      <ScrollReveal>
        <section className="space-y-6">
          <h2 className="text-2xl font-bold">Guided Walkthrough</h2>
          <p className="text-muted-foreground leading-relaxed">
            Let us get shadows working from scratch in three steps.
          </p>

          {/* Step 1 */}
          <div className="bg-card border rounded-lg p-4 space-y-3">
            <h3 className="font-semibold text-sm">
              Step 1 — Enable shadows on the Canvas and light
            </h3>
            <CodeBlock
              code={`<Canvas shadows>
  <directionalLight
    position={[5, 10, 5]}
    castShadow
  />
</Canvas>`}
              filename="step-1-enable.tsx"
            />
            <p className="text-sm text-muted-foreground">
              The shadows prop on Canvas tells the renderer to enable shadow
              mapping. The castShadow prop on the light tells it to actually
              generate a shadow map. Without both, nothing happens.
            </p>
          </div>

          {/* Step 2 */}
          <div className="bg-card border rounded-lg p-4 space-y-3">
            <h3 className="font-semibold text-sm">
              Step 2 — Mark which meshes cast and receive shadows
            </h3>
            <CodeBlock
              code={`{/* Box casts and receives shadows */}
<mesh castShadow receiveShadow>
  <boxGeometry />
  <meshStandardMaterial />
</mesh>

{/* Ground only receives shadows */}
<mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]}>
  <planeGeometry args={[20, 20]} />
  <meshStandardMaterial />
</mesh>`}
              filename="step-2-meshes.tsx"
            />
            <p className="text-sm text-muted-foreground">
              The box gets both castShadow (it blocks light) and receiveShadow
              (other shadows can fall on it). The ground only needs
              receiveShadow because it is the surface where shadows appear.
            </p>
          </div>

          {/* Step 3 */}
          <div className="bg-card border rounded-lg p-4 space-y-3">
            <h3 className="font-semibold text-sm">
              Step 3 — Tune shadow quality with camera and map size
            </h3>
            <CodeBlock
              code={`<directionalLight castShadow
  shadow-mapSize-width={2048}
  shadow-mapSize-height={2048}
  shadow-camera-left={-5}
  shadow-camera-right={5}
  shadow-camera-top={5}
  shadow-camera-bottom={-5}
  shadow-bias={-0.0005}
/>`}
              filename="step-3-quality.tsx"
            />
            <p className="text-sm text-muted-foreground">
              The shadow camera bounds control how much area the shadow map
              covers. Tighter bounds mean sharper shadows. The bias prevents
              dark stripe artifacts. Start small and increase until stripes
              disappear.
            </p>
          </div>
          <BeforeAfterCode
            beforeCode={`<Canvas>\n  <directionalLight position={[5, 10, 5]} />\n  <mesh>\n    <boxGeometry />\n    <meshStandardMaterial />\n  </mesh>\n  <mesh rotation={[-Math.PI / 2, 0, 0]}>\n    <planeGeometry args={[20, 20]} />\n    <meshStandardMaterial />\n  </mesh>\n</Canvas>`}
            afterCode={`<Canvas shadows>\n  <directionalLight\n    position={[5, 10, 5]}\n    castShadow\n    shadow-mapSize-width={2048}\n    shadow-mapSize-height={2048}\n  />\n  <mesh castShadow receiveShadow>\n    <boxGeometry />\n    <meshStandardMaterial />\n  </mesh>\n  <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]}>\n    <planeGeometry args={[20, 20]} />\n    <meshStandardMaterial />\n  </mesh>\n</Canvas>`}
            beforeLabel="Without Shadows"
            afterLabel="With Shadows"
            filename="ShadowSetup.tsx"
            description={{
              before: "Without shadows, the box looks like it's floating — there's no visual connection to the ground.",
              after: "With shadows enabled, the box feels grounded and solid. The shadow provides spatial context.",
            }}
          />
        </section>
      </ScrollReveal>

      <Separator className="my-8" />

      {/* 7. What You Just Learned */}
      <ScrollReveal>
        <WhatYouJustLearned
          points={[
            "Shadows need three things enabled: Canvas, light (castShadow), and meshes (castShadow/receiveShadow)",
            "The shadow camera frustum controls quality — tighter bounds mean sharper shadows",
            "shadow.bias prevents shadow acne (dark stripe artifacts from self-shadowing)",
            "Only enable castShadow on objects that meaningfully contribute to the shadow — skip tiny decorations",
          ]}
        />
      </ScrollReveal>

      <Separator className="my-8" />

      {/* 8. Thought-Provoking Question */}
      <ScrollReveal>
        <ConversationalCallout type="question">
          <p>
            If increasing the shadow map size from 1024 to 4096 gives you four
            times sharper shadows, why not always use the biggest map possible?
            Think about what that means for GPU memory and rendering time,
            especially on mobile devices.
          </p>
        </ConversationalCallout>
      </ScrollReveal>

      <Separator className="my-8" />

      {/* 9. Aha Moment */}
      <ScrollReveal>
        <AhaMoment
          setup="You set shadow.bias to fix dark stripes on your surfaces, but now the shadows have separated from the objects and look like they are floating. What is happening?"
          reveal="This is called 'peter panning.' Bias pushes the shadow away from the surface to prevent self-shadowing, but too much bias pushes it too far, detaching it from the object. The fix is to use the smallest bias that eliminates the stripes. You can also use shadow.normalBias instead, which offsets along the surface normal rather than the depth axis, and tends to cause less peter panning on curved surfaces."
        />
      </ScrollReveal>

      <Separator className="my-8" />

      {/* 10. Mental Model Challenge */}
      <ScrollReveal>
        <MentalModelChallenge
          question="You have a scene with shadows enabled on the Canvas and a directional light with castShadow. A box has castShadow=true but the ground plane has receiveShadow=false. What will you see?"
          options={[
            {
              label: "A shadow on the ground beneath the box",
              correct: false,
              explanation:
                "The ground cannot show shadows because receiveShadow is false.",
            },
            {
              label: "No shadow anywhere",
              correct: true,
              explanation:
                "The box casts a shadow, but no surface is set up to receive it, so it is invisible.",
            },
            {
              label: "A shadow on the box itself",
              correct: false,
              explanation:
                "The box has castShadow but not receiveShadow, so it cannot display shadows on itself either (not from this light at least).",
            },
            {
              label: "An error in the console",
              correct: false,
              explanation:
                "Three.js does not throw errors for missing receiveShadow. The shadow is simply not rendered on any surface.",
            },
          ]}
          answer="No visible shadow anywhere. The box is casting a shadow into the shadow map, but no surface has receiveShadow enabled to actually display it. The shadow exists in the map but has nowhere to appear. Add receiveShadow to the ground plane and it will show up immediately."
        />
      </ScrollReveal>

      <Separator className="my-8" />

      {/* Try This Challenges */}
      <ScrollReveal>
        <TryThisList challenges={[
          {
            challenge: "Switch shadow type to Basic — see the hard edges",
            hint: "BasicShadowMap uses no filtering, producing aliased, pixel-sharp shadow edges.",
            solution: "The shadows become visibly jagged and pixelated with hard, staircase-like edges. BasicShadowMap is the cheapest option but looks significantly worse than PCFSoftShadowMap, which smooths the edges.",
            difficulty: "beginner",
          },
          {
            challenge: "Set bias to 0.01 — shadows detach!",
            hint: "Shadow bias offsets the depth comparison. Too much bias pushes shadows away from the surface.",
            solution: "The shadows visibly separate from the objects, appearing to float a short distance away. This is called 'peter panning.' The fix is to use the smallest bias that eliminates shadow acne — typically around -0.0005.",
            difficulty: "intermediate",
          },
          {
            challenge: "Lower shadow map to 256 — pixel shadows",
            hint: "The shadow map resolution determines how much detail shadows can have.",
            solution: "Shadows become extremely blocky and pixelated, like a low-resolution image. Each shadow pixel covers a much larger area, making edges look chunky. This demonstrates why 1024 or 2048 is the typical minimum for acceptable shadow quality.",
            difficulty: "beginner",
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
                  Use CameraHelper during setup
                </h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Add a CameraHelper for your shadow camera to see exactly what
                area the shadow map covers. This makes it easy to tighten the
                frustum for sharper shadows.
              </p>
            </div>
            <div className="rounded-lg border bg-card p-4 space-y-2">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="size-4 text-green-500" />
                <h3 className="font-semibold text-sm">
                  Default to PCFSoftShadowMap
                </h3>
              </div>
              <p className="text-sm text-muted-foreground">
                PCFSoftShadowMap gives the best quality-to-performance ratio
                for most scenes. Only switch to BasicShadowMap if shadow
                filtering is a measured bottleneck.
              </p>
            </div>
            <div className="rounded-lg border bg-card p-4 space-y-2">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="size-4 text-green-500" />
                <h3 className="font-semibold text-sm">
                  Be selective with castShadow
                </h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Every mesh with castShadow adds to the shadow render pass. Skip
                tiny decorations, distant objects, and transparent meshes to keep
                performance high.
              </p>
            </div>
            <div className="rounded-lg border bg-card p-4 space-y-2">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="size-4 text-green-500" />
                <h3 className="font-semibold text-sm">
                  Consider ContactShadows for grounding
                </h3>
              </div>
              <p className="text-sm text-muted-foreground">
                If you only need a soft shadow beneath objects to keep them from
                floating, drei's ContactShadows component is cheaper and easier
                than full shadow mapping.
              </p>
            </div>
          </div>
        </section>
      </ScrollReveal>
    </div>
  );
}
