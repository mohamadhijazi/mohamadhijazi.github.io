# 09 — Achievement Sharing and Challenge Links

## Goal

Share a completed result only after explicit user action. Generate a readable achievement and challenge link; do not transmit the local profile or build a backend.

## Achievement text

Use this shape, substituting actual saved result values:

```text
🏆 Puzzle Hub — Drop #15 (14-Day Challenge)
🎮 Game: Queens 👑
⏱️ Time: 00:24 | Rank: ⚡ Lightning (< 30s)
🔥 Total Score: 6,250 pts
Can you beat my 24s time before the next 8-hour reset?
👉 https://example.com/?game=queens&slot=123&challenger=usr_...
```

Use the deployed app's same-origin absolute URL; never hard-code `your-domain.com`. Format elapsed time as `mm:ss` or `hh:mm:ss`. Escape/encode every query parameter with `URLSearchParams`. `challenger` contains the user's shareable local ID and is not authentication. Include only the result needed to render the achievement; do not expose history or private profile fields.

## Share destinations

- WhatsApp: open `https://wa.me/?text=<encoded achievement text>` from a user click.
- Facebook: open the official share dialog with the challenge URL in its `u` parameter. Facebook may not accept custom body text; do not imply that it will. Put achievement details in the app's own result UI and offer a separate copy-text action.
- Offer a native `navigator.share()` action when supported, and a clipboard copy fallback. Handle cancellation without an error toast.
- Open external destinations in a new tab with safe `noopener,noreferrer` behavior where applicable. Do not embed third-party SDKs.

## Deep-link behavior

Read `game`, `slot`, and `challenger` from `location.search` using `URLSearchParams`.

- Accept `game` only if it is one of the six known IDs.
- Parse `slot` as a finite, nonnegative integer. A link to the current slot opens the daily challenge; a link to a past slot opens that exact puzzle in unscored practice mode rather than silently changing it to today's puzzle.
- Validate the slot index against the schedule/data model and map to the appropriate 14-day seed cycle. Clearly label a past-drop link as practice/replay.
- Sanitize/length-limit `challenger`; display it as text only.
- Ignore invalid parameters and fall back to the current slot and default game. Never use a query parameter as an HTML string, script, redirect URL, or storage key.
- When a visitor opens a challenge link, do not overwrite their local user's history or identity. A past challenge link cannot create a new scored entry.

The example's `slot=14` conflicts with a global slot index interpretation. Use the exact numeric `slotIndex` contract from brief 03 in generated links and document that `14` is only an illustrative value.

## Result actions

After a valid completion, show game, duration, tier, points, total score, and rank. Buttons: close result, share to WhatsApp, share to Facebook, copy achievement, and share via native API if available. A failed/non-winning run must not be presented as a completed achievement.

## Acceptance checks

- Share text reflects the persisted result, not a preview timer or unvalidated run.
- URLs with `&`, unicode, spaces, or malformed values cannot break the app or inject markup.
- Invalid game/slot/challenger query parameters fall back safely.
- Facebook opens with the challenge URL; the app makes no claim that Facebook will publish custom text.
- Clipboard/native-share failure leaves the result view intact and offers a copyable text field.
