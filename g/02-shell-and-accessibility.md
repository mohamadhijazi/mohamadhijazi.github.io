# 02 — App Shell, Visual Design, and Accessibility

## Goal

Create the shared page frame and navigation before implementing game-specific boards. This module owns `index.html`, `styles.css`, and the shell structure of `app.js`; keep game rules out of the shell.

## Page layout

Build a mobile-first single page with:

1. A header with Puzzle Hub name, current drop number/slot, and a live countdown to the next local drop.
2. A game selector containing all six game names and a short mechanic description.
3. A mode selector for `Daily Challenge` and `Practice`. Show the active mode and its scoring implications before a run starts.
4. A main game panel with the selected game's title, difficulty label, a concise tutorial/how-to panel, board mount point, status/feedback region, and a start/restart control where applicable.
5. A compact HUD showing elapsed time, current rank preview (daily challenge only), and score.
6. A hint action that reveals the next hint level, plus a visible undo control when supported by the selected game.
7. A personal-best/history and local-stats panel, notification preference/status, profile backup/import/reset actions, and share action (detailed behavior is specified in later briefs).
8. A modal or dialog surface for the completed-run summary and share choices.

Do not hard-code puzzle values or fake completion buttons. The shell should display clear loading, empty, unsupported, and error states.

## Responsive behavior

- Support phone, tablet, and desktop layouts in portrait and landscape. Use `<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">`; do not disable pinch zoom or text resizing.
- At 320 CSS pixels wide and at 200% browser zoom, no essential control or board content is clipped or requires horizontal page scrolling.
- Make primary touch targets at least 44 by 44 CSS pixels with spacing between adjacent controls. Controls must work without hover and avoid gesture-only actions such as drag-only path entry.
- Respect iOS/iPadOS safe areas with `env(safe-area-inset-*)`, especially for bottom actions and dialogs. Do not place fixed controls beneath the home indicator or device cutouts.
- Use flexible CSS grid/flex sizing and bounded board dimensions; do not use fixed page/board widths or heights that force a 6x6/7x7 board off-screen. Use dynamic viewport units with a fallback rather than assuming a stable mobile browser chrome height.
- On wider screens, use a centered content width and a two-column layout only if it keeps the board legible. Reflow cleanly when orientation changes.
- Respect `prefers-reduced-motion`; do not rely on animation for feedback.

## Platform and input support

- Use standard buttons and `Pointer Events` or native click/input events; avoid separate touch-only and mouse-only implementations. Do not depend on hover, right-click, precise dragging, or multi-touch.
- Every game must be playable with touch alone and with keyboard alone. Mouse is supported as a convenience. Provide visible on-screen controls for actions that might otherwise require a keyboard.
- Do not call `preventDefault()` broadly on touch/pointer events; preserve page scrolling, browser zoom, text selection where appropriate, and assistive-technology gestures.
- Support dynamic text size and system contrast settings without clipping controls or hiding game feedback. Do not rely on platform-specific emoji rendering for game meaning.
- Verify on iPhone/iPad Safari, Android Chrome, macOS Safari plus a Chromium browser, and Windows Edge or Chrome. Also smoke-test desktop Firefox core play. Optional PWA APIs may differ by browser and must degrade gracefully.

## Shared interaction requirements

- Use real `<button>` elements for actions and game selection. Provide visible focus styles.
- Keep keyboard focus order logical. Dialogs must have a title, be dismissible by Escape, and return focus to the control that opened them.
- Announce changing game feedback and completion via a polite live region (`aria-live="polite"`); do not announce the timer every second.
- Give each board cell an accessible name with row/column and current value/state. Do not use color as the only indication of a clue, region, win, or error.
- Tutorials must explain the objective, legal moves, controls, undo behavior, and whether the active mode is scored. Keep instructions short and available throughout play.
- Hints must appear as text feedback in a polite live region. Label the stages (rule reminder, then actionable nudge); do not reveal a complete solution.
- Practice must be visibly labeled as unscored. Do not show a rank preview or challenge-points claim in practice mode.
- Use text labels alongside emojis/badges. Emojis may render differently across platforms; they must not be the only source of meaning.
- Ensure foreground/background contrast is readable and controls have clear disabled states.
- Do not inject user-provided text as HTML. Use `textContent` for names and share preview content.

## Shell state and rendering boundaries

`app.js` owns the selected game, mode, current slot, timers, storage coordination, navigation, and mounting/unmounting game views. Each game renderer receives a DOM mount element, immutable puzzle data, mutable run state, and callbacks. It must not own global navigation or write profile data. The shell owns mode-specific persistence, hint-use counting, and completion scoring.

Keep the selected game in the URL `?game=` when valid. If absent or invalid, select the first game without throwing. Preserve unrelated allowed query parameters only when generating challenge URLs as described in brief 09.

Render from state rather than mutating arbitrary DOM nodes across unrelated components. On switching games, stop per-view intervals/listeners; keep the run state in app state or storage.

## Tutorial, hint, stats, and profile controls

- Each game's tutorial is available from the game panel and can be collapsed without losing the run.
- One `Hint` action reveals at most two progressive levels per run: a rule reminder first and a state-specific nudge second. Count a hint only when nonempty hint text is actually revealed. Disable it after the available levels are used.
- Call the selected game module's pure `getHint(puzzle, state, level)` helper. `level` is `1` or `2`; it returns accessible text or `null`. A `null` result is not shown and does not increment the hint count.
- Keep daily challenge and practice selection explicit. Practice puzzle selection is independent of the current slot; practice completion uses a separate record and never scores.
- Provide a stats view with challenge games played, practice games played, fastest times, tier counts, hint uses, and current/best consecutive-drop streak.
- Provide `Export backup`, `Import backup`, and `Reset local profile` actions with confirmation/status feedback. Explain that data is local to this browser.

## Added feature acceptance checks

- Every game panel exposes its tutorial, mode, difficulty, hint action, and applicable undo action.
- Switching between daily challenge and practice does not convert or overwrite an in-progress run.
- Practice never displays or records challenge points/rank.
- Stats and profile controls are keyboard accessible and have clear confirmation/error states.

## Acceptance checks

- Open the app and navigate all six games using keyboard and pointer.
- At 320px width, selector, current game, and timer fit without horizontal page scroll.
- Keyboard focus is visible; dialog focus is managed; status feedback is announced once per meaningful change.
- A missing puzzle or failed service worker does not leave a blank page; present a concise, recoverable error.
- The timer uses text such as `08:00:00` and remains legible without animation.
- Touch-only play works for each game on phone and tablet; no action requires hover, a keyboard, or dragging.
- Mouse and keyboard play work on macOS and Windows; orientation changes do not reset or lose the active run.
- At 320 CSS pixels and 200% zoom, no essential content is clipped; at tablet/desktop widths, boards remain centered and readable.
- iOS/iPadOS safe-area insets protect bottom controls and dialogs; browser zoom and text resizing remain enabled.
