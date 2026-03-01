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

const SkyDemo = dynamic(
  () => import("./_components/sky-demo").then((m) => ({ default: m.SkyDemo })),
  {
    ssr: false,
    loading: () => (
      <div className="w-full aspect-[2/1] rounded-xl border bg-scene-bg animate-pulse" />
    ),
  }
);

const mistakes: Mistake[] = [
  {
    title: "Not syncing directional light with sun position",
    subtitle: "Shadows point the wrong direction from the visible sun",
    wrongCode: `<>
  {/* Sun appears on the right */}
  <Sky sunPosition={[10, 2, 0]} />
  {/* But light comes from the LEFT! */}
  <directionalLight position={[-5, 5, 0]} castShadow />
</>`,
    rightCode: `const sunPos = [10, 2, 0]

<>
  <Sky sunPosition={sunPos} />
  {/* Light matches the sun direction */}
  <directionalLight
    position={sunPos}
    castShadow
    intensity={1.5}
  />
</>`,
    filename: "Experience.tsx",
    explanation:
      "Sky is purely visual — it renders a sky shader but emits no light. You need a separate directional light to illuminate your scene. If the light direction does not match the sun position, shadows point the wrong way and the illusion breaks. Always share the same position vector for both.",
  },
  {
    title: "Too many stars on mobile devices",
    subtitle: "Frame rate drops on phones and low-end GPUs",
    wrongCode: `<Stars
  count={10000}
  factor={6}
  speed={2}
/>
// 10,000 animated particles on a phone = lag`,
    rightCode: `const isMobile = /iPhone|iPad|Android/i.test(
  navigator.userAgent
)

<Stars
  count={isMobile ? 1500 : 5000}
  factor={isMobile ? 3 : 4}
  fade
  speed={isMobile ? 0 : 1}
/>`,
    filename: "AdaptiveStars.tsx",
    explanation:
      "Stars renders each star as a point particle. High counts with large factor sizes and animation can stress mobile GPUs. Reduce count to 1,000-2,000 on phones, lower the factor, and set speed to 0 to disable rotation. The fade prop hides reduced density by fading stars at the edges.",
  },
  {
    title: "Using Sky for a night scene",
    subtitle: "Sky still glows even when the sun is below the horizon",
    wrongCode: `// Sun below horizon but sky still shows color
<Sky sunPosition={[0, -1, 0]} />
<Stars count={5000} />`,
    rightCode: `// Use a dark background instead of Sky for night
<color attach="background" args={['#000008']} />
<Stars
  radius={100}
  count={5000}
  factor={4}
  fade
  speed={0.5}
/>
<ambientLight intensity={0.05} color="#8888ff" />`,
    filename: "NightScene.tsx",
    explanation:
      "Sky's atmospheric scattering model does not produce true darkness even with the sun below the horizon. It still shows a dim gradient that washes out stars. For night scenes, use a dark background color and Stars alone. For dusk or twilight, position the sun just above the horizon with high turbidity.",
  },
];

export default function SkyStarsPage() {
  return (
    <div className="relative max-w-4xl">
      <div className="absolute -top-10 -left-10 w-72 h-72 bg-gradient-to-br from-teal-500/10 via-emerald-500/10 to-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
      {/* 1. Title + Badge + Intro */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-3">
          <Badge variant="outline">Staging</Badge>
        </div>
        <h1 className="text-3xl font-bold tracking-tight mb-3">
          Sky & Stars
        </h1>
        <p className="text-lg text-muted-foreground">
          Sky gives you a realistic procedural atmosphere — blue skies at noon,
          warm oranges at sunset, deep reds at dawn. Stars fills the background
          with a twinkling starfield for space and night scenes. Both are
          lightweight, require no image downloads, and render in a single shader
          pass.
        </p>
      </div>

      {/* 2. What Could Go Wrong */}
      <WhatCouldGoWrong
        scenario="You add a Sky component with the sun low on the horizon. It looks beautiful — warm sunset colors across the dome. But your objects have no shadows, and the light direction does not match the sun at all. You spin the sky to move the sun, but the shadows stay fixed. Turns out, Sky is purely visual. It does not emit any light."
        error="Objects are unlit despite a visible sun in the sky. Sky component does not provide scene lighting or cast shadows."
        errorType="No Light"
      />

      <Separator className="my-8" />

      {/* 3. Story Analogy */}
      <ScrollReveal>
        <ConversationalCallout type="story">
          <p>
            Think of a planetarium. You walk into the dome and look up. The
            projector paints a realistic sky overhead — the sun in the right
            position, scattered blue light, warm colors near the horizon. It
            looks exactly like being outside.
          </p>
          <p>
            But it is just a projection. The dome does not actually warm you,
            and there is no real sunlight casting shadows on the seats. If the
            planetarium wanted shadows, they would need to add a separate
            spotlight pointing from where the projected sun sits.
          </p>
          <p>
            The Sky component is that planetarium dome. It projects a
            physically-based atmosphere using atmospheric scattering math.
            Beautiful to look at, but you still need a directional light for
            actual illumination and shadows.
          </p>
        </ConversationalCallout>
      </ScrollReveal>

      <Separator className="my-8" />

      {/* 4. SimpleFlow — Mental Model */}
      <ScrollReveal>
        <section className="space-y-4">
          <h2 className="text-2xl font-bold">How Sky and Stars Work</h2>
          <p className="text-muted-foreground leading-relaxed">
            Sky handles daytime atmospheres. Stars handles nighttime particle
            fields. They serve different purposes but can be layered for
            dusk scenes.
          </p>
          <SimpleFlow
            steps={[
              {
                label: "Sky",
                detail: "Atmospheric shader on a sphere",
              },
              {
                label: "sunPosition",
                detail: "Controls time of day and colors",
              },
              {
                label: "Directional Light",
                detail: "Must match sun for shadows",
                status: "success",
              },
              {
                label: "Stars (optional)",
                detail: "Point particles for night sky",
                status: "success",
              },
            ]}
          />
        </section>
      </ScrollReveal>

      <Separator className="my-8" />

      {/* 5. Interactive Demo */}
      <SkyDemo />

      <Separator className="my-8" />

      {/* 6. Guided Walkthrough */}
      <ScrollReveal>
        <section className="space-y-6">
          <h2 className="text-2xl font-bold">Guided Walkthrough</h2>
          <p className="text-muted-foreground leading-relaxed">
            Let us build three scenes: a bright day, a starry night, and a
            layered dusk.
          </p>

          <div className="bg-card border rounded-lg p-4 space-y-3">
            <h3 className="font-semibold text-sm">
              Step 1 — A daytime sky with matching light
            </h3>
            <CodeBlock
              code={`import { Sky } from '@react-three/drei'

const sunPos = [1, 0.5, 0]

<>
  <Sky
    sunPosition={sunPos}
    turbidity={8}
    rayleigh={6}
    mieCoefficient={0.005}
    mieDirectionalG={0.8}
  />
  {/* Light must match the sun direction */}
  <directionalLight
    position={sunPos}
    intensity={1.5}
    castShadow
  />
</>`}
              filename="DaytimeSky.tsx"
            />
            <p className="text-sm text-muted-foreground">
              sunPosition controls where the sun sits. Turbidity is haze
              density, rayleigh controls blue scattering. The key rule: always
              pair Sky with a directional light at the same position. Sky is
              just the painting on the dome, the light does the real work.
            </p>
          </div>

          <div className="bg-card border rounded-lg p-4 space-y-3">
            <h3 className="font-semibold text-sm">
              Step 2 — A starry night scene
            </h3>
            <CodeBlock
              code={`import { Stars } from '@react-three/drei'

<>
  <color attach="background" args={['#000010']} />
  <Stars
    radius={100}
    depth={50}
    count={5000}
    factor={4}
    saturation={0}
    fade
    speed={1}
  />
</>`}
              filename="StarryNight.tsx"
            />
            <p className="text-sm text-muted-foreground">
              For night, skip Sky entirely and use a dark background color.
              Stars creates point particles scattered in a sphere. The fade
              prop softens the edges, speed rotates the whole field slowly, and
              factor controls how big the stars appear.
            </p>
          </div>

          <div className="bg-card border rounded-lg p-4 space-y-3">
            <h3 className="font-semibold text-sm">
              Step 3 — A dusk scene with Sky and Stars layered
            </h3>
            <CodeBlock
              code={`<>
  <Sky
    sunPosition={[1, 0.05, 0]}
    turbidity={10}
    rayleigh={3}
  />
  <Stars
    radius={200}
    count={3000}
    factor={3}
    fade
    speed={0.5}
  />
  <directionalLight
    position={[1, 0.05, 0]}
    intensity={0.8}
    color="#ff7b00"
  />
</>`}
              filename="DuskScene.tsx"
            />
            <p className="text-sm text-muted-foreground">
              Position the sun barely above the horizon for warm dusk colors.
              High turbidity adds more haze. Stars become visible in the darker
              upper sky. Tint the directional light orange to match the sunset
              mood.
            </p>
          </div>
        </section>
      </ScrollReveal>

      <Separator className="my-8" />

      {/* 7. What You Just Learned */}
      <ScrollReveal>
        <WhatYouJustLearned
          points={[
            "Sky renders a procedural atmosphere based on physically-based scattering math",
            "Sky is purely visual — it does not emit light. Always pair it with a directional light",
            "sunPosition controls the time of day: high = noon, low = sunset, below = not great for night",
            "Stars creates a particle-based starfield. Use fade and reduce count on mobile",
            "For night scenes, skip Sky and use a dark background color with Stars",
          ]}
        />
      </ScrollReveal>

      <Separator className="my-8" />

      {/* 8. Thought-Provoking Question */}
      <ScrollReveal>
        <ConversationalCallout type="question">
          <p>
            Sky provides a beautiful background but no lighting. Environment
            provides lighting and reflections but loads an image file. Can you
            use both together — Sky for the visible backdrop and Environment
            (without background) for the reflections? What would that look like?
          </p>
        </ConversationalCallout>
      </ScrollReveal>

      <Separator className="my-8" />

      {/* 9. Aha Moment */}
      <ScrollReveal>
        <AhaMoment
          setup="Why does Sky cost practically nothing to render, while an HDRI background requires downloading a multi-megabyte file?"
          reveal="Sky does not use an image at all. It runs a mathematical formula (Preetham atmospheric scattering model) in a shader that computes the sky color for every pixel based on the sun position and a few parameters. The entire sky is generated on the GPU in real time from math, not from stored pixel data. That is why it costs zero download time and almost zero memory."
        />
      </ScrollReveal>

      <Separator className="my-8" />

      {/* 10. Mental Model Challenge */}
      <ScrollReveal>
        <MentalModelChallenge
          question="You have a scene with <Sky sunPosition={[0, 2, 0]} /> and nothing else. What does the scene look like?"
          options={[
            {
              label: "A bright blue sky with a visible sun and lit objects",
              correct: false,
              explanation:
                "Sky does not emit light. Objects would be unlit (black).",
            },
            {
              label: "A bright blue sky background, but all objects appear black",
              correct: true,
              explanation:
                "Sky only renders the visual background. Without lights, objects receive no illumination and appear black.",
            },
            {
              label: "A black screen because Sky needs a directional light to work",
              correct: false,
              explanation:
                "Sky itself renders fine without lights. It is the objects that need lights to be visible.",
            },
            {
              label: "An error because sunPosition should be normalized",
              correct: false,
              explanation:
                "sunPosition does not need to be normalized. It is a direction vector, and [0, 2, 0] points straight up.",
            },
          ]}
          answer="The sky dome renders a beautiful blue atmosphere with the sun directly overhead (Y = 2 points up). But every 3D object in the scene is pitch black because Sky is purely visual — it does not cast any light. You would need to add a directional light at the same position to illuminate the scene."
        />
      </ScrollReveal>

      <Separator className="my-8" />

      {/* Try This */}
      <Separator className="my-8" />
      <ScrollReveal>
        <TryThisList challenges={[
          { challenge: "Slide sun to sunset — golden hour!", hint: "Lower the sun elevation until it is just above the horizon.", solution: "When the sun is near the horizon, atmospheric scattering produces warm orange and red tones across the sky dome.", difficulty: "beginner" },
          { challenge: "Set rayleigh to 10 — alien sky!", hint: "Crank the rayleigh scattering slider up to 10.", solution: "High rayleigh values exaggerate blue scattering, creating an intense, otherworldly sky color.", difficulty: "beginner" },
          { challenge: "Set starCount to 10000 — starry night", hint: "Increase the star count in the Stars controls to 10000.", solution: "More stars fill the sky dome, creating a dense starfield effect. Watch for performance on mobile at very high counts.", difficulty: "beginner" },
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
                <h3 className="font-semibold text-sm">Sync light with sun</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Always add a directional light matching the Sky&apos;s
                sunPosition. Share the same variable for both to keep them
                in sync automatically.
              </p>
            </div>
            <div className="rounded-lg border bg-card p-4 space-y-2">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="size-4 text-green-500" />
                <h3 className="font-semibold text-sm">Dark BG for night</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                For night scenes, use{" "}
                <code>&lt;color attach=&quot;background&quot; /&gt;</code>{" "}
                instead of Sky. The atmospheric shader cannot produce true
                darkness.
              </p>
            </div>
            <div className="rounded-lg border bg-card p-4 space-y-2">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="size-4 text-green-500" />
                <h3 className="font-semibold text-sm">Reduce stars on mobile</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Keep star count under 2,000 on mobile. Set{" "}
                <code>speed=&#123;0&#125;</code> to disable rotation animation
                and use the <code>fade</code> prop.
              </p>
            </div>
            <div className="rounded-lg border bg-card p-4 space-y-2">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="size-4 text-green-500" />
                <h3 className="font-semibold text-sm">
                  Prefer Sky over HDRI for sky
                </h3>
              </div>
              <p className="text-sm text-muted-foreground">
                When you just need a sky background with no reflections,
                Sky is cheaper. Zero download, zero loading time, and
                fully adjustable via props.
              </p>
            </div>
          </div>
        </section>
      </ScrollReveal>
    </div>
  );
}
