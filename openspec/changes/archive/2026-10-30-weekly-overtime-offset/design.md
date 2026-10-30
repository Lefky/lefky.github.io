# Design

## Context

The UI already calculates the current week's overtime from saved entries and displays the total in the history summary. The end-time field is editable, and changing it recalculates today's displayed totals.

## Goals / Non-Goals

**Goals:**
- Reuse the displayed weekly balance and existing end-time recalculation behavior.
- Keep time adjustment correct for shifts crossing midnight.
- Keep the change local to the current entry; do not persist a separate balance or alter history.

**Non-Goals:**
- Change how daily or weekly overtime is calculated.
- Automatically save or apply the adjusted time without the user's action.

## Decisions

- Keep the numeric weekly balance in UI module state as history is refreshed. This avoids parsing its signed, formatted display value and ensures the action uses the same total that is shown to the user. Exclude today's saved entry, consistent with the weekly overtime label.
- Put the time arithmetic in a pure helper in `time-calc.js`. Interpret the planned end relative to the start, subtract the signed balance from the planned shift duration, clamp the duration at zero, and wrap the resulting clock time across midnight. This supports deterministic unit tests and prevents a large positive balance from moving the planned end before the shift start.
- Expose the UI action through the existing `main.js` global API so the HTML button can continue using the project's inline-handler pattern.
- Label the action “Use overtime” and use the `fal fa-minus` icon so the feature's final control design is documented alongside its original behavior.
- Update the About version to `20261030.1` and add a feature description to the existing release notice.

## Risks / Trade-offs

- The weekly balance is based on saved entries and the existing history refresh cadence → refresh history whenever it is rendered, as the application already does.
- A balance larger than today's planned shift cannot all be used without placing the end before the shift starts → clamp the adjusted end time to the start.

## Migration Plan

No data migration is required. Rollback consists of removing the control and action while preserving existing history entries and settings.
