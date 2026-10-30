# Tasks

## 1. Release-note headings

- [x] 1.1 Remove redundant publication-status suffixes from historical version headings and place pending notes under the planned version ID.
- [x] 1.2 Add tests covering concise release headings.

## 2. Local sample history

- [x] 2.1 After proposal and design approval, add a reusable fixture with 60 consecutive days of varied, valid history records, excluding today.
- [x] 2.2 Update `AGENTS.md` so integrated-browser history tests automatically seed the fixture into isolated/restored browser storage; do not add sample-data UI or runtime startup logic.
- [x] 2.3 Add tests validating fixture record variety, date offsets, and compatibility with the application's history record shape.

## 3. Verification

- [x] 3.1 Run applicable tests, build, and strict OpenSpec validation.
- [x] 3.2 Show the pending startup notice under the planned version ID and test version-based dismissal.
