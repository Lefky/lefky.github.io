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

### Requirement: Apply weekly overtime to the planned end time

The application MUST provide a control labeled “Use overtime” in the quick-action button group beside “End time now.” Its minus icon MUST use the `fal` Font Awesome class. The control MUST adjust the planned end time by subtracting the signed overtime balance from earlier days in the current week, recalculate today's displayed work totals, and MUST NOT move the end time earlier than today's start time. The planned end-time input MUST remain aligned with the other time inputs.

#### Scenario: Keep end-time field alignment

- **GIVEN** the user views the planned end-time field and the quick-action controls
- **WHEN** the weekly overtime action is available
- **THEN** the action MUST appear beside “End time now” in the quick-action group
- **AND** the planned end-time input MUST remain aligned with the other time inputs

#### Scenario: Use positive weekly overtime

- **GIVEN** today's planned shift is 08:00 to 17:00 and saved overtime from earlier this week is 2 hours
- **WHEN** the user applies weekly overtime to the planned end time
- **THEN** the planned end time MUST become 15:00 and today's displayed totals MUST be recalculated

#### Scenario: Exclude today's saved entry from the weekly balance

- **GIVEN** a saved entry for today and saved entries from earlier this week
- **WHEN** the weekly overtime balance is applied to today's planned end time
- **THEN** the overtime from today's saved entry MUST NOT be included in the adjustment

#### Scenario: Account for a weekly overtime deficit

- **GIVEN** today's planned shift is 08:00 to 17:00 and saved overtime from earlier this week is -1 hour
- **WHEN** the user applies weekly overtime to the planned end time
- **THEN** the planned end time MUST become 18:00

#### Scenario: Adjust an overnight shift

- **GIVEN** today's planned shift starts at 22:00 and ends at 06:00, with 1 hour of saved overtime from earlier this week
- **WHEN** the user applies weekly overtime to the planned end time
- **THEN** the planned end time MUST become 05:00 on the following day

#### Scenario: Do not set an end time before the shift starts

- **GIVEN** today's planned shift is 08:00 to 17:00 and saved overtime is greater than the planned shift duration
- **WHEN** the user applies weekly overtime to the planned end time
- **THEN** the planned end time MUST be set to 08:00 rather than before the shift start

#### Scenario: Identify the overtime action

- **GIVEN** the user views the quick-action button group
- **WHEN** the weekly overtime control is shown
- **THEN** its label MUST read “Use overtime”
- **AND** its minus icon MUST use the `fal` class
