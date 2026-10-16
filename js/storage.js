/**
 * storage.js
 * Manages localStorage persistence, history records, automatic backup schedules,
 * and data cleanup policies.
 */

/*global dayjs */
import { reverseDateRepresentation, testDateFormat, calculateExecutionDay, todayDate } from './time-calc.js';

/**
 * Returns all DD-MM-YYYY date keys from localStorage, sorted chronologically ascending.
 * @returns {string[]}
 */
export function getHistoryKeys() {
	const keys = Object.keys(localStorage);
	const sortedkeys = keys.map(reverseDateRepresentation).sort().map(reverseDateRepresentation);

	const validKeys = [];
	for (let i = 0; i < sortedkeys.length; i++) {
		const key = sortedkeys[i];
		if (testDateFormat(key)) {
			validKeys.push(key);
		}
	}
	return validKeys;
}

/**
 * Reads the history deletion strategy from the DOM or localStorage ("days" or "period").
 * @returns {string}
 */
export function getHistoryDeleteOption() {
	const periodRadio = document.getElementById('historydeleteoptionperiod');
	const daysRadio = document.getElementById('historydeleteoptiondays');

	if (periodRadio && periodRadio.checked) {
		return periodRadio.value;
	} else if (daysRadio && daysRadio.checked) {
		return daysRadio.value;
	}

	return localStorage.getItem("historydeleteoption") || "days";
}

/**
 * Reads number of days to retain history before automatic cleanup.
 * @returns {number}
 */
export function getHistoryRetain() {
	const elem = document.getElementById("historyretain");
	let days = elem ? parseInt(elem.value, 10) : parseInt(localStorage.getItem("historyretain"), 10);

	if (!days || isNaN(days)) {
		days = 99999;
	} else if (days > 99999) {
		days = 99999;
	}

	return days;
}

/**
 * Reads the day of month/week for scheduled history resets.
 * @returns {number}
 */
export function getHistoryResetDay() {
	const elem = document.getElementById("historyresetday");
	let day = elem ? parseInt(elem.value, 10) : parseInt(localStorage.getItem("historyresetday"), 10);

	if (!day || isNaN(day)) {
		day = 31;
	} else if (day > 31) {
		day = 31;
	}

	return day;
}

/**
 * Reads the reset period amount (capped based on unit).
 * @returns {number}
 */
export function getHistoryResetPeriod() {
	const elem = document.getElementById("historyresetperiod");
	let period = elem ? parseInt(elem.value, 10) : parseInt(localStorage.getItem("historyresetperiod"), 10);
	const unit = getHistoryResetPeriodUnit();

	if (isNaN(period) || !period) {
		period = 1;
	}

	if (unit === "days") {
		period = period > 31 ? 31 : period;
	} else if (unit === "weeks") {
		period = period > 4 ? 4 : period;
	} else if (unit === "months") {
		period = period > 48 ? 48 : period;
	}

	return period;
}

/**
 * Reads the reset period unit ("days", "weeks", "months").
 * @returns {string}
 */
export function getHistoryResetPeriodUnit() {
	const elem = document.getElementById("historyresetperiodunit");
	if (elem && elem.selectedIndex >= 0) {
		return elem.options[elem.selectedIndex].value;
	}
	return localStorage.getItem("historyresetperiodunit") || "days";
}

/**
 * Reads the day of month/week for automatic backups.
 * @returns {number}
 */
export function getAutobackupDay() {
	const elem = document.getElementById("autobackupday");
	let day = elem ? parseInt(elem.value, 10) : parseInt(localStorage.getItem("autobackupday"), 10);

	if (!day || isNaN(day)) {
		day = 31;
	} else if (day > 31) {
		day = 31;
	}

	return day;
}

/**
 * Reads the autobackup period amount.
 * @returns {number}
 */
export function getAutobackupPeriod() {
	const elem = document.getElementById("autobackupperiod");
	let period = elem ? parseInt(elem.value, 10) : parseInt(localStorage.getItem("autobackupperiod"), 10);
	const unit = getAutobackupPeriodUnit();

	if (isNaN(period) || !period) {
		period = 1;
	}

	if (unit === "days") {
		period = period > 31 ? 31 : period;
	} else if (unit === "weeks") {
		period = period > 4 ? 4 : period;
	} else if (unit === "months") {
		period = period > 48 ? 48 : period;
	}

	return period;
}

/**
 * Reads the autobackup period unit ("days", "weeks", "months").
 * @returns {string}
 */
export function getAutobackupPeriodUnit() {
	const elem = document.getElementById("autobackupperiodunit");
	if (elem && elem.selectedIndex >= 0) {
		return elem.options[elem.selectedIndex].value;
	}
	return localStorage.getItem("autobackupperiodunit") || "days";
}

/**
 * Retrieves a parsed day record from localStorage.
 * @param {string} dateKey - "DD-MM-YYYY"
 * @returns {object|null}
 */
export function getDayRecord(dateKey) {
	try {
		const raw = localStorage.getItem(dateKey);
		return raw ? JSON.parse(raw) : null;
	} catch (e) {
		console.error("Failed to parse record for " + dateKey, e);
		return null;
	}
}

/**
 * Saves a day record object to localStorage.
 * @param {string} dateKey - "DD-MM-YYYY"
 * @param {object} record
 */
export function saveDayRecord(dateKey, record) {
	localStorage.setItem(dateKey, JSON.stringify(record));
}

/**
 * Clears old localStorage keys based on user preferences.
 * @param {Function} [onHistoryChanged]
 */
export function cleanLocalStorage(onHistoryChanged) {
	if (typeof dayjs === 'undefined') return;

	const keys = Object.keys(localStorage);
	const today = dayjs();
	const deleteoption = localStorage.getItem("historydeleteoption");

	if (deleteoption === "days") {
		const expiredate = today.subtract(getHistoryRetain(), "days");
		for (let i = 0; i < keys.length; i++) {
			const key = keys[i];
			if (testDateFormat(key) && dayjs(key, "DD-MM-YYYY").isBefore(expiredate)) {
				delete localStorage[key];
			}
		}
	} else if (deleteoption === "period") {
		const cleaningdaystored = localStorage.getItem("cleaningday");
		if (cleaningdaystored) {
			const cleaningday = dayjs(cleaningdaystored, "DD-MM-YYYY");
			if (cleaningday.isSameOrBefore(today)) {
				deleteHistory(onHistoryChanged);
				const nextDate = calculateExecutionDay(getHistoryResetDay(), getHistoryResetPeriod(), getHistoryResetPeriodUnit());
				if (nextDate) {
					localStorage.setItem("cleaningday", nextDate.format("DD-MM-YYYY"));
				}
			}
		}
	}
}

/**
 * Checks if automatic backup is enabled and due, then runs backup callback.
 * @param {Function} [exportCallback]
 */
export function autoBackup(exportCallback) {
	if (typeof dayjs === 'undefined') return;

	const today = dayjs();
	const backupsenabled = localStorage.getItem("autobackupoption");
	const autobackupdaystored = localStorage.getItem("autobackupdate");

	if (backupsenabled === "true" && autobackupdaystored) {
		const autobackupday = dayjs(autobackupdaystored, "DD-MM-YYYY");
		if (autobackupday.isSameOrBefore(today)) {
			if (typeof alert !== 'undefined') {
				alert("Performing autobackup");
			}
			if (typeof exportCallback === 'function') {
				exportCallback();
			} else if (typeof window !== 'undefined' && typeof window.exportHistory === 'function') {
				window.exportHistory();
			}
			const nextDate = calculateExecutionDay(getAutobackupDay(), getAutobackupPeriod(), getAutobackupPeriodUnit());
			if (nextDate) {
				localStorage.setItem("autobackupdate", nextDate.format("DD-MM-YYYY"));
			}
		}
	}
}

/**
 * Deletes all historical date entries from localStorage after user confirmation.
 * @param {Function} [onSuccess]
 */
export function deleteHistory(onSuccess) {
	if (confirm("Are you sure you wish to delete your history?\nIf you choose not to, then your data will be saved until the next cleaning time.")) {
		for (const key in localStorage) {
			if (testDateFormat(key)) {
				delete localStorage[key];
			}
		}
		if (typeof onSuccess === 'function') {
			onSuccess();
		} else if (typeof window !== 'undefined' && typeof window.setHistory === 'function') {
			window.setHistory(true);
		}
		alert("History deleted!");
	}
}

/**
 * Saves cleaning schedule to localStorage and shows visual feedback on save button.
 */
export function saveCleaningDay() {
	if (typeof window !== 'undefined' && typeof window.maxValuesCustomTimeOption === 'function') {
		window.maxValuesCustomTimeOption(
			"cleaning",
			getHistoryResetPeriodUnit(),
			calculateExecutionDay(getHistoryResetDay(), getHistoryResetPeriod(), getHistoryResetPeriodUnit()),
			document.getElementById("historyresetperiod"),
			document.getElementById("historyresetday")
		);
	}

	const resetDateElem = document.getElementById("resetdate");
	if (resetDateElem && typeof dayjs !== 'undefined') {
		localStorage.setItem("cleaningday", dayjs(resetDateElem.value, "dddd, DD-MM-YYYY").format("DD-MM-YYYY"));
	}
	localStorage.setItem("historyresetday", getHistoryResetDay().toString());
	localStorage.setItem("historyresetperiod", getHistoryResetPeriod().toString());
	localStorage.setItem("historyresetperiodunit", getHistoryResetPeriodUnit());

	const saveBtn = document.getElementById("cleaningdaysavebutton");
	if (saveBtn) {
		saveBtn.setAttribute("style", "float: none; margin-left: 5px; vertical-align: middle; transition: 0.7s linear; color: white; background-color: var(--bs-success);");
		saveBtn.innerHTML = '<i class="fas fa-check"></i>';
		setTimeout(function () {
			saveBtn.innerHTML = "Save";
			saveBtn.setAttribute("style", "float: none; margin-left: 5px; vertical-align: middle; transition: 0.7s linear;");
		}, 5000);
	}
}

/**
 * Saves auto backup schedule to localStorage and shows visual feedback on save button.
 */
export function saveBackupDay() {
	if (typeof window !== 'undefined' && typeof window.maxValuesCustomTimeOption === 'function') {
		window.maxValuesCustomTimeOption(
			"autobackup",
			getAutobackupPeriodUnit(),
			calculateExecutionDay(getAutobackupDay(), getAutobackupPeriod(), getAutobackupPeriodUnit()),
			document.getElementById("autobackupperiod"),
			document.getElementById("autobackupday")
		);
	}

	const backupDateElem = document.getElementById("autobackupdate");
	if (backupDateElem && typeof dayjs !== 'undefined') {
		localStorage.setItem("autobackupdate", dayjs(backupDateElem.value, "dddd, DD-MM-YYYY").format("DD-MM-YYYY"));
	}
	localStorage.setItem("autobackupday", getAutobackupDay().toString());
	localStorage.setItem("autobackupperiod", getAutobackupPeriod().toString());
	localStorage.setItem("autobackupperiodunit", getAutobackupPeriodUnit());

	const saveBtn = document.getElementById("autobackupsavebutton");
	if (saveBtn) {
		saveBtn.setAttribute("style", "float: none; margin-left: 5px; vertical-align: middle; transition: 0.7s linear; color: white; background-color: var(--bs-success);");
		saveBtn.innerHTML = '<i class="fas fa-check"></i>';
		setTimeout(function () {
			saveBtn.innerHTML = "Save";
			saveBtn.setAttribute("style", "float: none; margin-left: 5px; vertical-align: middle; transition: 0.7s linear;");
		}, 5000);
	}
}
