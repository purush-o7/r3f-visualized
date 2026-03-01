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

const PBRDemoComponent = dynamic(
  () =>
    import("./_components/pbr-demo").then((m) => ({
      default: m.PBRDemo,
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
    title: "Textures look washed-out or too dark",
    subtitle: "Forgetting to set sRGB color space on color textures",
    wrongCode: `const colorMap = loader.load('/textures/wood.jpg');
// Defaults to linear — PBR math treats it as raw data
// Colors look grey and washed out

<meshStandardMaterial map={colorMap} />`,
    rightCode: `const colorMap = loader.load('/textures/wood.jpg');
colorMap.colorSpace = THREE.SRGBColorSpace;
// Now Three.js converts correctly for PBR math

<meshStandardMaterial map={colorMap} />`,
    filename: "color-space.tsx",
    explanation:
      "Color textures are saved in sRGB but PBR lighting math needs linear values. Marking the texture as sRGB lets Three.js handle the conversion automatically. Only color and emissive maps need sRGB — normal, roughness, and metalness maps must stay linear.",
  },
  {
    title: "Using metalness values between 0 and 1",
    subtitle: "Creates an unrealistic, muddy-looking surface",
    wrongCode: `// Half metal? This does not exist in nature
<meshStandardMaterial
  color="#cccccc"
  metalness={0.5}
  roughness={0.3}
/>`,
    rightCode: `// Non-metal (plastic, wood, etc.)
<meshStandardMaterial metalness={0} roughness={0.3} />

// Metal (chrome, gold, etc.)
<meshStandardMaterial metalness={1} roughness={0.3} />`,
    filename: "metalness.tsx",
    explanation:
      "In the real world, a material is either metallic or non-metallic. There is no in-between. Values like 0.5 create a physically impossible look that appears muddy. If you need a transition (like rust on metal), use a metalness texture where each pixel is either 0 or 1.",
  },
  {
    title: "Metallic surface appears completely black",
    subtitle: "No environment map for the metal to reflect",
    wrongCode: `<meshStandardMaterial
  color="#ffffff"
  metalness={1}
  roughness={0}
/>
// No environment map = nothing to reflect = black`,
    rightCode: `import { Environment } from '@react-three/drei'

<Environment preset="studio" />
<meshStandardMaterial
  color="#ffffff"
  metalness={1}
  roughness={0}
/>
// Now there is something to reflect!`,
    filename: "black-metal.tsx",
    explanation:
      "Metals get their visible color entirely from reflections. Unlike plastic or wood, they have no diffuse scattering. If there is nothing in the environment to reflect, the surface renders as pure black. Always provide an environment map when using metallic materials.",
  },
];

export default function StandardPhysicalPage() {
  return (
    <div className="relative max-w-4xl">
      <div className="absolute -top-10 -left-10 w-72 h-72 bg-gradient-to-br from-teal-500/10 via-emerald-500/10 to-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
      {/* 1. Title + Badge + Intro */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-3">
          <Badge variant="outline">Materials</Badge>
        </div>
        <h1 className="text-3xl font-bold tracking-tight mb-3">
          Standard & Physical Materials
        </h1>
        <p className="text-lg text-muted-foreground">
          These are the materials that make your 3D objects look like real-world
          surfaces. With just two sliders — roughness and metalness — you can
          recreate everything from rubber tires to polished chrome.
        </p>
      </div>

      {/* 2. What Could Go Wrong */}
      <WhatCouldGoWrong
        scenario="You create a beautiful gold sphere with metalness set to 1 and roughness to 0. But when you run the scene, it is completely black. You change the color to bright yellow — still black. The problem? There is no environment map, and metals can only show color by reflecting their surroundings."
        error="Metallic PBR mesh renders as solid black despite having a color set."
        errorType="Black Metal"
      />

      <Separator className="my-8" />

      {/* 3. Story Analogy */}
      <ScrollReveal>
        <ConversationalCallout type="story">
          <p>
            Imagine you are standing in a hardware store, running your fingers
            across different surfaces.
          </p>
          <p>
            <strong>Roughness</strong> is the difference between sandpaper and
            a mirror. Sandpaper scatters light in every direction (roughness =
            1), so it looks flat and matte. A mirror reflects light perfectly
            in one direction (roughness = 0), so you see sharp reflections.
          </p>
          <p>
            <strong>Metalness</strong> is the difference between a wooden plank
            and a chrome faucet. Wood absorbs light and shows its own color
            (metalness = 0). Chrome has no color of its own — it only shows you
            a reflected image of the world around it (metalness = 1).
          </p>
          <p>
            With just these two numbers, you can describe almost any surface in
            the real world. That is the power of physically-based rendering.
          </p>
        </ConversationalCallout>
      </ScrollReveal>

      <Separator className="my-8" />

      {/* 4. SimpleFlow */}
      <ScrollReveal>
        <section className="space-y-4">
          <h2 className="text-2xl font-bold">The PBR Decision Flow</h2>
          <p className="text-muted-foreground leading-relaxed">
            Choosing the right material is simpler than it looks. Follow this
            flow to pick between Standard and Physical.
          </p>
          <SimpleFlow
            steps={[
              {
                label: "Realistic surface?",
                detail: "Do you need PBR lighting?",
              },
              {
                label: "Standard Material",
                detail: "Roughness + metalness covers 90% of surfaces",
                status: "success",
              },
              {
                label: "Special effect?",
                detail: "Glass, car paint, fabric, soap bubbles?",
              },
              {
                label: "Physical Material",
                detail: "Clearcoat, transmission, sheen, iridescence",
                status: "success",
              },
            ]}
          />
        </section>
      </ScrollReveal>

      <Separator className="my-8" />

      {/* 5. Interactive Demo */}
      <PBRDemoComponent />

      <Separator className="my-8" />

      {/* 6. Guided Walkthrough */}
      <ScrollReveal>
        <section className="space-y-6">
          <h2 className="text-2xl font-bold">Guided Walkthrough</h2>
          <p className="text-muted-foreground leading-relaxed">
            Let us create three very different surfaces using just roughness and
            metalness.
          </p>

          {/* Step 1 */}
          <div className="bg-card border rounded-lg p-4 space-y-3">
            <h3 className="font-semibold text-sm">
              Step 1 — Smooth plastic (like a toy)
            </h3>
            <CodeBlock
              code={`<mesh>
  <sphereGeometry args={[1, 64, 64]} />
  <meshStandardMaterial
    color="#4488ff"
    roughness={0.3}
    metalness={0}
  />
</mesh>`}
              filename="step-1-plastic.tsx"
            />
            <p className="text-sm text-muted-foreground">
              Metalness is 0 because plastic is not a metal. Roughness is low so
              you get a slight sheen, like a shiny toy. The blue color comes
              from the material itself, not reflections.
            </p>
          </div>

          {/* Step 2 */}
          <div className="bg-card border rounded-lg p-4 space-y-3">
            <h3 className="font-semibold text-sm">
              Step 2 — Brushed steel (like a kitchen appliance)
            </h3>
            <CodeBlock
              code={`<mesh>
  <sphereGeometry args={[1, 64, 64]} />
  <meshStandardMaterial
    color="#cccccc"
    roughness={0.4}
    metalness={1}
  />
</mesh>`}
              filename="step-2-steel.tsx"
            />
            <p className="text-sm text-muted-foreground">
              Metalness is 1 because steel is a metal. Roughness is 0.4 for that
              brushed look — you can see blurry reflections but not sharp ones.
              The color is light grey, which gives it a steel tone.
            </p>
          </div>

          {/* Step 3 */}
          <div className="bg-card border rounded-lg p-4 space-y-3">
            <h3 className="font-semibold text-sm">
              Step 3 — Glass with transmission (Physical Material)
            </h3>
            <CodeBlock
              code={`<mesh>
  <sphereGeometry args={[1, 64, 64]} />
  <meshPhysicalMaterial
    color="#ffffff"
    roughness={0}
    transmission={1}
    thickness={0.5}
    ior={1.5}
  />
</mesh>`}
              filename="step-3-glass.tsx"
            />
            <p className="text-sm text-muted-foreground">
              This is where Physical Material shines. Transmission lets light
              pass through the object (like glass). The ior (index of
              refraction) controls how much things behind it distort — 1.5 is
              standard glass.
            </p>
          </div>
          <BeforeAfterCode
            beforeCode={`<mesh>\n  <sphereGeometry args={[1, 64, 64]} />\n  <meshStandardMaterial\n    color="#cccccc"\n    metalness={1}\n    roughness={0}\n  />\n</mesh>\n{/* No environment map — nothing to reflect */}`}
            afterCode={`<Environment preset="studio" />\n<mesh>\n  <sphereGeometry args={[1, 64, 64]} />\n  <meshStandardMaterial\n    color="#cccccc"\n    metalness={1}\n    roughness={0}\n  />\n</mesh>`}
            beforeLabel="Without Environment Map"
            afterLabel="With Environment Map"
            filename="EnvMapComparison.tsx"
            description={{
              before: "Without an environment map, metallic surfaces are pure black — there's nothing to reflect.",
              after: "With an environment map, the chrome surface comes alive with realistic reflections.",
            }}
          />
        </section>
      </ScrollReveal>

      <Separator className="my-8" />

      {/* 7. What You Just Learned */}
      <ScrollReveal>
        <WhatYouJustLearned
          points={[
            "Roughness controls how sharp or blurry reflections are (0 = mirror, 1 = sandpaper)",
            "Metalness should be 0 (non-metal) or 1 (metal) — never in between",
            "MeshStandardMaterial handles 90% of real-world surfaces",
            "MeshPhysicalMaterial adds glass, car paint, fabric, and iridescence on top of Standard",
          ]}
        />
      </ScrollReveal>

      <Separator className="my-8" />

      {/* 8. Thought-Provoking Question */}
      <ScrollReveal>
        <ConversationalCallout type="question">
          <p>
            If metalness should only ever be 0 or 1, how would you represent
            a rusty metal surface where some spots are bare metal and other
            spots are covered in rust (which is non-metallic)? Think about
            what kind of texture map you might need.
          </p>
        </ConversationalCallout>
      </ScrollReveal>

      <Separator className="my-8" />

      {/* 9. Aha Moment */}
      <ScrollReveal>
        <AhaMoment
          setup="Why do metals look so different from plastics, even when they have the same roughness value?"
          reveal="Metals have no diffuse reflection at all. 100% of their visible color comes from reflecting the environment around them. That is why a chrome ball in an empty white room looks completely different from the same chrome ball outdoors — it is literally showing you a mirror image of its surroundings. Plastic, on the other hand, has its own color from diffuse scattering, so it looks roughly the same no matter where you put it."
        />
      </ScrollReveal>

      <Separator className="my-8" />

      {/* 10. Mental Model Challenge */}
      <ScrollReveal>
        <MentalModelChallenge
          question="You have a MeshStandardMaterial sphere with metalness=1, roughness=0, and no environment map or lights in the scene. What color will it be?"
          options={[
            {
              label: "The color you set on the material",
              correct: false,
              explanation:
                "Metals do not use their color property for diffuse shading — they only reflect the environment.",
            },
            {
              label: "White, because roughness is 0",
              correct: false,
              explanation:
                "Roughness controls reflection sharpness, not brightness. Without something to reflect, it is still black.",
            },
            {
              label: "Completely black",
              correct: true,
              explanation:
                "Metals can only show reflections. No environment map means nothing to reflect, which means pure black.",
            },
            {
              label: "A gradient from dark to light",
              correct: false,
              explanation:
                "Without any light source or environment, there is nothing to create a gradient from.",
            },
          ]}
          answer="The sphere will be completely black. Metallic surfaces derive 100% of their visible color from reflections. With no environment map and no lights, there is literally nothing for the surface to reflect, resulting in pure black output. This is the most common PBR gotcha for beginners."
        />
      </ScrollReveal>

      <Separator className="my-8" />

      {/* Try This Challenges */}
      <ScrollReveal>
        <TryThisList challenges={[
          {
            challenge: "Set roughness to 0 on all spheres — what do you see?",
            hint: "Roughness 0 means a perfectly smooth, mirror-like surface.",
            solution: "All spheres become mirror-smooth and show sharp reflections of the environment. Non-metals show a subtle specular highlight, while metals become perfect mirrors reflecting everything around them.",
            difficulty: "beginner",
          },
          {
            challenge: "Set metalness to 0.5 — is it realistic?",
            hint: "Think about real materials. Is anything halfway between metal and plastic?",
            solution: "It looks muddy and unrealistic. In nature, materials are either metallic (1) or non-metallic (0). A value of 0.5 creates a physically impossible material that looks unconvincing.",
            difficulty: "intermediate",
          },
          {
            challenge: "Switch envPreset to 'sunset' vs 'warehouse'",
            hint: "Different environment presets provide different lighting colors and reflection content.",
            solution: "The sunset preset gives warm orange-tinted reflections and lighting, while warehouse provides cool, industrial reflections. The same material looks completely different because metals reflect their surroundings.",
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
                  Always provide an environment map
                </h3>
              </div>
              <p className="text-sm text-muted-foreground">
                PBR materials need something to reflect. Even a simple neutral
                studio HDR makes Standard and Physical materials look
                dramatically better than bare lights alone.
              </p>
            </div>
            <div className="rounded-lg border bg-card p-4 space-y-2">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="size-4 text-green-500" />
                <h3 className="font-semibold text-sm">
                  Keep metalness at 0 or 1
                </h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Real materials are either metal or non-metal. Use a metalness
                texture map for transitions (like rust on iron) where each pixel
                is 0 or 1.
              </p>
            </div>
            <div className="rounded-lg border bg-card p-4 space-y-2">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="size-4 text-green-500" />
                <h3 className="font-semibold text-sm">
                  Use Standard before Physical
                </h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Only upgrade to MeshPhysicalMaterial when you need clearcoat,
                transmission, sheen, or iridescence. Standard covers the vast
                majority of surfaces at a lower GPU cost.
              </p>
            </div>
            <div className="rounded-lg border bg-card p-4 space-y-2">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="size-4 text-green-500" />
                <h3 className="font-semibold text-sm">
                  Reference real-world values
                </h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Search for PBR material reference charts online. Real-world
                roughness and color values for wood, metal, fabric, and more
                will help you create convincing surfaces faster.
              </p>
            </div>
          </div>
        </section>
      </ScrollReveal>
    </div>
  );
}
