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

const LoadingDemo = dynamic(
  () =>
    import("./_components/loading-demo").then((m) => ({
      default: m.LoadingDemo,
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
    title: "Putting Suspense inside the Canvas",
    subtitle: "useProgress only works outside the Canvas component",
    wrongCode: `<Canvas>
  {/* useProgress cannot read loading state here */}
  <Suspense fallback={<LoadingScreen />}>
    <Model />
  </Suspense>
</Canvas>`,
    rightCode: `{/* Suspense wraps the Canvas or sits alongside it */}
<Suspense fallback={<LoadingScreen />}>
  <Canvas>
    <Model />
  </Canvas>
</Suspense>

{/* Or use an HTML overlay approach */}
<Canvas>
  <Suspense fallback={null}>
    <Model />
  </Suspense>
</Canvas>
<Loader />  {/* drei Loader sits outside Canvas */}`,
    filename: "SuspensePlacement.tsx",
    explanation:
      "React Suspense works at the React tree level, not the Three.js level. The fallback must be a React component that renders HTML, not a Three.js object. The drei Loader and useProgress hook read the Three.js loading manager state from outside the Canvas.",
  },
  {
    title: "Not preloading assets for instant scene switches",
    subtitle: "Users see a loading flash every time they navigate",
    wrongCode: `function ModelViewer({ modelPath }) {
  // Loads fresh every time this component mounts
  const { scene } = useGLTF(modelPath)
  return <primitive object={scene} />
}`,
    rightCode: `function ModelViewer({ modelPath }) {
  const { scene } = useGLTF(modelPath)
  return <primitive object={scene} />
}

// Preload in advance — no loading flash
useGLTF.preload('/models/car.glb')
useGLTF.preload('/models/bike.glb')
useTexture.preload('/textures/wood.jpg')`,
    filename: "Preloading.tsx",
    explanation:
      "useGLTF.preload and useTexture.preload start fetching assets immediately when the module loads, before the component even mounts. When the user navigates to that scene, the asset is already cached and appears instantly. Put preload calls at the module level of pages that will need those assets.",
  },
  {
    title: "Showing a blank screen during loading",
    subtitle: "Users think the page is broken and leave",
    wrongCode: `// No fallback — user sees nothing while loading
<Canvas>
  <Model />  {/* Takes 3 seconds to load */}
</Canvas>`,
    rightCode: `// Custom loading screen keeps users engaged
function LoadingScreen() {
  const { progress } = useProgress()
  return (
    <div className="loading-overlay">
      <div className="progress-bar"
        style={{ width: \`\${progress}%\` }}
      />
      <p>{Math.round(progress)}% loaded</p>
    </div>
  )
}

<Canvas>
  <Suspense fallback={null}>
    <Model />
  </Suspense>
</Canvas>
<LoadingScreen />`,
    filename: "LoadingUX.tsx",
    explanation:
      "Users will wait for content if they can see progress. A loading bar with percentage gives them confidence the page is working. Without it, a 3-second blank screen feels like the page is broken. The useProgress hook from drei gives you loaded count, total count, and percentage.",
  },
];

export default function LoadingProgressPage() {
  return (
    <div className="max-w-4xl ambient-canvas">
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-3">
          <Badge variant="outline">Production</Badge>
        </div>
        <h1 className="text-3xl font-bold tracking-tight mb-3">
          Loading Progress
        </h1>
        <p className="text-lg text-muted-foreground">
          Your 3D scene takes four seconds to load. During that time, users
          stare at a blank screen and wonder if the page is broken. A proper
          loading experience turns that dead time into anticipation.
        </p>
      </div>

      {/* What Could Go Wrong */}
      <WhatCouldGoWrong
        scenario="You deploy a scene with a 5MB GLTF model and several 2K textures. On a fast connection it takes 3 seconds. On mobile 4G it takes 12 seconds. Users see a white page the entire time, assume it is broken, and bounce."
        error="UX: No loading indicator | Users see blank screen for 12s on 4G | Bounce rate: 73% | No Suspense boundary — React throws unhandled promise"
        errorType="UX Issue"
        accentColor="red"
      />

      <Separator className="my-8" />

      {/* Story Analogy */}
      <ConversationalCallout type="story">
        <p>
          Think of loading assets like an <strong>airport baggage carousel</strong>.
        </p>
        <p>
          Your textures, models, and HDR maps are checked luggage arriving on
          the conveyor belt. The <strong>progress bar</strong> is the arrivals
          screen showing how many bags have landed. React{" "}
          <strong>Suspense</strong> is the &quot;please wait here&quot; sign
          that keeps passengers in the right area. And drei&apos;s{" "}
          <strong>useProgress</strong> hook gives you the exact bag count.
        </p>
        <p>
          Without these, your passengers are standing in an empty terminal
          with no information -- they will leave.
        </p>
      </ConversationalCallout>

      <Separator className="my-8" />

      {/* Mental Model Flow */}
      <SimpleFlow
        steps={[
          { label: "Assets Requested", detail: "GLTF, textures, HDR" },
          { label: "useProgress", detail: "Tracks loaded / total" },
          { label: "Loading UI", detail: "Progress bar + percent" },
          { label: "Suspense Resolves", detail: "All assets ready" },
          { label: "Scene Visible", detail: "Smooth reveal", status: "success" },
        ]}
        accentColor="blue"
      />

      <Separator className="my-8" />

      {/* Interactive Demo */}
      <LoadingDemo />

      <Separator className="my-8" />

      {/* Guided Walkthrough */}
      <ScrollReveal>
        <section className="space-y-4">
          <h2 className="text-2xl font-bold">
            Building a Production Loading Screen
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            A loading screen in R3F combines two mechanisms: React Suspense
            for flow control and drei&apos;s useProgress for the actual
            numbers. Here is how to wire them together.
          </p>

          <div className="rounded-lg border bg-card p-4 space-y-3">
            <p className="text-sm font-medium">
              Step 1: Wrap your scene in Suspense
            </p>
            <CodeBlock
              code={`import { Suspense } from 'react'
import { Canvas } from '@react-three/fiber'

function App() {
  return (
    <Canvas>
      <Suspense fallback={null}>
        <MyScene />
      </Suspense>
    </Canvas>
  )
}`}
              filename="SuspenseSetup.tsx"
            />
            <p className="text-sm text-muted-foreground">
              Suspense catches the &quot;loading promise&quot; thrown by hooks
              like useGLTF and useTexture. The fallback inside Canvas must be
              null or a Three.js component. Your HTML loading screen lives
              outside the Canvas.
            </p>
          </div>

          <div className="rounded-lg border bg-card p-4 space-y-3">
            <p className="text-sm font-medium">
              Step 2: Build a custom loading component with useProgress
            </p>
            <CodeBlock
              code={`import { useProgress } from '@react-three/drei'

function LoadingScreen() {
  const { progress, loaded, total, item } = useProgress()

  return (
    <div className="loading-overlay">
      <div className="progress-bar"
           style={{ width: \`\${progress}%\` }} />
      <p>{loaded} / {total} assets</p>
      <p>{Math.round(progress)}%</p>
      <p className="current-item">{item}</p>
    </div>
  )
}`}
              filename="CustomLoader.tsx"
            />
            <p className="text-sm text-muted-foreground">
              useProgress returns four values: progress (0-100), loaded (count
              of finished assets), total (count of all assets), and item (the
              URL of the asset currently loading). Use these to build any
              loading UI you want -- progress bars, spinners, or even a mini
              3D animation.
            </p>
          </div>

          <div className="rounded-lg border bg-card p-4 space-y-3">
            <p className="text-sm font-medium">
              Step 3: Preload assets for instant transitions
            </p>
            <CodeBlock
              code={`import { useGLTF, useTexture } from '@react-three/drei'

// These run at module load time — before any component mounts
useGLTF.preload('/models/car.glb')
useGLTF.preload('/models/bike.glb')
useTexture.preload('/textures/ground.jpg')

// When the component mounts, assets are already cached
function CarScene() {
  const { scene } = useGLTF('/models/car.glb')
  return <primitive object={scene} />
}`}
              filename="Preloading.tsx"
            />
            <p className="text-sm text-muted-foreground">
              Preloading starts fetching assets the moment your JavaScript
              module is parsed, not when the component mounts. If you know
              the user will need certain assets (like the next page in a
              multi-scene app), preload them so there is zero loading delay
              when they navigate.
            </p>
          </div>

          <div className="rounded-lg border bg-card p-4 space-y-3">
            <p className="text-sm font-medium">
              Step 4: Use drei&apos;s built-in Loader for quick prototyping
            </p>
            <CodeBlock
              code={`import { Loader } from '@react-three/drei'

function App() {
  return (
    <>
      <Canvas>
        <Suspense fallback={null}>
          <MyScene />
        </Suspense>
      </Canvas>
      {/* Drop-in loading bar — sits outside Canvas */}
      <Loader
        containerStyles={{ background: '#0a0a0a' }}
        barStyles={{ background: '#6366f1' }}
        dataStyles={{ color: '#fff' }}
      />
    </>
  )
}`}
              filename="DreiLoader.tsx"
            />
            <p className="text-sm text-muted-foreground">
              If you do not need a custom design, drei&apos;s Loader component
              is a ready-made progress bar. It uses useProgress internally and
              renders an HTML overlay with a progress bar, percentage, and
              current item. Customize it with style props or use it as a
              starting point.
            </p>
          </div>
        </section>
      </ScrollReveal>

      <Separator className="my-8" />

      {/* What You Just Learned */}
      <WhatYouJustLearned
        points={[
          "React Suspense catches loading promises from hooks like useGLTF and useTexture.",
          "useProgress from drei gives you progress (0-100), loaded count, total count, and current item URL.",
          "Loading UI must be HTML outside the Canvas — Suspense fallback inside Canvas must be null or Three.js objects.",
          "useGLTF.preload and useTexture.preload at module level start fetching before components mount.",
          "drei's Loader component is a drop-in progress bar for quick prototyping.",
        ]}
      />

      <Separator className="my-8" />

      {/* Question */}
      <ConversationalCallout type="question">
        <p>
          You have a multi-page app where page 2 loads a 10MB GLTF model.
          Users always visit page 1 first. How would you make the transition
          to page 2 feel instant, without loading the model on page 1?
        </p>
      </ConversationalCallout>

      <Separator className="my-8" />

      {/* Aha Moment */}
      <AhaMoment
        setup="Most developers think loading screens are just about showing a spinner. They add a basic loading indicator and call it done..."
        reveal="The real power of useProgress is not the progress bar -- it is the information architecture. You get the exact asset URL being loaded (item), the count of finished vs total assets, and a 0-100 percentage. This lets you build experiences like 'Loading environment... Loading character model... Loading textures...' with specific messages for each phase. Users who see detailed progress wait 3x longer before abandoning a page compared to users who see a generic spinner. The loading screen IS part of the user experience, not a placeholder for it."
      />

      <Separator className="my-8" />

      {/* Mental Model Challenge */}
      <MentalModelChallenge
        question="You have a scene with 3 GLTF models and 5 textures. useProgress shows progress jumping from 0% to 37% to 100% with nothing in between. Why are you not seeing smooth 0-12.5-25-37.5-... increments?"
        options={[
          {
            label: "useProgress is buggy and skips values",
            correct: false,
            explanation:
              "useProgress reports accurately. The issue is with how assets load, not with the hook.",
          },
          {
            label: "Assets load in parallel, so multiple finish at once, causing jumps",
            correct: true,
            explanation:
              "The browser downloads assets concurrently. Several small textures may finish at the same time, jumping the progress from 0% to 37% in one tick. Large assets take longer, so progress may stall before jumping again.",
          },
          {
            label: "React batches state updates, merging multiple progress changes",
            correct: false,
            explanation:
              "While React does batch updates, useProgress reports the latest value from Three.js LoadingManager. The jumpy behavior is caused by parallel loading, not React batching.",
          },
          {
            label: "The total count changes as new assets are discovered during loading",
            correct: false,
            explanation:
              "The total is known upfront from the Suspense boundary. Assets do not dynamically discover more assets during loading in most cases.",
          },
        ]}
        hint="How does a browser handle multiple fetch requests? Does it download them one at a time?"
        answer="Browsers download assets concurrently (typically 6 connections per domain). When several small textures finish downloading in the same animation frame, useProgress reports all of them at once, causing a jump from 0% to 37%. Then if the last asset is a large GLTF model, progress stalls until it finishes, then jumps to 100%. To make progress feel smoother, you can animate the progress bar with a CSS transition or lerp the displayed value over time."
      />

      <Separator className="my-8" />

      {/* Try This */}
      <Separator className="my-8" />
      <ScrollReveal>
        <TryThisList challenges={[
          { challenge: "Click Reload — watch the progress bar", hint: "Click the reload button in the demo and watch the loading indicator.", solution: "The progress bar fills as assets download, showing real-time loading percentage to the user.", difficulty: "beginner" },
          { challenge: "Note the percentage jumping — that's assets loading", hint: "Watch how the percentage counter increments in chunks rather than smoothly.", solution: "Each jump corresponds to an asset finishing its download. Larger assets cause bigger jumps.", difficulty: "beginner" },
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
                <h3 className="font-semibold text-sm">
                  Animate the Progress Bar
                </h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Use CSS transition on the progress bar width so it glides
                smoothly instead of jumping. Users perceive smooth movement
                as faster loading, even when the actual time is the same.
              </p>
            </div>
            <div className="rounded-lg border bg-card p-4 space-y-2">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="size-4 text-green-500" />
                <h3 className="font-semibold text-sm">
                  Preload on Route Hover
                </h3>
              </div>
              <p className="text-sm text-muted-foreground">
                If your app has navigation, start preloading assets when the
                user hovers over a link. By the time they click, the assets
                may already be cached. This gives you instant scene transitions
                for free.
              </p>
            </div>
            <div className="rounded-lg border bg-card p-4 space-y-2">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="size-4 text-green-500" />
                <h3 className="font-semibold text-sm">
                  Compress Your Assets
                </h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Use Draco compression for GLTF models (70-90% smaller) and
                KTX2/Basis for textures (4-6x smaller). Smaller assets mean
                faster loading, which means shorter loading screens and
                happier users.
              </p>
            </div>
            <div className="rounded-lg border bg-card p-4 space-y-2">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="size-4 text-green-500" />
                <h3 className="font-semibold text-sm">
                  Fade In After Loading
                </h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Do not snap from loading screen to scene. Add a short fade
                transition (300-500ms) when progress hits 100%. This hides
                any jank from the first render pass and feels polished.
              </p>
            </div>
          </div>
        </section>
      </ScrollReveal>
    </div>
  );
}
