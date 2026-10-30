# Design

## Context

The main-screen preview is `#history` inside `#historycontainer`. The preview already has a 150px height and vertical scrolling. `setHistory()` creates a three-column table with percentage widths, but the browser's automatic table layout can size columns based on cell contents, and the header is part of the scrolling content. The header should look integrated with the rounded frame and should not scroll with the rows.

The app's animation check in `js/animations.js` runs against the loaded planned end time and starts its easter egg when that time is at or before the current time. Integrated-browser tests must therefore use a predictable future end time and disable automatic end-time-on-close before loading or reloading the app.

The edit-history modal is a separate editable table with its own workflow and is outside this change.

## Goals / Non-Goals

**Goals:**
- Keep the preview's current 150px fixed height and independent vertical scrolling.
- Put the three column headings in a separate, non-scrolling header region.
- Keep the rounded outer frame and header visually fixed while only the rows scroll.
- Give Date, Time (no break), and Overtime stable widths and prevent cell content from shifting the layout.
- Preserve the current newest-first ordering and displayed values.
- Keep header text and cell backgrounds legible in the app's light and dark themes.
- Ensure integrated-browser app loading cannot trigger end-time easter eggs by starting from a deterministic future end time and disabling automatic end-time-on-close.

**Non-Goals:**
- Change history calculations, ordering, data, or editing behavior.
- Change the edit-history modal or its table.
- Add pagination, filters, or new controls.

## Decisions

- Apply `table-layout: fixed` and explicit column proportions to the main preview table. Keep the existing three-column balance unless browser testing shows clipping at supported narrow widths.
- Render the column labels in a fixed header element outside the scrollable rows. Render the rows in a separate table with the same explicit column widths, so no sticky-table-header styling is needed.
- Put border radius and clipping on the outer frame. Give the rows-only region the 150px overall preview height minus the fixed header height, and apply vertical scrolling there; keep the outer frame and header stationary.
- Add a browser-test setup step that snapshots storage, sets `autoend` to `false`, sets `nosave` to today's local date, and seeds today's local-storage record with a deterministic future end time before navigation. Restore the original browser storage after testing.
- Do not make the page itself horizontally scroll.
- Prefer semantic table column definitions and scoped CSS in `css/bootstrap_specific_style.css` over inline sizing rules, following the existing project stylesheet pattern.

## Risks / Trade-offs

- Separate header and row tables can misalign if their column definitions differ → share one explicit column-width rule and test them at desktop and mobile widths.
- Test state can inherit an auto-end preference or today's old record → set `autoend` to `false`, set `nosave` to today's date, seed a known future end time before navigation, and restore the original storage afterward.
- Narrow screens may have limited room for date and time values; verify the layout at mobile widths and adjust fixed proportions or compact spacing without changing page width.

## Verification

- Verify the preview keeps its 150px height when empty and populated.
- Verify scrolling a long history moves rows while the three column headers remain visible.
- Verify the columns stay aligned across all rows and at desktop and mobile viewport widths.
- Run the existing test suite and build; add focused coverage for the preview's layout hooks if the implementation exposes stable selectors.
