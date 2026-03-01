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

const TerrainDemo = dynamic(
  () =>
    import("./_components/terrain-demo").then((m) => ({
      default: m.TerrainDemo,
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
    title: "Only one octave of noise -- terrain is too smooth",
    subtitle: "Single noise layer produces rolling hills, not mountains",
    wrongCode: `float height = noise(position.xz * 0.5);
// Result: gentle rolling hills
// No small details, ridges, or crags`,
    rightCode: `float height = 0.0;
float amplitude = 0.5;
float frequency = 1.0;

for (int i = 0; i < 6; i++) {
  height += amplitude * noise(
    position.xz * frequency
  );
  frequency *= 2.0; // lacunarity
  amplitude *= 0.5; // gain
}
// Result: mountains with detailed ridges`,
    filename: "vertex.glsl",
    explanation:
      "A single noise layer only creates one scale of detail. Real terrain has large mountains AND small rocks AND tiny bumps. Fractal Brownian Motion (FBM) stacks multiple noise layers: each one has double the frequency (smaller features) and half the amplitude (less height). 5-6 octaves usually looks convincing.",
  },
  {
    title: "Loop iteration variable compared to float uniform",
    subtitle: "GLSL for loops need integer comparison in some implementations",
    wrongCode: `uniform float uOctaves;
for (int i = 0; i < uOctaves; i++) {
  // ERROR: comparing int to float
  // Won't compile on many GPUs
}`,
    rightCode: `uniform float uOctaves;
for (int i = 0; i < 8; i++) {
  if (float(i) >= uOctaves) break;
  // Works on all GPUs!
  value += amplitude * noise(p * freq);
  freq *= lacunarity;
  amplitude *= gain;
}`,
    filename: "vertex.glsl",
    explanation:
      "GLSL for loops require constant integer bounds in many GPU implementations. You cannot use a uniform float as the loop limit directly. The workaround: loop to a fixed maximum (like 8), then break when the float(i) counter exceeds your uniform. This compiles everywhere.",
  },
  {
    title: "Terrain normals are wrong -- lighting looks flat",
    subtitle: "Normals were not recomputed after vertex displacement",
    wrongCode: `// Fragment shader:
// Using original flat plane normal
vec3 normal = vec3(0.0, 0.0, 1.0);
float light = dot(normal, lightDir);
// Lighting is uniform across terrain`,
    rightCode: `// Fragment shader:
// Compute normal from displaced surface
vec3 dx = dFdx(vec3(vPosition.x, vHeight, vPosition.z));
vec3 dz = dFdy(vec3(vPosition.x, vHeight, vPosition.z));
vec3 normal = normalize(cross(dx, dz));
float light = max(dot(normal, lightDir), 0.0);`,
    filename: "fragment.glsl",
    explanation:
      "After displacing vertices, the original normals (pointing straight up for a plane) are wrong. The surface now has slopes and peaks. Use dFdx/dFdy (screen-space derivatives) to approximate the surface gradient and compute a cross product for the new normal. This gives you correct per-pixel lighting on the displaced terrain.",
  },
];

export default function ProceduralTerrainPage() {
  return (
    <div className="relative max-w-4xl">
      <div className="absolute -top-10 -left-10 w-72 h-72 bg-gradient-to-br from-teal-500/10 via-emerald-500/10 to-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
      {/* 1. Title */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-3">
          <Badge variant="outline">Shader Recipes</Badge>
        </div>
        <h1 className="text-3xl font-bold tracking-tight mb-3">
          Procedural Terrain
        </h1>
        <p className="text-lg text-muted-foreground">
          Sculpting mountains from math. A noise function creates random-looking
          but smooth height values. Stack multiple layers of noise at different
          scales (called octaves) and you get the full spectrum: big mountains,
          medium hills, small ridges, tiny bumps. The result is a realistic
          digital landscape generated entirely from a single formula.
        </p>
      </div>

      {/* 2. What Could Go Wrong */}
      <WhatCouldGoWrong
        scenario="You write a noise function in the vertex shader and displace the plane. The terrain appears, but it looks like gentle rolling hills with no detail -- no sharp ridges, no small rocks, just smooth blobs."
        error="Terrain has only large-scale features. No fine detail visible regardless of how many vertices the plane has."
        errorType="Visual Bug"
        accentColor="emerald"
      />

      <Separator className="my-8" />

      {/* 3. Story */}
      <ScrollReveal>
        <ConversationalCallout type="story">
          <p>
            Imagine you are a <strong>digital landscape architect</strong>.
            You start with a perfectly flat field and you need to sculpt
            mountains. But you do not carve by hand -- you use a{" "}
            <strong>recipe</strong>.
          </p>
          <p>
            First pass: take a noise function and use it to create big, gentle
            hills (high amplitude, low frequency). Second pass: add another
            layer of noise with double the frequency and half the height --
            these are the medium ridges on top of the hills. Third pass: double
            the frequency again, halve the height again -- now you have small
            bumps on the ridges.
          </p>
          <p>
            This is <strong>Fractal Brownian Motion (FBM)</strong>. Each layer
            is called an <strong>octave</strong> (like musical octaves, each
            is double the frequency). The ratio of frequency increase is{" "}
            <strong>lacunarity</strong>. The ratio of amplitude decrease is{" "}
            <strong>gain</strong>. Together, they control how rough or smooth
            the terrain looks. Nature works the same way -- coastlines, clouds,
            and mountains are all fractal.
          </p>
        </ConversationalCallout>
      </ScrollReveal>

      <Separator className="my-8" />

      {/* 4. SimpleFlow */}
      <ScrollReveal>
        <section className="space-y-4">
          <h2 className="text-2xl font-bold">How Procedural Terrain Works</h2>
          <p className="text-muted-foreground leading-relaxed">
            From a flat plane to a realistic landscape in four stages.
          </p>
          <SimpleFlow
            steps={[
              { label: "Noise Function", detail: "Smooth pseudo-random values" },
              { label: "FBM Loop", detail: "Stack octaves of noise" },
              { label: "Vertex Displacement", detail: "Push vertices up by height" },
              { label: "Color by Height", detail: "Water, grass, rock, snow", status: "success" },
            ]}
            accentColor="emerald"
          />
        </section>
      </ScrollReveal>

      <Separator className="my-8" />

      {/* 5. Demo */}
      <TerrainDemo />

      <Separator className="my-8" />

      {/* 6. Steps */}
      <ScrollReveal>
        <section className="space-y-6">
          <h2 className="text-2xl font-bold">
            Building the Terrain Step by Step
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            We will build a gradient noise function, stack it into FBM, and
            use it to displace a high-resolution plane.
          </p>

          <div className="bg-card border rounded-lg p-4 space-y-3">
            <h3 className="font-semibold text-sm">
              Step 1 -- The noise function
            </h3>
            <CodeBlock
              code={`vec2 hash2(vec2 p) {
  p = vec2(
    dot(p, vec2(127.1, 311.7)),
    dot(p, vec2(269.5, 183.3))
  );
  return -1.0 + 2.0
    * fract(sin(p) * 43758.5453);
}

float noise(vec2 p) {
  vec2 i = floor(p);  // integer cell
  vec2 f = fract(p);  // position in cell
  vec2 u = f * f * (3.0 - 2.0 * f); // smooth

  // Gradient noise from 4 corners
  float a = dot(hash2(i + vec2(0,0)), f - vec2(0,0));
  float b = dot(hash2(i + vec2(1,0)), f - vec2(1,0));
  float c = dot(hash2(i + vec2(0,1)), f - vec2(0,1));
  float d = dot(hash2(i + vec2(1,1)), f - vec2(1,1));

  return mix(mix(a,b,u.x), mix(c,d,u.x), u.y);
}`}
              filename="vertex.glsl"
            />
            <p className="text-sm text-muted-foreground">
              This gradient noise function divides 2D space into a grid.
              Each grid corner gets a pseudo-random gradient direction (from
              hash2). The noise value at any point is the smooth interpolation
              of dot products between gradients and offset vectors. The result
              is smooth, continuous, and repeatable -- the same input always
              gives the same output.
            </p>
          </div>

          <div className="bg-card border rounded-lg p-4 space-y-3">
            <h3 className="font-semibold text-sm">
              Step 2 -- Fractal Brownian Motion (FBM)
            </h3>
            <CodeBlock
              code={`float fbm(vec2 p, float octaves,
  float lacunarity, float gain
) {
  float value = 0.0;
  float amplitude = 0.5;
  float frequency = 1.0;

  for (int i = 0; i < 8; i++) {
    if (float(i) >= octaves) break;

    value += amplitude * noise(p * frequency);
    frequency *= lacunarity; // double freq
    amplitude *= gain;       // halve amp
  }

  return value;
}`}
              filename="vertex.glsl"
            />
            <p className="text-sm text-muted-foreground">
              FBM is the secret sauce. Each loop iteration adds a noise layer
              with higher frequency (smaller features) and lower amplitude
              (less contribution). Lacunarity controls how fast frequency
              grows -- 2.0 is standard. Gain controls how fast amplitude
              shrinks -- 0.5 is standard. More octaves means more detail but
              more computation.
            </p>
          </div>

          <div className="bg-card border rounded-lg p-4 space-y-3">
            <h3 className="font-semibold text-sm">
              Step 3 -- Displace vertices and pass height
            </h3>
            <CodeBlock
              code={`void main() {
  vec2 coord = position.xz * 0.5;
  float height = fbm(coord,
    uOctaves, uLacunarity, uGain);
  height = abs(height) * uElevation;

  vec3 pos = position;
  pos.y += height;

  vHeight = height;
  vPosition = position;

  gl_Position = projectionMatrix
    * modelViewMatrix * vec4(pos, 1.0);
}`}
              filename="vertex.glsl"
            />
            <p className="text-sm text-muted-foreground">
              We sample the FBM using the vertex&apos;s XZ position as coordinates.
              The abs() creates sharp ridges where the noise crosses zero --
              this is a technique called &ldquo;ridged noise&rdquo; that produces
              mountain-like peaks. The height is passed as a varying for
              the fragment shader to use for coloring.
            </p>
          </div>

          <div className="bg-card border rounded-lg p-4 space-y-3">
            <h3 className="font-semibold text-sm">
              Step 4 -- Color by height with lighting
            </h3>
            <CodeBlock
              code={`void main() {
  float h = vHeight / uElevation;

  // Height-based color bands
  vec3 color = vec3(0.1, 0.3, 0.5); // water
  color = mix(color, sand,  smoothstep(0.0,  0.08, h));
  color = mix(color, grass, smoothstep(0.08, 0.2,  h));
  color = mix(color, rock,  smoothstep(0.3,  0.5,  h));
  color = mix(color, snow,
    smoothstep(uSnowLine - 0.1, uSnowLine, h));

  // Compute normal from screen-space derivatives
  vec3 dx = dFdx(vec3(vPosition.x, vHeight, vPosition.z));
  vec3 dz = dFdy(vec3(vPosition.x, vHeight, vPosition.z));
  vec3 normal = normalize(cross(dx, dz));

  float light = max(dot(normal,
    normalize(vec3(1, 2, 1))), 0.0) * 0.6 + 0.4;
  color *= light;

  gl_FragColor = vec4(color, 1.0);
}`}
              filename="fragment.glsl"
            />
            <p className="text-sm text-muted-foreground">
              Height-based coloring uses cascading smoothstep calls to blend
              between biome colors: water at the bottom, then sand, grass,
              rock, and snow at the peaks. The snow line is controllable via
              a uniform. dFdx/dFdy compute approximate surface normals from
              the displaced geometry, giving us proper lighting without
              recomputing normals on the CPU.
            </p>
          </div>
        </section>
      </ScrollReveal>

      <Separator className="my-8" />

      {/* 7. What You Just Learned */}
      <ScrollReveal>
        <WhatYouJustLearned
          points={[
            "Gradient noise creates smooth pseudo-random values by interpolating random gradients at grid corners.",
            "FBM (Fractal Brownian Motion) stacks multiple noise octaves: each doubles frequency and halves amplitude.",
            "Lacunarity controls frequency growth between octaves. Gain controls amplitude decay. Together they shape terrain roughness.",
            "abs(noise) creates 'ridged noise' with sharp mountain peaks where the noise function crosses zero.",
            "dFdx/dFdy in the fragment shader approximate surface normals on displaced geometry without CPU-side recomputation.",
          ]}
        />
      </ScrollReveal>

      <Separator className="my-8" />

      {/* 8. Question */}
      <ScrollReveal>
        <ConversationalCallout type="question">
          <p>
            Lacunarity and gain work together but have very different effects.
            What happens if you set lacunarity to 1.0 (instead of the
            standard 2.0)? And separately, what happens if you set gain to
            1.0 (instead of the standard 0.5)?
          </p>
        </ConversationalCallout>
      </ScrollReveal>

      <Separator className="my-8" />

      {/* 9. Aha Moment */}
      <ScrollReveal>
        <AhaMoment
          setup="You toggle octaves from 1 to 8 in the demo. At 1 octave, the terrain is smooth rolling hills. At 8 octaves, it has detailed ridges and crags. But the change from 4 to 8 octaves is barely noticeable. Why?"
          reveal="Each octave contributes less than the previous one because the amplitude is multiplied by gain (0.5) each time. Octave 1 contributes 0.5 to the height. Octave 2 contributes 0.25. Octave 3 contributes 0.125. By octave 8, the contribution is 0.5^8 = 0.004 -- less than 1% of the total. The first 3-4 octaves define the shape. The last 4 octaves add extremely fine detail that is barely visible unless you zoom in very close. This is why 5-6 octaves is the sweet spot: beyond that, you are paying GPU cost for invisible detail."
        />
      </ScrollReveal>

      <Separator className="my-8" />

      {/* 10. Quiz */}
      <ScrollReveal>
        <MentalModelChallenge
          question="You set gain to 1.0 instead of 0.5 and the terrain explodes into extreme jagged spikes. Why does a gain of 1.0 break the terrain?"
          options={[
            {
              label: "Gain 1.0 makes noise return NaN values",
              correct: false,
              explanation:
                "The noise function returns valid values regardless of how many times you call it. Gain does not affect the noise function itself.",
            },
            {
              label: "Each octave contributes the same amplitude, so 8 octaves at equal strength add up to extreme heights",
              correct: true,
              explanation:
                "With gain=1.0, amplitude never decreases. Every octave adds the same amount of height. 8 octaves at amplitude 0.5 each means the total can reach 4.0 -- four times higher than a single octave. The high-frequency octaves, which should be subtle detail, are as strong as the base mountains.",
            },
            {
              label: "The noise function has a maximum frequency limit",
              correct: false,
              explanation:
                "Noise functions work at any frequency. The issue is amplitude, not frequency.",
            },
          ]}
          hint="Think about what gain controls: the amplitude ratio between successive octaves. If gain is 1.0, what happens to the amplitude at each octave?"
          answer="Gain controls how much each successive octave contributes. With gain=0.5, each octave is half the height of the previous one -- the series converges to a finite sum. With gain=1.0, every octave is equally strong. The tiny high-frequency details have as much height as the mountain shapes, creating extreme spikes. With gain above 1.0, the series actually diverges -- each octave gets louder, guaranteeing chaos."
        />
      </ScrollReveal>

      <Separator className="my-8" />

      {/* Try This */}
      <Separator className="my-8" />
      <ScrollReveal>
        <TryThisList challenges={[
          { challenge: "Set octaves to 1 — smooth hills", hint: "Reduce the noise octaves to just 1.", solution: "A single octave produces gentle, smooth rolling hills with no fine detail.", difficulty: "beginner" },
          { challenge: "Set octaves to 8 — detailed mountains", hint: "Increase the noise octaves to 8.", solution: "Many octaves layer fine detail on top of large shapes, creating realistic rocky mountain terrain.", difficulty: "beginner" },
          { challenge: "Toggle wireframe — see the mesh", hint: "Enable the wireframe toggle to see the underlying geometry.", solution: "Wireframe reveals how the vertex shader displaces each vertex to sculpt the terrain shape.", difficulty: "beginner" },
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
                <h3 className="font-semibold text-sm">Start with 5-6 octaves</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Beyond 6 octaves, each layer contributes less than 1.5% of the
                total height. The visual improvement is negligible but the GPU
                cost is real. Use 5-6 for most terrain and only go higher if
                the camera gets very close.
              </p>
            </div>
            <div className="rounded-lg border bg-card p-4 space-y-2">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="size-4 text-green-500" />
                <h3 className="font-semibold text-sm">Use abs() for ridged terrain</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Taking the absolute value of noise creates sharp ridges where
                the function crosses zero. This produces mountain peaks and
                valley floors that look much more natural than raw smooth noise.
              </p>
            </div>
            <div className="rounded-lg border bg-card p-4 space-y-2">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="size-4 text-green-500" />
                <h3 className="font-semibold text-sm">Recompute normals in fragment</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                After vertex displacement, the original normals are wrong. Use
                dFdx/dFdy in the fragment shader to approximate the true surface
                normal from the displaced height. This is cheaper than
                recomputing normals on the CPU.
              </p>
            </div>
            <div className="rounded-lg border bg-card p-4 space-y-2">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="size-4 text-green-500" />
                <h3 className="font-semibold text-sm">Match segments to octaves</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                High-frequency noise octaves need enough vertices to resolve.
                With lacunarity 2.0 and 6 octaves, the highest frequency is 32x
                the base. Ensure your plane has enough segments to capture it,
                or the high-frequency detail aliases into noise.
              </p>
            </div>
          </div>
        </section>
      </ScrollReveal>
    </div>
  );
}
