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

const LightsShowcaseDemo = dynamic(
  () =>
    import("./_components/lights-showcase").then((m) => ({
      default: m.LightsShowcase,
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
    title: "Removing lights instead of hiding them",
    subtitle: "Causes expensive shader recompilation every toggle",
    wrongCode: `// Toggle by adding/removing from scene
function toggleLight() {
  if (light.parent) {
    scene.remove(light);
  } else {
    scene.add(light);
  }
}
// Every add/remove recompiles all affected shaders!`,
    rightCode: `// Toggle with visibility or intensity instead
function toggleLight() {
  light.visible = !light.visible;
  // or: light.intensity = light.intensity > 0 ? 0 : 1;
}
// Shader stays compiled — just a uniform update`,
    filename: "toggle-light.tsx",
    explanation:
      "Adding or removing a light changes the shader code for every affected material. Setting light.visible or intensity to 0 keeps the shader intact and just updates a number, which is orders of magnitude cheaper.",
  },
  {
    title: "Too many lights tanking performance",
    subtitle: "Each light adds per-pixel shader calculations",
    wrongCode: `// 20 point lights for atmosphere
for (let i = 0; i < 20; i++) {
  const light = new THREE.PointLight(0xff8844, 1, 10);
  light.position.set(Math.random() * 20, 2, Math.random() * 20);
  scene.add(light);
}
// 20 extra lighting passes per pixel — performance tanks`,
    rightCode: `// Use an environment map for fill + 2-3 key lights
<Environment preset="studio" />
<directionalLight position={[5, 10, 5]} intensity={1.5} />
<hemisphereLight args={["#87ceeb", "#362907", 0.4]} />
// Environment map provides ambient fill cheaply`,
    filename: "too-many-lights.tsx",
    explanation:
      "Each direct light adds per-pixel calculations in the shader. The cost scales linearly: 20 lights means 20 times the lighting work. For scenes that need many light sources, use baked lightmaps or a single environment map for ambient fill.",
  },
  {
    title: "RectAreaLight has no effect on the mesh",
    subtitle: "Using it with a non-PBR material",
    wrongCode: `// RectAreaLight with Lambert — light is ignored
<rectAreaLight args={[0xffffff, 5, 4, 4]} />
<mesh>
  <boxGeometry />
  <meshLambertMaterial color="#4488ff" />
</mesh>`,
    rightCode: `// RectAreaLight ONLY works with Standard or Physical
<rectAreaLight args={[0xffffff, 5, 4, 4]} />
<mesh>
  <boxGeometry />
  <meshStandardMaterial color="#4488ff" />
</mesh>`,
    filename: "rect-area-material.tsx",
    explanation:
      "RectAreaLight only works with MeshStandardMaterial and MeshPhysicalMaterial. It requires the PBR shader pipeline. If your rect light has no visible effect, check that all affected meshes use a PBR material.",
  },
];

export default function LightTypesPage() {
  return (
    <div className="relative max-w-4xl">
      <div className="absolute -top-10 -left-10 w-72 h-72 bg-gradient-to-br from-teal-500/10 via-emerald-500/10 to-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
      {/* 1. Title + Badge + Intro */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-3">
          <Badge variant="outline">Lights</Badge>
        </div>
        <h1 className="text-3xl font-bold tracking-tight mb-3">Light Types</h1>
        <p className="text-lg text-muted-foreground">
          Lights are what bring your 3D scene to life. Without them, most
          materials show up as solid black. Three.js gives you several light
          types, each mimicking a different real-world lighting situation.
        </p>
      </div>

      {/* 2. What Could Go Wrong */}
      <WhatCouldGoWrong
        scenario="You build a beautiful scene with detailed materials and textures, but everything renders pitch black. You check your meshes, your camera, your materials — everything looks right. The problem? You forgot to add lights. Most materials (Lambert, Phong, Standard, Physical) need at least one light source to be visible."
        error="Scene renders but all meshes appear completely black."
        errorType="No Lights"
      />

      <Separator className="my-8" />

      {/* 3. Story Analogy */}
      <ScrollReveal>
        <ConversationalCallout type="story">
          <p>
            Think about the different lights in your home. Each one behaves
            differently, and Three.js has a match for each.
          </p>
          <p>
            <strong>Ambient light</strong> is like daylight filling a room
            through windows — it is everywhere at once, comes from no
            particular direction, and casts no shadows. Everything gets the
            same amount.
          </p>
          <p>
            <strong>Directional light</strong> is the sun — the rays are
            parallel because the source is so far away. Everything in your
            scene gets light from the same angle, no matter where it is.
          </p>
          <p>
            <strong>Point light</strong> is a bare light bulb hanging from the
            ceiling — it radiates in all directions from a single point, and
            objects closer to it are brighter.
          </p>
          <p>
            <strong>Spot light</strong> is a flashlight or a stage spotlight —
            it creates a cone of light pointing in one direction. Things
            outside the cone stay dark.
          </p>
        </ConversationalCallout>
      </ScrollReveal>

      <Separator className="my-8" />

      {/* 4. SimpleFlow */}
      <ScrollReveal>
        <section className="space-y-4">
          <h2 className="text-2xl font-bold">Picking the Right Light</h2>
          <p className="text-muted-foreground leading-relaxed">
            Each light type has a trade-off between realism and performance.
            Here is a quick guide.
          </p>
          <SimpleFlow
            steps={[
              {
                label: "Base fill",
                detail: "Ambient or Hemisphere (cheapest)",
                status: "success",
              },
              {
                label: "Main light",
                detail: "Directional (sun, key light)",
                status: "success",
              },
              {
                label: "Local accents",
                detail: "Point or Spot (lamps, flashlights)",
              },
              {
                label: "Soft panels",
                detail: "RectArea (PBR only, no shadows)",
              },
            ]}
          />
        </section>
      </ScrollReveal>

      <Separator className="my-8" />

      {/* 5. Interactive Demo */}
      <LightsShowcaseDemo />

      <Separator className="my-8" />

      {/* 6. Guided Walkthrough */}
      <ScrollReveal>
        <section className="space-y-6">
          <h2 className="text-2xl font-bold">Guided Walkthrough</h2>
          <p className="text-muted-foreground leading-relaxed">
            Let us light a scene step by step, from total darkness to a
            believable setup.
          </p>

          {/* Step 1 */}
          <div className="bg-card border rounded-lg p-4 space-y-3">
            <h3 className="font-semibold text-sm">
              Step 1 — Prevent total darkness with ambient fill
            </h3>
            <CodeBlock
              code={`{/* Soft fill so nothing is pure black */}
<ambientLight intensity={0.3} color="#ffffff" />`}
              filename="step-1-ambient.tsx"
            />
            <p className="text-sm text-muted-foreground">
              Ambient light adds a flat amount of brightness to everything. Keep
              the intensity low (0.1 to 0.4) or your scene will look washed
              out — like a foggy day with no contrast.
            </p>
          </div>

          {/* Step 2 */}
          <div className="bg-card border rounded-lg p-4 space-y-3">
            <h3 className="font-semibold text-sm">
              Step 2 — Add a main directional light (the sun)
            </h3>
            <CodeBlock
              code={`{/* The "sun" — parallel rays from one direction */}
<directionalLight
  position={[5, 10, 5]}
  intensity={1.5}
  castShadow
/>`}
              filename="step-2-directional.tsx"
            />
            <p className="text-sm text-muted-foreground">
              This is your main light source. The position controls which
              direction the rays come from. Setting castShadow to true lets it
              create shadows (we will set those up in the shadows lesson).
            </p>
          </div>

          {/* Step 3 */}
          <div className="bg-card border rounded-lg p-4 space-y-3">
            <h3 className="font-semibold text-sm">
              Step 3 — Add a warm point light for local atmosphere
            </h3>
            <CodeBlock
              code={`{/* A warm bulb near a table or lamp */}
<pointLight
  position={[2, 3, 1]}
  intensity={8}
  color="#ff8844"
  distance={20}
  decay={2}
/>`}
              filename="step-3-pointlight.tsx"
            />
            <p className="text-sm text-muted-foreground">
              Point lights radiate in all directions from a single spot. The
              warm orange color and decay of 2 (physically correct falloff) make
              this feel like a real lamp. Objects farther away get less light.
            </p>
          </div>
          <BeforeAfterCode
            beforeCode={`<Canvas>\n  <mesh>\n    <boxGeometry />\n    <meshStandardMaterial color="orange" />\n  </mesh>\n  {/* No lights — everything is black */}\n</Canvas>`}
            afterCode={`<Canvas>\n  <ambientLight intensity={0.3} />\n  <directionalLight position={[5, 10, 5]} />\n  <pointLight position={[2, 3, 1]} color="#ff8844" />\n  <mesh>\n    <boxGeometry />\n    <meshStandardMaterial color="orange" />\n  </mesh>\n</Canvas>`}
            beforeLabel="No Lights"
            afterLabel="Combined Lighting"
            filename="LightingSetup.tsx"
            description={{
              before: "Without any lights, PBR materials render as pure black — the objects exist but you can't see them.",
              after: "Ambient fill + directional sun + warm point light creates a natural, three-dimensional look.",
            }}
          />
        </section>
      </ScrollReveal>

      <Separator className="my-8" />

      {/* 7. What You Just Learned */}
      <ScrollReveal>
        <WhatYouJustLearned
          points={[
            "Ambient light fills the whole scene evenly — cheap but flat, no shadows",
            "Directional light shoots parallel rays like the sun — great as a main light with shadows",
            "Point light radiates in all directions from one spot — like a light bulb, with distance falloff",
            "Spot light casts a cone of light — like a flashlight, with angle and penumbra controls",
          ]}
        />
      </ScrollReveal>

      <Separator className="my-8" />

      {/* 8. Thought-Provoking Question */}
      <ScrollReveal>
        <ConversationalCallout type="question">
          <p>
            A scene has only an AmbientLight. No matter how you position or
            rotate the objects, the shading never changes. Why? And what does
            that tell you about when ambient light alone is not enough?
          </p>
        </ConversationalCallout>
      </ScrollReveal>

      <Separator className="my-8" />

      {/* 9. Aha Moment */}
      <ScrollReveal>
        <AhaMoment
          setup="Why are PointLight shadows six times more expensive than DirectionalLight shadows?"
          reveal="A directional light casts shadows from one direction, so it renders one shadow map. A point light radiates in ALL directions, so Three.js renders six shadow maps — one for each face of a cube. That is literally six times the shadow rendering work. This is why you should use point light shadows very sparingly and prefer spot lights when you do not need full omnidirectional coverage."
        />
      </ScrollReveal>

      <Separator className="my-8" />

      {/* 10. Mental Model Challenge */}
      <ScrollReveal>
        <MentalModelChallenge
          question="You want to simulate a desk lamp shining down on a work surface. Which light type is the best fit?"
          options={[
            {
              label: "AmbientLight",
              correct: false,
              explanation:
                "Ambient has no direction and no cone. It would light the entire room equally.",
            },
            {
              label: "DirectionalLight",
              correct: false,
              explanation:
                "Directional has parallel rays like the sun. A desk lamp is a local light with a cone shape.",
            },
            {
              label: "PointLight",
              correct: false,
              explanation:
                "Point radiates in all directions. A desk lamp points downward in a focused cone.",
            },
            {
              label: "SpotLight",
              correct: true,
              explanation:
                "A desk lamp produces a cone of light pointing in one direction — exactly what SpotLight does.",
            },
          ]}
          answer="SpotLight is the perfect match. A desk lamp produces a focused cone of light pointing downward. You can control the cone angle, the softness of the edge (penumbra), and even aim it at a specific target. No other light type gives you that cone-shaped beam."
        />
      </ScrollReveal>

      <Separator className="my-8" />

      {/* Try This Challenges */}
      <ScrollReveal>
        <TryThisList challenges={[
          {
            challenge: "Turn off all lights — complete darkness?",
            hint: "Think about which materials need light and which don't.",
            solution: "Yes, with all lights off, any mesh using MeshStandardMaterial or MeshPhongMaterial turns completely black. Only MeshBasicMaterial objects would still be visible because they ignore lighting entirely.",
            difficulty: "beginner",
          },
          {
            challenge: "Enable only Point — watch it orbit",
            hint: "A point light radiates in all directions from one position. Moving its position creates dynamic lighting shifts.",
            solution: "With only a point light, objects closer to it are brighter while distant ones fall off. As the light orbits, you see highlights sweep across surfaces and shadows shift — much more dramatic than static directional light.",
            difficulty: "beginner",
          },
          {
            challenge: "Crank spotAngle to max",
            hint: "The spot light angle controls how wide the cone of light is. What happens when it approaches Math.PI/2?",
            solution: "At maximum angle (close to Math.PI/2 or 90 degrees), the spot light's cone becomes so wide it lights up nearly everything, behaving almost like a point light. The focused spotlight effect disappears.",
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
                  Limit to 1-3 direct lights
                </h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Each direct light adds per-pixel shader work. Supplement with an
                environment map or hemisphere light for ambient fill instead of
                adding more direct lights.
              </p>
            </div>
            <div className="rounded-lg border bg-card p-4 space-y-2">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="size-4 text-green-500" />
                <h3 className="font-semibold text-sm">
                  Use helpers while developing
                </h3>
              </div>
              <p className="text-sm text-muted-foreground">
                DirectionalLightHelper, SpotLightHelper, and PointLightHelper
                visualize light position and direction. They make aiming lights
                much easier. Remove them before shipping.
              </p>
            </div>
            <div className="rounded-lg border bg-card p-4 space-y-2">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="size-4 text-green-500" />
                <h3 className="font-semibold text-sm">
                  Toggle with visible, not add/remove
                </h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Setting light.visible to false avoids shader recompilation.
                Only add or remove lights when you are permanently changing the
                scene layout.
              </p>
            </div>
            <div className="rounded-lg border bg-card p-4 space-y-2">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="size-4 text-green-500" />
                <h3 className="font-semibold text-sm">
                  Hemisphere + Directional for outdoors
                </h3>
              </div>
              <p className="text-sm text-muted-foreground">
                For quick outdoor scenes, combine a HemisphereLight (sky and
                ground fill) with one DirectionalLight (the sun). This classic
                combo looks convincing with minimal performance cost.
              </p>
            </div>
          </div>
        </section>
      </ScrollReveal>
    </div>
  );
}
