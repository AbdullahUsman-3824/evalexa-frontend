# Interview QA Manual Test Matrix

This checklist covers the public candidate interview flow, the recruiter invite flow, and the mock failure modes used during frontend validation. The expected behaviors below assume the app is running with mock interview services enabled and the browser has camera/microphone permissions allowed.

## 1. Setup

- Open the app in a desktop browser.
- Use the mock interview routes and scenarios by appending `?mock=expired`, `?mock=badpin`, `?mock=uploadfail`, or `?mock=terminate` as needed.
- Keep a second browser window or devtools tab open to confirm session state persistence and refresh behavior.

## 2. Candidate flow QA matrix

| Scenario                  | Route / setup                      | Expected result                                                                                    | Notes                                                              |
| ------------------------- | ---------------------------------- | -------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------ |
| Happy path                | Public interview link              | Candidate can open the link, enter valid PIN, allow camera/mic, and start the session              | Confirm a valid interview token loads the room without auth issues |
| Bad PIN                   | `?mock=badpin`                     | Error state appears after PIN validation with a clear retry path                                   | No session should begin                                            |
| Expired link              | `?mock=expired`                    | The app shows an expired/invalid invite state and blocks access                                    | Session token should not remain usable                             |
| Upload failure            | `?mock=uploadfail`                 | The UX does not silently fail; queue retries, shows failed upload state, and allows a manual retry | Keep the tab open until flush finishes                             |
| Forced termination        | `?mock=terminate`                  | Interview ends with termination messaging and no further actions allowed                           | Verifies the terminate flow                                        |
| Refresh mid-session       | Resume an in-progress answer       | Session state persists and resumes on reload                                                       | The stored token/session data should still restore the interview   |
| Hidden tab / blur         | Switch tabs during the room flow   | Security warning appears and violation counts increase in the event log                            | This is deterrent behavior, not a guaranteed lockout               |
| Fullscreen required       | Enter the room and exit fullscreen | User is prompted to return to fullscreen and warned after repeated violations                      | Confirm the browser API is working                                 |
| Device permissions denied | Block camera/mic in browser        | Setup screen shows readiness errors and prevents starting until fixed                              | Ensure no blank or frozen state                                    |

## 3. Recruiter invite flow QA matrix

| Scenario                 | Action                                                | Expected result                                                                                 |
| ------------------------ | ----------------------------------------------------- | ----------------------------------------------------------------------------------------------- |
| Send invite to valid job | Recruiter sends invite from the interview invite page | Invite is queued and the row shows a success or sending state without duplicate sends           |
| Duplicate recipient      | Send the same invite twice                            | Second attempt is blocked or clearly marked as duplicate and does not create a duplicate record |
| Limit enforcement        | Invite a job whose `interviewLimit` is reached        | UI prevents additional invitations and surfaces the limit message                               |
| AI interview disabled    | Try to invite a job with `enableAiInterview: false`   | Invite action is blocked with a clear explanation                                               |
| Job not available        | Use a stale or missing job                            | Error banner appears and no invite is sent                                                      |
| Retry after failure      | Trigger a transient mock failure during send          | Row-level retry state appears and the invite succeeds after retry                               |
| Summary state            | Send multiple invites in one batch                    | Summary shows sent, skipped, and failed counts with the final state clearly visible             |

## 4. Completion and submission QA

1. Complete all interview questions.
2. Confirm the app distinguishes between the following terminal states:
   - All answers uploaded - interview submitted
   - Still uploading X answers, keep this tab open
3. Verify that closing the browser tab while uploads are still queued triggers the before-unload warning.
4. If a queued upload fails, confirm a retry action appears and the final submission can be retried without breaking the session.
5. Confirm the final message does not incorrectly say the interview was submitted when uploads are still in flight.

## 5. Browser notes

### Chrome

- Best coverage for record/playback, MediaRecorder, permissions, and tab visibility events.
- Recommended for the primary regression pass.

### Edge

- Similar behavior to Chrome. Use this as a second validation pass for permission prompts and fullscreen enforcement.

### Firefox

- MediaRecorder compatibility may differ by MIME type and browser behavior.
- Validate the fallback recording path and ensure the queue still completes correctly.

### Safari

- Confirm media MIME fallback behavior and permission flow.
- Exercise the queue and before-unload protection specifically because Safari can be stricter about document visibility and media capture.

## 6. Regression checklist

- Invite row states: idle, sending, success, duplicate, retrying, failed
- Duplicate protection remains active across repeated clicks
- Send action summary reflects all outcomes
- Queue flush is blocked until pending uploads finish
- Security warning is surfaced without crashing the interview room
- Resume logic still restores the session after reload
- Failed uploads can be retried from the final screen

## 7. Known validation note

The interview flow is validated against the mock service contract and browser behavior. The local full TypeScript project check remains blocked by stale generated Next.js route metadata under `.next`, not by the interview components themselves; this should be cleared by deleting the generated `.next` folder before a full repo-wide compile check.
