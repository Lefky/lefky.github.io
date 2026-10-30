/**
 * ui.js
 * Manages DOM interaction, input field getters/setters, visual tables,
 * theme management, notifications, modal alerts, and UI event binding.
 */

/*global bootstrap, dayjs, startIntroduction */
import {
	floatToTimeString,
	timeStringToFloat,
	reverseDateRepresentation,
	adjustEndTimeForOvertime,
	calculateWorktime,
	calculateOvertime,
	calculateTotalNoBreak,
	calculateExecutionDay,
	now,
	todayDate,
	testDateFormat,
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
	cleanLocalStorage,
	autoBackup
} from './storage.js';

// Bootstrap color variables
export let bs_blue, bs_indigo, bs_purple, bs_pink, bs_red, bs_orange, bs_yellow,
	bs_green, bs_teal, bs_cyan, bs_white, bs_gray, bs_gray_dark, bs_primary,
	bs_secondary, bs_success, bs_info, bs_warning, bs_danger, bs_light,
	bs_light_subtle, bs_dark, bs_body_bg, bs_washed_red, bs_washed_yellow, bs_washed_green;

export let colorScheme = "light";

/**
 * Extracts CSS color variables from computed styles and injects dynamic subtle background style.
 */
export function importBootstrapColors() {
	const style = getComputedStyle(document.documentElement);
	bs_blue = style.getPropertyValue('--bs-blue');
	bs_indigo = style.getPropertyValue('--bs-indigo');
	bs_purple = style.getPropertyValue('--bs-purple');
	bs_pink = style.getPropertyValue('--bs-pink');
	bs_red = style.getPropertyValue('--bs-red');
	bs_orange = style.getPropertyValue('--bs-orange');
	bs_yellow = style.getPropertyValue('--bs-yellow');
	bs_green = style.getPropertyValue('--bs-green');
	bs_teal = style.getPropertyValue('--bs-teal');
	bs_cyan = style.getPropertyValue('--bs-cyan');
	bs_white = style.getPropertyValue('--bs-white');
	bs_gray = style.getPropertyValue('--bs-gray');
	bs_gray_dark = style.getPropertyValue('--bs-gray-dark');
	bs_primary = style.getPropertyValue('--bs-primary');
	bs_secondary = style.getPropertyValue('--bs-secondary');
	bs_success = style.getPropertyValue('--bs-success');
	bs_info = style.getPropertyValue('--bs-info');
	bs_warning = style.getPropertyValue('--bs-warning');
	bs_danger = style.getPropertyValue('--bs-danger');
	bs_light = style.getPropertyValue('--bs-light');
	bs_light_subtle = style.getPropertyValue('--bs-light-bg-subtle');
	bs_dark = style.getPropertyValue('--bs-dark');
	bs_body_bg = style.getPropertyValue('--bs-body-bg');
	bs_washed_red = (style.getPropertyValue('--bs-washed-red') || "").trim();
	bs_washed_yellow = (style.getPropertyValue('--bs-washed-yellow') || "").trim();
	bs_washed_green = (style.getPropertyValue('--bs-washed-green') || "").trim();

	// Expose globally for legacy external scripts (e.g. graphs.js)
	if (typeof window !== 'undefined') {
		window.bs_blue = bs_blue;
		window.bs_indigo = bs_indigo;
		window.bs_purple = bs_purple;
		window.bs_pink = bs_pink;
		window.bs_red = bs_red;
		window.bs_orange = bs_orange;
		window.bs_yellow = bs_yellow;
		window.bs_green = bs_green;
		window.bs_teal = bs_teal;
		window.bs_cyan = bs_cyan;
		window.bs_white = bs_white;
		window.bs_gray = bs_gray;
		window.bs_gray_dark = bs_gray_dark;
		window.bs_primary = bs_primary;
		window.bs_secondary = bs_secondary;
		window.bs_success = bs_success;
		window.bs_info = bs_info;
		window.bs_warning = bs_warning;
		window.bs_danger = bs_danger;
		window.bs_light = bs_light;
		window.bs_light_subtle = bs_light_subtle;
		window.bs_dark = bs_dark;
		window.bs_body_bg = bs_body_bg;
		window.bs_washed_red = bs_washed_red;
		window.bs_washed_yellow = bs_washed_yellow;
		window.bs_washed_green = bs_washed_green;
	}

	function hexToRgb(hex) {
		hex = hex.replace(/^#/, '');
		if (hex.length === 3) {
			hex = hex.split('').map(char => char + char).join('');
		}
		const bigint = parseInt(hex, 16);
		const r = (bigint >> 16) & 255;
		const g = (bigint >> 8) & 255;
		const b = bigint & 255;
		return { r, g, b };
	}

	const opacity = 0.4;
	try {
		const gray200_hex = style.getPropertyValue('--bs-gray-200').trim();
		const rgb = hexToRgb(gray200_hex);

		if (rgb) {
			const newRule = `
                [data-bs-theme="light"] .bg-light-subtle {
                    background-color: rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${opacity}) !important;
                }
            `;
			const styleId = 'custom-bg-subtle-style';
			let styleElem = document.getElementById(styleId);

			if (!styleElem) {
				styleElem = document.createElement('style');
				styleElem.id = styleId;
				document.head.appendChild(styleElem);
			}
			styleElem.textContent = newRule;
		}
	} catch (e) {
		console.error("Error applying custom bg-light-subtle style:", e);
	}
}

// Timer state
export const timer = new Timer();
let weeklyOvertimeBalance = 0;
let break_counter_started = false;
let refreshIntervalId = 0;

// Input Getters and Setters
export function getStart() {
	const elem = document.getElementById("start_time");
	let time_dec = elem ? timeStringToFloat(elem.value) : 0;
	return time_dec || 0;
}

export function setStart(time) {
	const elem = document.getElementById("start_time");
	if (elem) elem.value = floatToTimeString(time);
}

export function getEnd() {
	const elem = document.getElementById("end_time");
	let time_dec = elem ? timeStringToFloat(elem.value) : 0;
	if (!time_dec) time_dec = now();
	return time_dec;
}

export function setEnd(time) {
	if (time > 24) time = time - 24;
	const elem = document.getElementById("end_time");
	if (elem) elem.value = floatToTimeString(time);
}

export function getBreak(allowNegative) {
	let time_dec;
	const timerangeOpt = document.getElementById("breaktime_timeselection_option_timerange");

	if (!timerangeOpt || !timerangeOpt.checked) {
		const breakInput = document.getElementById("break_time");
		time_dec = breakInput ? timeStringToFloat(breakInput.value) : 0;
	} else {
		const breakStart = document.getElementById("break_time_start");
		const breakEnd = document.getElementById("break_time_end");

		if (typeof dayjs !== 'undefined' && breakStart && breakEnd) {
			const startObj = dayjs(breakStart.value, "HH:mm");
			const endObj = dayjs(breakEnd.value, "HH:mm");
			time_dec = dayjs.duration(endObj.diff(startObj)).asHours();
		} else {
			time_dec = 0;
		}
	}

	if (!allowNegative && (!time_dec || time_dec < 0)) {
		time_dec = 0;
	}

	return time_dec;
}

export function getBreakTimeStart() {
	const elem = document.getElementById("break_time_start");
	let time_dec = elem ? timeStringToFloat(elem.value) : 0;
	return time_dec || 0;
}

export function setBreak(time) {
	const breakInput = document.getElementById("break_time");
	const breakStart = document.getElementById("break_time_start");
	const breakEnd = document.getElementById("break_time_end");

	if (breakInput) breakInput.value = floatToTimeString(time);
	if (breakStart) breakStart.value = "00:00";
	if (breakEnd) breakEnd.value = floatToTimeString(time);
}

export function getBreakDefault() {
	const break_time = document.getElementById("break_time_default");
	if (!break_time || break_time.selectedIndex < 0) return 0;
	let time = break_time.options[break_time.selectedIndex].value;
	return time || 0;
}

export function setBreakDefault(time) {
	const elem = document.getElementById("break_time_default");
	if (elem) elem.value = floatToTimeString(time);
}

export function addBreakDefault() {
	const break_time_default_init = localStorage.getItem("break_time_default");

	if (getBreak(false) === break_time_default_init) {
		setBreak(getBreakDefault());
		setEnd(parseFloat(getEnd()) + parseFloat(getBreakDefault()) - break_time_default_init);
	}

	localStorage.setItem("break_time_default", getBreakDefault());
	calculateTotal();
}

export function getHourSchedule() {
	const hourschedule = document.getElementById("hourschedule");
	if (!hourschedule || hourschedule.selectedIndex < 0) return 7.6;
	let time = hourschedule.options[hourschedule.selectedIndex].value;
	return time ? parseFloat(time) : 0;
}

export function setHourSchedule(time) {
	const elem = document.getElementById("hourschedule");
	if (elem) {
		elem.value = time ? time : "7.6";
	}
	hourscheduleAddTimeButton(getHourSchedule());
}

export function setCustomHourSchedule(time) {
	if (time) {
		localStorage.setItem("customhourschedule_value", time);
		localStorage.setItem("hourschedule", time);
		setCustomHourScheduleUI(time);
	} else {
		localStorage.removeItem("customhourschedule_value");
	}
}

export function setCustomHourScheduleUI(time) {
	const input = document.getElementById("customhourschedule_value");
	if (input) input.value = time || "";

	const select = document.getElementById("hourschedule");
	if (!select) return;

	const existingOption = document.getElementById("customhourschedule_value_option");
	if (existingOption) existingOption.remove();

	if (time) {
		const custom_option = document.createElement('option');
		custom_option.value = time;
		custom_option.id = "customhourschedule_value_option";
		if (time.includes(",")) {
			custom_option.innerHTML = time + "h &ensp;&ensp;&emsp;&emsp;(custom option)";
		} else {
			custom_option.innerHTML = time + "h &ensp;&nbsp;&emsp;&emsp;&emsp;(custom option)";
		}
		select.appendChild(custom_option);
		select.value = time;
	}
}

export function getWorktime() {
	return calculateWorktime(getStart(), getEnd(), getHourSchedule(), getBreak(false));
}

export function calculateTotal() {
	const worktime = getWorktime();
	const overtimedec = getOvertimeDec();
	const totalnobreakdec = getTotalNoBreakDec();

	setTotal(worktime);
	setOvertime(overtimedec);
	setTotalNoBreak(totalnobreakdec);

	setTotalDec(worktime);
	setOvertimeDec(overtimedec);
	setTotalNoBreakDec(totalnobreakdec);

	hourscheduleAddTimeButton(getHourSchedule());
}

export function setTotal(time) {
	let numTime = parseFloat(time);
	if (numTime < 0) numTime = numTime + 24;
	const elem = document.getElementById("total");
	if (elem) elem.value = floatToTimeString(numTime);
}

export function getTotalDec() {
	return parseFloat(getWorktime()).toFixed(2);
}

export function setTotalDec(time) {
	const elem = document.getElementById("totaldec");
	if (!elem) return;
	if (parseFloat(time) < 0) {
		elem.value = "";
	} else {
		elem.value = time;
	}
}

export function setOvertime(time) {
	const elem = document.getElementById("overtime");
	if (elem) elem.value = floatToTimeString(time);
}

export function getOvertimeDec() {
	return calculateOvertime(getWorktime(), getBreak(false), getHourSchedule());
}

export function setOvertimeDec(time) {
	const elem = document.getElementById("overtimedec");
	if (elem) elem.value = time;
}

export function setOvertimeTotal(time) {
	const elem = document.getElementById("overtimetotal");
	if (!elem) return;
	elem.value = floatToTimeString(time);
	if (time >= 0) {
		elem.setAttribute("style", "color: var(--bs-success);");
	} else {
		elem.setAttribute("style", "color: var(--bs-danger);");
	}
}

export function setOvertimeWeekly(time) {
	const elem = document.getElementById("overtimeweekly");
	if (!elem) return;
	elem.value = floatToTimeString(time);
	if (time >= 0) {
		elem.setAttribute("style", "color: var(--bs-success);");
	} else {
		elem.setAttribute("style", "color: var(--bs-danger);");
	}
}

export function setTotalNoBreak(time) {
	const elem = document.getElementById("totalnobreak");
	if (elem) elem.value = floatToTimeString(time);
}

export function getTotalNoBreakDec() {
	return calculateTotalNoBreak(getWorktime(), getBreak(false));
}

export function setTotalNoBreakDec(time) {
	const elem = document.getElementById("totalnobreakdec");
	if (!elem) return;
	if (parseFloat(time) < 0) {
		elem.value = "";
	} else {
		elem.value = time;
	}
}

export function getSummary() {
	const elem = document.getElementById("summary");
	return elem ? elem.value : "";
}

export function setSummary(summary) {
	const elem = document.getElementById("summary");
	if (elem && summary && summary.trim().length > 0) {
		elem.value = summary.replace(/\\n/g, '\n');
	}
}

export function setResetDate(date) {
	const elem = document.getElementById("resetdate");
	if (elem) elem.value = date;
}

export function getResetDate() {
	const elem = document.getElementById("resetdate");
	return elem ? elem.value : "";
}

export function setBackupDate(date) {
	const elem = document.getElementById("autobackupdate");
	if (elem) elem.value = date;
}

export function getBackupDate() {
	const elem = document.getElementById("autobackupdate");
	return elem ? elem.value : "";
}

export function showHistorydeleteoptionContent() {
	const daysChecked = document.getElementById("historydeleteoptiondays") && document.getElementById("historydeleteoptiondays").checked;
	const daysContent = document.getElementById("historydeleteoptiondayscontent");
	const periodsContent = document.getElementById("historydeleteoptionperiodscontent");

	if (daysChecked) {
		if (daysContent) daysContent.classList.remove("d-none");
		if (periodsContent) periodsContent.classList.add("d-none");
	} else {
		if (daysContent) daysContent.classList.add("d-none");
		if (periodsContent) periodsContent.classList.remove("d-none");
		maxValuesCustomTimeOption(
			"cleaning",
			getHistoryResetPeriodUnit(),
			calculateExecutionDay(getHistoryResetDay(), getHistoryResetPeriod(), getHistoryResetPeriodUnit()),
			document.getElementById("historyresetperiod"),
			document.getElementById("historyresetday")
		);
	}
}

export function maxValuesCustomTimeOption(type, periodunit, executionday, elem_period, elem_executionday) {
	if (!elem_period || !elem_executionday) return;

	if (periodunit === "days") {
		elem_period.setAttribute("max", "31");
		elem_executionday.value = "1";
		elem_executionday.disabled = true;
	} else if (periodunit === "weeks") {
		elem_period.setAttribute("max", "4");
		elem_executionday.setAttribute("max", "7");
		elem_executionday.disabled = false;
	} else if (periodunit === "months") {
		elem_period.setAttribute("max", "48");
		elem_executionday.setAttribute("max", "31");
		elem_executionday.disabled = false;
	}

	if (executionday) {
		if (type === "cleaning") {
			setResetDate(executionday.format("dddd, DD-MM-YYYY"));
		} else if (type === "autobackup") {
			setBackupDate(executionday.format("dddd, DD-MM-YYYY"));
		}
	}
}

export function setHistory(refresh_edit_table) {
	let entry_history = "<table width='100%' height='100%'><tr style='border-bottom: 1px solid var(--bs-secondary);'><th style='width: 33%;'>Date</th><th style='width: 33%;text-align:right;'>Time (no break)</th><th style='width: 33%;text-align:right;'>Overtime</th></tr>";
	let entry_edit_history = "";
	const revkeys = getHistoryKeys().reverse();
	let overtimetotal = 0;
	let overtimeweekly = 0;

	for (let i = 0; i < revkeys.length; i++) {
		const key = revkeys[i];
		try {
			const timeinfo = JSON.parse(localStorage.getItem(key));
			if (timeinfo && Object.prototype.hasOwnProperty.call(timeinfo, "OvertimeDec")) {
				if (timeinfo.Summary === undefined) {
					timeinfo.Summary = "";
				}

				const colorClass = (parseFloat(timeinfo.OvertimeDec) < 0) ? "text-danger" : "text-success";
				entry_history += `<tr class='${colorClass}'><td>${key}</td><td style='text-align:right;'>${floatToTimeString(timeinfo.TotalNoBreakDec)}</td><td style='text-align:right;'>${floatToTimeString(timeinfo.OvertimeDec)}</td></tr>`;

				overtimetotal += parseFloat(timeinfo.OvertimeDec) || 0;
				if (typeof dayjs !== 'undefined' &&
					key !== todayDate() &&
					dayjs(key, "DD-MM-YYYY").isSameOrAfter(dayjs().startOf('week'))) {
					overtimeweekly += parseFloat(timeinfo.OvertimeDec) || 0;
				}

				const dateIso = reverseDateRepresentation(key);
				const startString = (timeinfo.StartDec !== "correction") ? floatToTimeString(timeinfo.StartDec) : "";
				const workedString = (timeinfo.TotalNoBreakDec !== "correction") ? floatToTimeString(timeinfo.TotalNoBreakDec) : "";

				let breakDec = 0;
				if (timeinfo.TotalDec !== "correction" && timeinfo.TotalNoBreakDec !== "correction") {
					breakDec = Math.abs(parseFloat(timeinfo.TotalDec) - parseFloat(timeinfo.TotalNoBreakDec));
				}
				const breakString = floatToTimeString(breakDec);
				const scheduleVal = timeinfo.HourSchedule || "";
				const summaryVal = timeinfo.Summary ? timeinfo.Summary.replace(/"/g, "&quot;") : "";

				entry_edit_history += `
				<tr>
					<td class="p-1">
						<input type="date" class="form-control history-date" value="${dateIso}">
					</td>
					<td class="p-1">
						<input type="time" class="form-control history-start" value="${startString}">
					</td>
					<td class="p-1">
						<input type="time" class="form-control history-break" value="${breakString}">
					</td>
					<td class="p-1">
						<input type="time" class="form-control history-total" value="${workedString}">
					</td>
					<td class="p-1">
						<input type="number" step="0.01" class="form-control history-schedule" value="${scheduleVal}">
					</td>
					<td class="p-1">
						<input type="text" class="form-control history-summary" value="${summaryVal}">
					</td>
					<td>
						<span class="record-save">
							<button type="button" class="btn btn-outline-success btn-sm">
								<i class="fa fa-save"></i>
							</button>
						</span>
						<span class="record-delete">
							<button type="button" class="btn btn-outline-danger btn-sm">
								<i class="fa fa-trash"></i>
							</button>
						</span>
					</td>
				</tr>`;
			}
		} catch (e) {
			console.error("Error processing history for " + key, e);
		}
	}

	if (revkeys.length === 0) {
		entry_history = "No previous data yet :(";
		entry_edit_history = entry_history;
	} else {
		entry_history = entry_history + "</table>";
	}

	const historyElem = document.getElementById("history");
	if (historyElem) historyElem.innerHTML = entry_history;

	if (refresh_edit_table) {
		const editHistoryElem = document.getElementById("edit_history_table_body");
		if (editHistoryElem) editHistoryElem.innerHTML = entry_edit_history;
	}

	setOvertimeTotal(overtimetotal);
	weeklyOvertimeBalance = overtimeweekly;
	setOvertimeWeekly(overtimeweekly);
}

export function notificationClosed(event) {
	const versionElem = document.getElementById("currentappversion");
	const version = versionElem ? versionElem.innerHTML : "";
	const notif = document.getElementById("alertnotification");
	const notificationVersion = notif ? notif.dataset.notificationVersion || version : version;
	const lastnotifversion = localStorage.getItem("lastnotifversion");

	if (event === "click") {
		localStorage.setItem("lastnotifversion", notificationVersion);
	}

	if (event === "onload" && notif && notificationVersion !== lastnotifversion) {
		notif.style.display = "block";
		notif.classList.add("show");
	}
}

export function set_startminsubtract(startminsubtract_value) {
	localStorage.setItem("startminsubtract_value", startminsubtract_value);
	const span = document.getElementById("startminsubtract_span");
	if (span) span.innerHTML = startminsubtract_value;
	const valInput = document.getElementById("startminsubtract_value");
	if (valInput) valInput.value = startminsubtract_value;
}

export function hourscheduleAddTimeButton(hourSchedule) {
	const span = document.getElementById("addtimebutton_span");
	if (span) span.innerHTML = hourSchedule;
}

export function breaktimeTimeselection() {
	const timerangeOpt = document.getElementById("breaktime_timeselection_option_timerange");
	const isDuration = !timerangeOpt || !timerangeOpt.checked;

	const timerangeDiv = document.getElementById("breaktime_timeselection_option_timerange_div");
	const breakDefaultLabel = document.getElementById("break_time_default_label");
	const breakDefaultDiv = document.getElementById("break_time_default_div");
	const durationDiv = document.getElementById("breaktime_timeselection_option_duration_div");
	const breakBtnDiv = document.getElementById('break_btn_div');

	const breakResetBtn = document.getElementById("break_reset_btn");
	const breakAdd5Btn = document.getElementById("break_add5_btn");
	const breakAdd30Btn = document.getElementById("break_add30_btn");
	const breakCounterBtn = document.getElementById("break_counter_btn");

	if (isDuration) {
		if (timerangeDiv) timerangeDiv.classList.add("d-none");
		if (breakDefaultLabel) breakDefaultLabel.classList.remove("d-none");
		if (breakDefaultDiv) breakDefaultDiv.classList.remove("d-none");
		if (durationDiv) durationDiv.classList.remove("d-none");

		reset_break();

		if (breakBtnDiv) {
			breakBtnDiv.removeAttribute('title');
			breakBtnDiv.removeAttribute('data-toggle');
			breakBtnDiv.removeAttribute('data-placement');
		}

		if (breakResetBtn) breakResetBtn.disabled = false;
		if (breakAdd5Btn) breakAdd5Btn.disabled = false;
		if (breakAdd30Btn) breakAdd30Btn.disabled = false;
		if (breakCounterBtn) breakCounterBtn.disabled = false;
	} else {
		if (timerangeDiv) timerangeDiv.classList.remove("d-none");
		if (breakDefaultLabel) breakDefaultLabel.classList.add("d-none");
		if (breakDefaultDiv) breakDefaultDiv.classList.add("d-none");
		if (durationDiv) durationDiv.classList.add("d-none");

		reset_break();

		if (breakBtnDiv) {
			breakBtnDiv.setAttribute('title', 'Only available when break time option is duration. Change this in the settings view.');
			breakBtnDiv.setAttribute('data-toggle', 'tooltip');
			breakBtnDiv.setAttribute('data-placement', 'top');
		}

		if (breakResetBtn) breakResetBtn.disabled = true;
		if (breakAdd5Btn) breakAdd5Btn.disabled = true;
		if (breakAdd30Btn) breakAdd30Btn.disabled = true;
		if (breakCounterBtn) breakCounterBtn.disabled = true;
	}

	if (typeof bootstrap !== 'undefined') {
		const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
		tooltipTriggerList.forEach(function (tooltipTriggerEl) {
			return new bootstrap.Tooltip(tooltipTriggerEl, {
				boundary: document.body,
				delay: { show: 1000, hide: 0 }
			});
		});
	}
}

export function checkInputValues() {
	let app_alert_message = "";
	if (getBreak(true) < 0 && getBreakTimeStart() > 0) {
		const breakEnd = document.getElementById("break_time_end");
		const breakStart = document.getElementById("break_time_start");
		if (breakEnd && breakStart) breakEnd.value = breakStart.value;
		app_alert_message = "<b>Holy guacamole!</b> You can't end your break before you start it, can you superman?<br> Fill in when your break ended first.";
	}
	setAlertMessage(app_alert_message);
}

export function setAlertMessage(message) {
	const alertBox = document.getElementById("app_alert");
	const msgBox = document.getElementById("app_alert_message");

	if (alertBox && msgBox && message !== "") {
		msgBox.innerHTML = message;
		alertBox.style.display = "block";
		alertBox.style.opacity = "1";

		setTimeout(function () {
			alertBox.style.transition = "opacity 1s ease-out";
			alertBox.style.opacity = "0";
			setTimeout(() => { alertBox.style.display = "none"; }, 1000);
		}, 10000);
	}
}

export function allCheckBox(allCheckboxInput, elementId) {
	const checks = document.querySelectorAll('#' + elementId + ' input[type="checkbox"]');
	for (let i = 0; i < checks.length; i++) {
		if (allCheckboxInput.checked === true && checks[i].checked === false) {
			checks[i].click();
		} else if (allCheckboxInput.checked === false && checks[i].checked === true) {
			checks[i].click();
		}
	}
}

export function activateConfirmationModal(message, callback) {
	const modalEl = document.getElementById('modalconfirm');
	if (!modalEl || typeof bootstrap === 'undefined') return;

	modalEl.querySelector(".modal-body").innerHTML = "<p>" + message + "</p>";
	const modal = new bootstrap.Modal(modalEl, {});
	modal.show();

	modalEl.addEventListener('shown.bs.modal', function () {
		const buttons = this.querySelectorAll('.btn');
		buttons.forEach(btn => {
			btn.onclick = () => callback(btn.innerText.toLowerCase());
		});
	}, { once: true });
}

export function setTheme(theme) {
	if (theme === "auto") {
		if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
			colorScheme = "dark";
			document.querySelector("html").setAttribute("data-bs-theme", "dark");
		} else {
			colorScheme = "light";
			document.querySelector("html").setAttribute("data-bs-theme", "light");
		}
		localStorage.setItem("theme", "auto");
	} else {
		document.documentElement.setAttribute('data-bs-theme', theme);
		colorScheme = theme;
		localStorage.setItem("theme", theme);
	}
	if (typeof window !== 'undefined') {
		window.colorScheme = colorScheme;
	}
}

export function end_time() {
	setEnd(now());
	calculateTotal();
}

export function add_time(time) {
	setEnd(getStart() + time + getBreak(false));
	calculateTotal();
}

export function applyWeeklyOvertime() {
	const adjustedEnd = adjustEndTimeForOvertime(getStart(), getEnd(), weeklyOvertimeBalance);
	setEnd(adjustedEnd);
	calculateTotal();
}

export function add_break(time) {
	const normalizedTime = Math.abs(time - 0.084) < 0.001 ? (5 / 60) : time;
	setBreak(normalizedTime + getBreak(false));
	setEnd(normalizedTime + getEnd());
	calculateTotal();
}

export function reset_break() {
	timer.stop();
	timer.reset();
	clearInterval(refreshIntervalId);
	break_counter_started = false;

	const breakCounterBtn = document.getElementById("break_counter_btn");
	if (breakCounterBtn) {
		breakCounterBtn.innerHTML = "<i class='fal fa-stopwatch'></i> Start";
		breakCounterBtn.classList.remove("btn-warning", "pulsate");
		breakCounterBtn.classList.add("btn-primary");
	}

	setEnd(getEnd() - getBreak(false));
	setBreak(0);
	calculateTotal();
}

export function break_counter() {
	const breakCounterBtn = document.getElementById("break_counter_btn");

	localStorage.removeItem("break_counter_start_time");
	localStorage.removeItem("break_counter_started");

	if (break_counter_started) {
		break_counter_started = false;
		timer.stop();
		clearInterval(refreshIntervalId);

		const timeInSeconds = Math.round(timer.getTime() / 1000);
		if (typeof dayjs !== 'undefined') {
			const time = dayjs(dayjs.utc(timeInSeconds * 1000), "HH:mm:ss");
			const timeInDecimalHours = dayjs.duration(time.diff(time.startOf('day')), 'milliseconds').asHours();
			setBreak(timeInDecimalHours);
			add_time(getHourSchedule());
		}

		if (breakCounterBtn) {
			breakCounterBtn.innerHTML = "<i class='fal fa-stopwatch'></i> Resume";
			breakCounterBtn.classList.remove("btn-warning", "pulsate");
			breakCounterBtn.classList.add("btn-primary");
		}
	} else {
		break_counter_started = true;
		timer.start();

		refreshIntervalId = setInterval(() => {
			const timeInSeconds = Math.round(timer.getTime() / 1000);
			if (typeof dayjs !== 'undefined') {
				const time = dayjs(dayjs.utc(timeInSeconds * 1000), "HH:mm:ss");
				const timeInDecimalHours = dayjs.duration(time.diff(time.startOf('day')), 'milliseconds').asHours();
				setBreak(timeInDecimalHours);
				add_time(getHourSchedule());
			}
		}, 1000);

		if (breakCounterBtn) {
			breakCounterBtn.innerHTML = "<i class='fal fa-stopwatch fa-spin'></i> Stop";
			breakCounterBtn.classList.remove("btn-primary");
			breakCounterBtn.classList.add("btn-warning", "pulsate");
		}
	}
}

export function reset() {
	setEnd(0);
	setTotal(0);
	setTotalDec(0);
	setTotalNoBreak(0);
	setTotalNoBreakDec(0);
	setHistory(true);

	const timeinfo = JSON.parse(localStorage.getItem(todayDate()));
	if (timeinfo === null) {
		setStart(now());
		add_time(getHourSchedule());
	} else {
		setStart(timeinfo.StartDec);
		setBreak(timeinfo.TotalDec - timeinfo.TotalNoBreakDec);
		setEnd(parseFloat(timeinfo.StartDec) + parseFloat(timeinfo.TotalDec));
		setSummary(timeinfo.Summary);
		calculateTotal();
	}
}

export function loadApp() {
	setEnd(0);
	setTotal(0);
	setTotalDec(0);
	setTotalNoBreak(0);
	setTotalNoBreakDec(0);
	setHistory(true);

	notificationClosed("onload");
	setParameters();
	cleanLocalStorage();
	autoBackup();

	if (localStorage.length < 10 && typeof startIntroduction === 'function') {
		startIntroduction();
	}
}

export function setParameters() {
	const autoend = localStorage.getItem("autoend"),
		autoend_today_disabled = localStorage.getItem("autoend_today_disabled"),
		nosave = localStorage.getItem("nosave"),
		hourschedule = localStorage.getItem("hourschedule"),
		customhourschedule_value = localStorage.getItem("customhourschedule_value"),
		break_time_default = localStorage.getItem("break_time_default"),
		startminsubtract = localStorage.getItem("startminsubtract"),
		startminsubtract_value = localStorage.getItem("startminsubtract_value"),
		historydeleteoption = localStorage.getItem("historydeleteoption"),
		historyretain = localStorage.getItem("historyretain"),
		historyresetday = localStorage.getItem("historyresetday"),
		historyresetperiod = localStorage.getItem("historyresetperiod"),
		historyresetperiodunit = localStorage.getItem("historyresetperiodunit"),
		autobackupoption = localStorage.getItem("autobackupoption"),
		autobackupday = localStorage.getItem("autobackupday"),
		autobackupperiod = localStorage.getItem("autobackupperiod"),
		autobackupperiodunit = localStorage.getItem("autobackupperiodunit"),
		overtimeoption = localStorage.getItem("overtimeoption"),
		totalhoursoption = localStorage.getItem("totalhoursoption"),
		summaryoption = localStorage.getItem("summaryoption"),
		historyoption = localStorage.getItem("historyoption"),
		weeklyovertimeoption = localStorage.getItem("weeklyovertimeoption"),
		totalovertimeoption = localStorage.getItem("totalovertimeoption"),
		parametersoption = localStorage.getItem("parametersoption"),
		breaktime_timeselection_option_timerange = localStorage.getItem("breaktime_timeselection_option_timerange"),
		theme = localStorage.getItem("theme");

	if (autoend === "true" && document.getElementById("autoend"))
		document.getElementById("autoend").click();
	if (autoend_today_disabled === todayDate() && document.getElementById("autoend_today_disabled"))
		document.getElementById("autoend_today_disabled").click();
	if (nosave === todayDate() && document.getElementById("nosave"))
		document.getElementById("nosave").click();

	setCustomHourScheduleUI(customhourschedule_value);
	setHourSchedule(hourschedule);

	if (break_time_default) {
		const btd = document.getElementById("break_time_default");
		if (btd) btd.value = break_time_default;
		setBreak(break_time_default);
	} else {
		const btd = document.getElementById("break_time_default");
		if (btd) btd.value = 0;
	}

	if (historydeleteoption === "days" && document.getElementById("historydeleteoptiondays")) {
		document.getElementById("historydeleteoptiondays").click();
	} else if (historydeleteoption === "period" && document.getElementById("historydeleteoptionperiod")) {
		document.getElementById("historydeleteoptionperiod").click();
	}

	if (historyretain && document.getElementById("historyretain"))
		document.getElementById("historyretain").value = historyretain;
	if (historyresetday && document.getElementById("historyresetday"))
		document.getElementById("historyresetday").value = historyresetday;
	if (historyresetperiod && document.getElementById("historyresetperiod"))
		document.getElementById("historyresetperiod").value = historyresetperiod;
	if (historyresetperiodunit && document.getElementById("historyresetperiodunit"))
		document.getElementById("historyresetperiodunit").value = historyresetperiodunit;

	showHistorydeleteoptionContent();

	if (autobackupoption === "true" && document.getElementById("autobackupoption"))
		document.getElementById("autobackupoption").click();
	if (autobackupday && document.getElementById("autobackupday"))
		document.getElementById("autobackupday").value = autobackupday;
	if (autobackupperiod && document.getElementById("autobackupperiod"))
		document.getElementById("autobackupperiod").value = autobackupperiod;
	if (autobackupperiodunit && document.getElementById("autobackupperiodunit"))
		document.getElementById("autobackupperiodunit").value = autobackupperiodunit;

	maxValuesCustomTimeOption(
		"autobackup",
		getAutobackupPeriodUnit(),
		calculateExecutionDay(getAutobackupDay(), getAutobackupPeriod(), getAutobackupPeriodUnit()),
		document.getElementById("autobackupperiod"),
		document.getElementById("autobackupday")
	);

	// Visibility options
	if (overtimeoption === "true" && totalhoursoption === "true" && weeklyovertimeoption === "true" && totalovertimeoption === "true" && summaryoption === "true" && historyoption === "true" && parametersoption === "true") {
		const allOpt = document.getElementById("alloption");
		if (allOpt) allOpt.click();
	} else {
		if ((overtimeoption === "true" || overtimeoption === null) && document.getElementById("overtimeoption"))
			document.getElementById("overtimeoption").click();
		if ((totalhoursoption === "true" || totalhoursoption === null) && document.getElementById("totalhoursoption"))
			document.getElementById("totalhoursoption").click();
		if ((weeklyovertimeoption === "true" || weeklyovertimeoption === null) && document.getElementById("weeklyovertimeoption"))
			document.getElementById("weeklyovertimeoption").click();
		if ((totalovertimeoption === "true" || totalovertimeoption === null) && document.getElementById("totalovertimeoption"))
			document.getElementById("totalovertimeoption").click();
		if ((summaryoption === "true" || summaryoption === null) && document.getElementById("summaryoption"))
			document.getElementById("summaryoption").click();
		if ((historyoption === "true" || historyoption === null) && document.getElementById("historyoption"))
			document.getElementById("historyoption").click();
		if ((parametersoption === "true" || parametersoption === null) && document.getElementById("parametersoption"))
			document.getElementById("parametersoption").click();
	}

	if (breaktime_timeselection_option_timerange === "true") {
		const brkTr = document.getElementById("breaktime_timeselection_option_timerange");
		if (brkTr) brkTr.click();
		breaktimeTimeselection();
	}

	setTheme(theme ? theme : "auto");
	const appearanceRadio = document.getElementById("appearance_" + (theme ? theme : "auto"));
	if (appearanceRadio) appearanceRadio.checked = true;

	if (!startminsubtract_value) {
		set_startminsubtract("5");
	} else {
		set_startminsubtract(startminsubtract_value);
	}

	const timeinfo = JSON.parse(localStorage.getItem(todayDate()));
	if (timeinfo === null) {
		if (startminsubtract === "true") {
			const startminSub = document.getElementById("startminsubtract");
			if (startminSub) startminSub.click();
			let startminsubtract_value_decimal = 0;
			if (typeof dayjs !== 'undefined') {
				startminsubtract_value_decimal = dayjs.duration({ minutes: startminsubtract_value || 5 }).asHours();
			}
			setStart(now() - startminsubtract_value_decimal);
		} else {
			setStart(now());
		}
		add_time(getHourSchedule());
	} else {
		setStart(timeinfo.StartDec);
		setBreak(timeinfo.TotalDec - timeinfo.TotalNoBreakDec);
		setEnd(parseFloat(timeinfo.StartDec) + parseFloat(timeinfo.TotalDec));
		setSummary(timeinfo.Summary);
		calculateTotal();
		if (startminsubtract === "true") {
			const startminSub = document.getElementById("startminsubtract");
			if (startminSub) startminSub.click();
		}
	}
}

/**
 * Persists current session data to localStorage on page unload.
 */
export function handleBeforeUnload() {
	const nosave = document.getElementById("nosave");
	const autoend = document.getElementById("autoend");
	const autoend_session_disabled = document.getElementById("autoend_session_disabled");
	const autoend_today_disabled = document.getElementById("autoend_today_disabled");

	if (nosave && !nosave.checked) {
		if (autoend && !autoend.checked) {
			localStorage.setItem("autoend", "false");
			localStorage.setItem("autoend_today_disabled", "false");
		} else if (autoend) {
			if ((autoend_today_disabled && autoend_today_disabled.checked) || (autoend_session_disabled && autoend_session_disabled.checked)) {
				if (autoend_today_disabled && autoend_today_disabled.checked) {
					localStorage.setItem("autoend_today_disabled", todayDate());
				}
			} else {
				setEnd(now());
				localStorage.setItem("autoend_today_disabled", "false");
			}
			localStorage.setItem("autoend", "true");
		}

		const timeinfo = {
			TotalNoBreakDec: getTotalNoBreakDec(),
			OvertimeDec: getOvertimeDec(),
			TotalDec: getTotalDec(),
			StartDec: getStart().toString(),
			HourSchedule: getHourSchedule().toFixed(2),
			Summary: getSummary()
		};

		localStorage.setItem(todayDate(), JSON.stringify(timeinfo));
		localStorage.setItem("nosave", "false");
	} else if (autoend) {
		localStorage.setItem("autoend", autoend.checked.toString());
		localStorage.setItem("nosave", todayDate());
	}

	const startMinSub = document.getElementById("startminsubtract");
	if (startMinSub) localStorage.setItem("startminsubtract", startMinSub.checked.toString());
	localStorage.setItem("break_time_default", getBreakDefault());
	localStorage.setItem("break_counter_started", "false");
	localStorage.setItem("historydeleteoption", getHistoryDeleteOption());
	localStorage.setItem("historyretain", getHistoryRetain());

	const optIds = [
		"overtimeoption", "totalhoursoption", "weeklyovertimeoption",
		"totalovertimeoption", "summaryoption", "historyoption",
		"autobackupoption", "parametersoption", "breaktime_timeselection_option_timerange"
	];
	optIds.forEach(id => {
		const el = document.getElementById(id);
		if (el) localStorage.setItem(id, el.checked.toString());
	});
}

/**
 * Initializes general UI event listeners (inputs, modals, hash routing, buttons).
 */
export function initUIEventListeners() {
	document.querySelectorAll("input").forEach(input => {
		input.addEventListener("focusout", () => {
			checkInputValues();
		});
	});

	document.querySelectorAll(".btn").forEach(btn => {
		btn.addEventListener("mouseup", function () {
			this.blur();
		});
	});

	const appAlert = document.getElementById("app_alert");
	if (appAlert) {
		appAlert.addEventListener("close.bs.alert", function (event) {
			event.preventDefault();
			this.style.display = "none";
		});
	}

	const hourScheduleSelect = document.getElementById("hourschedule");
	if (hourScheduleSelect) {
		hourScheduleSelect.addEventListener('change', function () {
			activateConfirmationModal("Do you want to set the hour schedule for every day?<br>If not, the selected value will only be applicable today.", choice => {
				if (choice === "yes") {
					localStorage.setItem("hourschedule", getHourSchedule());
				}
			});
		});
	}

	const yearSpan = document.getElementById("year_span");
	if (yearSpan && typeof dayjs !== 'undefined') {
		yearSpan.innerHTML = dayjs().year();
	}

	// Hash modal routing
	if (typeof bootstrap !== 'undefined') {
		const hashModals = [
			{ hash: '#about', id: 'modalabout' },
			{ hash: '#settings', id: 'modalsettings' },
			{ hash: '#info', id: 'modalinfo' },
			{ hash: '#history', id: 'modaledithistory' },
			{ hash: '#reporting', id: 'modalreporting' },
			{ hash: '#policy', id: 'modalpolicy' }
		];
		hashModals.forEach(({ hash, id }) => {
			if (window.location.href.indexOf(hash) !== -1) {
				const elem = document.getElementById(id);
				if (elem) {
					const modal = new bootstrap.Modal(elem);
					modal.show();
				}
			}
		});
	}
}
