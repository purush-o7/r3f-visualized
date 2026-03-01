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

const ShaderDemo = dynamic(
  () => import("./_components/shader-demo").then((m) => ({ default: m.ShaderDemo })),
  {
    ssr: false,
    loading: () => (
      <div className="w-full aspect-[2/1] rounded-xl border bg-[#0a0a0a] animate-pulse" />
    ),
  }
);

const mistakes: Mistake[] = [
  {
    title: "Forgetting precision in RawShaderMaterial",
    subtitle: "RawShaderMaterial doesn't inject precision automatically",
    wrongCode: `<rawShaderMaterial
  vertexShader={\`
    attribute vec3 position;
    uniform mat4 projectionMatrix;
    uniform mat4 modelViewMatrix;
    void main() {
      gl_Position = projectionMatrix
        * modelViewMatrix * vec4(position, 1.0);
    }
  \`}
  fragmentShader={\`
    void main() {
      gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
    }
  \`}
/>`,
    rightCode: `<rawShaderMaterial
  vertexShader={\`
    precision mediump float;
    attribute vec3 position;
    uniform mat4 projectionMatrix;
    uniform mat4 modelViewMatrix;
    void main() {
      gl_Position = projectionMatrix
        * modelViewMatrix * vec4(position, 1.0);
    }
  \`}
  fragmentShader={\`
    precision mediump float;
    void main() {
      gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
    }
  \`}
/>`,
    filename: "RawShaderPrecision.tsx",
    explanation:
      "RawShaderMaterial is a completely blank slate -- nothing is injected for you. You must declare 'precision mediump float;' at the top of both shaders. ShaderMaterial handles this automatically, which is why it's recommended for beginners.",
  },
  {
    title: "Setting gl_Position with vec3 instead of vec4",
    subtitle: "gl_Position requires a 4D homogeneous coordinate",
    wrongCode: `void main() {
  // ERROR: position is vec3, gl_Position needs vec4
  gl_Position = projectionMatrix
    * modelViewMatrix * position;
}`,
    rightCode: `void main() {
  // Correct: wrap position in vec4 with w=1.0
  gl_Position = projectionMatrix
    * modelViewMatrix * vec4(position, 1.0);
}`,
    filename: "vertex.glsl",
    explanation:
      "gl_Position is a vec4 that uses homogeneous coordinates for perspective projection. The w component must be 1.0 for position vertices. Always wrap position in vec4(position, 1.0).",
  },
  {
    title: "Creating new uniform objects on every render",
    subtitle: "Recreating the uniforms object causes shader recompilation",
    wrongCode: `function BadShader() {
  // New object every render = recompilation!
  return (
    <shaderMaterial
      uniforms={{
        uTime: { value: 0 },
        uColor: { value: new THREE.Color('red') },
      }}
      vertexShader={vs}
      fragmentShader={fs}
    />
  )
}`,
    rightCode: `function GoodShader() {
  const uniforms = useRef({
    uTime: { value: 0 },
    uColor: { value: new THREE.Color('red') },
  })

  useFrame(({ clock }) => {
    uniforms.current.uTime.value = clock.elapsedTime
  })

  return (
    <shaderMaterial
      uniforms={uniforms.current}
      vertexShader={vs}
      fragmentShader={fs}
    />
  )
}`,
    filename: "StableUniforms.tsx",
    explanation:
      "When you define uniforms inline in JSX, React creates a new object reference on every render. Three.js detects this and recompiles the shader program, which is extremely expensive. Always define uniforms with useRef or useMemo, and mutate only the .value property inside useFrame.",
  },
];

export default function ShaderMaterialPage() {
  return (
    <div className="max-w-4xl ambient-shaders">
      {/* Title + Badge + Intro */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-3">
          <Badge variant="outline">Shaders</Badge>
        </div>
        <h1 className="text-3xl font-bold tracking-tight mb-3">
          Shader Material
        </h1>
        <p className="text-lg text-muted-foreground">
          Built-in materials like MeshStandardMaterial are like buying pre-mixed
          paint at the store -- convenient, but limited to the colors on the
          shelf. ShaderMaterial is like mixing your own custom paint formula.
          You control every ingredient: the exact color of every pixel, how
          vertices move, how light interacts. Total creative freedom, but you
          need to understand the ingredients.
        </p>
      </div>

      {/* What Could Go Wrong */}
      <WhatCouldGoWrong
        scenario="You write your first custom shader with a vertex and fragment shader. The mesh shows up, but it's solid pink (or black). No errors in your JavaScript code, but something is clearly wrong with the shader."
        error="THREE.WebGLShader: gl.getShaderInfoLog() fragment: ERROR: 0:2: '' : No precision specified for (float)"
        errorType="GLSL Compile Error"
        accentColor="red"
      />

      <Separator className="my-8" />

      {/* Story Analogy */}
      <ConversationalCallout type="story">
        <p>
          Imagine you are a paint chemist instead of a painter. A normal painter
          picks a can of &ldquo;Ocean Blue&rdquo; off the shelf and rolls it on.
          But you? You write the formula: 40% blue pigment, 10% white, a dash
          of green, and a metallic flake that shifts color depending on the
          viewing angle.
        </p>
        <p>
          That is what ShaderMaterial lets you do. Instead of choosing
          MeshStandardMaterial and setting a color prop, you write two tiny
          programs (shaders) that run on the GPU. The vertex shader decides
          where each corner of the geometry goes. The fragment shader decides
          what color each pixel gets. Together, they can create effects that
          no pre-built material can match.
        </p>
      </ConversationalCallout>

      <Separator className="my-8" />

      {/* SimpleFlow */}
      <SimpleFlow
        steps={[
          { label: "Vertices", detail: "position, normal, uv" },
          { label: "Vertex Shader", detail: "Where each point goes" },
          { label: "Rasterization", detail: "GPU fills triangles" },
          { label: "Fragment Shader", detail: "Color of each pixel" },
          { label: "Screen!", detail: "Pixels on display", status: "success" },
        ]}
        accentColor="blue"
      />

      <Separator className="my-8" />

      {/* Demo */}
      <ShaderDemo />

      <Separator className="my-8" />

      {/* Guided Walkthrough */}
      <ScrollReveal>
        <section className="space-y-4">
          <h2 className="text-2xl font-bold">Mixing Your First Formula</h2>
          <p className="text-muted-foreground leading-relaxed">
            A shader material needs exactly two GLSL programs: a vertex shader
            that positions your geometry, and a fragment shader that colors
            each pixel. Let&apos;s write them step by step.
          </p>

          <div className="rounded-lg border bg-card p-4 space-y-3">
            <p className="text-sm font-medium">Step 1: The vertex shader -- where things go</p>
            <CodeBlock
              code={`vertexShader: \`
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix
      * modelViewMatrix * vec4(position, 1.0);
  }
\``}
              filename="vertex.glsl"
            />
            <p className="text-sm text-muted-foreground">
              This is the simplest vertex shader: it takes each vertex position,
              transforms it from 3D world space to 2D screen space, and passes
              the UV coordinates along to the fragment shader. The position,
              uv, projectionMatrix, and modelViewMatrix are all provided
              automatically by ShaderMaterial.
            </p>
          </div>

          <div className="rounded-lg border bg-card p-4 space-y-3">
            <p className="text-sm font-medium">Step 2: The fragment shader -- what color each pixel gets</p>
            <CodeBlock
              code={`fragmentShader: \`
  varying vec2 vUv;
  void main() {
    vec3 color = mix(
      vec3(1.0, 0.0, 0.0),
      vec3(0.0, 0.0, 1.0),
      vUv.x
    );
    gl_FragColor = vec4(color, 1.0);
  }
\``}
              filename="fragment.glsl"
            />
            <p className="text-sm text-muted-foreground">
              This fragment shader creates a gradient from red to blue across
              the surface. mix() blends between two colors based on vUv.x,
              which goes from 0 on the left to 1 on the right. Every pixel
              gets a unique color based on its UV position.
            </p>
          </div>

          <div className="rounded-lg border bg-card p-4 space-y-3">
            <p className="text-sm font-medium">Step 3: Wire it up in R3F</p>
            <CodeBlock
              code={`<mesh>
  <planeGeometry args={[4, 4]} />
  <shaderMaterial
    vertexShader={vertexShader}
    fragmentShader={fragmentShader}
  />
</mesh>`}
              filename="GradientPlane.tsx"
            />
            <p className="text-sm text-muted-foreground">
              Pass your GLSL strings to the shaderMaterial component and
              attach it to any geometry. That is it -- you have written your
              first custom shader. Every pixel is now colored by your formula
              instead of a pre-built material.
            </p>
          </div>

          <div className="rounded-lg border bg-card p-4 space-y-3">
            <p className="text-sm font-medium">Step 4: Add time-based animation</p>
            <CodeBlock
              code={`const uniforms = useRef({
  uTime: { value: 0 }
})

useFrame(({ clock }) => {
  uniforms.current.uTime.value = clock.elapsedTime
})

<shaderMaterial
  uniforms={uniforms.current}
  vertexShader={vs}
  fragmentShader={fs}
/>`}
              filename="AnimatedShader.tsx"
            />
            <p className="text-sm text-muted-foreground">
              Pass a time value as a uniform and update it every frame with
              useFrame. Inside your GLSL code, use uTime to animate colors,
              wave patterns, or vertex positions. The key: define uniforms
              with useRef so the object reference stays stable.
            </p>
          </div>
        </section>
      </ScrollReveal>

      <Separator className="my-8" />

      {/* What You Just Learned */}
      <WhatYouJustLearned
        points={[
          "ShaderMaterial is like mixing your own paint formula -- total control over how every pixel is colored.",
          "Every shader needs two programs: a vertex shader (where things go) and a fragment shader (what color they are).",
          "ShaderMaterial auto-injects built-in uniforms (projectionMatrix, modelViewMatrix) and attributes (position, uv, normal).",
          "Always define uniforms with useRef, never inline. Inline objects cause expensive shader recompilation.",
          "RawShaderMaterial is the blank-slate version where nothing is injected automatically.",
        ]}
      />

      <Separator className="my-8" />

      {/* Question */}
      <ConversationalCallout type="question">
        <p>
          If ShaderMaterial auto-injects built-in uniforms and attributes, when
          would you ever want to use RawShaderMaterial where you have to declare
          everything yourself?
        </p>
      </ConversationalCallout>

      <Separator className="my-8" />

      {/* Aha Moment */}
      <AhaMoment
        setup="You see two shader types: ShaderMaterial and RawShaderMaterial. Both take vertex and fragment shader strings. What's the real difference?"
        reveal="ShaderMaterial secretly prepends a huge chunk of GLSL code to your shaders before compilation. This includes precision declarations, all built-in Three.js uniforms (projectionMatrix, modelViewMatrix, normalMatrix), and all geometry attributes (position, normal, uv). RawShaderMaterial gives you a completely empty file -- you declare everything yourself. Most developers use ShaderMaterial because the auto-injected code is exactly what you need 95% of the time."
      />

      <Separator className="my-8" />

      {/* Mental Model Challenge */}
      <MentalModelChallenge
        question="Your shader works perfectly on desktop but shows a solid pink mesh on mobile. What is most likely the issue?"
        options={[
          {
            label: "The GPU does not support shaders on mobile",
            correct: false,
            explanation: "All modern mobile GPUs support GLSL shaders through WebGL. Mobile GPU capability is not the issue.",
          },
          {
            label: "You're using RawShaderMaterial without a precision declaration",
            correct: true,
            explanation: "Mobile GPUs require an explicit precision declaration. Desktop GPUs often default to highp, but mobile GPUs don't. A missing 'precision mediump float;' causes a compile error, which Three.js shows as a pink fallback.",
          },
          {
            label: "Mobile browsers don't support custom materials",
            correct: false,
            explanation: "Mobile browsers fully support ShaderMaterial and RawShaderMaterial through WebGL. The issue is in your GLSL code, not browser support.",
          },
        ]}
        hint="Think about what ShaderMaterial gives you automatically that RawShaderMaterial does not..."
        answer="The missing precision declaration. RawShaderMaterial does not inject 'precision mediump float;' for you. Desktop GPUs silently default to highp precision, but mobile GPUs require it explicitly. Add the precision line at the top of both your vertex and fragment shaders, or switch to ShaderMaterial which handles this automatically."
      />

      <Separator className="my-8" />

      {/* Try This */}
      <Separator className="my-8" />
      <ScrollReveal>
        <TryThisList challenges={[
          { challenge: "Set amplitude to 0 — smooth sphere!", hint: "Drag the amplitude slider to zero to disable vertex displacement.", solution: "With no displacement, the sphere returns to its original smooth shape. The fragment shader still colors it.", difficulty: "beginner" },
          { challenge: "Max frequency — spiky ball!", hint: "Crank the frequency slider to its maximum value.", solution: "High frequency creates many tight waves across the surface, making the sphere look like a spiky sea urchin.", difficulty: "beginner" },
          { challenge: "Change colorA and colorB — new palette", hint: "Use the color pickers to set colorA and colorB to different colors.", solution: "The gradient shifts to your chosen colors, showing how uniform values drive the fragment shader output.", difficulty: "beginner" },
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
                <h3 className="font-semibold text-sm">Start with ShaderMaterial</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Unless you need full control over the GLSL preamble, use
                ShaderMaterial. It auto-injects uniforms, attributes, and
                precision. Switch to RawShaderMaterial only when needed.
              </p>
            </div>
            <div className="rounded-lg border bg-card p-4 space-y-2">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="size-4 text-green-500" />
                <h3 className="font-semibold text-sm">Stabilize Uniform References</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Define uniforms with useRef or useMemo, never inline in JSX.
                Mutate only the .value property inside useFrame. A new object
                reference triggers expensive shader recompilation every frame.
              </p>
            </div>
            <div className="rounded-lg border bg-card p-4 space-y-2">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="size-4 text-green-500" />
                <h3 className="font-semibold text-sm">Use High-Segment Geometry</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Vertex displacement effects need enough vertices to look smooth.
                Use at least 64x64 segments for spheres and 32x32 for planes
                when doing displacement in the vertex shader.
              </p>
            </div>
            <div className="rounded-lg border bg-card p-4 space-y-2">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="size-4 text-green-500" />
                <h3 className="font-semibold text-sm">Check the Browser Console</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                GLSL compilation errors appear in the browser console with
                line numbers. If your shader produces a pink or black mesh,
                open the console first -- the error message will point you
                to the exact line in your GLSL code.
              </p>
            </div>
          </div>
        </section>
      </ScrollReveal>
    </div>
  );
}
