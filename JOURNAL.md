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
