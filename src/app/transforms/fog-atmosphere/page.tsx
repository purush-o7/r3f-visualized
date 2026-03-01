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

const FogDemo = dynamic(
  () =>
    import("./_components/fog-demo").then((m) => ({
      default: m.FogDemo,
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
    title: "Fog color doesn't match the background",
    subtitle: "Objects fade into gray while the background is black — visible seam at the fog boundary",
    wrongCode: `// Fog fades to white, background is black!
<Canvas>
  <fog attach="fog" args={["#ffffff", 1, 15]} />
  {/* Background is default black */}
  <MyScene />
</Canvas>`,
    rightCode: `// Match fog color to scene background
<Canvas>
  <fog attach="fog" args={["#1a1a2e", 1, 15]} />
  <color attach="background" args={["#1a1a2e"]} />
  <MyScene />
</Canvas>

// Or set both programmatically
scene.fog = new THREE.Fog("#1a1a2e", 1, 15);
scene.background = new THREE.Color("#1a1a2e");`,
    filename: "App.tsx",
    explanation:
      "Fog blends objects toward the fog color as they recede. If that color doesn't match your background, distant objects will fade to one color but the background is another, creating an ugly visible boundary. Always match them.",
  },
  {
    title: "Using Fog with transparent or unlit materials",
    subtitle: "MeshBasicMaterial ignores fog by default, creating floating objects",
    wrongCode: `// Some materials don't respond to fog!
<fog attach="fog" args={["#333", 1, 10]} />

// This object ignores fog entirely:
<mesh position={[0, 0, -20]}>
  <boxGeometry />
  <meshBasicMaterial color="red" fog={false} />
</mesh>`,
    rightCode: `// Ensure fog is enabled on materials
<meshBasicMaterial color="red" fog={true} />

// For custom shaders, add fog uniforms
<shaderMaterial
  fog={true}  // opt into fog system
  uniforms={{
    ...THREE.UniformsLib.fog,
    // your uniforms
  }}
/>`,
    filename: "App.tsx",
    explanation:
      "By default, MeshBasicMaterial has fog enabled, but if you explicitly set fog={false} or use custom shaders, objects will ignore fog and appear to float. Always check that fog={true} on all materials in a foggy scene.",
  },
  {
    title: "Fog near plane set too close to the camera",
    subtitle: "Everything looks foggy, even objects right in front of you",
    wrongCode: `// Near = 0 means fog starts at the camera!
<fog attach="fog" args={["#333", 0, 10]} />
// Even objects at position [0,0,0] are foggy`,
    rightCode: `// Push near plane out to keep foreground clear
<fog attach="fog" args={["#333", 5, 20]} />

// Linear: objects between 5-20 units gradually fade
// Close objects (< 5 units) are crystal clear

// For FogExp2, control with density instead
<fogExp2 attach="fog" args={["#333", 0.05]} />
// Lower density = more visibility`,
    filename: "App.tsx",
    explanation:
      "Linear fog blends from 0% at the near distance to 100% at the far distance. If near is 0, fog starts immediately at the camera. Push it out so that nearby objects remain clear and only distant objects fade.",
  },
];

export default function FogAtmospherePage() {
  return (
    <div className="max-w-4xl ambient-fog">
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-3">
          <Badge variant="outline">Transforms & Color</Badge>
        </div>
        <h1 className="text-3xl font-bold tracking-tight mb-3">
          Fog & Atmosphere
        </h1>
        <p className="text-lg text-muted-foreground">
          Fog adds depth, mood, and atmosphere to your scene. Nearby objects
          stay clear while distant ones gradually fade into the mist. Three.js
          provides two fog types: linear (Fog) fades between two distances,
          and exponential (FogExp2) creates a more natural, density-based haze.
        </p>
      </div>

      {/* What Could Go Wrong */}
      <WhatCouldGoWrong
        scenario="You add fog to your scene to create atmosphere. The objects fade nicely into the distance — but they fade to white, while your background is pitch black. There's a jarring line where the foggy objects meet the background. It looks like a rendering bug, but it's just mismatched colors."
        error="Visible seam between foggy objects and background. Objects fade to white, background is black."
        errorType="Visual"
        accentColor="red"
      />

      <Separator className="my-8" />

      {/* Story Analogy */}
      <ConversationalCallout type="story">
        <p>Think of fog as <strong>morning mist</strong> on a country road.</p>
        <p>When you drive through fog, the car ahead of you is clear. The one two cars ahead is hazy. The buildings at the end of the street are ghostly silhouettes. And beyond that? Just... mist.</p>
        <p><strong>Linear fog</strong> (Fog) is like a wall of mist — everything before a certain distance is clear, everything after it is invisible, and there&apos;s a smooth gradient in between. You control where the fog starts and stops.</p>
        <p><strong>Exponential fog</strong> (FogExp2) is like real atmospheric haze — it gets thicker the deeper you go, with no hard cutoff. A single density value controls how quickly things disappear. It feels more natural but is harder to fine-tune.</p>
      </ConversationalCallout>

      <Separator className="my-8" />

      {/* Mental Model Flow */}
      <SimpleFlow
        steps={[
          { label: "Near Objects", detail: "Fully visible, no fog" },
          { label: "Mid Distance", detail: "Partially blended with fog" },
          { label: "Far Objects", detail: "Almost invisible, mostly fog" },
          { label: "Background", detail: "100% fog color", status: "success" },
        ]}
        accentColor="blue"
      />

      <Separator className="my-8" />

      {/* Interactive Demo */}
      <FogDemo />

      <Separator className="my-8" />

      {/* Guided Walkthrough */}
      <ScrollReveal>
        <section className="space-y-4">
          <h2 className="text-2xl font-bold">Hands-On: Adding Atmosphere</h2>
          <p className="text-muted-foreground leading-relaxed">
            Let&apos;s add fog to a scene and see how it transforms the mood. We&apos;ll
            start with linear fog, then switch to exponential, and learn why the
            background color matters.
          </p>

          <div className="rounded-lg border bg-card p-4 space-y-3">
            <p className="text-sm font-medium">Step 1: Linear Fog (Fog)</p>
            <CodeBlock
              code={`// In R3F, attach fog to the scene
<Canvas>
  {/* Linear fog: color, near, far */}
  <fog attach="fog" args={["#1a1a2e", 5, 20]} />

  {/* IMPORTANT: match background to fog color */}
  <color attach="background" args={["#1a1a2e"]} />

  <ambientLight intensity={0.3} />
  <MyScene />
</Canvas>

// Objects closer than 5 = fully visible
// Objects between 5-20 = gradually fading
// Objects beyond 20 = completely hidden`}
              filename="App.tsx"
            />
            <p className="text-sm text-muted-foreground">
              Linear fog takes three arguments: color, near distance, and far
              distance. Everything between near and far gets progressively blended
              with the fog color. Always match the scene background to the fog
              color for a seamless transition.
            </p>
          </div>

          <div className="rounded-lg border bg-card p-4 space-y-3">
            <p className="text-sm font-medium">Step 2: Exponential Fog (FogExp2)</p>
            <CodeBlock
              code={`// Exponential fog: color, density
<Canvas>
  <fogExp2 attach="fog" args={["#1a1a2e", 0.08]} />
  <color attach="background" args={["#1a1a2e"]} />
  <MyScene />
</Canvas>

// Density controls how quickly fog thickens
// 0.01 = very light haze
// 0.05 = moderate fog
// 0.15 = dense pea-soup fog
// 0.30 = can barely see your hand`}
              filename="App.tsx"
            />
            <p className="text-sm text-muted-foreground">
              Exponential fog uses a density value instead of near/far distances.
              The fog thickens according to an exponential curve, which more
              closely mimics how real atmospheric scattering works. Lower density
              = clearer, higher density = thicker.
            </p>
          </div>

          <div className="rounded-lg border bg-card p-4 space-y-3">
            <p className="text-sm font-medium">Step 3: Dynamic fog for mood changes</p>
            <CodeBlock
              code={`function DynamicFog() {
  const { scene } = useThree();

  const { fogColor, density } = useControls({
    fogColor: "#1a1a2e",
    density: { value: 0.08, min: 0, max: 0.3 }
  });

  useEffect(() => {
    scene.fog = new THREE.FogExp2(fogColor, density);
    scene.background = new THREE.Color(fogColor);
    return () => { scene.fog = null; };
  }, [scene, fogColor, density]);

  return null;
}`}
              filename="App.tsx"
            />
            <p className="text-sm text-muted-foreground">
              You can update fog properties dynamically — transition from clear
              skies to dense fog for a horror game, or shift fog color as time
              of day changes. Animate fog density in useFrame for gradual
              transitions.
            </p>
          </div>
        </section>
      </ScrollReveal>

      <Separator className="my-8" />

      {/* What You Just Learned */}
      <WhatYouJustLearned
        points={[
          "Linear fog (Fog) fades objects between a near and far distance — simple to control with exact boundaries.",
          "Exponential fog (FogExp2) uses a density value for more natural atmospheric haze with no hard cutoff.",
          "Always match the scene background color to the fog color to avoid visible seams at the fog boundary.",
          "Fog can be updated dynamically at runtime for atmospheric transitions and mood changes.",
        ]}
      />

      <Separator className="my-8" />

      {/* Thought-Provoking Question */}
      <ConversationalCallout type="question">
        <p>
          Beyond visual atmosphere, fog has a practical benefit: it hides the
          &quot;edge of the world&quot; where your scene runs out of content. How might
          game developers use fog strategically to manage what players can and
          can&apos;t see?
        </p>
      </ConversationalCallout>

      <Separator className="my-8" />

      {/* Aha Moment */}
      <AhaMoment
        setup="You might think fog is purely cosmetic — just making things look moody."
        reveal="Fog is actually a powerful performance tool. In open-world games, the world extends in every direction but you can't render it all at once. Fog hides the draw distance limit — objects beyond the fog distance don't need to be rendered at all. This is why many games have fog settings tied to draw distance. Thicker fog = shorter draw distance = better performance. The fog of Silent Hill wasn't just atmospheric — it was a technical necessity on PlayStation hardware that couldn't render far enough without it."
      />

      <Separator className="my-8" />

      {/* Mental Model Challenge */}
      <MentalModelChallenge
        question="You have linear fog with near=5 and far=15. An object is at distance 10 from the camera. How much fog is applied?"
        options={[
          { label: "50% — halfway between near and far", correct: true, explanation: "Correct! Linear fog interpolates linearly between near and far. Distance 10 is exactly halfway between 5 and 15, so 50% fog is blended in." },
          { label: "0% — the object is within the fog range", correct: false, explanation: "Being within the fog range doesn't mean 0%. The fog starts blending at 'near' and reaches 100% at 'far'. Anywhere in between is partially foggy." },
          { label: "100% — the object is past the near plane", correct: false, explanation: "100% fog only applies at or beyond the 'far' distance. The object is only halfway through the fog zone." },
          { label: "33% — proportional to the total distance", correct: false, explanation: "The fog percentage is calculated relative to the near-far range, not the total distance from camera. (10-5)/(15-5) = 50%." },
        ]}
        hint="Linear fog interpolates from 0% at the near distance to 100% at the far distance..."
        answer="Linear fog calculates: (distance - near) / (far - near). For our case: (10 - 5) / (15 - 5) = 0.5, or 50%. The object's color is blended 50/50 with the fog color. This linear relationship is what makes it predictable and easy to reason about."
      />

      <Separator className="my-8" />

      {/* Try This */}
      <Separator className="my-8" />
      <ScrollReveal>
        <TryThisList challenges={[
          { challenge: "Set fog to exponential — thicker!", hint: "Switch from linear Fog to FogExp2 in the demo controls.", solution: "Exponential fog creates a denser, more natural atmospheric haze with no hard cutoff distance.", difficulty: "beginner" },
          { challenge: "Change fog color to red — Mars!", hint: "Set the fog color to a red or rusty orange.", solution: "Red fog transforms the scene into an alien landscape. Remember to match the background color too.", difficulty: "beginner" },
          { challenge: "Set density to 0 — crystal clear", hint: "Drag the fog density slider all the way to zero.", solution: "With zero density, the fog disappears completely and all objects are fully visible.", difficulty: "beginner" },
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
                <h3 className="font-semibold text-sm">Match Fog and Background</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Always set the scene background color to match the fog color. This
                creates a seamless transition as objects fade into the distance.
              </p>
            </div>
            <div className="rounded-lg border bg-card p-4 space-y-2">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="size-4 text-green-500" />
                <h3 className="font-semibold text-sm">Use Fog for Performance</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Set the camera&apos;s far plane to match the fog&apos;s far distance.
                Objects beyond the fog are invisible anyway — skip rendering them
                entirely by clipping them out.
              </p>
            </div>
            <div className="rounded-lg border bg-card p-4 space-y-2">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="size-4 text-green-500" />
                <h3 className="font-semibold text-sm">FogExp2 for Outdoor Scenes</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Exponential fog mimics real atmospheric scattering better than linear.
                Use it for outdoor environments, forests, and large open worlds where
                you want natural-looking haze.
              </p>
            </div>
            <div className="rounded-lg border bg-card p-4 space-y-2">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="size-4 text-green-500" />
                <h3 className="font-semibold text-sm">Animate Fog for Transitions</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Gradually change fog density and color over time for day/night cycles,
                weather effects, or entering a mysterious cave. Smooth fog transitions
                feel much better than instant switches.
              </p>
            </div>
          </div>
        </section>
      </ScrollReveal>
    </div>
  );
}
