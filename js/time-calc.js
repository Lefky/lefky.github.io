/**
 * time-calc.js
 * Pure and semi-pure time, date, conversion, and calculation logic.
 * Independent of DOM manipulation for easy unit testing.
 */

/*global dayjs */

/**
 * Converts a decimal hour number (e.g. 7.5 or -1.25) to a formatted string "HH:mm" (or "-HH:mm").
 * Preserves the special string "correction" as-is.
 * @param {number|string} timedec
 * @returns {string}
 */
export function floatToTimeString(timedec) {
	if (timedec === "correction") {
		return timedec;
	}

	const num = parseFloat(timedec);
	if (isNaN(num)) {
		return "00:00";
	}

	const sign = num < 0 ? "-" : "";
	const absVal = Math.abs(num);
	const totalMinutes = Math.round(absVal * 60);
	const hours = Math.floor(totalMinutes / 60);
	const minutes = totalMinutes % 60;

	return sign + (hours < 10 ? "0" : "") + hours + ":" + (minutes < 10 ? "0" : "") + minutes;
}

/**
 * Converts a time string "HH:mm" to decimal hours.
 * Uses dayjs if available, with robust pure JS fallback for unit test environments.
 * @param {string} timestring
 * @returns {number}
 */
export function timeStringToFloat(timestring) {
	if (!timestring) return 0;

	if (typeof dayjs !== 'undefined' && dayjs.duration) {
		const time = dayjs(timestring, "HH:mm");
		return dayjs.duration(time.diff(time.startOf('day')), 'milliseconds').asHours();
	}

	const parts = timestring.split(':');
	if (parts.length >= 2) {
		const hours = parseFloat(parts[0]) || 0;
		const minutes = parseFloat(parts[1]) || 0;
		return hours + (minutes / 60);
	}
	return 0;
}

/**
 * Inverts date format between "DD-MM-YYYY" and "YYYY-MM-DD".
 * @param {string} date
 * @returns {string}
 */
export const reverseDateRepresentation = date => {
	if (date) {
		const parts = date.split('-');
		if (parts.length === 3) {
			return `${parts[2]}-${parts[1]}-${parts[0]}`;
		}
	}
	return "";
};

/**
 * Validates whether a key string matches the DD-MM-YYYY date format.
 * @param {string} date
 * @returns {boolean}
 */
export function testDateFormat(date) {
	const userKeyRegExp = /^[0-9]{2}-[0-9]{2}-[0-9]{4}/;
	return userKeyRegExp.test(date);
}

/**
 * Calculates current time as decimal hours from start of day.
 * @returns {number}
 */
export function now() {
	if (typeof dayjs !== 'undefined' && dayjs.duration) {
		const currentTime = dayjs();
		return dayjs.duration(currentTime.diff(currentTime.startOf('day')), 'milliseconds').asHours();
	}
	const d = new Date();
	return d.getHours() + (d.getMinutes() / 60) + (d.getSeconds() / 3600);
}

/**
 * Returns today's date formatted as "DD-MM-YYYY".
 * @returns {string}
 */
export function todayDate() {
	if (typeof dayjs !== 'undefined') {
		return dayjs().format("DD-MM-YYYY");
	}
	const d = new Date();
	const dd = String(d.getDate()).padStart(2, '0');
	const mm = String(d.getMonth() + 1).padStart(2, '0');
	const yyyy = d.getFullYear();
	return `${dd}-${mm}-${yyyy}`;
}

/**
 * Calculates net work time between start and end decimal hours.
 * Handles crossing midnight and snaps within 0.02 threshold of hour schedule.
 * @param {number} startDec
 * @param {number} endDec
 * @param {number} [hourSchedule]
 * @param {number} [breakDec]
 * @returns {string} Two decimal string representation (e.g. "7.60")
 */
export function calculateWorktime(startDec, endDec, hourSchedule = 0, breakDec = 0) {
	let grossWorktime = endDec - startDec;
	if (endDec < startDec) {
		grossWorktime = 24 + grossWorktime;
	}

	const sched = parseFloat(hourSchedule) || 0;
	const brk = parseFloat(breakDec) || 0;
	const netWorktime = grossWorktime - brk;

	// If net worktime is within ~1.2 minutes (0.02h) of the schedule, snap to schedule + break
	if (sched > 0 && Math.abs(netWorktime - sched) <= 0.02) {
		grossWorktime = sched + brk;
	}

	return grossWorktime.toFixed(2);
}

/**
 * Calculates overtime decimal hours given work time, break time, and scheduled hours.
 * @param {number|string} worktime
 * @param {number|string} breakTime
 * @param {number|string} hourSchedule
 * @returns {string} Two decimal string representation
 */
export function calculateOvertime(worktime, breakTime, hourSchedule) {
	const workDec = parseFloat(worktime) || 0;
	const breakDec = parseFloat(breakTime) || 0;
	const schedDec = parseFloat(hourSchedule) || 0;

	let overtimeNum = workDec - breakDec - schedDec;

	// When on schedule, minute quantization or floating point imprecision
	// can result in tiny differences (e.g. +/-0.0067h = 24s for schedules like 3.04h or 6.24h)
	// that round to -0.01 overtime. Suppress this false negative when difference is <= 0.015h.
	if (schedDec > 0 && Math.abs(overtimeNum) <= 0.015) {
		overtimeNum = 0;
	}

	const overtime = overtimeNum.toFixed(2);
	if (overtime === "-0.00") {
		return "0.00";
	}
	return overtime;
}

/**
 * Calculates total worked time minus break.
 * @param {number|string} worktime
 * @param {number|string} breakTime
 * @returns {string}
 */
export function calculateTotalNoBreak(worktime, breakTime) {
	const workDec = parseFloat(worktime) || 0;
	const breakDec = parseFloat(breakTime) || 0;
	return Math.abs(parseFloat(workDec - breakDec)).toFixed(2);
}

/**
 * Calculates future execution date based on period and unit.
 * @param {number|string} executionday
 * @param {number|string} period
 * @param {string} periodunit - "days", "weeks", or "months"
 * @returns {object|null} dayjs object if available
 */
export function calculateExecutionDay(executionday, period, periodunit) {
	if (typeof dayjs !== 'undefined') {
		let date = dayjs();
		const p = parseInt(period, 10) || 0;
		const ed = parseInt(executionday, 10);

		if (periodunit === "days") {
			date = date.add(p, 'days');
		} else if (periodunit === "weeks") {
			date = date.add(p, 'weeks');
			date = date.day(ed);
		} else if (periodunit === "months") {
			date = date.add(p, 'months');
			date = date.date(ed);
		}

		return date;
	}
	return null;
}

/**
 * Escapes HTML characters in a string to prevent XSS.
 * @param {string} text
 * @returns {string}
 */
export function escapeHtml(text) {
	if (!text) return "";
	return text
		.replace(/&/g, "&amp;")
		.replace(/</g, "&lt;")
		.replace(/>/g, "&gt;")
		.replace(/"/g, "&quot;")
		.replace(/'/g, "&#039;");
}

/**
 * Timer class to track elapsed time (e.g. for break counter stopwatch).
 */
export class Timer {
	constructor() {
		this.isRunning = false;
		this.startTime = 0;
		this.overallTime = 0;
	}

	_getTimeElapsedSinceLastStart() {
		if (!this.startTime) {
			return 0;
		}
		return Date.now() - this.startTime;
	}

	start() {
		if (this.isRunning) {
			return console.warn('Timer is already running');
		}
		this.isRunning = true;
		this.startTime = Date.now();
	}

	stop() {
		if (!this.isRunning) {
			return console.warn('Timer is already stopped');
		}
		this.isRunning = false;
		this.overallTime = this.overallTime + this._getTimeElapsedSinceLastStart();
	}

	reset() {
		this.overallTime = 0;
		if (this.isRunning) {
			this.startTime = Date.now();
			return;
		}
		this.startTime = 0;
	}

	getTime() {
		if (!this.startTime) {
			return 0;
		}
		if (this.isRunning) {
			return this.overallTime + this._getTimeElapsedSinceLastStart();
		}
		return this.overallTime;
	}
}
