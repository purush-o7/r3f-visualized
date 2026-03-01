"use client";

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
import { CheckCircle2 } from "lucide-react";

const mistakes: Mistake[] = [
  {
    title: "Putting all scene logic in one giant component",
    subtitle: "The 800-line Scene.tsx that nobody wants to touch",
    wrongCode: `// Scene.tsx — 800 lines of everything
function Scene() {
  const [score, setScore] = useState(0)
  const [health, setHealth] = useState(100)
  const playerRef = useRef()
  // ... 50 more state variables
  // ... physics logic
  // ... animation logic
  // ... UI logic
  // ... input handling
  return (
    <>
      {/* 200 lines of JSX */}
    </>
  )
}`,
    rightCode: `// Split by concern
function Scene() {
  return (
    <>
      <Player />
      <Environment />
      <EnemySpawner />
      <ScoreTracker />
    </>
  )
}

// Player.tsx — focused, testable
function Player() {
  const { position, animate } = usePlayer()
  return <mesh ref={animate}>...</mesh>
}`,
    filename: "SceneSplitting.tsx",
    explanation:
      "A single file with hundreds of lines becomes impossible to debug and review. Split by feature: each component owns its own state, refs, and frame logic. When a bug appears in player movement, you open Player.tsx -- not scroll through 800 lines of Scene.tsx hunting for the relevant useRef.",
  },
  {
    title: "Mixing UI state with 3D scene state",
    subtitle: "Re-renders from a modal toggle cause the entire scene to re-render",
    wrongCode: `function App() {
  const [showSettings, setShowSettings] = useState(false)
  const [volume, setVolume] = useState(0.5)

  return (
    <Canvas>
      {/* This re-renders when showSettings changes */}
      <Scene volume={volume} />
    </Canvas>
    <SettingsModal
      open={showSettings}
      onClose={() => setShowSettings(false)}
    />
  )
}`,
    rightCode: `// Separate UI from 3D with a shared store
import { create } from 'zustand'

const useStore = create((set) => ({
  volume: 0.5,
  setVolume: (v) => set({ volume: v }),
}))

function Scene() {
  const volume = useStore((s) => s.volume)
  return <mesh />
}

function App() {
  return (
    <>
      <Canvas><Scene /></Canvas>
      <UIOverlay />  {/* Separate React tree */}
    </>
  )
}`,
    filename: "UIStateSeparation.tsx",
    explanation:
      "UI state (modals, dropdowns, tooltips) and 3D state (positions, animations, physics) live in different worlds. When they share the same component, toggling a dropdown re-renders the entire Canvas. Use a state manager like Zustand so the 3D scene only re-renders when 3D-relevant state changes.",
  },
  {
    title: "Inlining complex logic in JSX",
    subtitle: "useFrame callbacks with 40 lines of math buried in the component",
    wrongCode: `function Particles() {
  useFrame(({ clock }) => {
    for (let i = 0; i < 1000; i++) {
      const t = clock.elapsedTime
      const x = Math.sin(t + i * 0.1) * 2
      const y = Math.cos(t + i * 0.15) * 3
      const z = Math.sin(t * 0.5 + i * 0.05)
      // ... 30 more lines of math
      dummy.position.set(x, y, z)
      dummy.updateMatrix()
      mesh.current.setMatrixAt(i, dummy.matrix)
    }
    mesh.current.instanceMatrix.needsUpdate = true
  })
  // ...
}`,
    rightCode: `// Extract into a custom hook
function useParticleAnimation(count: number) {
  const meshRef = useRef<THREE.InstancedMesh>(null)
  const dummy = useMemo(() => new THREE.Object3D(), [])

  useFrame(({ clock }) => {
    if (!meshRef.current) return
    updateParticlePositions(meshRef.current, dummy,
      count, clock.elapsedTime)
  })
  return meshRef
}

// Pure function — easy to test
function updateParticlePositions(
  mesh: THREE.InstancedMesh,
  dummy: THREE.Object3D,
  count: number, time: number
) {
  for (let i = 0; i < count; i++) {
    dummy.position.set(
      Math.sin(time + i * 0.1) * 2,
      Math.cos(time + i * 0.15) * 3,
      Math.sin(time * 0.5 + i * 0.05)
    )
    dummy.updateMatrix()
    mesh.setMatrixAt(i, dummy.matrix)
  }
  mesh.instanceMatrix.needsUpdate = true
}`,
    filename: "ExtractHooks.tsx",
    explanation:
      "Custom hooks encapsulate behavior (animation, physics, input). Pure functions handle math. The component just wires them together and returns JSX. This pattern makes each piece testable in isolation and reusable across different components. When the particle math changes, you edit one function -- not dig through JSX.",
  },
];

export default function CodeStructuringPage() {
  return (
    <div className="relative max-w-4xl">
      <div className="absolute -top-10 -left-10 w-72 h-72 bg-gradient-to-br from-teal-500/10 via-emerald-500/10 to-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-3">
          <Badge variant="outline">Production</Badge>
        </div>
        <h1 className="text-3xl font-bold tracking-tight mb-3">
          Code Structuring
        </h1>
        <p className="text-lg text-muted-foreground">
          Your R3F project started as one file. Then it grew to five. Then
          twenty. Now nobody knows where the camera setup lives, the player
          controller is mixed with the UI overlay, and adding a feature
          means touching six files. Time to organize.
        </p>
      </div>

      {/* What Could Go Wrong */}
      <WhatCouldGoWrong
        scenario="You join a team with an existing R3F project. The main Scene.tsx file is 1,200 lines. State for the HUD, physics, animations, and input handling are all tangled together. You need to change how enemies spawn, but every change to Scene.tsx risks breaking the player controller."
        error="DX Issue: Scene.tsx — 1,200 lines | 47 useState calls | 12 useRef declarations | 8 useFrame callbacks in one component | PR reviews take 2 hours"
        errorType="Maintainability"
        accentColor="orange"
      />

      <Separator className="my-8" />

      {/* Story Analogy */}
      <ConversationalCallout type="story">
        <p>
          Think of your codebase like a <strong>restaurant kitchen</strong>.
        </p>
        <p>
          The <strong>head chef</strong> (your App component) coordinates
          everything but does not chop onions. Each <strong>station</strong>{" "}
          (component) has one job: grill, sauce, plating.{" "}
          <strong>Recipes</strong> (custom hooks) encode reusable techniques.{" "}
          <strong>Ingredients</strong> (assets, constants) are stored in
          labeled containers.
        </p>
        <p>
          A well-organized kitchen serves food fast. A messy one -- where the
          pasta water is next to the dessert torch and nobody labeled the
          containers -- burns everything.
        </p>
      </ConversationalCallout>

      <Separator className="my-8" />

      {/* Mental Model Flow */}
      <SimpleFlow
        steps={[
          { label: "Monolith", detail: "One giant Scene.tsx", status: "error" },
          { label: "Split Features", detail: "Component per concern" },
          { label: "Extract Hooks", detail: "Reusable behavior" },
          { label: "Separate UI & 3D", detail: "Independent trees" },
          { label: "Clean Architecture", detail: "Easy to extend", status: "success" },
        ]}
        accentColor="violet"
      />

      <Separator className="my-8" />

      {/* Guided Walkthrough — Folder Structure */}
      <ScrollReveal>
        <section className="space-y-4">
          <h2 className="text-2xl font-bold">
            Feature-Based Folder Structure
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            Organize by feature, not by file type. Everything related to the
            player lives in the player folder. This means you never hunt
            across folders to understand one feature.
          </p>

          <div className="rounded-lg border bg-card p-4 space-y-3">
            <p className="text-sm font-medium">
              Recommended project layout
            </p>
            <CodeBlock
              code={`src/
  app/
    page.tsx              # Entry point
    layout.tsx            # Root layout

  components/
    ui/                   # Reusable UI (buttons, modals)
    canvas/
      Canvas.tsx          # Canvas wrapper with gl settings
      Scene.tsx           # Scene composition (assembles features)

  features/
    player/
      Player.tsx          # 3D component
      usePlayer.ts        # Movement, animation hooks
      player.store.ts     # Zustand slice for player state
      player.constants.ts # Speed, health defaults

    environment/
      Environment.tsx     # Terrain, sky, lighting
      useWeather.ts       # Dynamic weather hook

    enemies/
      EnemySpawner.tsx    # Spawning logic
      Enemy.tsx           # Individual enemy
      useEnemyAI.ts       # AI behavior hook

  hooks/
    useFrame.ts           # Shared frame-loop utilities
    useInput.ts           # Keyboard/mouse abstraction

  stores/
    game.store.ts         # Global game state (score, level)

  assets/
    models/               # .glb, .gltf files
    textures/             # Images, HDR maps
    sounds/               # Audio files`}
              filename="project-structure"
            />
            <p className="text-sm text-muted-foreground">
              Each feature folder contains its component, hooks, store slice,
              and constants. When a feature changes, all the relevant code is
              in one place. When a feature is removed, you delete one folder.
            </p>
          </div>
        </section>
      </ScrollReveal>

      <Separator className="my-8" />

      {/* Step 2: Component Splitting */}
      <ScrollReveal>
        <section className="space-y-4">
          <h2 className="text-2xl font-bold">
            Splitting Scene Components
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            Your Scene component should read like a table of contents --
            listing what exists in the scene, not how each thing works.
          </p>

          <div className="rounded-lg border bg-card p-4 space-y-3">
            <p className="text-sm font-medium">
              Scene as composition root
            </p>
            <CodeBlock
              code={`// Scene.tsx — clean, readable, 30 lines
import { Player } from '@/features/player/Player'
import { Environment } from '@/features/environment/Environment'
import { EnemySpawner } from '@/features/enemies/EnemySpawner'
import { Lighting } from '@/features/environment/Lighting'

export function Scene() {
  return (
    <>
      <Lighting />
      <Environment />
      <Player />
      <EnemySpawner />
    </>
  )
}`}
              filename="Scene.tsx"
            />
            <p className="text-sm text-muted-foreground">
              Reading this file tells you immediately what the scene
              contains. Each component owns its internal logic. To understand
              how enemies work, you open EnemySpawner.tsx. You never need to
              scroll through hundreds of lines of unrelated code.
            </p>
          </div>
        </section>
      </ScrollReveal>

      <Separator className="my-8" />

      {/* Step 3: Custom Hooks */}
      <ScrollReveal>
        <section className="space-y-4">
          <h2 className="text-2xl font-bold">
            Extracting Custom Hooks
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            Custom hooks are the recipes in your kitchen. They encode
            reusable behavior that multiple components might need.
          </p>

          <div className="rounded-lg border bg-card p-4 space-y-3">
            <p className="text-sm font-medium">
              A clean custom hook pattern
            </p>
            <CodeBlock
              code={`// usePlayer.ts — all player behavior in one place
import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { useInput } from '@/hooks/useInput'
import * as THREE from 'three'

export function usePlayer() {
  const ref = useRef<THREE.Group>(null)
  const velocity = useRef(new THREE.Vector3())
  const { forward, backward, left, right } = useInput()

  useFrame((_, delta) => {
    if (!ref.current) return

    // Movement
    const speed = 5
    velocity.current.set(0, 0, 0)
    if (forward)  velocity.current.z -= speed
    if (backward) velocity.current.z += speed
    if (left)     velocity.current.x -= speed
    if (right)    velocity.current.x += speed

    velocity.current.normalize().multiplyScalar(speed * delta)
    ref.current.position.add(velocity.current)
  })

  return { ref }
}

// Player.tsx — tiny, just renders
import { usePlayer } from './usePlayer'

export function Player() {
  const { ref } = usePlayer()
  return (
    <group ref={ref}>
      <mesh>
        <capsuleGeometry args={[0.3, 1, 8, 16]} />
        <meshStandardMaterial color="blue" />
      </mesh>
    </group>
  )
}`}
              filename="usePlayer.ts"
            />
            <p className="text-sm text-muted-foreground">
              The hook handles all behavior (input, movement, collision).
              The component just attaches the ref and renders JSX. This
              separation means you can unit-test the movement math without
              rendering anything, and swap the player model without touching
              the movement code.
            </p>
          </div>
        </section>
      </ScrollReveal>

      <Separator className="my-8" />

      {/* Step 4: State Management */}
      <ScrollReveal>
        <section className="space-y-4">
          <h2 className="text-2xl font-bold">
            State Management with Zustand
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            R3F applications need state that flows between the 3D scene and
            the HTML UI without causing unnecessary re-renders. Zustand is
            the de facto standard for this.
          </p>

          <div className="rounded-lg border bg-card p-4 space-y-3">
            <p className="text-sm font-medium">
              Zustand store with selectors
            </p>
            <CodeBlock
              code={`import { create } from 'zustand'

interface GameState {
  score: number
  health: number
  phase: 'menu' | 'playing' | 'paused' | 'gameover'
  addScore: (points: number) => void
  takeDamage: (amount: number) => void
  setPhase: (phase: GameState['phase']) => void
}

export const useGameStore = create<GameState>((set) => ({
  score: 0,
  health: 100,
  phase: 'menu',
  addScore: (points) => set((s) => ({ score: s.score + points })),
  takeDamage: (amount) => set((s) => ({
    health: Math.max(0, s.health - amount),
    phase: s.health - amount <= 0 ? 'gameover' : s.phase,
  })),
  setPhase: (phase) => set({ phase }),
}))

// In a 3D component — only re-renders when score changes
function ScorePopup() {
  const score = useGameStore((s) => s.score)
  return <Text3D>{score}</Text3D>
}

// In the HTML UI — only re-renders when health changes
function HealthBar() {
  const health = useGameStore((s) => s.health)
  return <div style={{ width: \`\${health}%\` }} />
}`}
              filename="gameStore.ts"
            />
            <p className="text-sm text-muted-foreground">
              The selector pattern ensures each component only re-renders
              when its specific slice of state changes. The 3D ScorePopup
              does not re-render when health changes, and the HTML HealthBar
              does not re-render when the score changes. This is critical
              for keeping the Canvas performant.
            </p>
          </div>
        </section>
      </ScrollReveal>

      <Separator className="my-8" />

      {/* What You Just Learned */}
      <WhatYouJustLearned
        points={[
          "Feature-based folders keep all related code (component, hook, store, constants) together.",
          "Scene components should read like a table of contents — list features, not implement them.",
          "Custom hooks encapsulate behavior (movement, animation, AI). Components just render JSX.",
          "Zustand with selectors prevents cross-domain re-renders between UI and 3D.",
          "Separating UI and 3D into independent React trees prevents toggle-a-modal-re-render-the-canvas problems.",
        ]}
      />

      <Separator className="my-8" />

      {/* Question */}
      <ConversationalCallout type="question">
        <p>
          You need to share the player&apos;s position between the 3D scene
          (for enemy AI targeting) and the HTML UI (for a minimap). Using
          useState would re-render the Canvas every frame. Using a ref would
          not trigger UI updates. What is the right pattern?
        </p>
      </ConversationalCallout>

      <Separator className="my-8" />

      {/* Aha Moment */}
      <AhaMoment
        setup="Developers often think code structure is a matter of personal preference -- tabs vs spaces, flat vs nested folders. But in R3F projects, structure is a performance decision..."
        reveal="Every useState call in a parent component re-renders all its children. In a normal React app, this is fine -- the DOM diffing is fast. But in R3F, a re-render can mean rebuilding Three.js objects, reallocating GPU buffers, and dropping frames. When you put UI state (modal visibility, settings panels) in the same component as your 3D scene, opening a dropdown re-renders every mesh, light, and material. Splitting UI and 3D into separate component trees is not about aesthetics -- it is about frame rate. Bad structure literally causes jank."
      />

      <Separator className="my-8" />

      {/* Mental Model Challenge */}
      <MentalModelChallenge
        question="You have a Zustand store with score, health, and playerPosition (updated every frame). A HUD component subscribes to score and health. Will the HUD re-render 60 times per second because playerPosition changes every frame?"
        options={[
          {
            label: "Yes, any store change triggers all subscribers",
            correct: false,
            explanation:
              "Zustand uses selectors. Components only re-render when their selected slice changes, not when any store value changes.",
          },
          {
            label: "No, because Zustand selectors only trigger re-renders when the selected value changes",
            correct: true,
            explanation:
              "The HUD selects score and health. When playerPosition changes, Zustand runs the selector, sees score and health are the same, and skips the re-render.",
          },
          {
            label: "It depends on whether you use React.memo",
            correct: false,
            explanation:
              "React.memo prevents re-renders from parent props. Zustand selector isolation works independently of React.memo.",
          },
          {
            label: "No, because refs bypass React entirely",
            correct: false,
            explanation:
              "Zustand state is not stored in refs. It uses a subscription model with selectors to determine which components need to update.",
          },
        ]}
        hint="Zustand's useStore hook takes a selector function. What does the selector return, and what triggers a re-render?"
        answer="Zustand uses shallow comparison on the selected value. When you write useGameStore(s => s.score), Zustand compares the previous score to the new score after every store update. If they are equal, no re-render. This means playerPosition can update 60 times per second without touching the HUD. However, if you select the entire store (useGameStore()), every change triggers a re-render. Always use fine-grained selectors."
      />

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
                <h3 className="font-semibold text-sm">One Component, One Job</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                If a component does more than one thing (renders a mesh AND
                handles input AND manages state), split it. The component
                renders JSX. The hook handles behavior. The store manages
                state.
              </p>
            </div>
            <div className="rounded-lg border bg-card p-4 space-y-2">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="size-4 text-green-500" />
                <h3 className="font-semibold text-sm">Lazy Load Heavy Scenes</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Use dynamic imports for scenes that are not immediately
                visible. React.lazy and Next.js dynamic() let you code-split
                heavy 3D scenes so they only load when the user navigates to
                them.
              </p>
            </div>
            <div className="rounded-lg border bg-card p-4 space-y-2">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="size-4 text-green-500" />
                <h3 className="font-semibold text-sm">
                  Keep Frame Logic in Hooks
                </h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Every useFrame callback should live in a custom hook, not
                inline in a component. This makes animation and physics
                logic testable, reusable, and easy to disable by simply
                not calling the hook.
              </p>
            </div>
            <div className="rounded-lg border bg-card p-4 space-y-2">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="size-4 text-green-500" />
                <h3 className="font-semibold text-sm">
                  Type Your Stores
                </h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Define TypeScript interfaces for every Zustand store. This
                catches bugs at compile time -- if a component selects
                s.socre instead of s.score, TypeScript tells you before
                your users do.
              </p>
            </div>
          </div>
        </section>
      </ScrollReveal>
    </div>
  );
}
