/**
 * javascript.js
 * Main ES6 entry point and module orchestrator.
 * Aggregates and re-exports submodules (time-calc, storage, ui, export),
 * initializes application lifecycle, and exposes public API on window for
 * backward compatibility with HTML inline event handlers and legacy scripts.
 */

console.log("loaded javascript.js (ES6 modular)");

/*global dayjs, bootstrap */

// 1. Import all modules
import {
	floatToTimeString,
	timeStringToFloat,
	reverseDateRepresentation,
	testDateFormat,
	now,
	todayDate,
	calculateWorktime,
	calculateOvertime,
	calculateTotalNoBreak,
	calculateExecutionDay,
	escapeHtml,
	Timer
} from './time-calc.js';

import {
	getHistoryKeys,
	getHistoryDeleteOption,
	getHistoryRetain,
	getHistoryResetDay,
	getHistoryResetPeriod,
	getHistoryResetPeriodUnit,
	getAutobackupDay,
	getAutobackupPeriod,
	getAutobackupPeriodUnit,
	getDayRecord,
	saveDayRecord,
	cleanLocalStorage,
	autoBackup,
	deleteHistory,
	saveCleaningDay,
	saveBackupDay
} from './storage.js';

import {
	importBootstrapColors,
	colorScheme,
	bs_blue, bs_indigo, bs_purple, bs_pink, bs_red, bs_orange, bs_yellow,
	bs_green, bs_teal, bs_cyan, bs_white, bs_gray, bs_gray_dark, bs_primary,
	bs_secondary, bs_success, bs_info, bs_warning, bs_danger, bs_light,
	bs_light_subtle, bs_dark, bs_body_bg, bs_washed_red, bs_washed_yellow, bs_washed_green,
	timer,
	getStart,
	setStart,
	getEnd,
	setEnd,
	getBreak,
	getBreakTimeStart,
	setBreak,
	getBreakDefault,
	setBreakDefault,
	addBreakDefault,
	getHourSchedule,
	setHourSchedule,
	setCustomHourSchedule,
	setCustomHourScheduleUI,
	getWorktime,
	calculateTotal,
	setTotal,
	getTotalDec,
	setTotalDec,
	setOvertime,
	getOvertimeDec,
	setOvertimeDec,
	setOvertimeTotal,
	setOvertimeWeekly,
	setTotalNoBreak,
	getTotalNoBreakDec,
	setTotalNoBreakDec,
	getSummary,
	setSummary,
	setResetDate,
	getResetDate,
	setBackupDate,
	getBackupDate,
	showHistorydeleteoptionContent,
	maxValuesCustomTimeOption,
	setHistory,
	notificationClosed,
	set_startminsubtract,
	hourscheduleAddTimeButton,
	breaktimeTimeselection,
	checkInputValues,
	setAlertMessage,
	allCheckBox,
	activateConfirmationModal,
	setTheme,
	end_time,
	add_time,
	add_break,
	reset_break,
	break_counter,
	reset,
	loadApp,
	setParameters,
	handleBeforeUnload,
	initUIEventListeners
} from './ui.js';

import {
	exportHistory,
	exportCSV,
	setExportRange,
	exportPDF,
	importHistoryData,
	initImportExport
} from './export.js';

// 2. Re-export for external ES6 modules
export {
	floatToTimeString,
	timeStringToFloat,
	reverseDateRepresentation,
	testDateFormat,
	now,
	todayDate,
	calculateWorktime,
	calculateOvertime,
	calculateTotalNoBreak,
	calculateExecutionDay,
	escapeHtml,
	Timer,
	getHistoryKeys,
	getHistoryDeleteOption,
	getHistoryRetain,
	getHistoryResetDay,
	getHistoryResetPeriod,
	getHistoryResetPeriodUnit,
	getAutobackupDay,
	getAutobackupPeriod,
	getAutobackupPeriodUnit,
	getDayRecord,
	saveDayRecord,
	cleanLocalStorage,
	autoBackup,
	deleteHistory,
	saveCleaningDay,
	saveBackupDay,
	importBootstrapColors,
	colorScheme,
	bs_blue, bs_indigo, bs_purple, bs_pink, bs_red, bs_orange, bs_yellow,
	bs_green, bs_teal, bs_cyan, bs_white, bs_gray, bs_gray_dark, bs_primary,
	bs_secondary, bs_success, bs_info, bs_warning, bs_danger, bs_light,
	bs_light_subtle, bs_dark, bs_body_bg, bs_washed_red, bs_washed_yellow, bs_washed_green,
	timer,
	getStart,
	setStart,
	getEnd,
	setEnd,
	getBreak,
	getBreakTimeStart,
	setBreak,
	getBreakDefault,
	setBreakDefault,
	addBreakDefault,
	getHourSchedule,
	setHourSchedule,
	setCustomHourSchedule,
	setCustomHourScheduleUI,
	getWorktime,
	calculateTotal,
	setTotal,
	getTotalDec,
	setTotalDec,
	setOvertime,
	getOvertimeDec,
	setOvertimeDec,
	setOvertimeTotal,
	setOvertimeWeekly,
	setTotalNoBreak,
	getTotalNoBreakDec,
	setTotalNoBreakDec,
	getSummary,
	setSummary,
	setResetDate,
	getResetDate,
	setBackupDate,
	getBackupDate,
	showHistorydeleteoptionContent,
	maxValuesCustomTimeOption,
	setHistory,
	notificationClosed,
	set_startminsubtract,
	hourscheduleAddTimeButton,
	breaktimeTimeselection,
	checkInputValues,
	setAlertMessage,
	allCheckBox,
	activateConfirmationModal,
	setTheme,
	end_time,
	add_time,
	add_break,
	reset_break,
	break_counter,
	reset,
	loadApp,
	setParameters,
	handleBeforeUnload,
	initUIEventListeners,
	exportHistory,
	exportCSV,
	setExportRange,
	exportPDF,
	importHistoryData,
	initImportExport
};

// 3. Expose functions and state on global window object
// This ensures seamless compatibility with HTML inline onclick/onchange attributes
// and legacy scripts (graphs.js, editable_table.js, animations.js, introduction.js).
if (typeof window !== 'undefined') {
	window.floatToTimeString = floatToTimeString;
	window.timeStringToFloat = timeStringToFloat;
	window.reverseDateRepresentation = reverseDateRepresentation;
	window.testDateFormat = testDateFormat;
	window.now = now;
	window.todayDate = todayDate;
	window.calculateWorktime = calculateWorktime;
	window.calculateOvertime = calculateOvertime;
	window.calculateTotalNoBreak = calculateTotalNoBreak;
	window.calculateExecutionDay = calculateExecutionDay;
	window.escapeHtml = escapeHtml;
	window.Timer = Timer;

	window.getHistoryKeys = getHistoryKeys;
	window.getHistoryDeleteOption = getHistoryDeleteOption;
	window.getHistoryRetain = getHistoryRetain;
	window.getHistoryResetDay = getHistoryResetDay;
	window.getHistoryResetPeriod = getHistoryResetPeriod;
	window.getHistoryResetPeriodUnit = getHistoryResetPeriodUnit;
	window.getAutobackupDay = getAutobackupDay;
	window.getAutobackupPeriod = getAutobackupPeriod;
	window.getAutobackupPeriodUnit = getAutobackupPeriodUnit;
	window.getDayRecord = getDayRecord;
	window.saveDayRecord = saveDayRecord;
	window.cleanLocalStorage = cleanLocalStorage;
	window.autoBackup = autoBackup;
	window.deleteHistory = deleteHistory;
	window.saveCleaningDay = saveCleaningDay;
	window.saveBackupDay = saveBackupDay;

	window.importBootstrapColors = importBootstrapColors;
	window.colorScheme = colorScheme;
	window.timer = timer;
	window.getStart = getStart;
	window.setStart = setStart;
	window.getEnd = getEnd;
	window.setEnd = setEnd;
	window.getBreak = getBreak;
	window.getBreakTimeStart = getBreakTimeStart;
	window.setBreak = setBreak;
	window.getBreakDefault = getBreakDefault;
	window.setBreakDefault = setBreakDefault;
	window.addBreakDefault = addBreakDefault;
	window.getHourSchedule = getHourSchedule;
	window.setHourSchedule = setHourSchedule;
	window.setCustomHourSchedule = setCustomHourSchedule;
	window.setCustomHourScheduleUI = setCustomHourScheduleUI;
	window.getWorktime = getWorktime;
	window.calculateTotal = calculateTotal;
	window.setTotal = setTotal;
	window.getTotalDec = getTotalDec;
	window.setTotalDec = setTotalDec;
	window.setOvertime = setOvertime;
	window.getOvertimeDec = getOvertimeDec;
	window.setOvertimeDec = setOvertimeDec;
	window.setOvertimeTotal = setOvertimeTotal;
	window.setOvertimeWeekly = setOvertimeWeekly;
	window.setTotalNoBreak = setTotalNoBreak;
	window.getTotalNoBreakDec = getTotalNoBreakDec;
	window.setTotalNoBreakDec = setTotalNoBreakDec;
	window.getSummary = getSummary;
	window.setSummary = setSummary;
	window.setResetDate = setResetDate;
	window.getResetDate = getResetDate;
	window.setBackupDate = setBackupDate;
	window.getBackupDate = getBackupDate;
	window.showHistorydeleteoptionContent = showHistorydeleteoptionContent;
	window.maxValuesCustomTimeOption = maxValuesCustomTimeOption;
	window.setHistory = setHistory;
	window.notificationClosed = notificationClosed;
	window.set_startminsubtract = set_startminsubtract;
	window.hourscheduleAddTimeButton = hourscheduleAddTimeButton;
	window.breaktimeTimeselection = breaktimeTimeselection;
	window.checkInputValues = checkInputValues;
	window.setAlertMessage = setAlertMessage;
	window.allCheckBox = allCheckBox;
	window.activateConfirmationModal = activateConfirmationModal;
	window.setTheme = setTheme;
	window.end_time = end_time;
	window.add_time = add_time;
	window.add_break = add_break;
	window.reset_break = reset_break;
	window.break_counter = break_counter;
	window.reset = reset;
	window.loadApp = loadApp;
	window.setParameters = setParameters;

	window.exportHistory = exportHistory;
	window.exportCSV = exportCSV;
	window.setExportRange = setExportRange;
	window.exportPDF = exportPDF;
	window.importHistoryData = importHistoryData;
}

// 4. Initialize Application Lifecycle and Global Listeners
function initializeApp() {
	if (typeof dayjs !== 'undefined') {
		dayjs().format();
		if (window.dayjs_plugin_duration) dayjs.extend(window.dayjs_plugin_duration);
		if (window.dayjs_plugin_isSameOrBefore) dayjs.extend(window.dayjs_plugin_isSameOrBefore);
		if (window.dayjs_plugin_customParseFormat) dayjs.extend(window.dayjs_plugin_customParseFormat);
		if (window.dayjs_plugin_utc) dayjs.extend(window.dayjs_plugin_utc);
		if (window.dayjs_plugin_isBetween) dayjs.extend(window.dayjs_plugin_isBetween);
	}

	importBootstrapColors();
	loadApp();
	initImportExport();
	initUIEventListeners();

	if (typeof bootstrap !== 'undefined') {
		const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
		tooltipTriggerList.map(function (tooltipTriggerEl) {
			return new bootstrap.Tooltip(tooltipTriggerEl, {
				boundary: document.body,
				delay: { show: 1000, hide: 0 }
			});
		});
	}
}

if (document.readyState === "loading") {
	document.addEventListener("DOMContentLoaded", initializeApp);
} else {
	initializeApp();
}

window.addEventListener("load", function () {
	if ("serviceWorker" in navigator) {
		navigator.serviceWorker.register("service-worker.js", { scope: "/" })
			.then(function (registration) {
				console.log("Service worker registered successfully:", registration);
			}).catch(function (e) {
				console.error("Error during service worker registration:", e);
			});
	}
});

window.onbeforeunload = function () {
	handleBeforeUnload();
};

document.addEventListener('keydown', function (e) {
	if (e.keyCode === 13) {
		add_time(getHourSchedule());
	}
});

if (window.matchMedia) {
	window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
		const appearance = document.querySelector('input[name="appearance"]:checked');
		if (appearance && appearance.value === "auto") {
			setTheme("auto");
		}
	});
}
