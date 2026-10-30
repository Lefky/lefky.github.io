# Tasks

## 1. Overtime adjustment calculation

- [x] 1.1 Add a pure helper that applies signed weekly overtime to a planned shift end, handles midnight, and clamps at the shift start; add unit tests for the positive, negative, overnight, and clamp scenarios and run `node --test test/time-calc.test.js`.

## 2. UI and release communication

- [x] 2.1 Track the numeric weekly overtime balance from earlier days as history is refreshed, expose the adjustment through the existing UI API, and add a button by the planned end-time field; verify the project builds with `npm run build`.
- [x] 2.2 Update the About version and startup release notice, and add root-level `AGENTS.md` project guidance; verify the version, release-note text, and instructions are present in their intended files.

## 3. Integration verification

- [x] 3.1 Run `npm test`, `npm run build`, and `npx @fission-ai/openspec validate --all --strict --no-interactive`; confirm all checks pass and the generated bundle is current.

## Workflow follow-up

- [x] Archive the change after implementation and verification are complete.
- [x] Verify the archived specs match the implemented behavior.
