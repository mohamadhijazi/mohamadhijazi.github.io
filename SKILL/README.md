# NorthStar Enhanced Generic JSON Renderer

The renderer is content-independent. Text, equations, values, native font icons, emoji, inline SVG path assets, positions, colors, timing, and animation names come from `storyboard.json`.

## Visual objects
```json
{"kind":"emoji","value":"⭐","x":960,"y":400,"size":90,"animation":"bounce"}
{"kind":"fontIcon","value":"＋","x":960,"y":400,"size":90,"color":"#38BDF8","animation":"pulse"}
{"kind":"svg","asset":"gridSvg","x":960,"y":400,"width":160,"height":160,"animation":"spinIn"}
```

SVG assets are declared in `assets` with a `viewBox` and reusable `paths`. This avoids external icon libraries and keeps export self-contained.

Supported object animations: `fade`, `pulse`, `bounce`, `hop`, `float`, `pop`, `spinIn`, `slideLoop`, `draw`.

Supported scenes: `title`, `equation`, `groups`, `array`, `numberLine`, `summary`.

## Run
Use `start-server.bat`, or open `index.html` and choose the JSON with **Load JSON**.

## Export video with narrator audio (100% in-browser)

1. Open the application in Microsoft Edge or Chrome using `start-server.bat`, or open `index.html` directly.
2. Select the desired system narrator voice.
3. Select your export format: **MP4 Video (.mp4)** or **WEBM Video (.webm)**.
4. Click **Export Video + Voice**.
5. In the sharing dialog, select **Entire screen** (or Screen 1).
6. Enable the checkbox **Also share system audio** (at bottom-left), then click **Share**.
7. Keep the renderer tab visible until recording completes.

The exporter combines the original sharp 1920x1080 Canvas video track with the system audio track. The exported MP4 or WEBM output includes the native `speechSynthesis` narrator voice. Video uses a high-bitrate stream and narrator audio uses a 192 kbps target bitrate.

If **Also share system audio** is not enabled, the application stops the export with a clear explanatory prompt.