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

const CustomTriangleDemo = dynamic(
  () =>
    import("./_components/custom-triangle-demo").then((m) => ({
      default: m.CustomTriangleDemo,
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
    title: "Forgetting to compute normals",
    subtitle: "Custom geometry renders as completely black even with lights",
    wrongCode: `const positions = new Float32Array([
  -1, -1, 0,  1, -1, 0,  0, 1, 0,
]);
geo.setAttribute('position',
  new BufferAttribute(positions, 3)
);
// No normals! Lit materials will be pure black.`,
    rightCode: `const positions = new Float32Array([
  -1, -1, 0,  1, -1, 0,  0, 1, 0,
]);
geo.setAttribute('position',
  new BufferAttribute(positions, 3)
);
// Let Three.js calculate which way faces point
geo.computeVertexNormals();`,
    filename: "CustomShape.tsx",
    explanation:
      "Lit materials (MeshStandardMaterial, MeshPhongMaterial, etc.) need normal vectors to calculate how light bounces off the surface. Without normals, the lighting math produces zero — pure black. Always call computeVertexNormals() after setting positions.",
  },
  {
    title: "Wrong winding order makes faces invisible",
    subtitle: "The triangle exists but you can only see it from behind",
    wrongCode: `// Clockwise order — this is a BACK face!
const positions = new Float32Array([
   0,  1, 0,  // top
   1, -1, 0,  // bottom-right
  -1, -1, 0,  // bottom-left
]);
// With default culling, invisible from the front`,
    rightCode: `// Counter-clockwise order — this is a FRONT face
const positions = new Float32Array([
  -1, -1, 0,  // bottom-left
   1, -1, 0,  // bottom-right
   0,  1, 0,  // top
]);

// Or render both sides if you're unsure:
<meshStandardMaterial side={DoubleSide} />`,
    filename: "CustomShape.tsx",
    explanation:
      "Three.js determines front vs. back faces by the order of vertices. Counter-clockwise (CCW) = front face. Clockwise (CW) = back face, which gets hidden by default. Fix the vertex order, or use DoubleSide to render both sides.",
  },
  {
    title: "Not computing bounding box/sphere",
    subtitle: "Objects randomly disappear when you rotate the camera",
    wrongCode: `// Custom geometry without bounds
const geo = new BufferGeometry();
geo.setAttribute('position', /* ... */);
geo.computeVertexNormals();
// Works... until the camera moves and the
// object suddenly vanishes!`,
    rightCode: `const geo = new BufferGeometry();
geo.setAttribute('position', /* ... */);
geo.computeVertexNormals();
// Compute bounds for frustum culling
geo.computeBoundingBox();
geo.computeBoundingSphere();
// Now the object only disappears when truly off-screen`,
    filename: "CustomShape.tsx",
    explanation:
      "Three.js uses bounding spheres to decide if an object is visible to the camera (frustum culling). Without bounds, the engine can't make this check correctly, causing objects to vanish when they should be visible. Always compute bounds after building custom geometry.",
  },
];

export default function CustomGeometryPage() {
  return (
    <div className="relative max-w-4xl">
      <div className="absolute -top-10 -left-10 w-72 h-72 bg-gradient-to-br from-teal-500/10 via-emerald-500/10 to-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-3">
          <Badge variant="outline">Geometries</Badge>
        </div>
        <h1 className="text-3xl font-bold tracking-tight mb-3">
          Custom Geometry
        </h1>
        <p className="text-lg text-muted-foreground">
          When the built-in shapes aren&apos;t enough, you can build any shape from scratch.
          Define your own vertices, tell the computer how to connect them, and create
          geometry that doesn&apos;t exist in any toybox.
        </p>
      </div>

      {/* What Could Go Wrong */}
      <WhatCouldGoWrong
        scenario="You carefully define the vertices for a custom triangle. You add lights, a nice material, and position the camera perfectly. The scene loads and... the triangle is completely black. You rotate the view and suddenly it appears from behind — but the front is invisible. What's going on?"
        error="Custom geometry is invisible from the front but visible from behind. Material appears black when visible."
        errorType="Invisible Face"
        accentColor="red"
      />

      <Separator className="my-8" />

      {/* Story Analogy */}
      <ConversationalCallout type="story">
        <p>Think of custom geometry like <strong>origami</strong> — folding paper into 3D shapes.</p>
        <p>Every fold creates a flat surface (a triangle). Every point where folds meet is a <strong>vertex</strong>. The direction a surface faces determines whether you see the &quot;front&quot; or &quot;back&quot; of the paper.</p>
        <p>When you fold origami, the order matters. Fold the paper the wrong way and the design is backwards. In 3D, the order you list your vertices determines which side is the &quot;front&quot; — and by default, the back side is invisible.</p>
        <p>Custom geometry is the ultimate creative tool: you place every vertex, define every triangle, and shape any form you can imagine. But with great power comes great responsibility — you need to handle the details that built-in shapes do automatically.</p>
      </ConversationalCallout>

      <Separator className="my-8" />

      {/* Mental Model Flow */}
      <SimpleFlow
        steps={[
          { label: "Place Vertices", detail: "Define dot positions" },
          { label: "Connect Triangles", detail: "Define which dots form faces" },
          { label: "Compute Normals", detail: "Tell the GPU which way faces point" },
          { label: "Compute Bounds", detail: "Tell the camera what's visible" },
          { label: "Render!", detail: "Your custom shape appears", status: "success" },
        ]}
        accentColor="blue"
      />

      <Separator className="my-8" />

      {/* Interactive Demo */}
      <CustomTriangleDemo />

      <Separator className="my-8" />

      {/* Guided Walkthrough */}
      <ScrollReveal>
        <section className="space-y-4">
          <h2 className="text-2xl font-bold">Hands-On: Building a Custom Quad</h2>
          <p className="text-muted-foreground leading-relaxed">
            Let&apos;s build a square (quad) from scratch. A quad is just two triangles
            that share an edge — the simplest shape beyond a single triangle.
          </p>

          <div className="rounded-lg border bg-card p-4 space-y-3">
            <p className="text-sm font-medium">Step 1: Place four vertices</p>
            <CodeBlock
              code={`const positions = new Float32Array([\n  -1, -1, 0,   // vertex 0: bottom-left\n   1, -1, 0,   // vertex 1: bottom-right\n   1,  1, 0,   // vertex 2: top-right\n  -1,  1, 0,   // vertex 3: top-left\n]);`}
              filename="CustomQuad.tsx"
            />
            <p className="text-sm text-muted-foreground">
              Four dots arranged in a square. But the GPU only draws triangles — so how
              do we make a square from triangles? We need to tell it which dots to connect.
            </p>
          </div>

          <div className="rounded-lg border bg-card p-4 space-y-3">
            <p className="text-sm font-medium">Step 2: Connect them with an index</p>
            <CodeBlock
              code={`const indices = new Uint16Array([\n  0, 1, 2,   // Triangle 1: bottom-left, bottom-right, top-right\n  0, 2, 3,   // Triangle 2: bottom-left, top-right, top-left\n]);\n// Counter-clockwise order = front face`}
              filename="CustomQuad.tsx"
            />
            <p className="text-sm text-muted-foreground">
              The index says: &quot;Make a triangle from vertices 0, 1, 2, then another from
              0, 2, 3.&quot; Notice the counter-clockwise order — this is crucial! It tells
              the GPU which side is the &quot;front.&quot; Two triangles sharing vertex 0 and 2
              form a seamless square.
            </p>
          </div>

          <div className="rounded-lg border bg-card p-4 space-y-3">
            <p className="text-sm font-medium">Step 3: Assemble and finalize</p>
            <CodeBlock
              code={`const geo = useMemo(() => {\n  const g = new BufferGeometry();\n  g.setAttribute('position',\n    new BufferAttribute(positions, 3));\n  g.setIndex(new BufferAttribute(indices, 1));\n  g.computeVertexNormals();\n  g.computeBoundingSphere();\n  return g;\n}, []);\n\n<mesh geometry={geo}>\n  <meshStandardMaterial color="teal" />\n</mesh>`}
              filename="CustomQuad.tsx"
            />
            <p className="text-sm text-muted-foreground">
              We set the position attribute, add the index, compute normals (for lighting),
              and compute the bounding sphere (so the camera knows when it&apos;s on screen).
              Now we have a fully lit, properly culled custom quad! Try adding vertex colors
              by creating a &quot;color&quot; attribute with 3 values (r, g, b) per vertex.
            </p>
          </div>
        </section>
      </ScrollReveal>

      <Separator className="my-8" />

      {/* What You Just Learned */}
      <WhatYouJustLearned
        points={[
          "Custom geometry starts with placing vertices (dots in 3D space) and connecting them into triangles with an index buffer.",
          "Winding order matters: counter-clockwise = front face, clockwise = back face (invisible by default).",
          "You MUST compute normals for lit materials to work — otherwise surfaces render as pure black.",
          "Always compute bounding box and sphere so frustum culling works correctly and objects don't randomly disappear.",
        ]}
      />

      <Separator className="my-8" />

      {/* Thought-Provoking Question */}
      <ConversationalCallout type="question">
        <p>
          If you create a custom cube, each face needs to be flat-shaded (distinct from its neighbors).
          A cube has 8 corners, but you might need more than 8 vertices. Why? What would happen
          if you shared vertices between faces?
        </p>
      </ConversationalCallout>

      <Separator className="my-8" />

      {/* Aha Moment */}
      <AhaMoment
        setup="You'd think that a cube has 8 vertices — one for each corner. But when you look at how custom geometry actually works..."
        reveal="A cube needs 24 vertices, not 8! Each corner appears in 3 different faces, and each face needs its own normal direction (pointing outward). If you share a vertex between three faces, the normals get averaged and the cube looks smooth instead of sharp-edged. That's why you need 3 separate vertices at each corner — one for each face — each with its own normal. This is the fundamental tradeoff: shared vertices = smooth shading, separate vertices = flat/sharp shading."
      />

      <Separator className="my-8" />

      {/* Mental Model Challenge */}
      <MentalModelChallenge
        question="You build a custom triangle with vertices in this order: (0,1,0), (1,-1,0), (-1,-1,0). Looking at it from the front (positive Z direction), it's invisible. What's the most likely fix?"
        options={[
          { label: "Add a light source", correct: false, explanation: "Lights affect brightness, not visibility of faces. The triangle is being culled, not unlit." },
          { label: "Reverse the vertex order to counter-clockwise", correct: true, explanation: "The vertices are in clockwise order, making it a back face. Reversing to CCW fixes it." },
          { label: "Increase the z position to move it in front of the camera", correct: false, explanation: "The triangle position isn't the problem. It's the face direction." },
          { label: "Call computeVertexNormals()", correct: false, explanation: "Normals affect lighting, not face culling. The triangle is being hidden because it's a back face." },
        ]}
        hint="Think about the difference between clockwise and counter-clockwise winding..."
        answer="The vertices are in clockwise order when viewed from the front, making it a back face that gets culled (hidden). Reverse the order to (-1,-1,0), (1,-1,0), (0,1,0) for counter-clockwise winding, or use side: DoubleSide on the material to render both sides."
      />

      <Separator className="my-8" />

      {/* Try This Challenges */}
      <ScrollReveal>
        <TryThisList challenges={[
          {
            challenge: "Toggle vertexColors off — what color is it?",
            hint: "When vertexColors is disabled, the material falls back to its color property.",
            solution: "The shape shows a single solid color from the material's color prop. Without vertex colors, every part of the geometry is the same color — the per-vertex color data is ignored.",
            difficulty: "beginner",
          },
          {
            challenge: "Hide normals — can you guess their direction?",
            hint: "Normals point perpendicular to the face. For a flat triangle in the XY plane, which direction is perpendicular?",
            solution: "For a flat triangle lying in the XY plane, the normals point straight along the Z axis (toward or away from the camera). computeVertexNormals() calculates this automatically based on winding order.",
            difficulty: "intermediate",
          },
          {
            challenge: "Scale to 3 — do normals scale too?",
            hint: "Think about what normals represent. They're directions, not positions.",
            solution: "Normals don't scale with the mesh transform. They remain unit vectors pointing outward from each face. Scaling the mesh changes vertex positions but the normals are automatically adjusted by the GPU's normal matrix to stay correct.",
            difficulty: "advanced",
          },
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
                <h3 className="font-semibold text-sm">Always Compute Normals</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Call computeVertexNormals() after setting all positions and indices. Without normals,
                lit materials render black. Only skip if you provide manual normals for special effects.
              </p>
            </div>
            <div className="rounded-lg border bg-card p-4 space-y-2">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="size-4 text-green-500" />
                <h3 className="font-semibold text-sm">Always Compute Bounds</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Call computeBoundingBox() and computeBoundingSphere() after building geometry.
                Without bounds, frustum culling won&apos;t work and objects may randomly vanish.
              </p>
            </div>
            <div className="rounded-lg border bg-card p-4 space-y-2">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="size-4 text-green-500" />
                <h3 className="font-semibold text-sm">CCW Winding = Front Face</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                List vertices in counter-clockwise order when viewed from the front. Clockwise
                faces are hidden by default. Use DoubleSide only when both sides need to be seen.
              </p>
            </div>
            <div className="rounded-lg border bg-card p-4 space-y-2">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="size-4 text-green-500" />
                <h3 className="font-semibold text-sm">Use Indices to Save Memory</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                When triangles share vertices (which they usually do), use an index buffer.
                Define each unique vertex once and reference it by number. This can cut
                memory usage by 30-50% on complex shapes.
              </p>
            </div>
          </div>
        </section>
      </ScrollReveal>
    </div>
  );
}
