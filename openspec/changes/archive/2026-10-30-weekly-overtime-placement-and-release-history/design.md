# Design

## Context

The planned end-time input and the weekly overtime button currently share the same wrapper. This causes the input row to take on a different layout from the other time fields. The existing quick-action group already contains “End time now.” Release announcements are static markup in `index.html`, with dismissal state tracked by the current application version. A merge into `master` deploys the application and is the release boundary.

## Goals / Non-Goals

**Goals:**
- Put the weekly overtime action beside “End time now” in the existing quick-action group.
- Restore the end-time input row to the same aligned layout as the other time fields.
- Preserve the latest and immediately preceding release announcements in the startup notification area.
- Maintain a complete, permanent `RELEASE_NOTES.md` with all release versions identifiable in the commit history.
- Accumulate draft release notes on `dev` for all user-facing changes since the most recent merge into `master`.
- Publish a new startup release notice only when the PR carrying the accumulated notes merges into `master`.
- Require explicit user approval of OpenSpec proposal and design before implementation.

**Non-Goals:**
- Change weekly overtime calculations or the action's existing behavior.
- Publish notifications for individual feature changes before the release PR merges into `master`.
- Replace existing release notices without preserving at least the immediately preceding release.

## Decisions

- Remove the overtime action from the end-time input wrapper and add it as a sibling button in the existing quick-action button group, adjacent to “End time now.” Keep the time input in the same wrapper/layout pattern as other time fields.
- Create root-level `RELEASE_NOTES.md` with a section for every release version identifiable in the commit history; preserve all historical and future version sections.
- On `dev`, add each user-facing change since the last merge into `master` to an `Unreleased` section in `RELEASE_NOTES.md` and to the cumulative pending startup notice. Do not remove earlier draft notes while that release is still unreleased.
- Treat the merge into `master` as publication: move the complete accumulated notes into the new version section in `RELEASE_NOTES.md` and publish them as the newest startup notice only when merged. Preserve the immediately preceding published release notice alongside it.
- Update the About version as part of the release PR that merges into `master`, not for individual unreleased feature changes.
- Treat explicit approval of the OpenSpec proposal and design as a prerequisite to code changes. If the user changes the design or proposal, update the artifacts and seek approval again before implementation.

## Risks / Trade-offs

- Showing two release entries may make the startup notice longer → keep each entry concise and label it with its version.
- A release PR may be delayed or abandoned → its notes remain under `Unreleased` on `dev` and are not published to users until the merge into `master`.

## Migration Plan

No persisted data migration is expected. Move the control in markup, initialize `RELEASE_NOTES.md` from release versions in the commit history, keep draft notes cumulative on `dev`, and publish the versioned notice and About version with the merge into `master`. Preserve existing dismissal behavior for the current release and the prior notice.

## Open Questions

- Confirm whether the previous published release notice should be visible alongside the newest notice at startup, as assumed here, or retained only for later access.
