console.log("loaded javascript.js");

/*global $, moment, bootstrap, historyresetperiodunit, break_counter_btn */
/*eslint no-undef: "error"*/
/*exported reset, setBreakDefault, addBreakDefault, saveCleaningDay, saveBackupDay, allCheckBox, exportCSV, makeDate, break_counter, tooltipList */

// Import Bootstrap colors
// eslint-disable-next-line no-unused-vars
var bs_blue, bs_indigo, bs_purple, bs_pink, bs_red, bs_orange, bs_yellow, bs_green, bs_gray, bs_teal, bs_cyan, bs_white, bs_gray_dark, bs_primary, bs_secondary, bs_success, bs_info, bs_warning, bs_danger, bs_light, bs_dark, bs_washed_red, bs_washed_yellow, bs_washed_green;
function importBootstrapColors() {
	bs_blue = getComputedStyle(document.documentElement).getPropertyValue('--bs-blue');
	bs_indigo = getComputedStyle(document.documentElement).getPropertyValue('--bs-indigo');
	bs_purple = getComputedStyle(document.documentElement).getPropertyValue('--bs-purple');
	bs_pink = getComputedStyle(document.documentElement).getPropertyValue('--bs-pink');
	bs_red = getComputedStyle(document.documentElement).getPropertyValue('--bs-red');
	bs_orange = getComputedStyle(document.documentElement).getPropertyValue('--bs-orange');
	bs_yellow = getComputedStyle(document.documentElement).getPropertyValue('--bs-yellow');
	bs_green = getComputedStyle(document.documentElement).getPropertyValue('--bs-green');
	bs_teal = getComputedStyle(document.documentElement).getPropertyValue('--bs-teal');
	bs_cyan = getComputedStyle(document.documentElement).getPropertyValue('--bs-cyan');
	bs_white = getComputedStyle(document.documentElement).getPropertyValue('--bs-white');
	bs_gray = getComputedStyle(document.documentElement).getPropertyValue('--bs-gray');
	bs_gray_dark = getComputedStyle(document.documentElement).getPropertyValue('--bs-gray-dark');
	bs_primary = getComputedStyle(document.documentElement).getPropertyValue('--bs-primary');
	bs_secondary = getComputedStyle(document.documentElement).getPropertyValue('--bs-secondary');
	bs_success = getComputedStyle(document.documentElement).getPropertyValue('--bs-success');
	bs_info = getComputedStyle(document.documentElement).getPropertyValue('--bs-info');
	bs_warning = getComputedStyle(document.documentElement).getPropertyValue('--bs-warning');
	bs_danger = getComputedStyle(document.documentElement).getPropertyValue('--bs-danger');
	bs_light = getComputedStyle(document.documentElement).getPropertyValue('--bs-light');
	bs_dark = getComputedStyle(document.documentElement).getPropertyValue('--bs-dark');
	bs_washed_red = getComputedStyle(document.documentElement).getPropertyValue('--bs-washed-red').trim();
	bs_washed_yellow = getComputedStyle(document.documentElement).getPropertyValue('--bs-washed-yellow').trim();
	bs_washed_green = getComputedStyle(document.documentElement).getPropertyValue('--bs-washed-green').trim();
}

// eslint-disable-next-line no-unused-vars
var colorScheme; // Variable to know if in dark or light mode

// Conversion functions
function floatToTimeString(timedec) {
	const sign = timedec < 0 ? "-" : "",
		hours = Math.floor(Math.abs(timedec)),
		minutes = Math.floor((Math.abs(timedec) * 60) % 60);
	return sign + (hours < 10 ? "0" : "") + hours + ":" + (minutes < 10 ? "0" : "") + minutes;
}

const reverseDateRepresentation = date => {
	let parts = date.split('-');
	return `${parts[2]}-${parts[1]}-${parts[0]}`;
};

// Setters & getters
function getStart() {
	const time = document.getElementById("start_time").value;
	let time_dec = moment.duration(moment(time, "HH:mm").startOf('minute').format("HH:mm")).asHours();
	if (!time_dec)
		time_dec = 0;

	return time_dec;
}

function setStart(time) {
	document.getElementById("start_time").value = floatToTimeString(time);
}

function getEnd() {
	const time = document.getElementById("end_time").value;
	let time_dec = moment.duration(moment(time, "HH:mm").endOf('minute').format("HH:mm")).asHours();
	if (!time_dec)
		time_dec = now();

	return time_dec;
}

function setEnd(time) {
	if (time > 24)
		time = time - 24;

	document.getElementById("end_time").value = floatToTimeString(time);
}

function getBreak(allowNegative) {
	let time_dec;

	if (document.getElementById("breaktime_timeselection_option_timerange").checked == false) {
		const time = document.getElementById("break_time").value;
		time_dec = moment.duration(moment(time, "HH:mm").startOf('minute').format("HH:mm")).asHours();
	} else {
		let break_time_start = document.getElementById("break_time_start").value,
			break_time_end = document.getElementById("break_time_end").value;

		break_time_start = moment(break_time_start, "HH:mm");
		break_time_end = moment(break_time_end, "HH:mm");

		time_dec = moment.duration(break_time_end.diff(break_time_start)).asHours();
	}

	if (!allowNegative && (!time_dec || time_dec < 0))
		time_dec = 0;

	return time_dec;
}

function getBreakTimeStart() {
	const time = document.getElementById("break_time_start").value;
	let time_dec = moment.duration(time).asHours();
	if (!time_dec)
		time_dec = 0;

	return time_dec;
}

function setBreak(time) {
	document.getElementById("break_time").value = floatToTimeString(time);

	document.getElementById("break_time_start").value = "00:00";
	document.getElementById("break_time_end").value = floatToTimeString(time);
}

function getBreakDefault() {
	const break_time = document.getElementById("break_time_default");
	let time = break_time.options[break_time.selectedIndex].value;
	if (!time)
		time = 0;

	return time;
}

function setBreakDefault(time) {
	document.getElementById("break_time_default").value = floatToTimeString(time);
}

function addBreakDefault() {
	const break_time_default_init = localStorage.getItem("break_time_default");

	if (getBreak(false) == break_time_default_init) {
		setBreak(getBreakDefault());
		setEnd(parseFloat(getEnd()) + parseFloat(getBreakDefault()) - break_time_default_init);
	}

	localStorage.setItem("break_time_default", getBreakDefault());
	calculateTotal();
}

function getHourSchedule() {
	const hourschedule = document.getElementById("hourschedule");
	let time = hourschedule.options[hourschedule.selectedIndex].value;
	if (!time)
		time = 0;

	return parseFloat(time);
}

function setHourSchedule(time) {
	if (time)
		document.getElementById("hourschedule").value = time;
	else
		document.getElementById("hourschedule").value = "7.6";

	hourscheduleAddTimeButton(getHourSchedule());
}

function getWorktime() {
	let worktime = getEnd() - getStart();
	if (getEnd() < getStart())
		worktime = 24 + worktime;

	if (Math.abs(worktime - getHourSchedule()) <= 0.02)
		worktime = getHourSchedule();

	return worktime.toFixed(2);
}

function calculateTotal() {
	const worktime = getWorktime(),
		overtimedec = getOvertimeDec(),
		totalnobreakdec = getTotalNoBreakDec();

	setTotal(worktime);
	setOvertime(overtimedec);
	setTotalNoBreak(totalnobreakdec);

	setTotalDec(worktime);
	setOvertimeDec(overtimedec);
	setTotalNoBreakDec(totalnobreakdec);

	hourscheduleAddTimeButton(getHourSchedule());
}

function setTotal(time) {
	if (time < 0)
		time = time + 24;

	document.getElementById("total").value = floatToTimeString(time);
}

function getTotalDec() {
	return parseFloat(getWorktime()).toFixed(2);
}

function setTotalDec(time) {
	if (time < 0)
		document.getElementById("totaldec").value = "";
	else
		document.getElementById("totaldec").value = time;
}

function setOvertime(time) {
	document.getElementById("overtime").value = floatToTimeString(time);
}

function getOvertimeDec() {
	const worktime = getWorktime(),
		overtime = (worktime - getBreak(false) - getHourSchedule()).toFixed(2);

	if (overtime.toString() == "-0.00")
		return "0.00";
	else
		return overtime;
}

function setOvertimeDec(time) {
	document.getElementById("overtimedec").value = time;
}

function setOvertimeTotal(time) {
	document.getElementById("overtimetotal").value = floatToTimeString(time);

	if (time >= 0)
		document.getElementById("overtimetotal").setAttribute("style", "color: var(--bs-success);");
	else
		document.getElementById("overtimetotal").setAttribute("style", "color: var(--bs-danger);");
}

function setOvertimeWeekly(time) {
	document.getElementById("overtimeweekly").value = floatToTimeString(time);

	if (time >= 0)
		document.getElementById("overtimeweekly").setAttribute("style", "color: var(--bs-success);");
	else
		document.getElementById("overtimeweekly").setAttribute("style", "color: var(--bs-danger);");
}

function setTotalNoBreak(time) {
	document.getElementById("totalnobreak").value = floatToTimeString(time);
}

function getTotalNoBreakDec() {
	return Math.abs(parseFloat(getWorktime() - getBreak(false))).toFixed(2);
}

function setTotalNoBreakDec(time) {
	if (time < 0)
		document.getElementById("totalnobreakdec").value = "";
	else
		document.getElementById("totalnobreakdec").value = time;
}

function getSummary() {
	return document.getElementById("summary").value.replace(/\n/g, '\\n');
}

function setSummary(summary) {
	if (summary.trim().length > 0) {
		document.getElementById("summary").value = summary.replace(/\\n/g, '\n');
	}
}

function getHistoryKeys() {
	let keys = Object.keys(localStorage),
		sortedkeys = keys.map(reverseDateRepresentation).sort().map(reverseDateRepresentation), // don't do reverse() here to have dates ascending
		i = 0,
		key;

	// eslint-disable-next-line no-cond-assign
	for (i = 0; key = sortedkeys[i]; i++) {
		if (!testDateFormat(key)) {
			sortedkeys.splice(i, 1);
			i--;
		}
	}
	return sortedkeys;
}

function getHistoryDeleteOption() {
	let option;
	if (document.getElementById('historydeleteoptionperiod').checked)
		option = document.getElementById('historydeleteoptionperiod').value;
	else if (document.getElementById('historydeleteoptiondays').checked)
		option = document.getElementById('historydeleteoptiondays').value;

	if (!option)
		option = "days";

	return option;
}

function getHistoryRetain() {
	let days = document.getElementById("historyretain").value;

	if (!days)
		days = 99999;
	else if (days > 99999)
		days = 99999;

	return days;
}

function getHistoryResetDay() {
	let day = document.getElementById("historyresetday").value;

	if (!day)
		day = 31;
	else if (day > 31)
		day = 31;

	return day;
}

function getHistoryResetPeriod() {
	let period = document.getElementById("historyresetperiod").value,
		historyresetperiodunit = getHistoryResetPeriodUnit();

	if (historyresetperiodunit == "days")
		period = period > 31 ? 31 : period;
	else if (historyresetperiodunit == "weeks")
		period = period > 4 ? 4 : period;
	else if (historyresetperiodunit == "months")
		period = period > 48 ? 48 : period;

	return period;
}

function getHistoryResetPeriodUnit() {
	const historyresetperiodunit = document.getElementById("historyresetperiodunit");
	return historyresetperiodunit.options[historyresetperiodunit.selectedIndex].value;
}

function setResetDate(date) {
	document.getElementById("resetdate").value = date;
}

function getResetDate() {
	return document.getElementById("resetdate").value;
}

function getAutobackupDay() {
	let day = document.getElementById("autobackupday").value;

	if (!day)
		day = 31;
	else if (day > 31)
		day = 31;

	return day;
}

function getAutobackupPeriod() {
	let period = document.getElementById("autobackupperiod").value;

	if (historyresetperiodunit == "days")
		period = period > 31 ? 31 : period;
	else if (historyresetperiodunit == "weeks")
		period = period > 4 ? 4 : period;
	else if (historyresetperiodunit == "months")
		period = period > 48 ? 48 : period;

	return period;
}

function getAutobackupPeriodUnit() {
	const periodunit = document.getElementById("autobackupperiodunit");
	return periodunit.options[periodunit.selectedIndex].value;
}

function setBackupDate(date) {
	document.getElementById("autobackupdate").value = date;
}

function getBackupDate() {
	return document.getElementById("autobackupdate").value;
}

/*function getCountry() {
	return document.getElementById("reporting_country").value;
}*/

// UI
function showHistorydeleteoptionContent() {
	if (document.getElementById("historydeleteoptiondays").checked) {
		document.getElementById("historydeleteoptiondayscontent").classList.remove("d-none");
		document.getElementById("historydeleteoptionperiodscontent").classList.add("d-none");
	} else {
		document.getElementById("historydeleteoptiondayscontent").classList.add("d-none");
		document.getElementById("historydeleteoptionperiodscontent").classList.remove("d-none");
		maxValuesCustomTimeOption("cleaning", getHistoryResetPeriodUnit(), calculateExecutionDay(getHistoryResetDay(), getHistoryResetPeriod(), getHistoryResetPeriodUnit()), document.getElementById("historyresetperiod"), document.getElementById("historyresetday"));
	}
}

function maxValuesCustomTimeOption(type, periodunit, executionday, elem_period, elem_executionday) {
	if (periodunit == "days") {
		elem_period.setAttribute("max", "31");
		elem_executionday.value = "1";
		elem_executionday.disabled = true;
	} else if (periodunit == "weeks") {
		elem_period.setAttribute("max", "4");
		elem_executionday.setAttribute("max", "7");
		elem_executionday.disabled = false;
	} else if (periodunit == "months") {
		elem_period.setAttribute("max", "48");
		elem_executionday.setAttribute("max", "31");
		elem_executionday.disabled = false;
	}

	if (type == "cleaning")
		setResetDate(executionday.format("dddd, DD-MM-YYYY"));
	else if (type == "autobackup") {
		setBackupDate(executionday.format("dddd, DD-MM-YYYY"));
	}
}

function saveCleaningDay() {
	maxValuesCustomTimeOption("cleaning", getHistoryResetPeriodUnit(), calculateExecutionDay(getHistoryResetDay(), getHistoryResetPeriod(), getHistoryResetPeriodUnit()), document.getElementById("historyresetperiod"), document.getElementById("historyresetday"));
	localStorage.setItem("cleaningday", moment(getResetDate(), "dddd, DD-MM-YYYY").format("DD-MM-YYYY"));
	localStorage.setItem("historyresetday", getHistoryResetDay());
	localStorage.setItem("historyresetperiod", getHistoryResetPeriod());
	localStorage.setItem("historyresetperiodunit", getHistoryResetPeriodUnit());

	document.getElementById("cleaningdaysavebutton").setAttribute("style", "float: none; margin-left: 5px; vertical-align: middle; transition: 0.7s linear; color: white; background-color: var(--bs-success);");
	document.getElementById("cleaningdaysavebutton").innerHTML = '<i class="fas fa-check"></i>';
	setTimeout(function () {
		document.getElementById("cleaningdaysavebutton").innerHTML = "Save";
		document.getElementById("cleaningdaysavebutton").setAttribute("style", "float: none; margin-left: 5px; vertical-align: middle; transition: 0.7s linear;");
	}, 5000);
}

function saveBackupDay() {
	maxValuesCustomTimeOption("autobackup", getAutobackupPeriodUnit(), calculateExecutionDay(getAutobackupDay(), getAutobackupPeriod(), getAutobackupPeriodUnit()), document.getElementById("autobackupperiod"), document.getElementById("autobackupday"));
	localStorage.setItem("autobackupdate", moment(getBackupDate(), "dddd, DD-MM-YYYY").format("DD-MM-YYYY"));
	localStorage.setItem("autobackupday", getAutobackupDay());
	localStorage.setItem("autobackupperiod", getAutobackupPeriod());
	localStorage.setItem("autobackupperiodunit", getAutobackupPeriodUnit());
	//localStorage.setItem("autobackupdate", moment(todayDate(), "dddd, DD-MM-YYYY").subtract(1, "days").format("DD-MM-YYYY"));

	document.getElementById("autobackupsavebutton").setAttribute("style", "float: none; margin-left: 5px; vertical-align: middle; transition: 0.7s linear; color: white; background-color: var(--bs-success);");
	document.getElementById("autobackupsavebutton").setAttribute("style", "float: none; margin-left: 5px; vertical-align: middle; transition: 0.7s linear; color: white; background-color: var(--bs-success);");
	document.getElementById("autobackupsavebutton").innerHTML = '<i class="fas fa-check"></i>';
	setTimeout(function () {
		document.getElementById("autobackupsavebutton").innerHTML = "Save";
		document.getElementById("autobackupsavebutton").setAttribute("style", "float: none; margin-left: 5px; vertical-align: middle; transition: 0.7s linear;");
	}, 5000);
}

function calculateExecutionDay(executionday, period, periodunit) {
	let date = moment();

	if (periodunit == "days") {
		date = date.add(period, 'days');
	} else if (periodunit == "weeks") {
		date = date.add(period, 'weeks');
		date = date.day(executionday);
	} else if (periodunit == "months") {
		date = date.add(period, 'months');
		date = date.date(executionday);
	}

	return date;
}

function testDateFormat(date) {
	const userKeyRegExp = /^[0-9]{2}-[0-9]{2}-[0-9]{4}/;
	return userKeyRegExp.test(date);
}

function setHistory(refresh_edit_table) {
	let entry_history = "<table width='100%' height='100%'><tr style='border-bottom: 1px solid var(--bs-secondary);'><th style='width: 33%;'>Date</th><th style='width: 33%;text-align:right;'>Time (no break)</th><th style='width: 33%;text-align:right;'>Overtime</th></tr>",
		entry_edit_history = "",
		revkeys = getHistoryKeys().reverse(),
		overtimetotal = 0,
		overtimeweekly = 0,
		i = 0,
		key,
		timeinfo;

	// eslint-disable-next-line no-cond-assign
	for (key = 0; key = revkeys[i]; i++) {
		timeinfo = JSON.parse(localStorage.getItem(key));
		if (Object.prototype.hasOwnProperty.call(timeinfo, "OvertimeDec")) {

			// Fix for records made before the summary field was present
			if (timeinfo.Summary == undefined) {
				timeinfo.Summary = "";
				localStorage.setItem(key, JSON.stringify(timeinfo));
			}

			if (timeinfo.OvertimeDec.startsWith("-")) {
				entry_history = entry_history + "<tr class='text-danger'><td>" + key + "</td><td style='text-align:right;'>" + floatToTimeString(timeinfo.TotalNoBreakDec) + "</td><td style='text-align:right;'>" + floatToTimeString(timeinfo.OvertimeDec) + "</td></tr>";
				entry_edit_history = entry_edit_history + "<tr class='hide'><td class='text-danger pt-3-half' contenteditable='false'>" + key + "</td><td class='text-danger pt-3-half' contenteditable='true'>" + timeinfo.TotalNoBreakDec + "</td><td class='text-danger pt-3-half' contenteditable='true'>" + timeinfo.OvertimeDec + "</td><td class='text-danger pt-3-half' contenteditable='true'>" + timeinfo.TotalDec + "</td><td class='text-danger pt-3-half' contenteditable='true'>" + (timeinfo.StartDec.toLowerCase() != "correction" ? parseFloat(timeinfo.StartDec).toFixed(2) : "correction") + "</td><td class='text-danger pt-3-half' contenteditable='true'>" + timeinfo.HourSchedule + "</td><td class='text-danger pt-3-half' contenteditable='true' style='white-space: pre-wrap; word-wrap: break-word'>" + timeinfo.Summary.replace(/\\n/g, '\n') + "</td><td class=''><span class='record-save'><button type='button' class='btn btn-outline-success'><i class='fa fa-save'></i></button></span> <span class='record-delete'><button type='button' class='btn btn-outline-danger'><i class='fa fa-trash'></i></button></span></td>";
			} else {
				entry_history = entry_history + "<tr class='text-success'><td>" + key + "</td><td style='text-align:right;'>" + floatToTimeString(timeinfo.TotalNoBreakDec) + "</td><td style='text-align:right;'>" + floatToTimeString(timeinfo.OvertimeDec) + "</td></tr>";
				entry_edit_history = entry_edit_history + "<tr class='hide'><td class='text-success pt-3-half' contenteditable='false'>" + key + "</td><td class='text-success pt-3-half' contenteditable='true'>" + timeinfo.TotalNoBreakDec + "</td><td class='text-success pt-3-half' contenteditable='true'>" + timeinfo.OvertimeDec + "</td><td class='text-success pt-3-half' contenteditable='true'>" + timeinfo.TotalDec + "</td><td class='text-success pt-3-half' contenteditable='true'>" + (timeinfo.StartDec.toLowerCase() != "correction" ? parseFloat(timeinfo.StartDec).toFixed(2) : "correction") + "</td><td class='text-success pt-3-half' contenteditable='true'>" + timeinfo.HourSchedule + "</td><td class='text-success pt-3-half' contenteditable='true' style='white-space: pre-wrap; word-wrap: break-word'>" + timeinfo.Summary.replace(/\\n/g, '\n') + "</td><td class=''><span class='record-save'><button type='button' class='btn btn-outline-success'><i class='fa fa-save'></i></button></span> <span class='record-delete'><button type='button' class='btn btn-outline-danger'><i class='fa fa-trash'></i></button></span></td>";
			}
			overtimetotal = parseFloat(overtimetotal) + parseFloat(timeinfo.OvertimeDec);

			if (moment(key, "DD-MM-YYYY") >= moment().startOf('week'))
				overtimeweekly = overtimeweekly + parseFloat(timeinfo.OvertimeDec);
		}
	}

	if (revkeys == "" || revkeys == null) {
		entry_history = "No previous data yet :(";
		entry_edit_history = entry_history;
	} else {
		entry_history = entry_history + "</table>";
	}
	document.getElementById("history").innerHTML = entry_history;

	if (refresh_edit_table)
		document.getElementById("edit_history_table_body").innerHTML = entry_edit_history;

	setOvertimeTotal(overtimetotal);
	setOvertimeWeekly(overtimeweekly);
}

function notificationClosed(event) {
	const version = document.getElementById("currentappversion").innerHTML,
		lastnotifversion = localStorage.getItem("lastnotifversion");

	if (event == "click")
		localStorage.setItem("lastnotifversion", version);

	if (event == "onload" && version != lastnotifversion)
		$("#alertnotification").show();
}

function set_startminsubtract(startminsubtract_value) {
	localStorage.setItem("startminsubtract_value", startminsubtract_value);
	document.getElementById("startminsubtract_span").innerHTML = startminsubtract_value;
	document.getElementById("startminsubtract_value").value = startminsubtract_value;
}

function hourscheduleAddTimeButton(hourSchedule) {
	document.getElementById("addtimebutton_span").innerHTML = hourSchedule;
}

function breaktimeTimeselection() {
	if (document.getElementById("breaktime_timeselection_option_timerange").checked == false) {
		document.getElementById("breaktime_timeselection_option_timerange_div").classList.add("d-none");
		document.getElementById("breaktime_timeselection_option_duration_div").classList.remove("d-none");

		reset_break();

		document.getElementById('break_btn_div').removeAttribute('title');
		document.getElementById('break_btn_div').removeAttribute('data-toggle');
		document.getElementById('break_btn_div').removeAttribute('data-placement');
		document.getElementById("break_reset_btn").disabled = false;
		document.getElementById("break_add5_btn").disabled = false;
		document.getElementById("break_add30_btn").disabled = false;
		document.getElementById("break_counter_btn").disabled = false;
		// re-initialize tooltips to pickup the changes
		const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]')),
			// eslint-disable-next-line no-unused-vars
			tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
				return new bootstrap.Tooltip(tooltipTriggerEl, {
					boundary: document.body,
					'delay': { show: 1000, hide: 0 }
				});
			});
	} else {
		document.getElementById("breaktime_timeselection_option_timerange_div").classList.remove("d-none");
		document.getElementById("breaktime_timeselection_option_duration_div").classList.add("d-none");

		reset_break();

		document.getElementById('break_btn_div').setAttribute('title', 'Only available when break time option is duration. Change this in the settings view.');
		document.getElementById('break_btn_div').setAttribute('data-toggle', 'tooltip');
		document.getElementById('break_btn_div').setAttribute('data-placement', 'top');
		document.getElementById("break_reset_btn").disabled = true;
		document.getElementById("break_add5_btn").disabled = true;
		document.getElementById("break_add30_btn").disabled = true;
		document.getElementById("break_counter_btn").disabled = true;
		// re-initialize tooltips to pickup the changes
		const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]')),
			// eslint-disable-next-line no-unused-vars
			tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
				return new bootstrap.Tooltip(tooltipTriggerEl, {
					boundary: document.body,
					'delay': { show: 1000, hide: 0 }
				});
			});
	}
}

function checkInputValues() {
	let app_alert_message = "";

	if (getBreak(true) < 0 && getBreakTimeStart() > 0) {
		document.getElementById("break_time_end").value = document.getElementById("break_time_start").value;
		app_alert_message = "<b>Holy guacamole!</b> You can't end your break before you start it, can you superman?<br> Fill in when your break ended first.";
	}
	setAlertMessage(app_alert_message);
}

function setAlertMessage(app_alert_message) {
	if (app_alert_message != "") {
		document.getElementById("app_alert_message").innerHTML = app_alert_message;
		$("#app_alert").show();
		setTimeout(function () { $("#app_alert").fadeOut(); }, 10000);
	}
}

function allCheckBox(allCheckboxInput, elementId) {
	const checks = document.querySelectorAll('#' + elementId + ' input[type="checkbox"]');

	for (let i = 0; i < checks.length; i++) {
		if (allCheckboxInput.checked == true && checks[i].checked == false)
			checks[i].click();
		else if (allCheckboxInput.checked == false && checks[i].checked == true)
			checks[i].click();
	}
}

function activateConfirmationModal(message, callback) {
	$("#modalconfirm").find(".modal-body").html("<p>" + message + "</p>");

	const modal = new bootstrap.Modal(document.getElementById('modalconfirm'), {});
	modal.show();

	$("#modalconfirm").on('shown.bs.modal', function () {
		let buttons = this.querySelectorAll('.btn');
		buttons.forEach(btn => {
			btn.onclick = () => callback(btn.innerText.toLowerCase());
		});
	});
}

/*function populateWorkdayCountCountries(callback) {
	$.getJSON('https://date.nager.at/api/v3/AvailableCountries', function (response) {
		// JSON result in `response` variable
		let listitems = '<option value=none>None</option>';
		$.each(response, function (key, value) {
			listitems += '<option value=' + value.countryCode + '>' + value.name + '</option>';
		});
		$('#reporting_country').empty().append(listitems);
		callback();
	});
}*/

// Storage functions
function cleanLocalStorage() {
	let keys = Object.keys(localStorage),
		i = 0,
		today = moment(),
		deleteoption = localStorage.getItem("historydeleteoption");

	if (deleteoption == "days") {
		const expiredate = today.subtract(getHistoryRetain(), "days");
		// eslint-disable-next-line no-cond-assign
		for (let key = 0; key = keys[i]; i++) {
			if (moment(key, "DD-MM-YYYY") < expiredate && testDateFormat(key)) // days to keep data excluding today
				delete localStorage[key];
		}
	} else if (deleteoption == "period") {
		const cleaningdaystored = localStorage.getItem("cleaningday"),
			cleaningday = moment(cleaningdaystored, "DD-MM-YYYY");

		if (cleaningday.isSameOrBefore(today)) {
			deleteHistory();
			localStorage.setItem("cleaningday", calculateExecutionDay(getHistoryResetDay(), getHistoryResetPeriod(), getHistoryResetPeriodUnit()).format("DD-MM-YYYY"));
		}
	}
}

function autoBackup() {
	const today = moment(),
		backupsenabled = localStorage.getItem("autobackupoption"),
		autobackupdaystored = localStorage.getItem("autobackupdate"),
		autobackupday = moment(autobackupdaystored, "DD-MM-YYYY");

	if (backupsenabled == "true" && autobackupday.isSameOrBefore(today)) {
		alert("Performing autobackup");
		exportHistory();
		localStorage.setItem("autobackupdate", calculateExecutionDay(getAutobackupDay(), getAutobackupPeriod(), getAutobackupPeriodUnit()).format("DD-MM-YYYY"));
	}
}

function deleteHistory() {
	if (confirm("Are you sure you wish to delete your history?\nIf you choose not to, then your data will be saved until the next cleaning time.")) {
		for (let key in localStorage) {
			if (testDateFormat(key))
				delete localStorage[key];
		}
		setHistory(true);
		alert("History deleted!");
	}
}

function exportHistory() {
	const _myArray = JSON.stringify(localStorage, null, 4); //indentation in json format, human readable

	//Note: We use the anchor tag here instead button.
	const vLink = document.getElementById('exportHistoryLink');

	const vBlob = new Blob([_myArray], { type: "octet/stream" }),
		vName = 'working_history_' + todayDate() + '.json',
		vUrl = window.URL.createObjectURL(vBlob);

	vLink.setAttribute('href', vUrl);
	vLink.setAttribute('download', vName);

	//Note: Programmatically click the link to download the file
	vLink.click();
}

function exportCSV() {
	let keys = getHistoryKeys(),
		i = 0,
		key,
		timeinfo,
		items = [];

	// eslint-disable-next-line no-cond-assign
	for (key = 0; key = keys[i]; i++) {
		timeinfo = JSON.parse(localStorage.getItem(key));
		if (Object.prototype.hasOwnProperty.call(timeinfo, "OvertimeDec")) {
			timeinfo = Object.assign({ Date: key }, timeinfo); // Add date at the beginning of the json record
			//timeinfo.Date = key;
			items.push(timeinfo);
		}
	}

	//const items = json3.items;
	// https://stackoverflow.com/a/31536517
	const replacer = (key, value) => value === null ? '' : value; // Specify how you want to handle null values
	const header = Object.keys(items[0]);
	const csv = [
		header.join(','), // header row first
		...items.map(row => header.map(fieldName => JSON.stringify(row[fieldName], replacer)).join(','))
	].join('\r\n');

	//Note: We use the anchor tag here instead button.
	const vLink = document.getElementById('exportCSVLink');

	const vName = 'working_history_' + todayDate() + '.csv',
		vUrl = 'data:text/csv;charset=utf-8,' + encodeURI(csv);

	vLink.setAttribute('href', vUrl);
	vLink.setAttribute('download', vName);

	//Note: Programmatically click the link to download the file
	vLink.click();
}

const importHistory = document.getElementById('importHistory'),
	importFile = document.getElementById('importFile');
importFile.addEventListener("change", importHistoryData, false);
importHistory.onclick = function () { importFile.click(); };
function importHistoryData(e) {
	const files = e.target.files,
		reader = new FileReader();
	reader.onload = readerEvent => {
		const content = JSON.parse(readerEvent.target.result); // this is the content!
		Object.keys(content).forEach(function (k) {
			localStorage.setItem(k, content[k]);
		});
		importFile.value = ''; //clear input value after every import
		setHistory(true);
		setParameters();
	};
	reader.readAsText(files[0]);
	setParameters();
	document.getElementById("settingsmodalclosebutton").click();
	alert("Import successful!");
}

function makeDate(date) {
	const parts = date.split("-");
	return new Date(parts[2], parts[1] - 1, parts[0]);
}

// Application functions
function now() {
	return moment.duration(moment().startOf('minute').format("HH:mm")).asHours();
}

function todayDate() {
	return moment().format("DD-MM-YYYY");
}

function loadApp() {
	setEnd(0);
	setTotal(0);
	setTotalDec(0);
	setTotalNoBreak(0);
	setTotalNoBreakDec(0);
	setHistory(true);

	// 'lazy' loading
	notificationClosed("onload");
	setParameters();
	cleanLocalStorage();
	autoBackup();
	if (localStorage.length < 10)
		// eslint-disable-next-line no-undef
		startIntroduction();
}

function reset() {
	setEnd(0);
	setTotal(0);
	setTotalDec(0);
	setTotalNoBreak(0);
	setTotalNoBreakDec(0);
	setHistory(true);

	const timeinfo = JSON.parse(localStorage.getItem(todayDate()));
	if (timeinfo == null) {
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

function setParameters() {
	// Set options to parameters from localStorage
	const autoend = localStorage.getItem("autoend"),
		autoend_today_disabled = localStorage.getItem("autoend_today_disabled"),
		nosave = localStorage.getItem("nosave"),
		hourschedule = localStorage.getItem("hourschedule"),
		break_time_default = localStorage.getItem("break_time_default"),
		startminsubtract = localStorage.getItem("startminsubtract"),
		startminsubtract_value = localStorage.getItem("startminsubtract_value"),
		/*reporting_country = localStorage.getItem("country"),*/
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
		breaktime_timeselection_option_timerange = localStorage.getItem("breaktime_timeselection_option_timerange");

	if (autoend == "true")
		document.getElementById("autoend").click();
	if (autoend_today_disabled == todayDate())
		document.getElementById("autoend_today_disabled").click();
	if (nosave == todayDate())
		document.getElementById("nosave").click();
	setHourSchedule(hourschedule);
	if (break_time_default) {
		document.getElementById("break_time_default").value = break_time_default;
		setBreak(break_time_default);
	} else {
		document.getElementById("break_time_default").value = 0;
	}
	/*populateWorkdayCountCountries(function () {
		if (reporting_country) {
			//$("#reporting_country").val(reporting_country);
			document.getElementById("reporting_country").value = reporting_country;
		}
	});*/
	if (historydeleteoption == "days") {
		document.getElementById("historydeleteoptiondays").click();
	} else if (historydeleteoption == "period") {
		document.getElementById("historydeleteoptionperiod").click();
	}
	if (historyretain)
		document.getElementById("historyretain").value = historyretain;
	if (historyresetday)
		document.getElementById("historyresetday").value = historyresetday;
	if (historyresetperiod)
		document.getElementById("historyresetperiod").value = historyresetperiod;
	if (historyresetperiodunit)
		document.getElementById("historyresetperiodunit").value = historyresetperiodunit;
	showHistorydeleteoptionContent();
	if (autobackupoption == "true")
		document.getElementById("autobackupoption").click();
	if (autobackupday)
		document.getElementById("autobackupday").value = autobackupday;
	if (autobackupperiod)
		document.getElementById("autobackupperiod").value = autobackupperiod;
	if (autobackupperiodunit)
		document.getElementById("autobackupperiodunit").value = autobackupperiodunit;
	maxValuesCustomTimeOption("autobackup", getAutobackupPeriodUnit(), calculateExecutionDay(getAutobackupDay(), getAutobackupPeriod(), getAutobackupPeriodUnit()), document.getElementById("autobackupperiod"), document.getElementById("autobackupday"));
	// Set UI visibility options
	if (overtimeoption == "true" && totalhoursoption == "true" && weeklyovertimeoption == "true" && totalovertimeoption == "true" && summaryoption == "true" && historyoption == "true" && parametersoption == "true") {
		document.getElementById("alloption").click();
	} else {
		if (overtimeoption == "true" || overtimeoption === null) {
			document.getElementById("overtimeoption").click();
		}
		if (totalhoursoption == "true" || totalhoursoption === null) {
			document.getElementById("totalhoursoption").click();
		}
		if (weeklyovertimeoption == "true" || weeklyovertimeoption === null) {
			document.getElementById("weeklyovertimeoption").click();
		}
		if (totalovertimeoption == "true" || totalovertimeoption === null) {
			document.getElementById("totalovertimeoption").click();
		}
		if (summaryoption == "true" || summaryoption === null) {
			document.getElementById("summaryoption").click();
		}
		if (historyoption == "true" || historyoption === null) {
			document.getElementById("historyoption").click();
		}
		if (parametersoption == "true" || parametersoption === null) {
			document.getElementById("parametersoption").click();
		}
	}
	if (breaktime_timeselection_option_timerange == "true") {
		document.getElementById("breaktime_timeselection_option_timerange").click();
		breaktimeTimeselection();
	}

	// Check if custom time to subtract from start is stored and set value appropriatly
	if (!startminsubtract_value)
		set_startminsubtract("5");
	else
		set_startminsubtract(startminsubtract_value);

	// If subtract from start is checked set UI and deduct the amount of time stored in localstorage
	// If the page was already opened today, fill in that start time
	const timeinfo = JSON.parse(localStorage.getItem(todayDate()));
	if (timeinfo == null) {
		if (startminsubtract == "true") {
			document.getElementById("startminsubtract").click();

			// Fix convert minutes to subtract to decimal
			const startminsubtract_value_decimal = moment.duration("00:" + startminsubtract_value).asHours();
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
		if (startminsubtract == "true")
			document.getElementById("startminsubtract").click();
	}
}

// eslint-disable-next-line no-unused-vars
function end_time() {
	setEnd(now());
	calculateTotal();
}

function add_time(time) {
	setEnd(getStart() + time + getBreak(false));
	calculateTotal();
}

// eslint-disable-next-line no-unused-vars
function add_break(time) {
	setBreak(time + getBreak(false));
	setEnd(time + getEnd());
	calculateTotal();
}

function reset_break() {
	// Timer functionality
	timer.stop(); // Stop break timer
	timer.reset(); // Reset break timer
	clearInterval(refreshIntervalId); // Clear break timer refresh interval
	break_counter_started = false;
	break_counter_btn.innerHTML = "<i class='fal fa-stopwatch'></i> Start";
	break_counter_btn.classList.remove("btn-warning");
	break_counter_btn.classList.add("btn-primary");
	break_counter_btn.classList.remove("pulsate");

	// Regular functionality
	setEnd(getEnd() - getBreak(false));
	setBreak(0);
	calculateTotal();
}

class Timer {
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

const timer = new Timer(); // Initialize object to
let break_counter_started = false,
	refreshIntervalId = 0;
function break_counter() {
	const break_counter_btn = document.getElementById("break_counter_btn");

	// Delete old localstorage entries for previous version timer
	localStorage.removeItem("break_counter_start_time");
	localStorage.removeItem("break_counter_started");

	if (break_counter_started) {
		break_counter_started = false;
		timer.stop();
		clearInterval(refreshIntervalId);

		const timeInSeconds = Math.round(timer.getTime() / 1000),
			timeInDecimalHours = moment.duration(moment.utc(timeInSeconds * 1000).format('HH:mm:ss')).asHours();
		setBreak(timeInDecimalHours);
		add_time(getHourSchedule());

		break_counter_btn.innerHTML = "<i class='fal fa-stopwatch'></i> Resume";
		break_counter_btn.classList.remove("btn-warning");
		break_counter_btn.classList.add("btn-primary");
		break_counter_btn.classList.remove("pulsate");
	} else {
		break_counter_started = true;
		timer.start();

		refreshIntervalId = setInterval(() => {
			const timeInSeconds = Math.round(timer.getTime() / 1000),
				timeInDecimalHours = moment.duration(moment.utc(timeInSeconds * 1000).format('HH:mm:ss')).asHours();
			setBreak(timeInDecimalHours);
			add_time(getHourSchedule());
		}, 1000);

		break_counter_btn.innerHTML = "<i class='fal fa-stopwatch fa-spin'></i> Stop";
		break_counter_btn.classList.remove("btn-primary");
		break_counter_btn.classList.add("btn-warning");
		break_counter_btn.classList.add("pulsate");
	}

}

window.onbeforeunload = function () {
	// Set 'dont save today' and 'automatically set end time' parameters in local storage
	const nosave = document.getElementById("nosave"),
		autoend = document.getElementById("autoend"),
		autoend_today_disabled = document.getElementById("autoend_today_disabled");
	if (nosave.checked == false) {
		if (autoend.checked == false) {
			localStorage.setItem("autoend", "false");
			localStorage.setItem("autoend_today_disabled", "false");
		} else {
			if (autoend_today_disabled.checked == true) {
				localStorage.setItem("autoend_today_disabled", todayDate());
			} else {
				setEnd(now());
				localStorage.setItem("autoend_today_disabled", "false");
			}
			localStorage.setItem("autoend", "true");
		}
		const timeinfo = '{"TotalNoBreakDec": "' + getTotalNoBreakDec() + '", "OvertimeDec": "' + getOvertimeDec() + '", "TotalDec": "' + getTotalDec() + '", "StartDec": "' + getStart() + '", "HourSchedule": "' + getHourSchedule().toFixed(2) + '", "Summary": "' + getSummary() + '"}';
		localStorage.setItem(todayDate(), timeinfo);
		localStorage.setItem("nosave", "false");
	} else {
		localStorage.setItem("autoend", autoend.checked.toString());
		localStorage.setItem("nosave", todayDate());
	}
	// Set 'subtract 5 min from start time' parameter in local storage
	localStorage.setItem("startminsubtract", document.getElementById("startminsubtract").checked.toString());
	// Set 'hour schedule' parameter in local storage get set in #hourschedule listener
	// Set 'default break time' parameter in local storage
	localStorage.setItem("break_time_default", getBreakDefault());
	// Clear break counter
	localStorage.setItem("break_counter_started", "false");
	// Set 'history retain time' parameter in local storage
	localStorage.setItem("historydeleteoption", getHistoryDeleteOption());
	localStorage.setItem("historyretain", getHistoryRetain());
	// Set 'default break time' parameter in local storage
	//localStorage.setItem("country", getCountry());
	// Set UI visibility options
	localStorage.setItem("overtimeoption", document.getElementById("overtimeoption").checked.toString());
	localStorage.setItem("totalhoursoption", document.getElementById("totalhoursoption").checked.toString());
	localStorage.setItem("weeklyovertimeoption", document.getElementById("weeklyovertimeoption").checked.toString());
	localStorage.setItem("totalovertimeoption", document.getElementById("totalovertimeoption").checked.toString());
	localStorage.setItem("summaryoption", document.getElementById("summaryoption").checked.toString());
	localStorage.setItem("historyoption", document.getElementById("historyoption").checked.toString());
	localStorage.setItem("autobackupoption", document.getElementById("autobackupoption").checked.toString());
	localStorage.setItem("parametersoption", document.getElementById("parametersoption").checked.toString());
	localStorage.setItem("breaktime_timeselection_option_timerange", document.getElementById("breaktime_timeselection_option_timerange").checked.toString());
};

// Listeners and initializers
$(document).ready(function () {
	importBootstrapColors();
	loadApp();

	if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
		colorScheme = "dark";
		document.querySelector("html").setAttribute("data-bs-theme", "dark");
	} else {
		colorScheme = "light";
		document.querySelector("html").setAttribute("data-bs-theme", "light");
	}

	const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]')),
		// eslint-disable-next-line no-unused-vars
		tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
			return new bootstrap.Tooltip(tooltipTriggerEl, {
				boundary: document.body,
				'delay': { show: 1000, hide: 0 }
			});
		});

	moment().format(); // Initialize momentjs
	document.getElementById("year_span").innerHTML = moment().year();

	let myModal;
	if (window.location.href.indexOf('#about') != -1) {
		myModal = new bootstrap.Modal(document.getElementById('modalabout'));
		myModal.show();
	}
	if (window.location.href.indexOf('#settings') != -1) {
		myModal = new bootstrap.Modal(document.getElementById('modalsettings'));
		myModal.show();
	}
	if (window.location.href.indexOf('#info') != -1) {
		myModal = new bootstrap.Modal(document.getElementById('modalinfo'));
		myModal.show();
	}
	if (window.location.href.indexOf('#history') != -1) {
		myModal = new bootstrap.Modal(document.getElementById('modaledithistory'));
		myModal.show();
	}
	if (window.location.href.indexOf('#reporting') != -1) {
		myModal = new bootstrap.Modal(document.getElementById('modalreporting'));
		myModal.show();
	}
	if (window.location.href.indexOf('#policy') != -1) {
		myModal = new bootstrap.Modal(document.getElementById('modalpolicy'));
		myModal.show();
	}
});

$(window).on("load", function () {
	if ("serviceWorker" in navigator) {
		navigator.serviceWorker.register("service-worker.js", { scope: "/" })
			.then(function (registration) {
				console.log("Service worker registered successfully:", registration);
			}).catch(function (e) {
				console.error("Error during service worker registration:", e);
			});
	}
});

$(document).on('keydown', function (e) {
	if (e.keyCode === 13) //ENTER key code
		add_time(getHourSchedule());
});

window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', event => {
	if (event.matches) {
		colorScheme = "dark";
		document.querySelector("html").setAttribute("data-bs-theme", "dark");
	} else {
		colorScheme = "light";
		document.querySelector("html").setAttribute("data-bs-theme", "light");
	}
});

$("input").focusout(function () {
	checkInputValues();
});

$(".btn").mouseup(function () {
	// Fix buttons keeping focus after being clicked
	this.blur();
});

$("#app_alert").on("close.bs.alert", function () {
	$(this).hide();
	return false;
});

$("#hourschedule").on('change', function () {
	activateConfirmationModal("Do you want to set the hour schedule for every day?<br>If not, the selected value will only be applicable today.", choice => {
		if (choice == "yes")
			localStorage.setItem("hourschedule", getHourSchedule());
	});
});
