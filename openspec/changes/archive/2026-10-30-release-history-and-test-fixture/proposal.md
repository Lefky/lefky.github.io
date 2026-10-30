# Proposal

## Why

The release notes should identify the planned release version directly, rather than maintain an `Unreleased` section that must later be reconciled with an uncertain PR. The release history also repeats a branch status that the user considers implicit. The app needs safe, representative recent history for manually exploring reports, exports, and history controls.

## What Changes

- Simplify historical release-note headings to show the version without a redundant “Published on master” status.
- Replace the `Unreleased` section with a heading for the next planned version on `dev`. Keep pending user-facing notes under that version ID in `RELEASE_NOTES.md`; do not require a PR to exist before adding them.
- When a pending release notice is shown on `dev`, label it with the same planned version ID as `RELEASE_NOTES.md`, not “Unreleased changes.” Keep its content consistent with that version's notes and do not imply that it has been published.
- Retain the planned version ID while work accumulates on `dev`. If a release PR is abandoned or its release version changes, update the heading and notes to match the next release that will actually merge.
- Publish the About version and startup release notice only when the release PR merges into `master`; keep the immediately preceding published notice.
- Add a reusable sample-history fixture with 60 consecutive days of varied work records for integrated-browser testing.
- Instruct the agent to seed the fixture automatically into each integrated-browser test session, without adding any sample-data UI or application startup behavior.
- Keep sample test data isolated from the user's saved browser profile by using a dedicated test context or snapshotting and restoring storage.

## Capabilities

### Modified Capabilities

- `application-experience`: List historical versions without redundant publication-status labels.
- `application-experience`: Track pending release notes under the planned version ID without an `Unreleased` section; publish the version only at the `master` merge.
- `history-and-data-management`: Provide representative recent sample data automatically in integrated-browser test sessions without changing normal application data.

## Assumptions

- “Use overtime” is the requested button label.
- The application has no sample-data button or automatic sample-data startup behavior; the agent loads the fixture during integrated-browser testing.
- Test browser storage is isolated or restored after each test, so sample data never becomes the user's saved history.
- Sample records cover the 60 days before today, excluding today, and include varied schedules, break durations, summaries, positive/negative/zero overtime, and an overnight shift. Existing records for dates in the sample range are preserved.
- The planned version ID is used as the release-notes heading on `dev`; a PR need not exist before pending notes are recorded.
- The current planned version ID is `20261030.1`, unless the user specifies another version before implementation.
