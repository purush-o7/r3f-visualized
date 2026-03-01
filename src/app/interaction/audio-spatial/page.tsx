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
    import("./_components/audio-demo").then((m) => ({
      default: m.AudioDemo,
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
    title: "Trying to autoplay audio without user interaction",
    subtitle: "Browsers block audio until the user clicks or taps",
    wrongCode: `function Scene() {
  // This will be blocked by the browser!
  return (
    <PositionalAudio
      url="/music.mp3"
      autoplay
      distance={5}
    />
  )
}`,
    rightCode: `function Scene() {
  const [started, setStarted] = useState(false)

  return (
    <>
      {!started && (
        <Html center>
          <button onClick={() => setStarted(true)}>
            Start Experience
          </button>
        </Html>
      )}
      {started && (
        <PositionalAudio url="/music.mp3" distance={5} />
      )}
    </>
  )
}`,
    filename: "Scene.tsx",
    explanation:
      "All modern browsers require a user gesture (click, tap, key press) before playing audio. This is a security feature to prevent websites from blasting sound unexpectedly. Gate your audio behind a 'Start' button.",
  },
  {
    title: "Setting refDistance too small",
    subtitle: "Audio drops to zero almost immediately",
    wrongCode: `// refDistance = 0.1 means audio is only
// audible within 0.1 units of the source
<PositionalAudio
  url="/music.mp3"
  distance={0.1}
/>`,
    rightCode: `// refDistance = 5 means audio stays at full
// volume within 5 units, then falls off
<PositionalAudio
  url="/music.mp3"
  distance={5}
/>`,
    filename: "SoundSource.tsx",
    explanation:
      "refDistance is the distance at which the volume is at 100%. Beyond that, it falls off. If refDistance is tiny, the listener has to be almost on top of the source to hear anything. Set it to match your scene scale.",
  },
  {
    title: "Forgetting to attach audio to the camera",
    subtitle: "AudioListener is not connected, so positional audio has no reference point",
    wrongCode: `// No AudioListener attached to camera
<Canvas>
  <PositionalAudio url="/sound.mp3" />
</Canvas>`,
    rightCode: `function AudioSetup() {
  const { camera } = useThree()
  const [listener] = useState(
    () => new THREE.AudioListener()
  )

  useEffect(() => {
    camera.add(listener)
    return () => { camera.remove(listener) }
  }, [camera, listener])

  return null
}`,
    filename: "AudioSetup.tsx",
    explanation:
      "Positional audio calculates volume and panning based on the listener's position, which is typically attached to the camera. Without an AudioListener on the camera, Three.js has no reference point for spatial calculations.",
  },
];

export default function AudioSpatialPage() {
  return (
    <div className="max-w-4xl ambient-canvas">
      {/* ── 1. Title + Badge + Intro ── */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-3">
          <Badge variant="outline">Animation & Physics</Badge>
        </div>
        <h1 className="text-3xl font-bold tracking-tight mb-3">
          Spatial Audio
        </h1>
        <p className="text-lg text-muted-foreground">
          Close your eyes in a concert hall. The drummer is on your left, the
          guitarist on your right. Walk closer to the guitarist and they get
          louder. Turn your head and the balance shifts. That is positional audio
          -- sound that exists in 3D space, not just your speakers. In WebGL,
          Three.js gives you the tools to place sounds in your scene so they
          behave just like real-world sound sources.
        </p>
      </div>

      {/* ── 2. WhatCouldGoWrong ── */}
      <WhatCouldGoWrong
        scenario={`You add a PositionalAudio component to your scene and set autoplay. Nothing plays. No errors in the console. You refresh, try different browsers, check your volume. The file is loading fine. After an hour of debugging, you discover the issue: browsers block autoplay audio until the user interacts with the page.`}
        error={`DOMException: play() request was interrupted.
The AudioContext was not allowed to start.
Autoplay policy: https://developer.chrome.com/blog/autoplay
User gesture required before AudioContext.resume().`}
        errorType="Browser Policy"
      />

      <Separator className="my-8" />

      {/* ── 3. Story Analogy ── */}
      <ScrollReveal>
        <ConversationalCallout type="story">
          <p>
            Imagine standing in the middle of a concert hall. There are four
            musicians around you -- drums to the left, guitar to the right,
            vocals straight ahead, bass behind you.
          </p>
          <p>
            As you walk toward the guitarist, their sound gets louder while the
            drums behind you fade. Turn your head to the right and the guitar
            moves to center while the drums shift to your right ear. This is
            exactly how positional audio works in 3D.
          </p>
          <p>
            Three.js models this with two concepts: an{" "}
            <strong>AudioListener</strong> (your ears, attached to the camera)
            and <strong>PositionalAudio</strong> sources (the musicians, placed
            at specific coordinates). The Web Audio API handles the math --
            distance falloff, stereo panning, and Doppler effects.
          </p>
        </ConversationalCallout>
      </ScrollReveal>

      <Separator className="my-8" />

      {/* ── 4. SimpleFlow ── */}
      <ScrollReveal>
        <h2 className="text-2xl font-bold mb-4">How Spatial Audio Works</h2>
        <SimpleFlow
          steps={[
            { label: "AudioListener on camera", detail: "Your virtual ears -- moves with the camera" },
            { label: "PositionalAudio on object", detail: "A sound source placed at a 3D position" },
            { label: "Distance calculated", detail: "How far is the listener from the source?" },
            { label: "Volume falls off", detail: "Inverse distance model reduces volume with distance" },
            { label: "Stereo panning", detail: "Left/right balance based on relative position", status: "success" },
          ]}
        />
      </ScrollReveal>

      <Separator className="my-8" />

      {/* ── 5. Demo ── */}
      <ScrollReveal>
        <h2 className="text-2xl font-bold mb-4">Visualizing Spatial Audio</h2>
        <p className="text-muted-foreground mb-4">
          Since we cannot play actual audio in this demo, we are visualizing the
          concept. Each colored sphere is a sound source (drums, guitar, vocals,
          bass). The white sphere with ears is the listener. Drag the listener
          position with the controls and watch how pulse rings change -- closer
          sources pulse faster and brighter, just like they would sound louder.
          The connecting lines fade based on distance falloff.
        </p>
      </ScrollReveal>
      <Demo />

      <Separator className="my-8" />

      {/* ── 6. Guided Walkthrough ── */}
      <ScrollReveal>
        <h2 className="text-2xl font-bold mb-4">Building It Step by Step</h2>

        {/* Step 1 */}
        <div className="rounded-lg border bg-card p-4 mb-4">
          <p className="text-sm font-semibold mb-2">
            Step 1 -- Set up the AudioListener
          </p>
          <p className="text-sm text-muted-foreground mb-3">
            The AudioListener is your virtual ears. Attach it to the camera so
            it moves and rotates with the viewer. There should be exactly one
            listener per scene.
          </p>
          <CodeBlock
            code={`import { useThree } from "@react-three/fiber"
import * as THREE from "three"

function AudioSetup() {
  const { camera } = useThree()
  const [listener] = useState(() => new THREE.AudioListener())

  useEffect(() => {
    camera.add(listener)
    return () => { camera.remove(listener) }
  }, [camera, listener])

  // Store listener in context or pass to children
  return null
}`}
            filename="AudioSetup.tsx"
          />
        </div>

        {/* Step 2 */}
        <div className="rounded-lg border bg-card p-4 mb-4">
          <p className="text-sm font-semibold mb-2">
            Step 2 -- Create a positional audio source
          </p>
          <p className="text-sm text-muted-foreground mb-3">
            Place a <code>PositionalAudio</code> as a child of any mesh. The
            sound will emanate from that mesh&apos;s position. The{" "}
            <code>refDistance</code> property controls where the falloff
            begins.
          </p>
          <CodeBlock
            code={`import { PositionalAudio } from "@react-three/drei"

function Speaker({ position }) {
  return (
    <mesh position={position}>
      <sphereGeometry args={[0.3]} />
      <meshStandardMaterial color="tomato" />

      {/* Audio emanates from this mesh's position */}
      <PositionalAudio
        url="/sounds/drums.mp3"
        distance={5}       // refDistance: full volume within 5 units
        loop
      />
    </mesh>
  )
}`}
            filename="Speaker.tsx"
          />
          <p className="text-sm text-muted-foreground mt-2">
            <code>distance</code> (refDistance) is the radius of full volume.
            Beyond this distance, volume drops off using an inverse-distance
            model by default.
          </p>
        </div>

        {/* Step 3 */}
        <div className="rounded-lg border bg-card p-4 mb-4">
          <p className="text-sm font-semibold mb-2">
            Step 3 -- Configure distance falloff
          </p>
          <p className="text-sm text-muted-foreground mb-3">
            Three.js supports multiple distance models for how sound fades
            with distance. The most common is <code>inverse</code> (realistic)
            but you can also use <code>linear</code> (predictable) or{" "}
            <code>exponential</code> (dramatic).
          </p>
          <CodeBlock
            code={`// The three distance models:

// Inverse (default, most realistic):
// volume = refDistance / (refDistance + rolloff * (distance - refDistance))
audio.setDistanceModel('inverse')
audio.setRefDistance(5)       // full volume within 5 units
audio.setRolloffFactor(1)    // how quickly it fades

// Linear (predictable, reaches zero):
// volume = 1 - rolloff * (distance - refDistance) / (maxDistance - refDistance)
audio.setDistanceModel('linear')
audio.setMaxDistance(20)     // silence beyond 20 units

// Exponential (dramatic falloff):
// volume = (distance / refDistance) ^ -rolloff
audio.setDistanceModel('exponential')`}
            filename="DistanceModels.tsx"
          />
        </div>
      </ScrollReveal>

      <Separator className="my-8" />

      {/* ── 7. WhatYouJustLearned ── */}
      <WhatYouJustLearned
        points={[
          "AudioListener attaches to the camera and represents the player's ears",
          "PositionalAudio sources are placed at 3D coordinates and their volume varies with distance",
          "refDistance defines the radius of full volume -- beyond it, sound fades",
          "Three distance models exist: inverse (realistic), linear (predictable), exponential (dramatic)",
          "Browsers require a user gesture before audio can play -- always gate audio behind a click",
        ]}
      />

      <Separator className="my-8" />

      {/* ── 8. Question Callout ── */}
      <ScrollReveal>
        <ConversationalCallout type="insight">
          <p>
            Spatial audio is not just for games. Virtual tours use it to make
            rooms feel lived-in (a ticking clock in the study, rain on the
            windows). Product configurators use it for satisfying click sounds
            when selecting options. Art installations use it to guide attention
            -- placing a subtle sound draws the viewer toward a specific area
            of the scene.
          </p>
        </ConversationalCallout>
      </ScrollReveal>

      <Separator className="my-8" />

      {/* ── 9. AhaMoment ── */}
      <AhaMoment
        setup="Why does positional audio need to be attached to the camera specifically?"
        reveal="The AudioListener represents where your ears are in 3D space. In a first-person experience, your ears are at the camera. When you rotate the camera left, sounds on the right should shift to your left ear -- this only works if the listener rotates with the camera. In a third-person game, you might attach the listener to the player character instead of the camera, so sound perspective matches the character, not the floating camera."
      />

      <Separator className="my-8" />

      {/* ── 10. MentalModelChallenge ── */}
      <MentalModelChallenge
        question="You have a sound source with refDistance=5 using the inverse distance model. The listener is at distance 15. Roughly how loud is the sound compared to being at distance 5?"
        options={[
          {
            label: "About 1/3 volume",
            correct: false,
            explanation:
              "Close, but the formula is refDist / (refDist + rolloff * (dist - refDist)). With default rolloff of 1: 5 / (5 + 1 * 10) = 5/15 = 1/3. Actually this IS correct for the basic formula, but the effective perceived loudness follows the inverse square law.",
          },
          {
            label: "About 1/3 volume (33%)",
            correct: true,
            explanation:
              "Using the inverse model: volume = refDist / (refDist + rolloff * (dist - refDist)) = 5 / (5 + 1 * 10) = 5/15 = 0.33 or about 33% volume.",
          },
          {
            label: "About 1/9 volume (11%)",
            correct: false,
            explanation:
              "That would be the inverse square law (1/distance^2). The Web Audio API inverse model uses a simpler formula: refDist / (refDist + rolloff * (dist - refDist)).",
          },
        ]}
        answer="With the inverse distance model and default rolloff of 1: volume = refDistance / (refDistance + rolloff * (distance - refDistance)) = 5 / (5 + 1 * (15 - 5)) = 5/15 = approximately 33%. The sound is about a third as loud as it would be at the reference distance."
      />

      <Separator className="my-8" />

      {/* Try This */}
      <Separator className="my-8" />
      <ScrollReveal>
        <TryThisList challenges={[
          { challenge: "Move listener to [0,0] — center stage", hint: "Position the audio listener at the center of the scene.", solution: "When the listener is equidistant from all sources, you hear everything at equal volume.", difficulty: "beginner" },
          { challenge: "Set falloff to 1 — tiny range", hint: "Reduce the audio rolloff factor to 1.", solution: "Sound drops off quickly with distance. Move just a little away from a source and it becomes nearly silent.", difficulty: "beginner" },
          { challenge: "Move listener to edge — distant sounds", hint: "Drag the listener position to the far edge of the scene.", solution: "Nearby sources become loud while distant ones fade, demonstrating spatial audio attenuation.", difficulty: "beginner" },
        ]} />
      </ScrollReveal>

      <Separator className="my-8" />

      {/* ── 11. CommonMistakes ── */}
      <ScrollReveal>
        <CommonMistakes mistakes={mistakes} />
      </ScrollReveal>

      <Separator className="my-8" />

      {/* ── 12. Best Practices ── */}
      <ScrollReveal>
        <section className="space-y-4">
          <h2 className="text-2xl font-bold">Best Practices</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-lg border bg-card p-4 space-y-2">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="size-4 text-green-500" />
                <h3 className="font-semibold text-sm">
                  Gate audio behind user interaction
                </h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Always require a click or tap before starting audio. Use a
                &quot;Start Experience&quot; button or begin audio on the first
                user interaction with the scene.
              </p>
            </div>
            <div className="rounded-lg border bg-card p-4 space-y-2">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="size-4 text-green-500" />
                <h3 className="font-semibold text-sm">
                  Match refDistance to scene scale
                </h3>
              </div>
              <p className="text-sm text-muted-foreground">
                If your scene units are meters, set refDistance in meters. A
                room might use refDistance=3, while an outdoor scene might use
                refDistance=20. Test by walking the camera around.
              </p>
            </div>
            <div className="rounded-lg border bg-card p-4 space-y-2">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="size-4 text-green-500" />
                <h3 className="font-semibold text-sm">
                  Limit concurrent audio sources
                </h3>
              </div>
              <p className="text-sm text-muted-foreground">
                The Web Audio API can handle many sources, but each one
                consumes CPU for spatial processing. Keep active sources under
                ~10 and pause distant ones that the listener cannot hear.
              </p>
            </div>
            <div className="rounded-lg border bg-card p-4 space-y-2">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="size-4 text-green-500" />
                <h3 className="font-semibold text-sm">
                  Use compressed audio formats
                </h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Load <code>.mp3</code> or <code>.ogg</code> instead of{" "}
                <code>.wav</code>. Compressed formats are 10-20x smaller,
                loading faster and using less memory. The quality difference is
                imperceptible for most spatial audio use cases.
              </p>
            </div>
          </div>
        </section>
      </ScrollReveal>
    </div>
  );
}
