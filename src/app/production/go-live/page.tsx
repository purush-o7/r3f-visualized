"use client";

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
import { CheckCircle2 } from "lucide-react";

const mistakes: Mistake[] = [
  {
    title: "Importing all of Three.js",
    subtitle: "Your bundle includes 600KB of unused geometry types",
    wrongCode: `import * as THREE from 'three'

// Only using Vector3 and Color, but shipping
// the entire Three.js library to every user
const pos = new THREE.Vector3()
const col = new THREE.Color('#ff0000')`,
    rightCode: `// Named imports let bundlers tree-shake unused code
import { Vector3, Color } from 'three'

const pos = new Vector3()
const col = new Color('#ff0000')

// Or if you need many imports, use the namespace
// but configure your bundler for tree-shaking
import {
  Vector3, Color, MathUtils,
  ACESFilmicToneMapping
} from 'three'`,
    filename: "TreeShaking.tsx",
    explanation:
      "import * as THREE pulls in the entire Three.js module (~600KB unminified). Modern bundlers like webpack and esbuild can tree-shake named imports, including only the classes you actually use. For a typical R3F app, this can save 200-400KB from the bundle. Some Three.js classes pull in dependencies (like loaders), so check your bundle analyzer output.",
  },
  {
    title: "Not using dynamic imports for heavy scenes",
    subtitle: "Initial page load includes 3D code the user may never see",
    wrongCode: `// page.tsx — this loads immediately even if user
// never scrolls to the 3D section
import { HeavyScene } from './HeavyScene'

export default function Page() {
  return (
    <div>
      <Hero />
      <Features />
      <HeavyScene />  {/* 500KB component */}
    </div>
  )
}`,
    rightCode: `import dynamic from 'next/dynamic'

// Only loads when the component enters the viewport
const HeavyScene = dynamic(
  () => import('./HeavyScene'),
  {
    ssr: false,  // Three.js needs the browser
    loading: () => <div className="skeleton" />,
  }
)

export default function Page() {
  return (
    <div>
      <Hero />
      <Features />
      <HeavyScene />  {/* Code-split — loads on demand */}
    </div>
  )
}`,
    filename: "DynamicImport.tsx",
    explanation:
      "Dynamic imports create a separate JavaScript chunk that only loads when the component is needed. For R3F, this is critical because Three.js, your 3D code, and any loaders can easily be 500KB+. Users who never scroll to the 3D section never download it. Always set ssr: false for Three.js components -- they require the browser's WebGL context.",
  },
  {
    title: "Deploying without testing on mobile",
    subtitle: "Works on desktop, crashes on phones with 2GB RAM",
    wrongCode: `// No device testing — assuming desktop performance
<Canvas>
  <Model />  {/* 50MB uncompressed GLTF */}
  <Shadows />
  <PostProcessing />
  <Particles count={100000} />
</Canvas>`,
    rightCode: `import { useDetectGPU } from '@react-three/drei'

function AdaptiveScene() {
  const gpu = useDetectGPU()
  const isMobile = gpu.tier < 2

  return (
    <Canvas
      dpr={isMobile ? [1, 1.5] : [1, 2]}
      shadows={!isMobile}
    >
      <Model quality={isMobile ? 'low' : 'high'} />
      {!isMobile && <PostProcessing />}
      <Particles count={isMobile ? 1000 : 100000} />
    </Canvas>
  )
}`,
    filename: "AdaptiveRendering.tsx",
    explanation:
      "Mobile GPUs have a fraction of the power of desktop GPUs. A scene that runs at 60fps on a MacBook may crash an Android phone. Use @react-three/drei's useDetectGPU to check the GPU tier at runtime and adjust quality: lower pixel ratio, disable shadows, reduce particle count, and skip post-processing on low-tier devices.",
  },
];

export default function GoLivePage() {
  return (
    <div className="max-w-4xl">
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-3">
          <Badge variant="outline">Production</Badge>
        </div>
        <h1 className="text-3xl font-bold tracking-tight mb-3">
          Go Live
        </h1>
        <p className="text-lg text-muted-foreground">
          Your R3F app works beautifully on localhost. Now you need to ship
          it to real users on real devices over real networks. Deployment is
          not just &quot;push to Vercel&quot; -- it is the difference between
          a 2-second load and a 12-second load.
        </p>
      </div>

      {/* What Could Go Wrong */}
      <WhatCouldGoWrong
        scenario="You deploy your R3F app to Vercel. It works on your laptop. Then your client opens it on their phone over 4G. The page takes 15 seconds to load, the 3D scene stutters at 8fps, and the browser crashes after 30 seconds. Your Lighthouse score is 23."
        error="Deploy: Bundle size 2.4MB (uncompressed) | LCP: 8.2s | FPS on mobile: 8 | Memory: 450MB (phone limit: 512MB) | Lighthouse: 23/100"
        errorType="Production"
        accentColor="red"
      />

      <Separator className="my-8" />

      {/* Story Analogy */}
      <ConversationalCallout type="story">
        <p>
          Think of deployment like <strong>launching a rocket</strong>.
        </p>
        <p>
          <strong>Pre-flight checks</strong> (build optimization) ensure nothing
          is broken. <strong>Fuel efficiency</strong> (bundle size) determines
          how far you can go. The <strong>launch pad</strong> (hosting platform)
          must match your rocket. And <strong>mission control</strong>{" "}
          (monitoring) tells you if something goes wrong in orbit.
        </p>
        <p>
          One bad setting -- an uncompressed texture, an unoptimized import,
          a missing environment variable -- can abort the entire mission.
        </p>
      </ConversationalCallout>

      <Separator className="my-8" />

      {/* Mental Model Flow */}
      <SimpleFlow
        steps={[
          { label: "Build", detail: "next build" },
          { label: "Analyze", detail: "Bundle size check" },
          { label: "Optimize", detail: "Tree-shake, split" },
          { label: "Deploy", detail: "Vercel / Netlify" },
          { label: "Monitor", detail: "Lighthouse, errors", status: "success" },
        ]}
        accentColor="green"
      />

      <Separator className="my-8" />

      {/* Step 1: Build Optimization */}
      <ScrollReveal>
        <section className="space-y-4">
          <h2 className="text-2xl font-bold">
            Step 1: Build & Bundle Optimization
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            The build step transforms your development code into optimized
            production assets. Every kilobyte matters -- especially for
            3D apps where Three.js alone is substantial.
          </p>

          <div className="rounded-lg border bg-card p-4 space-y-3">
            <p className="text-sm font-medium">
              Tree-shake Three.js imports
            </p>
            <CodeBlock
              code={`// Before: imports entire Three.js (~600KB)
import * as THREE from 'three'

// After: imports only what you use (~50KB typical)
import { Vector3, Color, MathUtils } from 'three'
import { ACESFilmicToneMapping, SRGBColorSpace } from 'three'

// R3F and drei already tree-shake internally,
// but YOUR code must use named imports too`}
              filename="TreeShake.ts"
            />
            <p className="text-sm text-muted-foreground">
              Named imports let the bundler eliminate unused code. A typical
              R3F app only uses 10-15% of Three.js classes. Tree-shaking can
              save 200-400KB from your final bundle.
            </p>
          </div>

          <div className="rounded-lg border bg-card p-4 space-y-3">
            <p className="text-sm font-medium">
              Dynamic imports for code splitting
            </p>
            <CodeBlock
              code={`import dynamic from 'next/dynamic'

// Three.js code is split into a separate chunk
const Scene3D = dynamic(
  () => import('@/features/scene/Scene3D'),
  {
    ssr: false,  // Required — Three.js needs WebGL
    loading: () => (
      <div className="h-screen bg-black animate-pulse" />
    ),
  }
)

// Users who never scroll to the 3D section
// never download Three.js at all`}
              filename="CodeSplit.tsx"
            />
            <p className="text-sm text-muted-foreground">
              Dynamic imports create separate JavaScript chunks. For an R3F
              landing page where the 3D scene is below the fold, this means
              the critical path only includes your HTML and CSS. The 3D code
              loads on demand.
            </p>
          </div>

          <div className="rounded-lg border bg-card p-4 space-y-3">
            <p className="text-sm font-medium">
              Analyze your bundle
            </p>
            <CodeBlock
              code={`# Install the analyzer
npm install @next/bundle-analyzer

# next.config.js
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
})
module.exports = withBundleAnalyzer(nextConfig)

# Run the analysis
ANALYZE=true npm run build

# Look for:
# - three.js: should be <200KB gzipped
# - Duplicate dependencies
# - Unused packages`}
              filename="bundle-analysis"
            />
            <p className="text-sm text-muted-foreground">
              Bundle analysis shows you exactly what is in your production
              build. Common findings: duplicate three.js copies (from
              different versions), unused drei helpers, and development-only
              packages that snuck into production.
            </p>
          </div>
        </section>
      </ScrollReveal>

      <Separator className="my-8" />

      {/* Step 2: Asset Optimization */}
      <ScrollReveal>
        <section className="space-y-4">
          <h2 className="text-2xl font-bold">
            Step 2: Asset Optimization
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            3D assets (models, textures, HDR maps) are often larger than
            your entire JavaScript bundle. Compressing them is the highest
            impact optimization you can make.
          </p>

          <div className="rounded-lg border bg-card p-4 space-y-3">
            <p className="text-sm font-medium">
              Compress models and textures
            </p>
            <CodeBlock
              code={`# Compress GLTF models with Draco (70-90% smaller)
npx gltf-pipeline -i model.glb -o model-draco.glb -d

# Compress textures to KTX2/Basis (4-6x smaller)
npx toktx --t2 --bcmp output.ktx2 input.png

# In your R3F code, use the Draco decoder
import { useGLTF } from '@react-three/drei'
// drei auto-detects Draco and loads the decoder

# Asset size targets:
# - GLTF models: < 1MB after Draco
# - Textures: < 500KB each (KTX2)
# - HDR maps: < 2MB (use compressed .hdr or .exr)
# - Total scene: < 5MB for fast mobile loading`}
              filename="asset-compression"
            />
            <p className="text-sm text-muted-foreground">
              Draco compression reduces GLTF geometry by 70-90%. KTX2/Basis
              textures are GPU-compressed, meaning they stay compressed even
              in video memory. Combine both for scenes that load fast and
              use less GPU RAM.
            </p>
          </div>

          <div className="rounded-lg border bg-card p-4 space-y-3">
            <p className="text-sm font-medium">
              Serve assets from a CDN
            </p>
            <CodeBlock
              code={`// Store heavy assets on a CDN, not in your repo
// Vercel, Cloudflare R2, or AWS S3 + CloudFront

const MODEL_URL = process.env.NEXT_PUBLIC_CDN_URL
  + '/models/car-draco.glb'

function CarModel() {
  const { scene } = useGLTF(MODEL_URL)
  return <primitive object={scene} />
}

// next.config.js — set proper cache headers
const nextConfig = {
  async headers() {
    return [{
      source: '/assets/:path*',
      headers: [
        { key: 'Cache-Control',
          value: 'public, max-age=31536000, immutable' }
      ],
    }]
  },
}`}
              filename="CDN.tsx"
            />
            <p className="text-sm text-muted-foreground">
              CDNs serve assets from the edge node closest to the user.
              A 2MB model that takes 4 seconds from your origin server
              might take 400ms from a CDN. Set immutable cache headers so
              returning visitors never re-download unchanged assets.
            </p>
          </div>
        </section>
      </ScrollReveal>

      <Separator className="my-8" />

      {/* Step 3: Deployment */}
      <ScrollReveal>
        <section className="space-y-4">
          <h2 className="text-2xl font-bold">
            Step 3: Deployment
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            Vercel and Netlify are the most common hosts for Next.js + R3F
            apps. Both handle builds, CDN distribution, and HTTPS
            automatically.
          </p>

          <div className="rounded-lg border bg-card p-4 space-y-3">
            <p className="text-sm font-medium">
              Vercel deployment checklist
            </p>
            <CodeBlock
              code={`# 1. Environment variables
# Set in Vercel dashboard, NOT in .env files
NEXT_PUBLIC_CDN_URL=https://assets.example.com

# 2. Build command (automatic for Next.js)
next build

# 3. Common gotchas:
# - ssr: false on all dynamic Three.js imports
# - process.env.NODE_ENV auto-set to 'production'
# - Remove r3f-perf and Leva in production:
{process.env.NODE_ENV === 'development' && <Perf />}

# 4. Verify output
# - Check Functions tab for serverless function size
# - Check Edge Network for static asset caching
# - Run Lighthouse on the deployed URL`}
              filename="vercel-deploy"
            />
            <p className="text-sm text-muted-foreground">
              Vercel auto-detects Next.js and handles the build. The main
              things to verify: environment variables are set, Three.js
              components use ssr: false, and development tools like r3f-perf
              are conditionally excluded from production bundles.
            </p>
          </div>

          <div className="rounded-lg border bg-card p-4 space-y-3">
            <p className="text-sm font-medium">
              Production environment checks
            </p>
            <CodeBlock
              code={`// Remove debug tools in production
const isDev = process.env.NODE_ENV === 'development'

function Scene() {
  return (
    <Canvas>
      {isDev && <Perf position="top-left" />}
      {isDev && <axesHelper args={[5]} />}
      {isDev && <gridHelper args={[10, 10]} />}
      <MyScene />
    </Canvas>
  )
}

// Leva panels — hide in production
<Leva hidden={!isDev} />`}
              filename="ProdChecks.tsx"
            />
            <p className="text-sm text-muted-foreground">
              Development tools add overhead: r3f-perf polls performance
              stats every frame, Leva creates DOM elements, and helpers add
              draw calls. Gate them behind NODE_ENV checks so they are
              tree-shaken out of the production build entirely.
            </p>
          </div>
        </section>
      </ScrollReveal>

      <Separator className="my-8" />

      {/* What You Just Learned */}
      <WhatYouJustLearned
        points={[
          "Named imports from 'three' enable tree-shaking — saving 200-400KB vs import * as THREE.",
          "Dynamic imports with ssr: false code-split Three.js so it only loads when needed.",
          "Draco-compressed GLTF models are 70-90% smaller. KTX2 textures are 4-6x smaller.",
          "CDN hosting with immutable cache headers eliminates re-downloads for returning visitors.",
          "Gate development tools (r3f-perf, Leva, helpers) behind NODE_ENV so they are removed from production builds.",
        ]}
      />

      <Separator className="my-8" />

      {/* Question */}
      <ConversationalCallout type="question">
        <p>
          Your R3F app has a Lighthouse performance score of 45. The main
          issues are: LCP of 6.2 seconds and Total Blocking Time of 1.8
          seconds. The 3D scene is below the fold. What is the single
          highest-impact fix?
        </p>
      </ConversationalCallout>

      <Separator className="my-8" />

      {/* Aha Moment */}
      <AhaMoment
        setup="Developers obsess over render performance — draw calls, frame rates, GPU utilization. They spend days shaving milliseconds off each frame. But for most R3F apps, the real production bottleneck is not render speed..."
        reveal="It is load speed. Users cannot see your 60fps scene if they leave before it loads. A 2.4MB JavaScript bundle takes 12 seconds to parse on a mid-range phone. Draco compression on models, KTX2 textures, dynamic imports, and CDN hosting can cut your total load time from 12 seconds to 2 seconds. That is a 6x improvement without touching a single line of your rendering code. Optimize for load first, render second. The fastest frame is the one that actually gets seen."
      />

      <Separator className="my-8" />

      {/* Mental Model Challenge */}
      <MentalModelChallenge
        question="You deploy an R3F app. Bundle analysis shows three.js appearing twice in your build — once at 580KB and once at 320KB. What is the most likely cause, and how do you fix it?"
        options={[
          {
            label: "A bug in webpack — rebuild with a clean cache",
            correct: false,
            explanation:
              "Duplicate bundles are almost always caused by version mismatches, not bundler bugs.",
          },
          {
            label: "Two packages depend on different three.js versions, causing duplicate bundles",
            correct: true,
            explanation:
              "If @react-three/fiber uses three@0.160 and a post-processing library uses three@0.155, the bundler includes both versions. Fix with npm dedupe or resolutions in package.json.",
          },
          {
            label: "Three.js is too large to fit in one chunk, so the bundler splits it",
            correct: false,
            explanation:
              "Bundlers do not split a single library across chunks based on size. Chunk splitting is based on import boundaries, not file size.",
          },
          {
            label: "One copy is for the server, one for the client",
            correct: false,
            explanation:
              "Three.js should never be in the server bundle if you use ssr: false. Both copies appear in the client bundle in this scenario.",
          },
        ]}
        hint="What happens when two npm packages list different versions of the same dependency?"
        answer={`When two packages depend on different three.js versions, npm installs both. The bundler cannot deduplicate them because they are different code. Fix this with npm dedupe, or add a resolutions field in package.json to force a single version: {"resolutions": {"three": "0.160.0"}}. After fixing, verify with your bundle analyzer that only one copy remains. This alone can save 300-500KB.`}
      />

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
                <h3 className="font-semibold text-sm">Run Lighthouse Before Shipping</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Run Lighthouse on your deployed URL, not localhost. Aim for
                Performance above 70, LCP under 2.5 seconds, and TBT under
                200ms. R3F apps rarely hit 100 due to WebGL overhead, but
                70+ is achievable with proper optimization.
              </p>
            </div>
            <div className="rounded-lg border bg-card p-4 space-y-2">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="size-4 text-green-500" />
                <h3 className="font-semibold text-sm">Test on Real Devices</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Chrome DevTools device simulation does not emulate GPU
                limitations. Test on an actual mid-range Android phone
                (Samsung A-series or Pixel 6a). If it runs smoothly there,
                it will run smoothly everywhere.
              </p>
            </div>
            <div className="rounded-lg border bg-card p-4 space-y-2">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="size-4 text-green-500" />
                <h3 className="font-semibold text-sm">
                  Set Up Error Monitoring
                </h3>
              </div>
              <p className="text-sm text-muted-foreground">
                WebGL context loss, shader compilation failures, and
                out-of-memory crashes happen in production. Use Sentry or a
                similar service with a custom error boundary around your
                Canvas to catch and report these issues.
              </p>
            </div>
            <div className="rounded-lg border bg-card p-4 space-y-2">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="size-4 text-green-500" />
                <h3 className="font-semibold text-sm">
                  Add a WebGL Fallback
                </h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Not all browsers support WebGL2. Wrap your Canvas in an
                error boundary that shows a static image or message when
                WebGL is unavailable. This prevents blank pages on older
                devices and in corporate environments with GPU restrictions.
              </p>
            </div>
          </div>
        </section>
      </ScrollReveal>
    </div>
  );
}
