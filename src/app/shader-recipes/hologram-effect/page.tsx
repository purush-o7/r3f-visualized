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

const HologramDemo = dynamic(
  () =>
    import("./_components/hologram-demo").then((m) => ({
      default: m.HologramDemo,
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
    title: "Fresnel calculation using model-space normal",
    subtitle: "The dot product needs world-space vectors to work correctly",
    wrongCode: `// In fragment shader:
vec3 viewDir = normalize(
  cameraPosition - vPosition // model space!
);
float fresnel = pow(
  1.0 - dot(viewDir, normal), 2.0
);
// Fresnel rotates with the object!`,
    rightCode: `// In vertex shader:
vNormal = normalize(normalMatrix * normal);
vec4 wp = modelMatrix * vec4(position, 1.0);
vWorldPosition = wp.xyz;

// In fragment shader:
vec3 viewDir = normalize(
  cameraPosition - vWorldPosition
);
float fresnel = pow(
  1.0 - abs(dot(viewDir, vNormal)), 2.0
);`,
    filename: "Hologram.tsx",
    explanation:
      "cameraPosition is in world space, so you must also transform the vertex position and normal to world space before computing the dot product. Using model-space position creates a fresnel that rotates with the object instead of staying fixed relative to the camera.",
  },
  {
    title: "Missing additive blending for glow",
    subtitle: "Default blending makes the hologram look like frosted glass",
    wrongCode: `<shaderMaterial
  transparent
  // Using default NormalBlending
  vertexShader={vs}
  fragmentShader={fs}
/>
// Looks opaque and solid, not glowing`,
    rightCode: `<shaderMaterial
  transparent
  depthWrite={false}
  blending={THREE.AdditiveBlending}
  vertexShader={vs}
  fragmentShader={fs}
/>
// Overlapping parts glow brighter!`,
    filename: "Hologram.tsx",
    explanation:
      "Additive blending adds the fragment color to whatever is behind it instead of replacing it. This makes overlapping transparent parts glow brighter, which is essential for the holographic look. Also set depthWrite={false} so back faces render through front faces.",
  },
  {
    title: "Scanlines not moving because uTime is missing",
    subtitle: "The shader compiles but scanlines are frozen in place",
    wrongCode: `// Fragment shader:
float scanline = step(0.5,
  sin(vPosition.y * 20.0) * 0.5 + 0.5
);
// Static stripes -- not animated!`,
    rightCode: `// Fragment shader:
float scanline = step(0.5,
  sin(vPosition.y * uScanlineCount
    + uTime * uScanlineSpeed) * 0.5 + 0.5
);
// Scanlines scroll upward!`,
    filename: "fragment.glsl",
    explanation:
      "Without adding uTime to the sine input, the scanlines are computed from a fixed position and never change. Adding uTime * speed offsets the sine wave each frame, creating the scrolling scan line effect. Make sure uTime is updated in useFrame.",
  },
];

export default function HologramEffectPage() {
  return (
    <div className="relative max-w-4xl">
      <div className="absolute -top-10 -left-10 w-72 h-72 bg-gradient-to-br from-teal-500/10 via-emerald-500/10 to-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
      {/* 1. Title */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-3">
          <Badge variant="outline">Shader Recipes</Badge>
        </div>
        <h1 className="text-3xl font-bold tracking-tight mb-3">
          Hologram Effect
        </h1>
        <p className="text-lg text-muted-foreground">
          Like a sci-fi forcefield brought to life. The hologram effect combines
          three ingredients: fresnel glow that makes edges bright and centers
          transparent, animated scan lines sweeping vertically, and random
          glitch flickers. Together they make any 3D shape look like a
          holographic projection.
        </p>
      </div>

      {/* 2. What Could Go Wrong */}
      <WhatCouldGoWrong
        scenario="You set up the fresnel effect but it only glows on one side of the mesh. When you orbit around, the glow stays on the same face instead of appearing on the silhouette edges as expected."
        error="Fresnel glow is fixed to one side of the mesh regardless of camera angle. Edges do not glow."
        errorType="Visual Bug"
        accentColor="cyan"
      />

      <Separator className="my-8" />

      {/* 3. Story */}
      <ScrollReveal>
        <ConversationalCallout type="story">
          <p>
            Think about a <strong>sci-fi forcefield</strong> in a movie. It is
            not a solid object -- it is translucent in the middle but glows
            bright at the edges where your line of sight is nearly parallel to
            the surface. That edge glow is the <strong>fresnel effect</strong>,
            and it is the backbone of every hologram shader.
          </p>
          <p>
            Now add <strong>scan lines</strong> -- horizontal stripes that
            scroll upward, like old CRT monitors or a laser scanning the
            object. These are just a sine wave applied to the Y position:
            wherever the sine is above 0.5, the surface is bright; below 0.5,
            it is dark.
          </p>
          <p>
            Finally, throw in occasional <strong>glitch flickers</strong> --
            random horizontal slices that flash bright for a single frame,
            as if the holographic projector is slightly unstable. That is the
            complete recipe: fresnel + scanlines + glitch.
          </p>
        </ConversationalCallout>
      </ScrollReveal>

      <Separator className="my-8" />

      {/* 4. SimpleFlow */}
      <ScrollReveal>
        <section className="space-y-4">
          <h2 className="text-2xl font-bold">How the Hologram Works</h2>
          <p className="text-muted-foreground leading-relaxed">
            Three effects layered together in the fragment shader.
          </p>
          <SimpleFlow
            steps={[
              { label: "Vertex Shader", detail: "Pass position, normal, worldPos" },
              { label: "Fresnel", detail: "Edge glow from view angle" },
              { label: "Scan Lines", detail: "Scrolling horizontal stripes" },
              { label: "Glitch", detail: "Random brightness flashes", status: "success" },
            ]}
            accentColor="cyan"
          />
        </section>
      </ScrollReveal>

      <Separator className="my-8" />

      {/* 5. Demo */}
      <HologramDemo />

      <Separator className="my-8" />

      {/* 6. Steps */}
      <ScrollReveal>
        <section className="space-y-6">
          <h2 className="text-2xl font-bold">
            Building the Hologram Step by Step
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            Each effect is simple on its own. The magic is in how they combine.
          </p>

          <div className="bg-card border rounded-lg p-4 space-y-3">
            <h3 className="font-semibold text-sm">
              Step 1 -- Set up the vertex shader with world-space data
            </h3>
            <CodeBlock
              code={`varying vec3 vPosition;
varying vec3 vNormal;
varying vec3 vWorldPosition;

void main() {
  vPosition = position;
  vNormal = normalize(normalMatrix * normal);

  vec4 worldPos = modelMatrix * vec4(position, 1.0);
  vWorldPosition = worldPos.xyz;

  gl_Position = projectionMatrix
    * modelViewMatrix * vec4(position, 1.0);
}`}
              filename="vertex.glsl"
            />
            <p className="text-sm text-muted-foreground">
              The vertex shader must pass three things: the local position (for
              scanlines), the world-space normal (for fresnel), and the
              world-space position (for the view direction calculation). The
              normalMatrix correctly transforms normals even with non-uniform
              scaling.
            </p>
          </div>

          <div className="bg-card border rounded-lg p-4 space-y-3">
            <h3 className="font-semibold text-sm">
              Step 2 -- Calculate the fresnel effect
            </h3>
            <CodeBlock
              code={`// View direction: camera to surface
vec3 viewDir = normalize(
  cameraPosition - vWorldPosition
);

// Fresnel: bright when view grazes the surface
float fresnel = pow(
  1.0 - abs(dot(viewDir, vNormal)),
  uFresnelPower
);

// fresnelPower=1: wide glow
// fresnelPower=5: tight edge-only glow`}
              filename="fragment.glsl"
            />
            <p className="text-sm text-muted-foreground">
              The dot product between the view direction and surface normal is
              1.0 when looking straight at the surface and 0.0 at grazing
              angles. Subtracting from 1.0 inverts it so edges are bright.
              The power exponent controls how quickly the glow falls off -- higher
              values make a tighter, more dramatic edge glow.
            </p>
          </div>

          <div className="bg-card border rounded-lg p-4 space-y-3">
            <h3 className="font-semibold text-sm">
              Step 3 -- Add scrolling scan lines
            </h3>
            <CodeBlock
              code={`// Scan lines based on Y position + time
float scanline = step(0.5,
  sin(vPosition.y * uScanlineCount
    + uTime * uScanlineSpeed)
  * 0.5 + 0.5
);

// Result: alternating bright/dark horizontal bands
// that scroll upward over time`}
              filename="fragment.glsl"
            />
            <p className="text-sm text-muted-foreground">
              The sine wave creates a smooth oscillation along the Y axis. We
              remap it from [-1, 1] to [0, 1] then threshold it with step() at
              0.5 to get sharp on/off bands. Adding uTime multiplied by speed
              makes the pattern scroll upward each frame.
            </p>
          </div>

          <div className="bg-card border rounded-lg p-4 space-y-3">
            <h3 className="font-semibold text-sm">
              Step 4 -- Layer in glitch and flicker
            </h3>
            <CodeBlock
              code={`// Glitch: random bright slices
float block = floor(vPosition.y * 20.0 + uTime * 3.0);
float glitch = step(
  1.0 - uGlitchIntensity * 0.15,
  fract(sin(block * 12.9898) * 43758.5453)
);

// Flicker: subtle overall brightness pulsing
float flicker = 0.85 + 0.15
  * sin(uTime * 15.0)
  * sin(uTime * 7.3);

// Combine all effects
float alpha = (fresnel * 0.6 + 0.15)
  + scanline * 0.2;
alpha *= flicker;
alpha += glitch * 0.5;`}
              filename="fragment.glsl"
            />
            <p className="text-sm text-muted-foreground">
              The glitch divides the mesh into horizontal blocks and randomly
              brightens some of them each frame. The pseudo-random function
              fract(sin(x) * big_number) is a classic GPU trick for generating
              randomness. The flicker multiplies two offset sine waves for an
              organic brightness oscillation.
            </p>
          </div>
        </section>
      </ScrollReveal>

      <Separator className="my-8" />

      {/* 7. What You Just Learned */}
      <ScrollReveal>
        <WhatYouJustLearned
          points={[
            "The fresnel effect uses dot(viewDir, normal) to make edges glow bright while centers stay transparent.",
            "Scan lines are just sin(y * count + time * speed) thresholded with step() for sharp bands.",
            "Pseudo-random glitch uses fract(sin(x) * 43758.5453) -- a classic GPU random number trick.",
            "Additive blending + depthWrite=false makes overlapping transparent parts glow instead of occlude.",
            "All three effects (fresnel, scanlines, glitch) are computed entirely in the fragment shader -- no textures needed.",
          ]}
        />
      </ScrollReveal>

      <Separator className="my-8" />

      {/* 8. Question */}
      <ScrollReveal>
        <ConversationalCallout type="question">
          <p>
            The fresnel effect relies on dot(viewDirection, normal). What
            happens to the fresnel glow if you use a completely flat plane
            instead of a curved mesh like the torus knot? Would you still see
            edge glow, and why or why not?
          </p>
        </ConversationalCallout>
      </ScrollReveal>

      <Separator className="my-8" />

      {/* 9. Aha Moment */}
      <ScrollReveal>
        <AhaMoment
          setup="The hologram shader has zero lights, zero textures, and zero normal maps. Yet it looks like a glowing, transparent, animated 3D object. How?"
          reveal="Everything is computed from pure math in the fragment shader. The fresnel effect derives edge glow from the angle between the camera and the surface normal -- no lights needed. The scan lines derive striped brightness from the Y position and time -- no textures needed. The glitch derives random flashes from a pseudo-random function -- no data needed. This is the power of procedural shading: you can create complex, animated visual effects with nothing but math and a few uniform values. The GPU is essentially a massively parallel calculator that runs your math formula on every pixel simultaneously."
        />
      </ScrollReveal>

      <Separator className="my-8" />

      {/* 10. Quiz */}
      <ScrollReveal>
        <MentalModelChallenge
          question="You apply the hologram shader to a cube, but the fresnel glow shows hard edges at the cube's corners instead of smooth gradients. Why?"
          options={[
            {
              label: "Cubes do not support fresnel effects",
              correct: false,
              explanation:
                "Any geometry can use fresnel. The issue is about normals, not the shape.",
            },
            {
              label: "A cube has flat faces with uniform normals per face, so dot(view, normal) is constant across each face",
              correct: true,
              explanation:
                "Each face of a cube has a single normal direction. The dot product between view and normal is the same for every pixel on that face, so the fresnel value is uniform across the whole face -- no gradient, just a solid brightness per face.",
            },
            {
              label: "The normalMatrix is wrong for box geometries",
              correct: false,
              explanation:
                "normalMatrix works correctly for all geometries. The issue is that a cube has flat normals by design.",
            },
          ]}
          hint="Think about how normals differ between a smooth sphere and a hard-edged cube..."
          answer="Fresnel needs smoothly varying normals to create a gradient from center to edge. A cube has flat faces where every vertex on a face shares the same normal. The fix: use a high-poly mesh, or a geometry with computed smooth normals (like a sphere or torus knot), so the dot product varies continuously across the surface."
        />
      </ScrollReveal>

      <Separator className="my-8" />

      {/* Try This */}
      <Separator className="my-8" />
      <ScrollReveal>
        <TryThisList challenges={[
          { challenge: "Set scanlineCount to 5 — chunky lines", hint: "Lower the scanline count to just 5.", solution: "With very few scanlines, the hologram shows thick, clearly visible horizontal bands.", difficulty: "beginner" },
          { challenge: "Max glitchIntensity — glitchy!", hint: "Push the glitch intensity to its maximum.", solution: "Heavy glitch creates dramatic digital distortion, like a malfunctioning holographic projector.", difficulty: "beginner" },
          { challenge: "Set opacity to 0.1 — barely visible", hint: "Lower the hologram opacity to 0.1.", solution: "The hologram becomes almost invisible, creating a subtle ghost-like presence.", difficulty: "beginner" },
        ]} />
      </ScrollReveal>

      <Separator className="my-8" />

      {/* 11. Mistakes */}
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
                <h3 className="font-semibold text-sm">Use abs() in fresnel dot</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Without abs(), back-facing normals produce negative dot products
                that break the fresnel calculation. abs() ensures it works from
                both sides when using DoubleSide rendering.
              </p>
            </div>
            <div className="rounded-lg border bg-card p-4 space-y-2">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="size-4 text-green-500" />
                <h3 className="font-semibold text-sm">Keep glitch subtle</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Too much glitch intensity makes the hologram unreadable. Start
                with intensity around 1-2 and only increase for dramatic
                effects. The best holograms are mostly stable with occasional
                glitches.
              </p>
            </div>
            <div className="rounded-lg border bg-card p-4 space-y-2">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="size-4 text-green-500" />
                <h3 className="font-semibold text-sm">Pair with dark backgrounds</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Additive blending adds light, so holograms glow best against
                dark backgrounds. On a white background, additive blending has
                no visible effect since you cannot add to white.
              </p>
            </div>
            <div className="rounded-lg border bg-card p-4 space-y-2">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="size-4 text-green-500" />
                <h3 className="font-semibold text-sm">Choose curved geometry</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Fresnel looks best on rounded shapes with smooth normals. Torus
                knots, spheres, and organic shapes work great. For hard-edge
                geometry, compute smooth normals first.
              </p>
            </div>
          </div>
        </section>
      </ScrollReveal>
    </div>
  );
}
