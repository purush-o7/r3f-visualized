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

const Demo = dynamic(
  () =>
    import("./_components/mesh-demo").then((m) => ({
      default: m.MeshDemo,
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
    title: "Recreating geometry and material every render",
    subtitle: "Creating Three.js objects inside the component body",
    wrongCode: `function MyMesh() {
  // Recreated on EVERY render!
  const geo = new THREE.BoxGeometry(1, 1, 1)
  const mat = new THREE.MeshStandardMaterial()
  return <mesh geometry={geo} material={mat} />
}`,
    rightCode: `// Let R3F manage them as JSX children
function MyMesh() {
  return (
    <mesh>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color="red" />
    </mesh>
  )
}`,
    filename: "MyMesh.tsx",
    explanation:
      "Creating new Three.js objects inside a component body means they are constructed on every React render, wasting memory and CPU. Use JSX children and let R3F handle the lifecycle.",
  },
  {
    title: "Missing lights with PBR materials",
    subtitle: "Standard and Physical materials need light to be visible",
    wrongCode: `// Renders completely black
<mesh>
  <sphereGeometry args={[1, 32, 32]} />
  <meshStandardMaterial color="coral" />
</mesh>`,
    rightCode: `<>
  <ambientLight intensity={0.4} />
  <directionalLight position={[5, 5, 5]} />
  <mesh>
    <sphereGeometry args={[1, 32, 32]} />
    <meshStandardMaterial color="coral" />
  </mesh>
</>`,
    filename: "Scene.tsx",
    explanation:
      "MeshStandardMaterial simulates real light interaction. Without light sources, it renders black. Add ambient and directional lights, or use MeshBasicMaterial if you want something always visible.",
  },
  {
    title: "Transparent objects with incorrect render order",
    subtitle: "Transparent meshes hide objects behind them",
    wrongCode: `<mesh>
  <sphereGeometry args={[1, 32, 32]} />
  <meshStandardMaterial
    transparent opacity={0.3}
    color="skyblue"
  />
</mesh>`,
    rightCode: `<mesh renderOrder={1}>
  <sphereGeometry args={[1, 32, 32]} />
  <meshStandardMaterial
    transparent opacity={0.3}
    color="skyblue" depthWrite={false}
  />
</mesh>`,
    filename: "Transparency.tsx",
    explanation:
      "Transparent objects that write to the depth buffer can hide objects behind them. Set depthWrite={false} on transparent materials to prevent this. Use renderOrder to control draw order explicitly.",
  },
];

export default function MeshComponentPage() {
  return (
    <div className="max-w-4xl ambient-canvas">
      {/* 1. Title + Badge + Intro */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-3">
          <Badge variant="outline">Meshes & Objects</Badge>
          <Badge variant="secondary" className="text-[10px]">
            Essential
          </Badge>
        </div>
        <h1 className="text-3xl font-bold tracking-tight mb-3">
          Mesh Component
        </h1>
        <p className="text-lg text-muted-foreground leading-relaxed">
          A mesh is the most fundamental visible thing in 3D. If you can see
          it in a 3D scene, it is probably a mesh. But a mesh by itself is
          nothing -- it needs two ingredients: a shape (the geometry) and a
          surface look (the material). Think of it as a mannequin wearing an
          outfit. The mannequin is the geometry. The outfit is the material.
          Together, they make something you can actually see.
        </p>
      </div>

      {/* 2. WhatCouldGoWrong */}
      <ScrollReveal>
        <WhatCouldGoWrong
          scenario={`You create a beautiful sphere with meshStandardMaterial in a nice coral color. But when you run the app, the sphere is completely black. The shape is there -- you can see the silhouette against the background -- but the color is gone. It looks like a black hole.`}
          error={`Scene renders but all objects appear black.
meshStandardMaterial requires light sources to calculate color.
No <ambientLight> or <directionalLight> found in scene.`}
          errorType="Visual Bug"
        />
      </ScrollReveal>

      {/* 3. ConversationalCallout - Story Analogy */}
      <ScrollReveal>
        <ConversationalCallout type="story">
          <p>
            Picture a mannequin in a clothing store. The mannequin has a body
            shape -- arms, torso, legs. That is the geometry. Now dress it in a
            red silk shirt. The shirt has color, texture, and shininess. That
            is the material.
          </p>
          <p>
            A naked mannequin is invisible in 3D (no material = nothing to
            render). A shirt floating in mid-air has no form (no geometry =
            nothing to shape). You need both. The mesh is the combination:
            body plus clothing equals something you can see and interact with.
          </p>
        </ConversationalCallout>
      </ScrollReveal>

      {/* 4. SimpleFlow - Mental Model */}
      <ScrollReveal>
        <SimpleFlow
          steps={[
            { label: "Geometry", detail: "The shape (box, sphere, torus)" },
            { label: "+", detail: "" },
            { label: "Material", detail: "The look (color, texture, shine)" },
            { label: "=", detail: "" },
            { label: "Mesh", detail: "A visible 3D object" },
          ]}
        />
      </ScrollReveal>

      <Separator className="my-8" />

      {/* 5. Interactive Demo */}
      <Demo />

      <Separator className="my-8" />

      {/* 6. Guided Walkthrough */}
      <ScrollReveal>
        <section className="space-y-4">
          <h2 className="text-2xl font-bold">Dressing a Mannequin</h2>
          <p className="text-muted-foreground leading-relaxed">
            Let us build a mesh step by step. First the body, then the
            outfit, then we will bring it to life with animation.
          </p>

          {/* Step 1 */}
          <div className="rounded-lg border bg-card p-4 space-y-3">
            <div className="flex items-center gap-2">
              <Badge variant="secondary">Step 1</Badge>
              <span className="font-semibold text-sm">
                Choose a body shape (geometry)
              </span>
            </div>
            <p className="text-sm text-muted-foreground">
              Geometry defines the form. R3F gives you all of Three.js's
              built-in shapes: boxes, spheres, cylinders, torus knots, and
              more. The <code>args</code> array controls the dimensions.
            </p>
            <CodeBlock
              code={`{/* A box: width, height, depth */}
<boxGeometry args={[1, 1, 1]} />

{/* A sphere: radius, widthSegments, heightSegments */}
<sphereGeometry args={[0.6, 32, 32]} />`}
              filename="geometries.tsx"
            />
            <p className="text-sm text-muted-foreground">
              More segments means a smoother shape, but also more work for
              your GPU. A sphere with 32 segments looks smooth. One with 8
              looks like a gem.
            </p>
          </div>

          {/* Step 2 */}
          <div className="rounded-lg border bg-card p-4 space-y-3">
            <div className="flex items-center gap-2">
              <Badge variant="secondary">Step 2</Badge>
              <span className="font-semibold text-sm">
                Pick an outfit (material)
              </span>
            </div>
            <p className="text-sm text-muted-foreground">
              Material controls how the surface looks. Different materials
              have different capabilities and performance costs.
            </p>
            <CodeBlock
              code={`{/* Basic: always visible, ignores light */}
<meshBasicMaterial color="hotpink" />

{/* Standard: realistic, needs lights */}
<meshStandardMaterial color="coral" />

{/* Physical: most realistic, most expensive */}
<meshPhysicalMaterial
  color="gold"
  metalness={1}
  roughness={0.2}
/>`}
              filename="materials.tsx"
            />
            <p className="text-sm text-muted-foreground">
              Think of materials on a spectrum: Basic is a t-shirt (cheap,
              simple), Standard is a nice jacket (good looking, reasonable
              cost), Physical is a tailored suit (stunning, expensive).
            </p>
          </div>

          {/* Step 3 */}
          <div className="rounded-lg border bg-card p-4 space-y-3">
            <div className="flex items-center gap-2">
              <Badge variant="secondary">Step 3</Badge>
              <span className="font-semibold text-sm">
                Put them together as a mesh
              </span>
            </div>
            <p className="text-sm text-muted-foreground">
              Wrap the geometry and material inside a{" "}
              <code>&lt;mesh&gt;</code> tag. Add position, rotation, or scale
              to place it in your scene.
            </p>
            <CodeBlock
              code={`<mesh position={[0, 1, 0]}>
  <sphereGeometry args={[0.6, 32, 32]} />
  <meshStandardMaterial color="coral" />
</mesh>`}
              filename="MyMesh.tsx"
            />
            <p className="text-sm text-muted-foreground">
              That is a coral-colored sphere floating 1 unit above the origin.
              The mannequin (sphere shape) is dressed (coral standard material)
              and placed in the scene.
            </p>
          </div>
        </section>
      </ScrollReveal>

      <Separator className="my-8" />

      {/* 7. WhatYouJustLearned */}
      <ScrollReveal>
        <WhatYouJustLearned
          points={[
            "A mesh is geometry (shape) + material (appearance)",
            "Geometry defines vertices, faces, and the form of the object",
            "Material defines color, roughness, metalness, and how light interacts",
            "meshBasicMaterial ignores lights; meshStandardMaterial needs them",
            "Use args for geometry dimensions; use props for material properties",
            "Animate meshes with useFrame and refs, never with useState",
          ]}
        />
      </ScrollReveal>

      <Separator className="my-8" />

      {/* 8. ConversationalCallout - Thought Question */}
      <ScrollReveal>
        <ConversationalCallout type="question">
          <p>
            Can two meshes share the same geometry or material? Why would you
            want to do that?
          </p>
          <p>
            Yes, and you should whenever possible. If you have 100 trees that
            all use the same trunk shape, sharing one geometry means one set
            of vertices in GPU memory instead of 100. Same for materials.
            Shared resources = less memory, better performance. In R3F, you
            can share by passing a ref or by using <code>useMemo</code>.
          </p>
        </ConversationalCallout>
      </ScrollReveal>

      <Separator className="my-8" />

      {/* 9. AhaMoment */}
      <ScrollReveal>
        <AhaMoment
          setup="Why can I not just use useState to spin a cube at 60fps? It is just changing a number, right?"
          reveal="useState triggers a React re-render on every update. At 60fps, that is 60 full React render cycles per second -- reconciling the virtual DOM, diffing components, re-running effects. Your frame budget is 16ms, and React re-renders eat most of it. useFrame with a ref bypasses React entirely: you mutate the Three.js object directly (meshRef.current.rotation.y += delta), so the GPU updates without React ever knowing. It is the difference between rewriting a letter and just moving a physical object."
        />
      </ScrollReveal>

      <Separator className="my-8" />

      {/* 10. MentalModelChallenge */}
      <ScrollReveal>
        <MentalModelChallenge
          question="You place a mesh with meshStandardMaterial in your scene but forget to add lights. What do you see?"
          options={[
            {
              label: "A white object with default lighting",
              correct: false,
              explanation:
                "R3F does not add default lights. Without explicit lights, physically-based materials have nothing to reflect.",
            },
            {
              label: "Nothing at all -- the mesh is invisible",
              correct: false,
              explanation:
                "The mesh exists and renders, it just appears black because there is no light for the material to respond to.",
            },
            {
              label: "A black silhouette of the shape",
              correct: true,
              explanation:
                "Correct! The geometry renders but the standard material calculates zero light contribution, making everything appear black. The shape is visible as a silhouette against the background.",
            },
            {
              label: "An error because lights are required",
              correct: false,
              explanation:
                "No error is thrown. Lights are not required syntactically -- but without them, PBR materials render black.",
            },
          ]}
          hint="Think about what happens in a completely dark room. Can you see the shape of an object?"
          answer="meshStandardMaterial uses physically-based rendering. No lights means no light to reflect, so the material appears completely black. You can see the silhouette against the background color, but the object itself shows no color. Add lights, or switch to meshBasicMaterial which ignores lighting entirely."
        />
      </ScrollReveal>

      <Separator className="my-8" />

      {/* Try These Challenges */}
      <ScrollReveal>
        <TryThisList challenges={[
          { challenge: "Set wireframe={true} on all materials -- what do you see?", hint: "Wireframe mode shows the underlying triangle structure of each geometry.", solution: "You see the triangle mesh that makes up each shape. Boxes have simple triangles, spheres show a grid of quads split into triangles, and torus shapes reveal their complex winding. This is what the GPU actually renders -- filled triangles. More segments means more triangles and a smoother surface.", difficulty: "beginner" },
          { challenge: "Change metalness to 1 and roughness to 0 -- mirror effect!", hint: "Metalness controls how metallic the surface looks. Roughness controls how blurry reflections are.", solution: "With metalness=1 and roughness=0, the surface becomes a perfect mirror. It reflects the environment map (if present) or shows the scene's ambient and directional light as sharp highlights. This is physically accurate: real metals with a polished surface are highly reflective.", difficulty: "beginner" },
          { challenge: "Remove all lights from the scene -- which shapes are still visible?", hint: "Different materials respond differently to the absence of light.", solution: "Only meshes with meshBasicMaterial remain visible because it ignores lighting entirely. Meshes with meshStandardMaterial or meshPhysicalMaterial turn completely black because these PBR materials calculate color from light interactions. No light means no color. This is why meshBasicMaterial is useful for UI elements and debug visuals.", difficulty: "intermediate" },
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
                  Share geometry and material
                </h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Reuse the same instances across identical meshes. Use
                module-level constants or <code>useMemo</code> to avoid
                creating duplicates.
              </p>
            </div>
            <div className="rounded-lg border bg-card p-4 space-y-2">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="size-4 text-green-500" />
                <h3 className="font-semibold text-sm">
                  Use the simplest material
                </h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Do not default to MeshPhysicalMaterial. If you do not need
                realistic lighting, MeshBasicMaterial is much cheaper and
                always visible without lights.
              </p>
            </div>
            <div className="rounded-lg border bg-card p-4 space-y-2">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="size-4 text-green-500" />
                <h3 className="font-semibold text-sm">
                  Lower segments for distant objects
                </h3>
              </div>
              <p className="text-sm text-muted-foreground">
                A sphere with 64 segments and one with 16 look the same when
                far away. Fewer segments means less GPU work. Start low and
                increase only if you notice facets.
              </p>
            </div>
            <div className="rounded-lg border bg-card p-4 space-y-2">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="size-4 text-green-500" />
                <h3 className="font-semibold text-sm">
                  Animate with refs, not state
                </h3>
              </div>
              <p className="text-sm text-muted-foreground">
                For 60fps animations, mutate through a ref inside{" "}
                <code>useFrame</code>. Using <code>useState</code> triggers
                React re-renders which is far too slow for smooth animation.
              </p>
            </div>
          </div>
        </section>
      </ScrollReveal>
    </div>
  );
}
