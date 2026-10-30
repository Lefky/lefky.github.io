# Spec Delta

## ADDED Requirements

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
