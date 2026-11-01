# Stickman Documentary Starter

Make simple animated stickman videos with code. This starter kit gives you a stickman you can dress and pose, a few room pieces,
a camera you can move, captions, optional narration, and three example videos that you can render to MP4.

You don't need to be an animation expert. If you can read basic JavaScript, you can change the examples and build your own.

The kit runs on your own computer. It needs no account and no API key.

**Educational purpose.** This repository is for learning. It shows how a stickman animation can be built from code, using a small,
simplified set of parts. **It is not the complete production engine** behind any film. It has no full documentary, no advanced
transition system and no automatic caption placement. Use it as a starting point, and build your own scenes from there.

## What you can build

- A stickman that stands, walks, sits and types.
- Different clothes and colours for each character.
- A simple room with a floor, wall, desk, chair, monitor and whiteboard.
- Camera moves: pan, zoom, follow a character, and push in on an object.
- A short film made of several scenes.
- Your own MP3 narration, with timed captions on top.
- An MP4 video file.

## Technology used

- **[Remotion](https://www.remotion.dev)** renders video from code. Each frame is drawn by a React component.
- **React** describes what is on the screen.
- **TypeScript** is JavaScript with type checking. It catches many mistakes before you render.
- **SVG** draws the shapes: every stickman part and every room piece is a flat vector shape.

## Before you start

- **Node.js 22 or newer.** The kit was tested with Node 24. Check your version with `node -v`. Install it from
  [nodejs.org](https://nodejs.org) if you don't have it.
- **A terminal:** Windows PowerShell, Git Bash, the macOS Terminal, or a Linux shell.
- **An internet connection** for the first install, and for loading the Inter font when you render.

## Install

Open a terminal in the project folder and run:

```bash
npm install
```

This takes about a minute. It installs the exact versions the kit was tested with.

Check that everything compiles:

```bash
npm run typecheck
```

If it finishes without printing any errors, you're ready.

## Preview and render

| What you want | Command |
|---|---|
| Open the live preview in your browser | `npm run studio` |
| List the available videos | `npx remotion compositions src/index.ts` |
| Save one still image (one frame) | `npm run still -- Example02-OfficeScene out/check.png --frame=300` |
| Render a full MP4 | `npm run render -- Example01-WalkingStickman out/example01.mp4` |

`npm run studio` starts a server at `http://localhost:3000`. Open that address, then pick a video from the list on the left.
Save a file and the preview updates by itself.

The `out/` folder is created automatically when you render.

## Available examples

| Name | Length | What it shows |
|---|---|---|
| `Example01-WalkingStickman` | 5 seconds | A stickman walks across a room, and the camera follows. |
| `Example02-OfficeScene` | 12 seconds | A stickman walks to a desk, sits, types, and the camera pushes in on the monitor. |
| `Example03-MiniDocumentary` | 11 seconds | Three scenes: an introduction, a character pointing at a board, and a step-by-step diagram. It has captions and accepts narration. |

## Make a character

Open `src/scenes/Example01WalkingStickman.tsx`. The character is one `Stickman` component:

```tsx
<Stickman x={x} y={FLOOR} scale={1.5} facing={1} pose={pose} look={CASUAL} />
```

- `x` and `y` set where the character is. `y={FLOOR}` puts it on the floor.
- `scale` sets its size. `facing={-1}` turns it to face left.
- `look` sets its clothes. The presets are `CASUAL`, `SHIRT_ORANGE` and `JACKET_BLUE` in `src/rig/looks.tsx`.

To make a new outfit, copy a preset and change the colours:

```tsx
const TEACHER: Look = {...CASUAL, top: "#6B3E2E", coat: "#2A2D33"};
```

The full list of options is in [docs/CHARACTER_GUIDE.md](docs/CHARACTER_GUIDE.md).

## Basic animation

A pose says how the body is bent. You choose one each frame:

- `idle(t)`: standing, breathing softly.
- `walk(phase)`: the walking legs and arms.
- `sit(t)` and `typing(t)`: seated poses, used with a chair.
- `point(base, k)`: one arm points.
- `cheer(t)`: both arms up.

`t` is the time in seconds. A scene gets the current frame with `useCurrentFrame()`, and `frame / 30` gives the time.
Keep animations in code, not in drawn pictures, so you can change the timing with a number.

## Add an environment

The room pieces are in `src/environment/Furniture.tsx`: `Wall`, `Floor`, `Desk`, `Monitor`, `OfficeChair`, `Board`, `Label`, `Glow` and `Cone`.
Draw them from the back to the front, on a layer, and give each a position in pixels:

```tsx
<Layer depth={0.5}>
  <Wall x0={-1400} x1={1400} y0={-700} y1={FLOOR} />
</Layer>
<Layer depth={1}>
  <Floor x0={-1400} x1={1400} />
  <Desk x={180} w={440} top={150} />
  <Monitor x={240} y={FLOOR - 150 - 38} w={230} h={140} />
</Layer>
```

`top` is the height of the desk top above the floor. The example `Example02OfficeScene.tsx` shows a full room with a chair and a monitor.

## Camera movement

The camera is a window onto the 2D world. Give it a position and a zoom for each moment:

```tsx
const cam = keysObj(frame, [
  [0,   {x: -300, y: 100, zoom: 1,   rot: 0}],
  [300, {x: 240,  y: 200, zoom: 1.7, rot: 0}],
]);
<Camera2D cam={cam} t={t}> ... </Camera2D>
```

Each moment is a frame number. The camera moves smoothly between them. Put characters on `<Layer depth={1}>`, and
put distant walls on `<Layer depth={0.5}>` so they move more slowly and look further away.

More examples are in [docs/CAMERA_GUIDE.md](docs/CAMERA_GUIDE.md).

## Add MP3 narration (optional)

1. Put your MP3 file in the `public/audio/` folder, for example `public/audio/my-narration.mp3`.
2. Render Example 03 with the file:

```bash
npm run render -- Example03-MiniDocumentary out/mini.mp4 --props='{"narration":"audio/my-narration.mp3"}'
```

The kit includes no recording. Only use audio you have the right to use.

Scene lengths are set in frames. Match them to your narration. Details are in [docs/AUDIO_CAPTIONS.md](docs/AUDIO_CAPTIONS.md).

## Captions

A caption is a line of text with a start frame and an end frame:

```tsx
const CAPTIONS: CaptionCue[] = [
  {from: 10, to: 80, text: "Meet our stickman.", pos: "lower"},
];
<CaptionTrack cues={CAPTIONS} />
```

- `from` and `to` are frame numbers (30 frames = 1 second).
- `pos` picks a height: `top`, `upper`, `mid` or `lower`. `lower` is the default. You can also give an exact `y` in pixels.
- Use `\n` for a second line. Keep captions to two lines at most.

Check captions by saving a still at a frame where the caption is on screen.

## Project folders

```
src/
  Root.tsx           lists the videos you can preview and render
  rig/               the stickman: body, poses, clothes, sitting
  camera/            the camera
  environment/       floor, wall, desk, chair, monitor, whiteboard
  captions/          timed captions
  audio/             optional narration
  scenes/            the three examples
  styles/palette.ts  colours and size of the frame
public/audio/        your own MP3 files go here
docs/                guides
```

## Troubleshooting

**`npm install` fails.** Check `node -v`. You need Node 22 or newer. Then delete the `node_modules` folder and run `npm install` again.

**`npm run typecheck` shows an error.** Read the first line of the error. It names the file and line. A common cause is a camera
object without `rot`. Add `rot: 0` to it.

**The preview is blank, or the browser can't connect.** Check the terminal: `npm run studio` should say that the server is ready.
If port 3000 is busy, another program is using it. Close that program and run `npm run studio` again.

**The render fails with a message about a browser.** Remotion downloads a headless browser the first time. Make sure you're connected to the internet,
then run the command again.

**The captions use a plain font.** The Inter font loads from Google Fonts. Check your connection, then try again.

**The character floats above the ground or sinks into it.** Standing characters need `y={FLOOR}`. Seated characters need `anchor="hip"` and `seatedAnchor`.

**The video has no sound.** The examples are silent by design. To hear narration, follow the MP3 section above.

**A caption covers the character or an object.** Change its `pos`, or set a `y` value. Check the placement on a still.

More help: [docs/GETTING_STARTED.md](docs/GETTING_STARTED.md).

## Acknowledgments

- Built with [Remotion](https://www.remotion.dev), [React](https://react.dev) and [TypeScript](https://www.typescriptlang.org).
- The caption typeface is [Inter](https://rsms.me/inter/) by Rasmus Andersson, loaded from Google Fonts.

## Licence and third-party software

- **This kit's code:** MIT License (see [LICENSE](LICENSE)). You may use, change and share it, including commercially, with the copyright notice kept.
- **Documentation** (`README.md`, `CLAUDE.md` and `docs/`): Creative Commons Attribution 4.0 (CC BY 4.0). See [docs/LICENSE.md](docs/LICENSE.md).
- **Remotion** (the video engine) has its own licence. It is free for individuals and for organisations with up to 3 employees.
  Larger for-profit organisations need a company licence. Check [remotion.dev/license](https://www.remotion.dev/license).
- **Inter** (the caption font) is loaded from Google Fonts when you render. No font file is included.
- **No audio, pictures or logos are included.** Narration is yours to supply.
