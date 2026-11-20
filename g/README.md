# Puzzle Hub — Qwen2 Build Pack

This folder contains small, ordered implementation briefs for building the plain-JavaScript Puzzle Hub. Give Qwen2 one numbered brief at a time, along with the files already created. Do not ask it to implement every module in one response.

## Implementation order

1. [01-product-and-architecture.md](./01-product-and-architecture.md) — project contract, file boundaries, and completion criteria.
2. [02-shell-and-accessibility.md](./02-shell-and-accessibility.md) — responsive application shell, navigation, timer, and shared UI.
3. [03-schedule-and-puzzle-data.md](./03-schedule-and-puzzle-data.md) — 8-hour slots and deterministic 42-slot puzzle catalog.
4. [04-storage-scoring-and-history.md](./04-storage-scoring-and-history.md) — versioned local state, completion scoring, and personal top 10.
5. [05-pwa-and-local-notifications.md](./05-pwa-and-local-notifications.md) — installability, offline behavior, and foreground-aware notifications.
6. [06-zip-and-sumfill.md](./06-zip-and-sumfill.md) — Zip and SumFill rules and engines.
7. [07-break-and-tic-tac-toe.md](./07-break-and-tic-tac-toe.md) — BreakLogic and Tic-Tac-Toe rules and engines.
8. [08-tango-and-queens.md](./08-tango-and-queens.md) — Tango and Queens rules and engines.
9. [09-sharing-and-url-routing.md](./09-sharing-and-url-routing.md) — achievement sharing, challenge links, and route validation.
10. [10-integration-and-test-checklist.md](./10-integration-and-test-checklist.md) — integration sequence and release checks.

## How to use each brief

Paste the following instruction before the selected file:

> Implement only the module described in the attached brief. First inspect the existing files and preserve working behavior. Follow the file boundaries and acceptance checks in the brief. Do not add a framework, package, backend, or unrelated feature. If a prerequisite is missing, implement only the smallest prerequisite needed and explain it. At the end, list changed files and checks run.

Ask the model to return complete files or focused patches, not pseudocode. After each module, review the changed files and run its acceptance checks before continuing.

## Product invariants

- The app is a static, browser-only PWA. No server, account system, remote puzzle API, analytics, VAPID key, or third-party runtime dependency.
- Support responsive play on iPhone/iPad, Android phones/tablets, macOS, and Windows. Core game controls work with touch, keyboard, and mouse; installation and notifications are feature-detected because browser/OS support differs.
- Use the user's local calendar and local wall clock for the three daily puzzle drops: 00:00, 08:00, and 16:00.
- There are six games. Each game has exactly 42 deterministic puzzle definitions: 14 local-calendar days times 3 slots. A game's definitions must be unique within that 42-slot cycle.
- A completion's rank depends only on elapsed whole seconds: `<30` Lightning / 1,000 points; `30–119` Swift / 750; `120–299` Steady / 500; `>=300` Completed / 250.
- Personal records are local to this browser and are sorted by shortest duration for each game. Show no more than 10 runs per game.
- Daily challenges are fixed and score once per game/drop. Practice replays any catalog puzzle without challenge points, rank, or leaderboard entries.
- Tutorials, hints, difficulty labels, and streaks are informational only; none changes duration-based rank or base points.
- Keep profile backup, import, and reset local and user-controlled. Explain that data is stored in this browser.
- Puzzle progress and scores must not be lost because a view re-rendered or a game was switched. Persist completed runs; do not claim cross-device synchronization.
- A notification timer can run only while the page's JavaScript is alive. Reconcile missed drops when the app is opened or returns to the foreground. Do not promise delivery while the browser or device has suspended the app.

## Completion definition

The project is complete only when all six games can be opened and played with clear tutorials and controls, puzzle completion is validated by game rules, timer and scoring are consistent, daily and practice records stay separate, history survives reload and can be backed up/reset, the app works offline after a successful first load, and the behavior is verified on mobile, tablet, and desktop across iOS, Android, macOS, and Windows with touch/keyboard/mouse and screen-reader basics.
