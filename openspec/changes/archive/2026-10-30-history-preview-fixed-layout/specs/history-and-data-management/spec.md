# Spec Delta

## MODIFIED Requirements

### Requirement: Store and list work history locally

The application MUST store work entries and preferences in browser local storage, without requiring an application server or account. Work entries MUST be keyed by `DD-MM-YYYY`. The history view MUST show saved entries newest first and expose the accumulated total and current-week overtime. The compact main-screen history preview MUST use a stable three-column layout, keep its outer frame and column headings fixed, and scroll only its history rows.

#### Scenario: Display saved entries

- **GIVEN** multiple valid dated entries exist in local storage
- **WHEN** the history is displayed
- **THEN** entries MUST be ordered newest first and show date, work time excluding breaks, and overtime

#### Scenario: Keep preview headings visible while scrolling

- **GIVEN** the main-screen history preview contains more entries than fit in its fixed-height viewport
- **WHEN** the user scrolls the preview
- **THEN** only the history rows MUST scroll within the preview
- **AND** the outer frame and separate Date, Time (no break), and Overtime headings MUST remain fixed
- **AND** each row's values MUST remain aligned under their respective headings

#### Scenario: Preserve the edit-history table

- **GIVEN** the user opens the edit-history modal
- **WHEN** the editable history table is displayed
- **THEN** this preview-layout change MUST NOT alter the modal table's layout or behavior
