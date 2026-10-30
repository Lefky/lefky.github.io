# Spec Delta

## ADDED Requirements

### Requirement: Use concise release-note version headings

The root-level `RELEASE_NOTES.md` MUST show version-only headings for release entries, without a redundant branch or publication-status suffix. Pending changes on `dev` MUST be grouped under the planned next version ID, not an `Unreleased` heading.

#### Scenario: Label the pending startup notice with its planned version

- **GIVEN** pending notes for the planned version are shown in the startup notice on `dev`
- **WHEN** the user views the notice
- **THEN** its heading MUST show the same version ID as the pending entry in `RELEASE_NOTES.md`
- **AND** it MUST NOT be labeled “Unreleased changes” or imply that the version is already published

#### Scenario: Show concise release headings

- **GIVEN** a release version has a versioned entry in `RELEASE_NOTES.md`
- **WHEN** a reader views the version heading
- **THEN** the heading MUST show the version without “Published on master” or another branch-status suffix

#### Scenario: Identify pending notes by planned version

- **GIVEN** user-facing changes have not yet been released
- **WHEN** they are recorded in `RELEASE_NOTES.md`
- **THEN** they MUST appear under the planned next version ID
- **AND** the file MUST NOT contain an `Unreleased` section
