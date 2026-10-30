# Tasks

## 1. Main history preview layout

- [x] 1.1 Give the main preview header and rows separate but identically aligned fixed-column layouts without changing displayed history data or ordering.
- [x] 1.2 Keep the outer rounded frame and header stationary while only the rows scroll.
- [x] 1.3 Confirm the preview remains usable at desktop and mobile widths; leave the edit-history modal unchanged.
- [x] 1.4 Snapshot browser storage, set `autoend` to false and `nosave` to today, and seed a deterministic future current-day record before browser-test navigation; restore original storage after testing.

## 2. Verification

- [x] 2.1 Run applicable tests, build, and strict OpenSpec validation.
- [x] 2.2 Verify the fixed-height preview, stationary rounded frame/header, and rows-only scrolling in the integrated browser at desktop and mobile widths.
