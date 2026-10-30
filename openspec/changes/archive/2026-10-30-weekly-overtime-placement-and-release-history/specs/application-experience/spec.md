# Spec Delta

## MODIFIED Requirements

### Requirement: Announce user-facing feature releases

The About dialog MUST show the version of the latest release merged into `master`. A new startup release notice MUST be published only when its PR merges into `master` and MUST show that release and the immediately preceding published notice. Unreleased feature work MUST NOT update the About version.

#### Scenario: Preserve the previous release notice

- **GIVEN** a published release notice exists and a new release PR is ready to merge into `master`
- **WHEN** the PR is merged and the new notice is published
- **THEN** the startup notice MUST describe the new release and visibly include the immediately preceding published release notice

#### Scenario: Publish only on a master merge

- **GIVEN** a cumulative draft release notice exists on `dev`
- **WHEN** no PR carrying that draft has merged into `master`
- **THEN** the application MUST NOT treat the draft as a newly published release or update the About version

#### Scenario: Set the release version at merge

- **GIVEN** a PR carrying the cumulative release notes is merged into `master`
- **WHEN** that merge deploys the release
- **THEN** the published startup notice MUST include all user-facing changes since the prior master merge
- **AND** the About dialog MUST show the matching release version

#### Scenario: Release the weekly overtime adjustment

- **GIVEN** the weekly overtime adjustment is included in a new application release
- **WHEN** a user views the About dialog or the release notice for that version
- **THEN** the About dialog MUST show the updated version and the release notice MUST describe the weekly overtime adjustment

## ADDED Requirements

### Requirement: Maintain versioned release notes

The root-level `RELEASE_NOTES.md` MUST retain an entry for every release version in Git history. On `dev`, it MUST accumulate user-facing changes since the last merge into `master` under `Unreleased`. Do not remove pending notes before that merge; move them into the new version entry when the release PR merges.

#### Scenario: Accumulate notes before release

- **GIVEN** user-facing changes have been made on `dev` since the most recent PR merge into `master`
- **WHEN** another user-facing change is made before the next merge into `master`
- **THEN** its note MUST be added to the `Unreleased` section
- **AND** earlier unreleased notes MUST remain

#### Scenario: Keep pending notes until release

- **GIVEN** a cumulative draft release notice exists on `dev`
- **WHEN** no PR carrying that draft has merged into `master`
- **THEN** the notes MUST remain in the `Unreleased` section of `RELEASE_NOTES.md`

#### Scenario: Preserve release history

- **GIVEN** one or more release versions are identifiable in the repository's commit history
- **WHEN** `RELEASE_NOTES.md` is created or updated
- **THEN** it MUST contain an entry for every identifiable release version
- **AND** adding a new release MUST NOT remove existing version entries

#### Scenario: Record notes under the released version

- **GIVEN** a PR carrying the cumulative release notes is merged into `master`
- **WHEN** that merge deploys the release
- **THEN** the changes MUST be recorded under the new version in `RELEASE_NOTES.md`
