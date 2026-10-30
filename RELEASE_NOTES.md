# Release Notes

A cumulative history of application changes. A merge into `master` is a production release.
Keep all version entries. On `dev`, group pending changes under the planned release version; that version is published when its PR merges into `master`.

## Version history

### 20261030.1
- Use saved overtime earned earlier this week to adjust today's planned end time; exclude today's saved overtime and recalculate totals.
- Place the weekly overtime action beside “End time now” and keep the planned end-time input aligned with the other time fields.

### 20261026.2

So far this application has been running for a while and I have been using it myself for a long time. An update has been a while in the making and I finally got around to it. This update brings some new features and a few bugfixes.

But most of all, I've started using AI to build this application. This means that the code is now more efficient and easier to maintain. It also means that I can add new features faster and more easily. I hope you enjoy this update and I look forward to your feedback!

Changes

- Rotation for mobile screens is now better handled in both the graphs as edit history modal.

- Added unit tests and refactored into dedicated ES6 modules, separating calculation logic, data persistence, export generation, and DOM manipulation. Nerd speak aside, this means the code is now more in line with coding standards.

Bugfixes

- Billing rate isn't causing the graphs to break anymore in certain scenarios.

- There was an annoying bug where certain timestamps would cause an overtime of -0.01 or -0.02 to be displayed. This was hard to fix initially as time calculations in javascript are not always straightforward. Hence why it's been happing for years now. But now it's finally fixed and the calculations are more accurate than ever!

- Fixed a bug regarding a missing function of the time calculation library that was cause certain functions to break like the edit history modal.

- Fixed a bug where the first ever loading of the page locally would cause the app to fail and the main javascript was never loaded. This didn't have impact when accessing the app over the internet.

Source commit: `28cdb13601`.

### 20261016.1

So far this application has been running for a while and I have been using it myself for a long time. An update has been a while in the making and I finally got around to it. This update brings some new features and a few bugfixes.

But most of all, I've started using AI to build this application. This means that the code is now more efficient and easier to maintain. It also means that I can add new features faster and more easily. I hope you enjoy this update and I look forward to your feedback!

Changes

- Rotation for mobile screens is now better handled in both the graphs as edit history modal.

- Added unit tests and refactored into dedicated ES6 modules, separating calculation logic, data persistence, export generation, and DOM manipulation. Nerd speak aside, this means the code is now more in line with coding standards.

Bugfixes

- Billing rate isn't causing the graphs to break anymore in certain scenarios.

- There was an annoying bug where certain timestamps would cause an overtime of -0.01 or -0.02 to be displayed. This was hard to fix initially as time calculations in javascript are not always straightforward. Hence why it's been happing for years now. But now it's finally fixed and the calculations are more accurate than ever!

Source commit: `d35ad2ef24`.

### 20260126.1

Changes

- Added PDF export functionality. You can now export a report of your working hours in a nice PDF format. Find it in the settings!

- Added option to calculate money earned based on your overtime. Check the reporting modal for this new feature ;)

- Changed the edit history modal to a more user friendly table based layout.

Bugfixes

- Styling bugfixes.

Source commit: `cb41d64e15`.

### 20260106.2

Changes

- Added PDF export functionality. You can now export a report of your working hours in a nice PDF format. Find it in the settings!

- Added option to calculate money earned based on your overtime. Check the reporting modal for this new feature ;)

Bugfixes

- Styling bugfixes.

Source commit: `632dc531d8`.

### 20260105.2

Changes

- Refactored the entire codebase to not use jquery anymore. This should make the application perform better, be less dependant and be more future proof.

- Added a decent readme page: Readme page

- Added an ideas page where you can see planned features and suggest new ones: Ideas page

- Added PDF export functionality. You can now export a report of your working hours in a nice PDF format. Find it in the settings!

Bugfixes

- Various bugfixes.

- Fixed an XSS vulnerability. But as this is an entire client side application this was mostly a theoretical risk. As your data always stays on your own device unless you share it with someone else.

Source commit: `111a3634a0`.

### 20251219.3

Changes

- Refactored the entire codebase to not use jquery anymore. This should make the application perform better, be less dependant and be more future proof.

- Added a decent readme page: Readme page

- Added an ideas page where you can see planned features and suggest new ones: Ideas page

Bugfixes

- Various bugfixes.

- Fixed an XSS vulnerability. But as this is an entire client side application this was mostly a theoretical risk. As your data always stays on your own device unless you share it with someone else.

Source commit: `9a62711bd4`.

### 20251219.2

Changes

- Refactored the entire codebase to not use jquery anymore. This should make the application perform better, be less dependant and be more future proof.

Bugfixes

- Various bugfixes.

- Fixed an XSS vulnerability. But as this is an entire client side application this was mostly a theoretical risk. As your data always stays on your own device unless you share it with someone else.

Source commit: `301e4f46d9`.

### 20251217.2

Changes

- Added new animations when your time is finished. Discover them all!

- Added toggle to select appearance (light, dark, auto) in settings.

- Reworked color scheme for less harsh whites where possible.

Bugfixes

- Fixed an issue where the introduction was still taking the info button into account.

Source commit: `1a316bac13`.

### 20251217.1

Changes

- Added new animations when your time is finished. Discover them all!

- Added toggle to select appearance (light, dark, auto) in settings.

- Reworked color scheme for less harsh whites where possible.

Bugfixes

- Fixed an issue where the introduction was still taking the info button into account.

Source commit: `cabb4ef748`.

### 20251030.1

Changes

- Added new animations when your time is finished. Discover them all!

- Added toggle to select appearance (light, dark, auto) in settings.

- Reworked color scheme for less harsh whites where possible.

Bugfixes

- Fixed an issue where the introduction was still taking the info button into account.

Source commit: `5f213f1f64`.

### 20251029.2

Changes

- Added new animations when your time is finished. Discover them all!

- Added toggle to select appearance (light, dark, auto) in settings.

- Reworked color scheme for less harsh whites where possible.

Bugfixes

- Fixed an issue where the introduction was still taking the info button into account.

Source commit: `943097a334`.

### 20251014.1

Changes

- Added new animations when your time is finished. Discover them all!

Bugfixes

- Fixed an issue where the introduction was still taking the info button into account.

Source commit: `e348b10453`.

### 20251006.1

Changes

- Added new animations when your time is finished. Discover the 4 different!

Bugfixes

- Fixed an issue where the introduction was still taking the info button into account.

Source commit: `28869be06c`.

### 20250922.1

Changes

- Updated dependencies to their latest versions so you guys get the latest and greatest ;)

- As this is a time tracking tool, time calculations are one of the most important things and javascript can make it very hard to do these.

1 of the dependencies was moment.js which helps with that.

Moment.js is now in maintenance mode and the team advises to look for alternatives.

I've replaced moment.js with day.js which is a modern alternative.

All time calculations should still be the same, but please report if you find any issues.

Bugfixes

- Small bugfix regarding UI for break timerange selection.

- Fixed a bug for custom hour schedule where "null" values were displayed.

- Fixed issue with data import and new lines.

Source commit: `dab5747ebb`.

### 20250919.1

Changes

- Updated dependencies to their latest versions so you guys get the latest and greatest ;)

- As this is a time tracking tool, time calculations are one of the most important things and javascript can make it very hard to do these.

1 of the dependencies was moment.js which helps with that.

Moment.js is now in maintenance mode and the team advises to look for alternatives.

I've replaced moment.js with day.js which is a modern alternative.

All time calculations should still be the same, but please report if you find any issues.

Bugfixes

- Small bugfix regarding UI for break timerange selection.

- Fixed a bug for custom hour schedule where "null" values were displayed.

Source commit: `17018f6ea2`.

### 20250918.3

Changes

- Updated dependencies to their latest versions so you guys get the latest and greatest ;)

- As this is a time tracking tool, time calculations are one of the most important things and javascript can make it very hard to do these.

1 of the dependencies was moment.js which helps with that.

Moment.js is now in maintenance mode and the team advises to look for alternatives.

I've replaced moment.js with day.js which is a modern alternative.

All time calculations should still be the same, but please report if you find any issues.

Bugfixes

- Small bugfix.

Source commit: `2f14bd733e`.

### 20250918.2

Changes

- Updated dependencies to their latest versions so you guys get the latest and greatest ;)

- As this is a time tracking tool, time calculations are one of the most important things and javascript can make it very hard to do these.

1 of the dependencies was moment.js which helps with that.

Moment.js is now in maintenance mode and the team advises to look for alternatives.

I've replaced moment.js with day.js which is a modern alternative.

All time calculations should still be the same, but please report if you find any issues.

Bugfixes

- None.

Source commit: `a32809c536`.

### 20250918.1

Changes

- Updated dependencies to their latest versions so you guys get the latest and greatest ;)

Bugfixes

- None.

Source commit: `a07115c402`.

### 20250428.1

Changes

- Bump bootstrap version.

Bugfixes

- None.

Source commit: `ac9c1ce7da`.

### 20250410.1

Changes

- Added option to not save this current session instead of only the entire day. This allows to reload the window without needing to uncheck the today box.

- Added option for custom hour schedule. In the settings you can now enter any value (0 - 24h) so you can have options that aren't in de defaults.

Bugfixes

- None.

Source commit: `1e92797837`.

### 20250219.1

Changes

- Added option to not save this current session instead of only the entire day. This allows to reload the window without needing to uncheck the today box.

Bugfixes

- None.

Source commit: `696297e0b2`.

### 20241031.1

Changes

- It's been a long time!

If you have a request (could be anything) please let me know. But for now I can't seem to imagine useful additions myself anymore.

- Upgraded libraries.

Bugfixes

- Another attempt at fixing an annoying bug where adding time to the start time would result in not actually adding all time correctly. For example, when opening the page and having a start time at 8:00, the end time could've been 15:59.

- Various bugfixes regarding the reworked dark mode and graphs.

Source commit: `956de3935c`.

### 20241025.1

Changes

- It's been a long time!

If you have a request (could be anything) please let me know. But for now I can't seem to imagine useful additions myself anymore.

- Upgraded libraries.

Bugfixes

- Another attempt at fixing an annoying bug where adding time to the start time would result in not actually adding all time correctly. For example, when opening the page and having a start time at 8:00, the end time could've been 15:59.

Source commit: `2d8cacc330`.

### 20230216.1

Changes

- The first update of the year...

- Now it's possible to export your data in CSV format. CSV is a more supported format when it comes to data analyzers like spreadsheets so you can make some graphs yourself.

Keep in mind that this is not a supported type for backups!

Bugfixes

- Replaced obsolete jshint checks for eslint.

- Make it possible to store up to 99999 days instead of 999.

- Fix footer on small screens overlapping functionality.

- Reset button still held old functionality resulting in unwanted behaviour of the current of the app.

Source commit: `6f8de3d199`.

### 20230106.1

Changes

- The first update of the year...

- Now it's possible to export your data in CSV format. CSV is a more supported format when it comes to data analyzers like spreadsheets so you can make some graphs yourself.

Keep in mind that this is not a supported type for backups!

Bugfixes

- /

Source commit: `2f9f34143c`.

### 20221221.1

Changes

- Added more default break times.

- Added a day summary to saved data. This allows for better tracking and to add notes to your registrations.

- Added a new easter egg when your day is done.

- Added option to make hourschedule change temporary or permanent.

- Updated bootstrap to latest stable version. Next bootstrap update there will be a built-in dark mode!

Bugfixes

- Hotfix for records made before the summary field was present.

- Hotfix for summary field always being show.

Source commit: `0bf831a351`.

### 20221206.1

Changes

- Added more default break times.

- Added a day summary to saved data. This allows for better tracking and to add notes to your registrations.

- Added a new easter egg when your day is done.

- Added option to make hourschedule change temporary or permanent.

- Updated bootstrap to latest stable version. Next bootstrap update there will be a built-in dark mode!

Bugfixes

- NONE!

Source commit: `835d418d74`.

### 20221020.1

Changes

- Added more default break times.

- Added a day summary to saved data. This allows for better tracking and to add notes to your registrations.

- Added a new easter egg when your day is done.

- Added option to make hourschedule change temporary or permanent.

Bugfixes

-

Source commit: `35be7c3fa5`.

### 20220905.1

Changes

- Added more default break times.

- Added a day summary to saved data. This allows for better tracking and to add notes to your registrations.

Bugfixes

-

Source commit: `e91cef5f5b`.

### 20220726.1

Changes

- On small screens the distinction between the footer and content is more clear for UX purposes.

- Added cookie banner.

Including the required cookie policy to be GDPR compliant (as far as it's needed for this since no data is being stored externally besides google analytics).

- Converted history overview to actual timestamps instead of decimal numbers.

Bugfixes

- MomentJS code is now provided by a CDN for ease of use in the backend.

- When importing data parameters are now also automatically set.

- Fix edit history modal save buttons returning to unintended state after pressing 'save all'.

Source commit: `4afebaa50f`.

### 20220709.1

Changes

- On small screens the distinction between the footer and content is more clear for UX purposes.

- Added cookie banner.

Including the required cookie policy to be GDPR compliant (as far as it's needed for this since no data is being stored externally besides google analytics).

- Converted history overview to actual timestamps instead of decimal numbers.

Bugfixes

- MomentJS code is now provided by a CDN for ease of use in the backend.

- When importing data parameters are now also automatically set.

Source commit: `1bb7f5be3b`.

### 20220629.1

Changes

- On small screens the distinction between the footer and content is more clear for UX purposes.

- Added cookie banner.

Including the required cookie policy to be GDPR compliant (as far as it's needed for this since no data is being stored externally besides google analytics).

- Converted history overview to actual timestamps instead of decimal numbers.

Bugfixes

- MomentJS code is now provided by a CDN for ease of use in the backend.

Source commit: `84f777d16b`.

### 20220609.2

Changes

- Added cookie banner.

Including the required cookie policy to be GDPR compliant (as far as it's needed for this since no data is being stored externally besides google analytics).

Bugfixes

-

Source commit: `3b08eff1fd`.

### 20220603.1

Changes

- Added a temporary dark mode.

Bootstrap is working on a fairly easy way to implement dark mode. Making it flexible and easy to handle.

So for now a basic dark mode has been added to this project that only triggers depending on your OS settings.

If your OS is set to a light or dark theme the app will respond accordingly. When it is set to auto the app will also automatically transition to the new mode.

In a later stage I plan on making it possible to set a preference and/or manually switch between these modes.

- Changed coloring to be more consistent. Only 1 definition of green, red, blue, ... exists now resulting in the same colors being used everywhere even after modifications.

- Added a desktop notification when the current time matches / exceeds the 'time to go home'.

- Added reporting quick selection buttons for frequent timeframe selections.

Bugfixes

- Remove partly implemented features from being accessible. It remains to be seen if these will be added later or not.

- Dismissing the leaves notification now also stops the effect from happening.

- Safari bugfix for the history view. (Safari doesn't support a certain regex ATM resulting in the history buttons doing nothing)

- Fixed the alerting message box (when you do something wrong) being removed instead of hidden. This resulted in new alerts not being able to display.

- Fixed new history entry not being in line with recent UI changes.

Source commit: `e81fe8aba0`.

### 20220510.2

Changes

- Added a temporary dark mode.

Bootstrap is working on a fairly easy way to implement dark mode. Making it flexible and easy to handle.

So for now a basic dark mode has been added to this project that only triggers depending on your OS settings.

If your OS is set to a light or dark theme the app will respond accordingly. When it is set to auto the app will also automatically transition to the new mode.

In a later stage I plan on making it possible to set a preference and/or manually switch between these modes.

- Changed coloring to be more consistent. Only 1 definition of green, red, blue, ... exists now resulting in the same colors being used everywhere even after modifications.

- Added a desktop notification when the current time matches / exceeds the 'time to go home'.

- Added reporting quick selection buttons for frequent timeframe selections.

Bugfixes

- Remove partly implemented features from being accessible. It remains to be seen if these will be added later or not.

- Dismissing the leaves notification now also stops the effect from happening.

- Safari bugfix for the history view. (Safari doesn't support a certain regex ATM resulting in the history buttons doing nothing)

- Fixed the alerting message box (when you do something wrong) being removed instead of hidden. This resulted in new alerts not being able to display.

- Fixed new history entry not being in line with recent UI changes.

Source commit: `d2ea7a89d7`.

### 20220503.1

Changes

- Added a temporary dark mode.

Bootstrap is working on a fairly easy way to implement dark mode. Making it flexible and easy to handle.

So for now a basic dark mode has been added to this project that only triggers depending on your OS settings.

If your OS is set to a light or dark theme the app will respond accordingly. When it is set to auto the app will also automatically transition to the new mode.

In a later stage I plan on making it possible to set a preference and/or manually switch between these modes.

- Changed coloring to be more consistent. Only 1 definition of green, red, blue, ... exists now resulting in the same colors being used everywhere even after modifications.

- Added a desktop notification when the current time matches / exceeds the 'time to go home'.

Bugfixes

- Remove partly implemented features from being accessible. It remains to be seen if these will be added later or not.

- Dismissing the leaves notification now also stops the effect from happening.

Source commit: `3428e5b7af`.

### 20220502.1

Changes

- Added a temporary dark mode.

Bootstrap is working on a fairly easy way to implement dark mode. Making it flexible and easy to handle.

So for now a basic dark mode has been added to this project that only triggers depending on your OS settings.

If your OS is set to a light or dark theme the app will respond accordingly. When it is set to auto the app will also automatically transition to the new mode.

In a later stage I plan on making it possible to set a preference and/or manually switch between these modes.

- Changed coloring to be more consistent. Only 1 definition of green, red, blue, ... exists now resulting in the same colors being used everywhere even after modifications.

Bugfixes

- Remove partly implemented features from being accessible. It remains to be seen if these will be added later or not.

Source commit: `5b4015b746`.

### 20220307.1

Improved memory management resulting in improved performance.

Added graph in the reporting section displaying the official workdays remaining.

Also added a country selector in the settings to get the official holidays for your country to take into account during the calculation.

Added semi-automatic backup functionality.

You still have to approve the download of this data because it wouldn't be safe if every website could just download files to your computer ;)

But in settings you can now configure a recurrent time-schedule to backup your data.

Bugfixes

- Cumulative reporting graph didn't respect the timerange that was selected.

- Automatic scheduled cleanup not executing.

Source commit: `6b501b624b`.

### 20220106.1

Added official support for data corrections in the history modal. You can add custom entries to the data to correct the total time.

Edited error validation accordingly.

The provided sample data is now more up to date with the recent changes to the saved dataformat.

Added Cumulative overtime graph in reporting.

Brought colors in line by dynamically linking them to the theme colors.

Bugfixes

- Made background javascript more conventional using javascript linting.

- Fixed stoptime graph not respecting the selected date boundries.

Source commit: `263166f68f`.

### 20211220.1

Added official support for data corrections in the history modal. You can add custom entries to the data to correct the total time.

Edited error validation accordingly.

The provided sample data is now more up to date with the recent changes to the saved dataformat.

Added Cumulative overtime graph in reporting.

Brought colors in line by dynamically linking them to the theme colors.

Bugfixes

- Made background javascript more conventional using javascript linting.

- Fixed stoptime graph not respecting the selected date boundries.

Source commit: `5f91bbfb38`.

### 20211214.1

Added official support for data corrections in the history modal. You can add custom entries to the data to correct the total time.

Edited error validation accordingly.

The provided sample data is now more up to date with the recent changes to the saved dataformat.

Added Cumulative overtime graph in reporting.

Brought colors in line by dynamically linking them to the theme colors.

Bugfixes

- Made background javascript more conventional using javascript linting.

- Fixed stoptime graph not respecting the selected date boundries.

Source commit: `50904f6182`.

### 20211104.2

Added official support for data corrections in the history modal. You can add custom entries to the data to correct the total time.

Edited error validation accordingly.

The provided sample data is now more up to date with the recent changes to the saved dataformat.

Bugfixes

- Made background javascript more conventional using javascript linting.

- Fixed stoptime graph not respecting the selected date boundries.

Source commit: `807ed3c5b9`.

### 20211104.1

Added official support for data corrections in the history modal. You can add custom entries to the data to correct the total time.

Edited error validation accordingly.

The provided sample data is now more up to date with the recent changes to the saved dataformat.

Bugfixes

- Made background javascript more conventional using javascript linting.

- Fixed stoptime graph not respecting the selected date boundries.

Source commit: `4134d5a1c4`.

### 20211021.1

Added official support for data corrections in the history modal. You can add custom entries to the data to correct the total time.

Edited error validation accordingly.

The provided sample data is now more up to date with the recent changes to the saved dataformat.

Bugfixes

-

Source commit: `5129e0b4d2`.

### 20211018.1

Changed table edits to after-filter formatting and heading

Migrate layout to Bootstrap 5!

This includes some big changes which may result in broken components. If you encounter one of those, pls leave me a message.

Added show/hide all option for time UI components in settings.

Bugfixes

- Open time subtract not triggering when default value wasn't changed

- Introduction not restartable

- Layout fixes for mobile

Source commit: `96a836a7b1`.

### 20211015.1

Changed table edits to after-filter formatting and heading

Migrate layout to Bootstrap 5!

This includes some big changes which may result in broken components. If you encounter one of those, pls leave me a message.

Added show/hide all option for time UI components in settings.

Bugfixes

- Open time subtract not triggering when default value wasn't changed

- Introduction not restartable

- Layout fixes for mobile

Source commit: `bed77cac3b`.

### 20211011.1

Changed table edits to after-filter formatting and heading

Migrate layout to Bootstrap 5!

This includes some big changes which may result in broken components. If you encounter one of those, pls leave me a message.

Added show/hide all option for time UI components in settings.

Bugfixes

- Open time subtract not triggering when default value wasn't changed

- Introduction not restartable

Source commit: `541f5a3eca`.

### 20211008.2

Changed table edits to after-filter formatting and heading

Migrate layout to Bootstrap 5!

This includes some big changes which may result in broken components. If you encounter one of those, pls leave me a message.

Bugfixes

- Open time subtract not triggering when default value wasn't changed

- Introduction not restartable

Source commit: `c028ecc173`.

### 20211006.1

Changed table edits to after-filter formatting and heading

Migrate layout to Bootstrap 5!

This includes some big changes which may result in broken components. If you encounter one of those, pls leave me a message.

Bugfixes

- Open time subtract not triggering when default value wasn't changed

- Introduction not restartable

Source commit: `c51bbb2542`.

### 20210927.1

Edit table edits to after-filter formatting and heading

Migrate layout to Bootstrap 5!

This includes some big changes which may result in broken components. If you encounter one of those, pls leave me a message.

Source commit: `6b5ebc048c`.

### 20210922.1

Edit table edits to after-filter formatting and heading

Source commit: `3502ef4ba2`.

### 20210827.2

Bugfix: reporting on correction time.

Added search filter to edit table.

Source commit: `a41f3e46ea`.

### 20210823.1

Bugfix: delete entry wasn't working anymore.

Added option to introduce a correction entry for overtime.

Source commit: `4271b15795`.

### 20210820.1

Bugfix: delete entry wasn't working anymore.

Added option to introduce a correction entry for overtime.

Source commit: `5e07e9f8c4`.

### 20210809.1

Bugfix: delete entry wasn't working anymore.

Source commit: `3509547158`.

### 20210723.1

Added progressive web app support (or trying to) to make it possible to install the app out of the browser.

BUGFIX: on top of previous build.

BUGFIX 2: regarding the service worker. BUGFIX 3: regarding the service worker.

Added tab message when the day is over.

Added 39h week for overtime.

Source commit: `c5654ed777`.

### 20210722.1

Added progressive web app support (or trying to) to make it possible to install the app out of the browser.

BUGFIX: on top of previous build.

BUGFIX 2: regarding the service worker.

Added tab message when the day is over.

Added 39h week for overtime.

Source commit: `cf441a711f`.

### 20210706.1

Added progressive web app support (or trying to) to make it possible to install the app out of the browser.

BUGFIX: on top of previous build.

BUGFIX 2: regarding the service worker.

Added tab message when the day is over.

Source commit: `83765a5136`.

### 20210616.1

Added progressive web app support (or trying to) to make it possible to install the app out of the browser.

BUGFIX: on top of previous build.

BUGFIX 2: regarding the service worker.

Added a 'save all' and 'delete all' button to the edit history screen so you can make changes in bulk without having to save each entry seperatly.

Tooltips will now be shown with a 2 second delay to be more user-friendly.

Added notification sound when the workday is over.

Source commit: `330640206d`.

### 20210603.1

Added progressive web app support (or trying to) to make it possible to install the app out of the browser.

BUGFIX: on top of previous build. BUGFIX 2: regarding the service worker.

Added a 'save all' and 'delete all' button to the edit history screen so you can make changes in bulk without having to save each entry seperatly.

Tooltips will now be shown with a 2 second delay to be more user-friendly.

Source commit: `63aeaf84de`.

### 20210520.1

Added progressive web app support (or trying to) to make it possible to install the app out of the browser.

BUGFIX: on top of previous build. BUGFIX 2: regarding the service worker.

Added a 'save all' and 'delete all' button to the edit history screen so you can make changes in bulk without having to save each entry seperatly.

Tooltips will now be shown with a 2 second delay to be more user-friendly.

Source commit: `4bc0889ca4`.

### 20210512.1

Small layout fixes.

More consistent endtime calculations.

Added progressive web app support (or trying to) to make it possible to install the app out of the browser.

BUGFIX: on top of previous build.

Added option to not automatically set endtime only for today (in case you forget to enable the automatic endtime again the next day if you meant to disable it for only 1 day).

Source commit: `acf2502844`.

### 20210507.1

Small layout fixes.

More consistent endtime calculations.

Added progressive web app support (or trying to) to make it possible to install the app out of the browser.

BUGFIX: on top of previous build.

Added option to not automatically set endtime only for today (in case you forget to enable the automatic endtime again the next day if you meant to disable it for only 1 day).

Source commit: `160bc3e99b`.

### 20210427.1

Small layout fixes.

More consistent endtime calculations.

Added progressive web app support (or trying to) to make it possible to install the app out of the browser.

BUGFIX: on top of previous build.

Added option to not automatically set endtime only for today (in case you forget to enable the automatic endtime again the next day if you meant to disable it for only 1 day).

Source commit: `9ae9e846e4`.

### 20210401.1

Added better support for large screens and various layout fixes.

Fix automatic endtime checkmark not persistent when not saving today is checked.

Gauges in reporting have an additional meter and now include colors and dynamic ranges.

Added progressive web app support (or trying to) to make it possible to install the app out of the browser.

Source commit: `7a229c0b42`.

### 20210323.1

Added better support for large screens and various layout fixes.

Fix automatic endtime checkmark not persistent when not saving today is checked.

Gauges in reporting have an additional meter and now include colors and dynamic ranges.

Added progressive web app support (or trying to) to make it possible to install the app out of the browser.

Source commit: `4a3524c228`.

### 20210226.1

Made instructions and user experience for break counter more clear.

Added easter egg. If you work long enough you'll be able to spot it!

Bugfix buttons keeping focus after being clicked.

Source commit: `67258ae08c`.

### 20210218.2

Made instructions and user experience for break counter more clear.

Added easter egg. If you work long enough you'll be able to spot it!

Bugfix buttons keeping focus after being clicked.

Source commit: `f482469163`.

### 20210218.1

Made instructions and user experience for break counter more clear.

Added easter egg. If you work long enough you'll be able to spot it!

Bugfix buttons keeping focus after being clicked.

Source commit: `fc8a936642`.

### 20210216.1

Made instructions and user experience for break counter more clear.

Added easter egg. If you work long enough you'll be able to spot it!

Bugfix buttons keeping focus after being clicked.

Source commit: `f7b88f0e3c`.

### 20210112.2

Made instructions and user experience for break counter more clear.

Added easter egg. If you work long enough you'll be able to spot it!

Bugfix buttons keeping focus after being clicked.

Source commit: `4f1399beba`.

### 20210112.1

Made instructions and user experience for break counter more clear.

Added easter egg. If you work long enough you'll be able to spot it!

Bugfix buttons keeping focus after being clicked.

Source commit: `bc34278072`.

### 20210111.2

Changed offset on timings sometimes missing a minute to a more consistent way of calculating.

Added a "Getting started" wizard. Click here to start the wizard now.

Javascript and CSS files now load asynchronously for a more performant page / app.

Added a more robust timer for the break which will also display the current elapsed time.

Added stop time to reporting.

Source commit: `6e908bac35`.

### 20210111.1

Changed offset on timings sometimes missing a minute to a more consistent way of calculating.

Added a "Getting started" wizard. Click here to start the wizard now.

Javascript and CSS files now load asynchronously for a more performant page / app.

Added a more robust timer for the break which will also display the current elapsed time.

Added stop time to reporting.

Source commit: `c53be14530`.

### 20210107.1

Changed offset on timings sometimes missing a minute to a more consistent way of calculating.

Added a "Getting started" wizard. Click here to start the wizard now.

Javascript and CSS files now load asynchronously for a more performant page / app.

Added a more robust timer for the break which will also display the current elapsed time.

Added stop time to reporting.

Source commit: `69fbaa809d`.

### 20210106.1

Changed offset on timings sometimes missing a minute to a more consistent way of calculating.

Added a "Getting started" wizard. Click here to start the wizard now.

Javascript and CSS files now load asynchronously for a more performant page / app.

Added a more robust timer for the break which will also display the current elapsed time.

Source commit: `b96a42e545`.

### 20201216.1

Changed offset on timings sometimes missing a minute to a more consistent way of calculating.

Added a "Getting started" wizard.

Made additional javascript files load asynchronously for a compacter and more performant page / app.

Source commit: `0937d75b03`.

### 20201215.1

Added the reporting feature in the lower right corner. Go check it out!

Reporting now based on time range.

Added average stoptime gauge to reporting.

Added automatic landscape screen to reporting for mobile devices.

Added option for break time based on interval instead of only duration. This can now be toggled in the settings.

Changed offset on timings sometimes missing a minute to a more consistent way of calculating.

Source commit: `ebd4e3426c`.

### 20201208.1

Added the reporting feature in the lower right corner. Go check it out!

Reporting now based on time range.

Added average stoptime gauge to reporting.

Added automatic landscape screen to reporting for mobile devices.

Added option for break time based on interval instead of only duration. This can now be toggled in the settings.

Changed offset on timings sometimes missing a minute to a more consistent way of calculating.

Source commit: `95cb1388b6`.

### 20201201.1

Added the reporting feature in the lower right corner. Go check it out!

Reporting now based on time range.

Added average stoptime gauge to reporting.

Added automatic landscape screen to reporting for mobile devices.

Added option for break time based on interval instead of only duration. This can now be toggled in the settings.

Source commit: `22121585ff`.

### 20201125.1

Added the reporting feature in the lower right corner. Go check it out!

Reporting now based on time range.

Added average stoptime gauge to reporting.

Added automatic landscape screen to reporting for mobile devices.

Added option for break time based on interval instead of only duration. This can now be toggled in the settings.

Source commit: `087af7732e`.

### 20201124.1

Added the reporting feature in the lower right corner. Go check it out!

Reporting now based on time range.

Added average stoptime gauge to reporting.

Added automatic landscape screen to reporting for mobile devices.

Added option for break time based on interval instead of only duration. This can now be toggled in the settings.

Source commit: `817e0b1313`.

### 20201117.1

Added the reporting feature in the lower right corner. Go check it out!

Reporting now based on time range.

Added average stoptime gauge to reporting.

Added automatic landscape screen to reporting for mobile devices.

Source commit: `6cb88ce0f4`.

### 20201102.1

Added the reporting feature in the lower right corner. Go check it out!

Source commit: `44bfb7b36d`.

### 20201027.1

Added the reporting feature in the lower right corner. Go check it out!

Source commit: `19bd291097`.

### 20201021.1

Added the reporting feature in the lower right corner. Go check it out!

Source commit: `c47f03f1c5`.

### 20201015.1

Ironed out some bugs, background code received more consitancy in function usage.

Source commit: `99e40a941d`.

### 20200918.1

Did some optimization and small UI fixes.

A new feature is introduced.

Click the edit button next to your time history to discover it!

Source commit: `a3dd237f5d`.

### 20200901.1

You can now change howmany minutes are being subtracted when you open the page. Head to the settings to change it :)

The add time button now adds the time specified in the hourschedule dropdown next to the overtime.

UPDATE: the lay-out is now more responsive!

Source commit: `7900044c7c`.

### 20200825.1

You can now change howmany minutes are being subtracted when you open the page. Head to the settings to change it :)

The add time button now adds the time specified in the hourschedule dropdown next to the overtime.

UPDATE: the lay-out is now more responsive!

Source commit: `c36433c594`.

### 20200807.1

You can now change howmany minutes are being subtracted when you open the page. Head to the settings to change it :)

The add time button now adds the time specified in the hourschedule dropdown next to the overtime.

Source commit: `6d50ad963b`.

### 20200702.1

You can now change howmany minutes are being subtracted when you open the page. Head to the settings to change it :)

The add time button now adds the time specified in the hourschedule dropdown next to the overtime.

Source commit: `2799681a62`.

### 20200619.1

You can now change howmany minutes are being subtracted when you open the page. Head to the settings to change it :)

Source commit: `3496a90845`.

### 20200618.1

The history now displays positive or negative overtime more clearly.

A stopwatch for break time has been introduced! Just click the start button when going on a break and click the button again afterwards. Don't wory, you can still edit it ;)

Source commit: `2a98daa977`.

### 20200513.1

Added UI display options. You can now select which stats you want to see. Head to the settings tab to try it out!

Source commit: `164068c63a`.

### 20200504.1

Use Google Chrome or Firefox for optimal results. Lets be honest here... Edge or IE are crap.

As you can see the UI got an overhaul.

The UI has been coded with Bootstrap 4 resulting in a more standardized way of displaying stuff.

This does make it for me personally a little harder to maintain as I didn't write these definitions myself.

But hey... It's standardized!

Source commit: `70b78d01ac`.

### 20200330.1

As you can see the UI got an overhaul.

The UI has been coded with Bootstrap 4 resulting in a more standardized way of displaying stuff.

This does make it for me personally a little harder to maintain as I didn't write these definitions myself.

But hey... It's standardized!

Source commit: `a9ad549cf1`.

### 20200317.1

As you can see the UI got an overhaul.

The UI has been coded with Bootstrap 4 resulting in a more standardized way of displaying stuff.

This does make it for me personally a little harder to maintain as I didn't write these definitions myself.

But hey... It's standardized!

Source commit: `f5809c47ca`.

### 20200221.2

This notification bar will now only appear when a new version is released! AND you can make it disappear until the next version allowing you to have a screen that looks cleaner :)

You can now have the history completely reset every X days/weeks/month on the Nth day.

Find it in the panel.

Source commit: `e23283b30a`.

### 20200220.1

This notification bar will now only appear when a new version is released! AND you can make it disappear until the next version allowing you to have a screen that looks cleaner :)

You can now have the history completely reset every X days/weeks/month on the Nth day.

Find it in the panel.

Source commit: `4f68c6acd8`.

### 20200217.2

This notification bar will now only appear when a new version is released! AND you can make it disappear until the next version allowing you to have a screen that looks cleaner :)

You can now have the history completely reset every X days/weeks/month on the Nth day.

Find it in the panel.

Source commit: `cbfd6e4e04`.

### 20200120.1

This notification bar will now only appear when a new version is released! AND you can make it disappear until the next version allowing you to have a screen that looks cleaner :)

You can now have the history completely reset every X days/weeks/month on the Nth day.

Find it in the panel.

Source commit: `0928d42fc7`.

### 20200117.1

This notification bar will now only appear when a new version is released! AND you can make it disappear until the next version allowing you to have a screen that looks cleaner :)

You can now have the history completely reset every X days/weeks/month on the Nth day.

Find it in the panel.

Source commit: `c94c70490f`.

### 20200115.3

This notification bar will now only appear when a new version is released! AND you can make it disappear until the next version allowing you to have a screen that looks cleaner :)

You can now have the history completely reset every X days/weeks/month on the Nth day.

Find it in the panel.

Source commit: `d04c6a268a`.
