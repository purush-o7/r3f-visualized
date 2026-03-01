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

const ModelDemo = dynamic(
  () => import("./_components/model-demo").then((m) => ({ default: m.ModelDemo })),
  {
    ssr: false,
    loading: () => (
      <div className="w-full aspect-[2/1] rounded-xl border bg-[#0a0a0a] animate-pulse" />
    ),
  }
);

const mistakes: Mistake[] = [
  {
    title: "Loading huge unoptimized models",
    subtitle: "Not compressing GLTF models before shipping",
    wrongCode: `// 50MB uncompressed model — slow download, crashes mobile
function Model() {
  const gltf = useLoader(GLTFLoader, '/models/scene.glb')
  return <primitive object={gltf.scene} />
}`,
    rightCode: `import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader'

// Draco compression: 50MB -> 5MB
function Model() {
  const gltf = useLoader(GLTFLoader, '/models/scene-draco.glb', (loader) => {
    const draco = new DRACOLoader()
    draco.setDecoderPath('/draco/')
    loader.setDRACOLoader(draco)
  })
  return <primitive object={gltf.scene} />
}`,
    filename: "CompressedModel.tsx",
    explanation:
      "Raw GLTF files from Blender often contain uncompressed geometry. Draco compression reduces file size by 90% with minimal quality loss. For production, always compress your models. The drei useGLTF hook handles Draco automatically.",
  },
  {
    title: "Reusing the same scene object in multiple places",
    subtitle: "Three.js objects can only have one parent",
    wrongCode: `function Forest() {
  const gltf = useLoader(GLTFLoader, '/models/tree.glb')

  return (
    <>
      <primitive object={gltf.scene} position={[-3, 0, 0]} />
      <primitive object={gltf.scene} position={[0, 0, 0]} />
      <primitive object={gltf.scene} position={[3, 0, 0]} />
    </>
  )
}`,
    rightCode: `import { Clone } from '@react-three/drei'

function Forest() {
  const gltf = useLoader(GLTFLoader, '/models/tree.glb')

  return (
    <>
      <Clone object={gltf.scene} position={[-3, 0, 0]} />
      <Clone object={gltf.scene} position={[0, 0, 0]} />
      <Clone object={gltf.scene} position={[3, 0, 0]} />
    </>
  )
}`,
    filename: "CloneModels.tsx",
    explanation:
      "In Three.js, every Object3D can only have one parent. Passing the same scene to multiple <primitive> components just moves it to the last one. Use drei's <Clone> component or gltf.scene.clone() to create independent copies.",
  },
  {
    title: "No loading state while model downloads",
    subtitle: "Forgetting to wrap model components in Suspense",
    wrongCode: `// User sees nothing for 3 seconds
function App() {
  return (
    <Canvas>
      <Model />
    </Canvas>
  )
}`,
    rightCode: `import { Suspense } from 'react'

function App() {
  return (
    <Canvas>
      <Suspense fallback={<Loader />}>
        <Model />
      </Suspense>
    </Canvas>
  )
}`,
    filename: "SuspenseLoader.tsx",
    explanation:
      "useLoader suspends the component while the asset downloads. Without a Suspense boundary, React has nothing to show during loading. Always wrap loader components in <Suspense> with a fallback so users see a loading indicator instead of a blank screen.",
  },
];

export default function GltfModelsPage() {
  return (
    <div className="max-w-4xl ambient-drei">
      {/* Title + Badge + Intro */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-3">
          <Badge variant="outline">Loaders</Badge>
        </div>
        <h1 className="text-3xl font-bold tracking-tight mb-3">
          GLTF Models
        </h1>
        <p className="text-lg text-muted-foreground">
          Think of a GLTF file like a 3D printer file. When you send an STL to
          a 3D printer, the file contains the entire model -- shape, structure,
          everything needed to produce the object. A GLTF file does the same for
          the web: shapes, colors, textures, and animations, all packaged into
          one file ready to display in your browser.
        </p>
      </div>

      {/* What Could Go Wrong */}
      <WhatCouldGoWrong
        scenario="You export a model from Blender, drop the 50MB GLB file into your public folder, and load it in your scene. On your development machine it works fine. But when a user on a mobile phone tries to load the page, they wait 30 seconds and then the browser crashes."
        error="net::ERR_INSUFFICIENT_RESOURCES — Browser ran out of memory while downloading and parsing a 50MB uncompressed GLTF model on a mobile device."
        errorType="Performance"
        accentColor="red"
      />

      <Separator className="my-8" />

      {/* Story Analogy */}
      <ConversationalCallout type="story">
        <p>
          Imagine you want to 3D print a robot figurine. You download an STL
          file that contains the entire robot: the body, the arms, the head,
          even the tiny gears inside. You send it to the printer and out comes
          the complete model.
        </p>
        <p>
          GLTF works the same way for the web. A designer creates a model in
          Blender or Maya and exports it as a GLB file. That single file
          contains the geometry (the shape), the materials (the colors and
          textures), and even animations (walk cycles, idle loops). You load
          it in your R3F scene and the entire model appears, ready to go.
        </p>
      </ConversationalCallout>

      <Separator className="my-8" />

      {/* SimpleFlow */}
      <SimpleFlow
        steps={[
          { label: "Blender / Maya", detail: "Create the model" },
          { label: "Export as GLB", detail: "Package everything" },
          { label: "Compress", detail: "Draco or gltfpack" },
          { label: "useLoader", detail: "Load in R3F" },
          { label: "On Screen!", detail: "Model appears", status: "success" },
        ]}
        accentColor="blue"
      />

      <Separator className="my-8" />

      {/* Demo */}
      <ModelDemo />

      <Separator className="my-8" />

      {/* Guided Walkthrough */}
      <ScrollReveal>
        <section className="space-y-4">
          <h2 className="text-2xl font-bold">Loading Your First Model</h2>
          <p className="text-muted-foreground leading-relaxed">
            Getting a GLTF model into your scene takes just a few lines.
            Let&apos;s walk through it step by step, from file to screen.
          </p>

          <div className="rounded-lg border bg-card p-4 space-y-3">
            <p className="text-sm font-medium">Step 1: Place the file in public</p>
            <p className="text-sm text-muted-foreground">
              Drop your .glb or .gltf file into the <code>/public/models/</code>{" "}
              folder. GLB is preferred for production because it is a single
              binary file. GLTF is a JSON file with separate binary and texture
              files -- useful for debugging but requires multiple HTTP requests.
            </p>
          </div>

          <div className="rounded-lg border bg-card p-4 space-y-3">
            <p className="text-sm font-medium">Step 2: Load with useLoader</p>
            <CodeBlock
              code={`import { useLoader } from '@react-three/fiber'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'

function Robot() {
  const gltf = useLoader(GLTFLoader, '/models/robot.glb')
  return <primitive object={gltf.scene} />
}`}
              filename="Robot.tsx"
            />
            <p className="text-sm text-muted-foreground">
              useLoader downloads the file, parses it, and returns the loaded
              GLTF object. The primitive component takes the parsed scene graph
              and drops it directly into your R3F scene.
            </p>
          </div>

          <div className="rounded-lg border bg-card p-4 space-y-3">
            <p className="text-sm font-medium">Step 3: Wrap in Suspense</p>
            <CodeBlock
              code={`<Canvas>
  <Suspense fallback={null}>
    <Robot />
  </Suspense>
  <ambientLight />
</Canvas>`}
              filename="App.tsx"
            />
            <p className="text-sm text-muted-foreground">
              useLoader suspends the component while the model downloads. Without
              Suspense, React does not know what to show during that time. Wrap
              your model in Suspense so users see a loading indicator (or at
              least a blank canvas) instead of an error.
            </p>
          </div>

          <div className="rounded-lg border bg-card p-4 space-y-3">
            <p className="text-sm font-medium">Step 4: Enable shadows and traverse</p>
            <CodeBlock
              code={`gltf.scene.traverse((child) => {
  if (child.isMesh) {
    child.castShadow = true
    child.receiveShadow = true
  }
})`}
              filename="EnableShadows.tsx"
            />
            <p className="text-sm text-muted-foreground">
              Models do not cast shadows by default. Use traverse to walk
              through every mesh in the model and enable castShadow and
              receiveShadow where needed.
            </p>
          </div>
        </section>
      </ScrollReveal>

      <Separator className="my-8" />

      {/* What You Just Learned */}
      <WhatYouJustLearned
        points={[
          "GLTF is the standard 3D format for the web -- like a 3D printer file that contains shapes, colors, textures, and animations in one package.",
          "Use useLoader with GLTFLoader to load models, and <primitive> to render them.",
          "Always wrap loader components in <Suspense> to handle the download gracefully.",
          "GLB (binary) is better for production; GLTF (JSON) is better for debugging.",
          "Always compress models with Draco or gltfpack before shipping -- raw exports can be 10x too large.",
        ]}
      />

      <Separator className="my-8" />

      {/* Question */}
      <ConversationalCallout type="question">
        <p>
          If a model is just a file containing shapes and materials, what
          happens when you try to place the same model in three different
          positions? Can you just render it three times?
        </p>
      </ConversationalCallout>

      <Separator className="my-8" />

      {/* Aha Moment */}
      <AhaMoment
        setup="You call useLoader(GLTFLoader, '/models/tree.glb') in two different components. Does the browser download the file twice?"
        reveal="No! useLoader caches the result automatically. The first component triggers the download, and every subsequent call with the same URL gets the cached result instantly. This means you can use the same model in multiple components without worrying about duplicate network requests. The caching happens at the loader level, not the component level."
      />

      <Separator className="my-8" />

      {/* Mental Model Challenge */}
      <MentalModelChallenge
        question="You want to place the same tree model at 50 different positions to create a forest. What is the correct approach?"
        options={[
          {
            label: "Use <primitive object={gltf.scene} /> 50 times",
            correct: false,
            explanation: "A Three.js object can only have one parent. Each <primitive> would try to reparent the same scene object, so you'd only see one tree at the last position.",
          },
          {
            label: "Call useLoader 50 times with the same URL",
            correct: false,
            explanation: "While useLoader caches the download, you still get the same scene object back each time. The reparenting problem remains.",
          },
          {
            label: "Use <Clone object={gltf.scene} /> 50 times",
            correct: true,
            explanation: "Clone creates an independent deep copy of the scene for each instance. Each clone has its own position, rotation, and scale while sharing the underlying geometry data efficiently.",
          },
        ]}
        hint="Remember: in Three.js, a child object can only have one parent..."
        answer="Use drei's <Clone> component. It deep-copies the scene graph so each tree is an independent instance with its own transform. The underlying geometry and texture data is still shared in GPU memory, so 50 clones don't use 50x the memory -- just 50x the draw calls."
      />

      <Separator className="my-8" />

      {/* Try This */}
      <Separator className="my-8" />
      <ScrollReveal>
        <TryThisList challenges={[
          { challenge: "Change wallColor to red — painted house!", hint: "Find the wallColor control and pick a red color.", solution: "The house walls change to red, showing how you can override material colors at runtime.", difficulty: "beginner" },
          { challenge: "Toggle showChimney — Santa's route", hint: "Toggle the showChimney checkbox in the demo controls.", solution: "The chimney appears or disappears, demonstrating how to conditionally show parts of a loaded model.", difficulty: "beginner" },
          { challenge: "Set rotationSpeed to 0 — still life", hint: "Drag the rotation speed slider to zero.", solution: "The model stops rotating, creating a static product-shot presentation.", difficulty: "beginner" },
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
                <h3 className="font-semibold text-sm">Always Compress</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Use Draco or gltfpack compression on all production models.
                Uncompressed exports can be 10x larger than necessary. The
                drei useGLTF hook handles Draco decompression automatically.
              </p>
            </div>
            <div className="rounded-lg border bg-card p-4 space-y-2">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="size-4 text-green-500" />
                <h3 className="font-semibold text-sm">Use Suspense Boundaries</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Always wrap model components in Suspense with a meaningful
                fallback. Users should see a loading indicator, not a blank
                screen while models download.
              </p>
            </div>
            <div className="rounded-lg border bg-card p-4 space-y-2">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="size-4 text-green-500" />
                <h3 className="font-semibold text-sm">Clone for Reuse</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                When placing the same model multiple times, use drei&apos;s Clone
                component. Direct reuse of the scene object will just move
                it to the last position instead of duplicating it.
              </p>
            </div>
            <div className="rounded-lg border bg-card p-4 space-y-2">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="size-4 text-green-500" />
                <h3 className="font-semibold text-sm">Prefer useGLTF Over useLoader</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                The drei useGLTF hook adds automatic Draco support, preloading,
                and caching over the raw useLoader approach. Use it for all
                new projects unless you need custom loader configuration.
              </p>
            </div>
          </div>
        </section>
      </ScrollReveal>
    </div>
  );
}
