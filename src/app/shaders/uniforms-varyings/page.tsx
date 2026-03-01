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

const UniformsDemo = dynamic(
  () =>
    import("./_components/uniforms-demo").then((m) => ({
      default: m.UniformsDemo,
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
    title: "Creating new uniform objects every frame",
    subtitle: "Mutating .value is correct; replacing the object is not",
    wrongCode: `function BadShader() {
  const [time, setTime] = useState(0)

  useFrame(({ clock }) => {
    setTime(clock.elapsedTime) // Re-render!
  })

  return (
    <shaderMaterial
      uniforms={{ uTime: { value: time } }}
      vertexShader={vs}
      fragmentShader={fs}
    />
  )
}`,
    rightCode: `function GoodShader() {
  const uniforms = useRef({
    uTime: { value: 0 },
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
    filename: "UniformUpdate.tsx",
    explanation:
      "Uniforms should be updated by mutating the .value property, never by replacing the entire object. Using useState forces a React re-render and creates a new uniforms reference, which triggers expensive shader recompilation. Use useRef and mutate .value inside useFrame.",
  },
  {
    title: "Mismatched varying names between shaders",
    subtitle: "Varyings must have identical name and type in both shaders",
    wrongCode: `// Vertex declares vUv
const vs = \`
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix
      * modelViewMatrix * vec4(position, 1.0);
  }
\`

// Fragment declares vUV (capital V) — MISMATCH!
const fs = \`
  varying vec2 vUV;
  void main() {
    gl_FragColor = vec4(vUV, 0.0, 1.0);
  }
\``,
    rightCode: `// Both shaders use the exact same name: vUv
const vs = \`
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix
      * modelViewMatrix * vec4(position, 1.0);
  }
\`

const fs = \`
  varying vec2 vUv;
  void main() {
    gl_FragColor = vec4(vUv, 0.0, 1.0);
  }
\``,
    filename: "VaryingMatch.glsl",
    explanation:
      "GLSL is case-sensitive. 'vUv' and 'vUV' are different variables. If the varying names don't match between vertex and fragment shaders, the linker will report an error or the varying will be zeroed. Convention: prefix with lowercase 'v' and use camelCase (vUv, vNormal).",
  },
  {
    title: "Using wrong JavaScript type for uniform values",
    subtitle: "GLSL types must match their JavaScript counterparts",
    wrongCode: `const uniforms = useRef({
  // vec3 but passing an array — won't work!
  uColor: { value: [1.0, 0.0, 0.0] },
  // vec2 but passing a plain object
  uMouse: { value: { x: 0, y: 0 } },
})`,
    rightCode: `const uniforms = useRef({
  // vec3 -> THREE.Color or THREE.Vector3
  uColor: { value: new THREE.Color(1, 0, 0) },
  // vec2 -> THREE.Vector2
  uMouse: { value: new THREE.Vector2(0, 0) },
})

// Type mapping:
// float -> number
// vec2  -> THREE.Vector2
// vec3  -> THREE.Vector3 or THREE.Color
// mat4  -> THREE.Matrix4
// sampler2D -> THREE.Texture`,
    filename: "UniformTypes.tsx",
    explanation:
      "Three.js expects specific JavaScript types for each GLSL uniform type. Plain arrays and objects don't work. Use the corresponding Three.js class (Vector2, Vector3, Color, Matrix4). Type mismatches fail silently, producing zeroed values in the shader.",
  },
];

export default function UniformsVaryingsPage() {
  return (
    <div className="relative max-w-4xl">
      <div className="absolute -top-10 -left-10 w-72 h-72 bg-gradient-to-br from-teal-500/10 via-emerald-500/10 to-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
      {/* Title + Badge + Intro */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-3">
          <Badge variant="outline">Shaders</Badge>
        </div>
        <h1 className="text-3xl font-bold tracking-tight mb-3">
          Uniforms &amp; Varyings
        </h1>
        <p className="text-lg text-muted-foreground">
          Think of uniforms and varyings like a radio broadcast. A uniform is
          the radio station frequency -- the same signal goes out to every
          listener (every vertex and pixel gets the same value, like time or
          a color). A varying is like each listener&apos;s personal volume dial
          -- it is different for every pixel, smoothly interpolated across the
          surface of each triangle.
        </p>
      </div>

      {/* What Could Go Wrong */}
      <WhatCouldGoWrong
        scenario="You add a uTime uniform to animate your shader. It works for about 2 seconds, then the frame rate drops to 5fps. The animation looks correct, but the entire page becomes unusable. Your fan starts spinning."
        error="Performance collapse: 60fps -> 5fps. Shader program recompiling on every frame due to new uniform object reference being created via useState + inline uniforms."
        errorType="Performance"
        accentColor="red"
      />

      <Separator className="my-8" />

      {/* Story Analogy */}
      <ConversationalCallout type="story">
        <p>
          Picture a radio station broadcasting to a city. The station transmits
          one signal at one frequency -- every radio in the city receives the
          same broadcast. That is a uniform. When you send uTime = 3.5 to your
          shader, every single vertex and every single pixel receives that exact
          same value of 3.5. One value, shared by everyone.
        </p>
        <p>
          Now think about the volume dial on each radio. Every listener adjusts
          it differently. One person has it at 80%, another at 30%. And if you
          walked smoothly between them, the volume would blend smoothly too.
          That is a varying. The vertex shader sets a value at each corner of a
          triangle, and the GPU smoothly blends those values across every pixel
          inside the triangle.
        </p>
      </ConversationalCallout>

      <Separator className="my-8" />

      {/* SimpleFlow */}
      <SimpleFlow
        steps={[
          { label: "JavaScript", detail: "Set uniform values" },
          { label: "Vertex Shader", detail: "Reads uniforms, writes varyings" },
          { label: "GPU Interpolation", detail: "Blends varyings per-pixel" },
          { label: "Fragment Shader", detail: "Reads interpolated varyings" },
          { label: "Pixel Color!", detail: "Final output", status: "success" },
        ]}
        accentColor="blue"
      />

      <Separator className="my-8" />

      {/* Demo */}
      <UniformsDemo />

      <Separator className="my-8" />

      {/* Guided Walkthrough */}
      <ScrollReveal>
        <section className="space-y-4">
          <h2 className="text-2xl font-bold">Tuning Into the Broadcast</h2>
          <p className="text-muted-foreground leading-relaxed">
            Let&apos;s set up uniforms and varyings step by step. We will send
            a time value from JavaScript, pass UV coordinates from vertex to
            fragment, and use both to create an animated gradient.
          </p>

          <div className="rounded-lg border bg-card p-4 space-y-3">
            <p className="text-sm font-medium">Step 1: Define uniforms with useRef</p>
            <CodeBlock
              code={`const uniforms = useRef({
  uTime: { value: 0 },
  uColor: { value: new THREE.Color('#ff6b6b') },
})`}
              filename="UniformSetup.tsx"
            />
            <p className="text-sm text-muted-foreground">
              Uniforms are the radio frequency. Define them once with useRef
              so the object reference stays stable. If you used useState or
              inline objects, React would create a new reference every render,
              causing Three.js to recompile the shader -- a frame rate killer.
            </p>
          </div>

          <div className="rounded-lg border bg-card p-4 space-y-3">
            <p className="text-sm font-medium">Step 2: Update uniform values in useFrame</p>
            <CodeBlock
              code={`useFrame(({ clock }) => {
  uniforms.current.uTime.value = clock.elapsedTime
})`}
              filename="UniformUpdate.tsx"
            />
            <p className="text-sm text-muted-foreground">
              Mutate only the .value property, never replace the object.
              This is like changing what song the radio station plays without
              changing the frequency. The shader receives the new value on the
              next frame without any recompilation.
            </p>
          </div>

          <div className="rounded-lg border bg-card p-4 space-y-3">
            <p className="text-sm font-medium">Step 3: Declare varyings in both shaders</p>
            <CodeBlock
              code={`// vertex shader
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = projectionMatrix
    * modelViewMatrix * vec4(position, 1.0);
}

// fragment shader
varying vec2 vUv;
uniform float uTime;
void main() {
  vec3 color = mix(
    vec3(1.0, 0.0, 0.0),
    vec3(0.0, 0.0, 1.0),
    vUv.x + sin(uTime) * 0.5
  );
  gl_FragColor = vec4(color, 1.0);
}`}
              filename="VaryingBridge.glsl"
            />
            <p className="text-sm text-muted-foreground">
              The varying vUv must be declared identically in both shaders --
              same name, same type. The vertex shader writes a value at each
              vertex corner. The GPU then smoothly interpolates those values
              for every pixel between the corners. That is the volume dial:
              each pixel gets its own unique blended value.
            </p>
          </div>

          <div className="rounded-lg border bg-card p-4 space-y-3">
            <p className="text-sm font-medium">Step 4: Wire it all together</p>
            <CodeBlock
              code={`<mesh>
  <planeGeometry args={[4, 4]} />
  <shaderMaterial
    uniforms={uniforms.current}
    vertexShader={vs}
    fragmentShader={fs}
  />
</mesh>`}
              filename="Complete.tsx"
            />
            <p className="text-sm text-muted-foreground">
              You now have an animated gradient. The uniform uTime drives the
              animation (same for all pixels), while the varying vUv gives each
              pixel a unique position-based value (different for each pixel).
              Uniform = broadcast, varying = personal dial.
            </p>
          </div>
        </section>
      </ScrollReveal>

      <Separator className="my-8" />

      {/* What You Just Learned */}
      <WhatYouJustLearned
        points={[
          "Uniforms are the radio frequency: one value broadcast to every vertex and pixel (time, color, mouse position).",
          "Varyings are the volume dial: a per-vertex value that the GPU smoothly interpolates across each triangle for the fragment shader.",
          "Always define uniforms with useRef and mutate only .value -- never replace the object or use useState.",
          "Varyings must be declared with the exact same name and type in both vertex and fragment shaders.",
          "Use Three.js types (Vector2, Vector3, Color) for uniform values, not plain arrays or objects.",
        ]}
      />

      <Separator className="my-8" />

      {/* Question */}
      <ConversationalCallout type="question">
        <p>
          If the GPU interpolates varyings smoothly across each triangle, what
          would happen if a triangle had one red corner, one green corner, and
          one blue corner? What color would the center pixel be?
        </p>
      </ConversationalCallout>

      <Separator className="my-8" />

      {/* Aha Moment */}
      <AhaMoment
        setup="You keep hearing 'never use useState for uniforms.' But what if you need to update a color from a React color picker? Don't you need state for that?"
        reveal="You can use useState for the color picker UI, but you should not use that state value directly as the uniform. Instead, update the uniform's .value in a useEffect or event handler when the state changes. The pattern is: React state drives the UI (the color picker), and a useEffect syncs that state into the uniform ref. This way React re-renders only when the user picks a new color, not 60 times per second."
      />

      <Separator className="my-8" />

      {/* Mental Model Challenge */}
      <MentalModelChallenge
        question="You declare 'varying vec2 vUv' in your vertex shader and 'varying vec2 vUV' in your fragment shader. The mesh renders but the gradient is missing -- it's just a solid color. Why?"
        options={[
          {
            label: "The GLSL compiler silently ignores the mismatch",
            correct: false,
            explanation: "Some drivers may ignore it, but others will throw a linker error. Either way, the varying won't carry data correctly.",
          },
          {
            label: "GLSL is case-sensitive: vUv and vUV are different variables",
            correct: true,
            explanation: "Exactly right. vUv in the vertex shader and vUV in the fragment shader are completely different variables. The fragment shader's vUV is never written to, so it defaults to (0, 0) -- giving you a solid color.",
          },
          {
            label: "You need to use 'out' and 'in' instead of 'varying'",
            correct: false,
            explanation: "While 'out/in' is modern GLSL syntax, 'varying' works fine in WebGL. The issue is the case mismatch, not the keyword.",
          },
        ]}
        hint="GLSL treats uppercase and lowercase letters as completely different..."
        answer="GLSL is case-sensitive. 'vUv' and 'vUV' are two entirely different variables. The vertex shader writes to vUv but the fragment shader reads from vUV, which was never assigned a value and defaults to (0, 0). This gives you a solid color instead of a gradient. Always copy-paste varying declarations between shaders to avoid typos."
      />

      <Separator className="my-8" />

      {/* Try This */}
      <Separator className="my-8" />
      <ScrollReveal>
        <TryThisList challenges={[
          { challenge: "Set speed to 0 — frozen shader", hint: "Drag the speed slider to zero to stop the time uniform from advancing.", solution: "The animation freezes in place. The shader still runs every frame but uTime stays constant.", difficulty: "beginner" },
          { challenge: "Max fresnelPower — thin glow edge", hint: "Increase the fresnel power slider to its maximum.", solution: "A high fresnel power creates a razor-thin glow at the silhouette edges, concentrating the effect.", difficulty: "beginner" },
          { challenge: "Toggle wireframe — see the geometry", hint: "Enable the wireframe toggle to see the underlying mesh structure.", solution: "Wireframe reveals how the varying values interpolate across each triangle face.", difficulty: "beginner" },
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
                <h3 className="font-semibold text-sm">useRef for Uniforms, Always</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Wrap uniform definitions in useRef to keep the reference
                stable. Mutate only .value inside useFrame. Never use
                useState for values that update every frame.
              </p>
            </div>
            <div className="rounded-lg border bg-card p-4 space-y-2">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="size-4 text-green-500" />
                <h3 className="font-semibold text-sm">Update Only When Changed</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                For uniforms like uColor that change on user interaction (not
                every frame), update them in event handlers or useEffect,
                not inside useFrame. No need to set the same value 60
                times per second.
              </p>
            </div>
            <div className="rounded-lg border bg-card p-4 space-y-2">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="size-4 text-green-500" />
                <h3 className="font-semibold text-sm">Prefix Naming Convention</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Use consistent naming: prefix uniforms with &apos;u&apos; (uTime,
                uColor), varyings with &apos;v&apos; (vUv, vNormal), and custom
                attributes with &apos;a&apos; (aOffset). This makes shader code
                self-documenting at a glance.
              </p>
            </div>
            <div className="rounded-lg border bg-card p-4 space-y-2">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="size-4 text-green-500" />
                <h3 className="font-semibold text-sm">Match Types Exactly</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Use THREE.Vector2 for vec2, THREE.Vector3 or THREE.Color for
                vec3, THREE.Matrix4 for mat4. Plain arrays and objects fail
                silently, producing zeroed values that are very hard to debug.
              </p>
            </div>
          </div>
        </section>
      </ScrollReveal>
    </div>
  );
}
