# R3F Visualized

An interactive learning platform for **React Three Fiber** — from Three.js fundamentals to production-ready 3D on the web. Every concept has a live, interactive 3D demo you can play with directly in the browser.

**Live site:** [r3f-visualized.vercel.app](https://r3f-visualized.vercel.app)

## What You'll Learn

The curriculum is structured as a progressive path through 3D web development:

### Three.js Fundamentals
| Topic | What's Covered |
|-------|---------------|
| **Scene Basics** | Scene, camera, renderer pipeline and the animation loop |
| **Geometries** | Built-in shapes, buffer geometry internals, custom geometry from vertices |
| **Materials** | Basic to PBR materials, texture mapping and UV coordinates |
| **Lights** | Light types, shadow casting/receiving, environment maps |

### React Three Fiber
| Topic | What's Covered |
|-------|---------------|
| **Canvas & Setup** | The Canvas component, JSX-to-Three.js mapping, declarative scene graph |
| **Meshes & Objects** | Mesh component, groups/hierarchy, instanced rendering |
| **R3F Hooks** | `useFrame`, `useThree`, `useLoader` |
| **Events** | Pointer events on 3D objects, raycasting |

### Drei & Ecosystem
| Topic | What's Covered |
|-------|---------------|
| **Controls** | OrbitControls, camera controls |
| **Staging** | Environment maps, Stage component, sky and stars |
| **Text & HTML** | 3D text rendering, HTML overlays in 3D space |
| **Loaders** | GLTF/GLB models, `useGLTF` hook |

### Advanced Topics
| Topic | What's Covered |
|-------|---------------|
| **Shaders** | Custom ShaderMaterial, vertex/fragment shaders, uniforms and varyings |
| **Shader Recipes** | Galaxy generator, hologram effect, procedural terrain, raging sea |
| **Post-Processing** | EffectComposer, bloom, vignette, SSAO |
| **Performance** | Optimization techniques, drei performance helpers |
| **Particles** | Points systems, sprites/billboards, lines/curves, render targets |
| **Transforms** | Position/rotation/scale, colors, fog, responsive resize |
| **Interaction** | Animation libraries, spatial audio, physics with Rapier |
| **Production** | Code structuring, loading progress, realistic rendering, deployment |
| **Debug** | Camera types, wireframe helpers |

## Getting Started

```bash
# Install dependencies
npm install

# Start the dev server
npm run dev

# Build for production
npm run build
```

Open [localhost:3000](http://localhost:3000) to start exploring.

## Tech Stack

- **Framework:** [Next.js 16](https://nextjs.org) (App Router, Turbopack)
- **3D:** [React Three Fiber](https://r3f.docs.pmnd.rs) + [Three.js](https://threejs.org)
- **Helpers:** [@react-three/drei](https://drei.docs.pmnd.rs), [@react-three/rapier](https://github.com/pmndrs/react-three-rapier)
- **UI:** [Radix UI](https://radix-ui.com), [shadcn/ui](https://ui.shadcn.com), [Tailwind CSS v4](https://tailwindcss.com)
- **Animation:** [Motion](https://motion.dev) (Framer Motion)
- **Controls:** [Leva](https://github.com/pmndrs/leva) for interactive parameter tweaking
- **Syntax Highlighting:** [Shiki](https://shiki.style)

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── scene-basics/       # Scene, camera, renderer, animation loop
│   ├── geometries/         # Built-in, buffer, and custom geometry
│   ├── materials/          # Basic, PBR, and texture materials
│   ├── lights/             # Light types, shadows, environment maps
│   ├── canvas/             # R3F Canvas component and setup
│   ├── meshes/             # Mesh component, groups, instancing
│   ├── r3f-hooks/          # useFrame, useThree, useLoader
│   ├── events/             # Pointer events and raycasting
│   ├── controls/           # OrbitControls, camera controls
│   ├── staging/            # Environment, sky, Stage component
│   ├── text-html/          # 3D text and HTML overlays
│   ├── loaders/            # GLTF models and useGLTF
│   ├── shaders/            # ShaderMaterial, uniforms, varyings
│   ├── shader-recipes/     # Galaxy, hologram, terrain, sea
│   ├── post-processing/    # EffectComposer and effects
│   ├── performance/        # Optimization and profiling
│   ├── particles/          # Points, sprites, lines, render targets
│   ├── transforms/         # Position, rotation, scale, fog, colors
│   ├── interaction/        # Animation libs, audio, physics
│   ├── production/         # Code structure, loading, deployment
│   └── debug/              # Camera types, wireframe helpers
└── components/             # Shared UI and 3D components
    ├── ui/                 # shadcn/ui primitives
    ├── scene-container.tsx # Reusable 3D scene wrapper
    ├── leva-panel.tsx      # Shared Leva controls panel
    ├── code-block.tsx      # Syntax-highlighted code snippets
    ├── hero-scene.tsx      # Landing page 3D scene
    └── ...                 # Learning components (callouts, challenges, etc.)
```

Each topic page follows the same pattern:
- **`page.tsx`** — explanation with code snippets and learning components
- **`_components/`** — the live interactive 3D demo for that topic

## How Each Lesson Works

Every lesson page includes:

1. **Concept explanation** with highlighted code snippets
2. **Live 3D demo** you can interact with (rotate, zoom, click)
3. **Leva controls** to tweak parameters in real-time
4. **Learning aids** — "aha moment" callouts, common mistakes, mental model challenges, and "try this" exercises

## License

MIT
