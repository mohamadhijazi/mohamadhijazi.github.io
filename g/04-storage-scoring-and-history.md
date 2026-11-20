# 04 — Local Profile, Scoring, and Personal Records

## Goal

Persist profile, runs, and in-progress state locally. Score runs only by absolute elapsed duration and show each game's ten fastest valid completions.

## Storage key and profile

Use one key: `puzzle_hub_v2`. Store a JSON object with this shape:

```json
{
  "schemaVersion": 2,
  "userId": "usr_<uuid>",
  "notificationsEnabled": false,
  "lastNotifiedSlot": null,
  "stats": {
    "totalScore": 0,
    "lightningCount": 0,
    "swiftCount": 0,
    "steadyCount": 0,
    "gamesPlayed": 0,
    "practiceGamesPlayed": 0,
    "totalHintsUsed": 0
  },
  "history": [],
  "practiceHistory": [],
  "inProgress": {}
}
```

`userId` is generated once with `crypto.randomUUID()` where available. If unavailable, generate a collision-resistant local fallback using browser crypto; do not claim it is an authentication credential. Use the `usr_` prefix. A corrupt or inaccessible storage value must produce an explicit message and leave the app playable in memory; do not silently report successful persistence.

Each history item:

```json
{
  "slotIndex": 0,
  "game": "queens",
  "completedAt": "2026-11-20T09:05:18.000Z",
  "timeSeconds": 24,
  "rankTier": "Lightning",
  "score": 1000,
  "puzzleId": "queens-d00-s0",
  "difficulty": "medium",
  "hintsUsed": 0
}
```

`history` contains scored daily challenge wins only. `practiceHistory` contains unscored practice completions, with `game`, `puzzleId`, `completedAt`, `timeSeconds`, `difficulty`, and `hintsUsed`; practice entries have no score, rank, or slot claim. Keep all completed practice entries so derived totals remain accurate.

Store the exact current run's `startedAt` ISO timestamp and puzzle/slot IDs in `inProgress`, keyed by mode plus game plus slot index for challenges, or by a unique practice run ID for practice. Persist game state only when serializable and valid. On reload, derive elapsed time from `startedAt`; do not restore a saved timer number as the source of truth. Store hint progression and the number of hints actually shown per active run.

## Duration scoring

Use nonnegative whole elapsed seconds (`floor((endMs - startMs) / 1000)`) with a monotonic timer for in-page display where possible. Use persisted wall-clock timestamps to account for reload/background time. Reject invalid or negative duration.

| Elapsed time | Tier | Base points | Badge |
|---|---|---:|---|
| `< 30` seconds | Lightning | 1000 | Gold / ⚡ |
| `30 <= t < 120` seconds | Swift | 750 | Silver / 🥈 |
| `120 <= t < 300` seconds | Steady | 500 | Bronze / 🥉 |
| `t >= 300` seconds | Completed | 250 | Standard / ✅ |

Boundaries are strict as shown. A run of exactly 30 seconds is Swift; exactly 120 is Steady; exactly 300 is Completed. Rank never uses par time, difficulty, game, hints used, or other players' results. A hint does not pause, add time to, or otherwise alter the elapsed-time calculation.

## Exactly-once completion

Key a completed run by `(slotIndex, game)`. Before saving, check whether history already contains that pair. If it does, show the existing result and do not add points or increment counts again. Score only after the game's completion validator succeeds. Update history and aggregate stats together, then persist.

Aggregate counters:

- `totalScore` is the sum of all recorded run scores.
- Lightning, Swift, and Steady counts count runs in those tiers.
- The Completed tier has no counter in this schema.
- `gamesPlayed` is the number of scored challenge entries; `practiceGamesPlayed` is the number of practice completions. Recompute these and score/tier totals from validated records.
- `totalHintsUsed` increments whenever the shell actually reveals a nonempty hint, including hints in incomplete or failed runs. Persist it with the updated run state immediately; validate it as a nonnegative integer on load rather than deriving it only from completed-run history.

## Stats and drop streak

Derive current stats from validated records plus the persisted hint counter. Show challenge games played, practice games played, fastest challenge time per game, tier counts, total hint uses, and current/best drop streak. Fastest times and the top-10 leaderboard use scored challenge history only.

A drop counts as completed if the player successfully completes at least one daily challenge game for that `slotIndex`. Count each distinct slot once even if multiple games are completed in it. A streak is consecutive completed slot indices; missing a slot breaks the current streak. Derive current streak from history and the current schedule: preserve it while the most recent completed slot is the active slot or its immediately preceding slot, otherwise show zero. Best streak is the longest consecutive run in all challenge history. Streaks are cosmetic and never grant points or change rank.

## Hints

Record `hintsUsed` separately for every challenge/practice run. Increment only when a hint is shown. Hint use never changes score, tier, duration, or eligibility. Daily challenge hints are stored in the matching challenge record; practice hints are stored only in `practiceHistory`.

## Backup, import, and reset

- Export a JSON backup containing a format/schema version, export timestamp, `userId`, validated challenge history, practice history, and `totalHintsUsed`. Do not include notification permission, `lastNotifiedSlot`, or in-progress runs.
- Import only a bounded-size JSON file with the expected version and validated records. Show a preview and require explicit confirmation before replacing the current profile. Validate the entire file before writing; invalid imports leave current data untouched. Reject duplicate `(slotIndex, game)` challenge records and recompute their tier/score from duration instead of trusting imported aggregates.
- Reset requires a clearly worded confirmation. On confirmation, stop app timers, clear the profile and run state, and initialize a new local profile. Do not attempt to revoke the browser's notification permission; explain that permission is controlled by browser settings.
- Export/import/reset operate locally and make no network request. Explain that clearing browser site data can remove the profile.

## Personal leaderboard

For a selected game, filter valid history by game and sort by:

1. `timeSeconds` ascending,
2. `completedAt` ascending,
3. `slotIndex` ascending.

Display up to 10 rows with duration, tier badge, and completion date/drop. This is a local personal leaderboard, not a public ranking. If fewer than 10 runs exist, show only those runs and an empty-state hint.

## Migration and errors

Parse storage inside a narrow error boundary. Validate version, types, identifiers, times, tier, and score. Do not accept arbitrary HTML or executable data. For an unknown schema version, preserve the original value and show a recoverable notice; do not overwrite it automatically. Storage write errors must be visible to the user.

## Acceptance checks

- Test `29`, `30`, `119`, `120`, `299`, and `300` seconds.
- Complete one game twice for the same slot; history and score increase only once.
- Complete runs in different games for the same slot; each is recorded independently.
- Reload and verify run duration continues from the original start timestamp.
- Add more than 10 records for one game; leaderboard is correctly ordered and capped at 10.
- Corrupt JSON and simulated localStorage denial do not crash the game or pretend to save.
- Hints change only the run's hint count; score/tier/time are unchanged.
- Practice completions and practice hints never enter challenge history, score totals, tier counts, or challenge leaderboards.
- Repeated completed drops count once toward streak; a missed drop breaks the streak.
- Valid backup round-trips challenge and practice history; malformed/oversized imports leave the profile unchanged; reset requires confirmation and clears local records.
