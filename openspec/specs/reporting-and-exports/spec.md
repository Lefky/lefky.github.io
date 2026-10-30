## Purpose

Describe the reporting views and downloadable reports produced from local work history.

## Requirements

### Requirement: Filter reports by date

The reporting view MUST allow users to select a start and end date and provide shortcuts for week-to-date, previous week, month-to-date, previous month, year-to-date, and all-time ranges.

#### Scenario: Change the reporting period

- **GIVEN** saved work history exists
- **WHEN** the user selects a reporting range
- **THEN** the reporting metrics and charts MUST be recalculated for that range

### Requirement: Visualize work history

The reporting view MUST provide charts for registered days, average start and end times, daily and cumulative overtime, overtime-day distribution, work schedules, breaks, gross and net work time, and a total overtime gauge.

#### Scenario: Render reports for a selected period

- **GIVEN** the user has selected a date range
- **WHEN** the reporting view is drawn
- **THEN** the charts MUST be based on the saved entries within that period

### Requirement: Estimate earnings from a configured rate

The reporting view MUST allow a rate to be entered as hourly or monthly and display estimated earnings based on the saved work history. Monthly rates MUST use the application's stated assumption of 22 workdays per month.

#### Scenario: Calculate a monthly-rate estimate

- **GIVEN** a monthly rate has been entered
- **WHEN** reporting is calculated
- **THEN** the earnings estimate MUST use 22 workdays per month

### Requirement: Export a date-ranged PDF report

The application MUST let users select a date range and generate a PDF report containing the selected period, recorded-day count, total recorded hours, total overtime, and a table of matching entries with date, start, end, total, overtime, and summary.

#### Scenario: Generate a PDF for a selected range

- **GIVEN** the user has selected a start and end date
- **WHEN** the user generates the PDF report
- **THEN** the report MUST include only matching dated entries and the corresponding summary totals
