# Spec Delta

## MODIFIED Requirements

### Requirement: Apply weekly overtime to the planned end time

The application MUST provide a control in the quick-action button group beside “End time now” that adjusts the planned end time by subtracting the signed overtime balance from earlier days in the current week, then recalculates today's displayed work totals. The planned end-time input MUST remain aligned with the other time inputs. The adjustment MUST NOT move the end time earlier than today's start time.

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
