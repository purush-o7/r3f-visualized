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

const SpritesDemoComponent = dynamic(
  () =>
    import("./_components/sprites-demo").then((m) => ({
      default: m.SpritesDemo,
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
    title: "Sprite appears as a white square instead of a texture",
    subtitle: "Forgot to load or set the texture map",
    wrongCode: `// No map set — renders as a solid white square
<sprite scale={[2, 2, 1]}>
  <spriteMaterial color="#ffffff" />
</sprite>`,
    rightCode: `import { useTexture } from "@react-three/drei";

function MySprite() {
  const texture = useTexture("/spark.png");
  return (
    <sprite scale={[2, 2, 1]}>
      <spriteMaterial
        map={texture}
        transparent
        depthWrite={false}
      />
    </sprite>
  );
}`,
    filename: "TexturedSprite.tsx",
    explanation:
      "Without a map property, SpriteMaterial renders a flat solid color. Load your texture with useTexture and pass it as the map prop. Set transparent={true} if the image has alpha.",
  },
  {
    title: "Billboard text renders behind 3D objects",
    subtitle: "Z-fighting or wrong render order",
    wrongCode: `// Label hides behind the mesh it labels
<mesh position={[0, 0, 0]}>
  <sphereGeometry />
  <meshStandardMaterial />
</mesh>
<Billboard position={[0, 1.5, 0]}>
  <Text>Label</Text>
</Billboard>`,
    rightCode: `// Use renderOrder and depthTest to fix
<mesh position={[0, 0, 0]}>
  <sphereGeometry />
  <meshStandardMaterial />
</mesh>
<Billboard position={[0, 1.5, 0]}>
  <Text
    renderOrder={1}
    material-depthTest={false}
  >
    Label
  </Text>
</Billboard>`,
    filename: "BillboardLabel.tsx",
    explanation:
      "When a billboard overlaps with geometry, the depth buffer can hide it. Setting renderOrder to a higher number and disabling depthTest ensures the label always renders on top.",
  },
  {
    title: "Hundreds of sprites cause performance issues",
    subtitle: "Each sprite is a separate draw call",
    wrongCode: `// 500 individual sprites = 500 draw calls
{Array.from({ length: 500 }).map((_, i) => (
  <sprite key={i} position={[...]}>
    <spriteMaterial map={texture} />
  </sprite>
))}`,
    rightCode: `// Use Points for many simple particles instead
<points>
  <bufferGeometry>
    <bufferAttribute
      attach="attributes-position"
      array={positions}
      count={500}
      itemSize={3}
    />
  </bufferGeometry>
  <pointsMaterial
    map={texture}
    size={0.5}
    transparent
    depthWrite={false}
  />
</points>
// Single draw call for all 500 particles!`,
    filename: "ManySprites.tsx",
    explanation:
      "Each Sprite is a separate draw call. For a few dozen, that is fine. For hundreds, switch to a Points system which renders everything in a single call. Reserve sprites for individual labels and UI elements.",
  },
];

export default function SpritesBillboardsPage() {
  return (
    <div className="relative max-w-4xl">
      <div className="absolute -top-10 -left-10 w-72 h-72 bg-gradient-to-br from-teal-500/10 via-emerald-500/10 to-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
      {/* 1. Title + Badge + Intro */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-3">
          <Badge variant="outline">Particles & Lines</Badge>
        </div>
        <h1 className="text-3xl font-bold tracking-tight mb-3">
          Sprites & Billboards
        </h1>
        <p className="text-lg text-muted-foreground">
          Sprites are flat images that always face the camera — no matter which
          direction you look from. They are the go-to tool for health bars,
          floating labels, lightweight particle effects, and any 2D element
          that needs to live in 3D space without looking weird from the side.
        </p>
      </div>

      {/* 2. What Could Go Wrong */}
      <WhatCouldGoWrong
        scenario="You add a floating health bar above a character using a regular plane mesh. It looks great from the front, but when the camera orbits to the side, the health bar turns into a paper-thin line and disappears. It is a flat surface viewed edge-on."
        error="Health bar label is invisible from most camera angles. Looks like a thin line from the side."
        errorType="Not Billboarded"
      />

      <Separator className="my-8" />

      {/* 3. Story Analogy */}
      <ScrollReveal>
        <ConversationalCallout type="story">
          <p>
            Think of sprites as <strong>pop-up signs</strong> in a museum.
            Wherever you walk in the room, the sign rotates to face you. You
            never see it from the side. You never see its edge. It always
            presents its flat face directly toward your eyes.
          </p>
          <p>
            A regular plane mesh is like a painting on a wall — it stays fixed
            and you can walk around to see its edge. A <strong>
              billboard
            </strong> is like a lazy Susan sign that spins to track you.
          </p>
          <p>
            Three.js gives you two tools for this. The built-in{" "}
            <strong>Sprite</strong> object always faces the camera
            automatically. And drei&apos;s <strong>Billboard</strong> component
            wraps any JSX children so they always face the camera too — even
            complex layouts with text and shapes.
          </p>
        </ConversationalCallout>
      </ScrollReveal>

      <Separator className="my-8" />

      {/* 4. SimpleFlow */}
      <ScrollReveal>
        <section className="space-y-4">
          <h2 className="text-2xl font-bold">Choosing the Right Approach</h2>
          <p className="text-muted-foreground leading-relaxed">
            Sprites and Billboards solve the same problem differently.
          </p>
          <SimpleFlow
            steps={[
              {
                label: "Sprite",
                detail: "Built-in Three.js — single textured quad",
              },
              {
                label: "SpriteMaterial",
                detail: "Texture map, color, opacity, blending",
              },
              {
                label: "Billboard",
                detail: "drei wrapper — any JSX children face camera",
                status: "success",
              },
              {
                label: "HTML Overlay",
                detail: "Alternative: CSS-based, always on top",
                status: "success",
              },
            ]}
            accentColor="amber"
          />
        </section>
      </ScrollReveal>

      <Separator className="my-8" />

      {/* 5. Interactive Demo */}
      <SpritesDemoComponent />

      <Separator className="my-8" />

      {/* 6. Guided Walkthrough */}
      <ScrollReveal>
        <section className="space-y-6">
          <h2 className="text-2xl font-bold">
            Building Billboarded Labels Step by Step
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            Let us add floating labels above game objects that always face
            the camera.
          </p>

          <div className="bg-card border rounded-lg p-4 space-y-3">
            <h3 className="font-semibold text-sm">
              Step 1 -- A basic Sprite
            </h3>
            <CodeBlock
              code={`// A sprite is a camera-facing quad
<sprite position={[0, 2, 0]} scale={[1, 0.4, 1]}>
  <spriteMaterial
    color="#ff6b6b"
    transparent
    opacity={0.9}
  />
</sprite>`}
              filename="BasicSprite.tsx"
            />
            <p className="text-sm text-muted-foreground">
              The sprite is always a flat quad facing the camera. The scale
              controls its size — [width, height, 1]. No matter how you orbit,
              you always see the front face.
            </p>
          </div>

          <div className="bg-card border rounded-lg p-4 space-y-3">
            <h3 className="font-semibold text-sm">
              Step 2 -- Billboard with Text
            </h3>
            <CodeBlock
              code={`import { Billboard, Text } from "@react-three/drei";

<Billboard position={[0, 2, 0]}>
  <Text fontSize={0.3} color="white">
    Player 1
  </Text>
</Billboard>`}
              filename="BillboardLabel.tsx"
            />
            <p className="text-sm text-muted-foreground">
              Drei&apos;s Billboard wraps any children and makes the whole
              group face the camera. Unlike Sprite, you can put complex JSX
              inside — text, planes, even other meshes.
            </p>
          </div>

          <div className="bg-card border rounded-lg p-4 space-y-3">
            <h3 className="font-semibold text-sm">
              Step 3 -- A health bar with background
            </h3>
            <CodeBlock
              code={`function HealthBar({ health }: { health: number }) {
  return (
    <Billboard position={[0, 2.2, 0]}>
      {/* Background bar */}
      <mesh scale={[1.2, 0.15, 1]}>
        <planeGeometry />
        <meshBasicMaterial
          color="#333"
          transparent
          opacity={0.7}
        />
      </mesh>
      {/* Health fill */}
      <mesh
        scale={[1.2 * health, 0.12, 1]}
        position={[(health - 1) * 0.6, 0, 0.01]}
      >
        <planeGeometry />
        <meshBasicMaterial color="#22c55e" />
      </mesh>
    </Billboard>
  );
}`}
              filename="HealthBar.tsx"
            />
            <p className="text-sm text-muted-foreground">
              Two planes layered on each other inside a Billboard. The green
              bar scales based on the health value (0 to 1). The position
              offset keeps it left-aligned as it shrinks.
            </p>
          </div>
        </section>
      </ScrollReveal>

      <Separator className="my-8" />

      {/* 7. What You Just Learned */}
      <ScrollReveal>
        <WhatYouJustLearned
          points={[
            "Sprites are built-in Three.js objects that always face the camera — rendered as a textured quad.",
            "drei's Billboard component wraps any JSX children to make them face the camera, enabling complex UI layouts in 3D.",
            "SpriteMaterial supports texture maps, transparency, and blending for particle-like effects.",
            "For many sprite-like particles, switch to Points for a single draw call instead of hundreds of individual sprites.",
          ]}
        />
      </ScrollReveal>

      <Separator className="my-8" />

      {/* 8. Thought-Provoking Question */}
      <ScrollReveal>
        <ConversationalCallout type="question">
          <p>
            A sprite always faces the camera, which means it rotates as you
            orbit. But what if you want a health bar that only rotates on the
            Y-axis (left-right) and stays level on the X-axis (never tilts
            up or down)? How would you implement that?
          </p>
        </ConversationalCallout>
      </ScrollReveal>

      <Separator className="my-8" />

      {/* 9. Aha Moment */}
      <ScrollReveal>
        <AhaMoment
          setup="Why would you use a Billboard component instead of the HTML overlay approach (drei's Html) for in-world labels?"
          reveal="HTML overlays are rendered by the browser's 2D engine on top of the WebGL canvas. They do not participate in the 3D depth buffer, so they always appear on top of everything — even things that should occlude them. A Billboard is a real 3D object that respects the depth buffer. If a wall is between the camera and the label, the label is hidden. HTML overlays float over walls. Choose Billboard when you need depth-correct occlusion, and Html when you need the label always visible."
        />
      </ScrollReveal>

      <Separator className="my-8" />

      {/* 10. Mental Model Challenge */}
      <ScrollReveal>
        <MentalModelChallenge
          question="You have 400 floating sparkle particles in your scene. Each is a sprite with a glow texture. Performance is terrible. What should you do?"
          options={[
            {
              label: "Reduce the texture resolution",
              correct: false,
              explanation:
                "The bottleneck is draw calls (400 separate draw calls), not texture size.",
            },
            {
              label: "Replace sprites with a Points system",
              correct: true,
              explanation:
                "Points renders all particles in a single draw call. PointsMaterial can use a texture map for the same visual effect.",
            },
            {
              label: "Use lower opacity so the GPU blends less",
              correct: false,
              explanation:
                "Opacity does not reduce draw calls. The CPU-GPU overhead of 400 objects is the real problem.",
            },
            {
              label: "Group all sprites into a single Group",
              correct: false,
              explanation:
                "Grouping organizes the scene graph but does not reduce draw calls. Each sprite still renders separately.",
            },
          ]}
          answer="Switch to a Points system. Each Sprite is a separate draw call — 400 sprites means 400 commands from the CPU to the GPU. A Points object puts all 400 positions in a single buffer and renders them in one draw call. Use PointsMaterial with a texture map for the same sparkle effect."
        />
      </ScrollReveal>

      <Separator className="my-8" />

      {/* Try This */}
      <Separator className="my-8" />
      <ScrollReveal>
        <TryThisList challenges={[
          { challenge: "Set opacity to 0.3 — ghostly labels", hint: "Lower the sprite or billboard opacity to 0.3.", solution: "The labels become semi-transparent, creating a ghostly, holographic appearance.", difficulty: "beginner" },
          { challenge: "Toggle sparkles — remove particles", hint: "Toggle the sparkles effect off.", solution: "The sparkle particles disappear, leaving just the core sprites and billboards visible.", difficulty: "beginner" },
          { challenge: "Set scale to 2 — giant signs", hint: "Double the billboard scale to 2.", solution: "The labels become twice as large, like giant floating signs in the scene.", difficulty: "beginner" },
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
                  Sprites for few, Points for many
                </h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Use Sprites for a handful of individual labels. Switch to
                Points when you have dozens or hundreds of similar particles.
                The draw call savings are dramatic.
              </p>
            </div>
            <div className="rounded-lg border bg-card p-4 space-y-2">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="size-4 text-green-500" />
                <h3 className="font-semibold text-sm">
                  Set depthWrite false on transparent sprites
                </h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Transparent sprites with depthWrite on will occlude objects
                behind them with their invisible parts. Always set
                depthWrite={"{false}"} when using transparency.
              </p>
            </div>
            <div className="rounded-lg border bg-card p-4 space-y-2">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="size-4 text-green-500" />
                <h3 className="font-semibold text-sm">
                  Billboard for complex UI
                </h3>
              </div>
              <p className="text-sm text-muted-foreground">
                When you need more than a single texture — text, shapes,
                progress bars — use drei&apos;s Billboard. It wraps any JSX
                so the whole group faces the camera.
              </p>
            </div>
            <div className="rounded-lg border bg-card p-4 space-y-2">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="size-4 text-green-500" />
                <h3 className="font-semibold text-sm">
                  Test from multiple angles
                </h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Billboarding bugs are only visible from certain camera angles.
                Always orbit around your scene to verify labels and sprites
                behave correctly from every direction.
              </p>
            </div>
          </div>
        </section>
      </ScrollReveal>
    </div>
  );
}
