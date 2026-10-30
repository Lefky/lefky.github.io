# Proposal

## Why

Users can see their overtime balance for the current week but cannot directly use that balance when choosing today's planned end time. A one-click adjustment makes it easier to offset accumulated weekly overtime against today's scheduled end time.

## What Changes

- Add a control labeled “Use overtime” with a `fal fa-minus` icon that subtracts the signed current-week overtime balance from the planned end time and recalculates today's displayed totals.
- Update the About version and release notification to describe the weekly overtime adjustment.
- Add project-level agent guidance for OpenSpec use, branch/push expectations, and release-note/version updates.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `daily-time-tracking`: Allow applying the current week's saved overtime balance to today's planned end time.
- `application-experience`: Identify the feature in the current version and release notification.

## Impact

- Main entry point UI in `index.html`, with the action implemented in the existing ES module UI and exposed to the legacy inline-handler API.
- OpenSpec deltas and root-level `AGENTS.md`.
- No new runtime dependencies or data format changes.
