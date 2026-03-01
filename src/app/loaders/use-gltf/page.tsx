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

const GltfDemo = dynamic(
  () => import("./_components/gltf-demo").then((m) => ({ default: m.GltfDemo })),
  {
    ssr: false,
    loading: () => (
      <div className="w-full aspect-[2/1] rounded-xl border bg-scene-bg animate-pulse" />
    ),
  }
);

const mistakes: Mistake[] = [
  {
    title: "Not preloading models causes visible delays",
    subtitle: "Models download only when the component mounts",
    wrongCode: `function Scene() {
  // Download starts when Scene mounts
  // User stares at a fallback for 3 seconds
  const { scene } = useGLTF('/models/heavy.glb')
  return <primitive object={scene} />
}`,
    rightCode: `function Scene() {
  const { scene } = useGLTF('/models/heavy.glb')
  return <primitive object={scene} />
}

// Download starts when JS is parsed, not on mount
useGLTF.preload('/models/heavy.glb')`,
    filename: "PreloadModel.tsx",
    explanation:
      "Without preloading, the model download only begins when the component first mounts, causing a visible delay. By calling useGLTF.preload() at the module level, the download starts as soon as the JavaScript is imported. When the component eventually renders, the model is already cached.",
  },
  {
    title: "Rendering the whole scene instead of picking parts",
    subtitle: "Using primitive when you need control over individual pieces",
    wrongCode: `function Car() {
  const { scene } = useGLTF('/models/car.glb')
  // No control over individual parts
  return <primitive object={scene} />
}`,
    rightCode: `function Car() {
  const { nodes, materials } = useGLTF('/models/car.glb')

  return (
    <group>
      <mesh geometry={nodes.Body.geometry}
            material={materials.Paint} castShadow />
      <mesh geometry={nodes.Glass.geometry}>
        <meshPhysicalMaterial transmission={0.9} />
      </mesh>
    </group>
  )
}`,
    filename: "DestructuredCar.tsx",
    explanation:
      "Using <primitive object={scene} /> renders the entire model as a black box. By destructuring nodes and materials, you can cherry-pick specific meshes, override materials, add event handlers, and control shadows individually. This is the recommended pattern for any model you need fine-grained control over.",
  },
  {
    title: "Manually setting up DRACOLoader with useGLTF",
    subtitle: "useGLTF already handles Draco automatically",
    wrongCode: `import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader'

function Model() {
  const gltf = useLoader(GLTFLoader, '/models/model.glb',
    (loader) => {
      const draco = new DRACOLoader()
      draco.setDecoderPath('/draco/')
      loader.setDRACOLoader(draco)
    })
  return <primitive object={gltf.scene} />
}`,
    rightCode: `import { useGLTF } from '@react-three/drei'

function Model() {
  const { scene } = useGLTF('/models/model.glb')
  return <primitive object={scene} />
}

useGLTF.preload('/models/model.glb')`,
    filename: "AutoDraco.tsx",
    explanation:
      "useGLTF automatically configures Draco decompression using a CDN-hosted decoder. You do not need to download decoder files or set decoder paths. This is one of the main reasons to prefer useGLTF over raw useLoader + GLTFLoader.",
  },
];

export default function UseGltfPage() {
  return (
    <div className="relative max-w-4xl">
      <div className="absolute -top-10 -left-10 w-72 h-72 bg-gradient-to-br from-teal-500/10 via-emerald-500/10 to-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
      {/* Title + Badge + Intro */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-3">
          <Badge variant="outline">Loaders</Badge>
        </div>
        <h1 className="text-3xl font-bold tracking-tight mb-3">
          useGLTF Hook
        </h1>
        <p className="text-lg text-muted-foreground">
          Think of useGLTF like opening an IKEA flatpack. Your model arrives as
          one box (the GLB file). useGLTF opens it and lays out all the parts
          on the floor -- the body, the wheels, the glass, the paint colors --
          so you can access each piece individually. You can use the whole
          assembly as-is, or pick out just the parts you need.
        </p>
      </div>

      {/* What Could Go Wrong */}
      <WhatCouldGoWrong
        scenario="You load a model with useGLTF and it appears on screen. Great! But now you want to change the color of just the car's body while keeping the glass transparent. You have no idea how to reach inside the model to modify individual parts."
        error="Using <primitive object={scene} /> renders the entire model as a black box. Cannot access individual meshes, override materials, or add per-part event handlers."
        errorType="Architecture"
        accentColor="red"
      />

      <Separator className="my-8" />

      {/* Story Analogy */}
      <ConversationalCallout type="story">
        <p>
          You order a bookshelf from IKEA. It arrives in one box. You could
          leave everything sealed and just prop the box against the wall, but
          that is not very useful. Instead, you open the box and lay out every
          piece: the shelves, the sides, the screws, the backing board.
        </p>
        <p>
          useGLTF does the same thing. It opens the GLB file and gives you
          access to every piece inside: nodes (the individual meshes), materials
          (the surface finishes), and animations (the moving parts). You can
          use the whole scene as-is with primitive, or you can destructure
          the parts and build something custom.
        </p>
      </ConversationalCallout>

      <Separator className="my-8" />

      {/* SimpleFlow */}
      <SimpleFlow
        steps={[
          { label: "GLB File", detail: "The sealed box" },
          { label: "useGLTF", detail: "Open and unpack" },
          { label: "nodes", detail: "Individual meshes" },
          { label: "materials", detail: "Surface finishes" },
          { label: "Your Scene!", detail: "Assemble freely", status: "success" },
        ]}
        accentColor="blue"
      />

      <Separator className="my-8" />

      {/* Demo */}
      <GltfDemo />

      <Separator className="my-8" />

      {/* Guided Walkthrough */}
      <ScrollReveal>
        <section className="space-y-4">
          <h2 className="text-2xl font-bold">Unpacking Your Model</h2>
          <p className="text-muted-foreground leading-relaxed">
            useGLTF gives you two ways to work with a model: drop the whole
            thing in with primitive, or destructure nodes and materials for
            full control. Let&apos;s start simple and then open the box.
          </p>

          <div className="rounded-lg border bg-card p-4 space-y-3">
            <p className="text-sm font-medium">Step 1: Load and display the whole model</p>
            <CodeBlock
              code={`const { scene } = useGLTF('/models/robot.glb')
return <primitive object={scene} scale={1.5} />`}
              filename="WholeModel.tsx"
            />
            <p className="text-sm text-muted-foreground">
              This is the quickest approach. Like propping the IKEA box against
              the wall. The model shows up exactly as the designer exported it,
              but you cannot easily change individual parts.
            </p>
          </div>

          <div className="rounded-lg border bg-card p-4 space-y-3">
            <p className="text-sm font-medium">Step 2: Destructure for full control</p>
            <CodeBlock
              code={`const { nodes, materials } = useGLTF('/models/car.glb')

return (
  <group>
    <mesh geometry={nodes.Body.geometry}
          material={materials.Paint} castShadow />
    <mesh geometry={nodes.Glass.geometry}>
      <meshPhysicalMaterial transmission={0.9} />
    </mesh>
  </group>
)`}
              filename="DestructuredModel.tsx"
            />
            <p className="text-sm text-muted-foreground">
              Now you have opened the box. You can pick each piece by name,
              override its material, add click handlers, or decide which parts
              cast shadows. This is the recommended approach for any model
              you need to customize.
            </p>
          </div>

          <div className="rounded-lg border bg-card p-4 space-y-3">
            <p className="text-sm font-medium">Step 3: Preload for instant display</p>
            <CodeBlock
              code={`function Car() {
  const { nodes, materials } = useGLTF('/models/car.glb')
  return <primitive object={nodes.Body} />
}

// Start downloading before the component mounts
useGLTF.preload('/models/car.glb')`}
              filename="PreloadedCar.tsx"
            />
            <p className="text-sm text-muted-foreground">
              useGLTF.preload() starts the download as soon as your JavaScript
              file is imported -- long before the component mounts. When the
              component finally renders, the model is already cached and
              appears instantly with no loading spinner.
            </p>
          </div>

          <div className="rounded-lg border bg-card p-4 space-y-3">
            <p className="text-sm font-medium">Step 4: Auto-generate with gltfjsx</p>
            <CodeBlock
              code={`npx gltfjsx public/models/robot.glb --transform --types`}
              filename="terminal.sh"
            />
            <p className="text-sm text-muted-foreground">
              For complex models with many parts, run gltfjsx to auto-generate
              a typed React component. It inspects the model and creates a file
              with every node and material properly destructured and typed.
              The --transform flag also optimizes the model file itself.
            </p>
          </div>
        </section>
      </ScrollReveal>

      <Separator className="my-8" />

      {/* What You Just Learned */}
      <WhatYouJustLearned
        points={[
          "useGLTF is like opening an IKEA flatpack -- it unpacks a GLB file and lays out all the parts (nodes, materials, animations).",
          "Use <primitive object={scene} /> for quick display, or destructure nodes/materials for full control.",
          "useGLTF handles Draco decompression automatically -- no manual DRACOLoader setup needed.",
          "Call useGLTF.preload() at the module level to start downloading before the component mounts.",
          "Use gltfjsx to auto-generate typed React components from complex models.",
        ]}
      />

      <Separator className="my-8" />

      {/* Question */}
      <ConversationalCallout type="question">
        <p>
          If useGLTF gives you individual nodes and materials, could you mix
          and match parts from two different models? Like putting the wheels
          from one car onto the body of another?
        </p>
      </ConversationalCallout>

      <Separator className="my-8" />

      {/* Aha Moment */}
      <AhaMoment
        setup="useGLTF looks like it just saves you a few lines compared to useLoader + GLTFLoader. Is the convenience really worth learning a different API?"
        reveal="The convenience is huge once you factor in what useGLTF does silently. It auto-configures Draco decompression from a CDN (no decoder files to host). It caches models so the same URL is never downloaded twice. It provides useGLTF.preload() for instant display. And it plays perfectly with gltfjsx for auto-generated typed components. All of this with zero configuration. With raw useLoader, you would set up each of these features manually."
      />

      <Separator className="my-8" />

      {/* Mental Model Challenge */}
      <MentalModelChallenge
        question="You have a car model with a Body, Glass, and Wheels part. You want the body to be red, the glass to be transparent, and the wheels to cast shadows. Which approach gives you this level of control?"
        options={[
          {
            label: "<primitive object={scene} /> with traverse",
            correct: false,
            explanation: "Traversing the scene works, but it's imperative and fragile. You'd need to find meshes by name in a callback, making the code harder to read and maintain.",
          },
          {
            label: "Destructure { nodes, materials } and build the JSX yourself",
            correct: true,
            explanation: "Destructuring gives you React-level control. You can set different materials, add castShadow, attach onClick handlers, and compose parts with other React components -- all in declarative JSX.",
          },
          {
            label: "Edit the model in Blender and re-export",
            correct: false,
            explanation: "This works for static changes, but you lose the ability to change materials at runtime (e.g., a color picker for the car body) and you have to re-export every time you want a change.",
          },
        ]}
        hint="Think about which approach lets you use React's strengths..."
        answer="Destructure nodes and materials. This turns your 3D model into regular React JSX, where each part is a <mesh> with its own props. Want to change the body color on click? Add an onClick and setState. Want transparent glass? Swap the material inline. Want shadows only on wheels? Add castShadow to just those meshes. React's declarative model shines when you destructure."
      />

      <Separator className="my-8" />

      {/* Try This */}
      <Separator className="my-8" />
      <ScrollReveal>
        <TryThisList challenges={[
          { challenge: "Change bodyColor — custom robot!", hint: "Pick a new color for the robot body using the color picker.", solution: "The robot body changes color instantly, showing the power of destructured nodes with material overrides.", difficulty: "beginner" },
          { challenge: "Set eyeColor to red — evil robot", hint: "Change the eye color to a bright red.", solution: "Red eyes give the robot a menacing look, demonstrating per-part material control.", difficulty: "beginner" },
          { challenge: "Toggle showAntenna — stealth mode", hint: "Toggle the antenna visibility checkbox.", solution: "The antenna hides, showing how destructured nodes let you conditionally render individual model parts.", difficulty: "beginner" },
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
                <h3 className="font-semibold text-sm">Always Preload</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Call useGLTF.preload() at the module level for every model.
                This starts the download when the JS is parsed, not when
                the component mounts, eliminating visible loading delays.
              </p>
            </div>
            <div className="rounded-lg border bg-card p-4 space-y-2">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="size-4 text-green-500" />
                <h3 className="font-semibold text-sm">Use gltfjsx for Complex Models</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Run npx gltfjsx on your model to generate a typed React
                component with every node properly extracted. The --transform
                flag also optimizes the model file itself.
              </p>
            </div>
            <div className="rounded-lg border bg-card p-4 space-y-2">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="size-4 text-green-500" />
                <h3 className="font-semibold text-sm">Destructure Nodes</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Prefer destructuring nodes and materials over rendering the
                whole scene with primitive. This gives you full React control:
                event handlers, conditional rendering, material overrides.
              </p>
            </div>
            <div className="rounded-lg border bg-card p-4 space-y-2">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="size-4 text-green-500" />
                <h3 className="font-semibold text-sm">Pair with useAnimations</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                For animated models, use the useAnimations hook from drei.
                It handles mixer creation, action management, and cleanup
                automatically. Just pass in the animations from useGLTF.
              </p>
            </div>
          </div>
        </section>
      </ScrollReveal>
    </div>
  );
}
