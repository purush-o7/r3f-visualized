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

const LoaderDemo = dynamic(
  () =>
    import("./_components/loader-demo").then((m) => ({
      default: m.LoaderDemo,
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
    title: "Loading assets with useEffect instead of useLoader",
    subtitle: "Bypasses caching and Suspense integration",
    wrongCode: `function TexturedBox() {
  const [texture, setTexture] = useState(null)

  useEffect(() => {
    new THREE.TextureLoader().load('/wood.jpg', (tex) => {
      setTexture(tex) // no caching, no Suspense
    })
  }, [])

  if (!texture) return null
  return <mesh>...</mesh>
}`,
    rightCode: `function TexturedBox() {
  const texture = useLoader(TextureLoader, '/wood.jpg')
  // Cached, Suspense-ready, one line
  return (
    <mesh>
      <boxGeometry />
      <meshStandardMaterial map={texture} />
    </mesh>
  )
}`,
    filename: "TexturedBox.tsx",
    explanation:
      "Using useEffect with manual loading bypasses R3F's global cache. Every time the component mounts, it re-downloads the asset. useLoader caches by URL -- if two components request the same texture, only one network request is made. It also integrates with React Suspense, so you can show loading fallbacks declaratively.",
  },
  {
    title: "Missing Suspense boundary",
    subtitle: "App crashes or shows a blank screen while loading",
    wrongCode: `function App() {
  return (
    <Canvas>
      {/* useLoader suspends -- but there is no Suspense! */}
      <TexturedSphere />
    </Canvas>
  )
}`,
    rightCode: `function App() {
  return (
    <Canvas>
      <Suspense fallback={
        <mesh>
          <sphereGeometry args={[1, 16, 16]} />
          <meshBasicMaterial wireframe color="gray" />
        </mesh>
      }>
        <TexturedSphere />
      </Suspense>
    </Canvas>
  )
}`,
    filename: "App.tsx",
    explanation:
      "useLoader uses React Suspense internally. While loading, the component throws a Promise. Without a Suspense boundary to catch it, React has nowhere to show a fallback and crashes. Always wrap useLoader components in Suspense with a meaningful placeholder like a wireframe shape.",
  },
  {
    title: "Not preloading critical assets",
    subtitle: "Users see loading spinners that could have been avoided",
    wrongCode: `// Loading starts only when component mounts
function Product() {
  const gltf = useLoader(GLTFLoader, '/product.glb')
  return <primitive object={gltf.scene} />
}`,
    rightCode: `// Start loading immediately at module level
useLoader.preload(GLTFLoader, '/product.glb')

function Product() {
  // If preload finished, this resolves instantly
  const gltf = useLoader(GLTFLoader, '/product.glb')
  return <primitive object={gltf.scene} />
}`,
    filename: "Product.tsx",
    explanation:
      "Without preloading, downloads only begin when the component first renders. useLoader.preload() starts the download immediately when the module is evaluated -- during app initialization. The cache is shared, so when useLoader() runs later with the same URL, the asset is already ready.",
  },
];

export default function UseLoaderPage() {
  return (
    <div className="max-w-4xl ambient-canvas">
      {/* ── 1. Title + Badge + Intro ── */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-3">
          <Badge variant="outline">R3F Hooks</Badge>
        </div>
        <h1 className="text-3xl font-bold tracking-tight mb-3">useLoader</h1>
        <p className="text-lg text-muted-foreground">
          3D scenes need assets -- textures, 3D models, HDR environments, fonts.
          Loading them manually with <code>useEffect</code> and state management
          is tedious and error-prone. <code>useLoader</code> wraps the entire
          process into one line: load, cache, and suspend until ready.
        </p>
      </div>

      {/* ── 2. WhatCouldGoWrong ── */}
      <WhatCouldGoWrong
        scenario={`You load a texture with useEffect and useState. It works fine at first. Then you navigate away and come back -- the texture re-downloads. You mount the same component in two places -- two separate network requests for the same file. Your loading state is a mess of null checks.`}
        error={`Network tab: GET /textures/earth.jpg (2.4 MB) x3
Three separate downloads of the same file.
No caching. No Suspense fallback. Manual null checks everywhere.
Total wasted bandwidth: 4.8 MB.`}
        errorType="Network"
      />

      <Separator className="my-8" />

      {/* ── 3. Story Analogy ── */}
      <ScrollReveal>
        <ConversationalCallout type="story">
          <p>
            Think of useLoader as your personal delivery service -- like
            ordering from Amazon Prime. The first time you order a texture, it
            gets downloaded and stored in a local warehouse (the cache). The
            next time you -- or anyone else in your app -- requests the same
            texture, it arrives instantly from the warehouse. No
            re-downloading.
          </p>
          <p>
            And while you wait for that first delivery, Suspense puts up a nice
            &quot;loading&quot; sign so your visitors never see a broken scene.
          </p>
        </ConversationalCallout>
      </ScrollReveal>

      <Separator className="my-8" />

      {/* ── 4. SimpleFlow ── */}
      <ScrollReveal>
        <h2 className="text-2xl font-bold mb-4">How useLoader Works</h2>
        <SimpleFlow
          steps={[
            { label: "Call useLoader", detail: "Pass loader class + URL" },
            { label: "Check cache", detail: "Already loaded? Return instantly" },
            { label: "Suspend", detail: "Not cached? Throw a Promise" },
            { label: "Suspense catches it", detail: "Shows your fallback UI" },
            { label: "Asset arrives", detail: "Cached globally, component renders", status: "success" },
          ]}
        />
      </ScrollReveal>

      <Separator className="my-8" />

      {/* ── 5. Demo ── */}
      <ScrollReveal>
        <h2 className="text-2xl font-bold mb-4">See It In Action</h2>
        <p className="text-muted-foreground mb-4">
          The demo below loads textures with useLoader. Notice how the Suspense
          fallback appears briefly, then the textured model pops in once the
          assets are ready.
        </p>
      </ScrollReveal>
      <LoaderDemo />

      <Separator className="my-8" />

      {/* ── 6. Guided Walkthrough ── */}
      <ScrollReveal>
        <h2 className="text-2xl font-bold mb-4">Building It Step by Step</h2>

        {/* Step 1 */}
        <div className="rounded-lg border bg-card p-4 mb-4">
          <p className="text-sm font-semibold mb-2">
            Step 1 -- Load a texture in one line
          </p>
          <p className="text-sm text-muted-foreground mb-3">
            Pass the loader class as the first argument and the URL as the
            second. The hook suspends until the asset is ready, then returns it
            directly.
          </p>
          <CodeBlock
            code={`const texture = useLoader(TextureLoader, '/earth.jpg')

return (
  <mesh>
    <sphereGeometry args={[1.5, 64, 64]} />
    <meshStandardMaterial map={texture} />
  </mesh>
)`}
            filename="Earth.tsx"
          />
          <p className="text-sm text-muted-foreground mt-2">
            No null checks, no loading state, no useEffect. The texture is
            guaranteed to exist when the component renders.
          </p>
        </div>

        {/* Step 2 */}
        <div className="rounded-lg border bg-card p-4 mb-4">
          <p className="text-sm font-semibold mb-2">
            Step 2 -- Wrap in Suspense with a fallback
          </p>
          <p className="text-sm text-muted-foreground mb-3">
            While the asset loads, React needs something to show. Wrap your
            component in a Suspense boundary with a 3D fallback -- a wireframe,
            a spinner, or a placeholder shape.
          </p>
          <CodeBlock
            code={`<Canvas>
  <Suspense fallback={<PlaceholderSphere />}>
    <Earth />
  </Suspense>
</Canvas>`}
            filename="App.tsx"
          />
          <p className="text-sm text-muted-foreground mt-2">
            The fallback can be any valid R3F component. Wireframe versions of
            your actual geometry work great for a smooth visual transition.
          </p>
        </div>

        {/* Step 3 */}
        <div className="rounded-lg border bg-card p-4 mb-4">
          <p className="text-sm font-semibold mb-2">
            Step 3 -- Preload and batch for speed
          </p>
          <p className="text-sm text-muted-foreground mb-3">
            Start downloading critical assets before the component mounts. Load
            multiple assets of the same type in parallel by passing an array.
          </p>
          <CodeBlock
            code={`// Preload at module level -- starts immediately
useLoader.preload(GLTFLoader, '/models/character.glb')

// Batch load PBR textures in parallel
const [color, normal, rough] = useLoader(TextureLoader, [
  '/textures/color.jpg',
  '/textures/normal.jpg',
  '/textures/roughness.jpg',
])`}
            filename="Preload.tsx"
          />
          <p className="text-sm text-muted-foreground mt-2">
            Preloading runs at module evaluation time, which is as early as
            possible. Array loading creates a single suspension point for all
            assets instead of loading them one by one.
          </p>
        </div>
      </ScrollReveal>

      <Separator className="my-8" />

      {/* ── 7. WhatYouJustLearned ── */}
      <WhatYouJustLearned
        points={[
          "useLoader loads textures, 3D models, fonts, and HDR environments in one line",
          "Assets are cached globally by URL -- no duplicate downloads",
          "It integrates with React Suspense for declarative loading states",
          "Pass an array of URLs to batch-load multiple assets in parallel",
          "useLoader.preload() starts downloading before the component even mounts",
        ]}
      />

      <Separator className="my-8" />

      {/* ── 8. Question Callout ── */}
      <ScrollReveal>
        <ConversationalCallout type="question">
          <p>
            What about drei&apos;s <code>useGLTF</code> and{" "}
            <code>useTexture</code>? They are convenience wrappers around
            useLoader with extra features. <code>useGLTF</code> auto-configures
            Draco decompression. <code>useTexture</code> accepts a PBR map
            object with named keys. Under the hood, they both use useLoader
            and its cache.
          </p>
        </ConversationalCallout>
      </ScrollReveal>

      <Separator className="my-8" />

      {/* ── 9. AhaMoment ── */}
      <AhaMoment
        setup="If useLoader caches assets globally, what happens when two components load the same texture URL?"
        reveal="Only one network request is made. The first component to call useLoader starts the download and both components suspend. When the asset arrives, it is stored in the global cache keyed by URL. Both components receive the exact same texture object -- not a copy, the same reference. This means zero duplicate memory usage and zero duplicate network requests. It just works."
      />

      <Separator className="my-8" />

      {/* ── 10. MentalModelChallenge ── */}
      <MentalModelChallenge
        question="You have a hero section that loads a 5MB GLTF model. Users see a loading spinner for 3 seconds. How can you eliminate or reduce this wait?"
        options={[
          {
            label: "Use useEffect with TextureLoader for faster loading",
            correct: false,
            explanation:
              "useEffect bypasses caching and Suspense. It doesn't make loading faster -- it just makes the code worse.",
          },
          {
            label: "Call useLoader.preload() at the top of the module",
            correct: true,
            explanation:
              "Preloading starts the download when the module is first imported, which can be seconds before the component renders.",
          },
          {
            label: "Use Draco compression to shrink the file",
            correct: true,
            explanation:
              "Draco can compress GLTF meshes by 5-10x, turning your 5MB file into 500KB-1MB. Less data = faster download.",
          },
        ]}
        answer="Both preloading and Draco compression help. Preloading eliminates the gap between 'component renders' and 'download starts.' Draco shrinks the actual file size. Use both together for the best experience: preload a Draco-compressed GLTF and your users might never see a spinner at all."
      />

      <Separator className="my-8" />

      {/* Try These Challenges */}
      <ScrollReveal>
        <TryThisList challenges={[
          { challenge: "Set roughness to 0 -- mirror sphere!", hint: "Roughness controls how blurry reflections are. Zero means perfectly smooth.", solution: "With roughness at 0, the sphere surface becomes perfectly smooth and mirror-like. It reflects the environment sharply. This works because meshStandardMaterial is physically based -- a smooth surface reflects light without scattering it, just like a real polished surface.", difficulty: "beginner" },
          { challenge: "Set metalness to 1 -- chrome effect!", hint: "Metalness controls how metallic the surface looks. Metals reflect their environment color.", solution: "With metalness at 1, the material behaves like a real metal. Combined with low roughness, you get a chrome look. Metals reflect the environment tint rather than showing their own base color. The texture map still affects the surface but appears through the metallic reflection.", difficulty: "beginner" },
          { challenge: "Speed up orbitSpeed to 5 -- dizzy cube!", hint: "orbitSpeed multiplies the rotation delta in the useFrame callback.", solution: "The cube spins 5x faster than the default speed. Since the animation uses delta-based rotation (speed * delta), it remains frame-rate independent even at high speeds. The spinning is smooth because useFrame mutates the ref directly without triggering React re-renders.", difficulty: "beginner" },
        ]} />
      </ScrollReveal>

      <Separator className="my-8" />

      {/* ── 11. CommonMistakes ── */}
      <ScrollReveal>
        <CommonMistakes mistakes={mistakes} />
      </ScrollReveal>

      <Separator className="my-8" />

      {/* ── 12. Best Practices ── */}
      <ScrollReveal>
        <section className="space-y-4">
          <h2 className="text-2xl font-bold">Best Practices</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-lg border bg-card p-4 space-y-2">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="size-4 text-green-500" />
                <h3 className="font-semibold text-sm">Always wrap in Suspense</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Every component using useLoader needs a{" "}
                <code>&lt;Suspense&gt;</code> ancestor with a fallback.
                Wireframe placeholders work great.
              </p>
            </div>
            <div className="rounded-lg border bg-card p-4 space-y-2">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="size-4 text-green-500" />
                <h3 className="font-semibold text-sm">Preload critical assets</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Call <code>useLoader.preload()</code> at module level for
                assets needed on the first screen. Downloads start before
                React even renders.
              </p>
            </div>
            <div className="rounded-lg border bg-card p-4 space-y-2">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="size-4 text-green-500" />
                <h3 className="font-semibold text-sm">Use Draco compression</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Draco compresses GLTF models by 5-10x. drei&apos;s{" "}
                <code>useGLTF</code> sets up Draco automatically.
              </p>
            </div>
            <div className="rounded-lg border bg-card p-4 space-y-2">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="size-4 text-green-500" />
                <h3 className="font-semibold text-sm">Batch same-type loads</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Pass an array of URLs to load multiple assets in parallel.
                This creates a single suspension point and is more efficient.
              </p>
            </div>
          </div>
        </section>
      </ScrollReveal>
    </div>
  );
}
