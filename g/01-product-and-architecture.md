# 01 — Product Contract and Architecture

## Goal

Build Puzzle Hub as a responsive, installable, static web app for six rotating logic games. A user can select the current 8-hour puzzle, play it, see elapsed time and score, review personal fastest finishes, and share a challenge link. Add a separate unscored practice mode, concise per-game tutorials, optional graduated hints, local stats, and local profile backup/reset. Everything works without an account or backend.

## Required output files

Use this plain-text layout. Keep the filenames and global names stable so later modules can integrate.

```text
index.html
styles.css
app.js
puzzles-db.js
manifest.json
sw.js
games/
  zip.js
  sum.js
  break.js
  tictactoe.js
  tango.js
  queens.js
```

The numbered briefs are specifications, not runtime files. Do not add a bundler or package manifest.

## Runtime and dependency rules

- Use semantic HTML, CSS, and browser JavaScript only; no framework or external library.
- Use ES modules (`type="module"`) for the app and each game module. Load `puzzles-db.js` and game modules using relative paths.
- `index.html` must be served from a secure origin (HTTPS or localhost) for service workers and notifications. Do not make `file://` operation a requirement.
- Support current evergreen browsers on iOS/iPadOS, Android, macOS, and Windows. Core puzzle play must not depend on install prompts, notifications, native share, hover, or a physical keyboard. Detect optional browser APIs at runtime and provide a usable fallback.
- Test browser-engine coverage at minimum with Safari/WebKit on iOS/iPadOS and macOS, Chrome on Android, and Edge or Chrome on Windows. Test Firefox desktop for core play where available. PWA installation and notification availability are browser/OS capabilities, not universal promises.
- The game logic must be testable without DOM elements. Keep rendering and browser APIs in the shell; game modules export pure validation/state-transition helpers.
- Treat all values loaded from localStorage and URL parameters as untrusted input. Validate shape and allowed values before use.
- Do not send user data, puzzle results, or identifiers over the network. The only network requests are static same-origin assets and navigation to a share provider after an explicit user action.

## Shared public contracts

Use these identifiers exactly:

```text
zip
sum
break
tictactoe
tango
queens
```

Each game module exports a game-specific validator, a state transition helper, and `getHint(puzzle, state, level)`. `level` is `1` (rule reminder) or `2` (state-specific nudge); return accessible hint text or `null` when no safe useful hint is available. The function is deterministic and has no side effects. Game modules must not access `document`, localStorage, or the clock. The shell owns those concerns. Detailed functions and puzzle formats are defined in the game briefs.

Puzzle lookup takes `(gameId, localDayIndex, slotOfDay)`, where `localDayIndex` is the current local calendar date's day ordinal modulo 14 and `slotOfDay` is `0`, `1`, or `2`. Lookup is deterministic and selects one of that game's 42 entries. Puzzle definitions are immutable; copy mutable board state before play.

## Product behavior

- Current slot boundaries are local time 00:00, 08:00, and 16:00. A challenge uses the puzzle for the slot in which it was started; crossing a boundary mid-run does not swap the puzzle or reset its timer.
- A user may select any of the six games. Returning to a game during its current slot resumes that in-progress run for the same slot if the implementation has persisted its state. A completed game for a slot cannot be scored again; reopening it shows the result.
- Daily challenge mode always selects the deterministic puzzle for the active slot and can earn its base points once. Practice mode lets the user choose any catalog puzzle, including a replay, and never changes challenge score, tier counts, challenge history, or challenge leaderboard. A past-drop link opens as unscored practice.
- Starting a new puzzle starts its elapsed-time clock. Pausing is not required. The clock must not award a faster rank after reload: persist a start timestamp and derive elapsed time from it.
- Completing a game means its validator says the current state satisfies all rules. Never trust a UI signal alone.
- Each game has a short objective/rules/controls tutorial and an accessible undo action where the game state allows undo. Optional hints are progressive: first a rule reminder, then a state-specific nudge. Track hints used per run; hints never alter elapsed time, tier, or points.
- The local profile has a generated `userId`, notification preference, score totals, separate challenge/practice records, derived local stats, and user-initiated backup/import/reset (see brief 04).
- Every catalog puzzle carries a difficulty label and passes game-appropriate solution/uniqueness checks. Difficulty is descriptive only and never modifies points or ranking.
- Touch, keyboard, and mouse users can complete each game; touch targets, safe areas, text scaling, and portrait/landscape layouts are part of the product contract.

## Out of scope

No login, cloud leaderboard, multiplayer, remote push notifications, payment, ad tracking, server endpoint, AI-generated runtime puzzle, or social provider SDK. Do not add a share service or expose private local history.

## Definition of done

All six games load from the shell; each current puzzle is stable for its slot; invalid moves do not silently count as wins; one daily challenge run yields one score; practice never changes challenge records; hints do not change scoring; reload preserves profile/history; profile backup/reset work safely; notification denial does not break play; PWA status is clear; unsupported features degrade visibly and safely.
