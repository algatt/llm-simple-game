# Robert Game

An experiment to generate a very simple JavaScript/Phaser game in about 25 prompts.

The game is an endless road cycling prototype. The player rides a bicycle, follows a generated road, avoids going off-road, dodges scenery, earns points by covering distance, and loses health on collisions.

## Setup

Install dependencies from the `src` project folder:

```bash
cd src
npm install
```

## Run

Start the local dev server:

```bash
npm run dev
```

Then open the URL Vite prints in the terminal. By default it is usually:

```text
http://127.0.0.1:5173
```

## Deploy To GitHub Pages

This repository is configured for GitHub Pages under the repo name `llm-simple-game`.

The Vite base path is set in:

```text
src/vite.config.js
```

The GitHub Pages workflow is:

```text
.github/workflows/deploy.yml
```

To publish:

1. Push changes to the `main` branch.
2. In GitHub, open the repository settings.
3. Go to **Pages**.
4. Set **Build and deployment** source to **GitHub Actions**.
5. Wait for the `Deploy to GitHub Pages` workflow to finish.

The site should then be available at:

```text
https://<your-github-username>.github.io/llm-simple-game/
```

## Controls

- `A`: steer left
- `D`: steer right
- `W`: increase speed
- `S`: decrease speed
- `P`: pause/resume
- `R`: restart after game over
- `MUSIC: ON/OFF`: click the in-game button to mute or unmute background music

## Journals

### `JOURNAL.md`

This is the development journal used by Codex during implementation. It records progress, architecture choices, lessons learned, and design preferences as the game evolves.

### `JOURNAL_ALAN.md`

This is a prompt-by-prompt log of Alan's requests. After each prompt, a `#### CODEX WORK` section summarizes what Codex did in response. It is useful for understanding how the game was built iteratively.

## Project Shape

- `src/scenes/`: Phaser scenes.
- `src/elements/`: modular visual/game elements such as player, road, HUD, houses, trees, and overlays.
- `src/systems/`: reusable game systems such as road generation, scenery generation, scoring, health, difficulty, and sound.

The code is intentionally modular so new game elements can be added, removed, or swapped as the prototype grows.
