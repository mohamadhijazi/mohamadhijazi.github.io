# 05 — Offline PWA and Local Notifications

## Goal

Make the static app installable and cache its same-origin shell. Add optional local browser notifications with explicit permission and correct expectations about background execution.

## PWA requirements

- `manifest.json` declares the app name/short name, start URL, standalone display, theme/background colors, and app icons. Use valid local icon assets if present; if the repository has no icons, make minimal project-owned icons or omit icon entries rather than referencing nonexistent URLs.
- Use relative manifest URLs, service-worker registration paths, and an appropriate relative `scope`/`start_url` so the app also works when deployed below a domain root (for example, on a project-hosting subpath).
- Register `sw.js` from the app on secure origins only. Handle registration rejection without breaking app use.
- Cache the shell and all six modules plus puzzle data during service-worker install. Use a versioned cache name.
- Serve cached same-origin assets offline; update cache deliberately and delete only older caches owned by this app.
- Do not cache opaque cross-origin responses or user-specific data. No network calls are needed for runtime puzzles.
- Do not claim offline readiness until the service worker has completed a successful installation and the required app shell is cached.

## PWA status in the app

Show a small status panel with independent, truthful states:

- **Install:** installed/standalone when `display-mode: standalone` (and iOS standalone detection where available); otherwise show an install action only after the browser fires `beforeinstallprompt`. On iOS/iPadOS Safari, where that event is not available, show brief `Share` → `Add to Home Screen` instructions when install help is requested. On browsers without an install route, explain that installation depends on the browser.
- **Offline:** `Preparing` until service-worker installation and required cache completion succeed; then `Offline ready`. Show a recoverable failure state if registration/cache setup fails. Do not infer this only from `navigator.onLine`.
- **Notifications:** distinguish unsupported, permission not requested, denied, granted but disabled, and enabled. Browser permission is authoritative; never display enabled when permission is denied or unavailable. Check `Notification`, service-worker support, and `registration.showNotification` before offering the control. Some iOS/iPadOS versions require the site to be installed as a Home Screen web app for notifications; feature-detect and show the install guidance instead of a broken permission flow.

Update the status panel after install prompt acceptance/dismissal, service-worker lifecycle changes, connectivity changes, and notification permission changes. Keep status text accessible and do not block game play.

Do not branch solely on user-agent strings. Prefer capability detection; use platform-specific instructions only where the user experience genuinely differs (such as iOS/iPadOS Add to Home Screen). Installation and notification availability vary across browser/OS versions and must not be presented as guaranteed features.

## Notification experience

The user explicitly enables notifications using a clear control. Only in that click handler call `Notification.requestPermission()`. Explain that permission is optional. Persist `notificationsEnabled` only when permission is `granted`; if denied or unavailable, show an actionable status and keep the game working.

When enabled:

1. Register the service worker and obtain its active registration.
2. Calculate milliseconds to the next local 00:00, 08:00, or 16:00 boundary with calendar-safe date arithmetic.
3. Schedule one `setTimeout` while the page is running. On fire, call `registration.showNotification()` with:
   - title: `New 8-Hour Puzzle Drop Ready!`
   - body: `Zip, Tango, Queens & more are live.`
   - a stable tag so only one notification for a slot is shown.
4. Record the notified slot index only after the notification promise succeeds. Then calculate and schedule the next boundary.
5. On app open and every `visibilitychange` to visible, compare current slot index with the saved `lastNotifiedSlot`. If a fresh slot has started since the last successful notification, show one immediate notification for the current slot, update the saved slot after success, and reschedule.

If multiple slots were missed while closed, send at most one notification for the current slot, not a burst for every missed drop. Do not send an immediate notification on first enable unless a new slot has started since the last recorded notification.

## Important browser limitation

A page's `setTimeout` is not a reliable background scheduler. It stops or is throttled when the browser/device suspends the page. A service worker may also be terminated when idle and cannot host an indefinite timer. There is no backend, push subscription, periodic sync guarantee, or VAPID key in this app. Therefore:

- Notify at the boundary only if page JavaScript is still running.
- Reconcile the current slot on open/foreground to catch missed windows.
- State this limitation in the notification UI; never promise delivery while fully closed.

## Service-worker click behavior

Handle `notificationclick`: close the notification, focus an existing app client if possible, otherwise open the app's same-origin URL. Include a validated current `game` and slot parameter only if actually needed; do not include local profile data or arbitrary notification input.

## Lifecycle and resilience

- Keep at most one pending page timer. Clear and replace it on reschedule and on page teardown.
- Recalculate after system clock or timezone changes when detected through visibility/focus and before timer handling.
- Catch and surface service worker/notification errors. Do not show a notification if permission is not granted.
- Do not call `showNotification` from an unregistered/unsupported context.
- The main app must work when notifications and service workers are unavailable.
- A notification status panel cannot claim delivery while the app/browser is closed.

## Acceptance checks

- Denied permission, unsupported APIs, and service-worker registration failure do not break play.
- Install, offline-cache, and notification status messages match actual browser/runtime state.
- `Offline ready` appears only after all required same-origin assets have been cached successfully.
- Installation help is accurate for iOS/iPadOS Safari as well as install-prompt browsers; unsupported browsers show a useful fallback instead of a dead button.
- Notification controls are unavailable or explain the required installation path when the platform does not support service-worker notifications.
- Granted permission with a live page causes one notification at the next local boundary and schedules the following one.
- Returning to foreground after a missed slot shows only one notification for the current slot.
- Same-slot visibility changes do not duplicate a notification.
- After successful first load, disable network and verify the shell, catalog, and game modules still load.
