# Design

## Context

The release-notes file has version headings tagged with publication status and an `Unreleased` section. The user wants pending notes to be assigned to the next version on `dev`, whether or not a PR exists yet. The About version and startup release notice represent published releases, so they remain unchanged until the release is merged into `master`. History records are stored in browser local storage with `DD-MM-YYYY` keys and contain schedule, start/end-derived totals, overtime, and optional summary fields.

## Goals / Non-Goals

**Goals:**
- Use version-only headings for published history and the planned next version; do not use an `Unreleased` section.
- Record pending notes under the planned next version ID on `dev` without requiring an open PR.
- Keep the planned version ID stable while changes accumulate; correct it if the release is abandoned or its target version changes.
- Keep About and startup release notices tied to actual `master` merges.
- Let the agent explore history-based UI and reports with 60 consecutive days of representative data in each integrated-browser test session.
- Keep test data isolated from the user's saved browser profile.

**Non-Goals:**
- Change the overtime adjustment behavior or button placement.
- Add sample-data controls or startup seeding to the application.
- Modify or overwrite the user's saved work history.
- Publish a pending version in the About dialog or startup notice before its merge into `master`.

## Decisions

- Remove `— Published on master` and other publication-status suffixes from version headings in `RELEASE_NOTES.md`.
- Replace `## Unreleased` with the next planned version ID, initially `20261030.1`, and keep all current pending notes under that heading on `dev`. Adding notes does not depend on creating a PR.
- Give the pending startup alert the same version heading as the planned release-notes entry (currently `20261030.1`). Remove the “Unreleased changes” label and explanatory copy that conflicts with the versioned release-note presentation. Keep the pending alert's dismissal identity tied to the planned version ID, while leaving the About version unchanged until merge.
- Preserve the planned version heading as work accumulates. If the release is abandoned or the intended release version changes before merge, revise the heading and associated notes to match the release that will merge.
- At the `master` merge, the planned version becomes a published version entry. Update the About version and publish its startup notice only at that release boundary, retaining the immediately preceding published notice.
- Add a reusable fixture with one record for each of the 60 days before today, excluding today. Include records with varied schedules, break durations, summaries, positive/negative/zero overtime, and an overnight shift. Use the existing local-history field names and decimal-hour representation.
- Update root `AGENTS.md` so the agent automatically loads the fixture into the integrated browser before UI/history/report/export testing.
- Seed only an isolated browser context or a test session whose existing localStorage is snapshotted and restored after testing. Do not alter the user's persistent browser data.
- Do not add runtime app code, a UI control, or startup behavior for sample data.

## Risks / Trade-offs

- Browser automation may use a shared profile → isolate it or snapshot and restore localStorage around tests.
- A planned version may change if a release is abandoned or rescheduled → keep version assignment limited to the notes heading and reconcile it before the release merge.

## Migration Plan

No persisted-data migration is required. Existing records are preserved. Remove publication-status text from historical headings, and load sample records only into an isolated integrated-browser test session.

## Open Questions

- None. The button label and test-data behavior were confirmed by the user.
