# Robert Game Journal

## 2026-04-29

### Starting Intent
- Build a simple JavaScript game iteratively.
- Keep game elements modular so features can be added, removed, or swapped in a plug-and-play way.
- Maintain this journal as the project memory: progress, preferences, decisions, lessons learned, and open questions.

### Workspace Notes
- The workspace currently has very little project structure.
- An existing `Alan Journal.txt` file is present, but this `JOURNAL.md` will be the main development journal unless we decide otherwise.
- The IDE context mentioned `start.txt`, but that file is not currently present in the workspace.

### Early Architecture Preference
- Favor small modules with clear ownership:
  - `engine/` for core loop, scene lifecycle, plugin registry, shared events.
  - `features/` for plug-in gameplay elements such as player, enemies, collectibles, levels, UI, scoring, and audio.
  - `assets/` for sprites, sound, tilemaps, and generated media.
  - `scenes/` for boot, menu, gameplay, pause, and game-over states.
- Each gameplay element should ideally expose a small lifecycle API such as `register`, `create`, `update`, and `destroy`.
- Avoid baking game rules directly into global code. Prefer composition through systems/plugins.

### Preliminary Engine Research
- **Phaser** looks like the strongest default candidate for a simple 2D JavaScript game. It is mature, actively maintained, browser-first, supports JavaScript or TypeScript, and already has scene and plugin concepts that fit a modular project.
- **Excalibur.js** is a good alternative if we want a friendly, TypeScript-first 2D engine with more built-in structure. It is attractive for maintainable code, but it is still pre-1.0 according to its docs.
- **PixiJS** is excellent as a rendering library, but it is not a full game engine. We would need to add our own scene management, input model, asset loading conventions, physics, and plugin lifecycle. That may be fun later, but it adds early scaffolding work.
- **PlayCanvas** is a strong web engine for 3D/WebGL/WebGPU experiences. It is likely more than we need for a simple 2D game unless the game direction turns 3D.

### Current Recommendation
- Start with **Phaser** and a small custom plugin/module layer on top.
- Keep the first prototype deliberately plain:
  - one boot scene,
  - one game scene,
  - a plugin registry,
  - a player module,
  - keyboard input,
  - one simple objective.

### Lessons Learned
- Begin with architecture light enough to change. Modularity should help iteration, not slow down the first playable prototype.
- Use an engine for solved game problems such as rendering, input, loading, timing, and scenes.
- Keep our own project-specific gameplay modules separate from engine-specific setup so we can still refactor later.

### Open Questions
- Should the game be top-down, platformer, puzzle, arcade shooter, or something else?
- Should we use plain JavaScript first, or TypeScript from the start?
- Should the first prototype use generated placeholder shapes, simple sprites, or imported artwork?
- What is the intended screen size and primary input: keyboard, mouse, touch, or gamepad?

### Progress Update: Phaser Bootstrap
- Added a minimal Vite + Phaser project structure.
- Created `index.html`, `src/main.js`, `src/scenes/BootScene.js`, `src/scenes/GameScene.js`, and `src/styles.css`.
- The first visible prototype is intentionally simple: a title, a status line, and a moving green square so we can confirm Phaser rendering and the update loop are working.
- Kept scenes in their own files from the beginning so future modules can plug into scenes cleanly.

### Run Notes
- Install dependencies with `npm install`.
- Start the browser dev server with `npm run dev`.

### Progress Update: World Split
- Added a first modular world setup with separate `SkyElement` and `TerrainElement` modules.
- `GameScene` now composes the world from those elements instead of drawing everything directly in the scene.
- The screen is split 50/50: sky on the top half, terrain on the bottom half.
- Removed the temporary Phaser status text and bouncing square so the browser view now shows the beginning of the game world.

### Preference
- Keep visual world pieces as replaceable modules. A scene should decide which elements exist, while each element owns how it draws and cleans itself up.

### Progress Update: Road Element
- Added `RoadElement` as a separate terrain child module.
- The road is drawn in the middle of the terrain and can be parameterized with `curveX`.
- `curveX` shifts the far/horizon end of the road left or right while the near/bottom end stays centered, giving us the beginning of a swerving road model.
- `TerrainElement` now accepts a road instance, so the road can be swapped or configured without changing terrain drawing logic.

### Progress Update: Curved Road
- Reworked `RoadElement` so `curveX` creates an actual bend instead of a diagonal road.
- The road is now generated from multiple sampled points: its centerline eases toward the configured curve amount while the road narrows toward the horizon.
- Added `segments` and `curveStrength` parameters so future tuning can control road smoothness and bend shape.

### Progress Update: Player Cube
- Added a modular `PlayerElement`.
- The first player is a simple cube placed near the bottom center of the terrain.
- Added keyboard movement with `A` for left and `D` for right.
- Kept movement inside the player element so the cube can later become a bicycle without crowding `GameScene`.

### Progress Update: Speed and Road Generation
- Added player forward speed with `W` to accelerate and `S` to brake.
- Speed is clamped between configured minimum and maximum values.
- Added `SpeedHudElement` to show current speed at the top of the screen.
- Added `RoadGenerator`, which creates continuous random road offsets from spaced anchor points and smooth interpolation.
- Reworked `RoadElement` so the road advances through generated road data based on player speed, making the player feel like they are moving forward on an endless road.

### Progress Update: Natural Road Flow
- Changed player speed to a gameplay scale from `1` to `10`.
- Added an internal road movement multiplier so displayed speed stays readable while the world still scrolls convincingly.
- Tuned `RoadGenerator` for more natural streets:
  - longer spacing between curve anchors,
  - smaller offset changes,
  - a slight bias back toward the center,
  - less far-future road sampled on screen.
- Increased road curve easing so bends feel gradual instead of twisty.

### Progress Update: Straights and Meaningful Turns
- Changed `RoadGenerator` from constant wandering to section-based road planning.
- Most generated sections are straights with only tiny jitter and a stronger pull back toward center.
- Occasional turn sections now move the road more decisively left or right for one or two anchors.
- This should support the future health system better: long straights let the player recover, while sharper turns create moments where going off-road can matter.

### Progress Update: Section Length Road Planning
- Replaced evenly spaced road anchors with variable road sections.
- Straights now hold almost the same offset for a long distance.
- Turns now happen over a much shorter distance and move by a larger amount.
- The generator alternates between long straight holds and short turn transitions, which should read more like actual roads than left/right drifting.

### Progress Update: Road Perspective Polish
- Changed the road center line from solid to dashed.
- Road markings now scroll with road distance so speed is more visible.
- Road surface and linework fade toward the horizon.
- Adjusted road width interpolation to feel more perspective-like, with stronger narrowing farther away.

### Progress Update: Road Fade Correction
- Removed transparency from the asphalt surface because it exposed the terrain underneath.
- Kept the distance effect by blending road color toward a lighter far-road color instead.
- Retained fading on markings and edge lines, where transparency reads better visually.

### Progress Update: House Scenery
- Added `HouseElement`, a parameterized house module with width, height, type, color, roof color, and window count.
- Added `SceneryGenerator`, which spawns houses at random intervals on the left and right sides of the road.
- Exposed road distance and distance sampling from `RoadElement` so scenery can stay aligned with the generated road.
- Houses scale, fade, and reposition according to perspective as they move toward the player.

### Progress Update: House Perspective Refinement
- Houses now stay fully opaque; distance is communicated by scale instead of transparency.
- Increased house base dimensions so nearby houses read as scenery, not player-sized props.
- Strengthened perspective scaling so distant houses start small and grow as they approach.
- Fixed triangular roof alignment by drawing it around a centered local origin.

### Progress Update: Roof Alignment Fix
- Replaced Phaser triangle roof positioning with an explicit graphics polygon.
- The triangular roof base now sits directly on the house rectangle's top edge in local house coordinates.

### Progress Update: House Placement Tuning
- Increased scenery side offset so houses sit farther away from the road.
