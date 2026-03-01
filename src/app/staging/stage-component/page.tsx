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

const StageDemo = dynamic(
  () => import("./_components/stage-demo").then((m) => ({ default: m.StageDemo })),
  {
    ssr: false,
    loading: () => (
      <div className="w-full aspect-[2/1] rounded-xl border bg-scene-bg animate-pulse" />
    ),
  }
);

const mistakes: Mistake[] = [
  {
    title: "Adding extra lights alongside Stage",
    subtitle: "Over-lit scene with blown-out highlights",
    wrongCode: `<>
  <Stage preset="rembrandt">
    <MyModel />
  </Stage>
  {/* Stage already provides lighting! */}
  <ambientLight intensity={1} />
  <directionalLight intensity={2} />
</>`,
    rightCode: `<Stage
  preset="rembrandt"
  intensity={0.8}
  environment="city"
>
  <MyModel />
</Stage>
// Adjust intensity prop instead of adding lights`,
    filename: "Experience.tsx",
    explanation:
      "Stage is an all-in-one solution that includes environment-based lighting, contact shadows, and centering. Adding extra lights on top causes over-exposure with blown-out highlights and lost detail. If Stage's lighting is too dim or too bright, adjust its intensity prop or environment preset. If you need full control, skip Stage and use Environment + individual lights.",
  },
  {
    title: "Nesting Stage inside another Stage",
    subtitle: "Double lighting causes visual artifacts",
    wrongCode: `<Stage preset="rembrandt">
  <Stage preset="portrait">
    <MyModel />
  </Stage>
</Stage>`,
    rightCode: `<Stage preset="portrait" intensity={0.7}>
  <MyModel />
</Stage>
// One Stage wrapper is all you need`,
    filename: "Experience.tsx",
    explanation:
      "Each Stage creates its own complete lighting setup with environment maps, shadows, and centering. Nesting one inside another doubles the lighting and creates conflicting shadow planes. Always use a single Stage wrapper. If different objects need different presentations, use separate Canvases.",
  },
  {
    title: "Using Stage for large multi-area scenes",
    subtitle: "Auto-centering and camera framing break for spread-out objects",
    wrongCode: `<Stage adjustCamera>
  {/* Stage treats ALL children as one group */}
  <Room position={[-10, 0, 0]} />
  <Garden position={[10, 0, 0]} />
  <Sky position={[0, 20, 0]} />
</Stage>`,
    rightCode: `<>
  <Environment preset="sunset" />
  <ContactShadows
    position={[0, -0.5, 0]}
    opacity={0.4} blur={2}
  />
  <Room position={[-10, 0, 0]} />
  <Garden position={[10, 0, 0]} />
  <OrbitControls makeDefault target={[0, 1, 0]} />
</>`,
    filename: "ComplexScene.tsx",
    explanation:
      "Stage is designed for presenting a single model or small group, like a product viewer. It auto-centers all children as one bounding box and frames the camera around them. For complex scenes with multiple distant areas, this auto-framing breaks down. Use Environment, ContactShadows, and Center separately for full control.",
  },
];

export default function StageComponentPage() {
  return (
    <div className="relative max-w-4xl">
      <div className="absolute -top-10 -left-10 w-72 h-72 bg-gradient-to-br from-teal-500/10 via-emerald-500/10 to-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
      {/* 1. Title + Badge + Intro */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-3">
          <Badge variant="outline">Staging</Badge>
        </div>
        <h1 className="text-3xl font-bold tracking-tight mb-3">
          Stage Component
        </h1>
        <p className="text-lg text-muted-foreground">
          Stage is the &quot;make it look good&quot; button. Wrap any 3D object
          in a Stage component and it instantly gets professional lighting,
          soft contact shadows, environment reflections, and auto-centering.
          Zero configuration, polished results.
        </p>
      </div>

      {/* 2. What Could Go Wrong */}
      <WhatCouldGoWrong
        scenario="You load a 3D model and it looks fine, so you add an ambient light, a directional light, and an Environment component for reflections. Then you add ContactShadows for a ground shadow and Center to position it properly. That is five separate components to configure. You tweak each one for an hour. Then your colleague drops the model inside <Stage> and it looks just as good in 10 seconds."
        error="Spending hours manually configuring lighting, shadows, and centering when Stage does it all in one line."
        errorType="Over-Engineering"
      />

      <Separator className="my-8" />

      {/* 3. Story Analogy */}
      <ScrollReveal>
        <ConversationalCallout type="story">
          <p>
            Imagine walking into a professional photo studio. The backdrop is
            already set up. The lights are positioned in a classic portrait
            arrangement. The floor has a subtle reflection. The camera is
            framed so the subject fills the shot perfectly.
          </p>
          <p>
            You do not need to understand photography lighting to take a great
            photo in that studio. You just put your subject on the mark, and
            everything looks polished.
          </p>
          <p>
            Stage is that photo studio. It sets up the backdrop (Environment),
            positions the lights (preset lighting), adds a floor shadow
            (ContactShadows), and centers the subject (Center). You just drop
            your model inside.
          </p>
        </ConversationalCallout>
      </ScrollReveal>

      <Separator className="my-8" />

      {/* 4. SimpleFlow — Mental Model */}
      <ScrollReveal>
        <section className="space-y-4">
          <h2 className="text-2xl font-bold">What Stage Bundles Together</h2>
          <p className="text-muted-foreground leading-relaxed">
            Stage is a convenience wrapper around four things you would
            otherwise set up manually.
          </p>
          <SimpleFlow
            steps={[
              {
                label: "Environment",
                detail: "IBL lighting + reflections",
              },
              {
                label: "Light Preset",
                detail: "rembrandt, portrait, upfront, or soft",
              },
              {
                label: "ContactShadows",
                detail: "Soft ground shadow beneath the object",
              },
              {
                label: "Center",
                detail: "Auto-positions model at the origin",
                status: "success",
              },
            ]}
          />
        </section>
      </ScrollReveal>

      <Separator className="my-8" />

      {/* 5. Interactive Demo */}
      <StageDemo />

      <Separator className="my-8" />

      {/* 6. Guided Walkthrough */}
      <ScrollReveal>
        <section className="space-y-6">
          <h2 className="text-2xl font-bold">Guided Walkthrough</h2>
          <p className="text-muted-foreground leading-relaxed">
            From zero to a polished product shot in three steps.
          </p>

          <div className="bg-card border rounded-lg p-4 space-y-3">
            <h3 className="font-semibold text-sm">
              Step 1 — Wrap your model in Stage
            </h3>
            <CodeBlock
              code={`import { Stage, OrbitControls } from '@react-three/drei'

<>
  <OrbitControls makeDefault />
  <Stage>
    <mesh>
      <torusKnotGeometry args={[1, 0.3, 128, 32]} />
      <meshStandardMaterial
        color="royalblue"
        metalness={0.8}
        roughness={0.2}
      />
    </mesh>
  </Stage>
</>`}
              filename="BasicStage.tsx"
            />
            <p className="text-sm text-muted-foreground">
              That is it. The torus knot is now centered, lit with environment
              lighting, and has a soft contact shadow on the ground. No extra
              lights needed.
            </p>
          </div>

          <div className="bg-card border rounded-lg p-4 space-y-3">
            <h3 className="font-semibold text-sm">
              Step 2 — Pick a lighting preset
            </h3>
            <CodeBlock
              code={`{/* rembrandt: dramatic, directional */}
{/* portrait:  soft, even */}
{/* upfront:   bright, flat */}
{/* soft:      diffused, organic */}

<Stage
  preset="rembrandt"
  intensity={0.5}
  environment="city"
>
  <YourModel />
</Stage>`}
              filename="LightingPresets.tsx"
            />
            <p className="text-sm text-muted-foreground">
              Each preset mimics a classic photography lighting setup. Rembrandt
              is dramatic with strong directional shadows. Portrait is soft and
              even. Try all four to see which suits your model best. Adjust
              intensity to make it brighter or dimmer.
            </p>
          </div>

          <div className="bg-card border rounded-lg p-4 space-y-3">
            <h3 className="font-semibold text-sm">
              Step 3 — Know when to break out of Stage
            </h3>
            <CodeBlock
              code={`{/* Stage: quick, all-in-one */}
<Stage preset="soft">
  <ProductModel />
</Stage>

{/* Individual components: full control */}
<Environment preset="warehouse" background blur={0.5} />
<ContactShadows position={[0, -0.5, 0]} opacity={0.4} />
<Center top>
  <ProductModel />
</Center>`}
              filename="StageVsManual.tsx"
            />
            <p className="text-sm text-muted-foreground">
              Stage is perfect for 80% of cases. But if you need a visible
              background, custom shadow settings, or fine-grained light
              placement, use the individual components it is built from. You
              are not locked in.
            </p>
          </div>
        </section>
      </ScrollReveal>

      <Separator className="my-8" />

      {/* 7. What You Just Learned */}
      <ScrollReveal>
        <WhatYouJustLearned
          points={[
            "Stage bundles Environment, lighting, ContactShadows, and Center into one component",
            "You do not need to add any extra lights — Stage provides everything",
            "Four presets (rembrandt, portrait, upfront, soft) mimic classic photography setups",
            "Use the intensity prop to adjust brightness instead of adding separate lights",
            "When you need more control, break out into the individual components Stage wraps",
          ]}
        />
      </ScrollReveal>

      <Separator className="my-8" />

      {/* 8. Thought-Provoking Question */}
      <ScrollReveal>
        <ConversationalCallout type="question">
          <p>
            Stage auto-centers your model and adjusts the camera to frame it.
            What happens if you put two objects far apart inside Stage? Does
            each one get its own spotlight, or does Stage treat them as a
            single group? (Hint: think about bounding boxes.)
          </p>
        </ConversationalCallout>
      </ScrollReveal>

      <Separator className="my-8" />

      {/* 9. Aha Moment */}
      <ScrollReveal>
        <AhaMoment
          setup="Why does Stage tell you not to add extra lights? Surely more lights make things look better?"
          reveal="Stage already provides carefully balanced lighting through its environment map and preset. Adding a directional light on top is like turning on a flashlight in a well-lit photo studio — it over-exposes parts of the scene and creates harsh, conflicting shadows. Photography studios work precisely because the lighting is controlled and intentional."
        />
      </ScrollReveal>

      <Separator className="my-8" />

      {/* 10. Mental Model Challenge */}
      <ScrollReveal>
        <MentalModelChallenge
          question="You have a 3D model that is positioned at [5, 3, -2] in world space. You wrap it in a <Stage> component. Where does the model appear on screen?"
          options={[
            {
              label: "At [5, 3, -2] because Stage respects the original position",
              correct: false,
              explanation:
                "Stage auto-centers all children, overriding their world position.",
            },
            {
              label: "At the center of the scene because Stage auto-centers",
              correct: true,
              explanation:
                "Stage uses the Center component internally to move everything to the origin.",
            },
            {
              label: "Off-screen because Stage and the position conflict",
              correct: false,
              explanation:
                "No conflict. Stage simply re-centers the model regardless of its original position.",
            },
            {
              label: "It depends on the adjustCamera prop",
              correct: false,
              explanation:
                "adjustCamera controls the camera framing, but centering always happens through the Center component.",
            },
          ]}
          answer="Stage uses the Center component internally to move your model to the origin regardless of its original position. This is great for single-model presentations but can be surprising if you have multiple objects positioned relative to each other. If you need specific positioning, use Environment + ContactShadows + Center individually."
        />
      </ScrollReveal>

      <Separator className="my-8" />

      {/* Try This */}
      <Separator className="my-8" />
      <ScrollReveal>
        <TryThisList challenges={[
          { challenge: "Try all 4 presets — which is your favorite?", hint: "Switch between rembrandt, portrait, upfront, and soft in the demo controls.", solution: "Each preset creates a different mood. Rembrandt is dramatic, portrait is soft, upfront is bright, soft is diffused.", difficulty: "beginner" },
          { challenge: "Toggle shadows off — flatter look", hint: "Disable the shadows option in the Stage controls.", solution: "Without contact shadows, the object appears to float above the ground instead of being grounded.", difficulty: "beginner" },
          { challenge: "Set intensity to 0 — only ambient light", hint: "Drag the intensity slider all the way down to zero.", solution: "At intensity 0, only the environment map provides light. The scene becomes very soft with no directional shadows.", difficulty: "beginner" },
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
                <h3 className="font-semibold text-sm">No extra lights</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Stage provides all the lighting. Use the <code>intensity</code>
                prop to adjust brightness instead of adding ambient or
                directional lights alongside it.
              </p>
            </div>
            <div className="rounded-lg border bg-card p-4 space-y-2">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="size-4 text-green-500" />
                <h3 className="font-semibold text-sm">Try all four presets</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Each preset creates a different mood. Spend two minutes
                switching between rembrandt, portrait, upfront, and soft to
                find the best match for your model.
              </p>
            </div>
            <div className="rounded-lg border bg-card p-4 space-y-2">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="size-4 text-green-500" />
                <h3 className="font-semibold text-sm">Use for presentations</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Stage is ideal for product pages, model viewers, portfolio
                pieces, and demos. It handles the common case with zero
                configuration.
              </p>
            </div>
            <div className="rounded-lg border bg-card p-4 space-y-2">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="size-4 text-green-500" />
                <h3 className="font-semibold text-sm">
                  Break out when needed
                </h3>
              </div>
              <p className="text-sm text-muted-foreground">
                If Stage is too opinionated, use Environment + ContactShadows
                + Center separately. You get the same pieces with full control
                over each one.
              </p>
            </div>
          </div>
        </section>
      </ScrollReveal>
    </div>
  );
}
