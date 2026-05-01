# White Board

A frontend-only drawing app built with React, Tailwind CSS, and the HTML5 Canvas API. Draw freehand, use shape tools, undo/redo, save your work as PNG, and pick up where you left off thanks to browser storage.

## Features

- **Drawing tools:** Pen (free draw), Eraser (transparent erase), Line, Rectangle, Circle
- **Controls:** Color picker, brush size (1–40)
- **History:** Undo and Redo
- **Canvas:** Clear all strokes
- **Export:** Download the canvas as a PNG (white background in the file for consistent viewing)
- **Persistence:** Last canvas state saved in `localStorage` (reload to restore)
- **Shortcuts:** Undo / Redo from the keyboard
- **Layout:** Full-page canvas with a compact toolbar (tools on the left, actions on the right)

## Tech stack

- [React](https://react.dev/) (function components + hooks)
- [Vite](https://vitejs.dev/) + TypeScript
- [Tailwind CSS](https://tailwindcss.com/) v4 (`@tailwindcss/vite`)
- HTML5 `<canvas>` — no backend, no heavy drawing libraries

## Requirements

- [Node.js](https://nodejs.org/) (recommended: current LTS or newer)

## Getting started

Clone the repository and install dependencies:

```bash
git clone https://github.com/Manmohanjoshi357/White-Board.git
cd White-Board
npm install
```

Start the dev server:

```bash
npm start
```

Open the URL shown in the terminal (usually [http://localhost:5173](http://localhost:5173)).

## Scripts

| Command        | Description                          |
| -------------- | ------------------------------------ |
| `npm start`    | Start Vite dev server (same as dev) |
| `npm run dev`  | Start Vite dev server                |
| `npm run build`| Typecheck + production build         |
| `npm run preview` | Preview the production build locally |

## Keyboard shortcuts

| Shortcut | Action |
| -------- | ------ |
| `Ctrl` + `Z` (Windows/Linux) or `Cmd` + `Z` (macOS) | Undo |
| `Ctrl` + `Y` or `Ctrl` + `Shift` + `Z` (or `Cmd` equivalents) | Redo |

## Project structure

```
src/
  components/     # UI: Toolbar, CanvasBoard
  hooks/          # useCanvasHistory (undo/redo stacks)
  utils/          # Canvas helpers, tool types, storage key
  App.tsx         # Root layout and save/export
  main.tsx        # React entry
  index.css       # Tailwind import + base styles
```

## Notes

- **Eraser:** Uses canvas composite mode so strokes are removed (transparent), not painted white.
- **Saved PNG:** Export composites your drawing on white so previews look consistent in any image viewer.
- **localStorage key:** `whiteboard-snapshot-v1` — clear site data for this origin to reset the saved board.

## License

This project is provided as-is for learning and personal use. Add a license file if you plan to distribute or open-source it formally.
