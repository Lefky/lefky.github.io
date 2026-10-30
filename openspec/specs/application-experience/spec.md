## Purpose

Describe the application's saved presentation preferences, end-of-day feedback, and installable/offline shell.

## Requirements

### Requirement: Persist presentation preferences

The application MUST let users choose automatic, light, or dark appearance and MUST retain the selection in browser local storage. It MUST also let users show or hide overtime, total hours, weekly and total overtime, summaries, history, and parameters.

#### Scenario: Follow the system appearance

- **GIVEN** automatic appearance is selected
- **WHEN** the page loads
- **THEN** the application MUST choose the light or dark theme based on the system color-scheme preference

#### Scenario: Restore display preferences

- **GIVEN** the user has changed display preferences
- **WHEN** the application is reopened
- **THEN** the saved preferences MUST be restored

### Requirement: Notify users when the workday ends

When the configured end time is reached, the application MUST show its end-of-day animation and play its notification sound. It MUST send a browser notification only when notification permission has been granted.

#### Scenario: End time reached without notification permission

- **GIVEN** the current time reaches the configured end time and notification permission has not been granted
- **WHEN** the end-of-day check runs
- **THEN** the in-page feedback and sound MAY play, but no browser notification MUST be created

#### Scenario: End time reached with notification permission

- **GIVEN** the current time reaches the configured end time and notification permission is granted
- **WHEN** the end-of-day check runs
- **THEN** the application MUST create a browser notification in addition to its in-page feedback

### Requirement: Support installation and navigation fallback

The application MUST provide a web-app manifest and register its service worker when served over HTTP(S). The service worker MUST use network-first handling for page navigations and return the cached offline page when the navigation request fails.

#### Scenario: Navigate while online

- **GIVEN** the service worker is active and the network is available
- **WHEN** the user navigates to an application page
- **THEN** the service worker MUST attempt to serve the network response

#### Scenario: Navigate after a network failure

- **GIVEN** the offline page has been cached and a navigation request fails
- **WHEN** the service worker handles the request
- **THEN** it MUST return the cached offline page

### Requirement: Adapt wide views on mobile devices

When the history editor or reporting view is opened on a supported mobile browser, the application MUST attempt to enter fullscreen landscape orientation and MUST attempt to release those modes when the view is closed. Failure of browser fullscreen or orientation APIs MUST NOT prevent the view from being used.

#### Scenario: Open a wide view on mobile

- **GIVEN** the user opens the history editor or reporting view on a mobile device
- **WHEN** the view becomes active
- **THEN** the application MUST attempt to request fullscreen and lock landscape orientation

### Requirement: Announce user-facing feature releases

The About dialog MUST show the version of the latest release merged into `master`. A new startup release notice MUST be published only when its PR merges into `master` and MUST show that release and the immediately preceding published notice. A pending startup notice on `dev` MUST use the planned version ID as its heading, matching `RELEASE_NOTES.md`, and MUST NOT imply publication. Pending feature work MUST NOT update the About version.

#### Scenario: Label the pending startup notice with its planned version

- **GIVEN** pending notes for the planned version are shown in the startup notice on `dev`
- **WHEN** the user views the notice
- **THEN** its heading MUST show the same version ID as the pending entry in `RELEASE_NOTES.md`
- **AND** it MUST NOT be labeled “Unreleased changes” or imply that the version is already published

#### Scenario: Preserve the previous release notice

- **GIVEN** a published release notice exists and a new release PR is ready to merge into `master`
- **WHEN** the PR is merged and the new notice is published
- **THEN** the startup notice MUST describe the new release and visibly include the immediately preceding published release notice

#### Scenario: Keep pending notes unpublished until a master merge

- **GIVEN** pending notes for the planned version exist on `dev`
- **WHEN** that version has not merged into `master`
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

### Requirement: Maintain versioned release notes

The root-level `RELEASE_NOTES.md` MUST preserve a versioned entry for every identifiable release. On `dev`, pending notes MUST use the planned next version ID, not an `Unreleased` heading. A merge into `master` publishes that version.

#### Scenario: Accumulate notes under the planned version

- **GIVEN** user-facing changes have been made on `dev` since the most recent PR merge into `master`
- **WHEN** another user-facing change is made before the next merge into `master`
- **THEN** its note MUST be added under the planned next release version ID
- **AND** earlier pending notes MUST remain under that version ID
- **AND** a PR MUST NOT be required before adding the note

#### Scenario: Reconcile an abandoned or renumbered release

- **GIVEN** a planned release is abandoned or its version changes before merging into `master`
- **WHEN** the next release version is determined
- **THEN** pending notes MUST be kept and the heading MUST be updated to the version that will merge

#### Scenario: Preserve release history

- **GIVEN** one or more release versions are identifiable in the repository's commit history
- **WHEN** `RELEASE_NOTES.md` is created or updated
- **THEN** it MUST contain an entry for every identifiable release version
- **AND** adding a new release MUST NOT remove existing version entries

#### Scenario: Record notes under the released version

- **GIVEN** a PR carrying the cumulative release notes is merged into `master`
- **WHEN** that merge deploys the release
- **THEN** the changes MUST be recorded under the planned version in `RELEASE_NOTES.md`
- **AND** the planned version heading MUST become the published version entry

### Requirement: Use concise release-note version headings

The root-level `RELEASE_NOTES.md` MUST show version-only headings for release entries, without a redundant branch or publication-status suffix. Pending changes on `dev` MUST also be grouped under the planned next version ID, not an `Unreleased` heading.

#### Scenario: Show concise release headings

- **GIVEN** a release version has a versioned entry in `RELEASE_NOTES.md`
- **WHEN** a reader views the version heading
- **THEN** the heading MUST show the version without “Published on master” or another branch-status suffix

#### Scenario: Identify pending notes by planned version

- **GIVEN** user-facing changes have not yet been released
- **WHEN** they are recorded in `RELEASE_NOTES.md`
- **THEN** they MUST appear under the planned next version ID
- **AND** the file MUST NOT contain an `Unreleased` section
