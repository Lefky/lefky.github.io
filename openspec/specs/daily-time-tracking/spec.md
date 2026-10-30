## Purpose

Describe how users record a workday and how the application maintains the current entry.

## Requirements

### Requirement: Capture a daily work entry

The application MUST let users enter a start time, end time, break, work schedule, and optional summary for the current day. It MUST display the elapsed work time, work time excluding breaks, and overtime derived from those values.

#### Scenario: Calculate a workday that crosses midnight

- **GIVEN** a start time of 22:00 and an end time of 06:00
- **WHEN** the application calculates the entry
- **THEN** it MUST treat the elapsed work time as 8 hours rather than a negative duration

#### Scenario: Enter a break

- **GIVEN** the user has selected duration-based break input
- **WHEN** the user enters a break duration
- **THEN** the application MUST use that duration when calculating net work time and overtime
- **WHEN** the user selects time-range break input instead
- **THEN** the application MUST derive the break duration from the entered start and end times

### Requirement: Provide break-time controls

The application MUST provide a configurable default break, quick controls to add or reset break time, and a stopwatch control that updates the break duration while running.

#### Scenario: Use the break stopwatch

- **GIVEN** a work entry is open
- **WHEN** the user starts and then stops the break stopwatch
- **THEN** the measured elapsed time MUST be applied as the break duration and the displayed work totals MUST be recalculated

### Requirement: Select a work schedule

The application MUST provide preset daily schedules and allow a custom schedule. A schedule change MUST be applicable only to the current day unless the user confirms that it should become the default for subsequent days.

#### Scenario: Save a custom schedule

- **GIVEN** the user enters a custom schedule
- **WHEN** the custom value is applied
- **THEN** it MUST become available in the schedule selector and be used in the current day's calculations

### Requirement: Persist the current day's entry

When the page is unloaded, the application MUST save the current day's entry in browser local storage under a `DD-MM-YYYY` key, including start time, scheduled hours, gross work time, net work time, overtime, and summary. The application MUST honor the “Don't save today” control and MUST honor the configured automatic end-time behavior, including its current-session and current-day overrides.

#### Scenario: Save an entry on page unload

- **GIVEN** saving is enabled
- **WHEN** the user closes or refreshes the page
- **THEN** the current entry MUST be stored under the current local date

#### Scenario: Skip saving today's entry

- **GIVEN** the user enables “Don't save today”
- **WHEN** the page is unloaded
- **THEN** the current day's entry MUST NOT be written to history

#### Scenario: Automatically set the end time

- **GIVEN** automatic end-time behavior is enabled without a current-session or current-day override
- **WHEN** the page is unloaded
- **THEN** the end time MUST be set to the current time before the entry is saved
