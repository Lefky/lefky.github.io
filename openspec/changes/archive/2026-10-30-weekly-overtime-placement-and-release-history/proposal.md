# Proposal

## Why

The weekly overtime action currently sits beside the planned end-time input, disrupting the time-field alignment. Release announcements are also being written during feature implementation rather than being reserved for an actual release merge, and a new announcement should not erase the previous release notice.

## What Changes

- Move the weekly overtime action into the existing quick-action button group beside “End time now,” leaving the planned end-time input aligned with the other time fields.
- Add `RELEASE_NOTES.md` with an entry for every release version identifiable in the commit history; preserve existing and future version entries.
- Keep a cumulative unreleased section in `RELEASE_NOTES.md` and a matching draft startup notice on `dev`, adding changes made since the last PR merge to `master` without removing earlier notes.
- Publish the accumulated notes as a new startup release notification only when the release PR merges into `master`, since that merge deploys the application.
- On the release merge, move the accumulated notes into the new version entry in `RELEASE_NOTES.md`.
- Show the latest and immediately preceding published release notifications together after a release PR merges into `master`.
- Do not update the About version for unreleased feature work; update it for the release PR that merges into `master`.
- Require explicit user approval of OpenSpec proposal and design artifacts before implementation begins.

## Capabilities

### Modified Capabilities

- `daily-time-tracking`: Place the weekly overtime action with the end-time quick actions and preserve end-time field alignment.
- `application-experience`: Maintain complete versioned release notes, accumulate pending notes between master merges, publish them on merge, and keep the previous published announcement visible.

## Assumptions to Confirm

- The pending release-note draft is maintained on `dev`; it is not published to live users until the PR merges into `master`.
- The root-level history file is named `RELEASE_NOTES.md`; its initial version entries are reconstructed from release versions identifiable in the commit history.
- “Keep at least 1 previous release notification” means show the newest and immediately preceding published release announcements together after a master merge.
