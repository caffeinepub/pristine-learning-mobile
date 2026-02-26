# Pristine Learning Mobile

## Current State
The app has a full teacher dashboard, admin panel with Users, Students, and Weekly Analytics tabs. The Weekly Analytics tab allows admins to manually fill in a form to record a weekly snapshot (total users, active sessions, total earnings, top subjects) and download snapshots as CSV. The backend stores these snapshots but relies on admin manual input.

## Requested Changes (Diff)

### Add
- Backend function `generateWeeklySnapshot` that computes and records a live snapshot by pulling real data: total registered users from userRecords, active sessions from sessions map, total earnings summed across all wallets, and top subjects derived from session data. Stores result via weeklySnapshots.
- Frontend "Auto-Generate Snapshot" button in WeeklyAnalyticsTab that calls this new backend function with one click, replacing the need for manual data entry.

### Modify
- WeeklyAnalyticsTab: replace (or supplement) the "Record Snapshot" manual form button with an "Auto-Generate" button that calls `generateWeeklySnapshot`. Keep the manual form as a fallback option.

### Remove
- Nothing removed; manual entry form is kept as a fallback.

## Implementation Plan
1. Add `generateWeeklySnapshot` to main.mo that computes live totals and records a new snapshot.
2. Regenerate backend bindings so `generateWeeklySnapshot` appears in backend.d.ts.
3. Add `useGenerateWeeklySnapshot` mutation hook in useQueries.ts.
4. Update WeeklyAnalyticsTab to add an "Auto-Generate" button wired to the new hook.

## UX Notes
- The Auto-Generate button should show a loading spinner while in-flight.
- On success, display a toast and refresh the snapshot list.
- Keep the manual "Record Snapshot" button as an advanced option for override scenarios.
