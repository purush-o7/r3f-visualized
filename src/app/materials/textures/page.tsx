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

const TextureDemoComponent = dynamic(
  () =>
    import("./_components/texture-demo").then((m) => ({
      default: m.TextureDemo,
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
    title: "Color texture looks washed out or grey",
    subtitle: "Missing the sRGB color space flag",
    wrongCode: `const colorMap = useTexture('/textures/wood.jpg')
// No colorSpace set — Three.js treats it as linear data
// Colors appear desaturated and wrong

<meshStandardMaterial map={colorMap} />`,
    rightCode: `const colorMap = useTexture('/textures/wood.jpg')
colorMap.colorSpace = THREE.SRGBColorSpace

// Only color and emissive maps need sRGB
// Normal, roughness, metalness stay linear (default)
<meshStandardMaterial map={colorMap} />`,
    filename: "srgb-colorspace.tsx",
    explanation:
      "Color textures are saved in sRGB but PBR math needs linear values. Marking the texture as sRGB lets Three.js handle the conversion. Without it, colors appear washed out because sRGB-encoded values are treated as already-linear.",
  },
  {
    title: "Texture does not tile — edge pixels stretch instead",
    subtitle: "Using a non-power-of-two texture with RepeatWrapping",
    wrongCode: `// 300x500 texture (not power of two)
const tex = useTexture('/textures/photo_300x500.jpg')
tex.wrapS = THREE.RepeatWrapping
tex.wrapT = THREE.RepeatWrapping
tex.repeat.set(4, 4)
// Console warnings, no tiling, stretched edges`,
    rightCode: `// Use power-of-two textures: 256, 512, 1024, 2048
const tex = useTexture('/textures/photo_512x512.jpg')
tex.wrapS = THREE.RepeatWrapping
tex.wrapT = THREE.RepeatWrapping
tex.repeat.set(4, 4)
// Tiles perfectly, no warnings`,
    filename: "npot-textures.tsx",
    explanation:
      "WebGL requires power-of-two dimensions (256, 512, 1024, etc.) for textures that tile. Non-power-of-two textures cannot use RepeatWrapping or generate mipmaps. Either resize your image or use ClampToEdgeWrapping with linear filtering.",
  },
  {
    title: "GPU memory leak when swapping textures",
    subtitle: "Old texture never gets freed from GPU memory",
    wrongCode: `// Swapping to a new texture without cleanup
texture.image = highResImage;
texture.needsUpdate = true;
// Old GPU allocation is never freed — it leaks`,
    rightCode: `// Dispose the old texture, then load a fresh one
oldTexture.dispose(); // frees GPU memory
const newTex = loader.load('/textures/highres.jpg')
newTex.colorSpace = THREE.SRGBColorSpace
material.map = newTex;
material.needsUpdate = true;`,
    filename: "texture-dispose.tsx",
    explanation:
      "When you change a texture at runtime, always dispose() the old one first. This frees the GPU memory. Without disposal, every texture swap leaves the old data in GPU memory permanently, which can cause crashes on devices with limited VRAM.",
  },
];

export default function TexturesPage() {
  return (
    <div className="max-w-4xl ambient-materials">
      {/* 1. Title + Badge + Intro */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-3">
          <Badge variant="outline">Materials</Badge>
        </div>
        <h1 className="text-3xl font-bold tracking-tight mb-3">Textures</h1>
        <p className="text-lg text-muted-foreground">
          Textures are images that get wrapped around your 3D objects to add
          detail — wood grain, brick patterns, scratches, and more — without
          needing millions of extra polygons.
        </p>
      </div>

      {/* 2. What Could Go Wrong */}
      <WhatCouldGoWrong
        scenario="You load a beautiful wood texture and apply it to your mesh, but the colors look flat and washed out — almost grey. You double-check the image file and it looks perfect. The problem? You forgot to tell Three.js that this is a color texture stored in sRGB, so it is treating the pixel values as raw linear data."
        error="Texture colors appear desaturated or unnaturally dark on PBR materials."
        errorType="Wrong Color Space"
      />

      <Separator className="my-8" />

      {/* 3. Story Analogy */}
      <ScrollReveal>
        <ConversationalCallout type="story">
          <p>
            Have you ever wrapped a birthday present? You take a flat sheet of
            wrapping paper and fold it around a 3D box.
          </p>
          <p>
            That is exactly what textures do — they take a flat 2D image and
            wrap it around a 3D object.
          </p>
          <p>
            The tricky part? <strong>UV coordinates</strong> are the folding
            instructions. U goes left-to-right (like X), V goes bottom-to-top
            (like Y). They tell the computer which part of the image goes on
            which part of the shape.
          </p>
          <p>
            Built-in shapes like boxes and spheres already come with UV
            coordinates, so the wrapping happens automatically. But for custom
            models, you might need to set up those folding instructions yourself
            in a 3D modeling tool like Blender.
          </p>
        </ConversationalCallout>
      </ScrollReveal>

      <Separator className="my-8" />

      {/* 4. SimpleFlow */}
      <ScrollReveal>
        <section className="space-y-4">
          <h2 className="text-2xl font-bold">How a Texture Gets to Your Screen</h2>
          <p className="text-muted-foreground leading-relaxed">
            From image file to rendered surface, here is the journey every
            texture takes.
          </p>
          <SimpleFlow
            steps={[
              {
                label: "Load image",
                detail: "useTexture or TextureLoader",
              },
              {
                label: "Configure",
                detail: "Color space, wrapping, filtering",
              },
              {
                label: "Attach to material",
                detail: "map, normalMap, roughnessMap, etc.",
              },
              {
                label: "GPU renders it",
                detail: "UV coordinates map image to mesh",
                status: "success",
              },
            ]}
          />
        </section>
      </ScrollReveal>

      <Separator className="my-8" />

      {/* 5. Interactive Demo */}
      <TextureDemoComponent />

      <Separator className="my-8" />

      {/* 6. Guided Walkthrough */}
      <ScrollReveal>
        <section className="space-y-6">
          <h2 className="text-2xl font-bold">Guided Walkthrough</h2>
          <p className="text-muted-foreground leading-relaxed">
            Let us go from a bare white box to a fully textured brick wall in
            three steps.
          </p>

          {/* Step 1 */}
          <div className="bg-card border rounded-lg p-4 space-y-3">
            <h3 className="font-semibold text-sm">
              Step 1 — Load and apply a color texture
            </h3>
            <CodeBlock
              code={`import { useTexture } from '@react-three/drei'

const colorMap = useTexture('/textures/brick.jpg')
colorMap.colorSpace = THREE.SRGBColorSpace

<mesh>
  <boxGeometry />
  <meshStandardMaterial map={colorMap} />
</mesh>`}
              filename="step-1-color.tsx"
            />
            <p className="text-sm text-muted-foreground">
              The useTexture hook loads and caches the image. We mark it as sRGB
              because it is a color texture. The map prop wraps the image around
              the box using its built-in UV coordinates.
            </p>
          </div>

          {/* Step 2 */}
          <div className="bg-card border rounded-lg p-4 space-y-3">
            <h3 className="font-semibold text-sm">
              Step 2 — Add a normal map for surface detail
            </h3>
            <CodeBlock
              code={`const [color, normal] = useTexture([
  '/textures/brick_color.jpg',
  '/textures/brick_normal.jpg',
])
color.colorSpace = THREE.SRGBColorSpace

<meshStandardMaterial
  map={color}
  normalMap={normal}
/>`}
              filename="step-2-normal.tsx"
            />
            <p className="text-sm text-muted-foreground">
              A normal map fakes bumpy surface detail without adding real
              geometry. The bricks now look like they have depth and grooves
              catching the light. Notice we do NOT set sRGB on the normal map
              — it stores angle data, not colors.
            </p>
          </div>

          {/* Step 3 */}
          <div className="bg-card border rounded-lg p-4 space-y-3">
            <h3 className="font-semibold text-sm">
              Step 3 — Tile the texture to cover a larger surface
            </h3>
            <CodeBlock
              code={`const tex = useTexture('/textures/brick.jpg')
tex.wrapS = THREE.RepeatWrapping
tex.wrapT = THREE.RepeatWrapping
tex.repeat.set(4, 4)

<mesh>
  <planeGeometry args={[10, 10]} />
  <meshStandardMaterial map={tex} />
</mesh>`}
              filename="step-3-tiling.tsx"
            />
            <p className="text-sm text-muted-foreground">
              RepeatWrapping tells the texture to tile instead of stretching.
              The repeat.set(4, 4) means the image repeats 4 times in each
              direction. This is how you cover a large wall with a small brick
              image.
            </p>
          </div>
        </section>
      </ScrollReveal>

      <Separator className="my-8" />

      {/* 7. What You Just Learned */}
      <ScrollReveal>
        <WhatYouJustLearned
          points={[
            "Textures wrap 2D images onto 3D surfaces using UV coordinates as folding instructions",
            "Color textures need SRGBColorSpace — data textures like normals stay linear",
            "RepeatWrapping tiles a texture, but requires power-of-two dimensions (512, 1024, etc.)",
            "Normal maps fake bumpy surface detail without adding extra geometry",
          ]}
        />
      </ScrollReveal>

      <Separator className="my-8" />

      {/* 8. Thought-Provoking Question */}
      <ScrollReveal>
        <ConversationalCallout type="question">
          <p>
            If a 1024x1024 solid white texture uses the exact same GPU memory
            as a 1024x1024 detailed photograph, what does that tell you about
            how textures are stored on the GPU? And how should that change
            the way you choose texture sizes for your project?
          </p>
        </ConversationalCallout>
      </ScrollReveal>

      <Separator className="my-8" />

      {/* 9. Aha Moment */}
      <ScrollReveal>
        <AhaMoment
          setup="Why do some texture maps use sRGB color space while others must stay in linear space?"
          reveal="Your eyes do not perceive brightness linearly — you are more sensitive to dark shades than bright ones. sRGB encoding takes advantage of this to give you more precision in the dark tones you care about. But PBR lighting math needs actual linear brightness values to calculate reflections correctly. So color maps (what things look like) are stored in sRGB for human viewing, while data maps like normals and roughness (raw numbers for math) stay linear because they are not representing visual colors at all."
        />
      </ScrollReveal>

      <Separator className="my-8" />

      {/* 10. Mental Model Challenge */}
      <ScrollReveal>
        <MentalModelChallenge
          question="You have a 600x400 brick texture and you want it to tile 3x3 across a wall. What will happen?"
          options={[
            {
              label: "It will tile perfectly 3x3",
              correct: false,
              explanation:
                "600x400 is not power-of-two, so RepeatWrapping will not work correctly.",
            },
            {
              label: "It will stretch the edge pixels instead of tiling",
              correct: true,
              explanation:
                "Non-power-of-two textures fall back to ClampToEdgeWrapping, which stretches the border pixels.",
            },
            {
              label: "Three.js will automatically resize it to 512x512",
              correct: false,
              explanation:
                "Three.js does not automatically resize textures. You need to do this yourself.",
            },
            {
              label: "The scene will crash with an error",
              correct: false,
              explanation:
                "It will not crash, but you will see console warnings and the texture will clamp instead of repeat.",
            },
          ]}
          answer="Non-power-of-two textures cannot use RepeatWrapping in WebGL. Instead of tiling, the texture edge pixels get stretched across the surface. You will also see console warnings. The fix is to resize your texture to power-of-two dimensions (like 512x512 or 1024x512) before loading it."
        />
      </ScrollReveal>

      <Separator className="my-8" />

      {/* Try This Challenges */}
      <ScrollReveal>
        <TryThisList challenges={[
          {
            challenge: "Set tileCount to 4 — how does the checkerboard change?",
            hint: "The repeat value controls how many times the texture image is tiled across the surface.",
            solution: "The texture repeats 4 times in each direction, creating a 4x4 grid of the pattern. Each individual tile is smaller, making the surface look more detailed and the pattern more fine-grained.",
            difficulty: "beginner",
          },
          {
            challenge: "Switch wrapping to Mirrored — spot the difference",
            hint: "MirroredRepeatWrapping flips the texture on every other tile instead of repeating identically.",
            solution: "Every other tile is horizontally or vertically flipped, creating a seamless mirror effect. This eliminates visible seams at tile boundaries, which is especially useful for textures that don't tile perfectly.",
            difficulty: "intermediate",
          },
          {
            challenge: "Change color tint to red",
            hint: "The material's color prop acts as a multiplier on the texture color.",
            solution: "The texture takes on a red tint. The material color multiplies with the texture color, so white areas become red, and other colors shift toward red. Setting color to 'red' or '#ff0000' filters out the green and blue channels.",
            difficulty: "beginner",
          },
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
                  Use power-of-two dimensions
                </h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Always use 256, 512, 1024, or 2048 pixel sizes. This enables
                mipmaps, repeat wrapping, and avoids console warnings. It is the
                single most important texture rule.
              </p>
            </div>
            <div className="rounded-lg border bg-card p-4 space-y-2">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="size-4 text-green-500" />
                <h3 className="font-semibold text-sm">
                  Dispose textures when done
                </h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Call texture.dispose() to free GPU memory when a texture is no
                longer needed. This is critical for apps that load and unload
                scenes or swap textures at runtime.
              </p>
            </div>
            <div className="rounded-lg border bg-card p-4 space-y-2">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="size-4 text-green-500" />
                <h3 className="font-semibold text-sm">
                  Use the smallest size that looks good
                </h3>
              </div>
              <p className="text-sm text-muted-foreground">
                A 4096x4096 texture uses roughly 64 MB of GPU memory. On mobile,
                that can cause crashes. Start small (512 or 1024) and only go
                bigger if you see visible quality loss up close.
              </p>
            </div>
            <div className="rounded-lg border bg-card p-4 space-y-2">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="size-4 text-green-500" />
                <h3 className="font-semibold text-sm">
                  Enable anisotropic filtering for floors
                </h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Surfaces viewed at steep angles (floors, roads) shimmer without
                anisotropic filtering. Set texture.anisotropy to the renderer
                maximum for crisp results at any viewing angle.
              </p>
            </div>
          </div>
        </section>
      </ScrollReveal>
    </div>
  );
}
