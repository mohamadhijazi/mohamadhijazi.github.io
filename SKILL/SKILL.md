---
name: northstar-storyboard-json-generator
description: Generate renderer-compatible storyboard JSON from user-provided factual content for the NorthStar HTML Canvas video application. Use when a user supplies facts and asks for a video storyboard, animated infographic plan, narration timeline, multiplication-style explainer, or JSON that must work with the NorthStar app.js renderer.
---

# NorthStar Storyboard JSON Generator

## Purpose

Transform facts supplied by the user into one valid `storyboard.json` document that is directly compatible with the NorthStar generic `app.js` Canvas renderer.

The user is the source of factual content. The model acts only as a storyboard director, narration editor, and visual planner.

## Non-negotiable rules

1. Use only facts supplied by the user.
2. Do not invent, extend, correct, validate, or supplement facts unless the user explicitly asks for that work and supplies an approved source.
3. Preserve all quantities, units, formulas, qualifications, and causal statements exactly in meaning.
4. Rewrite only for concise narration and on-screen readability.
5. Output valid JSON only when the user asks for storyboard JSON. Do not wrap JSON in Markdown fences.
6. Never output JavaScript, HTML, CSS, SVG markup, comments, trailing commas, `NaN`, or `undefined` inside the JSON.
7. Use only supported scene types, transitions, visual kinds, animations, and properties documented below.
8. Ensure the final scene timeline exactly fills `video.duration` without gaps or overlaps.
9. Give every scene a unique, stable `id` using lowercase letters, digits, and hyphens.
10. Keep all critical text inside the safe visual area. Prefer x coordinates from 280 to 1640 and y coordinates from 150 to 900 for a 1920 by 1080 video.

## Input interpretation

Extract these values from the request when available:

- Topic
- Facts
- Audience
- Desired duration
- Language
- Preferred style or theme
- Required dimensions and frame rate

Use these defaults when values are absent:

- Audience: general audience age 12 and above
- Duration: 60 seconds
- Language: `en-US`
- Width: `1920`
- Height: `1080`
- Frame rate: `60`
- Background: `#061426`
- Style: clear educational infographic

If facts are not provided, do not fabricate a storyboard. Return a concise request for factual content instead of JSON.

## Required root structure

The root object must contain exactly these main sections:

```json
{
  "video": {},
  "theme": {},
  "assets": {},
  "scenes": []
}
```

### Video object

```json
{
  "title": "Clear video title",
  "width": 1920,
  "height": 1080,
  "fps": 60,
  "duration": 60,
  "background": "#061426",
  "language": "en-US"
}
```

Rules:

- `duration` is measured in seconds.
- All scene timing must fit within this duration.
- Use `ar-SA` for Arabic and `en-US` for English unless the user specifies another locale.

### Theme object

Use this compatible default unless the user requests another palette:

```json
{
  "primary": "#38BDF8",
  "secondary": "#FBBF24",
  "accent": "#A78BFA",
  "text": "#F8FAFC",
  "muted": "#A7B4C7",
  "panel": "#10243F",
  "font": "Segoe UI",
  "iconFont": "Segoe UI Symbol",
  "emojiFont": "Segoe UI Emoji"
}
```

All colors must be valid CSS color strings. Prefer hexadecimal colors.

## Supported scene types

Use only these scene `type` values:

- `title`
- `equation`
- `groups`
- `array`
- `numberLine`
- `summary`

Do not create unsupported scene types.

### Common scene properties

Every scene must contain:

```json
{
  "id": "unique-scene-id",
  "start": 0,
  "duration": 7,
  "type": "title",
  "title": "Scene heading",
  "narration": "Narration spoken when the scene starts.",
  "transition": "fade",
  "decorations": []
}
```

Supported transitions:

- `fade`
- `slideUp`
- `slideLeft`
- `fadeZoom`

### Title scene

Required or useful fields:

```json
{
  "type": "title",
  "title": "Main concept",
  "subtitle": "Short explanatory promise"
}
```

Use one title scene at the beginning. Keep the title under 7 words and subtitle under 14 words.

### Equation scene

```json
{
  "type": "equation",
  "title": "Repeated addition",
  "equation": "4 + 4 + 4 = 12",
  "caption": "Three equal groups, with four in each group"
}
```

Use for formulas, symbolic relationships, concise definitions, or numeric examples. Do not alter the user's numbers or operators.

### Groups scene

```json
{
  "type": "groups",
  "title": "3 groups of 4",
  "groups": 3,
  "itemsPerGroup": 4,
  "item": {
    "kind": "emoji",
    "value": "⭐",
    "size": 72,
    "animation": "pop"
  },
  "label": "3 × 4 = 12"
}
```

Use only for equal-group concepts. Keep `groups` and `itemsPerGroup` as positive integers. For the current renderer layout, prefer 2 to 4 groups and 1 to 6 items per group.

### Array scene

```json
{
  "type": "array",
  "title": "The array model",
  "rows": 3,
  "columns": 4,
  "cell": {
    "kind": "fontIcon",
    "value": "●",
    "size": 82,
    "color": "#38BDF8",
    "alternateColor": "#A78BFA",
    "animation": "pop"
  },
  "label": "3 rows × 4 columns = 12"
}
```

Use positive integer rows and columns. Prefer values from 2 to 8 for visual clarity.

### Number-line scene

The exact supported type value is case-sensitive: `numberLine`.

```json
{
  "type": "numberLine",
  "title": "Three equal jumps of four",
  "from": 0,
  "step": 4,
  "jumps": 3,
  "jumper": {
    "kind": "emoji",
    "value": "🐇",
    "size": 74,
    "animation": "hop"
  },
  "label": "0 → 4 → 8 → 12"
}
```

Use for increments, sequences, repeated steps, progress, or movement along a scale.

### Summary scene

```json
{
  "type": "summary",
  "title": "One fact, three visual models",
  "bullets": [
    {
      "icon": {
        "kind": "fontIcon",
        "value": "＋",
        "color": "#38BDF8"
      },
      "text": "Repeated addition: 4 + 4 + 4"
    }
  ],
  "highlight": "3 × 4 = 12"
}
```

Use one summary scene at the end. Use no more than 3 bullets because the current renderer is optimized for three summary rows.

## Visual objects

Visual objects may be used in `decorations`, `item`, `cell`, `jumper`, and summary bullet `icon` fields.

Supported visual kinds:

- `emoji`
- `fontIcon`
- `svg`

### Emoji object

```json
{
  "kind": "emoji",
  "value": "⭐",
  "x": 960,
  "y": 400,
  "size": 90,
  "animation": "bounce",
  "delay": 0.1
}
```

Use standard Unicode emoji. Choose simple, widely supported emoji. Emoji appearance can vary by operating system.

### Font icon object

`fontIcon` means a Unicode symbol rendered through `Segoe UI Symbol`. It does not use Font Awesome or an external library.

```json
{
  "kind": "fontIcon",
  "value": "＋",
  "x": 960,
  "y": 400,
  "size": 90,
  "color": "#38BDF8",
  "animation": "pulse"
}
```

Prefer reliable symbols such as:

- `＋`
- `−`
- `×`
- `÷`
- `=`
- `→`
- `✓`
- `●`
- `▲`
- `■`
- `★`

### SVG object

An SVG visual references an asset declared in the root `assets` object.

```json
{
  "kind": "svg",
  "asset": "gridSvg",
  "x": 960,
  "y": 400,
  "width": 160,
  "height": 160,
  "animation": "spinIn"
}
```

Do not place raw `<svg>` markup in JSON. Define Canvas-compatible SVG path information in `assets`.

## SVG asset format

```json
{
  "assets": {
    "gridSvg": {
      "viewBox": "0 0 120 120",
      "paths": [
        {
          "d": "M10 10 H110 V110 H10 Z",
          "stroke": "#A78BFA",
          "strokeWidth": 7,
          "fill": "none",
          "lineJoin": "round",
          "lineCap": "round",
          "opacity": 1
        }
      ]
    }
  }
}
```

Each path may use:

- `d`
- `stroke`
- `strokeWidth`
- `fill`
- `lineJoin`
- `lineCap`
- `opacity`

Only provide path syntax supported by browser `Path2D`. Keep SVG assets simple and self-contained. Do not use external files, URLs, CSS classes, masks, filters, scripts, text elements, or embedded raster images.

Remove unused assets from the final JSON.

## Supported animations

Use only these exact animation names:

- `fade`
- `pulse`
- `bounce`
- `hop`
- `float`
- `pop`
- `spinIn`
- `slideLoop`
- `draw`

Notes:

- `fade`: safe default.
- `pulse`: ideal for emphasis.
- `bounce`: ideal for countable objects.
- `hop`: ideal for a number-line jumper.
- `float`: subtle decoration.
- `pop`: useful for sequential items.
- `spinIn`: useful for SVG or symbol entry.
- `slideLoop`: useful for arrows.
- `draw`: supported as an animated entry for SVG decorations.
- `delay` should normally be between `0` and `0.75`.

Do not use `wave` as an animation name because the current generic visual transform does not implement a separate `wave` branch.

## Timeline construction

1. Set the first scene `start` to `0`.
2. For each next scene, calculate:

   `next.start = previous.start + previous.duration`

3. Set positive durations, normally 6 to 12 seconds per scene.
4. Ensure the last scene ends exactly at `video.duration`.
5. Never create overlapping scenes.
6. Never leave blank timeline gaps.
7. For a 60-second video, prefer 6 scenes with a structure similar to:

   - 0 to 7: title
   - 7 to 17: first explanation
   - 17 to 28: first visual model
   - 28 to 39: second visual model
   - 39 to 49: progression or comparison
   - 49 to 60: summary

## Narration rules

- Every scene should have one `narration` string.
- Narration must describe only the fact visible in that scene.
- Narration should sound natural when spoken by browser `speechSynthesis`.
- Avoid Markdown, lists, abbreviations that a voice may pronounce incorrectly, and excessively long sentences.
- Spell operators naturally in narration, for example, say “three times four” rather than “three x four.”
- On-screen equations may continue to use mathematical symbols.
- Target approximately 2 to 2.5 spoken words per second.
- Keep narration comfortably shorter than scene duration to prevent overlap.
- Do not repeat the complete fact in every scene.

## Content planning process

Follow this sequence internally before returning JSON:

1. Extract atomic facts without changing meaning.
2. Order facts from definition to demonstration to implication.
3. Select the most appropriate supported scene type for each fact.
4. Select only visuals that reinforce meaning.
5. Write concise on-screen text.
6. Write scene narration based on the same supplied fact.
7. Assign exact contiguous timing.
8. Add minimal decorations.
9. Validate compatibility.
10. Return the final JSON only.

## Compatibility validation checklist

Before output, verify all of the following:

- JSON parses successfully.
- Root contains `video`, `theme`, `assets`, and `scenes`.
- `video.duration` is numeric and positive.
- `scenes` is a non-empty array.
- Every scene has `id`, `start`, `duration`, `type`, `title`, and `narration`.
- Every scene type is supported and is case-correct.
- Every transition is supported and is case-correct.
- Every visual kind is supported and is case-correct.
- Every animation is supported and is case-correct.
- Every referenced SVG asset exists in `assets`.
- All numeric fields are JSON numbers, not numeric strings.
- No scene overlaps another scene.
- No timeline gap exists.
- Last scene end equals `video.duration`.
- Summary has no more than 3 bullets.
- All factual claims originate from the user's input.
- No external asset URL or library dependency is present.

## Failure behavior

If the user provides contradictory facts, do not resolve the contradiction. Ask the user to identify the approved statement.

If a requested visual cannot be represented by a supported scene type, select the closest compatible scene and represent the concept through title, equation, labels, decorations, or summary bullets. Never create a new scene type unless the renderer is updated first.

If the user requests an unsupported visual asset, use a compatible emoji, Unicode symbol, or simple SVG path asset.

## Output behavior

When asked to generate the JSON:

- Return exactly one JSON object.
- Do not include an explanation before or after the JSON.
- Do not include citations in the JSON.
- Do not include comments.
- Do not mention this skill.

When asked to review an existing storyboard:

- Identify compatibility errors.
- Provide a corrected full JSON object unless the user asks only for a list of issues.
