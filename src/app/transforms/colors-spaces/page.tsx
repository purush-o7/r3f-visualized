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

const ColorsDemo = dynamic(
  () =>
    import("./_components/colors-demo").then((m) => ({
      default: m.ColorsDemo,
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
    title: "Mixing up sRGB and Linear color spaces",
    subtitle: "Colors look washed out or too dark compared to your design mockup",
    wrongCode: `// Colors look different than Figma/CSS!
// Three.js uses Linear internally
<meshStandardMaterial color="#ff6600" />
// This orange looks different than
// the same hex in CSS because of
// color space conversion`,
    rightCode: `// Three.js v0.152+ defaults to sRGB output
// which handles this automatically.
// The renderer converts linear -> sRGB

// If colors still look off, check:
// 1. Tone mapping (affects brightness)
<Canvas gl={{ toneMapping: THREE.ACESFilmicToneMapping }}>

// 2. Or disable tone mapping per material
<meshStandardMaterial
  color="#ff6600"
  toneMapped={false}  // raw color output
/>`,
    filename: "App.tsx",
    explanation:
      "Three.js computes lighting in Linear space (physically correct) then converts to sRGB for display. This means hex colors from CSS/Figma may appear slightly different. Use toneMapped={false} on materials that need exact color matching, like UI elements.",
  },
  {
    title: "Creating new Color objects every render",
    subtitle: "Garbage collection spikes from 60 new objects per second",
    wrongCode: `// WRONG: new Color every frame!
function MyMesh() {
  return (
    <mesh>
      <meshStandardMaterial
        color={new THREE.Color(r, g, b)}
      />
    </mesh>
  );
}`,
    rightCode: `// Reuse a single Color object
const color = useMemo(() => new THREE.Color(), []);

useFrame(() => {
  color.setRGB(r, g, b);
  materialRef.current.color.copy(color);
});

// Or just use a string/hex — R3F handles it
<meshStandardMaterial color="#ff6600" />
<meshStandardMaterial color="coral" />`,
    filename: "App.tsx",
    explanation:
      "Creating new THREE.Color objects every render generates garbage for the GC to clean up. Either reuse a memoized Color, mutate the existing material color, or let R3F handle conversion by passing a string.",
  },
  {
    title: "Assuming HSL values match CSS percentages",
    subtitle: "hsl(200, 80%, 50%) in CSS doesn't directly map to Three.js setHSL",
    wrongCode: `// WRONG: CSS-style percentages
const color = new THREE.Color();
color.setHSL(200, 80, 50);
// These values are way out of range!`,
    rightCode: `// Three.js HSL uses 0-1 range, not 0-360/0-100
const color = new THREE.Color();
color.setHSL(
  200 / 360,  // hue: 0-1 (not 0-360)
  0.8,        // saturation: 0-1 (not 0-100)
  0.5         // lightness: 0-1 (not 0-100)
);

// Or use the CSS string directly
const color2 = new THREE.Color("hsl(200, 80%, 50%)");
// Three.js parses CSS color strings!`,
    filename: "App.tsx",
    explanation:
      "THREE.Color.setHSL() uses normalized 0-1 values, not CSS conventions (0-360 for hue, 0-100% for saturation/lightness). Divide hue by 360 and saturation/lightness by 100, or just pass a CSS string and let Three.js parse it.",
  },
];

export default function ColorsSpacesPage() {
  return (
    <div className="max-w-4xl ambient-colors">
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-3">
          <Badge variant="outline">Transforms & Color</Badge>
        </div>
        <h1 className="text-3xl font-bold tracking-tight mb-3">
          Colors & Color Spaces
        </h1>
        <p className="text-lg text-muted-foreground">
          Color in 3D is more nuanced than picking a hex code. Three.js works
          internally in Linear color space for physically correct lighting, then
          converts to sRGB for your monitor. Understanding this pipeline is the
          difference between colors that look &quot;right&quot; and colors that look
          washed out or unexpectedly dark.
        </p>
      </div>

      {/* What Could Go Wrong */}
      <WhatCouldGoWrong
        scenario="You pick the perfect orange (#ff6600) in Figma. You paste it into your Three.js material. But the rendered color looks different — slightly darker, more saturated. You tweak the hex code back and forth but can never match the design. The issue isn't the color — it's the color space."
        error="Material color doesn't match design mockup. Hex #ff6600 renders differently than in CSS."
        errorType="Visual"
        accentColor="orange"
      />

      <Separator className="my-8" />

      {/* Story Analogy */}
      <ConversationalCallout type="story">
        <p>Think of color spaces as <strong>paint mixing systems</strong>.</p>
        <p><strong>RGB</strong> is like mixing red, green, and blue spotlights. Where they overlap, you get new colors. All three together make white. It&apos;s how screens work, but it&apos;s not how humans think about color.</p>
        <p><strong>HSL</strong> is more intuitive — like a paint store. Pick a <strong>hue</strong> from the color wheel (red, blue, green...), adjust <strong>saturation</strong> (how vivid vs gray), and set <strong>lightness</strong> (how bright vs dark). Much easier to think in.</p>
        <p>The twist? Your monitor displays <strong>sRGB</strong> (gamma-corrected), but physics and lighting math work in <strong>Linear</strong> space. It&apos;s like the difference between raw and processed photos — both represent the same scene, but the math only works correctly on the raw version.</p>
      </ConversationalCallout>

      <Separator className="my-8" />

      {/* Mental Model Flow */}
      <SimpleFlow
        steps={[
          { label: "Your Color", detail: "Hex, RGB, HSL, or named" },
          { label: "Linear Space", detail: "Lighting math happens here" },
          { label: "Tone Mapping", detail: "Compress HDR range" },
          { label: "sRGB Output", detail: "What your monitor shows", status: "success" },
        ]}
        accentColor="violet"
      />

      <Separator className="my-8" />

      {/* Interactive Demo */}
      <ColorsDemo />

      <Separator className="my-8" />

      {/* Guided Walkthrough */}
      <ScrollReveal>
        <section className="space-y-4">
          <h2 className="text-2xl font-bold">Hands-On: Working with Color</h2>
          <p className="text-muted-foreground leading-relaxed">
            Three.js accepts colors in many formats. Let&apos;s explore each one
            and understand when the color space pipeline matters.
          </p>

          <div className="rounded-lg border bg-card p-4 space-y-3">
            <p className="text-sm font-medium">Step 1: Color input formats</p>
            <CodeBlock
              code={`// All of these work in R3F:
<meshStandardMaterial color="coral" />       // Named
<meshStandardMaterial color="#ff7f50" />      // Hex
<meshStandardMaterial color="rgb(255,127,80)" /> // RGB
<meshStandardMaterial color={0xff7f50} />     // Hex integer

// THREE.Color object for more control
const myColor = new THREE.Color("coral");
myColor.r // 1.0 (red channel, 0-1)
myColor.g // 0.498
myColor.b // 0.314`}
              filename="App.tsx"
            />
            <p className="text-sm text-muted-foreground">
              R3F accepts any value that THREE.Color can parse: CSS color names,
              hex strings, RGB strings, hex integers, or a THREE.Color instance.
              Internally, all colors are stored as three floats (r, g, b) in the
              0 to 1 range.
            </p>
          </div>

          <div className="rounded-lg border bg-card p-4 space-y-3">
            <p className="text-sm font-medium">Step 2: HSL for intuitive color picking</p>
            <CodeBlock
              code={`// HSL is easier for humans
const color = new THREE.Color();

// setHSL uses 0-1 range for all values
color.setHSL(
  0.6,   // hue (0=red, 0.33=green, 0.66=blue)
  0.8,   // saturation (0=gray, 1=vivid)
  0.5    // lightness (0=black, 0.5=pure, 1=white)
);

// Or parse a CSS HSL string
const color2 = new THREE.Color("hsl(216, 80%, 50%)");

// Get HSL back from any color
const hsl = {};
color.getHSL(hsl);
console.log(hsl.h, hsl.s, hsl.l);`}
              filename="App.tsx"
            />
            <p className="text-sm text-muted-foreground">
              HSL is great for creating color variations programmatically. Want
              10 different hues at the same brightness? Loop the hue value from
              0 to 1 while keeping saturation and lightness constant.
            </p>
          </div>

          <div className="rounded-lg border bg-card p-4 space-y-3">
            <p className="text-sm font-medium">Step 3: Understanding color spaces</p>
            <CodeBlock
              code={`// Three.js pipeline:
// 1. Input color (sRGB)
// 2. Convert to Linear for lighting math
// 3. Apply tone mapping
// 4. Convert back to sRGB for display

// For exact color matching (UI, branding):
<meshBasicMaterial
  color="#ff6600"
  toneMapped={false}  // skip tone mapping
/>

// For physically correct rendering:
<meshStandardMaterial
  color="#ff6600"      // tone mapping applied
  // Colors may shift slightly — that's correct!
/>`}
              filename="App.tsx"
            />
            <p className="text-sm text-muted-foreground">
              Tone mapping compresses HDR values into displayable range. It makes
              scenes look more natural but shifts exact colors. Disable it on
              materials that need pixel-perfect color matching.
            </p>
          </div>
        </section>
      </ScrollReveal>

      <Separator className="my-8" />

      {/* What You Just Learned */}
      <WhatYouJustLearned
        points={[
          "Three.js accepts colors as named strings, hex, RGB, HSL, or THREE.Color objects.",
          "Internally, lighting calculations happen in Linear color space, then output converts to sRGB for display.",
          "HSL (Hue, Saturation, Lightness) is more intuitive for generating color palettes and variations programmatically.",
          "Use toneMapped={false} on materials that need exact color matching (UI, branding) to bypass tone mapping.",
        ]}
      />

      <Separator className="my-8" />

      {/* Thought-Provoking Question */}
      <ConversationalCallout type="question">
        <p>
          If you mix two colors by averaging their RGB values (e.g., red + blue = purple),
          does it matter whether you do the math in sRGB or Linear space? What happens
          to the perceived brightness of the result?
        </p>
      </ConversationalCallout>

      <Separator className="my-8" />

      {/* Aha Moment */}
      <AhaMoment
        setup="You might wonder why Three.js doesn't just work in sRGB like CSS does."
        reveal="Physics doesn't care about your monitor's gamma curve. When light bounces off a surface, the intensity doubles if you add a second light source — that's linear math. If you compute lighting in sRGB (gamma-corrected) space, adding two lights doesn't look twice as bright. Colors bleed incorrectly. Shadows look too dark. The whole reason for the Linear pipeline is that light addition, reflection, and energy conservation only work correctly with linear values. The conversion to sRGB at the end is purely for your monitor's display characteristics."
      />

      <Separator className="my-8" />

      {/* Mental Model Challenge */}
      <MentalModelChallenge
        question="You have a material with color '#808080' (50% gray). Why does it appear darker than expected when using MeshStandardMaterial compared to MeshBasicMaterial?"
        options={[
          { label: "Tone mapping compresses the brightness range", correct: true, explanation: "Correct! MeshStandardMaterial is affected by tone mapping and lighting, which alters how the final color appears. MeshBasicMaterial ignores lighting entirely." },
          { label: "MeshStandardMaterial only supports darker colors", correct: false, explanation: "MeshStandardMaterial supports the full color range. The difference is in how lighting and tone mapping are applied." },
          { label: "The hex value is converted incorrectly", correct: false, explanation: "Three.js parses hex values correctly. The difference is in the rendering pipeline, not the color parsing." },
          { label: "sRGB to Linear conversion is lossy", correct: false, explanation: "The conversion is mathematically reversible. The apparent difference comes from lighting and tone mapping, not data loss." },
        ]}
        hint="Think about what happens after the color is set but before it reaches your screen..."
        answer="MeshBasicMaterial bypasses lighting and outputs the color directly. MeshStandardMaterial goes through the full pipeline: the color interacts with scene lights (which may not fully illuminate it), then tone mapping compresses the brightness range. Both start from the same hex value, but the rendering path changes what you see."
      />

      <Separator className="my-8" />

      {/* Try This */}
      <Separator className="my-8" />
      <ScrollReveal>
        <TryThisList challenges={[
          { challenge: "Pick a bright red — compare sRGB vs Linear", hint: "Select a vivid red color and observe how it looks on different materials.", solution: "The same hex value looks different on MeshStandardMaterial vs MeshBasicMaterial due to tone mapping and lighting.", difficulty: "beginner" },
          { challenge: "Set roughness to 0 — see color in reflections", hint: "Drag the roughness slider to zero for a mirror-like surface.", solution: "At zero roughness, the material becomes a perfect mirror. The color blends with sharp environment reflections.", difficulty: "beginner" },
          { challenge: "Try named colors in the picker", hint: "Type a CSS color name like 'coral', 'gold', or 'royalblue' in the color input.", solution: "Three.js parses CSS color names just like a browser, making prototyping faster than typing hex codes.", difficulty: "beginner" },
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
                <h3 className="font-semibold text-sm">Use CSS Color Names for Prototyping</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                &quot;coral&quot;, &quot;royalblue&quot;, &quot;gold&quot; are faster to type than
                hex codes and easier to read. Switch to hex values for production color matching.
              </p>
            </div>
            <div className="rounded-lg border bg-card p-4 space-y-2">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="size-4 text-green-500" />
                <h3 className="font-semibold text-sm">Use HSL for Palettes</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Generate color variations by looping hue while keeping saturation
                and lightness constant. Much easier than manually picking harmonious
                RGB values.
              </p>
            </div>
            <div className="rounded-lg border bg-card p-4 space-y-2">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="size-4 text-green-500" />
                <h3 className="font-semibold text-sm">Disable Tone Mapping for UI</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                For UI elements, brand colors, or anything that needs exact color
                matching, set toneMapped=false on the material. Let PBR materials
                keep tone mapping on.
              </p>
            </div>
            <div className="rounded-lg border bg-card p-4 space-y-2">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="size-4 text-green-500" />
                <h3 className="font-semibold text-sm">Reuse Color Objects</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                If you animate colors, create a single THREE.Color with useMemo and
                mutate it in useFrame. Don&apos;t create new Color instances every frame
                — it creates garbage for the GC.
              </p>
            </div>
          </div>
        </section>
      </ScrollReveal>
    </div>
  );
}
