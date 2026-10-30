## Purpose

Describe how work history is stored, reviewed, edited, transferred, and cleaned up.

## Requirements

### Requirement: Store and list work history locally

The application MUST store work entries and preferences in browser local storage, without requiring an application server or account. Work entries MUST be keyed by `DD-MM-YYYY`. The history view MUST show saved entries newest first and expose the accumulated total and current-week overtime. The compact main-screen history preview MUST use a stable three-column layout and keep its column headings visible while its rows scroll.

#### Scenario: Display saved entries

- **GIVEN** multiple valid dated entries exist in local storage
- **WHEN** the history is displayed
- **THEN** entries MUST be ordered newest first and show date, work time excluding breaks, and overtime

#### Scenario: Keep preview headings visible while scrolling

- **GIVEN** the main-screen history preview contains more entries than fit in its fixed-height viewport
- **WHEN** the user scrolls the preview
- **THEN** the history rows MUST scroll within the preview without changing the page layout
- **AND** the Date, Time (no break), and Overtime headings MUST remain visible
- **AND** each row's values MUST remain aligned under their respective headings

#### Scenario: Preserve the edit-history table

- **GIVEN** the user opens the edit-history modal
- **WHEN** the editable history table is displayed
- **THEN** this preview-layout change MUST NOT alter the modal table's layout or behavior

### Requirement: Edit and delete saved entries

The application MUST provide a searchable history editor that can save or delete an entry. Editing MUST allow the user to change its date, start time, break, worked time, schedule, and summary.

#### Scenario: Save an edited history entry

- **GIVEN** the user changes a saved entry in the history editor
- **WHEN** the user saves that row
- **THEN** the application MUST persist the changed entry and refresh the displayed history

#### Scenario: Delete a history entry

- **GIVEN** the user chooses to delete a saved entry
- **WHEN** the deletion is confirmed
- **THEN** that entry MUST be removed from local storage and history

### Requirement: Import and export local data

The application MUST allow users to export the complete local-storage state as JSON and import JSON data back into local storage. Import MUST update matching keys and retain unrelated existing keys. The application MUST also provide CSV export for valid dated work records that contain overtime data.

#### Scenario: Export a JSON backup

- **GIVEN** the application has local data
- **WHEN** the user exports history as JSON
- **THEN** the downloaded file MUST contain the complete local-storage state

#### Scenario: Import a JSON backup

- **GIVEN** the user selects a valid JSON object for import
- **WHEN** the import completes
- **THEN** imported keys MUST be written to local storage and the application MUST refresh history and settings

#### Scenario: Export history as CSV

- **GIVEN** one or more valid dated work records with overtime data exist
- **WHEN** the user exports CSV
- **THEN** the CSV MUST contain those records and their dates

### Requirement: Clean history and provide scheduled backups

The application MUST support deleting history by age or by a configured recurring reset date. When a due cleanup or backup is processed, it MUST be checked during application startup. A due backup MUST prompt the user and trigger the JSON export flow; it MUST NOT silently upload data to a remote service.

#### Scenario: Remove entries older than the retention period

- **GIVEN** age-based retention is selected
- **WHEN** startup cleanup runs
- **THEN** dated entries older than the configured number of retained days MUST be removed

#### Scenario: Reset history on its scheduled date

- **GIVEN** periodic history reset is selected and its next reset date is due
- **WHEN** startup cleanup runs
- **THEN** dated history entries MUST be deleted and the next reset date MUST be scheduled

#### Scenario: Run a due backup

- **GIVEN** semi-automatic backup is enabled and its next backup date is due
- **WHEN** the application starts
- **THEN** the user MUST be prompted, the JSON export flow MUST run, and the next backup date MUST be scheduled

### Requirement: Provide representative history fixtures for browser testing

The project MUST provide a reusable fixture with one realistic history record for each of the 60 days before today, excluding today.

#### Scenario: Include varied valid records

- **GIVEN** the agent loads the fixture for an integrated-browser test session
- **WHEN** history-dependent UI is tested
- **THEN** records MUST use the application's existing record shape and cover varied schedules, breaks, summaries, overtime balances, and an overnight shift

The agent MUST seed this fixture for each integrated-browser test session that exercises history-dependent UI. Test setup MUST isolate the fixture from the user's persistent browser data or restore the original storage after testing.

#### Scenario: Seed history for integrated-browser testing

- **GIVEN** the agent starts an integrated-browser test session that exercises history-dependent behavior
- **WHEN** the app is loaded in the test session
- **THEN** the agent MUST seed recent sample records from the reusable fixture
- **AND** the app MUST show populated history-dependent views for the test

#### Scenario: Preserve the user's browser data

- **GIVEN** the integrated browser has pre-existing localStorage data
- **WHEN** the agent seeds the sample history fixture for testing
- **THEN** the test MUST use an isolated context or preserve and restore the original storage
- **AND** sample records MUST NOT be left in the user's persistent browser profile

#### Scenario: Keep sample data out of application behavior

- **GIVEN** the application is opened outside an agent-managed integrated-browser test
- **WHEN** the page loads
- **THEN** the app MUST NOT seed sample data or display a sample-data control
