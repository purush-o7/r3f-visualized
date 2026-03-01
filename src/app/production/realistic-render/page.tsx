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

const RealisticDemo = dynamic(
  () =>
    import("./_components/realistic-demo").then((m) => ({
      default: m.RealisticDemo,
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
    title: "Forgetting tone mapping on a production Canvas",
    subtitle: "Colors look washed out or unnaturally bright",
    wrongCode: `<Canvas>
  {/* Default tone mapping is NoToneMapping */}
  <meshStandardMaterial color="#ff6b35" />
</Canvas>`,
    rightCode: `<Canvas
  gl={{
    toneMapping: THREE.ACESFilmicToneMapping,
    toneMappingExposure: 1.0,
  }}
>
  <meshStandardMaterial color="#ff6b35" />
</Canvas>`,
    filename: "ToneMappedCanvas.tsx",
    explanation:
      "Without tone mapping, HDR values clip harshly at white. ACESFilmicToneMapping compresses the dynamic range like a camera sensor, giving you rich highlights and deep shadows. It is the film industry standard for a reason.",
  },
  {
    title: "Using LinearSRGBColorSpace for the output",
    subtitle: "Scene appears too dark or too bright on most monitors",
    wrongCode: `<Canvas
  gl={{
    outputColorSpace: THREE.LinearSRGBColorSpace,
  }}
>`,
    rightCode: `<Canvas
  gl={{
    outputColorSpace: THREE.SRGBColorSpace,
  }}
>`,
    filename: "ColorSpace.tsx",
    explanation:
      "Monitors expect sRGB-encoded pixels. If you output linear values, the gamma curve makes mid-tones look wrong. Three.js defaults to SRGBColorSpace since r152, but explicitly setting it prevents surprises when upgrading.",
  },
  {
    title: "Shadow acne from incorrect bias",
    subtitle: "Stripy artifacts appear on surfaces that should be smooth",
    wrongCode: `<directionalLight
  castShadow
  // No bias set — shadow map fights with surface
/>`,
    rightCode: `<directionalLight
  castShadow
  shadow-bias={-0.001}
  shadow-mapSize-width={1024}
  shadow-mapSize-height={1024}
/>`,
    filename: "ShadowBias.tsx",
    explanation:
      "Shadow acne happens when the shadow map samples land exactly on the surface, causing self-shadowing. A small negative bias pushes the shadow slightly behind the surface. Too much bias causes 'peter panning' where shadows detach from objects. Start at -0.001 and adjust.",
  },
];

export default function RealisticRenderPage() {
  return (
    <div className="max-w-4xl ambient-canvas">
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-3">
          <Badge variant="outline">Production</Badge>
        </div>
        <h1 className="text-3xl font-bold tracking-tight mb-3">
          Realistic Render
        </h1>
        <p className="text-lg text-muted-foreground">
          Your 3D objects look like plastic toys under fluorescent lighting. You
          know the geometry is right. The materials are fancy. But something
          feels off. The secret is not in the objects -- it is in the camera
          settings.
        </p>
      </div>

      {/* What Could Go Wrong */}
      <WhatCouldGoWrong
        scenario="You spend hours modeling a beautiful metallic watch in Blender, export it as GLTF, and load it into R3F. The metal looks flat and grey. The glass face has no reflections. Your client asks why it looks nothing like the Blender render."
        error="Visual: No tone mapping detected | Colors clipped at white | Shadow map: 512px (blurry) | Output: LinearSRGB (incorrect for display)"
        errorType="Visual Bug"
        accentColor="red"
      />

      <Separator className="my-8" />

      {/* Story Analogy */}
      <ConversationalCallout type="story">
        <p>
          Think of realistic rendering like a <strong>photography studio</strong>.
        </p>
        <p>
          You have the same subject on the table. But a professional photographer
          adjusts: <strong>exposure</strong> (tone mapping), <strong>white
          balance</strong> (color management), <strong>lens quality</strong>{" "}
          (anti-aliasing), and <strong>film type</strong> (output encoding).
          These are not about the subject at all -- they are about how the
          camera <em>sees</em> the subject.
        </p>
        <p>
          In Three.js, your &quot;camera settings&quot; live on the{" "}
          <strong>Canvas gl</strong> prop. Small tweaks there make the same
          scene look amateur or photorealistic.
        </p>
      </ConversationalCallout>

      <Separator className="my-8" />

      {/* Mental Model Flow */}
      <SimpleFlow
        steps={[
          { label: "Raw Scene", detail: "Flat, clipped, no depth", status: "error" },
          { label: "Tone Mapping", detail: "Compress dynamic range" },
          { label: "Color Space", detail: "sRGB for monitors" },
          { label: "Shadows", detail: "Grounding & depth" },
          { label: "Photorealistic", detail: "Production quality", status: "success" },
        ]}
        accentColor="orange"
      />

      <Separator className="my-8" />

      {/* Interactive Demo */}
      <RealisticDemo />

      <Separator className="my-8" />

      {/* Guided Walkthrough */}
      <ScrollReveal>
        <section className="space-y-4">
          <h2 className="text-2xl font-bold">
            The Four Render Settings That Matter
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            Every production R3F app should configure these four properties on
            the Canvas. Together they transform a flat scene into something
            convincing.
          </p>

          <div className="rounded-lg border bg-card p-4 space-y-3">
            <p className="text-sm font-medium">
              Step 1: Tone Mapping -- compress the light
            </p>
            <CodeBlock
              code={`// ACESFilmic is the film-industry standard
<Canvas
  gl={{
    toneMapping: THREE.ACESFilmicToneMapping,
    toneMappingExposure: 1.0,
  }}
>`}
              filename="ToneMapping.tsx"
            />
            <p className="text-sm text-muted-foreground">
              HDR lighting values can exceed 1.0 (pure white). Without tone
              mapping, anything above 1.0 clips to white, losing all highlight
              detail. ACESFilmic compresses the range like real camera film,
              preserving highlights and deepening shadows.
            </p>
          </div>

          <div className="rounded-lg border bg-card p-4 space-y-3">
            <p className="text-sm font-medium">
              Step 2: Color Space -- speak the monitor&apos;s language
            </p>
            <CodeBlock
              code={`// sRGB is what monitors expect
<Canvas
  gl={{
    outputColorSpace: THREE.SRGBColorSpace,
  }}
>`}
              filename="ColorSpace.tsx"
            />
            <p className="text-sm text-muted-foreground">
              Monitors apply a gamma curve to displayed pixels. If you output
              linear values, mid-tones look wrong. SRGBColorSpace applies the
              inverse gamma so colors appear correct on screen. Three.js does
              this by default since r152, but setting it explicitly prevents
              surprises.
            </p>
          </div>

          <div className="rounded-lg border bg-card p-4 space-y-3">
            <p className="text-sm font-medium">
              Step 3: Shadows -- ground your objects
            </p>
            <CodeBlock
              code={`// Enable shadows on Canvas, light, and meshes
<Canvas shadows>
  <directionalLight
    castShadow
    shadow-mapSize-width={1024}
    shadow-mapSize-height={1024}
    shadow-bias={-0.001}
  />
  <mesh castShadow>...</mesh>
  <mesh receiveShadow>...</mesh>
</Canvas>`}
              filename="Shadows.tsx"
            />
            <p className="text-sm text-muted-foreground">
              Without shadows, objects float in space. Enable shadows on the
              Canvas, set castShadow on the light and objects, and receiveShadow
              on the floor. Increase shadow-mapSize for sharper edges, and use
              shadow-bias to fix acne artifacts.
            </p>
          </div>

          <div className="rounded-lg border bg-card p-4 space-y-3">
            <p className="text-sm font-medium">
              Step 4: Anti-aliasing -- smooth the jaggies
            </p>
            <CodeBlock
              code={`// Enable MSAA via the gl prop
<Canvas
  gl={{ antialias: true }}
  dpr={[1, 2]}
>`}
              filename="Antialiasing.tsx"
            />
            <p className="text-sm text-muted-foreground">
              Aliased edges (jagged stairs on diagonal lines) scream
              &quot;computer graphics.&quot; Setting antialias to true enables
              multisample anti-aliasing (MSAA). Combine with dpr to cap the
              pixel ratio at 2 -- this gives clean edges without the GPU cost
              of rendering at 3x or 4x resolution.
            </p>
          </div>
        </section>
      </ScrollReveal>

      <Separator className="my-8" />

      {/* What You Just Learned */}
      <WhatYouJustLearned
        points={[
          "ACESFilmicToneMapping compresses HDR values like camera film, preventing harsh white clips.",
          "SRGBColorSpace matches how monitors display colors. Linear output looks wrong on screen.",
          "Shadows need three things: Canvas shadows prop, castShadow on light/objects, receiveShadow on floors.",
          "Shadow bias (-0.001) prevents shadow acne. Shadow map size (1024+) controls sharpness.",
          "Anti-aliasing + dpr={[1, 2]} gives clean edges without excessive GPU cost on high-DPI screens.",
        ]}
      />

      <Separator className="my-8" />

      {/* Question */}
      <ConversationalCallout type="question">
        <p>
          You set ACESFilmicToneMapping and your scene looks great. But then
          you add a bright point light and the highlights turn orange instead
          of white. What is happening, and which setting would you adjust?
        </p>
      </ConversationalCallout>

      <Separator className="my-8" />

      {/* Aha Moment */}
      <AhaMoment
        setup="Most beginners think realistic rendering requires complex shaders or expensive post-processing effects. They spend days writing custom GLSL code..."
        reveal="The truth is that 80% of visual quality comes from four Canvas-level settings that take 30 seconds to configure: tone mapping, exposure, color space, and shadows. These are the same settings a photographer adjusts on their camera before taking a single photo. The subject (your 3D objects) is already fine -- you just need to tell the renderer how to photograph it. ACESFilmicToneMapping alone transforms most scenes from 'hobby project' to 'production ready.'"
      />

      <Separator className="my-8" />

      {/* Mental Model Challenge */}
      <MentalModelChallenge
        question="You have two identical scenes. Scene A uses ACESFilmicToneMapping with exposure 1.0. Scene B uses NoToneMapping. You add a very bright point light (intensity: 100) to both. What happens differently in each scene?"
        options={[
          {
            label: "Both scenes look the same because intensity is capped",
            correct: false,
            explanation:
              "There is no cap on light intensity. The difference is entirely in how the renderer handles values above 1.0.",
          },
          {
            label: "Scene A burns out to pure white, Scene B stays normal",
            correct: false,
            explanation:
              "It is the opposite. ACES compresses bright values so they stay visible, while NoToneMapping clips them.",
          },
          {
            label: "Scene A shows bright but detailed highlights, Scene B clips to flat white",
            correct: true,
            explanation:
              "ACESFilmic compresses high values into a visible range, preserving highlight detail. NoToneMapping clips anything above 1.0 to pure white.",
          },
          {
            label: "Scene B is brighter overall because it has no tone mapping overhead",
            correct: false,
            explanation:
              "Tone mapping is not about performance overhead. It is about how mathematical light values are mapped to display colors.",
          },
        ]}
        hint="Think about what happens when a pixel value exceeds 1.0 (pure white). How does each tone mapping handle overflow?"
        answer="Tone mapping is a mathematical function applied to every pixel. NoToneMapping passes values through directly -- anything above 1.0 clips to white. ACESFilmic applies an S-curve that compresses bright values into the displayable range, similar to how camera film responds to light. This is why bright lights in ACES still show color and detail in their highlights, while NoToneMapping creates flat white blowout."
      />

      <Separator className="my-8" />

      {/* Try This */}
      <Separator className="my-8" />
      <ScrollReveal>
        <TryThisList challenges={[
          { challenge: "Switch toneMapping to None — washed out!", hint: "Change the tone mapping mode to NoToneMapping.", solution: "Without tone mapping, HDR values clip harshly at white. Bright areas lose all detail and colors look flat.", difficulty: "beginner" },
          { challenge: "Set exposure to 3 — overexposed!", hint: "Increase the tone mapping exposure to 3.", solution: "The scene becomes overexposed like an overlit photograph. Highlights blow out and the image looks washed.", difficulty: "beginner" },
          { challenge: "Toggle shadows off — flatter look", hint: "Disable shadows in the scene.", solution: "Without shadows, objects lose their grounding and depth cues. The scene feels noticeably flatter.", difficulty: "beginner" },
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
                <h3 className="font-semibold text-sm">Start with ACES</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                ACESFilmicToneMapping is the right choice for 90% of scenes.
                It handles bright highlights gracefully and produces
                cinema-quality color. Only switch to Reinhard or Cineon if
                you need a specific aesthetic.
              </p>
            </div>
            <div className="rounded-lg border bg-card p-4 space-y-2">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="size-4 text-green-500" />
                <h3 className="font-semibold text-sm">
                  Use Environment Maps
                </h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Metallic and glossy materials need something to reflect.
                drei&apos;s Environment component with a preset like
                &quot;studio&quot; or &quot;city&quot; gives you instant
                reflections. Without it, metallic objects look flat grey.
              </p>
            </div>
            <div className="rounded-lg border bg-card p-4 space-y-2">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="size-4 text-green-500" />
                <h3 className="font-semibold text-sm">
                  Shadow Map Size Matters
                </h3>
              </div>
              <p className="text-sm text-muted-foreground">
                The default shadow map is 512x512 pixels, which produces
                blurry shadows. Bump it to 1024 or 2048 for sharper results.
                Going above 2048 rarely helps and wastes GPU memory.
              </p>
            </div>
            <div className="rounded-lg border bg-card p-4 space-y-2">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="size-4 text-green-500" />
                <h3 className="font-semibold text-sm">
                  Cap Pixel Ratio
                </h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Use dpr=&#123;[1, 2]&#125; on Canvas. High-DPI screens
                (3x, 4x) render 9 to 16 times more pixels for a minimal
                visual improvement. Combined with antialias, dpr 2 looks
                sharp enough on any display.
              </p>
            </div>
          </div>
        </section>
      </ScrollReveal>
    </div>
  );
}
