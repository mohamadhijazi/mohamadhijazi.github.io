# Vibe Coding Instructions: NorthStar Anime.js Storyboards

## Mission

Build expressive, composable Canvas animations from JSON storyboards. Keep the work easy to preview, easy to revise, and safe to record with narration.

## Source of truth

- `storyboard.json` is the default demo.
- `app.js` owns timing, Canvas drawing, Anime.js sampling, narration, and recording.
- `anime.umd.min.js` is the pinned local Anime.js runtime.
- `SKILL.md` is the JSON authoring contract.

## Animation architecture

Use Anime.js as a deterministic numeric animation engine. Do not animate DOM elements when the final result is drawn on Canvas. Every animated target must have a stable `id`, and the renderer must sample its Anime.js state from the scene-local time before drawing.

The frame path must remain:

```text
video time -> render(t) -> Anime.js seek(local milliseconds) -> Canvas draw -> captureStream()
```

The browser animation clock must never be the source of truth for export. `requestAnimationFrame` may drive preview playback, but `render(t)` must be able to render any frame directly for seeking, restart, and recording.

## JSON authoring rules

- Prefer `composition` scenes for new work.
- Give every animated element or decoration a stable lowercase `id`.
- Put reusable motion in `scene.animation.tracks`.
- Use `target` to reference an element or decoration ID.
- Animate numeric properties such as `x`, `y`, `scale`, `rotate`, and `opacity`.
- Use Anime.js v4 easing names or valid v4 easing expressions.
- Use short tracks with explicit `duration` and `delay` values.
- Use staggered delays for stars, particles, planets, and text groups.
- Keep all critical text inside the 1920 by 1080 safe area.
- Make narration describe only facts supplied or explicitly requested by the user.
- Keep the complete scene timeline gap-free and exactly equal to `video.duration`.

Example:

```json
{
  "animation": {
    "tracks": [
      {
        "target": "planet",
        "properties": {
          "x": [520, 960],
          "y": [620, 500],
          "scale": [0.2, 1],
          "opacity": [0, 1]
        },
        "delay": 100,
        "duration": 1400,
        "ease": "out(4)"
      }
    ]
  }
}
```

## Vibe coding workflow

1. Read the nearby renderer and skill contract before editing.
2. Make the smallest change that supports the requested visual behavior.
3. Keep built-in animations working while adding Anime.js tracks.
4. Validate JSON syntax and renderer compatibility before visual polish.
5. Run the local server and inspect the actual Canvas in Edge or Chrome.
6. Test play, pause, restart, JSON loading, narration, and video export.
7. Update `SKILL.md` whenever the JSON contract changes.

## Export requirements

The recording path must start from time zero, keep the tab visible, and use the existing Canvas capture plus narrator workflow. Anime.js tracks must be seekable and deterministic so the recorded result matches the preview. If a browser cannot produce MP4, allow the existing WEBM fallback.

## Avoid

- Do not add unsupported scene or element types without updating validation and documentation.
- Do not use raw SVG markup in storyboard JSON.
- Do not use a separate Anime.js playback loop beside `tick()`.
- Do not create random animation values per frame.
- Do not alter factual narration while improving visuals.
- Do not replace the local Anime.js bundle with a remote CDN dependency.
