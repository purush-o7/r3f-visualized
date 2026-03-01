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

const WaveDemo = dynamic(
  () =>
    import("./_components/wave-demo").then((m) => ({
      default: m.WaveDemo,
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
    title: "Forgetting needsUpdate after modifying data",
    subtitle: "You changed the numbers but the shape doesn't move",
    wrongCode: `useFrame(({ clock }) => {
  const pos = geo.attributes.position;
  for (let i = 0; i < pos.count; i++) {
    pos.setY(i, Math.sin(pos.getX(i) + clock.elapsedTime));
  }
  // FORGOT: pos.needsUpdate = true;
  // GPU still has the old data!
});`,
    rightCode: `useFrame(({ clock }) => {
  const pos = geo.attributes.position;
  for (let i = 0; i < pos.count; i++) {
    pos.setY(i, Math.sin(pos.getX(i) + clock.elapsedTime));
  }
  // Tell the GPU to re-upload the data
  pos.needsUpdate = true;
  geo.computeVertexNormals();
});`,
    filename: "WavePlane.tsx",
    explanation:
      "BufferAttribute data lives on the GPU after the first render. When you modify the JavaScript array, the GPU's copy is stale. Setting needsUpdate = true tells Three.js to re-upload the data. The flag auto-resets after upload.",
  },
  {
    title: "Wrong itemSize for buffer attributes",
    subtitle: "Mesh looks scrambled or disappears entirely",
    wrongCode: `// WRONG: UVs need itemSize 2, not 3!
const uvs = new Float32Array([0,0, 1,0, 0.5,1]);
geo.setAttribute('uv',
  new BufferAttribute(uvs, 3)  // Should be 2!
);`,
    rightCode: `// Position: 3 values per vertex (x, y, z)
geo.setAttribute('position',
  new BufferAttribute(positions, 3)
);
// UVs: 2 values per vertex (u, v)
geo.setAttribute('uv',
  new BufferAttribute(uvs, 2)
);
// Normals: 3 values per vertex (nx, ny, nz)
geo.setAttribute('normal',
  new BufferAttribute(normals, 3)
);`,
    filename: "CustomGeo.tsx",
    explanation:
      "The itemSize tells Three.js how many numbers make up one vertex's attribute. Positions use 3 (x, y, z). UVs use 2 (u, v). Getting this wrong means Three.js reads the wrong number of values per vertex, scrambling the entire mesh.",
  },
  {
    title: "Trying to resize a buffer after creation",
    subtitle: "You can't add more vertices to an existing buffer",
    wrongCode: `// WRONG: Can't push to a Float32Array!
const positions = new Float32Array(9); // 3 verts
// Later...
// positions.push(1, 2, 3); // TypeError!`,
    rightCode: `// Pre-allocate the maximum size
const MAX_VERTS = 1000;
const positions = new Float32Array(MAX_VERTS * 3);
geo.setAttribute('position',
  new BufferAttribute(positions, 3)
);
// Control how many are drawn:
geo.setDrawRange(0, currentCount);`,
    filename: "DynamicGeo.tsx",
    explanation:
      "Float32Arrays have a fixed size. You cannot grow a BufferAttribute after creation. For dynamic scenarios (particle systems, trails), allocate the maximum size upfront and use setDrawRange to control how many vertices are actually rendered.",
  },
];

export default function BufferGeometryPage() {
  return (
    <div className="relative max-w-4xl">
      <div className="absolute -top-10 -left-10 w-72 h-72 bg-gradient-to-br from-teal-500/10 via-emerald-500/10 to-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-3">
          <Badge variant="outline">Geometries</Badge>
        </div>
        <h1 className="text-3xl font-bold tracking-tight mb-3">
          Buffer Geometry
        </h1>
        <p className="text-lg text-muted-foreground">
          Under the hood, every shape in Three.js is just a list of numbers — positions
          of dots in 3D space that get connected into triangles. BufferGeometry is how
          those numbers get to the GPU, and understanding it gives you the power
          to create any shape imaginable.
        </p>
      </div>

      {/* What Could Go Wrong */}
      <WhatCouldGoWrong
        scenario="You build a wave animation by modifying vertex positions every frame. The positions change in your JavaScript code — you can log them and see the new values. But on screen, the plane is completely frozen. The wave never moves. No errors anywhere."
        error="Vertex positions update in JavaScript but the rendered mesh doesn't change. No console errors."
        errorType="Stale GPU Data"
        accentColor="red"
      />

      <Separator className="my-8" />

      {/* Story Analogy */}
      <ConversationalCallout type="story">
        <p>Think of BufferGeometry like a <strong>connect-the-dots</strong> puzzle.</p>
        <p>You place numbered dots in 3D space — those are your <strong>vertices</strong>. Each dot has a position (x, y, z).</p>
        <p>Then you tell the computer which dots to connect: &quot;Connect dot 0, dot 1, and dot 2 to make a triangle.&quot; That&apos;s the <strong>index</strong>.</p>
        <p>The more dots you place and connect, the more complex your shape gets. A cube is 8 dots connected into 12 triangles. A smooth sphere is hundreds of dots carefully arranged on a round surface.</p>
        <p>The key insight: all those dots and connections are stored as a flat list of numbers that gets uploaded to the GPU for ultra-fast rendering.</p>
      </ConversationalCallout>

      <Separator className="my-8" />

      {/* Mental Model Flow */}
      <SimpleFlow
        steps={[
          { label: "Numbers", detail: "Float32Array of positions" },
          { label: "Attribute", detail: "Tells GPU: '3 numbers = 1 vertex'" },
          { label: "GPU Buffer", detail: "Uploaded to video memory" },
          { label: "Triangles", detail: "Connected and rendered!", status: "success" },
        ]}
        accentColor="blue"
      />

      <Separator className="my-8" />

      {/* Interactive Demo */}
      <WaveDemo />

      <Separator className="my-8" />

      {/* Guided Walkthrough */}
      <ScrollReveal>
        <section className="space-y-4">
          <h2 className="text-2xl font-bold">Hands-On: Building a Triangle from Numbers</h2>
          <p className="text-muted-foreground leading-relaxed">
            Let&apos;s build the simplest possible shape — a single triangle — from
            raw numbers. This is what every built-in geometry does under the hood.
          </p>

          <div className="rounded-lg border bg-card p-4 space-y-3">
            <p className="text-sm font-medium">Step 1: Place three dots in space</p>
            <CodeBlock
              code={`const positions = new Float32Array([\n  -1, -1, 0,   // Dot 0: bottom-left\n   1, -1, 0,   // Dot 1: bottom-right\n   0,  1, 0,   // Dot 2: top-center\n]);`}
              filename="Triangle.tsx"
            />
            <p className="text-sm text-muted-foreground">
              Nine numbers, three dots. Every three numbers is one vertex: [x, y, z].
              We placed three dots in a triangle shape — bottom-left, bottom-right, and top-center.
              These are just numbers in memory right now — nothing is on screen yet.
            </p>
          </div>

          <div className="rounded-lg border bg-card p-4 space-y-3">
            <p className="text-sm font-medium">Step 2: Tell the GPU how to read them</p>
            <CodeBlock
              code={`<mesh>\n  <bufferGeometry>\n    <bufferAttribute\n      attach="attributes-position"\n      array={positions}\n      count={3}\n      itemSize={3}\n    />\n  </bufferGeometry>\n  <meshBasicMaterial color="hotpink" side={DoubleSide} />\n</mesh>`}
              filename="Triangle.tsx"
            />
            <p className="text-sm text-muted-foreground">
              The itemSize of 3 tells the GPU: &quot;every 3 numbers is one vertex.&quot;
              The count of 3 says &quot;there are 3 vertices.&quot; We use meshBasicMaterial here
              because it doesn&apos;t need lighting — we haven&apos;t set up normals yet.
            </p>
          </div>

          <div className="rounded-lg border bg-card p-4 space-y-3">
            <p className="text-sm font-medium">Step 3: Make it react to light</p>
            <CodeBlock
              code={`// Inside the bufferGeometry, after position:\nconst geo = useRef<BufferGeometry>(null!);\n\nuseEffect(() => {\n  geo.current.computeVertexNormals();\n}, []);\n\n// Now you can use meshStandardMaterial!\n<meshStandardMaterial color="hotpink" />`}
              filename="Triangle.tsx"
            />
            <p className="text-sm text-muted-foreground">
              computeVertexNormals() calculates which direction each face points — this tells
              the lighting system how light bounces off the surface. Without normals,
              physically-based materials render as pure black. Think of normals as tiny arrows
              pointing &quot;outward&quot; from each surface.
            </p>
          </div>
        </section>
      </ScrollReveal>

      <Separator className="my-8" />

      {/* What You Just Learned */}
      <WhatYouJustLearned
        points={[
          "BufferGeometry stores vertex data as flat arrays of numbers (Float32Array) that get uploaded directly to the GPU.",
          "The 'itemSize' tells the GPU how to read the array: 3 for positions (x,y,z), 2 for UVs (u,v), 3 for normals (nx,ny,nz).",
          "After modifying buffer data at runtime, you must set needsUpdate = true to tell the GPU to re-upload the data.",
          "An index buffer lets you define vertices once and reuse them across triangles, saving memory for complex shapes.",
        ]}
      />

      <Separator className="my-8" />

      {/* Thought-Provoking Question */}
      <ConversationalCallout type="question">
        <p>
          A square is made of 2 triangles that share an edge. Without an index buffer,
          you need 6 vertices (3 per triangle). With an index buffer, you only need 4
          unique vertices. How much memory does this save if you have a terrain grid
          with 10,000 squares?
        </p>
      </ConversationalCallout>

      <Separator className="my-8" />

      {/* Aha Moment */}
      <AhaMoment
        setup="You might wonder: why are vertex positions stored in a Float32Array instead of a normal JavaScript array?"
        reveal="Normal JavaScript arrays can hold any type — strings, objects, booleans, all mixed together. The engine has to check the type of each element before processing. A Float32Array guarantees every element is a 32-bit float, with no type-checking needed. This lets the GPU read the data directly without any conversion — like the difference between hand-delivering letters one by one versus pouring them all into a mail truck at once. This is why 3D graphics can process millions of vertices per frame."
      />

      <Separator className="my-8" />

      {/* Mental Model Challenge */}
      <MentalModelChallenge
        question="You modify vertex positions in your useFrame callback and the values change correctly when you log them. But the mesh on screen doesn't move. What did you forget?"
        options={[
          { label: "Calling geometry.computeVertexNormals()", correct: false, explanation: "Normals affect lighting, not position updates. The mesh would still move without recomputing normals." },
          { label: "Setting needsUpdate = true on the position attribute", correct: true, explanation: "The GPU has its own copy of the data. Without needsUpdate, the GPU never gets the new values." },
          { label: "Calling geometry.dispose() and recreating it", correct: false, explanation: "You don't need to recreate the geometry! Just flag the attribute for re-upload." },
          { label: "Adding the mesh to the scene again", correct: false, explanation: "The mesh is already in the scene. Removing and re-adding it won't help with buffer updates." },
        ]}
        hint="The GPU has its own copy of the vertex data..."
        answer="You need to set positionAttribute.needsUpdate = true after changing values. The GPU keeps its own copy of the data. When you modify the Float32Array in JavaScript, the GPU's copy is stale. Setting needsUpdate tells Three.js to re-upload the fresh data to the GPU on the next render."
      />

      <Separator className="my-8" />

      {/* Try This Challenges */}
      <ScrollReveal>
        <TryThisList challenges={[
          {
            challenge: "Change waveHeight to 0 — what do you see?",
            hint: "If the wave height is zero, what happens to the Y displacement of each vertex?",
            solution: "You get a perfectly flat plane. With waveHeight at 0, all Y positions stay at their original values and no wave animation occurs.",
            difficulty: "beginner",
          },
          {
            challenge: "Max out waveFrequency — what happens?",
            hint: "Higher frequency means more wave cycles packed into the same space.",
            solution: "The waves become extremely tight and dense — lots of tiny ripples instead of gentle rolling waves. At very high frequencies, the mesh may look noisy or jagged because there aren't enough vertices to represent such fine detail.",
            difficulty: "intermediate",
          },
          {
            challenge: "Toggle wireframe to see the vertex grid",
            hint: "Add wireframe={true} to the material to reveal the underlying vertex structure.",
            solution: "Wireframe mode shows you exactly how the plane's vertices are connected. You can see how each vertex moves up and down independently to create the wave shape. More segments means a smoother wave.",
            difficulty: "beginner",
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
                <h3 className="font-semibold text-sm">Use Indexed Geometry</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Always prefer indexed geometry for meshes with shared vertices. It reduces memory
                and improves performance by letting the GPU cache and reuse vertex computations.
              </p>
            </div>
            <div className="rounded-lg border bg-card p-4 space-y-2">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="size-4 text-green-500" />
                <h3 className="font-semibold text-sm">Set needsUpdate Sparingly</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Only set needsUpdate = true on frames where data actually changed. Re-uploading
                buffers to the GPU every frame is expensive. The flag auto-resets after upload.
              </p>
            </div>
            <div className="rounded-lg border bg-card p-4 space-y-2">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="size-4 text-green-500" />
                <h3 className="font-semibold text-sm">Pre-Allocate for Dynamic Data</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                For particle systems or trails, allocate the maximum buffer size upfront and use
                setDrawRange to control how much is drawn. You cannot resize buffers after creation.
              </p>
            </div>
            <div className="rounded-lg border bg-card p-4 space-y-2">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="size-4 text-green-500" />
                <h3 className="font-semibold text-sm">Use getX/setY Helper Methods</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                BufferAttribute provides getX(i), setY(i, val) etc. These are much clearer than
                raw array indexing (array[i * 3 + 1]) and handle interleaved buffers correctly.
              </p>
            </div>
          </div>
        </section>
      </ScrollReveal>
    </div>
  );
}
