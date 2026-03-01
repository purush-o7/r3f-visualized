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

const Demo = dynamic(
  () =>
    import("./_components/jsx-mapping-demo").then((m) => ({
      default: m.JsxMappingDemo,
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
    title: "Capitalizing JSX element names",
    subtitle: "Only lowercase elements map to Three.js classes",
    wrongCode: `// Capital letters = React looks for a component
<mesh>
  <BoxGeometry args={[1, 1, 1]} />
  <MeshStandardMaterial color="red" />
</mesh>`,
    rightCode: `// Lowercase = R3F maps it to Three.js
<mesh>
  <boxGeometry args={[1, 1, 1]} />
  <meshStandardMaterial color="red" />
</mesh>`,
    filename: "Scene.tsx",
    explanation:
      "R3F uses a naming convention: lowercase JSX elements are resolved to Three.js constructors. <boxGeometry> becomes new THREE.BoxGeometry(). Capitalize them and React treats them as custom components, which do not exist.",
  },
  {
    title: "Passing constructor args as individual props",
    subtitle: "Geometry dimensions go in the args array",
    wrongCode: `// These are NOT valid props
<boxGeometry width={2} height={2} depth={2} />`,
    rightCode: `// Constructor arguments go in the args array
<boxGeometry args={[2, 2, 2]} />`,
    filename: "Geometry.tsx",
    explanation:
      "Three.js constructors take positional arguments. The args prop is an array that gets spread into the constructor: new THREE.BoxGeometry(...args). Individual dimension props do not exist.",
  },
  {
    title: "Forgetting attach on non-standard children",
    subtitle: "Textures need explicit attach to tell R3F where they go",
    wrongCode: `// R3F does not know where to put the texture
<meshStandardMaterial>
  <texture image={myImage} />
</meshStandardMaterial>`,
    rightCode: `// attach tells R3F which property to set
<meshStandardMaterial>
  <texture attach="map" image={myImage} />
</meshStandardMaterial>`,
    filename: "Textures.tsx",
    explanation:
      "R3F auto-attaches geometries and materials to their parent mesh. But for textures and other objects, you must specify the attach prop to tell R3F which parent property to bind to.",
  },
];

export default function JsxToThreePage() {
  return (
    <div className="max-w-4xl ambient-canvas">
      {/* 1. Title + Badge + Intro */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-3">
          <Badge variant="outline">Canvas & Setup</Badge>
          <Badge variant="secondary" className="text-[10px]">
            Core Concept
          </Badge>
        </div>
        <h1 className="text-3xl font-bold tracking-tight mb-3">
          JSX to Three.js
        </h1>
        <p className="text-lg text-muted-foreground leading-relaxed">
          Here is the big idea behind React Three Fiber: you write JSX tags
          like <code>&lt;mesh&gt;</code> and <code>&lt;boxGeometry&gt;</code>,
          and R3F translates them into real Three.js objects under the hood.
          You never have to call <code>new THREE.Mesh()</code> yourself. You
          write a recipe, and R3F cooks the dish.
        </p>
      </div>

      {/* 2. WhatCouldGoWrong */}
      <ScrollReveal>
        <WhatCouldGoWrong
          scenario={`You write <BoxGeometry> with a capital B, just like you would capitalize a React component. The browser throws an error because React is looking for a component called BoxGeometry, which does not exist. You stare at it for ten minutes.`}
          error={`Error: Element type is invalid: expected a string (for built-in components)
or a class/function (for composite components) but got: undefined.
Check the render method of \`Scene\`.`}
          errorType="ReferenceError"
        />
      </ScrollReveal>

      {/* 3. ConversationalCallout - Story Analogy */}
      <ScrollReveal>
        <ConversationalCallout type="story">
          <p>
            Think of JSX as a recipe card. When you write{" "}
            <code>&lt;mesh&gt;</code>, you are writing an instruction:
            &quot;make me a mesh.&quot; R3F is the chef who reads your recipe
            and actually cooks the dish -- it calls{" "}
            <code>new THREE.Mesh()</code> behind the scenes.
          </p>
          <p>
            The recipe (JSX) is declarative: you say WHAT you want. The
            cooking (Three.js) is imperative: R3F figures out HOW to make it.
            You never touch the stove yourself.
          </p>
        </ConversationalCallout>
      </ScrollReveal>

      {/* 4. SimpleFlow - Mental Model */}
      <ScrollReveal>
        <SimpleFlow
          steps={[
            { label: "<mesh>", detail: "You write JSX (the recipe)" },
            { label: "R3F Reconciler", detail: "Reads the recipe" },
            { label: "new THREE.Mesh()", detail: "Cooks the dish" },
            { label: "scene.add(mesh)", detail: "Serves it to the scene" },
          ]}
        />
      </ScrollReveal>

      <Separator className="my-8" />

      {/* 5. Interactive Demo */}
      <Demo />

      <Separator className="my-8" />

      {/* 6. Guided Walkthrough */}
      <ScrollReveal>
        <section className="space-y-4">
          <h2 className="text-2xl font-bold">How the Translation Works</h2>
          <p className="text-muted-foreground leading-relaxed">
            The naming rule is dead simple. Let us walk through it.
          </p>

          {/* Step 1 */}
          <div className="rounded-lg border bg-card p-4 space-y-3">
            <div className="flex items-center gap-2">
              <Badge variant="secondary">Step 1</Badge>
              <span className="font-semibold text-sm">
                Lowercase the first letter
              </span>
            </div>
            <p className="text-sm text-muted-foreground">
              Take any Three.js class name and make the first letter lowercase.
              That is your JSX tag. No imports needed -- R3F looks it up
              automatically.
            </p>
            <CodeBlock
              code={`// THREE.Mesh         -> <mesh>
// THREE.BoxGeometry  -> <boxGeometry>
// THREE.PointLight   -> <pointLight>
// THREE.Group        -> <group>`}
              filename="naming-rule.tsx"
            />
            <p className="text-sm text-muted-foreground">
              That is the entire rule. Lowercase first letter, use it as a tag.
              If it exists in Three.js, R3F can create it.
            </p>
          </div>

          {/* Step 2 */}
          <div className="rounded-lg border bg-card p-4 space-y-3">
            <div className="flex items-center gap-2">
              <Badge variant="secondary">Step 2</Badge>
              <span className="font-semibold text-sm">
                Pass constructor arguments with args
              </span>
            </div>
            <p className="text-sm text-muted-foreground">
              When Three.js constructors need parameters (like box dimensions),
              pass them as an array through the <code>args</code> prop. The
              order matches the Three.js docs exactly.
            </p>
            <CodeBlock
              code={`// new THREE.BoxGeometry(2, 2, 2)
<boxGeometry args={[2, 2, 2]} />

// new THREE.SphereGeometry(1, 32, 32)
<sphereGeometry args={[1, 32, 32]} />`}
              filename="args.tsx"
            />
            <p className="text-sm text-muted-foreground">
              Think of <code>args</code> as the ingredients list. The recipe
              says &quot;make a box that is 2 wide, 2 tall, 2 deep.&quot;
            </p>
          </div>

          {/* Step 3 */}
          <div className="rounded-lg border bg-card p-4 space-y-3">
            <div className="flex items-center gap-2">
              <Badge variant="secondary">Step 3</Badge>
              <span className="font-semibold text-sm">
                Set properties as props
              </span>
            </div>
            <p className="text-sm text-muted-foreground">
              Any property you could set on a Three.js object, you can pass
              as a JSX prop. Arrays automatically become vectors.
            </p>
            <CodeBlock
              code={`// position, rotation, scale are Vector3
<mesh position={[1, 2, 3]} />

// Individual axes with dash notation
<mesh position-x={2} scale-y={1.5} />`}
              filename="props.tsx"
            />
            <p className="text-sm text-muted-foreground">
              R3F does not care how Three.js sets these internally. You just
              say what you want, and it handles the plumbing.
            </p>
          </div>
        </section>
      </ScrollReveal>

      <Separator className="my-8" />

      {/* 7. WhatYouJustLearned */}
      <ScrollReveal>
        <WhatYouJustLearned
          points={[
            "Lowercase JSX tags map directly to Three.js classes",
            "No imports needed -- R3F resolves them at runtime",
            "Constructor parameters go in the args array",
            "Object properties are set as JSX props",
            "Arrays like [1, 2, 3] automatically become Vector3 values",
            "Changing args recreates the object; changing props just updates it",
          ]}
        />
      </ScrollReveal>

      <Separator className="my-8" />

      {/* 8. ConversationalCallout - Thought Question */}
      <ScrollReveal>
        <ConversationalCallout type="question">
          <p>
            If changing <code>args</code> destroys and recreates the object,
            when would you use args vs. regular props?
          </p>
          <p>
            Use <code>args</code> for things decided once (geometry size,
            segment count). Use props for things that change (color, position,
            opacity). If you animate a material color, use the{" "}
            <code>color</code> prop. If you need to change a box from 1x1x1
            to 2x2x2, then <code>args</code> changes and R3F rebuilds the
            geometry.
          </p>
        </ConversationalCallout>
      </ScrollReveal>

      <Separator className="my-8" />

      {/* 9. AhaMoment */}
      <ScrollReveal>
        <AhaMoment
          setup="So R3F is just a translator? Why not just use Three.js directly?"
          reveal="R3F is not just a translator -- it is a lifecycle manager. When you use Three.js directly, you have to manually create objects, add them to the scene, update them on every frame, and dispose of them when done. Miss any step and you get memory leaks or stale objects. R3F handles all of that through React's component lifecycle. When a component unmounts, R3F disposes the Three.js object. When props change, R3F updates the object. You get the full power of Three.js with the safety net of React."
        />
      </ScrollReveal>

      <Separator className="my-8" />

      {/* 10. MentalModelChallenge */}
      <ScrollReveal>
        <MentalModelChallenge
          question="What JSX would you write to create a Three.js PointLight with color white and intensity 2?"
          options={[
            {
              label: '<PointLight color="white" intensity={2} />',
              correct: false,
              explanation:
                "Capital P makes React look for a custom component. R3F uses lowercase tags.",
            },
            {
              label: '<pointLight args={["white", 2]} />',
              correct: true,
              explanation:
                "Correct! Constructor args go in the array. You could also write <pointLight color=\"white\" intensity={2} /> since these are settable properties too.",
            },
            {
              label: '<light type="point" color="white" intensity={2} />',
              correct: false,
              explanation:
                "There is no generic <light> tag. Each light type has its own JSX element matching the Three.js class name.",
            },
            {
              label: '<three-point-light color="white" />',
              correct: false,
              explanation:
                "R3F does not use kebab-case prefixes. Just lowercase the first letter of the Three.js class name.",
            },
          ]}
          answer="The JSX tag is the Three.js class name with a lowercase first letter. THREE.PointLight becomes <pointLight>. Constructor parameters go in args as an array, and settable properties can be passed as regular props."
        />
      </ScrollReveal>

      <Separator className="my-8" />

      {/* Try These Challenges */}
      <ScrollReveal>
        <TryThisList challenges={[
          { challenge: "Try <MeshStandardMaterial> (capital M) -- what error do you get?", hint: "R3F uses a naming convention: lowercase first letter maps to Three.js classes. Capital letters mean something different in React.", solution: "React treats capitalized tags as custom components. Since there is no imported component called MeshStandardMaterial, you get an error: 'Element type is invalid: expected a string or a class/function but got: undefined.' Always use lowercase: <meshStandardMaterial>.", difficulty: "beginner" },
          { challenge: "Change args={[1,1,1]} to args={[2,0.5,3]} on a boxGeometry.", hint: "The args array maps to the Three.js constructor: BoxGeometry(width, height, depth).", solution: "You get a wide, flat, deep box -- 2 units wide, 0.5 units tall, 3 units deep. The args array directly controls the shape dimensions. Changing args destroys and recreates the geometry.", difficulty: "beginner" },
          { challenge: "Add rotation-x={0.5} to a mesh -- what happens?", hint: "Dash notation lets you set individual axes. Rotation values are in radians.", solution: "The mesh tilts forward by 0.5 radians (about 29 degrees) around the X axis. Dash notation like rotation-x is shorthand for setting mesh.rotation.x directly. It is great for individual axis tweaks.", difficulty: "beginner" },
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
                  Use args for constructor params
                </h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Always pass geometry dimensions through the <code>args</code>{" "}
                array. They map directly to the Three.js constructor signature.
              </p>
            </div>
            <div className="rounded-lg border bg-card p-4 space-y-2">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="size-4 text-green-500" />
                <h3 className="font-semibold text-sm">
                  Prefer props over args for updates
                </h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Changing args recreates the object. If you only need to tweak
                a property (like color), pass it as a prop -- it updates in
                place without destruction.
              </p>
            </div>
            <div className="rounded-lg border bg-card p-4 space-y-2">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="size-4 text-green-500" />
                <h3 className="font-semibold text-sm">
                  Use dash notation sparingly
                </h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Dash notation (<code>position-x</code>) is great for
                individual axes, but for full vectors, arrays are more readable
                and easier to understand at a glance.
              </p>
            </div>
            <div className="rounded-lg border bg-card p-4 space-y-2">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="size-4 text-green-500" />
                <h3 className="font-semibold text-sm">
                  Check Three.js docs for args order
                </h3>
              </div>
              <p className="text-sm text-muted-foreground">
                The args array maps 1:1 to the constructor parameter order in
                the Three.js documentation. When in doubt, look it up.
              </p>
            </div>
          </div>
        </section>
      </ScrollReveal>
    </div>
  );
}
