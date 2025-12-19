# Working Hours Tracker

A lightweight, privacy-focused Progressive Web Application (PWA) to track your daily working hours, breaks, and overtime balance. Built with modern Vanilla JavaScript and Bootstrap 5.

![License](https://img.shields.io/badge/license-MIT-green)
![Status](https://img.shields.io/badge/status-active-success)

## 🔗 Live Application

**Use the app directly in your browser here:**
### [https://lefky.github.io/](https://lefky.github.io/)

---

## 📖 Overview

**Working Hours** is a client-side application designed to help employees and freelancers keep track of their time. It calculates overtime based on customizable daily schedules (e.g., 7.6h, 8h, 4/5th schedules) and visualizes your history with interactive charts.

Since it runs entirely in the browser using `localStorage`, your data never leaves your device unless you explicitly export it.

## ✨ Features

### 🕒 Time Tracking
* **Automatic Start/End:** Options to auto-start the timer on open and auto-set end time on close.
* **Break Management:** Track breaks via duration, specific time ranges, or a built-in stopwatch.
* **Overtime Calculation:** Automatically calculates daily and weekly overtime based on your selected schedule.

### 📊 Reporting & Visualization
* **Dashboard:** View daily, weekly, and total overtime at a glance.
* **Graphs:** Interactive Google Charts (Area, Bar, Gauge, Pie) to visualize trends, start/stop times, and schedule distribution.
* **History:** Searchable and editable history table to fix past entries.

### ⚙️ Customization
* **Themes:** Automatic Dark/Light mode detection based on system preferences.
* **Schedules:** Support for various working patterns (Full-time, Part-time, Custom hours).
* **Parameters:** Configurable start-time offsets (e.g., subtract 5 mins for boot time).

### 🛠 Technical Highlights
* **Zero jQuery:** Refactored to 100% Vanilla JavaScript for better performance.
* **PWA Support:** Installable as a native-like app on mobile and desktop (via Service Worker & Manifest).
* **Offline First:** Works without an internet connection.
* **Privacy:** Data stored locally in `localStorage`.

## 🚀 Getting Started

### Prerequisites
You only need a modern web browser (Chrome, Firefox, Edge, Safari). No backend or database is required.

### Installation / Usage
1.  **Clone the repository:**
    ```bash
    git clone [https://github.com/Lefky/lefky.github.io.git](https://github.com/Lefky/lefky.github.io.git)
    ```
2.  **Open the app:**
    Simply open the `index.html` file in your browser.

    *Or serve it locally:*
    ```bash
    npx serve .
    ```

3.  **Setup:**
    On the first load, a "Getting Started" wizard will guide you through the basic configuration.

## 💾 Data Management

* **Export:** You can export your history to a JSON file (for backup/restore) or CSV (for Excel/Reporting).
* **Import:** Restore data from a previously exported JSON file.
* **Backup:** Enable semi-automatic backups to be reminded to save your data periodically.
* **Reset:** Options to auto-delete history older than X days or on specific dates.

## 💻 Tech Stack

* **Core:** HTML5, CSS3, Vanilla JavaScript (ES6+)
* **UI Framework:** [Bootstrap 5.3](https://getbootstrap.com/)
* **Date/Time:** [Day.js](https://day.js.org/)
* **Charts:** [Google Charts](https://developers.google.com/chart)
* **Icons:** FontAwesome
* **Analytics:** Google Analytics (Optional, user consent via GlowCookies)

## 🔮 Roadmap & Ideas

We have a list of planned features, improvements, and brainstorming notes.
Check out the full list here: **[Ideas.md](https://github.com/Lefky/lefky.github.io/blob/dev/Ideas.md)**

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1.  Fork the repository.
2.  Create your feature branch (`git checkout -b feature/AmazingFeature`).
3.  Commit your changes (`git commit -m 'Add some AmazingFeature'`).
4.  Push to the branch (`git push origin feature/AmazingFeature`).
5.  Open a Pull Request.

## ⚠️ Disclaimer

This tool is provided "as is" without warranty of any kind. While extensive efforts have been made to ensure calculation accuracy, the author is not responsible for discrepancies in official timekeeping.

## 👤 Author

**Senne Janssens**
* [LinkedIn](https://www.linkedin.com/in/sennejanssens/)
* [GitHub](https://github.com/Lefky)

---
*Last updated: December 2025*
