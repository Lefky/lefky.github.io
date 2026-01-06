# Project Roadmap & Feature Concepts

This document outlines the planned features and improvements for the Working Hours app.

## 1. Functionality & Productivity

### Project & Category Labeling
* **Goal:** Allow users to categorize time entries (e.g., "Admin", "Development", "Meeting") for better reporting insights.
* **Approach:**
    * **Parsing:** Auto-detect hashtags in the summary field (e.g., "Worked on #projectA").
    * **UI:** Alternatively, add a dedicated dropdown for category selection.
    * **Result:** Generate reports showing time distribution (e.g., "20% Meetings, 80% Development").

### Focus Timer (Pomodoro)
* **Goal:** Expand the break timer to support focused work sessions.
* **Approach:** Implement a Pomodoro-style loop (e.g., 25m work / 5m break) using the existing notification system to alert users when a session ends.

### Earnings Calculator
* **Goal:** Enable freelancers and contractors to track estimated earnings.
* **Approach:** Add a configurable "Hourly Rate" setting. The app will multiply total decimal hours by this rate to display daily and weekly income.

## 2. Reporting & Export

### PDF Report Generation
* **Goal:** Generate professional, read-only timesheets suitable for signing and submission to employers.
* **Approach:** Integrate a client-side library like `jspdf` or `html2pdf` to render the monthly history table into a clean PDF format.
* **Status:** Implemented!

### Visual Calendar View
* **Goal:** Provide a "bird's-eye view" of attendance to easily spot gaps, holidays, or overtime patterns.
* **Approach:** Use CSS Grid to render a monthly calendar interface, using color-coded indicators for workdays, weekends, and absences.

## 3. Technical Architecture

### Cloud Sync & Backup
* **Goal:** Prevent data loss if the browser cache is cleared or the device fails.
* **Approach:**
    * **MVP:** Integrate with Google Drive or Dropbox APIs to auto-save JSON backups.
    * **Future:** Explore a lightweight backend (Firebase/Supabase) to allow syncing between mobile and desktop.

### Modular Refactoring (ES6)
* **Goal:** Improve code maintainability by breaking down the monolithic `javascript.js` file.
* **Approach:** Refactor the codebase into logical ES6 modules:
    * `storage.js` (Data persistence)
    * `ui.js` (DOM interactions)
    * `time-logic.js` (Calculations)

## 4. User Experience (UX)

### Keyboard Shortcuts
* **Goal:** Speed up interaction for power users.
* **Approach:** Map hotkeys to common actions:
    * `Space`: Toggle timer.
    * `Ctrl+S`: Save entry.
    * `Esc`: Close modals.

### Custom Accent Colors
* **Goal:** Allow personalization beyond the standard "Bootstrap Blue".
* **Approach:** Add a color picker in settings that overrides the CSS variables (e.g., `:root { --bs-primary: ... }`) for the main theme color.
