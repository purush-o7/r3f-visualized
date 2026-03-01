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

const RenderTargetDemoComponent = dynamic(
  () =>
    import("./_components/render-target-demo").then((m) => ({
      default: m.RenderTargetDemo,
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
    title: "Render target shows a blank black texture",
    subtitle: "Forgot to reset the render target after rendering",
    wrongCode: `useFrame(({ gl, scene, camera }) => {
  // Render to the texture
  gl.setRenderTarget(renderTarget);
  gl.render(portalScene, portalCamera);
  // FORGOT to set render target back to null!
  // The main scene now renders to the texture too
  // Screen shows nothing or the wrong scene
});`,
    rightCode: `useFrame(({ gl, scene, camera }) => {
  // Render to the texture
  gl.setRenderTarget(renderTarget);
  gl.render(portalScene, portalCamera);
  // ALWAYS reset to null so the main render
  // goes to the screen
  gl.setRenderTarget(null);
});`,
    filename: "Portal.tsx",
    explanation:
      "After rendering to a render target, the GPU is still pointed at that texture buffer. If you do not call gl.setRenderTarget(null), the main scene also renders into the texture instead of the screen. Always reset to null when done.",
  },
  {
    title: "Infinite recursion when rendering a mirror",
    subtitle: "The mirror scene includes the mirror itself",
    wrongCode: `// The mirror material uses the render target texture
// But the scene that renders INTO the target
// also contains the mirror mesh — infinite loop!
useFrame(({ gl, scene, camera }) => {
  gl.setRenderTarget(renderTarget);
  gl.render(scene, mirrorCamera); // renders mirror too!
  gl.setRenderTarget(null);
});`,
    rightCode: `// Hide the mirror mesh before rendering to target
useFrame(({ gl, scene, camera }) => {
  mirrorMesh.visible = false;
  gl.setRenderTarget(renderTarget);
  gl.render(scene, mirrorCamera);
  gl.setRenderTarget(null);
  mirrorMesh.visible = true;
});
// Or use a separate scene (createPortal)`,
    filename: "Mirror.tsx",
    explanation:
      "If the mirror is part of the scene being rendered to its own texture, you get infinite recursion (or at best, a visual artifact). Either hide the mirror mesh before the off-screen render, or use R3F's createPortal to keep the portal scene separate.",
  },
  {
    title: "Render target texture looks blurry or pixelated",
    subtitle: "Resolution is too low for the display size",
    wrongCode: `// Tiny render target on a large surface
const rt = new THREE.WebGLRenderTarget(64, 64);
// 64x64 texture stretched over a large plane
// Result: extremely pixelated`,
    rightCode: `// Match resolution to the visual size
const rt = new THREE.WebGLRenderTarget(512, 512);
// For retina: multiply by window.devicePixelRatio
// For performance: 256-512 is usually good enough
// Higher = sharper but more expensive`,
    filename: "RenderTarget.tsx",
    explanation:
      "The render target resolution determines the texture quality. 64x64 stretched over a large surface looks blocky. 512x512 is a good balance. For mirrors and portals where quality matters, go to 1024. Each doubling quadruples the pixel count and rendering cost.",
  },
];

export default function RenderTargetsPage() {
  return (
    <div className="max-w-4xl">
      {/* 1. Title + Badge + Intro */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-3">
          <Badge variant="outline">Particles & Lines</Badge>
        </div>
        <h1 className="text-3xl font-bold tracking-tight mb-3">
          Render Targets
        </h1>
        <p className="text-lg text-muted-foreground">
          Normally, the renderer draws your scene directly to the screen. But
          what if you could render to a texture instead? That is what render
          targets do. They let you capture a scene as an image and display it
          on any surface — creating mirrors, portals, security cameras,
          minimaps, and picture-in-picture effects.
        </p>
      </div>

      {/* 2. What Could Go Wrong */}
      <WhatCouldGoWrong
        scenario="You set up a render target and render a portal scene to it. The texture appears on your surface, but the main scene disappears — the screen is blank. You check the portal scene and it renders perfectly. The problem? You forgot to call gl.setRenderTarget(null) after the off-screen render."
        error="Main scene disappears. Only the render target content is visible, or the screen is entirely black."
        errorType="Render Target Not Reset"
      />

      <Separator className="my-8" />

      {/* 3. Story Analogy */}
      <ScrollReveal>
        <ConversationalCallout type="story">
          <p>
            Think of render targets as <strong>picture-in-picture</strong> on
            your TV.
          </p>
          <p>
            Your main screen shows the live game. But in the corner, a small
            window shows a different camera angle — maybe a security feed, or
            a rear-view mirror, or a minimap. That small window is rendered
            separately and then displayed as an image within the main image.
          </p>
          <p>
            In Three.js terms: you set up a second camera looking at a second
            scene (or the same scene from a different angle). You render that
            view <strong>into a texture</strong> instead of to the screen.
            Then you slap that texture onto any surface — a TV screen, a
            mirror, a magic portal, anything.
          </p>
          <p>
            The key insight: a render target is just a texture that gets
            re-painted every frame instead of being loaded from an image file.
          </p>
        </ConversationalCallout>
      </ScrollReveal>

      <Separator className="my-8" />

      {/* 4. SimpleFlow */}
      <ScrollReveal>
        <section className="space-y-4">
          <h2 className="text-2xl font-bold">How Render Targets Work</h2>
          <p className="text-muted-foreground leading-relaxed">
            The rendering pipeline with an off-screen pass.
          </p>
          <SimpleFlow
            steps={[
              {
                label: "Create Target",
                detail: "WebGLRenderTarget with width x height",
              },
              {
                label: "Render to Target",
                detail: "gl.setRenderTarget(rt) then gl.render()",
              },
              {
                label: "Reset to Screen",
                detail: "gl.setRenderTarget(null)",
                status: "success",
              },
              {
                label: "Use as Texture",
                detail: "rt.texture on any material's map prop",
                status: "success",
              },
            ]}
            accentColor="purple"
          />
        </section>
      </ScrollReveal>

      <Separator className="my-8" />

      {/* 5. Interactive Demo */}
      <RenderTargetDemoComponent />

      <Separator className="my-8" />

      {/* 6. Guided Walkthrough */}
      <ScrollReveal>
        <section className="space-y-6">
          <h2 className="text-2xl font-bold">
            Building a Portal TV Step by Step
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            Let us render a mini scene onto a surface — like a TV showing a
            live camera feed from another world.
          </p>

          <div className="bg-card border rounded-lg p-4 space-y-3">
            <h3 className="font-semibold text-sm">
              Step 1 -- Create the render target and camera
            </h3>
            <CodeBlock
              code={`import * as THREE from "three";
import { useMemo } from "react";

const renderTarget = useMemo(() => {
  return new THREE.WebGLRenderTarget(512, 512, {
    format: THREE.RGBAFormat,
    stencilBuffer: false,
  });
}, []);

const portalCamera = useMemo(() => {
  const cam = new THREE.PerspectiveCamera(50, 1, 0.1, 100);
  cam.position.set(0, 0, 3);
  return cam;
}, []);`}
              filename="PortalTV.tsx"
            />
            <p className="text-sm text-muted-foreground">
              The render target is a GPU texture buffer — 512 by 512 pixels.
              We also create a separate camera for the portal scene. This
              camera determines what the portal &quot;sees.&quot;
            </p>
          </div>

          <div className="bg-card border rounded-lg p-4 space-y-3">
            <h3 className="font-semibold text-sm">
              Step 2 -- Create a separate scene with createPortal
            </h3>
            <CodeBlock
              code={`import { createPortal } from "@react-three/fiber";

const portalScene = useMemo(
  () => new THREE.Scene(), []
);

// In your JSX, portal content lives in a
// separate scene graph:
{createPortal(
  <>
    <ambientLight intensity={0.5} />
    <mesh>
      <icosahedronGeometry />
      <meshStandardMaterial color="hotpink" />
    </mesh>
  </>,
  portalScene
)}`}
              filename="PortalTV.tsx"
            />
            <p className="text-sm text-muted-foreground">
              createPortal renders React children into a different Three.js
              scene. This keeps the portal content completely separate from
              your main scene, avoiding infinite loops.
            </p>
          </div>

          <div className="bg-card border rounded-lg p-4 space-y-3">
            <h3 className="font-semibold text-sm">
              Step 3 -- Render the portal scene to the texture every frame
            </h3>
            <CodeBlock
              code={`import { useFrame } from "@react-three/fiber";

useFrame(({ gl }) => {
  // 1. Render portal scene to the texture
  gl.setRenderTarget(renderTarget);
  gl.render(portalScene, portalCamera);

  // 2. CRITICAL: reset so main scene goes to screen
  gl.setRenderTarget(null);
});`}
              filename="PortalTV.tsx"
            />
            <p className="text-sm text-muted-foreground">
              Every frame, we redirect the renderer to paint the portal scene
              into our texture. Then we reset to null so the main scene
              renders to the screen as usual. Forgetting this reset is the
              number one render target bug.
            </p>
          </div>

          <div className="bg-card border rounded-lg p-4 space-y-3">
            <h3 className="font-semibold text-sm">
              Step 4 -- Display the texture on a surface
            </h3>
            <CodeBlock
              code={`{/* The TV screen showing the portal */}
<mesh position={[0, 1, 0]}>
  <planeGeometry args={[2, 1.5]} />
  <meshBasicMaterial map={renderTarget.texture} />
</mesh>`}
              filename="PortalTV.tsx"
            />
            <p className="text-sm text-muted-foreground">
              renderTarget.texture is a live texture that updates every frame.
              We use it as the map on a material, just like any static
              texture. The surface now shows a live view of the portal scene.
            </p>
          </div>
        </section>
      </ScrollReveal>

      <Separator className="my-8" />

      {/* 7. What You Just Learned */}
      <ScrollReveal>
        <WhatYouJustLearned
          points={[
            "WebGLRenderTarget creates an off-screen texture buffer that the renderer can paint into instead of the screen.",
            "Always call gl.setRenderTarget(null) after your off-screen render — otherwise the main scene renders to the texture too.",
            "createPortal keeps portal content in a separate scene graph, preventing infinite recursion in mirrors.",
            "renderTarget.texture is a live texture that updates every frame — use it as a map on any material.",
          ]}
        />
      </ScrollReveal>

      <Separator className="my-8" />

      {/* 8. Thought-Provoking Question */}
      <ScrollReveal>
        <ConversationalCallout type="question">
          <p>
            A render target essentially doubles your rendering work — you
            render the portal scene plus the main scene every frame. What if
            you need four security camera feeds? That is five full scene
            renders per frame. How would you manage the performance cost?
          </p>
        </ConversationalCallout>
      </ScrollReveal>

      <Separator className="my-8" />

      {/* 9. Aha Moment */}
      <ScrollReveal>
        <AhaMoment
          setup="Why do we need a separate scene (createPortal) for the portal content? Could we just render the main scene from a different camera angle?"
          reveal="You can render the main scene from a different camera — that is how mirrors work. But for portals showing a 'different world,' you need different content. More importantly, if the main scene contains the surface that displays the render target texture, rendering the main scene into its own texture creates a feedback loop — the texture shows itself showing itself infinitely. createPortal solves this by putting the portal content in a completely separate scene graph that does not include the display surface."
        />
      </ScrollReveal>

      <Separator className="my-8" />

      {/* 10. Mental Model Challenge */}
      <ScrollReveal>
        <MentalModelChallenge
          question="You set up a render target and your portal scene renders correctly. But the main scene is gone — the screen is completely black. What is the most likely cause?"
          options={[
            {
              label: "The render target resolution is too low",
              correct: false,
              explanation:
                "Low resolution would make the texture blurry, not make the main scene disappear.",
            },
            {
              label: "The portal camera is positioned wrong",
              correct: false,
              explanation:
                "A wrong camera position affects the portal texture content, not the main scene rendering.",
            },
            {
              label: "gl.setRenderTarget(null) was not called after the portal render",
              correct: true,
              explanation:
                "Without resetting to null, the main scene also renders into the texture instead of the screen.",
            },
            {
              label: "The portal scene has no lights",
              correct: false,
              explanation:
                "Missing lights would make the portal dark, not make the main scene disappear.",
            },
          ]}
          answer="You forgot gl.setRenderTarget(null) after the off-screen render. When the render target is still active, the main scene renders into the texture buffer instead of the screen. The screen gets nothing. Always reset to null immediately after rendering to the target."
        />
      </ScrollReveal>

      <Separator className="my-8" />

      {/* Try This */}
      <Separator className="my-8" />
      <ScrollReveal>
        <TryThisList challenges={[
          { challenge: "Set resolution to 64 — pixel art TV!", hint: "Lower the render target resolution to 64x64.", solution: "The portal texture becomes extremely pixelated, like a retro CRT monitor or pixel art display.", difficulty: "beginner" },
          { challenge: "Set resolution to 1024 — crispy", hint: "Increase the render target resolution to 1024.", solution: "The portal texture becomes sharp and detailed. Notice the increased rendering cost in the performance monitor.", difficulty: "beginner" },
          { challenge: "Toggle portal — blank screen", hint: "Disable the portal rendering toggle.", solution: "The display surface goes blank because no scene is being rendered to the render target texture.", difficulty: "beginner" },
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
                  Always reset to null
                </h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Call gl.setRenderTarget(null) immediately after your
                off-screen render. Make it a habit — this is the single most
                common render target bug.
              </p>
            </div>
            <div className="rounded-lg border bg-card p-4 space-y-2">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="size-4 text-green-500" />
                <h3 className="font-semibold text-sm">
                  Use createPortal for separate scenes
                </h3>
              </div>
              <p className="text-sm text-muted-foreground">
                R3F&apos;s createPortal renders React children into a separate
                Three.js scene, keeping portal content isolated and preventing
                recursive rendering issues.
              </p>
            </div>
            <div className="rounded-lg border bg-card p-4 space-y-2">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="size-4 text-green-500" />
                <h3 className="font-semibold text-sm">
                  Balance resolution vs performance
                </h3>
              </div>
              <p className="text-sm text-muted-foreground">
                512x512 is a solid default for most portals. Use 256 for
                distant or small surfaces. Only go to 1024 for large, close-up
                mirrors. Each step up quadruples the pixel count.
              </p>
            </div>
            <div className="rounded-lg border bg-card p-4 space-y-2">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="size-4 text-green-500" />
                <h3 className="font-semibold text-sm">
                  Skip frames for distant portals
                </h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Not every render target needs to update every frame. For a
                security camera far away, updating every 2nd or 3rd frame cuts
                the cost without a noticeable visual difference.
              </p>
            </div>
          </div>
        </section>
      </ScrollReveal>
    </div>
  );
}
