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

const LinesDemoComponent = dynamic(
  () =>
    import("./_components/lines-demo").then((m) => ({
      default: m.LinesDemo,
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
    title: "Curve looks jagged even with many points",
    subtitle: "Too few segments on the TubeGeometry",
    wrongCode: `// Only 4 segments for the whole tube!
const tubeGeo = new THREE.TubeGeometry(
  curve,
  4,      // tubularSegments — way too few
  0.1,    // radius
  8,      // radialSegments
  false
);
// Result: a blocky tube that barely curves`,
    rightCode: `// 64+ segments for a smooth tube
const tubeGeo = new THREE.TubeGeometry(
  curve,
  64,     // enough segments to follow the curve
  0.1,    // radius
  12,     // radialSegments (how round the tube is)
  false
);
// Result: silky smooth tube along the curve`,
    filename: "SmoothTube.tsx",
    explanation:
      "TubeGeometry's first numeric argument is how many cross-sections are placed along the curve. Too few and the tube cuts corners. 64 is a good default. For very long or twisty curves, go higher.",
  },
  {
    title: "Line is invisible because lineWidth has no effect",
    subtitle: "Most GPUs ignore lineWidth in WebGL",
    wrongCode: `// lineWidth > 1 is not supported on most GPUs!
const mat = new THREE.LineBasicMaterial({
  color: "red",
  lineWidth: 5, // This does NOTHING on most systems
});
// Result: always 1 pixel wide`,
    rightCode: `// Use drei's Line component for thick lines
import { Line } from "@react-three/drei";

<Line
  points={[[0,0,0], [1,1,0], [2,0,0]]}
  color="red"
  lineWidth={5}  // This actually works!
/>
// drei uses a custom shader for thick lines`,
    filename: "ThickLine.tsx",
    explanation:
      "WebGL's native line rendering ignores lineWidth on most hardware — lines are always 1 pixel. Drei's Line component uses THREE.Line2 internally, which draws lines as screen-space quads with a shader, giving you real control over thickness.",
  },
  {
    title: "getPointAt returns undefined outside 0-1 range",
    subtitle: "Progress value wraps incorrectly",
    wrongCode: `// Progress goes past 1.0 and crashes!
progressRef.current += delta * speed;
const pt = curve.getPointAt(progressRef.current);
// When progress > 1: returns undefined → TypeError`,
    rightCode: `// Wrap with modulo to stay in [0, 1]
progressRef.current =
  (progressRef.current + delta * speed) % 1;
const pt = curve.getPointAt(progressRef.current);
// Always loops smoothly between 0 and 1`,
    filename: "CurveTraveler.tsx",
    explanation:
      "getPointAt(t) expects t between 0 and 1, representing 0% to 100% along the curve. If t exceeds 1, the method returns undefined and your code crashes. Always use modulo (% 1) to keep the value in range.",
  },
];

export default function LinesCurvesPage() {
  return (
    <div className="max-w-4xl">
      {/* 1. Title + Badge + Intro */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-3">
          <Badge variant="outline">Particles & Lines</Badge>
        </div>
        <h1 className="text-3xl font-bold tracking-tight mb-3">
          Lines & Curves
        </h1>
        <p className="text-lg text-muted-foreground">
          Meshes fill surfaces. Points render dots. Lines connect points into
          paths. And curves smooth those paths into elegant arcs. Together
          they let you draw trails, orbits, wires, roller coasters, or any
          continuous path through 3D space.
        </p>
      </div>

      {/* 2. What Could Go Wrong */}
      <WhatCouldGoWrong
        scenario="You render a line with LineBasicMaterial and set lineWidth to 5 so it is clearly visible. On your dev machine it looks fine — but on your friend's computer, the line is paper thin. The lineWidth setting is completely ignored. No errors, no warnings."
        error="lineWidth has no visible effect. Line is always 1 pixel wide on most hardware."
        errorType="WebGL Limitation"
      />

      <Separator className="my-8" />

      {/* 3. Story Analogy */}
      <ScrollReveal>
        <ConversationalCallout type="story">
          <p>
            Think of lines and curves as <strong>drawing in 3D</strong> with a
            magic pen that works in three dimensions.
          </p>
          <p>
            A <strong>line</strong> is the simplest stroke — connect point A to
            point B in a straight segment. String together multiple points and
            you get a polyline, like connecting dots on a map.
          </p>
          <p>
            But straight segments look robotic. A <strong>curve</strong> is
            like switching your pen to calligraphy mode. You place a few guide
            points and the math smooths the path between them into a flowing
            arc. That is what CatmullRomCurve3 does.
          </p>
          <p>
            And if you want your line to have <strong>volume</strong> — like a
            garden hose instead of a wire — you wrap a TubeGeometry around it.
            Same path, but now with thickness and material.
          </p>
        </ConversationalCallout>
      </ScrollReveal>

      <Separator className="my-8" />

      {/* 4. SimpleFlow */}
      <ScrollReveal>
        <section className="space-y-4">
          <h2 className="text-2xl font-bold">From Points to Thick Curves</h2>
          <p className="text-muted-foreground leading-relaxed">
            Each step adds more visual richness to the same path.
          </p>
          <SimpleFlow
            steps={[
              {
                label: "Control Points",
                detail: "A few 3D positions that define the shape",
              },
              {
                label: "Curve",
                detail: "CatmullRomCurve3 smooths between points",
              },
              {
                label: "Line",
                detail: "Render as a thin visible path",
                status: "success",
              },
              {
                label: "Tube",
                detail: "TubeGeometry gives it real thickness",
                status: "success",
              },
            ]}
            accentColor="indigo"
          />
        </section>
      </ScrollReveal>

      <Separator className="my-8" />

      {/* 5. Interactive Demo */}
      <LinesDemoComponent />

      <Separator className="my-8" />

      {/* 6. Guided Walkthrough */}
      <ScrollReveal>
        <section className="space-y-6">
          <h2 className="text-2xl font-bold">
            Building a Curve Path Step by Step
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            Let us create a smooth curve and animate something along it.
          </p>

          <div className="bg-card border rounded-lg p-4 space-y-3">
            <h3 className="font-semibold text-sm">
              Step 1 -- Define control points
            </h3>
            <CodeBlock
              code={`import * as THREE from "three";

const points = [
  new THREE.Vector3(-3, 0, 0),
  new THREE.Vector3(-1, 2, 1),
  new THREE.Vector3( 1, -1, -1),
  new THREE.Vector3( 3, 0, 0),
];`}
              filename="CurvePath.tsx"
            />
            <p className="text-sm text-muted-foreground">
              These are the guide posts. The curve will pass through each one
              in order. You only need a handful — the math fills in the
              thousands of in-between points.
            </p>
          </div>

          <div className="bg-card border rounded-lg p-4 space-y-3">
            <h3 className="font-semibold text-sm">
              Step 2 -- Create a smooth curve
            </h3>
            <CodeBlock
              code={`const curve = useMemo(() => {
  return new THREE.CatmullRomCurve3(points);
}, []);

// Get 100 evenly spaced points along the curve
const linePoints = curve.getPoints(100);`}
              filename="CurvePath.tsx"
            />
            <p className="text-sm text-muted-foreground">
              CatmullRomCurve3 creates a smooth path that passes through every
              control point. getPoints(100) samples the curve at 100 evenly
              spaced intervals so we can render it.
            </p>
          </div>

          <div className="bg-card border rounded-lg p-4 space-y-3">
            <h3 className="font-semibold text-sm">
              Step 3 -- Render as a tube with thickness
            </h3>
            <CodeBlock
              code={`const tubeGeo = useMemo(() => {
  return new THREE.TubeGeometry(
    curve,
    64,    // segments along the curve
    0.05,  // tube radius
    12,    // radial segments (roundness)
    false  // closed loop?
  );
}, [curve]);

<mesh geometry={tubeGeo}>
  <meshStandardMaterial color="#6366f1" />
</mesh>`}
              filename="CurvePath.tsx"
            />
            <p className="text-sm text-muted-foreground">
              TubeGeometry wraps a cylinder around the curve, giving it real
              3D thickness. It responds to lights and materials just like any
              other mesh. The radius controls how thick the tube is.
            </p>
          </div>

          <div className="bg-card border rounded-lg p-4 space-y-3">
            <h3 className="font-semibold text-sm">
              Step 4 -- Animate an object along the curve
            </h3>
            <CodeBlock
              code={`const dotRef = useRef<THREE.Mesh>(null);
const progress = useRef(0);

useFrame((_, delta) => {
  progress.current = (progress.current + delta * 0.2) % 1;
  const point = curve.getPointAt(progress.current);
  dotRef.current!.position.copy(point);
});

<mesh ref={dotRef}>
  <sphereGeometry args={[0.1]} />
  <meshBasicMaterial color="#22d3ee" />
</mesh>`}
              filename="CurvePath.tsx"
            />
            <p className="text-sm text-muted-foreground">
              getPointAt(t) returns the exact position at percentage t along
              the curve (0 = start, 1 = end). We increment t each frame and
              use modulo to loop. The dot glides smoothly along the path.
            </p>
          </div>
        </section>
      </ScrollReveal>

      <Separator className="my-8" />

      {/* 7. What You Just Learned */}
      <ScrollReveal>
        <WhatYouJustLearned
          points={[
            "CatmullRomCurve3 creates smooth curves that pass through a set of control points.",
            "TubeGeometry wraps a real 3D mesh around a curve, giving it thickness and letting it respond to lighting.",
            "curve.getPointAt(t) returns the position at any percentage along the curve — perfect for animating objects along paths.",
            "Drei's Line component solves the WebGL lineWidth limitation using a custom shader.",
          ]}
        />
      </ScrollReveal>

      <Separator className="my-8" />

      {/* 8. Thought-Provoking Question */}
      <ScrollReveal>
        <ConversationalCallout type="question">
          <p>
            A roller coaster track is a tube that follows a curve through
            space. But the carts also need to tilt and bank through turns.
            How could you use the curve to calculate the correct rotation at
            each point? (Hint: look into Frenet-Serret frames.)
          </p>
        </ConversationalCallout>
      </ScrollReveal>

      <Separator className="my-8" />

      {/* 9. Aha Moment */}
      <ScrollReveal>
        <AhaMoment
          setup="What is the difference between getPoint(t) and getPointAt(t) on a Three.js curve?"
          reveal="getPoint(t) uses the raw parameter t, which does NOT produce uniform spacing — curves move faster through straight sections and slower through sharp bends. getPointAt(t) reparameterizes by arc length, giving you evenly spaced positions. If you are animating something along a path and it speeds up and slows down unevenly, you are probably using getPoint instead of getPointAt."
        />
      </ScrollReveal>

      <Separator className="my-8" />

      {/* 10. Mental Model Challenge */}
      <ScrollReveal>
        <MentalModelChallenge
          question="You draw a line with THREE.LineBasicMaterial and set lineWidth to 8. On Chrome it renders 1 pixel wide. What is the correct fix?"
          options={[
            {
              label: "Use THREE.LineDashedMaterial instead",
              correct: false,
              explanation:
                "LineDashedMaterial has the same lineWidth limitation — it uses the same WebGL line primitive.",
            },
            {
              label: "Switch to drei's <Line> component",
              correct: true,
              explanation:
                "Drei's Line uses THREE.Line2 with a custom shader that draws lines as screen-space quads, bypassing the WebGL limitation.",
            },
            {
              label: "Increase the line's scale",
              correct: false,
              explanation:
                "Scale affects the positions of the line's vertices, not the rendered line width.",
            },
            {
              label: "Set renderer.setPixelRatio(1)",
              correct: false,
              explanation:
                "Pixel ratio affects canvas resolution but does not change the WebGL lineWidth limitation.",
            },
          ]}
          answer="Use drei's <Line> component. WebGL on most hardware ignores lineWidth values greater than 1 — this is a GPU driver limitation, not a bug. Drei's Line component draws lines as screen-space quads using a custom shader, giving you real control over line thickness."
        />
      </ScrollReveal>

      <Separator className="my-8" />

      {/* Try This */}
      <Separator className="my-8" />
      <ScrollReveal>
        <TryThisList challenges={[
          { challenge: "Set tube radius to 0.5 — thick rope!", hint: "Increase the tube radius in the TubeGeometry controls.", solution: "The curve becomes a thick rope-like tube. TubeGeometry gives lines real 3D volume.", difficulty: "beginner" },
          { challenge: "Toggle control points — see the anchors", hint: "Enable the control points visibility toggle.", solution: "Small spheres appear at each control point, showing the guide posts the curve passes through.", difficulty: "beginner" },
          { challenge: "Max speed — racing dot", hint: "Push the animation speed to its maximum.", solution: "The dot races along the curve at high speed, demonstrating getPointAt's smooth arc-length parameterization.", difficulty: "beginner" },
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
                  Use getPointAt for even spacing
                </h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Always prefer getPointAt(t) over getPoint(t) for animation.
                It reparameterizes by arc length so objects move at constant
                speed along the curve.
              </p>
            </div>
            <div className="rounded-lg border bg-card p-4 space-y-2">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="size-4 text-green-500" />
                <h3 className="font-semibold text-sm">
                  Use drei Line for thick lines
                </h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Native WebGL lines are always 1px on most GPUs. Drei's Line
                component uses Line2 and a custom shader to render properly
                thick, anti-aliased lines.
              </p>
            </div>
            <div className="rounded-lg border bg-card p-4 space-y-2">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="size-4 text-green-500" />
                <h3 className="font-semibold text-sm">
                  Memoize curve and geometry
                </h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Wrap CatmullRomCurve3 and TubeGeometry in useMemo. Creating
                them is expensive and they only need to be recalculated when
                control points change.
              </p>
            </div>
            <div className="rounded-lg border bg-card p-4 space-y-2">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="size-4 text-green-500" />
                <h3 className="font-semibold text-sm">
                  Match tube segments to curvature
                </h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Simple arcs need fewer segments than tight spirals. Start with
                64 and increase only if you see faceting. More segments means
                more triangles means more GPU work.
              </p>
            </div>
          </div>
        </section>
      </ScrollReveal>
    </div>
  );
}
