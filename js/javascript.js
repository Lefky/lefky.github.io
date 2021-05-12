console.log("loaded javascript.js");

// var filesadded="";

// Conversion functions
/*
function timeStringToFloat(time) {
	var hoursMinutes = time.split(/[.:]/);
	var hours = parseInt(hoursMinutes[0], 10);
	var minutes = hoursMinutes[1] ? parseInt(hoursMinutes[1], 10) : 0;
	var time = hours + minutes / 60;
	return Math.round((time + Number.EPSILON) * 100) / 100;
}
*/
function floatToTimeString(timedec){
	var sign = timedec < 0 ? "-" : "";
	var hours = Math.floor(Math.abs(timedec));
	var minutes = Math.floor((Math.abs(timedec) * 60) % 60);
	return sign + (hours < 10 ? "0" : "") + hours + ":" + (minutes < 10 ? "0" : "") + minutes;
	
	/*
	if (timedec < 0) {
		return "-" + moment().startOf('day').subtract(timedec, 'hours').format('HH:mm')
	}
	return moment().startOf('day').add(timedec, 'hours').format('HH:mm')
	*/
}

const reverseDateRepresentation = date => {
	let parts = date.split('-');
	return `${parts[2]}-${parts[1]}-${parts[0]}`;
};

// Setters & getters
function getStart(){
	var time = document.getElementById("start_time").value;
	//var time_dec = timeStringToFloat(time);
	var time_dec = moment.duration(time).asHours();
	if (!time_dec) {
		time_dec = 0;
	}
	return time_dec;
}

function setStart(time){
	document.getElementById("start_time").value = floatToTimeString(time);
}

function getEnd(){
	var time = document.getElementById("end_time").value;
	//var time_dec = timeStringToFloat(time);
	var time_dec = moment.duration(time).asHours();
	if (!time_dec) {
		time_dec = now();
	}
	
	return time_dec;
}

function setEnd(time){
	if (time > 24) {
		time = time - 24;
	}
	document.getElementById("end_time").value = floatToTimeString(time);
}

function getBreak(allowNegative){
	if (document.getElementById("breaktime_timeselection_option_timerange").checked == false) {
		var time = document.getElementById("break_time").value;
		var time_dec = moment.duration(time).asHours();
	} else {
		var break_time_start = document.getElementById("break_time_start").value,
			break_time_end = document.getElementById("break_time_end").value;
			
		break_time_start = moment(break_time_start, "hh:mm");
		break_time_end = moment(break_time_end, "hh:mm");
				
		var time_dec = moment.duration(break_time_end.diff(break_time_start)).asHours();
		
		/*
		if (time_dec < 0) {
			document.getElementById("break_time_start").value = "00:00";
			document.getElementById("alertmessage").innerHTML = "<b>Holy guacamole!</b> You can't end your break before you start it, can you superman?<br> Fill in when your break ended first.";
			$("#app_alert").show();
			setTimeout(function() {$("#app_alert").fadeOut();}, 5000);
		}
		*/
	}

	if (!allowNegative && (!time_dec || time_dec < 0)) {
		time_dec = 0;
	}
	return time_dec;
}

function getBreakTimeStart(){
	var time = document.getElementById("break_time_start").value;
	//var time_dec = timeStringToFloat(time);
	var time_dec = moment.duration(time).asHours();
	if (!time_dec) {
		time_dec = 0;
	}
	return time_dec;
}

function setBreak(time){
	document.getElementById("break_time").value = floatToTimeString(time);
	
	document.getElementById("break_time_start").value = "00:00";
	document.getElementById("break_time_end").value = floatToTimeString(time);
}

function getBreakDefault(){
	var e = document.getElementById("break_time_default");
	var time = e.options[e.selectedIndex].value;
	if (!time) {
		time = 0;
	}
	return time;
}

function setBreakDefault(time){
	document.getElementById("break_time_default").value = floatToTimeString(time);
}

function addBreakDefault(){	
	var break_time_default_init = localStorage.getItem("break_time_default");
	/*
	var new_break_dec = getBreak(false) - break_time_default_init + getBreakDefault();
	console.log("break: "+getBreak(false)+" init: "+break_time_default_init+" default: "+getBreakDefault());
	
	if ( new_break_dec > 0 ) {
		setBreak(new_break_dec);
	} else {
		setBreak(0);
	}
	*/
	
	if(getBreak(false) == break_time_default_init) {
		setBreak(getBreakDefault());
		setEnd(parseFloat(getEnd()) + parseFloat(getBreakDefault()) - break_time_default_init);
	}
	
	localStorage.setItem("break_time_default", getBreakDefault());
	calculateTotal();
}

function getHourSchedule(){
	var e = document.getElementById("hourschedule");
	var time = e.options[e.selectedIndex].value;
	if (!time) {
		time = 0;
	}
	return parseFloat(time);
}

function setHourSchedule(time){
	if ( time ) {
		document.getElementById("hourschedule").value = time;
	} else {
		document.getElementById("hourschedule").value = "7.6";
	}
	hourscheduleAddTimeButton();
}

function getWorktime(){
	var worktime = 0;
	if (getEnd() < getStart()) {
		worktime = 24 + getEnd() - getStart();
		if ( Math.abs(worktime - getHourSchedule()) <= 0.02 ){
			worktime = getHourSchedule();
		}
		return worktime.toFixed(2);
	}
	
	worktime = getEnd() - getStart();
	if ( Math.abs(worktime - getHourSchedule()) <= 0.02 ){
			worktime = getHourSchedule();
	}
	return worktime.toFixed(2);
}

function calculateTotal(){
	var worktime = getWorktime(),
		overtimedec = getOvertimeDec(),
		totalnobreakdec = getTotalNoBreakDec();

	setTotal(worktime);
	setOvertime(overtimedec);
	setTotalNoBreak(totalnobreakdec);
	
	setTotalDec(worktime);
	setOvertimeDec(overtimedec);
	setTotalNoBreakDec(totalnobreakdec);
	
	hourscheduleAddTimeButton();
}

function setTotal(time){
	if (time < 0) {
		time = time + 24;
	}
	document.getElementById("total").value = floatToTimeString(time);
}

function getTotalDec(){
	var worktime = getWorktime();
	return parseFloat(worktime).toFixed(2);
}

function setTotalDec(time){
	if ( time < 0 )
		document.getElementById("totaldec").value = "";
	else
		document.getElementById("totaldec").value = time;
}

function setOvertime(time){
	document.getElementById("overtime").value = floatToTimeString(time);
}

function getOvertimeDec(){
	var worktime = getWorktime(),
		overtime = worktime - getBreak(false) - getHourSchedule();
		overtime = overtime.toFixed(2);

	if (overtime.toString() == "-0.00"){
		return "0.00";
	} else {
		return overtime;
	}
}

function setOvertimeDec(time){
	document.getElementById("overtimedec").value = time;
}

function setOvertimeTotal(time){
	document.getElementById("overtimetotal").value = floatToTimeString(time);
	if ( time >= 0 ) {
		document.getElementById("overtimetotal").setAttribute("style", "color:green;");
	} else {
		document.getElementById("overtimetotal").setAttribute("style", "color:red;");
	}
}

function setOvertimeWeekly(time){
	document.getElementById("overtimeweekly").value = floatToTimeString(time);
	if ( time >= 0 ) {
		document.getElementById("overtimeweekly").setAttribute("style", "color:green;");
	} else {
		document.getElementById("overtimeweekly").setAttribute("style", "color:red;");
	}
}

function setTotalNoBreak(time){
	document.getElementById("totalnobreak").value = floatToTimeString(time);
}

function getTotalNoBreakDec(){
	var worktime = getWorktime();
	return Math.abs(parseFloat(worktime - getBreak(false))).toFixed(2);
}

function setTotalNoBreakDec(time){
	if ( time < 0 )
		document.getElementById("totalnobreakdec").value = "";
	else
		document.getElementById("totalnobreakdec").value = time;
}

function getHistory(){
	var keys = Object.keys(localStorage),
		sortedkeys = keys.map(reverseDateRepresentation).sort().map(reverseDateRepresentation), // don't do reverse() here to have dates ascending
		i = 0,
		key;

	for (i = 0; key = sortedkeys[i]; i++) {
		if (!testDateFormat(key)) {
			sortedkeys.splice(i, 1)
			i--;
		}
	}
	return sortedkeys;
}

function getHistoryDeleteOption(){
	if (document.getElementById('historydeleteoptionperiod').checked) {
		var option = document.getElementById('historydeleteoptionperiod').value;
	} else if (document.getElementById('historydeleteoptiondays').checked) {
		var option = document.getElementById('historydeleteoptiondays').value;
	}
	if (!option) {
		option = "days";
	}
	return option;
}

function getHistoryRetain(){
	var days = document.getElementById("historyretain").value;
	if (!days) {
		days = 999;
	}
	if ( days > 999 ) {
		days = 999;
	}
	return days;
}

function getHistoryResetDay(){
	var day = document.getElementById("historyresetday").value;
	if (!day) {
		day = 31;
	}
	if ( day > 31 ) {
		day = 31;
	}
	return day;
}

function getHistoryResetPeriod(){
	var period = document.getElementById("historyresetperiod").value,
		historyresetperiodunit = getHistoryResetPeriodUnit();
	
	if ( historyresetperiodunit == "days" ) {
		if ( period > 31 )
			period = 31;
	} else if ( historyresetperiodunit == "weeks" ) {
		if ( period > 4 )
			period = 4; 
	} else if ( historyresetperiodunit == "months" ) {
		if ( period > 48 )
			period = 48; 
	}
	return period;
}

function getHistoryResetPeriodUnit(){
	var e = document.getElementById("historyresetperiodunit");
	return e.options[e.selectedIndex].value;
}

function setResetDate(date){
	document.getElementById("resetdate").value = date;
}

function getResetDate(){
	return document.getElementById("resetdate").value;
}

// UI
function showHistorydeleteoptionContent(){
	if( document.getElementById("historydeleteoptiondays").checked ) {
		document.getElementById("historydeleteoptiondayscontent").classList.remove("d-none");
		document.getElementById("historydeleteoptionperiodscontent").classList.add("d-none");
	} else {
		document.getElementById("historydeleteoptiondayscontent").classList.add("d-none");
		document.getElementById("historydeleteoptionperiodscontent").classList.remove("d-none");
		maxValuesDeleteOption();
		//localStorage.setItem("lasthistoryclean", moment());
	}
}

function maxValuesDeleteOption(){
	var historyresetperiodunit = getHistoryResetPeriodUnit(),
		cleaningday = calculateCleaningDay(),
		historyresetperiod = document.getElementById("historyresetperiod"),
		historyresetday = document.getElementById("historyresetday");
	if ( historyresetperiodunit == "days" ) {
		historyresetperiod.setAttribute("max", "31"); 
		historyresetday.value = "1"; 
		historyresetday.disabled = true;
	} else if ( historyresetperiodunit == "weeks" ) {
		historyresetperiod.setAttribute("max", "4"); 
		historyresetday.setAttribute("max", "7"); 
		historyresetday.disabled = false;
	} else if ( historyresetperiodunit == "months" ) {
		historyresetperiod.setAttribute("max", "48"); 
		historyresetday.setAttribute("max", "31"); 
		historyresetday.disabled = false;		
	}
	setResetDate(cleaningday.format("dddd, DD-MM-YYYY"));
}

function saveCleaningDay(){
	localStorage.setItem("cleaningday", moment(getResetDate(),"dddd, DD-MM-YYYY"));
	document.getElementById("modalsavebutton").setAttribute("style", "float: none; margin-left: 5px; vertical-align: middle; transition: 0.7s linear; color: white; background-color: #28a745;");
	document.getElementById("modalsavebutton").innerHTML = '<i class="fas fa-check"></i>'; 
	setTimeout('document.getElementById("modalsavebutton").innerHTML = "Save"; document.getElementById("modalsavebutton").setAttribute("style", "float: none; margin-left: 5px; vertical-align: middle; transition: 0.7s linear;");', 5000);
}

function calculateCleaningDay(){
	var historyretain = getHistoryRetain(),
		historyresetday = getHistoryResetDay(),
		historyresetperiod = getHistoryResetPeriod(),
		historyresetperiodunit = getHistoryResetPeriodUnit(),
		cleaningday = moment();
		 
	if ( historyresetperiodunit == "days" ) {
		cleaningday = cleaningday.add(historyresetperiod, 'days');
	} else if ( historyresetperiodunit == "weeks" ) {
		cleaningday = cleaningday.add(historyresetperiod, 'weeks');
		cleaningday = cleaningday.day(historyresetday);
	} else if ( historyresetperiodunit == "months" ) {
		cleaningday = cleaningday.add(historyresetperiod, 'months');
		cleaningday = cleaningday.date(historyresetday);
	}
	localStorage.setItem("historyretain", historyretain);
	localStorage.setItem("historyresetday", historyresetday);
	localStorage.setItem("historyresetperiod", historyresetperiod);
	localStorage.setItem("historyresetperiodunit", historyresetperiodunit);
	
	return cleaningday;
}

function testDateFormat(date){
	const userKeyRegExp = /^[0-9]{2}-[0-9]{2}-[0-9]{4}/;
	return userKeyRegExp.test(date);
}

function setHistory(refresh_edit_table){
	var entry_history = "<table width='100%' height='100%'><tr style='border-bottom: 1px solid #000;'><th style='width: 33%;'>Date</th><th style='width: 33%;text-align:right;'>Time (no break)</th><th style='width: 33%;text-align:right;'>Overtime</th></tr>",
		entry_edit_history = "",
		keys = Object.keys(localStorage),
		revkeys = keys.map(reverseDateRepresentation).sort().reverse().map(reverseDateRepresentation),
		overtimetotal = 0,
		overtimeweekly = 0,
		i = 0, 
		key,
		timeinfo;	
	
	for (; key = revkeys[i]; i++) {
		if (testDateFormat(key)) {
			timeinfo = JSON.parse(localStorage.getItem(key));
			if (timeinfo.hasOwnProperty('OvertimeDec')){
				if (timeinfo['OvertimeDec'].startsWith("-")){
					entry_history = entry_history + "<tr style='color:red;'><td>" + key + "</td><td style='text-align:right;'>" + timeinfo['TotalNoBreakDec'] + "</td><td style='text-align:right;'>" + timeinfo['OvertimeDec'] + "</td></tr>"
					entry_edit_history = entry_edit_history + "<tr class='hide' style='color:red;'><td class='pt-3-half' contenteditable='false'>" + key + "</td><td class='pt-3-half' contenteditable='true'>" + timeinfo['TotalNoBreakDec'] + "</td><td class='pt-3-half' contenteditable='true'>" + timeinfo['OvertimeDec'] + "</td><td class='pt-3-half' contenteditable='true'>" + timeinfo['TotalDec'] + "</td><td class='pt-3-half' contenteditable='true'>" + timeinfo['StartDec'] + "</td><td class='pt-3-half' contenteditable='true'>" + timeinfo['HourSchedule'] + "</td><td><span class='table-save'><button type='button' class='btn btn-outline-success btn-rounded btn-sm my-0 waves-effect waves-light'><i class='far fa-save'></i></button></span> <span class='table-remove'><button type='button' class='btn btn-outline-danger btn-rounded btn-sm my-0 waves-effect waves-light'><i class='far fa-trash-alt'></i></button></span></td></tr>"
				} else {
					entry_history = entry_history + "<tr style='color:green;'><td>" + key + "</td><td style='text-align:right;'>" + timeinfo['TotalNoBreakDec'] + "</td><td style='text-align:right;'>" + timeinfo['OvertimeDec'] + "</td></tr>"
					entry_edit_history = entry_edit_history + "<tr class='hide' style='color:green;'><td class='pt-3-half' contenteditable='false'>" + key + "</td><td class='pt-3-half' contenteditable='true'>" + timeinfo['TotalNoBreakDec'] + "</td><td class='pt-3-half' contenteditable='true'>" + timeinfo['OvertimeDec'] + "</td><td class='pt-3-half' contenteditable='true'>" + timeinfo['TotalDec'] + "</td><td class='pt-3-half' contenteditable='true'>" + timeinfo['StartDec'] + "</td><td class='pt-3-half' contenteditable='true'>" + timeinfo['HourSchedule'] + "</td><td><span class='table-save'><button type='button' class='btn btn-outline-success btn-rounded btn-sm my-0 waves-effect waves-light'><i class='far fa-save'></i></button></span> <span class='table-remove'><button type='button' class='btn btn-outline-danger btn-rounded btn-sm my-0 waves-effect waves-light'><i class='far fa-trash-alt'></i></button></span></td>"
				}
				overtimetotal = parseFloat(overtimetotal) + parseFloat(timeinfo['OvertimeDec']);
				
				if ( moment(key, "DD-MM-YYYY") >= moment().startOf('week') ) {
					overtimeweekly = overtimeweekly + parseFloat(timeinfo['OvertimeDec']);
				}
								
				// calculate hour schedule if it's not defined yet
				// TEMPORARY
				if (timeinfo['HourSchedule'] == undefined) {
					var hourschedule = parseFloat(timeinfo['TotalNoBreakDec'])-parseFloat(timeinfo['OvertimeDec']);
					
					if (hourschedule > 0 && hourschedule < 3.1) {
						hourschedule = 3.04;
					} else if (hourschedule > 3.1 && hourschedule < 3.5) {
						hourschedule = 3.2;
					} else if (hourschedule > 3.5 && hourschedule < 3.9) {
						hourschedule = 3.8;
					} else if (hourschedule > 3.9 && hourschedule < 4.25) {
						hourschedule = 4;
					} else if (hourschedule > 4.25 && hourschedule < 4.7) {
						hourschedule = 4.56;
					} else if (hourschedule > 4.7 && hourschedule < 5.55) {
						hourschedule = 4.8;
					} else if (hourschedule > 5.55 && hourschedule < 6.23) {
						hourschedule = 6.08;
					} else if (hourschedule > 6.23 && hourschedule < 7) {
						hourschedule = 6.4;
					} else if (hourschedule > 7 && hourschedule < 7.8) {
						hourschedule = 7.6;
					} else if (hourschedule > 7.8 && hourschedule < 10) {
						hourschedule = 8;
					}
					
					var new_timeinfo = '{"TotalNoBreakDec": "' + timeinfo['TotalNoBreakDec'] + '", "OvertimeDec": "' + timeinfo['OvertimeDec'] + '", "TotalDec": "' + timeinfo['TotalDec'] + '", "StartDec": "' + timeinfo['StartDec'] + '", "HourSchedule": "' + hourschedule + '"}';
					localStorage.setItem(key, new_timeinfo);
					console.log(timeinfo);
					console.log(new_timeinfo);
				}
			}
		}
	}
	
	if (keys == "" || keys == null) {
		entry_history = "No previous data yet :(";
		entry_edit_history = entry_history;
	} else {
		entry_history = entry_history + "</table>";
	}
	document.getElementById("history").innerHTML = entry_history;	
	
	if(refresh_edit_table){
		document.getElementById("edit_history_table_body").innerHTML = entry_edit_history;
	}
	
	setOvertimeTotal(overtimetotal);
	setOvertimeWeekly(overtimeweekly);
}

function notificationClosed(event){
	var version = document.getElementById("currentappversion").innerHTML,
		lastnotifversion = localStorage.getItem("lastnotifversion");
	
	if ( event == "click" ){
		localStorage.setItem("lastnotifversion", version);
	} 
	
	if ( event == "onload" && version != lastnotifversion ){
		$("#alertnotification").show();
	}
}

function startminsubtract(){
	var startminsubtract_value = document.getElementById("startminsubtract_value").value;
	localStorage.setItem("startminsubtract_value", startminsubtract_value);
	document.getElementById("startminsubtract_span").innerHTML = startminsubtract_value; 
}

function hourscheduleAddTimeButton(){
	var hourschedule = getHourSchedule(),
		addtimebutton_span = document.getElementById("addtimebutton_span");
	localStorage.setItem("hourschedule", hourschedule);
	addtimebutton_span.innerHTML = hourschedule; 
}

function breaktimeTimeselection(){
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
		$('[data-toggle="tooltip"]').tooltip();
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
		$('[data-toggle="tooltip"]').tooltip();
	}
}

function checkInputValues(){
	var app_alert_message = "";
	
	if (getBreak(true) < 0 && getBreakTimeStart() > 0) {
		document.getElementById("break_time_end").value = document.getElementById("break_time_start").value;
		app_alert_message = "<b>Holy guacamole!</b> You can't end your break before you start it, can you superman?<br> Fill in when your break ended first.";
	}

	if (app_alert_message != "") {
		document.getElementById("app_alert_message").innerHTML = app_alert_message;
		$("#app_alert").show();
		setTimeout(function() {$("#app_alert").fadeOut();}, 5000);
	}
}

// Storage functions
function cleanLocalStorage(){
	var keys = Object.keys(localStorage),
		i = 0,
		today = moment(),
		deleteoption = localStorage.getItem("historydeleteoption");
		//lasthistoryclean = moment(localStorage.getItem("lasthistoryclean"));
	
	if ( deleteoption == "days" ) {
		const expiredate = today.subtract(getHistoryRetain(), "days")
		for(; key = keys[i]; i++) {
			if ( moment(key, "DD-MM-YYYY") < expiredate && testDateFormat(key)) { // days to keep data excluding today
				delete localStorage[key];
			}
		}	
	} else if ( deleteoption == "period" ) {
		var cleaningdaystored = localStorage.getItem("cleaningday"),
			cleaningday = moment(new Date(cleaningdaystored)).format; //momentjs somehow can't parse dates from localstorage
		
		if ( cleaningday <= today ) {
			console.log("gelukt!");

			deleteHistory();
			//localStorage.setItem("lasthistoryclean", today);
			localStorage.setItem("cleaningday", calculateCleaningDay());
		}
	}
}

function deleteHistory(){
	if ( confirm("Are you sure you wish to delete your history?\nIf you choose not to then your data will be saved untill the next cleaning time.") ) {
		for(key in localStorage) {
			if ( testDateFormat(key) ) {
				delete localStorage[key];
			}
		}
		setHistory(true);
		//document.getElementById("settingsmodalclosebutton").click();
		alert("History deleted!");
	}
}

function exportHistory(){		
	/*
	var _myArray = JSON.stringify(localStorage , null, 4); //indentation in json format, human readable
	
	var vLink = document.getElementById('exportHistory');
	var vBlob = new Blob([_myArray], {type: "octet/stream"});
	vName = 'working_history_' + todayDate() + '.json';
	vUrl = window.URL.createObjectURL(vBlob);
	
	vLink.setAttribute('href', vUrl);
	vLink.setAttribute('download', vName);
	console.log(_myArray);
	console.log(vLink);
	console.log(vBlob);
	console.log(vName);
	console.log(vUrl);
	*/
	
    var _myArray = JSON.stringify(localStorage , null, 4); //indentation in json format, human readable

    //Note: We use the anchor tag here instead button.
    var vLink = document.getElementById('exportHistoryLink');
	
    var vBlob = new Blob([_myArray], {type: "octet/stream"});
    vName = 'working_history_' + todayDate() + '.json';
    vUrl = window.URL.createObjectURL(vBlob);

    vLink.setAttribute('href', vUrl);
    vLink.setAttribute('download', vName );

    //Note: Programmatically click the link to download the file
    vLink.click();
}
	
var importHistory = document.getElementById('importHistory'),
	importFile = document.getElementById('importFile');
importFile.addEventListener("change", importHistoryData, false);
importHistory.onclick = function () {importFile.click()}
function importHistoryData(e){
	var files = e.target.files, reader = new FileReader();
	reader.onload = readerEvent => {
		var content = JSON.parse(readerEvent.target.result); // this is the content!
		Object.keys(content).forEach(function (k) {
			localStorage.setItem(k, content[k]);
		});
		importFile.value = ''; //clear input value after every import
		setHistory(true);
		setParameters();
	}
	reader.readAsText(files[0]);
	document.getElementById("settingsmodalclosebutton").click();
	alert("Import successful!");
}

function makeDate(date){
   var parts = date.split("-");
   return new Date(parts[2], parts[1] - 1, parts[0]);
}

// Application functions
function now(){
	var date = new Date();
	var hour = date.getHours(),
		min  = date.getMinutes();

	hour = (hour < 10 ? "0" : "") + hour;
	min = (min < 10 ? "0" : "") + min;
	
	var timestamp = hour + ":" + min; 
	//return timeStringToFloat(timestamp);
	return moment.duration(timestamp).asHours();
}

function todayDate(){
	var date = new Date();
	
	/*var dd = ('0' + date.getDate()).slice(-2),
		mm = ('0' + (date.getMonth()+1)).slice(-2), //jan is 0
		yyyy = date.getFullYear();
	*/
	//return dd + "-" + mm + "-" + yyyy;
	return moment().format("DD-MM-YYYY");
}

function reset(){
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
	if (localStorage.length < 10) {
		startIntroduction();
	}
}

function setParameters(){
	// Set options to parameters from localStorage
	var alertnotification = localStorage.getItem("alertnotification"),
		autoend = localStorage.getItem("autoend"),
		autoend_today_disabled = localStorage.getItem("autoend_today_disabled"),
		nosave = localStorage.getItem("nosave"),
		hourschedule = localStorage.getItem("hourschedule"),
		break_time_default = localStorage.getItem("break_time_default"),
		startminsubtract = localStorage.getItem("startminsubtract"),
		startminsubtract_value = localStorage.getItem("startminsubtract_value"),
		historydeleteoption = localStorage.getItem("historydeleteoption"),
		historyretain = localStorage.getItem("historyretain"),
		historyresetday = localStorage.getItem("historyresetday"),
		historyresetperiod = localStorage.getItem("historyresetperiod"),
		historyresetperiodunit = localStorage.getItem("historyresetperiodunit"),
		overtimeoption = localStorage.getItem("overtimeoption"),
		totalhoursoption = localStorage.getItem("totalhoursoption"),
		historyoption = localStorage.getItem("historyoption"),
		weeklyovertimeoption = localStorage.getItem("weeklyovertimeoption"),
		totalovertimeoption = localStorage.getItem("totalovertimeoption"),
		parametersoption = localStorage.getItem("parametersoption"),
		breaktime_timeselection_option_timerange = localStorage.getItem("breaktime_timeselection_option_timerange");

	if (autoend == "true")
		//document.getElementById("autoend").checked = true;
		document.getElementById("autoend").click();
	if (autoend_today_disabled == todayDate())
		document.getElementById("autoend_today_disabled").click();
	if (nosave == todayDate())
		//document.getElementById("nosave").checked = true;
		document.getElementById("nosave").click();
	setHourSchedule(hourschedule);
	if (break_time_default) {
		document.getElementById("break_time_default").value = break_time_default;
		setBreak(break_time_default);
	} else {
		document.getElementById("break_time_default").value = 0;
	}
	if (historydeleteoption == "days") {
		//document.getElementById("historydeleteoptiondays").checked = true;
		document.getElementById("historydeleteoptiondays").click();
	} else if (historydeleteoption == "period") {
		//document.getElementById("historydeleteoptionperiod").checked = true;
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
	// Set UI visibility options
	if (overtimeoption == "true" || overtimeoption === null) {
		//document.getElementById("overtimeoption").checked = true;
		document.getElementById("overtimeoption").click();
		document.getElementById("divovertime").classList.add("show");
	}
	if (totalhoursoption == "true" || totalhoursoption === null) {
		//document.getElementById("totalhoursoption").checked = true;
		document.getElementById("totalhoursoption").click();
		document.getElementById("divtotalhours").classList.add("show");
	}
	if (weeklyovertimeoption == "true" || weeklyovertimeoption === null) {
		//document.getElementById("weeklyovertimeoption").checked = true;
		document.getElementById("weeklyovertimeoption").click();
		document.getElementById("divovertimeweekly").classList.add("show");
	}
	if (totalovertimeoption == "true" || totalovertimeoption === null) {
		//document.getElementById("totalovertimeoption").checked = true;
		document.getElementById("totalovertimeoption").click();
		document.getElementById("divovertimetotal").classList.add("show");
	}
	if (historyoption == "true" || historyoption === null) {
		//document.getElementById("historyoption").checked = true;
		document.getElementById("historyoption").click();
		document.getElementById("historycontainer").classList.add("show");
	}
	if (parametersoption == "true" || parametersoption === null) {
		//document.getElementById("parametersoption").checked = true;
		document.getElementById("parametersoption").click();
		document.getElementById("divparameters").classList.add("show");
	}
	if (breaktime_timeselection_option_timerange == "true") {
		//document.getElementById("breaktime_timeselection_option_timerange").checked = true;
		document.getElementById("breaktime_timeselection_option_timerange").click();
		breaktimeTimeselection();
	}

	showHistorydeleteoptionContent();
	
	// Check if custom time to subtract from start is stored, if not take 5 min as default
	if (!startminsubtract_value) {
		document.getElementById("startminsubtract_span").innerHTML = "5";
		document.getElementById("startminsubtract_value").value = "5";
	} else {
		document.getElementById("startminsubtract_span").innerHTML = startminsubtract_value;
		document.getElementById("startminsubtract_value").value = startminsubtract_value;
	}
	// If subtract from start is checked set UI and deduct the amount of time stored in localstorage
	// If the page was already opened today, fill in that start time
	var timeinfo = JSON.parse(localStorage.getItem(todayDate()));
	if (timeinfo == null) {
		if (startminsubtract == "true") {
			//document.getElementById("startminsubtract").checked = true;
			document.getElementById("startminsubtract").click();
			
			// Fix convert minutes to subtract to decimal
			//var startminsubtract_value_decimal = timeStringToFloat("00:"+startminsubtract_value);
			var startminsubtract_value_decimal = moment.duration("00:"+startminsubtract_value).asHours();
			setStart(now() - startminsubtract_value_decimal);
		} else {
			setStart(now());
		}
		add_time(getHourSchedule());
	} else {
		setStart(timeinfo['StartDec']);
		setBreak(timeinfo['TotalDec'] - timeinfo['TotalNoBreakDec']);
		setEnd(parseFloat(timeinfo['StartDec']) + parseFloat(timeinfo['TotalDec']));
		calculateTotal();
		if (startminsubtract == "true")
			//document.getElementById("startminsubtract").checked = true;
			document.getElementById("startminsubtract").click();
	}
}

function end_time(){
	setEnd(now());
	calculateTotal();
}

function add_time(time){
	setEnd(getStart() + time + getBreak(false));
	calculateTotal();
}

function add_break(time){
	setBreak(time + getBreak(false));
	setEnd(time + getEnd());
	calculateTotal();
}

function reset_break(){
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
  constructor () {
    this.isRunning = false;
    this.startTime = 0;
    this.overallTime = 0;
  }
  _getTimeElapsedSinceLastStart () {
    if (!this.startTime) {
      return 0;
    }
 
    return Date.now() - this.startTime;
  }
  start () {
    if (this.isRunning) {
      return console.error('Timer is already running');
    }
    this.isRunning = true;
    this.startTime = Date.now();
  }
  stop () {
    if (!this.isRunning) {
      return console.error('Timer is already stopped');
    }
    this.isRunning = false;
    this.overallTime = this.overallTime + this._getTimeElapsedSinceLastStart();
  }
  reset () {
    this.overallTime = 0;
    if (this.isRunning) {
      this.startTime = Date.now();
      return;
    }
    this.startTime = 0;
  }
  getTime () {
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
var break_counter_started = false, refreshIntervalId = 0;
function break_counter(){
	var break_counter_btn = document.getElementById("break_counter_btn");	
	
	// Delete old localstorage entries for previous version timer
	localStorage.removeItem("break_counter_start_time");
	localStorage.removeItem("break_counter_started");
	
	if (break_counter_started) {		
		break_counter_started = false;
		timer.stop();
		clearInterval(refreshIntervalId);
		
		const timeInSeconds = Math.round(timer.getTime() / 1000);
		const timeInDecimalHours = moment.duration(moment.utc(timeInSeconds*1000).format('HH:mm:ss')).asHours();
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
			const timeInSeconds = Math.round(timer.getTime() / 1000);
			const timeInDecimalHours = moment.duration(moment.utc(timeInSeconds*1000).format('HH:mm:ss')).asHours();
			setBreak(timeInDecimalHours);
			add_time(getHourSchedule());
			console.log(timeInDecimalHours);
		}, 1000)
		
		break_counter_btn.innerHTML = "<i class='fal fa-stopwatch fa-spin'></i> Stop";
		break_counter_btn.classList.remove("btn-primary");
		break_counter_btn.classList.add("btn-warning");
		break_counter_btn.classList.add("pulsate");
	}
	
}
/*
function break_counter(){
	var break_counter_started = localStorage.getItem("break_counter_started"),
		break_counter_btn = document.getElementById("break_counter_btn");	
	if (break_counter_started == "true") {
		var break_counter_stop_time = moment(),
			break_counter_start_time = moment(localStorage.getItem("break_counter_start_time"), "HH:mm"),
			break_time = break_counter_stop_time.diff(break_counter_start_time, 'minutes'),
			interval = moment().hour(0).minute(break_time),
			//decimal_time = timeStringToFloat(interval.format("HH:mm"));
			decimal_time = moment.duration(interval.format("HH:mm")).asHours();
			
		localStorage.setItem("break_counter_started", "false");
		setBreak(decimal_time);
		add_time(getHourSchedule());
		
		break_counter_btn.innerHTML = "<i class='fal fa-stopwatch'></i> Start";
		break_counter_btn.classList.remove("btn-warning");
		break_counter_btn.classList.add("btn-primary");
		break_counter_btn.classList.remove("pulsate");
	} else {
		localStorage.setItem("break_counter_start_time", moment().format("HH:mm"));
		localStorage.setItem("break_counter_started", "true");
		
		break_counter_btn.innerHTML = "<i class='fal fa-stopwatch'></i> Stop";
		break_counter_btn.classList.remove("btn-primary");
		break_counter_btn.classList.add("btn-warning");
		break_counter_btn.classList.add("pulsate");
	}
	
}
*/

window.onbeforeunload = function(e){
	// Set 'dont save today' and 'automatically set end time' parameters in local storage
	var nosave = document.getElementById("nosave"),
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
		var timeinfo = '{"TotalNoBreakDec": "' + getTotalNoBreakDec() + '", "OvertimeDec": "' + getOvertimeDec() + '", "TotalDec": "' + getTotalDec() + '", "StartDec": "' + getStart() + '", "HourSchedule": "' + getHourSchedule().toFixed(2) + '"}';
		localStorage.setItem(todayDate(), timeinfo);
		localStorage.setItem("nosave", "false");
	} else {
		if (autoend.checked == false) {
			localStorage.setItem("autoend", "false");
		} else {
			localStorage.setItem("autoend", "true");
		}
		localStorage.setItem("nosave", todayDate());
	}
	// Set 'subtract 5 min from start time' parameter in local storage
	var startminsubtract = document.getElementById("startminsubtract");
	if (startminsubtract.checked == false) {
		localStorage.setItem("startminsubtract", "false");
	} else {
		localStorage.setItem("startminsubtract", "true");
	}
	// Set 'hour schedule' parameter in local storage
	localStorage.setItem("hourschedule", getHourSchedule());
	// Set 'default break time' parameter in local storage
	localStorage.setItem("break_time_default", getBreakDefault());
	// Clear break counter
	localStorage.setItem("break_counter_started", "false");
	// Set 'history retain time' parameter in local storage
	localStorage.setItem("historydeleteoption", getHistoryDeleteOption());
	localStorage.setItem("historyretain", getHistoryRetain());
	localStorage.setItem("historyresetday", getHistoryResetDay());
	localStorage.setItem("historyresetperiod", getHistoryResetPeriod());
	localStorage.setItem("historyresetperiodunit", getHistoryResetPeriodUnit());
	// Set UI visibility options
	if (document.getElementById("overtimeoption").checked == false) {
		localStorage.setItem("overtimeoption", "false");
	} else {
		localStorage.setItem("overtimeoption", "true");
	}
	if (document.getElementById("totalhoursoption").checked == false) {
		localStorage.setItem("totalhoursoption", "false");
	} else {
		localStorage.setItem("totalhoursoption", "true");
	}
	if (document.getElementById("weeklyovertimeoption").checked == false) {
		localStorage.setItem("weeklyovertimeoption", "false");
	} else {
		localStorage.setItem("weeklyovertimeoption", "true");
	}
	if (document.getElementById("totalovertimeoption").checked == false) {
		localStorage.setItem("totalovertimeoption", "false");
	} else {
		localStorage.setItem("totalovertimeoption", "true");
	}
	if (document.getElementById("historyoption").checked == false) {
		localStorage.setItem("historyoption", "false");
	} else {
		localStorage.setItem("historyoption", "true");
	}
	if (document.getElementById("parametersoption").checked == false) {
		localStorage.setItem("parametersoption", "false");
	} else {
		localStorage.setItem("parametersoption", "true");
	}
	if (document.getElementById("breaktime_timeselection_option_timerange").checked == false) {
		localStorage.setItem("breaktime_timeselection_option_timerange", "false");
	} else {
		localStorage.setItem("breaktime_timeselection_option_timerange", "true");
	}
};

// Listeners and initializers
$(document).ready(function(){
	reset();
	//$('[data-toggle="tooltip"]').tooltip({trigger: "hover"}); // Initialize bootstrap tooltips
	$('[data-toggle="tooltip"]').tooltip(); 
	moment().format(); // Initialize momentjs
		
	if(window.location.href.indexOf('#modalabout') != -1) {
		$('#modalabout').modal('show');
	}
	if(window.location.href.indexOf('#modalsettings') != -1) {
		$('#modalsettings').modal('show');
	}
	if(window.location.href.indexOf('#modalinfo') != -1) {
		$('#modalinfo').modal('show');
	}
	if(window.location.href.indexOf('#modaledithistory') != -1) {
		$('#modaledithistory').modal('show');
	}
	if(window.location.href.indexOf('#modalreporting') != -1) {
		$('#modalreporting').modal('show');
	}
});

$(window).on("load", function () {
	if ("serviceWorker" in navigator) {
		navigator.serviceWorker.register("js/service-worker.js");
	}
});

$(document).on('keydown', function (e){
	if (e.keyCode === 13) { //ENTER key code
		add_time(getHourSchedule());
	}
	
	if (e.keyCode === 27) { //ENTER key code
		$('.modal').modal('hide');
	}
});

$('#app_alert .close').click(function(){
	$(this).parent().fadeOut();
});

$("input").focusout(function(){
	checkInputValues()
});

$(".btn").mouseup(function(){
	// Fix buttons keeping focus after being clicked
	this.blur();
});

function run60sec() {
    // runs every 60 sec
	if (getEnd() <= now() && !startedLeaves){
		//console.log("if " + getEnd() + " <= " + now() + " && !" + startedLeaves);
		startLeaves();
	} else if (getEnd() > now() && startedLeaves){
		stopLeaves();
		//console.log("else if " + startedLeaves);
	}
}
setInterval(run60sec, 2*60000); // (Every 2) * (60 * 1000 milliseconds = 60 seconds = 1 minute)

/*
// ASYNC loading of JS files
// When using this comment out the related script file record in index.html

function loadjscssfile(filename, filetype, callback){
	//source: http://www.javascriptkit.com/javatutors/loadjavascriptcss.shtml    
	if (filesadded.indexOf("["+filename+"]")==-1){
		if (filetype=="js"){ // If filename is a external JavaScript file
			// Adding the script tag to the head
			var fileref=document.createElement('script');
			fileref.setAttribute("type","text/javascript");
			fileref.setAttribute("src", filename);
			fileref.setAttribute("async", false);
			
			// Bind the event to the callback function.
			// There are several events for cross browser compatibility.
			fileref.onreadystatechange = callback;
			fileref.onload = callback;	
		} 
		else if (filetype=="css"){ // If filename is an external CSS file
			var fileref=document.createElement("link");
			fileref.setAttribute("rel", "stylesheet");
			fileref.setAttribute("type", "text/css");
			fileref.setAttribute("href", filename);
		}
		
		if (typeof fileref!="undefined"){
			// Fire the loading
			document.getElementsByTagName("head")[0].appendChild(fileref);
			console.log("added to html: " + filename);
		} 
		
		filesadded+="["+filename+"]";
	} else {
		callback();
		console.log("already loaded: " + filename);
	}
}

// Change the function in the index page for button id="btn_getting_started" and it's script loading record in index.html when enabling this one
function initializeIntroduction(){
	loadjscssfile("js/introduction.js", "js", function(){ startIntroduction(); });
}

// Disable this function in graphs.js and it's script loading record in index.html when enabling this one
$('#modalreporting').on('shown.bs.modal', function() {	
    loadjscssfile("https://www.gstatic.com/charts/loader.js", "js", function () {
		console.log("loaded https://www.gstatic.com/charts/loader.js");
		loadjscssfile("js/graphs.js", "js", function() {
		
			initGoogleLibraries("googleCharts").then(function () {
				initGraphs();
				drawGraphs(); 
				mobileRotateScreen(true);
			});
		});
    });

//	var filename = "js/graphs.js";
//	if (filesadded.indexOf("["+filename+"]")==-1){
//		
//		setTimeout(function(){
//			// Wait till the JS is loaded
//
//			// Redraw charts on opening modal
//			initGraphs();
//			drawGraphs();
//			
//			// Rotate screen for mobile users so it displays the entire width
//			// https://usefulangle.com/post/105/javascript-change-screen-orientation
//			mobileRotateScreen(true);
//		}, 500);
//		
//	} else {
//		initGraphs();
//		drawGraphs();
//		mobileRotateScreen(true);
//	}
});

// Disable this function in editable_table.js and it's script loading record in index.html when enabling this one
$('#modaledithistory').on('shown.bs.modal', function() {	
	loadjscssfile("js/editable_table.js", "js", function(){ setHistory(true); });
});
*/