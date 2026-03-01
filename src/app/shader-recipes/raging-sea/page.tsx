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

const SeaDemo = dynamic(
  () => import("./_components/sea-demo").then((m) => ({ default: m.SeaDemo })),
  {
    ssr: false,
    loading: () => (
      <div className="w-full aspect-[2/1] rounded-xl border bg-scene-bg animate-pulse" />
    ),
  }
);

const mistakes: Mistake[] = [
  {
    title: "Flat plane with no segments",
    subtitle: "Vertex displacement needs vertices to displace",
    wrongCode: `<planeGeometry args={[4, 4]} />
// Default: 1x1 segments = 4 vertices
// Waves have nothing to push around`,
    rightCode: `<planeGeometry args={[4, 4, 128, 128]} />
// 128x128 segments = 16,641 vertices
// Smooth, detailed wave surface`,
    filename: "Sea.tsx",
    explanation:
      "A plane with the default 1x1 segments has only 4 corner vertices. The vertex shader can only move those 4 points, so you get a flat tilting rectangle instead of waves. You need many segments (64x64 minimum, 128x128 for smooth results) so there are enough vertices for the sine waves to sculpt.",
  },
  {
    title: "Uniform object recreated every render",
    subtitle: "Inline uniforms cause shader recompilation each frame",
    wrongCode: `<shaderMaterial
  uniforms={{
    uTime: { value: 0 },
    uWaveHeight: { value: 0.3 },
  }}
  vertexShader={vs}
  fragmentShader={fs}
/>`,
    rightCode: `const uniforms = useMemo(() => ({
  uTime: { value: 0 },
  uWaveHeight: { value: 0.3 },
}), []);

useFrame(({ clock }) => {
  materialRef.current.uniforms
    .uTime.value = clock.elapsedTime;
});

<shaderMaterial
  ref={materialRef}
  uniforms={uniforms}
  vertexShader={vs}
  fragmentShader={fs}
/>`,
    filename: "Sea.tsx",
    explanation:
      "Defining uniforms inline in JSX creates a new object every render, triggering expensive shader recompilation. Use useMemo to create the uniforms once, then mutate only the .value property inside useFrame.",
  },
  {
    title: "Forgetting DoubleSide on a tilted plane",
    subtitle: "The back face of the plane is invisible by default",
    wrongCode: `<mesh rotation={[-Math.PI / 2, 0, 0]}>
  <planeGeometry args={[4, 4, 64, 64]} />
  <shaderMaterial ... />
  {/* Plane disappears from below! */}
</mesh>`,
    rightCode: `<mesh rotation={[-Math.PI / 2, 0, 0]}>
  <planeGeometry args={[4, 4, 64, 64]} />
  <shaderMaterial
    side={THREE.DoubleSide}
    ...
  />
  {/* Visible from both sides */}
</mesh>`,
    filename: "Sea.tsx",
    explanation:
      "Planes only have one face by default. When you tilt the plane to create a horizontal surface, viewing from certain camera angles shows the back face, which is culled. Set side={THREE.DoubleSide} so the sea is visible from any angle.",
  },
];

export default function RagingSeaPage() {
  return (
    <div className="max-w-4xl">
      {/* 1. Title */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-3">
          <Badge variant="outline">Shader Recipes</Badge>
        </div>
        <h1 className="text-3xl font-bold tracking-tight mb-3">Raging Sea</h1>
        <p className="text-lg text-muted-foreground">
          You are creating an ocean inside a glass box. A flat plane gets
          hundreds of segments, and the vertex shader pushes each one up and
          down like waves. The fragment shader paints deep blue in the valleys
          and foamy white on the peaks. No textures, no models -- just math
          making water.
        </p>
      </div>

      {/* 2. What Could Go Wrong */}
      <WhatCouldGoWrong
        scenario="You write a vertex shader with sin() waves on a plane, but the surface is completely flat. The code compiles fine, no errors. You can see the plane, but there are no waves at all."
        error="No error -- the plane renders but remains perfectly flat despite vertex displacement code."
        errorType="Visual Bug"
        accentColor="blue"
      />

      <Separator className="my-8" />

      {/* 3. Story */}
      <ScrollReveal>
        <ConversationalCallout type="story">
          <p>
            Imagine you are building a <strong>storm in a glass box</strong>.
            You start with a perfectly flat sheet of rubber stretched across a
            frame. Now you start pushing and pulling the rubber from underneath
            at different spots, at different speeds, with different strengths.
          </p>
          <p>
            One hand creates the big, slow ocean swells. Another adds medium
            choppy waves on top. A third adds tiny surface ripples. The trick is
            that each set of waves has its own <strong>frequency</strong> (how
            close together the peaks are) and <strong>amplitude</strong> (how
            tall they are). Layer them together and you get a convincing ocean.
          </p>
          <p>
            The fragment shader then acts like a painter looking at the surface
            from above: wherever the rubber is pushed down (trough), paint it
            dark blue. Wherever it is pushed up (peak), add white foam. That is
            the entire recipe.
          </p>
        </ConversationalCallout>
      </ScrollReveal>

      <Separator className="my-8" />

      {/* 4. SimpleFlow */}
      <ScrollReveal>
        <section className="space-y-4">
          <h2 className="text-2xl font-bold">How the Raging Sea Works</h2>
          <p className="text-muted-foreground leading-relaxed">
            From a flat plane to a stormy ocean in four stages.
          </p>
          <SimpleFlow
            steps={[
              { label: "High-Res Plane", detail: "128x128 segments = 16k vertices" },
              { label: "Vertex Shader", detail: "Layered sin/cos waves displace Y" },
              { label: "Elevation Varying", detail: "Pass height to fragment shader" },
              { label: "Fragment Shader", detail: "Mix depth/surface/foam by height", status: "success" },
            ]}
            accentColor="blue"
          />
        </section>
      </ScrollReveal>

      <Separator className="my-8" />

      {/* 5. Demo */}
      <SeaDemo />

      <Separator className="my-8" />

      {/* 6. Steps */}
      <ScrollReveal>
        <section className="space-y-6">
          <h2 className="text-2xl font-bold">Building the Sea Step by Step</h2>
          <p className="text-muted-foreground leading-relaxed">
            Let us construct the ocean from a flat plane to a living,
            breathing surface.
          </p>

          <div className="bg-card border rounded-lg p-4 space-y-3">
            <h3 className="font-semibold text-sm">
              Step 1 -- Create a high-resolution plane
            </h3>
            <CodeBlock
              code={`<mesh rotation={[-Math.PI * 0.45, 0, 0]}>
  <planeGeometry args={[4, 4, 128, 128]} />
  <shaderMaterial
    vertexShader={vertexShader}
    fragmentShader={fragmentShader}
    uniforms={uniforms}
    side={THREE.DoubleSide}
  />
</mesh>`}
              filename="Sea.tsx"
            />
            <p className="text-sm text-muted-foreground">
              The third and fourth arguments to planeGeometry are the segment
              counts. More segments means more vertices for the shader to
              displace. 128x128 gives us over 16,000 vertices -- enough for
              smooth waves.
            </p>
          </div>

          <div className="bg-card border rounded-lg p-4 space-y-3">
            <h3 className="font-semibold text-sm">
              Step 2 -- Layer multiple sine waves in the vertex shader
            </h3>
            <CodeBlock
              code={`uniform float uTime;
uniform float uWaveHeight;
uniform float uWaveFrequency;
uniform float uWaveSpeed;
uniform float uBigWaveFrequency;

varying float vElevation;

void main() {
  vec3 pos = position;

  // Big rolling waves
  float big = sin(pos.x * uBigWaveFrequency + uTime * uWaveSpeed * 0.6)
            * sin(pos.z * uBigWaveFrequency * 0.8 + uTime * uWaveSpeed * 0.4)
            * uWaveHeight;

  // Small choppy waves
  float small = sin(pos.x * uWaveFrequency * 3.0 + uTime * uWaveSpeed * 2.0)
              * cos(pos.z * uWaveFrequency * 2.5 + uTime * uWaveSpeed * 1.8)
              * uWaveHeight * 0.15;

  pos.y += big + small;
  vElevation = big + small;

  gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
}`}
              filename="vertex.glsl"
            />
            <p className="text-sm text-muted-foreground">
              Each sin/cos call creates a wave with its own frequency and speed.
              Multiplying two sine waves together (one for X, one for Z) creates
              a 2D wave pattern instead of simple stripes. The elevation is
              passed as a varying so the fragment shader knows how high each
              point is.
            </p>
          </div>

          <div className="bg-card border rounded-lg p-4 space-y-3">
            <h3 className="font-semibold text-sm">
              Step 3 -- Color by elevation in the fragment shader
            </h3>
            <CodeBlock
              code={`uniform vec3 uDepthColor;
uniform vec3 uSurfaceColor;
uniform vec3 uFoamColor;
uniform float uWaveHeight;

varying float vElevation;

void main() {
  // Normalize elevation to 0..1
  float t = (vElevation + uWaveHeight) / (uWaveHeight * 2.0);
  t = clamp(t, 0.0, 1.0);

  // Deep blue in troughs, surface color at mid-height
  vec3 color = mix(uDepthColor, uSurfaceColor, t);

  // Foam on the peaks
  float foam = smoothstep(0.7, 1.0, t);
  color = mix(color, uFoamColor, foam * 0.8);

  gl_FragColor = vec4(color, 1.0);
}`}
              filename="fragment.glsl"
            />
            <p className="text-sm text-muted-foreground">
              The key insight: the elevation varying tells the fragment shader
              how high this pixel is on the wave. We normalize it to a 0-1
              range, then use mix() to blend between deep blue (0) and surface
              teal (0.5-0.7). Peaks above 0.7 get foam color blended in with
              smoothstep for a soft transition.
            </p>
          </div>

          <div className="bg-card border rounded-lg p-4 space-y-3">
            <h3 className="font-semibold text-sm">
              Step 4 -- Animate with useFrame
            </h3>
            <CodeBlock
              code={`const uniforms = useMemo(() => ({
  uTime: { value: 0 },
  uWaveSpeed: { value: 1.0 },
  uWaveHeight: { value: 0.25 },
  uWaveFrequency: { value: 3.0 },
  uBigWaveFrequency: { value: 1.2 },
  uSurfaceColor: { value: new THREE.Color("#1a8faa") },
  uDepthColor: { value: new THREE.Color("#041830") },
  uFoamColor: { value: new THREE.Color("#c8e6f0") },
}), []);

useFrame(({ clock }) => {
  materialRef.current.uniforms
    .uTime.value = clock.elapsedTime;
});`}
              filename="Sea.tsx"
            />
            <p className="text-sm text-muted-foreground">
              The uTime uniform is the heartbeat of the animation. Every frame,
              useFrame updates it with the elapsed time. Inside the vertex
              shader, uTime offsets the sine wave inputs, making the waves move.
              All other uniforms can be updated from Leva controls the same way.
            </p>
          </div>
        </section>
      </ScrollReveal>

      <Separator className="my-8" />

      {/* 7. What You Just Learned */}
      <ScrollReveal>
        <WhatYouJustLearned
          points={[
            "Vertex displacement pushes geometry vertices in the vertex shader -- the geometry itself is a flat plane.",
            "Layering multiple sine waves with different frequencies creates organic, natural-looking wave patterns.",
            "A 'varying' passes per-vertex data (like elevation) from the vertex shader to the fragment shader for coloring.",
            "mix() with smoothstep() creates soft color transitions between deep water, surface, and foam.",
            "High segment counts (128x128) are essential -- without enough vertices, there is nothing to displace.",
          ]}
        />
      </ScrollReveal>

      <Separator className="my-8" />

      {/* 8. Question */}
      <ScrollReveal>
        <ConversationalCallout type="question">
          <p>
            The ocean waves are created entirely from layered sine functions.
            What would you need to change to make the waves look less uniform
            and more chaotic, like a real storm? Think about what real ocean
            waves have that perfect sine waves do not.
          </p>
        </ConversationalCallout>
      </ScrollReveal>

      <Separator className="my-8" />

      {/* 9. Aha Moment */}
      <ScrollReveal>
        <AhaMoment
          setup="You look at the fragment shader and realize it only uses one piece of data from the vertex shader to color the entire ocean. What is that one value, and why is it so powerful?"
          reveal="It is the elevation varying -- a single float that tells the fragment shader how high this vertex is on the wave. From that one number, you derive everything: deep blue in troughs (low elevation), teal on the surface (mid elevation), and white foam on peaks (high elevation). The entire visual richness of the ocean comes from a single vertex-to-fragment communication channel. This is why varyings are so important in shader programming -- they are the bridge between geometry manipulation and pixel coloring."
        />
      </ScrollReveal>

      <Separator className="my-8" />

      {/* 10. Quiz */}
      <ScrollReveal>
        <MentalModelChallenge
          question="You increase the wave frequency from 3.0 to 30.0, but instead of getting more detailed waves, the surface looks like jagged noise. What went wrong?"
          options={[
            {
              label: "The GPU cannot handle high frequency sine waves",
              correct: false,
              explanation:
                "GPUs can compute sin() at any frequency with no performance issue. The limitation is elsewhere.",
            },
            {
              label: "The wave frequency exceeds the vertex resolution (aliasing)",
              correct: true,
              explanation:
                "With 128 segments across 4 units, you have roughly 32 vertices per unit. A frequency of 30 means 30 wave cycles per unit, but you only have 32 sample points. This is like trying to draw a detailed curve with only a few dots -- the wave cannot be represented smoothly.",
            },
            {
              label: "smoothstep() breaks at high frequency values",
              correct: false,
              explanation:
                "smoothstep operates on the elevation output, not the frequency input. It works fine regardless of frequency.",
            },
          ]}
          hint="Think about the relationship between wave frequency and vertex density. How many vertices do you have per wave cycle?"
          answer="This is the Nyquist limit in action. You need at least 2 vertices per wave cycle to represent it accurately (and more like 8-10 for smooth curves). At frequency 30 with 32 vertices per unit, you have barely 1 vertex per cycle -- far below what you need. The fix: either reduce frequency, or increase segment count to match."
        />
      </ScrollReveal>

      <Separator className="my-8" />

      {/* Try This */}
      <Separator className="my-8" />
      <ScrollReveal>
        <TryThisList challenges={[
          { challenge: "Max waveHeight — tsunami!", hint: "Push the wave height slider to its maximum value.", solution: "Extreme wave height creates towering peaks and deep troughs, like a violent storm at sea.", difficulty: "beginner" },
          { challenge: "Set waveSpeed to 0 — frozen ocean", hint: "Set the animation speed to zero.", solution: "The waves freeze in place, creating a static sculpted surface like a frozen moment in time.", difficulty: "beginner" },
          { challenge: "Change foamColor to pink — candy sea", hint: "Pick a pink color for the foam highlights.", solution: "Pink foam on blue water creates an otherworldly candy ocean effect.", difficulty: "beginner" },
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
                <h3 className="font-semibold text-sm">Layer 3-4 wave octaves</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Use big waves for the swell, medium waves for chop, and small
                waves for surface detail. Each layer should have roughly double
                the frequency and half the amplitude of the previous one.
              </p>
            </div>
            <div className="rounded-lg border bg-card p-4 space-y-2">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="size-4 text-green-500" />
                <h3 className="font-semibold text-sm">Match segments to frequency</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Ensure you have at least 8-10 vertices per wave cycle. If your
                highest frequency is 6.0 on a 4-unit plane, you need at least
                4 * 6 * 10 = 240 segments. Under-sampling causes jagged aliasing.
              </p>
            </div>
            <div className="rounded-lg border bg-card p-4 space-y-2">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="size-4 text-green-500" />
                <h3 className="font-semibold text-sm">Vary wave speeds</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Give each wave layer a different speed multiplier. If all waves
                move at the same speed, they look like a single wave rather
                than layered water. Real oceans have waves from many sources
                moving independently.
              </p>
            </div>
            <div className="rounded-lg border bg-card p-4 space-y-2">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="size-4 text-green-500" />
                <h3 className="font-semibold text-sm">Use smoothstep for foam</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Hard thresholds (step function) create sharp unrealistic foam
                edges. smoothstep gives a soft gradient between water and foam
                that looks natural. Adjust the two edge parameters to control
                how wide the foam band is.
              </p>
            </div>
          </div>
        </section>
      </ScrollReveal>
    </div>
  );
}
