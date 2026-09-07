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

## Export video with narrator audio

1. Open the application in Microsoft Edge using `start-server.bat`.
2. Select the desired system voice.
3. Click **Export Video + Narrator**.
4. In the Edge sharing dialog, select **This tab**.
5. Enable **Share tab audio**, then click **Share**.
6. Keep the renderer tab active until recording completes.

The exporter combines the original 1920x1080 Canvas video track with the current tab audio track. The WEBM output therefore includes the native `speechSynthesis` narrator. Video uses a 35 Mbps target bitrate and narrator audio uses a 192 kbps target bitrate.

If **Share tab audio** is not enabled, Edge does not provide an audio track and the application stops the export with an explanatory message. Native browser APIs normally export WEBM. Convert to MP4 later with FFmpeg if required.