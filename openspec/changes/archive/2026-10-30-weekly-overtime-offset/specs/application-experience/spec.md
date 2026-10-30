# Spec Delta

## ADDED Requirements

### Requirement: Announce user-facing feature releases

The About dialog MUST show the current application version, and the startup release notice MUST describe the user-facing changes in that version.

#### Scenario: Release the weekly overtime adjustment

- **GIVEN** the weekly overtime adjustment is included in a new application release
- **WHEN** a user views the About dialog or the release notice for that version
- **THEN** the About dialog MUST show the updated version and the release notice MUST describe the weekly overtime adjustment
