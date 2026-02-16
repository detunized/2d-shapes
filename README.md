# Shape Explorer

An interactive web app for learning 2D geometric shapes. Built for kids, it offers
two modes: **flashcards** for browsing shapes at your own pace, and a **quiz** to
test recognition skills. Deployed on Cloudflare Pages.

## Modes

### Flashcards

Browse through a shuffled deck of shape cards. Each card shows the shape on the
front; tap or click to flip and reveal the name. When flipped, the shape name is
spoken aloud. Swipe or use arrow keys to navigate between cards.

Two difficulty levels:
- **Basic** — common shapes and regular polygons (circle, square, triangle,
  rectangle, oval, heart, semicircle, rhombus, star, crescent, pentagon through
  decagon)
- **All Shapes** — adds triangle variants (scalene, equilateral, right-angled,
  isosceles), quadrilateral variants (kite, parallelogram, trapezium), and
  irregular polygons (5 through 8 sides)

### Quiz

A 10-question multiple choice quiz. A shape is displayed and four options are
presented. Correct answers get a cheerful chime and green highlight; wrong answers
get a soft low tone, a red shake animation, and the correct answer is revealed.
After all questions, a completion fanfare plays and the score is shown with an
encouraging message.

## Shapes

28 shapes total, defined as inline SVGs in `src/shapes.js`. Each shape is a small
`200x200` SVG built from basic primitives (`circle`, `ellipse`, `polygon`, `path`).
Regular polygons (pentagon through decagon) are generated programmatically using
trigonometry. Special markers like tick marks on equilateral and isosceles triangles
indicate equal sides.

The shapes are organized into categories:
- **basic** — circle, square, triangle, rectangle, oval, heart, semicircle,
  rhombus, star, crescent
- **polygons** — pentagon, hexagon, heptagon, octagon, nonagon, decagon
- **triangles** — scalene, equilateral, right-angled, isosceles
- **more** — kite, parallelogram, trapezium, irregular quadrilateral, and
  irregular polygons (5-8 sides)

## Audio

All audio lives in `public/audio/` as static MP3 files. The playback code in
`src/sounds.js` is minimal: a shared `playAudio()` function that caches `Audio`
elements and resets `currentTime` before each play.

### Shape name voices

28 MP3 files, one per shape (e.g. `circle.mp3`, `equilateral-triangle.mp3`).
Generated using [edge-tts](https://github.com/rany2/edge-tts), a Python CLI that
accesses Microsoft Edge's neural text-to-speech service. The voice used is
**en-US-AnaNeural**, a clear, natural-sounding American English voice.

Generation command (for all 28 shapes):
```sh
edge-tts --voice en-US-AnaNeural --text "circle" --write-media circle.mp3
```

Multi-word names use hyphens in filenames (`equilateral-triangle.mp3`) and the code
converts spaces to hyphens at runtime.

### Quiz sound effects

Three short synthesized jingles, generated with ffmpeg's audio filters:

- **correct.mp3** (~0.4s) — a bright ascending two-note chime. Two sine wave pairs
  (C5 at 523 Hz and E5 at 659 Hz), each with a faint octave harmonic, staggered by
  120ms. Quick fade-in and exponential fade-out for a clean bell-like attack.

- **wrong.mp3** (~0.4s) — a soft descending tone. Two sine waves (300 Hz and
  250 Hz) staggered by 100ms with gentle fade envelopes. Low and muted to feel
  non-punishing.

- **complete.mp3** (~1.0s) — a celebratory ascending arpeggio. Four notes
  (C5-E5-G5-C6) each with octave harmonics, spaced 180ms apart. The final C6 note
  sustains longer for a triumphant finish.

Example ffmpeg command for the correct sound:
```sh
ffmpeg -f lavfi -i "sine=frequency=523:duration=0.2[s1]; \
  sine=frequency=1047:duration=0.01[h1]; \
  [s1][h1]amix=inputs=2:duration=longest, \
  afade=t=in:d=0.01,afade=t=out:st=0.1:d=0.1[a]; \
  sine=frequency=659:duration=0.25[s2]; \
  sine=frequency=1318:duration=0.01[h2]; \
  [s2][h2]amix=inputs=2:duration=longest, \
  afade=t=in:d=0.01,afade=t=out:st=0.12:d=0.13[b]; \
  [a]adelay=0|0[aa];[b]adelay=120|120[bb]; \
  [aa][bb]amix=inputs=2:duration=longest,volume=1.5" \
  -t 0.4 -b:a 128k correct.mp3
```

## Tech stack

- **Vite** — dev server and production bundler
- **Vanilla JS** — no framework, ~320 lines of plain JavaScript
- **Inline SVG** — all shapes rendered as SVG, no image assets
- **CSS** — custom properties, grid layout, CSS animations (flip, pop, shake)
- **Nunito** — Google Fonts, loaded via preconnect for fast rendering
- **Cloudflare Pages** — hosting, deployed via Wrangler CLI

## Project structure

```
index.html                  App shell, loads Vite entry point
src/
  main.js                   App logic: routing, rendering, event handling
  shapes.js                 Shape definitions (28 SVGs with metadata)
  sounds.js                 Audio playback (quiz sounds + shape names)
  style.css                 All styles, responsive breakpoints
public/
  favicon.svg               Favicon (square + triangle + circle)
  audio/
    correct.mp3             Quiz: correct answer chime
    wrong.mp3               Quiz: wrong answer tone
    complete.mp3            Quiz: completion fanfare
    circle.mp3 ...          Shape name speech (28 files)
docs/
  shape-reference.pdf       Printable 2D shape flashcards reference sheet
```

## Development

```sh
npm install
npm run dev          # start dev server at localhost:5173
npm run build        # production build to dist/
npm run preview      # preview production build locally
```

## Deployment

```sh
npm run build
npx wrangler pages deploy dist
```

## Reference material

A printable PDF with all shape flashcards is available at
[docs/shape-reference.pdf](docs/shape-reference.pdf). It can be used as a
companion to the app for offline practice or classroom use.
