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

const TextDemo = dynamic(
  () => import("./_components/text-demo").then((m) => ({ default: m.TextDemo })),
  {
    ssr: false,
    loading: () => (
      <div className="w-full aspect-[2/1] rounded-xl border bg-scene-bg animate-pulse" />
    ),
  }
);

const mistakes: Mistake[] = [
  {
    title: "Text appears off-screen or at the edge",
    subtitle: "Forgetting to wrap Text3D in <Center>",
    wrongCode: `<Text3D font="/fonts/Inter_Bold.json" size={1} height={0.2}>
  Hello R3F
  <meshStandardMaterial color="royalblue" />
</Text3D>`,
    rightCode: `<Center>
  <Text3D font="/fonts/Inter_Bold.json" size={1} height={0.2}>
    Hello R3F
    <meshStandardMaterial color="royalblue" />
  </Text3D>
</Center>`,
    filename: "Title.tsx",
    explanation:
      "Text3D geometry starts from the bottom-left corner, like typing on a page. Without <Center>, the origin is at the left edge and the text drifts off to the right. Always wrap it in a <Center> component to auto-center on all axes.",
  },
  {
    title: "Using a .ttf font file directly",
    subtitle: "Text3D requires typeface.json, not TTF/OTF",
    wrongCode: `<Text3D font="/fonts/Inter-Bold.ttf" size={1} height={0.2}>
  Hello
  <meshStandardMaterial />
</Text3D>`,
    rightCode: `// Convert at https://gero3.github.io/facetype.js/
<Text3D font="/fonts/Inter_Bold.json" size={1} height={0.2}>
  Hello
  <meshStandardMaterial />
</Text3D>`,
    filename: "FontFormat.tsx",
    explanation:
      "Text3D uses Three.js TextGeometry, which requires fonts in typeface.json format. Convert your fonts using the Facetype.js online tool and place the JSON in your public folder. The flat <Text> component from drei does accept TTF/OTF directly.",
  },
  {
    title: "Dynamically changing text causes lag",
    subtitle: "Text3D rebuilds geometry on every content change",
    wrongCode: `function Counter() {
  const [count, setCount] = useState(0)
  useFrame(() => setCount(c => c + 1))

  return (
    <Text3D font="/fonts/Inter_Bold.json">
      {String(count)}
      <meshStandardMaterial />
    </Text3D>
  )
}`,
    rightCode: `import { Text } from '@react-three/drei'

function Counter() {
  const [count, setCount] = useState(0)
  useFrame(() => setCount(c => c + 1))

  return (
    <Text fontSize={1} color="white">
      {String(count)}
    </Text>
  )
}`,
    filename: "DynamicText.tsx",
    explanation:
      "Text3D creates real 3D geometry with vertices. Changing the text forces a full geometry rebuild every frame, which is extremely expensive. For text that updates frequently, use the flat <Text> component from drei instead. It uses SDF rendering and handles dynamic content efficiently.",
  },
];

export default function Text3DPage() {
  return (
    <div className="max-w-4xl ambient-drei">
      {/* Title + Badge + Intro */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-3">
          <Badge variant="outline">Text &amp; HTML</Badge>
        </div>
        <h1 className="text-3xl font-bold tracking-tight mb-3">Text3D</h1>
        <p className="text-lg text-muted-foreground">
          Ever seen a neon sign glowing in a shop window? The letters have real
          depth and thickness -- they pop out from the wall. Text3D works the
          same way. You pick a font, extrude it into a 3D shape, and it floats
          in your scene like a glowing sign you can walk around.
        </p>
      </div>

      {/* What Could Go Wrong */}
      <WhatCouldGoWrong
        scenario="You add a Text3D component with your font file, but the text either doesn't show up at all, or it's shoved way off to the right side of the screen. You can barely see the edge of the first letter."
        error="Text3D geometry renders but is not centered. Text starts at origin (0,0,0) and extends to the right, appearing partially off-screen."
        errorType="Layout Bug"
        accentColor="red"
      />

      <Separator className="my-8" />

      {/* Story Analogy */}
      <ConversationalCallout type="story">
        <p>
          Imagine you are making a neon sign for a coffee shop. You start with a
          flat font file -- that is your blueprint. Then you send it to the sign
          maker who bends glass tubes into each letter and gives them real depth
          and thickness. Finally, you hang the sign in the window.
        </p>
        <p>
          Text3D follows the exact same process: take a font, extrude it into 3D
          geometry with depth and optional bevels, then place it in your scene.
          The result is real geometry with vertices that can cast shadows, reflect
          light, and be made of any material you want -- chrome, glass, neon glow,
          you name it.
        </p>
      </ConversationalCallout>

      <Separator className="my-8" />

      {/* SimpleFlow */}
      <SimpleFlow
        steps={[
          { label: "Font File", detail: ".ttf or .otf" },
          { label: "Facetype.js", detail: "Convert to JSON" },
          { label: "Text3D", detail: "Extrude into 3D" },
          { label: "Material", detail: "Apply a surface" },
          { label: "Neon Sign!", detail: "Visible in scene", status: "success" },
        ]}
        accentColor="blue"
      />

      <Separator className="my-8" />

      {/* Demo */}
      <TextDemo />

      <Separator className="my-8" />

      {/* Guided Walkthrough */}
      <ScrollReveal>
        <section className="space-y-4">
          <h2 className="text-2xl font-bold">Building Your Neon Sign</h2>
          <p className="text-muted-foreground leading-relaxed">
            Let&apos;s craft a 3D title step by step. You only need three things: a
            font in JSON format, the Text3D component, and a material to paint
            it with.
          </p>

          <div className="rounded-lg border bg-card p-4 space-y-3">
            <p className="text-sm font-medium">Step 1: Convert your font</p>
            <p className="text-sm text-muted-foreground">
              Text3D cannot read .ttf files directly. Head over to the Facetype.js
              converter, upload your font, and download the JSON file. Drop it into
              your <code>/public/fonts/</code> folder.
            </p>
          </div>

          <div className="rounded-lg border bg-card p-4 space-y-3">
            <p className="text-sm font-medium">Step 2: Create centered 3D text</p>
            <CodeBlock
              code={`<Center>
  <Text3D font="/fonts/Inter_Bold.json" size={1} height={0.2}>
    Hello R3F
    <meshStandardMaterial color="royalblue" />
  </Text3D>
</Center>`}
              filename="Title.tsx"
            />
            <p className="text-sm text-muted-foreground">
              The Center wrapper is important. Without it, Text3D starts drawing
              from the left edge of the origin, like typing on a page. Center
              shifts everything so the text sits right in the middle of your scene.
            </p>
          </div>

          <div className="rounded-lg border bg-card p-4 space-y-3">
            <p className="text-sm font-medium">Step 3: Add bevels for polish</p>
            <CodeBlock
              code={`<Text3D
  font="/fonts/Inter_Bold.json"
  size={1.5}
  height={0.3}
  bevelEnabled
  bevelThickness={0.02}
  bevelSize={0.02}
  bevelSegments={3}
>
  NEON
  <meshPhysicalMaterial metalness={0.9} roughness={0.05} />
</Text3D>`}
              filename="BeveledSign.tsx"
            />
            <p className="text-sm text-muted-foreground">
              Bevels round the edges of each letter, like a real sign maker
              smoothing out the glass tubes. Keep bevelSegments low (3-5) to
              avoid generating too many triangles.
            </p>
          </div>
        </section>
      </ScrollReveal>

      <Separator className="my-8" />

      {/* What You Just Learned */}
      <WhatYouJustLearned
        points={[
          "Text3D creates real 3D geometry from a font -- just like a neon sign has real depth and thickness.",
          "You must convert fonts to typeface.json format using Facetype.js before Text3D can use them.",
          "Always wrap Text3D in <Center> to prevent the text from drifting off to the side.",
          "Bevels smooth the edges of letters, but high segment counts can create performance issues.",
          "For text that changes frequently (counters, labels), use the flat <Text> component instead.",
        ]}
      />

      <Separator className="my-8" />

      {/* Question */}
      <ConversationalCallout type="question">
        <p>
          If Text3D creates real geometry like a box or sphere, what happens when
          you try to update the text every frame? And why would that be different
          from just rotating the text?
        </p>
      </ConversationalCallout>

      <Separator className="my-8" />

      {/* Aha Moment */}
      <AhaMoment
        setup="Text3D looks just like the flat Text component on screen. So why would you ever bother with the heavier 3D version?"
        reveal="Because Text3D creates real geometry, it interacts with the 3D world in ways flat text never can. It casts and receives shadows, it reflects environment maps, it can be made of glass or chrome, and the camera can orbit around it seeing real depth. Flat Text is like a sticker on a window -- Text3D is the window itself, molded into letters."
      />

      <Separator className="my-8" />

      {/* Mental Model Challenge */}
      <MentalModelChallenge
        question="You need to build a 3D scoreboard that updates the score every second. Should you use Text3D or the flat Text component?"
        options={[
          {
            label: "Text3D -- it looks better in 3D",
            correct: false,
            explanation: "Text3D rebuilds its entire geometry every time the content changes. A score updating every second would cause constant, expensive geometry rebuilds.",
          },
          {
            label: "Flat Text -- it handles dynamic content efficiently",
            correct: true,
            explanation: "Flat Text uses SDF rendering, which can handle text changes cheaply without rebuilding geometry. Reserve Text3D for static titles and logos.",
          },
          {
            label: "Either one -- performance is the same",
            correct: false,
            explanation: "The performance difference is huge. Text3D creates vertices for every letter; changing content means throwing all those vertices away and recalculating.",
          },
        ]}
        hint="Think about what 'real 3D geometry' means when the content changes..."
        answer="Use the flat Text component. Text3D is like commissioning a new neon sign every time the score changes -- you would have to bend new glass tubes each time. The flat Text component is like a digital display: changing the number is instant and cheap. Use Text3D for things that never change, like your game's title."
      />

      <Separator className="my-8" />

      {/* Try This */}
      <Separator className="my-8" />
      <ScrollReveal>
        <TryThisList challenges={[
          { challenge: "Type your name in the text field", hint: "Find the text input in the demo controls and replace the default text with your name.", solution: "Text3D rebuilds its geometry when the content changes. Watch how it extrudes your name into 3D.", difficulty: "beginner" },
          { challenge: "Set metalness to 1 — chrome text!", hint: "Drag the metalness slider all the way to 1 and keep roughness low.", solution: "Full metalness with low roughness creates a mirror-like chrome surface that reflects the environment.", difficulty: "beginner" },
          { challenge: "Max rotationSpeed — spinning sign", hint: "Turn the rotation speed slider to its maximum value.", solution: "The text spins rapidly like a rotating storefront sign, showing the 3D depth from all angles.", difficulty: "beginner" },
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
                <h3 className="font-semibold text-sm">Always Use Center</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Wrap Text3D in Center to prevent the text from appearing
                off-screen. Text3D geometry starts from the left edge by
                default, so centering is almost always what you want.
              </p>
            </div>
            <div className="rounded-lg border bg-card p-4 space-y-2">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="size-4 text-green-500" />
                <h3 className="font-semibold text-sm">Keep Segments Low</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Use curveSegments=12 and bevelSegments=3 as defaults. Each
                additional segment multiplies the vertex count. Only bump
                these up for hero text the camera gets very close to.
              </p>
            </div>
            <div className="rounded-lg border bg-card p-4 space-y-2">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="size-4 text-green-500" />
                <h3 className="font-semibold text-sm">Reserve for Hero Elements</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Use Text3D for titles, logos, and decorative text only. For
                labels, annotations, or anything that updates, the flat Text
                component is orders of magnitude cheaper to render.
              </p>
            </div>
            <div className="rounded-lg border bg-card p-4 space-y-2">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="size-4 text-green-500" />
                <h3 className="font-semibold text-sm">Animate Transforms, Not Content</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Moving, rotating, and scaling Text3D is free. Changing the
                actual text string forces a full geometry rebuild. If you
                need animated content, swap in the flat Text component.
              </p>
            </div>
          </div>
        </section>
      </ScrollReveal>
    </div>
  );
}
