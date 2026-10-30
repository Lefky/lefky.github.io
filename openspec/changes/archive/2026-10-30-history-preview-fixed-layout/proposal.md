# Proposal

## Why

The compact history preview on the main screen scrolls independently, but its header scrolls out of view and content can affect the table's column sizing. This makes dates, worked time, and overtime harder to track while reviewing many entries.

## What Changes

- Keep the main-screen history preview at a fixed height with its own vertical scrolling.
- Keep the Date, Time (no break), and Overtime headings in a separate, non-scrolling header above the scrollable history rows.
- Use a fixed table layout with stable column widths so rows remain aligned while scrolling.
- Keep the outer rounded history frame fixed; only the history rows should scroll, not the header or frame.
- Leave the edit-history modal and its editable table unchanged.
- During integrated-browser testing, disable automatic end-time-on-close and seed a current-day entry with a deterministic future end time before loading the page, so testing cannot trigger end-time easter eggs or replace the test end time.

## Capabilities

### Modified Capabilities

- `history-and-data-management`: Make the main-screen history preview stable and readable while scrolling.

## Assumptions

- “History area” refers to the compact history preview on the main screen, not the edit-history modal.
- Preserve the current preview height of 150px; the layout change is about stable columns and a persistent header, not making the panel taller.
- The preview remains usable at narrow viewport widths without horizontal page overflow.
- Test setup may use localStorage and page controls to set a deterministic future end time; it must restore browser storage after testing.
