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

const GalaxyDemo = dynamic(
  () =>
    import("./_components/galaxy-demo").then((m) => ({
      default: m.GalaxyDemo,
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
    title: "All particles on a single spiral line",
    subtitle: "Missing randomness offset from arm centerline",
    wrongCode: `// Every particle sits exactly on the arm curve
const angle = armAngle + radius * spin;
positions[i3]     = Math.cos(angle) * radius;
positions[i3 + 1] = 0;
positions[i3 + 2] = Math.sin(angle) * radius;
// Result: thin lines, not a galaxy`,
    rightCode: `const angle = armAngle + radius * spin;

// Scatter particles around the arm
const rx = Math.pow(Math.random(), 3)
  * (Math.random() < 0.5 ? 1 : -1)
  * randomness * radius * 0.3;
const ry = Math.pow(Math.random(), 3)
  * (Math.random() < 0.5 ? 1 : -1)
  * randomness * 0.3;
const rz = Math.pow(Math.random(), 3)
  * (Math.random() < 0.5 ? 1 : -1)
  * randomness * radius * 0.3;

positions[i3]     = Math.cos(angle) * radius + rx;
positions[i3 + 1] = ry;
positions[i3 + 2] = Math.sin(angle) * radius + rz;`,
    filename: "Galaxy.tsx",
    explanation:
      "Without random scatter, particles sit exactly on the mathematical spiral curve. Real galaxies have stars spread around the spiral arms, not on thin lines. Using pow(random, 3) concentrates most particles near the arm center with occasional outliers, which looks more natural than uniform randomness.",
  },
  {
    title: "Particles are square instead of circular",
    subtitle: "No distance-based alpha or discard in fragment shader",
    wrongCode: `// Fragment shader just sets a flat color
void main() {
  gl_FragColor = vec4(vColor, 1.0);
  // Result: visible square particles
}`,
    rightCode: `void main() {
  float dist = length(gl_PointCoord - vec2(0.5));
  if (dist > 0.5) discard;

  float alpha = 1.0 - smoothstep(0.0, 0.5, dist);
  gl_FragColor = vec4(vColor, alpha * 0.85);
}`,
    filename: "fragment.glsl",
    explanation:
      "GPU point sprites are square quads. To make them circular, calculate the distance from the center of each point using gl_PointCoord (which goes from 0,0 at the top-left to 1,1 at the bottom-right). Discard pixels outside radius 0.5 and use smoothstep for soft edges.",
  },
  {
    title: "All particles the same color",
    subtitle: "Using uniform color instead of per-particle attribute",
    wrongCode: `// Using a uniform -- same color for all
uniform vec3 uColor;
void main() {
  gl_FragColor = vec4(uColor, 1.0);
}`,
    rightCode: `// Per-particle color attribute
attribute vec3 aColor;
varying vec3 vColor;

void main() {
  vColor = aColor; // pass to fragment
  // ... position code
}

// fragment:
void main() {
  gl_FragColor = vec4(vColor, alpha);
}`,
    filename: "galaxy-shaders.glsl",
    explanation:
      "A uniform is the same for all vertices. To give each particle its own color (e.g., orange at center, blue at edges), you need a per-vertex attribute. Generate a color array on the CPU, attach it as a bufferAttribute, and pass it through a varying to the fragment shader.",
  },
];

export default function GalaxyGeneratorPage() {
  return (
    <div className="max-w-4xl">
      {/* 1. Title */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-3">
          <Badge variant="outline">Shader Recipes</Badge>
        </div>
        <h1 className="text-3xl font-bold tracking-tight mb-3">
          Galaxy Generator
        </h1>
        <p className="text-lg text-muted-foreground">
          A cosmic paint splatter made from math. Each particle is positioned
          using polar coordinates -- an angle and a radius -- with randomness
          creating the organic spiral arm look. The result: thousands of
          colored dots that form a procedural spiral galaxy, generated
          entirely from code.
        </p>
      </div>

      {/* 2. What Could Go Wrong */}
      <WhatCouldGoWrong
        scenario="You generate thousands of particles but they appear as a uniform circular blob. There are no visible spiral arms -- just a dense, round cluster of particles in the center."
        error="Galaxy has no spiral structure. Particles form a round disk with no arms visible."
        errorType="Visual Bug"
        accentColor="violet"
      />

      <Separator className="my-8" />

      {/* 3. Story */}
      <ScrollReveal>
        <ConversationalCallout type="story">
          <p>
            Imagine you are a <strong>cosmic painter</strong> with a
            lazy susan (a spinning turntable). You put a canvas on it and start
            flicking paint from the center outward. As the turntable spins,
            each droplet curves into a spiral arc instead of flying straight.
          </p>
          <p>
            Droplets near the center barely curve because they have not
            traveled far. But droplets near the edge curve dramatically because
            the turntable has rotated significantly by the time they reach the
            rim. This is the <strong>spin</strong> parameter -- how much extra
            rotation each particle gets based on its distance from the center.
          </p>
          <p>
            Now you do not flick paint in every direction equally. You aim at
            3 or 4 specific angles (the <strong>arms</strong>). And your flick
            is not perfect -- each droplet scatters slightly off-course (the{" "}
            <strong>randomness</strong>). Together: arm direction + spin +
            scatter = a spiral galaxy.
          </p>
        </ConversationalCallout>
      </ScrollReveal>

      <Separator className="my-8" />

      {/* 4. SimpleFlow */}
      <ScrollReveal>
        <section className="space-y-4">
          <h2 className="text-2xl font-bold">How the Galaxy is Built</h2>
          <p className="text-muted-foreground leading-relaxed">
            From random numbers to a spiral galaxy in four stages.
          </p>
          <SimpleFlow
            steps={[
              { label: "Polar Coords", detail: "Random radius + arm angle" },
              { label: "Spin", detail: "Outer particles rotate more" },
              { label: "Scatter", detail: "Random offset from arm line" },
              { label: "Color", detail: "Inner=warm, outer=cool", status: "success" },
            ]}
            accentColor="violet"
          />
        </section>
      </ScrollReveal>

      <Separator className="my-8" />

      {/* 5. Demo */}
      <GalaxyDemo />

      <Separator className="my-8" />

      {/* 6. Steps */}
      <ScrollReveal>
        <section className="space-y-6">
          <h2 className="text-2xl font-bold">
            Building the Galaxy Step by Step
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            We position every particle with math, then let the GPU render
            them all in a single draw call.
          </p>

          <div className="bg-card border rounded-lg p-4 space-y-3">
            <h3 className="font-semibold text-sm">
              Step 1 -- Place particles on spiral arms
            </h3>
            <CodeBlock
              code={`for (let i = 0; i < count; i++) {
  const radius = Math.random() * 5;

  // Which arm (evenly spaced around the circle)
  const armAngle = ((i % arms) / arms) * Math.PI * 2;

  // Spin: more rotation for outer particles
  const spinAngle = radius * spin;

  const angle = armAngle + spinAngle;

  positions[i * 3]     = Math.cos(angle) * radius;
  positions[i * 3 + 1] = 0;
  positions[i * 3 + 2] = Math.sin(angle) * radius;
}`}
              filename="Galaxy.tsx"
            />
            <p className="text-sm text-muted-foreground">
              Each particle gets a random radius (distance from center) and is
              assigned to one of the spiral arms using modulo. The spin
              parameter adds extra rotation proportional to the radius --
              this is what curves straight lines into spirals.
            </p>
          </div>

          <div className="bg-card border rounded-lg p-4 space-y-3">
            <h3 className="font-semibold text-sm">
              Step 2 -- Add organic scatter
            </h3>
            <CodeBlock
              code={`// Cubic distribution: concentrated near center
const rx = Math.pow(Math.random(), 3)
  * (Math.random() < 0.5 ? 1 : -1)
  * randomness * radius * 0.3;

positions[i3]     += rx;
positions[i3 + 1] += ry; // slight vertical spread
positions[i3 + 2] += rz;`}
              filename="Galaxy.tsx"
            />
            <p className="text-sm text-muted-foreground">
              The key trick: pow(random, 3) creates a cubic distribution.
              Most values cluster near 0 (close to the arm), with occasional
              outliers. The random sign (positive or negative) scatters in
              both directions. Multiplying by radius makes outer regions
              wider, matching real galaxy arm behavior.
            </p>
          </div>

          <div className="bg-card border rounded-lg p-4 space-y-3">
            <h3 className="font-semibold text-sm">
              Step 3 -- Color from center to edge
            </h3>
            <CodeBlock
              code={`const colorInner = new THREE.Color(innerColor);
const colorOuter = new THREE.Color(outerColor);
const temp = new THREE.Color();

// Per-particle color based on distance
const radiusNorm = radius / maxRadius;
temp.copy(colorInner).lerp(colorOuter, radiusNorm);

colors[i3]     = temp.r;
colors[i3 + 1] = temp.g;
colors[i3 + 2] = temp.b;`}
              filename="Galaxy.tsx"
            />
            <p className="text-sm text-muted-foreground">
              Real galaxies have hot, bright cores and cooler outer regions.
              We mimic this by lerping between an inner color (warm orange)
              and an outer color (cool blue) based on each particle&apos;s
              normalized radius. Each particle gets its own color stored as
              a buffer attribute.
            </p>
          </div>

          <div className="bg-card border rounded-lg p-4 space-y-3">
            <h3 className="font-semibold text-sm">
              Step 4 -- Custom shader for circular points
            </h3>
            <CodeBlock
              code={`// Vertex: size attenuation
gl_PointSize = uSize * aScale * (200.0 / -mvPos.z);

// Fragment: circular shape with soft edges
float dist = length(gl_PointCoord - vec2(0.5));
if (dist > 0.5) discard;
float alpha = 1.0 - smoothstep(0.0, 0.5, dist);
gl_FragColor = vec4(vColor, alpha);`}
              filename="galaxy-shaders.glsl"
            />
            <p className="text-sm text-muted-foreground">
              Without a custom fragment shader, each point is a visible square.
              gl_PointCoord gives the UV of each pixel within the point sprite.
              We compute the distance from center, discard pixels outside
              radius 0.5, and use smoothstep for soft edges. The result:
              each particle is a soft glowing circle.
            </p>
          </div>
        </section>
      </ScrollReveal>

      <Separator className="my-8" />

      {/* 7. What You Just Learned */}
      <ScrollReveal>
        <WhatYouJustLearned
          points={[
            "Spiral arms are created by giving particles an angle based on their arm index, then adding radius-proportional spin.",
            "pow(random, 3) creates a cubic distribution that concentrates scatter near the arm centerline with natural-looking outliers.",
            "Per-particle attributes (color, scale) are passed as bufferAttributes and read as 'attribute' variables in the vertex shader.",
            "gl_PointCoord in the fragment shader gives the UV within each point sprite, enabling circular masking with discard.",
            "A single Points draw call can render 10,000+ particles -- far more efficient than individual meshes.",
          ]}
        />
      </ScrollReveal>

      <Separator className="my-8" />

      {/* 8. Question */}
      <ScrollReveal>
        <ConversationalCallout type="question">
          <p>
            The galaxy uses a flat random distribution for radius:
            Math.random() * 5. This means particles are spread evenly from
            center to edge. But real galaxies have many more stars near the
            center. What would you change in the radius calculation to create
            a denser core?
          </p>
        </ConversationalCallout>
      </ScrollReveal>

      <Separator className="my-8" />

      {/* 9. Aha Moment */}
      <ScrollReveal>
        <AhaMoment
          setup="The spiral arms are not drawn as curves or lines. Each particle is positioned independently with no knowledge of its neighbors. So how do thousands of independent dots form coherent spiral arms?"
          reveal="The trick is the spin parameter. Every particle on the same arm starts at the same base angle (armAngle). If spin were 0, all arm particles would form a straight line radiating from the center. But spin adds rotation proportional to radius. A particle at radius 1 rotates a little. A particle at radius 5 rotates a lot. This gradual increase in rotation is exactly what a spiral curve is -- each point along the radius is rotated slightly more than the last. The arm emerges from the pattern, not from any particle knowing about any other particle."
        />
      </ScrollReveal>

      <Separator className="my-8" />

      {/* 10. Quiz */}
      <ScrollReveal>
        <MentalModelChallenge
          question="You set spin to 0 and armCount to 4. What shape do you see?"
          options={[
            {
              label: "A single dense cluster in the center",
              correct: false,
              explanation:
                "Particles are still distributed at various radii. Spin=0 does not collapse them to the center.",
            },
            {
              label: "Four straight lines radiating from the center (a cross pattern)",
              correct: true,
              explanation:
                "With spin=0, there is no additional rotation based on distance. Each arm's particles line up at their base angle, forming straight radial lines. Four arms spaced evenly = a cross or plus shape.",
            },
            {
              label: "A perfect ring around the center",
              correct: false,
              explanation:
                "A ring would require all particles at the same radius. They have random radii from 0 to 5.",
            },
          ]}
          hint="Spin controls how much extra rotation particles get based on their distance from center. With spin=0, what happens to the spiral?"
          answer="Without spin, there is no spiral. Each arm is a straight line from the center outward at its base angle. Four evenly spaced arms at 0, 90, 180, and 270 degrees form a cross. The randomness scatter makes them fuzzy lines rather than sharp ones. Spin is literally the ingredient that turns straight arms into spiral arms."
        />
      </ScrollReveal>

      <Separator className="my-8" />

      {/* Try This */}
      <Separator className="my-8" />
      <ScrollReveal>
        <TryThisList challenges={[
          { challenge: "Set armCount to 2 — simple spiral", hint: "Lower the spiral arm count to 2.", solution: "Two arms create a simple barred spiral galaxy, like a stylized pinwheel.", difficulty: "beginner" },
          { challenge: "Set armCount to 8 — complex galaxy", hint: "Increase the spiral arm count to 8.", solution: "Eight arms create a dense, complex galaxy structure with many overlapping spirals.", difficulty: "beginner" },
          { challenge: "Max spin — tight spiral", hint: "Push the spin factor to its maximum value.", solution: "High spin wraps the arms tightly around the center, creating a compact, wound-up spiral pattern.", difficulty: "beginner" },
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
                <h3 className="font-semibold text-sm">Use additive blending</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Galaxies are made of light. Additive blending makes overlapping
                particles brighter (like real stars clustered together). Dense
                regions glow naturally without any extra code.
              </p>
            </div>
            <div className="rounded-lg border bg-card p-4 space-y-2">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="size-4 text-green-500" />
                <h3 className="font-semibold text-sm">Concentrate scatter at center</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Multiply scatter by radius so outer particles spread more than
                inner ones. This matches real galaxy morphology where the core
                is dense and compact while arms fan out at the edges.
              </p>
            </div>
            <div className="rounded-lg border bg-card p-4 space-y-2">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="size-4 text-green-500" />
                <h3 className="font-semibold text-sm">Vary particle sizes</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Give each particle a random scale attribute. A mix of sizes
                creates visual variety -- a few large bright stars among many
                small dim ones looks far more convincing than uniform dots.
              </p>
            </div>
            <div className="rounded-lg border bg-card p-4 space-y-2">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="size-4 text-green-500" />
                <h3 className="font-semibold text-sm">Slow rotation animation</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                A very slow rotation (0.05 radians per second) makes the
                galaxy feel alive without being distracting. Too fast and it
                breaks the illusion of cosmic scale.
              </p>
            </div>
          </div>
        </section>
      </ScrollReveal>
    </div>
  );
}
