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

const MaterialComparisonDemo = dynamic(
  () =>
    import("./_components/material-comparison").then((m) => ({
      default: m.MaterialComparison,
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
    title: "Using MeshStandardMaterial just to see a shape",
    subtitle: "The mesh appears black because there are no lights",
    wrongCode: `// You just want to see a red cube for debugging
<mesh>
  <boxGeometry />
  <meshStandardMaterial color="red" />
</mesh>
// No lights in scene = completely black cube`,
    rightCode: `// Use MeshBasicMaterial — it ignores lights entirely
<mesh>
  <boxGeometry />
  <meshBasicMaterial color="red" />
</mesh>
// Always visible, no lights needed`,
    filename: "debug-material.tsx",
    explanation:
      "MeshStandardMaterial needs lights to be visible. When you just want to see a shape on screen, MeshBasicMaterial is the right choice because it shows the exact color you set, regardless of whether lights exist in the scene.",
  },
  {
    title: "Forgetting needsUpdate when swapping textures",
    subtitle: "Material stays blank after changing its texture at runtime",
    wrongCode: `// Swap texture at runtime
material.map = newTexture;
// Nothing changes — the shader is still compiled
// for the old configuration`,
    rightCode: `// Swap texture and tell Three.js to recompile
material.map = newTexture;
material.needsUpdate = true;
// Now the shader rebuilds to include the new texture`,
    filename: "needs-update.tsx",
    explanation:
      "When you add or remove a texture from a material, the underlying shader needs to be recompiled. Setting material.needsUpdate = true triggers that recompilation. You only need this when the structure changes (adding/removing maps), not for simple color changes.",
  },
];

export default function BasicMaterialsPage() {
  return (
    <div className="max-w-4xl ambient-materials">
      {/* 1. Title + Badge + Intro */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-3">
          <Badge variant="outline">Materials</Badge>
        </div>
        <h1 className="text-3xl font-bold tracking-tight mb-3">
          Basic Materials
        </h1>
        <p className="text-lg text-muted-foreground">
          Think of materials as the "skin" of your 3D objects. Basic materials
          are the simplest ones Three.js offers — they are fast, predictable,
          and some of them do not need lights at all to show up on screen.
        </p>
      </div>

      {/* 2. What Could Go Wrong */}
      <WhatCouldGoWrong
        scenario="You add a beautiful mesh to your scene with MeshStandardMaterial, but it shows up completely black. You try changing the color — still black. You spend 20 minutes debugging before realizing there are no lights in your scene. If you had used MeshBasicMaterial, the color would have shown up immediately."
        error="Mesh renders but appears completely black despite having a color set."
        errorType="Black Mesh"
      />

      <Separator className="my-8" />

      {/* 3. Story Analogy */}
      <ScrollReveal>
        <ConversationalCallout type="story">
          <p>
            Imagine you are standing in a paint store with four types of paint
            in front of you.
          </p>
          <p>
            <strong>Basic</strong> is like spray paint — flat, solid color, no
            light interaction at all. What you spray is what you see.
          </p>
          <p>
            <strong>Normal</strong> is like a mood ring — it changes color based
            on the angle you look at it, showing you which direction each part
            of the surface faces.
          </p>
          <p>
            <strong>Lambert</strong> is like chalk paint — matte and soft, it
            reacts to light but never looks shiny.
          </p>
          <p>
            <strong>Phong</strong> is like nail polish — it has that glossy,
            reflective highlight that shifts as you move around it.
          </p>
        </ConversationalCallout>
      </ScrollReveal>

      <Separator className="my-8" />

      {/* 4. SimpleFlow — Visual Mental Model */}
      <ScrollReveal>
        <section className="space-y-4">
          <h2 className="text-2xl font-bold">Which Material Should I Pick?</h2>
          <p className="text-muted-foreground leading-relaxed">
            Here is a quick decision flow. Start at the left and follow the
            arrows.
          </p>
          <SimpleFlow
            steps={[
              {
                label: "Need lights?",
                detail: "Does your object need to react to scene lighting?",
              },
              {
                label: "No lights needed",
                detail: "Basic or Normal",
                status: "success",
              },
              {
                label: "Matte surface?",
                detail: "Lambert (cheap, soft)",
                status: "success",
              },
              {
                label: "Shiny surface?",
                detail: "Phong (specular highlight)",
                status: "success",
              },
            ]}
          />
        </section>
      </ScrollReveal>

      <Separator className="my-8" />

      {/* 5. Interactive Demo */}
      <MaterialComparisonDemo />

      <Separator className="my-8" />

      {/* 6. Guided Walkthrough */}
      <ScrollReveal>
        <section className="space-y-6">
          <h2 className="text-2xl font-bold">Guided Walkthrough</h2>
          <p className="text-muted-foreground leading-relaxed">
            Let us build up from the simplest material to a shiny one, step by
            step.
          </p>

          {/* Step 1 */}
          <div className="bg-card border rounded-lg p-4 space-y-3">
            <h3 className="font-semibold text-sm">
              Step 1 — A flat-colored sphere (no lights needed)
            </h3>
            <CodeBlock
              code={`<mesh>
  <sphereGeometry args={[1, 32, 32]} />
  <meshBasicMaterial color="#4488ff" />
</mesh>`}
              filename="step-1-basic.tsx"
            />
            <p className="text-sm text-muted-foreground">
              This creates a blue sphere that shows up instantly. No lights, no
              setup — just color. Think of it like spray painting a ball.
            </p>
          </div>

          {/* Step 2 */}
          <div className="bg-card border rounded-lg p-4 space-y-3">
            <h3 className="font-semibold text-sm">
              Step 2 — A matte surface that reacts to light
            </h3>
            <CodeBlock
              code={`<ambientLight intensity={0.3} />
<directionalLight position={[5, 5, 5]} />
<mesh>
  <sphereGeometry args={[1, 32, 32]} />
  <meshLambertMaterial color="#44ccaa" />
</mesh>`}
              filename="step-2-lambert.tsx"
            />
            <p className="text-sm text-muted-foreground">
              Now we added lights and switched to Lambert. The sphere looks soft
              and matte, like a chalk-painted ball. The side facing the light is
              brighter, giving it a 3D feel.
            </p>
          </div>

          {/* Step 3 */}
          <div className="bg-card border rounded-lg p-4 space-y-3">
            <h3 className="font-semibold text-sm">
              Step 3 — Adding a shiny highlight
            </h3>
            <CodeBlock
              code={`<mesh>
  <sphereGeometry args={[1, 32, 32]} />
  <meshPhongMaterial
    color="#88ff44"
    specular="#ffffff"
    shininess={200}
  />
</mesh>`}
              filename="step-3-phong.tsx"
            />
            <p className="text-sm text-muted-foreground">
              Phong adds a bright spot where the light hits — like a glossy nail
              polish reflection. The shininess value controls how tight that
              highlight is. Higher numbers mean a smaller, sharper spot.
            </p>
          </div>
          <BeforeAfterCode
            beforeCode={`<mesh>\n  <sphereGeometry args={[1, 32, 32]} />\n  <meshBasicMaterial color="#4488ff" />\n</mesh>\n{/* No lights needed — always visible */}`}
            afterCode={`<ambientLight intensity={0.3} />\n<directionalLight position={[5, 5, 5]} />\n<mesh>\n  <sphereGeometry args={[1, 32, 32]} />\n  <meshStandardMaterial color="#4488ff" />\n</mesh>`}
            beforeLabel="Basic (No Light Needed)"
            afterLabel="Standard (Needs Light)"
            filename="MaterialComparison.tsx"
            description={{
              before: "MeshBasicMaterial shows flat color with no shading — always visible, even without lights.",
              after: "MeshStandardMaterial reacts to lights with realistic shading, depth, and highlights.",
            }}
          />
        </section>
      </ScrollReveal>

      <Separator className="my-8" />

      {/* 7. What You Just Learned */}
      <ScrollReveal>
        <WhatYouJustLearned
          points={[
            "MeshBasicMaterial ignores all lights — what you set is what you see",
            "MeshNormalMaterial maps surface angles to colors, perfect for debugging geometry",
            "MeshLambertMaterial gives you a cheap matte look but needs lights in the scene",
            "MeshPhongMaterial adds a specular highlight for shiny, glossy surfaces",
          ]}
        />
      </ScrollReveal>

      <Separator className="my-8" />

      {/* 8. Thought-Provoking Question */}
      <ScrollReveal>
        <ConversationalCallout type="question">
          <p>
            If MeshBasicMaterial does not respond to lights, why would you ever
            use it in a serious project? Hint: think about UI elements floating
            in 3D space, always-visible markers, or a skybox that should not get
            darker when the sun sets.
          </p>
        </ConversationalCallout>
      </ScrollReveal>

      <Separator className="my-8" />

      {/* 9. Aha Moment */}
      <ScrollReveal>
        <AhaMoment
          setup="Why does MeshNormalMaterial change colors when you rotate the camera around the object?"
          reveal="Normal colors are relative to the camera view, not the world. The color tells you which direction a face is pointing compared to where YOU are looking from. That is why it is so useful for debugging — if a face looks the wrong color, the normals in your geometry data are broken."
        />
      </ScrollReveal>

      <Separator className="my-8" />

      {/* 10. Mental Model Challenge */}
      <ScrollReveal>
        <MentalModelChallenge
          question="You have a scene with no lights at all. Which materials will still show their color on screen?"
          options={[
            {
              label: "Only MeshBasicMaterial",
              correct: false,
              explanation:
                "Close, but MeshNormalMaterial also works without lights.",
            },
            {
              label: "MeshBasicMaterial and MeshNormalMaterial",
              correct: true,
              explanation:
                "Both are unlit materials. Basic shows flat color, Normal shows surface angles as colors.",
            },
            {
              label: "All four basic materials",
              correct: false,
              explanation:
                "Lambert and Phong need lights — without them, they render black.",
            },
            {
              label: "None of them — you always need lights",
              correct: false,
              explanation:
                "Basic and Normal are specifically designed to work without any lights at all.",
            },
          ]}
          answer="MeshBasicMaterial and MeshNormalMaterial are both unlit. They calculate their output color without any light information, so they always show up on screen. Lambert and Phong, on the other hand, multiply the surface color by the incoming light — and zero light means zero color (black)."
        />
      </ScrollReveal>

      <Separator className="my-8" />

      {/* Try This Challenges */}
      <ScrollReveal>
        <TryThisList challenges={[
          {
            challenge: "Set lightIntensity to 0 — which spheres are still visible?",
            hint: "Think about which materials need lights to show their color and which don't.",
            solution: "Only MeshBasicMaterial and MeshNormalMaterial remain visible. They are unlit materials that calculate color without any light. Lambert and Phong turn completely black.",
            difficulty: "beginner",
          },
          {
            challenge: "Toggle wireframe on all materials",
            hint: "Add wireframe={true} to each material's props.",
            solution: "All four materials show the triangle grid. Wireframe mode bypasses the normal shading pipeline and just draws edges, so even unlit materials look similar in wireframe mode.",
            difficulty: "beginner",
          },
          {
            challenge: "Move the light behind the objects",
            hint: "Change the directional light position to a negative Z value, like [0, 0, -5].",
            solution: "Lambert and Phong spheres become dark on the front since light now hits the back. Basic and Normal are unaffected — Basic ignores light entirely, and Normal colors depend on view angle, not light direction.",
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
                  Use Basic for debug visuals
                </h3>
              </div>
              <p className="text-sm text-muted-foreground">
                When you just need to see a shape, wireframe, or bounding box,
                reach for MeshBasicMaterial. It works without lights and is the
                cheapest material to render.
              </p>
            </div>
            <div className="rounded-lg border bg-card p-4 space-y-2">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="size-4 text-green-500" />
                <h3 className="font-semibold text-sm">
                  Prefer Lambert over Phong for matte
                </h3>
              </div>
              <p className="text-sm text-muted-foreground">
                If a surface has no visible shiny spot, Lambert is faster than
                Phong. It skips the specular calculation entirely, saving GPU
                work on every pixel.
              </p>
            </div>
            <div className="rounded-lg border bg-card p-4 space-y-2">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="size-4 text-green-500" />
                <h3 className="font-semibold text-sm">
                  Normal material for geometry checks
                </h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Swap in MeshNormalMaterial to instantly check if your geometry
                normals look correct. Unexpected colors mean the normals are
                flipped or missing.
              </p>
            </div>
            <div className="rounded-lg border bg-card p-4 space-y-2">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="size-4 text-green-500" />
                <h3 className="font-semibold text-sm">
                  Dispose materials you no longer need
                </h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Call material.dispose() when a material is no longer used. This
                frees the GPU shader program and prevents memory leaks in
                long-running apps.
              </p>
            </div>
          </div>
        </section>
      </ScrollReveal>
    </div>
  );
}
