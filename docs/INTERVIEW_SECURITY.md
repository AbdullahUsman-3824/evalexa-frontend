# Interview security notes

This public interview flow includes deterrent checks and server-backed event logging, but it is not a foolproof anti-cheating system.

## What the client does

- Requests fullscreen when the interview starts.
- Monitors tab visibility, window blur, fullscreen exit, selection/copy attempts, and common shortcut keys.
- Uses a backend session event log to count repeated violations.
- Shows a blocking warning after the first qualifying violation, and terminates the session on the second.
- Logs each event with the interview session id, question id, timestamp, and a reason.
- Uses local queue persistence when the browser is offline so the event is retried later.

## What is deliberately not guaranteed

The following cannot be reliably enforced from the browser alone:

- OS-level screenshots or screen capture tools
- a second device or remote display
- browser devtools opened from the browser menu or a custom launcher
- screen sharing or mirrored display tools
- advanced capture tools that bypass browser APIs

## False-positive risk

Some interruptions are harmless and should not be treated as cheating:

- the fullscreen transition itself
- brief tab blurs of less than about one second
- browser-level permission prompts
- OS notifications or app switching for a moment
- a user intentionally leaving the browser to look up information

The implementation intentionally ignores the initial permission prompt and short transient blur events to reduce false positives.

## Backend-first rule

Count data is taken from the backend session event history, not from local memory. Refreshing the page or re-opening the browser cannot reset the violation count.

## UI wording

The UI does not claim the experience is foolproof. It only warns and terminates based on repeated security violations, and should be treated as a deterrent rather than a guaranteed lock against cheating.
