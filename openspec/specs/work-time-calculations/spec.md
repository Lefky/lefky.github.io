## Purpose

Specify the application's time conversions and work-time, net-time, and overtime calculations.

## Requirements

### Requirement: Convert between decimal hours and clock time

The application MUST display decimal-hour values as `HH:mm`, rounding to the nearest minute, and MUST convert entered `HH:mm` values to decimal hours for calculations. A stored correction marker MUST remain distinguishable from a numeric time.

#### Scenario: Convert a decimal duration

- **GIVEN** a duration of 7.5 decimal hours
- **WHEN** it is formatted for display
- **THEN** the displayed value MUST be `07:30`

#### Scenario: Preserve a correction marker

- **GIVEN** a time value marked as `correction`
- **WHEN** it is formatted for display
- **THEN** the marker MUST remain `correction`

### Requirement: Calculate elapsed and net work time

The application MUST calculate elapsed time across midnight and return work time to two decimal places. Net work time MUST equal elapsed work time minus the break duration. When a positive schedule is configured and net work time is within 0.02 hours of that schedule, elapsed work time MUST be normalized to the scheduled hours plus the break duration.

#### Scenario: Normalize a workday close to its schedule

- **GIVEN** a schedule of 7.6 hours, no break, and elapsed time of 7.61 hours
- **WHEN** work time is calculated
- **THEN** the elapsed work time MUST be normalized to 7.60 hours

#### Scenario: Keep work time outside the normalization threshold

- **GIVEN** a schedule of 8 hours, no break, and elapsed time of 8.02 hours
- **WHEN** work time is calculated
- **THEN** the elapsed work time MUST remain 8.02 hours

### Requirement: Calculate daily overtime

The application MUST calculate overtime as elapsed work time minus break time minus scheduled hours, rounded to two decimal places. For a positive schedule, absolute overtime differences of at most 0.015 hours MUST be treated as zero to suppress rounding noise. With a zero-hour schedule, net work time MUST count as overtime.

#### Scenario: Calculate positive overtime

- **GIVEN** 8.5 hours elapsed, a 0.5-hour break, and a 7.6-hour schedule
- **WHEN** overtime is calculated
- **THEN** overtime MUST be 0.40 hours

#### Scenario: Suppress schedule rounding noise

- **GIVEN** the calculated overtime differs from zero by no more than 0.015 hours and the schedule is positive
- **WHEN** overtime is calculated
- **THEN** the result MUST be `0.00`

#### Scenario: Treat unscheduled work as overtime

- **GIVEN** a zero-hour schedule and 8 hours of work with no break
- **WHEN** overtime is calculated
- **THEN** overtime MUST be 8.00 hours
