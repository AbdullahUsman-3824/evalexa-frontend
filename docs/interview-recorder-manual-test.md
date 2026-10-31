# Interview recorder and upload queue manual test steps

This project does not currently include a test runner for browser media APIs, so the recorder and upload queue should be validated with a browser-based smoke test.

## 1. Setup

1. Start the app in a browser environment that supports `MediaRecorder`.
2. Open a page that loads the interview setup screen or a route that mounts the recorder.
3. Allow camera and microphone access when prompted.
4. Confirm that the recorder is using a supported MIME type such as `video/webm;codecs=vp9,opus` or a fallback such as `video/mp4` on Safari.

## 2. Recorder validation

1. Trigger `startQuestion("question-1")`.
2. Speak for a few seconds and then call `finishQuestion("next")`.
3. Confirm the returned payload contains:
   - `questionId`
   - `blob`
   - `durationMs`
   - `mimeType`
   - `startedAt`
   - `endedAt`
   - `skipped`
4. Repeat with `finishQuestion("skip")` and `finishQuestion("timeout")`.
5. Confirm that skipped and timed-out answers still produce a valid blob and upload payload.

## 3. Upload queue validation

1. Create an `InterviewUploadQueue` with a small `uploadUrl` or a custom `uploadRequest`.
2. Queue a few example blobs using `enqueue(questionId, blob, mimeType)`.
3. Confirm the status transitions follow `queued -> uploading -> uploaded`.
4. Simulate a temporary network failure and verify the queue retries with exponential backoff and jitter.
5. Refresh the page and confirm pending uploads resume from IndexedDB.
6. Call `flush()` and verify it resolves only when all queued items are uploaded or failed.
7. Verify that `navigator.onLine` toggling pauses and resumes the queue appropriately.
8. Confirm the browser shows a before-unload warning while uploads are still pending.

## 4. Presigned upload flow

1. Configure the queue with a presigned upload resolver instead of a direct multipart request.
2. Verify the request uses the `PUT` or configured method and the blob is sent correctly.
3. Confirm both direct and presigned flows share the same queue interface.

## 5. Failure checklist

- No media access permission should be silently ignored.
- Any upload failure should surface through the queue event stream and fail item state.
- `dispose()` should stop tracks and clear queued upload work.
- Manual retry should work for failed entries.
