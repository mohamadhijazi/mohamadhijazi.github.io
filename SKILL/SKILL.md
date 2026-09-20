---
name: northstar-storyboard-json-generator
description: Generate renderer-compatible storyboard JSON from user-provided factual content for the NorthStar HTML Canvas video application. Use when a user supplies facts and asks for a video storyboard, animated infographic plan, narration timeline, technical explainer, industrial process visualization, or JSON that must work with the NorthStar app.js renderer.
---

# NorthStar Storyboard JSON Generator: Composable UI Design System

## Purpose

Transform facts supplied by the user into a valid `storyboard.json` document directly compatible with the NorthStar generic `app.js` Canvas video engine.

The user is the source of factual content. The model acts as a **video director, UI/visual designer, technical animator, and narration writer**.

---

## The Composable UI Mental Model: Atomic Visual Assembly

Do not view the NorthStar renderer as a static list of fixed templates. Instead, treat the 1920×1080 canvas as a **modular design canvas** where basic primitives combine, stack, and choreograph to produce **any conceivable user interface, scientific apparatus, industrial machine, process diagram, or data dashboard**.

```text
                     ┌──────────────────────────────────────────────┐
                     │           COMPOSITION SCENE (1920x1080)      │
                     │                                              │
                     │   ┌──────────────────────────────────────┐   │
                     │   │   Atmospheric Layer (z: 0)           │   │
                     │   │   - Backdrop panels, ambient glow    │   │
                     │   │   - Procedural particle fields       │   │
                     │   └──────────────────┬───────────────────┘   │
                     │                      ▼                       │
                     │   ┌──────────────────────────────────────┐   │
                     │   │   Conduit & Topology Layer (z: 10)   │   │
                     │   │   - Industrial pipelines & fluid     │   │
                     │   │   - Connectors & flow vectors        │   │
                     │   └──────────────────┬───────────────────┘   │
                     │                      ▼                       │
                     │   ┌──────────────────────────────────────┐   │
                     │   │   Physical / Focal Apparatus (z: 20) │   │
                     │   │   - Custom vector shapes & columns   │   │
                     │   │   - Machine hulls, SVG assets        │   │
                     │   └──────────────────┬───────────────────┘   │
                     │                      ▼                       │
                     │   ┌──────────────────────────────────────┐   │
                     │   │   Telemetry & Interface (z: 30)      │   │
                     │   │   - Radial gauges & live counters    │   │
                     │   │   - KPI cards, badges, pill tags     │   │
                     │   │   - Comparative yield charts         │   │
                     │   └──────────────────┬───────────────────┘   │
                     │                      ▼                       │
                     │   ┌──────────────────────────────────────┐   │
                     │   │   Annotation & Guidance (z: 40)      │   │
                     │   │   - Elbow callouts, leader lines     │   │
                     │   │   - Target anchor dots & formulas    │   │
                     │   └──────────────────────────────────────┘   │
                     │                                              │
                     │   CHOREOGRAPHED VIA ANIME.JS REACTIVE BUS   │
                     └──────────────────────────────────────────────┘
```

By layering and combining primitives, you can construct:
- **Industrial Process Plants**: (Pipelines + Furnaces + Distillation Columns + Flow Pulses + Pressure Dials)
- **Sci-Fi & Engineering HUDs**: (Glassmorphic Panels + Circular Radar/Gauges + Telemetry Counters + Warning Pills)
- **Multi-Stage Stepper Pipelines**: (Horizontal Conduits + Numbered Step Nodes + Animated Fluid + Detail Cards)
- **Chemical & Molecular Reactions**: (Custom Vector Molecules + Catalyst Particle Beds + Chemical Equations + Energy Callouts)
- **Comparative Tradeoff Matrices**: (Split Panels + Diverging Bar Charts + Opposing KPI Cards + Status Badges)

---

## Non-negotiable Rules

1. **Facts First**: Use only facts supplied by the user. Do not invent facts or alter quantities, units, formulas, or causal relationships.
2. **Contiguous Timeline**: The timeline must be 100% gap-free and overlap-free. `sum(scene.duration) === video.duration`, and `next.start = prev.start + prev.duration`.
3. **Valid JSON Only**: Return strictly valid JSON. Never output JavaScript, HTML, CSS, comments, trailing commas, or Markdown fences inside JSON.
4. **Stable IDs**: Every scene, element, decoration, and animated target must have a unique lowercase alphanumeric ID (e.g. `"feed-pipe"`, `"temp-gauge"`).
5. **Safe Visual Coordinates**: All critical text and focal objects must sit within the 1920×1080 safe area:
   - X: `280` to `1640`
   - Y: `150` to `900`
6. **Single Master Clock**: Never write custom playback loops. Anime.js seeks deterministically from `scene-local milliseconds`:
   `render(t) -> animeState(ms) -> Canvas Draw -> MediaRecorder Stream`

---

## Root Structure

```json
{
  "video": {
    "title": "Descriptive Video Title",
    "width": 1920,
    "height": 1080,
    "fps": 60,
    "duration": 72,
    "background": "#070e1b",
    "language": "en-US"
  },
  "theme": {
    "primary": "#38BDF8",
    "secondary": "#F59E0B",
    "accent": "#10B981",
    "text": "#F8FAFC",
    "muted": "#94A3B8",
    "panel": "#0f1c2e",
    "font": "Segoe UI",
    "iconFont": "Segoe UI Symbol",
    "emojiFont": "Segoe UI Emoji"
  },
  "assets": {},
  "scenes": []
}
```

---

## Composable Primitives Palette

Every element inside a `composition` scene's `elements` array is positioned with `x`, `y`, layered with `z`, given entrance timing with `delay`, and linked to Anime.js via `id`.

### 1. Vector Geometry & Bespoke Apparatus
- **`shape` / `path`**: Draw **any vector geometry directly** using SVG `d` path syntax without declaring global assets:
  ```json
  {"type": "shape", "id": "valve", "x": 600, "y": 500, "d": "M-20 -20 L20 20 L20 -20 L-20 20 Z", "fill": "#F59E0B", "stroke": "#FFFFFF", "strokeWidth": 3}
  ```
- **`visual`**: Render declared SVG assets from `assets`, Unicode font symbols (`Segoe UI Symbol`), or standard emojis:
  ```json
  {"type": "visual", "id": "atom", "kind": "svg", "asset": "moleculeChain", "x": 960, "y": 540, "width": 240, "height": 140}
  ```
- **`column` / `vessel`**: Industrial distillation columns, cylindrical reactors, or fluid tanks with thermal gradient coloring, liquid pool waves, bubble-cap trays, and rising vapor:
  ```json
  {"type": "column", "id": "tower", "x": 680, "y": 560, "width": 280, "height": 680, "trays": 6, "activeTray": 1, "level": 0.3, "trayLabels": ["Gas (<20°C)", "Petrol (20-70°C)", "Naphtha (70-120°C)", "Kerosene (120-170°C)", "Diesel (170-270°C)", "Residue (>350°C)"]}
  ```

### 2. Conduits, Flows & Topology
- **`pipeline`**: Multi-point industrial pipes with outer casings, inner fluid cores, animated traveling flow pulses, joint flanges, and directional arrowheads:
  ```json
  {"type": "pipeline", "id": "crude-feed", "x": 500, "y": 650, "width": 24, "fluidColor": "#F59E0B", "pulseColor": "#FDE047", "points": [[-200, 0], [0, 0], [0, -120], [200, -120]], "arrow": true, "speed": 1.5, "label": "Feedstock (370°C)"}
  ```
- **`connector` / `arrow`**: 2-point straight or curved Bezier flow lines with traveling signal pulses and arrowheads:
  ```json
  {"type": "connector", "id": "flow-link", "x": 960, "y": 500, "from": [-150, 0], "to": [150, 0], "curve": -40, "color": "#38BDF8", "arrow": true}
  ```

### 3. Telemetry, Gauges & Data Displays
- **`gauge`**: Radial dials or vertical linear meters with needle pointers, colored arcs, tick marks, and animated digital counter readouts:
  ```json
  {"type": "gauge", "id": "pressure-gauge", "x": 1420, "y": 540, "style": "radial", "title": "SYSTEM PRESSURE", "min": 0, "max": 100, "value": 0, "unit": " bar", "color": "#10B981", "radius": 95}
  ```
- **`card` / `stat`**: Glassmorphic KPI cards with animated numeric counters, titles, units, subtitles, and status pill badges:
  ```json
  {"type": "card", "id": "yield-kpi", "x": 1400, "y": 420, "width": 420, "height": 210, "title": "BARREL REFINING YIELD", "value": 88, "unit": "%", "badge": "High Octane", "subtitle": "Optimal secondary conversion output.", "color": "#F59E0B"}
  ```
- **`chart` / `barChart`**: Comparative bar charts with animated progress growth, category labels, values, and custom colors:
  ```json
  {"type": "chart", "id": "fraction-chart", "x": 720, "y": 560, "width": 780, "height": 420, "title": "PRODUCT BREAKDOWN", "unit": "%", "data": [{"label": "Gasoline", "value": 44, "color": "#FBBF24"}, {"label": "Diesel", "value": 26, "color": "#10B981"}]}
  ```
- **`badge` / `pill`**: Standalone status pill tags with glowing borders:
  ```json
  {"type": "badge", "id": "status-tag", "x": 960, "y": 280, "text": "OPTIMAL REACTION", "color": "#10B981", "size": 20}
  ```

### 4. Typography, Formulas & Enclosures
- **`text`**: Headings, metadata, or standalone dynamic numeric counters with prefix/suffix/precision formatting:
  ```json
  {"type": "text", "id": "temp-counter", "x": 960, "y": 300, "value": 20, "suffix": " °C", "size": 72, "weight": "800", "color": "#EF4444"}
  ```
- **`equation`**: Chemical formulas or mathematical equations with glowing emphasis:
  ```json
  {"type": "equation", "id": "cracking-formula", "x": 1280, "y": 340, "content": "C₁₆H₃₄  →  C₈H₁₈  +  C₈H₁₆", "size": 52, "color": "#FBBF24"}
  ```
- **`panel`**: Glassmorphic backdrops, framed enclosures, cards, and sub-windows with rounded borders:
  ```json
  {"type": "panel", "id": "main-frame", "x": 960, "y": 540, "width": 1580, "height": 720, "radius": 36, "color": "#0f1c2e", "border": "#38BDF844"}
  ```

### 5. Atmospheric Particles & Precision Annotations
- **`particles`**: Procedural animated particle emitters (flame, steam/vapor, reaction bubbles, sparks):
  ```json
  {"type": "particles", "id": "reactor-bubbles", "x": 640, "y": 580, "particleType": "bubbles", "count": 32, "color": "#FBBF24", "speed": 1.6}
  ```
- **`callout`**: Technical leader lines with anchor points, elbow joints, titles, and detail cards:
  ```json
  {"type": "callout", "id": "tray-callout", "x": 1360, "y": 420, "from": [-240, 0], "to": [80, -30], "title": "Condensation Zone", "detail": "Vapors condense as temperature drops below boiling threshold.", "color": "#38BDF8"}
  ```

---

## 5 Composable UI Archetypes (Layout Blueprints)

Use these 5 proven layout archetypes to compose any video scene:

### Archetype 1: Hero Centerpiece + Flanking KPI Wings
Ideal for machinery, chemical reactors, anatomical organs, or central engines:
- **Left Wing (X: ~450)**: Input cards, inflow feedstock pipelines (`[[-200, 0], [150, 0]]`), supply stats.
- **Center Hero (X: 960)**: Core vessel, custom SVG machine, or column (`column`, `shape`, `visual`, `particles`).
- **Right Wing (X: ~1450)**: Telemetry instrumentation, output pipelines, temperature/pressure gauges, yield cards.

### Archetype 2: Multi-Stage Horizontal Stepper / Flow Pipeline
Ideal for multi-step workflows, supply chains, refinery cuts, or sequential transformations:
- **Spine**: Long continuous pipeline across the lower third (`points: [[-650, 0], [650, 0]]`).
- **Nodes**: 3 to 4 sequential stage panels at `X: 450, 800, 1150, 1500`.
- **Badges**: Numbered pill tags (`"STEP 01"`, `"STEP 02"`, ...) atop each node.
- **Choreography**: Anime.js staggered flow pulses illuminating each node as the signal passes.

### Archetype 3: Sci-Fi / Technical Command HUD & Telemetry Console
Ideal for aerospace, medical diagnostics, energy grids, and high-tech instrumentation:
- **Top Header**: Title + status pill (`badge: "SYSTEM NOMINAL"`).
- **Upper Center**: Central radar sweep or circular gauge (`gauge` dial, `r: 120`).
- **Lower Split**: Left live multi-bar chart (`chart`), right digital counter readout (`text` with live `value: [0, 1000]`).
- **Overlay**: Subtle ambient particle field (`particles: "dots"`).

### Archetype 4: Chemical & Molecular Reaction Chamber
Ideal for chemistry, materials science, pharmacology, and physics:
- **Top Center**: Balanced chemical transformation equation (`equation`).
- **Center Left**: Reaction vessel with catalyst fluidized bed (`column` + `particles: "bubbles"`).
- **Center Right**: Molecular bond cleavage visual (`visual: "moleculeChain"` + `callout`).
- **Bottom Right**: Reaction conversion efficiency gauge (`gauge: "%"`).

### Archetype 5: Split-Screen Comparative Tradeoff Matrix
Ideal for Before/After, Baseline vs Upgraded, Conventional vs Renewable, or A/B benchmarks:
- **Left Column (X: 580)**: Enclosure panel, baseline metrics card, red/muted accents.
- **Right Column (X: 1340)**: Enclosure panel, optimized metrics card, green/gold accents.
- **Center Divider (X: 960)**: `connector` vertical division or `equation` ratio comparison.
- **Bottom**: Comparative bar chart or delta gauge.

---

## Composable Component Recipes

Combine multiple primitives into cohesive assemblies using these production recipes:

### Recipe A: Industrial Reaction Vessel with Inflow, Outflow, Burner & Gauge

```json
{
  "type": "composition",
  "id": "scene-reactor",
  "elements": [
    {"type": "panel", "id": "bg-frame", "x": 960, "y": 540, "width": 1580, "height": 720, "radius": 36},
    {"type": "text", "id": "heading", "x": 960, "y": 190, "content": "Thermal Hydrocracking Chamber", "size": 64, "weight": "800"},
    {"type": "pipeline", "id": "pipe-in", "x": 420, "y": 680, "width": 24, "fluidColor": "#F59E0B", "points": [[-150, 0], [140, 0]], "arrow": true, "label": "Feed: 370°C"},
    {"type": "column", "id": "reactor-tank", "x": 800, "y": 570, "width": 260, "height": 640, "trays": 4, "activeTray": 1, "level": 0.3},
    {"type": "particles", "id": "reactor-fire", "x": 800, "y": 740, "particleType": "flame", "count": 30, "width": 200, "height": 140, "speed": 1.5},
    {"type": "pipeline", "id": "pipe-out", "x": 1100, "y": 420, "width": 20, "fluidColor": "#38BDF8", "points": [[0, 0], [180, 0]], "arrow": true, "label": "Light Gas Cut"},
    {"type": "gauge", "id": "temp-dial", "x": 1450, "y": 550, "title": "CORE TEMPERATURE", "min": 20, "max": 500, "value": 20, "unit": "°C", "color": "#EF4444"},
    {"type": "callout", "id": "catalyst-note", "x": 1360, "y": 750, "from": [-320, 0], "to": [60, 20], "title": "Zeolite Catalyst Bed", "detail": "Porous aluminosilicate structures split heavy carbon bonds.", "color": "#A78BFA"}
  ],
  "animation": {
    "tracks": [
      {"target": "reactor-tank", "properties": {"scale": [0.8, 1], "level": [0, 0.3], "opacity": [0, 1]}, "duration": 1200, "ease": "out(4)"},
      {"target": "pipe-in", "properties": {"flow": [0, 400], "opacity": [0, 1]}, "delay": 300, "duration": 8000, "ease": "linear"},
      {"target": "temp-dial", "properties": {"value": [20, 480], "scale": [0.6, 1], "opacity": [0, 1]}, "delay": 600, "duration": 4000, "ease": "out(3)"},
      {"target": "pipe-out", "properties": {"flow": [0, 400], "opacity": [0, 1]}, "delay": 2000, "duration": 8000, "ease": "linear"},
      {"target": "catalyst-note", "properties": {"x": [1500, 1360], "opacity": [0, 1]}, "delay": 2500, "duration": 1000, "ease": "out(3)"}
    ]
  }
}
```

### Recipe B: Multi-Stage Process Stepper

```json
{
  "type": "composition",
  "id": "scene-stepper",
  "elements": [
    {"type": "panel", "id": "stage-bg", "x": 960, "y": 540, "width": 1580, "height": 720, "radius": 36},
    {"type": "text", "id": "stage-title", "x": 960, "y": 200, "content": "The Refining Journey: 3 Critical Phases", "size": 60, "weight": "800"},
    {"type": "pipeline", "id": "main-spine", "x": 960, "y": 540, "width": 20, "fluidColor": "#38BDF8", "points": [[-550, 0], [550, 0]], "joints": true},
    {"type": "card", "id": "step-1", "x": 520, "y": 660, "width": 360, "height": 180, "title": "PHASE 01: SEPARATION", "value": "Atmospheric Distillation", "badge": "Primary", "subtitle": "Physical separation by boiling points.", "color": "#F59E0B"},
    {"type": "card", "id": "step-2", "x": 960, "y": 420, "width": 360, "height": 180, "title": "PHASE 02: CONVERSION", "value": "Catalytic Cracking", "badge": "Upgrade", "subtitle": "Splitting heavy molecules into gasoline.", "color": "#10B981"},
    {"type": "card", "id": "step-3", "x": 1400, "y": 660, "width": 360, "height": 180, "title": "PHASE 03: PURIFICATION", "value": "Hydrotreating", "badge": "Clean Fuel", "subtitle": "Sulfur removal to meet emissions standards.", "color": "#38BDF8"}
  ],
  "animation": {
    "tracks": [
      {"target": "main-spine", "properties": {"flow": [0, 600], "opacity": [0, 1]}, "duration": 8000, "ease": "linear"},
      {"targets": ["step-1", "step-2", "step-3"], "properties": {"scale": [0.75, 1], "opacity": [0, 1]}, "stagger": 400, "delay": 400, "duration": 1000, "ease": "out(4)"}
    ]
  }
}
```

---

## Anime.js v4 Universal Reactive Bus

In the NorthStar engine, **Anime.js is not just for moving boxes—it is the reactive state engine for the entire canvas**:

| Animated Property | Effect on Canvas | Used By |
| :--- | :--- | :--- |
| `value` | Dynamically counts numbers from start to target | `gauge`, `card`, `text` |
| `progress` | Expands bar lengths or circular fill ratios (0 to 1) | `chart`, `particles`, `connector` |
| `flow` | Offsets dashed fluid traveling pulses along pipes | `pipeline` |
| `level` | Raises liquid volumes with animated waves (0 to 1) | `column`, `vessel` |
| `intensity` | Modulates particle density and speed | `particles` |
| `scaleX`, `scaleY` | Stretches or squashes objects along a single axis | `shape`, `visual`, `panel` |
| `width`, `height` | Smoothly reshapes containers and bounding boxes | `panel`, `card` |
| `x`, `y` | Repositions elements across the canvas | All elements |
| `rotate` | Spins needles, gears, or molecular models in degrees | All elements |
| `opacity` | Fades elements in and out cleanly | All elements |

### Multi-Target Staggering

Coordinate multiple elements with cascading timings in a single track block:

```json
{
  "targets": ["pipe-gas", "pipe-petrol", "pipe-naphtha", "pipe-kero", "pipe-diesel"],
  "properties": {
    "flow": [0, 500],
    "opacity": [0, 1]
  },
  "stagger": 150,
  "delay": 400,
  "duration": 8000,
  "ease": "linear"
}
```

---

## Narration & Speech Synthesis Rules

- Target 2 to 2.5 spoken words per second.
- Narration must comfortably finish before the scene duration expires.
- Spell technical terms and formulas phonetically for clear Web Speech Synthesis:
  - Say `"three hundred and seventy degrees Celsius"` instead of `"370°C"`.
  - Say `"carbon sixteen hydrogen thirty-four"` instead of `"C16H34"`.
  - Say `"one hundred and two million barrels per day"` instead of `"102 M bpd"`.
- Never include Markdown fences, asterisks, bullet points, or emojis inside `narration`.

---

## Compatibility Validation Checklist

Before finalizing storyboard JSON, verify:

1. **Root Fields**: Contains `video`, `theme`, `assets`, and `scenes`.
2. **Contiguous Timeline**: No gaps, no overlaps, and `sum(scene.duration) === video.duration`.
3. **All IDs Unique**: Every element and decoration has a lowercase ID (letters, numbers, hyphens).
4. **Valid Target References**: Every `target` or `targets` ID exists in that scene.
5. **Numeric Track Values**: Track properties are numbers or arrays of numbers (e.g. `[0, 100]`).
6. **Safe Area**: All visual anchors sit within `x: 280-1640`, `y: 150-900`.
7. **Zero Remote Dependencies**: No external URLs, images, or CDNs.
