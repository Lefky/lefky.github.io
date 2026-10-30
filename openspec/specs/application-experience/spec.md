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
