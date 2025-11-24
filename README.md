# Labyrynth · a pocket maze chronicle

> “Take a deep breath, touch the cold wall, and trust that the next turn is yours.”

Labyrynth is a tiny single-player maze runner that I built to explore React hooks, keyboard controls, and a bit of visual storytelling. Think of it as a maze journal: each difficulty is a chapter, every step is counted, and your best runs stay etched in local storage.

## Highlights

- **Three mood-based difficulty books** – `easy`, `medium`, `hard`, each with 5 handcrafted mazes that grow from 10×10 to 30×30.
- **Keyboard-friendly wandering** – supports both WASD and the same keys on the Russian layout (W/Ц, A/Ф, S/Ы, D/В), so you never lose momentum after switching languages.
- **HUD for mindful runners** – live steps counter and ticking timer keep you honest during a run.
- **Persistent memory** – a sortable stats table survives page reloads thanks to `localStorage`. Rename your hero, clear the archive, or keep every attempt as a breadcrumb trail.
- **Variant tiles** – cells pick subtle visual variants so every maze looks a little more alive.

## Controls

| Action      | Keys (EN) | Keys (RU layout) |
|-------------|-----------|------------------|
| Move up     | `W`       | `Ц`              |
| Move left   | `A`       | `Ф`              |
| Move down   | `S`       | `Ы`              |
| Move right  | `D`       | `В`              |

Each key press advances one tile, increments the step counter, and may unveil the exit (`E`). Hit all five exits per difficulty to “finish the chapter” and log your score.

## Difficulty chapters

- **Easy** – 10×10 → 14×14. Gentle corridors to learn the rhythm.
- **Medium** – 14×14 → 22×22. Dead-ends demand planning but remain readable.
- **Hard** – 22×22 → 30×30. Maze tapestries with lengthy detours and tight choke points.

Level data lives in `src/data/levels.jsx`. Add or tweak layouts by editing the `levelStructure` strings (use `P` for the spawn point and `E` for the exit). Tile styling rules are in `src/data/tiles.jsx` and `src/data/Tiles.css`.

## Dev setup

```bash
git clone <this-repo>
cd labyrinth
npm install
npm run dev
```

The game boots on Vite’s dev server (default: `http://localhost:5173`). Production builds run through `npm run build`, and `npm run preview` serves the compiled bundle locally.

## How it’s wired

- **React 19 + Vite 7** power the UI and dev workflow.
- **Custom hooks logic** inside `src/App.jsx` tracks difficulty, steps, elapsed time, and the multi-level progression.
- **`ActionLogic` component** listens to keyboard events, performs collision checks, and calls `onReachExit` when you touch `E`.
- **`StatsTable` component** memo-sorts runs by difficulty, time, or steps, offering a playful leaderboard for a solo player.

## Possible detours

- Add diagonal “sprint” tiles or teleporters for unexpected routes.
- Swap the ASCII mazes for imported `.txt` files or a generator.
- Sync stats to a backend to compete with friends.

Until then, enjoy getting lost on purpose. 🧭
