# 10 — Integration Sequence and Release Checklist

## Integration order

Do this after the relevant modules exist. Keep each change small and verify after each step.

1. Create the page shell, styles, and module entry point (brief 02).
2. Add schedule functions and catalog lookup/validation (brief 03).
3. Add storage, run clock, duration tier function, and leaderboard (brief 04).
4. Implement games in the order Zip, SumBreak, BreakLogic, Tic-Tac-Toe, Tango, Queens (briefs 06–08).
5. Add each game's tutorial, controls, undo behavior, and progressive hint helper (briefs 02, 06–08).
6. Connect daily challenge and practice modes, keeping their state and records separate. Only the shell handles mode, slot, clock, profile, hints-used count, and completion persistence.
7. Add local stats and profile backup/import/reset (brief 04).
8. Add deep links and share actions (brief 09).
9. Add manifest, service worker, and notification handling/status (brief 05).
10. Run the full acceptance checklist below on phone, tablet, and desktop targets across supported operating systems and input types.

## Integration contract

For each game view:

- Input: mount element, immutable puzzle definition, validated current game state (or a new initial state), and callbacks for state change and completion.
- Output: a rendered interactive board and a cleanup function that removes listeners/timers.
- Completion callback is advisory; the shell calls the game's validator again before scoring.
- No game module writes localStorage, chooses the current time, changes route, opens share dialogs, or starts the global timer.

When rendering a current slot, keep one active challenge run per `(game, slotIndex)`. Practice uses a separate unique run ID and may select any catalog puzzle. On game/mode switch, persist valid state and call cleanup. A route change to a past challenge opens unscored practice and cannot create a new scored run.

## End-to-end test checklist

### Schedule and catalog

- [ ] Six games each have exactly 42 puzzle definitions (252 total).
- [ ] All definitions are stable and unique within each game's 14-day cycle.
- [ ] Every definition has `easy`, `medium`, or `hard` difficulty and passes its solver/solution policy.
- [ ] Zip, SumBreak, Tango, and Queens have exactly one valid solution; Tic-Tac-Toe challenges have a verified forced-win strategy; BreakLogic targets obey their rules.
- [ ] 00:00, 08:00, and 16:00 boundaries and countdown rollover are correct.
- [ ] Changing the active slot does not mutate an already-started run.
- [ ] Practice can select catalog puzzles independently of the current slot.

### Games

- [ ] All six games can be selected and played using pointer/touch.
- [ ] Core input is keyboard accessible and board cells have meaningful names.
- [ ] Invalid moves and partial constraints show useful feedback.
- [ ] Each game has a short always-available tutorial covering objective, legal moves, controls, and undo.
- [ ] Each game offers a rule-reminder hint followed by a state-specific nudge; no hint reveals the complete solution.
- [ ] Hint counts persist per run and do not change time, tier, score, or completion eligibility.
- [ ] Undo/reset never changes locked clues or allows a completed scored run to be modified.
- [ ] Each game has at least one known valid solution tested.
- [ ] Completion is confirmed by the corresponding game validator, not a UI-only event.
- [ ] Switching games and returning preserves the run without duplicating timers/listeners.

### Scoring and storage

- [ ] Thresholds at 29/30, 119/120, and 299/300 seconds match the scoring table.
- [ ] A completed `(game, slotIndex)` scores exactly once.
- [ ] Correct history and aggregate stats survive reload.
- [ ] Personal records are per-game, fastest-first, deterministic on ties, and capped at 10.
- [ ] Practice completion/time/hints are recorded separately and never enter challenge scores, tiers, or leaderboards.
- [ ] Stats show challenge/practice games played, fastest times, tier counts, hint uses, and current/best drop streak.
- [ ] Completing multiple games in one drop counts only once toward streak; a missed drop breaks the streak.
- [ ] Corrupt/unavailable storage produces a visible message and still permits play.
- [ ] Backup export/import round-trips validated challenge/practice history and total hint count; invalid imports leave current data untouched.
- [ ] Profile reset requires confirmation, clears local run/history data, and explains browser notification permission remains browser-controlled.

### Sharing and safety

- [ ] Achievement values match the saved run and total score.
- [ ] Share links encode known game and slot values and reopen the same challenge.
- [ ] Query values render as text and cannot inject HTML or redirect the page.
- [ ] No user data is sent except values explicitly placed in a share URL after user action.

### PWA and notifications

- [ ] App installs where supported and launches in standalone mode.
- [ ] Offline load works after a successful initial cache install.
- [ ] Notification permission is requested only after explicit user action.
- [ ] Denial/unsupported APIs leave the full app usable.
- [ ] Foreground reconciliation is idempotent and avoids duplicate notifications.
- [ ] UI explains that notifications cannot be guaranteed while the app/browser is closed.
- [ ] Install status reflects standalone/install-prompt availability; offline-ready appears only after successful full cache.
- [ ] Notification status distinguishes unsupported, not requested, denied, granted/disabled, and enabled.

### Responsive and accessibility

- [ ] No horizontal page scroll or clipped essential controls at 320 CSS pixels or 200% zoom.
- [ ] Layout works in portrait and landscape on iPhone/iPad, Android phone/tablet, macOS, and Windows.
- [ ] Touch targets are at least 44 by 44 CSS pixels where practical; touch play never requires hover, keyboard, or dragging.
- [ ] iOS/iPadOS safe areas protect bottom controls/dialogs; pinch zoom and text resizing remain enabled.
- [ ] Each game is playable with touch, keyboard, and mouse as applicable; orientation changes preserve the active run.
- [ ] Focus is visible; dialogs manage focus; actions work without hover.
- [ ] Errors, game feedback, and completion are announced accessibly.
- [ ] Rank is communicated by text as well as color/emoji.
- [ ] Reduced-motion preference is respected.

### Browser and operating-system matrix

- [ ] iPhone Safari: responsive touch play, safe-area layout, reload/offline behavior, and Add to Home Screen instructions.
- [ ] iPad Safari: portrait/landscape touch play, keyboard attachment where available, and standalone layout if installed.
- [ ] Android Chrome phone and tablet: touch play, install flow where available, offline reload, and notification permission fallback.
- [ ] macOS Safari and a Chromium browser: keyboard/mouse play, zoom/text scaling, share/copy fallback, and PWA status.
- [ ] Windows Edge or Chrome: keyboard/mouse play, responsive resizing, offline behavior, and PWA status.
- [ ] Desktop Firefox: core gameplay and offline behavior; unsupported installation/notification features show a clear fallback.
- [ ] Optional install, share, clipboard, and notification APIs are capability-detected; absence of any one does not block play.

## Final report format

When an implementation module is complete, report:

1. Files created/changed.
2. Behavior implemented.
3. Exact tests/checks run and their outcomes.
4. Known limitations or unresolved blockers.

Do not say “complete” when a game is a mock, a puzzle catalog is incomplete, notification delivery is promised in the background, or a required acceptance check has not been run.
