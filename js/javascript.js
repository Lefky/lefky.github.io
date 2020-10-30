console.log("loading javascript.js");
/*
Date.prototype.subtractDays = function(days) {
	var date = new Date(this.valueOf());
	date.setDate(date.getDate() - days);
	return date;
}

Date.prototype.addDays = function(days) {
	var date = new Date(this.valueOf());
	date.setDate(date.getDate() + days);
	return date;
}

*/
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

function roundTimeOffset(time){
	if (time <= (0.02) && time >= (-0.02)) {
		time = 0;
	}
	return time;
}

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

function getBreak(){
	var time = document.getElementById("break_time").value;
	var time_dec = moment.duration(time).asHours();
	if (!time_dec) {
		time_dec = 0;
	}
	return time_dec;
}

function setBreak(time){
	document.getElementById("break_time").value = floatToTimeString(time);
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
	var new_break_dec = getBreak() - break_time_default_init + getBreakDefault();
	console.log("break: "+getBreak()+" init: "+break_time_default_init+" default: "+getBreakDefault());
	
	if ( new_break_dec > 0 ) {
		setBreak(new_break_dec);
	} else {
		setBreak(0);
	}
	*/
	
	if(getBreak() == break_time_default_init) {
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

function getWorktime() {
	if (getEnd() < getStart()) {
		return 24 + getEnd() - getStart();
	}
	return getEnd() - getStart();
	//return Math.round((worktime + Number.EPSILON) * 100) / 100;
	//console.log("worktime: " + worktime);
}

function calculateTotal() {
	var worktime = getWorktime(),
		overtime = worktime - getBreak() - getHourSchedule();

	setTotal(worktime);
	setOvertime(roundTimeOffset(overtime));
	setTotalNoBreak(Math.abs(worktime - getBreak()));
	
	setTotalDec((parseFloat(worktime).toFixed(2)));
	setOvertimeDec(parseFloat(roundTimeOffset(overtime)).toFixed(2));
	setTotalNoBreakDec(getTotalNoBreakDec());
	
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
		overtime = worktime - getBreak() - getHourSchedule();

	return parseFloat(roundTimeOffset(overtime)).toFixed(2);
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
	return Math.abs(parseFloat(worktime - getBreak()).toFixed(2));
}

function setTotalNoBreakDec(time){
	if ( time < 0 )
		document.getElementById("totalnobreakdec").value = "";
	else
		document.getElementById("totalnobreakdec").value = time;
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
function showHistorydeleteoptionContent() {
	if( document.getElementById("historydeleteoptiondays").checked ) {
		$("#historydeleteoptiondayscontent").show();
		$("#historydeleteoptionperiodscontent").hide();
	} else {
		$("#historydeleteoptionperiodscontent").show();
		$("#historydeleteoptiondayscontent").hide();
		maxValuesDeleteOption();
		//localStorage.setItem("lasthistoryclean", moment());
	}
}

function maxValuesDeleteOption() {
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

function saveCleaningDay() {
	localStorage.setItem("cleaningday", moment(getResetDate(),"dddd, DD-MM-YYYY"));
	document.getElementById("modalsavebutton").setAttribute("style", "float: none; margin-left: 5px; vertical-align: middle; transition: 0.7s linear; color: white; background-color: #28a745;");
	document.getElementById("modalsavebutton").innerHTML = '<i class="fas fa-check"></i>'; 
	setTimeout('document.getElementById("modalsavebutton").innerHTML = "Save"; document.getElementById("modalsavebutton").setAttribute("style", "float: none; margin-left: 5px; vertical-align: middle; transition: 0.7s linear;");', 5000);
}

function calculateCleaningDay() {
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

function setHistory(refresh_edit_table){
	const reverseDateRepresentation = date => {
	  let parts = date.split('-');
	  return `${parts[2]}-${parts[1]}-${parts[0]}`;
	};
	
	var entry_history = "<table width='100%' height='100%'><tr style='border-bottom: 1px solid #000;'><th style='width: 33%;'>Date</th><th style='width: 33%;text-align:right;'>Time (no break)</th><th style='width: 33%;text-align:right;'>Overtime</th></tr>",
		entry_edit_history = "",
		keys = Object.keys(localStorage),
		revkeys = keys.map(reverseDateRepresentation).sort().reverse().map(reverseDateRepresentation),
		overtimetotal = 0,
		overtimeweekly = 0,
		i = 0, 
		key;	
	const userKeyRegExp = /^[0-9]{2}-[0-9]{2}-[0-9]{4}/;
	
	for (; key = revkeys[i]; i++) {
		if (userKeyRegExp.test(key)) {
			var timeinfo = JSON.parse(localStorage.getItem(key));
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
				if (timeinfo['HourSchedule'] == undefined) {
					var hourschedule = parseFloat(timeinfo['TotalNoBreakDec'])-parseFloat(timeinfo['OvertimeDec']);
					//hourschedule = Math.round((hourschedule + Number.EPSILON) * 100) / 100;
					
					//console.log("old: " + hourschedule);
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
					//console.log(hourschedule);
					
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

// Storage functions
function cleanLocalStorage() {
	var keys = Object.keys(localStorage),
		i = 0,
		today = moment(),
		deleteoption = localStorage.getItem("historydeleteoption");
		//lasthistoryclean = moment(localStorage.getItem("lasthistoryclean"));
	const userKeyRegExp = /^[0-9]{2}-[0-9]{2}-[0-9]{4}/;
	
	if ( deleteoption == "days" ) {
		const expiredate = today.subtract(getHistoryRetain(), "days")
		for(; key = keys[i]; i++) {
			if ( moment(key, "DD-MM-YYYY") < expiredate && userKeyRegExp.test(key)) { // days to keep data excluding today
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

function deleteHistory() {
	const userKeyRegExp = /^[0-9]{2}-[0-9]{2}-[0-9]{4}/;
	if ( confirm("Are you sure you wish to delete your history?\nIf you choose not to then your data will be saved untill the next cleaning time.") ) {
		for(key in localStorage) {
			if ( userKeyRegExp.test(key) ) {
				delete localStorage[key];
			}
		}
		setHistory(true);
		//document.getElementById("settingsmodalclosebutton").click();
		alert("History deleted!");
	}
}

function exportHistory() {		
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
function importHistoryData(e) {
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
function now() {
	var date = new Date();
	var hour = date.getHours(),
		min  = date.getMinutes();

	hour = (hour < 10 ? "0" : "") + hour;
	min = (min < 10 ? "0" : "") + min;
	
	var timestamp = hour + ":" + min; 
	//return timeStringToFloat(timestamp);
	return moment.duration(timestamp).asHours();
}

function todayDate() {
	var date = new Date();
	
	var dd = ('0' + date.getDate()).slice(-2),
		mm = ('0' + (date.getMonth()+1)).slice(-2), //jan is 0
		yyyy = date.getFullYear();
	
	//return dd + "-" + mm + "-" + yyyy;
	return moment().format("DD-MM-YYYY");
}

function reset() {
	notificationClosed("onload");
	setEnd(0);
	setTotal(0);
	setTotalDec(0);
	setTotalNoBreak(0);
	setTotalNoBreakDec(0);
	setHistory(true);
	
	// 'lazy' loading
	setParameters();
	add_time(getHourSchedule());
	cleanLocalStorage();
}

function setParameters() {
	// Set options to parameters from localStorage
	var alertnotification = localStorage.getItem("alertnotification"),
		autoend = localStorage.getItem("autoend"),
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
		parametersoption = localStorage.getItem("parametersoption");

	if (autoend == "true")
		document.getElementById("autoend").checked = true;
	if (nosave == todayDate())
		document.getElementById("nosave").checked = true;
	setHourSchedule(hourschedule);
	if (break_time_default) {
		document.getElementById("break_time_default").value = break_time_default;
		setBreak(break_time_default);
	} else {
		document.getElementById("break_time_default").value = 0;
	}
	if (historydeleteoption == "days" ) {
		document.getElementById("historydeleteoptiondays").checked = true;
	} else if (historydeleteoption == "period") {
		document.getElementById("historydeleteoptionperiod").checked = true;
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
		document.getElementById("overtimeoption").checked = true;
		document.getElementById("divovertime").classList.add("show");
	}
	if (totalhoursoption == "true" || totalhoursoption === null) {
		document.getElementById("totalhoursoption").checked = true;
		document.getElementById("divtotalhours").classList.add("show");
	}
	if (weeklyovertimeoption == "true" || weeklyovertimeoption === null) {
		document.getElementById("weeklyovertimeoption").checked = true;
		document.getElementById("divovertimeweekly").classList.add("show");
	}
	if (totalovertimeoption == "true" || totalovertimeoption === null) {
		document.getElementById("totalovertimeoption").checked = true;
		document.getElementById("divovertimetotal").classList.add("show");
	}
	if (historyoption == "true" || historyoption === null) {
		document.getElementById("historyoption").checked = true;
		document.getElementById("historycontainer").classList.add("show");
	}
	if (parametersoption == "true" || parametersoption === null) {
		document.getElementById("parametersoption").checked = true;
		document.getElementById("divparameters").classList.add("show");
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
			document.getElementById("startminsubtract").checked = true;
			
			// Fix convert minutes to subtract to decimal
			//var startminsubtract_value_decimal = timeStringToFloat("00:"+startminsubtract_value);
			var startminsubtract_value_decimal = moment.duration("00:"+startminsubtract_value).asHours();
			setStart(now() - startminsubtract_value_decimal);
		} else {
			setStart(now());
		}
	} else {
		setStart(timeinfo['StartDec']);
		if (startminsubtract == "true")
			document.getElementById("startminsubtract").checked = true;
	}
}

function end_time() {
	setEnd(now());
	calculateTotal();
}

function add_time(time) {
	setEnd(getStart() + time + getBreak());
	calculateTotal();
}

function add_break(time) {
	setBreak(time + getBreak());
	setEnd(time + getEnd());
	calculateTotal();
}

function reset_break() {
	setEnd(getEnd() - getBreak());
	setBreak(0);
	calculateTotal();
}

function break_counter() {
	var break_counter_started = localStorage.getItem("break_counter_started"),
		break_counter_btn = document.getElementById("break_counter_btn");	
	if (break_counter_started == "true") {
		var break_counter_stop_time = moment(),
			break_counter_start_time = moment(localStorage.getItem("break_counter_start_time"), "HH:mm"),
			break_time = break_counter_stop_time.diff(break_counter_start_time, 'minutes'),
			interval = moment().hour(0).minute(break_time),
			//decimal_time = timeStringToFloat(interval.format("HH:mm"));
			decimal_time = moment.duration(interval.format("HH:mm")).asHours();
			/*
			console.log("start: " + break_counter_start_time + 
						", stop:" + break_counter_stop_time + 
						", break time:" + break_time + 
						", interval:" +interval +
						", decimal:" + decimal_time);
			console.log(moment.duration(interval.format("HH:mm")).asHours());
			*/
			
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

$(document).on('keydown', function (e) {
	if (e.keyCode === 13) { //ENTER key code
		add_time(getHourSchedule());
	}
});

window.onbeforeunload = function(e) {
	// Set 'dont save today' and 'automatically set end time' parameters in local storage
	var nosave = document.getElementById("nosave"),
		autoend = document.getElementById("autoend");
	if (nosave.checked == false) {
		if (autoend.checked == false) {
			localStorage.setItem("autoend", "false");
		} else {
			setEnd(now());
			localStorage.setItem("autoend", "true");
		}
		var timeinfo = '{"TotalNoBreakDec": "' + getTotalNoBreakDec() + '", "OvertimeDec": "' + getOvertimeDec() + '", "TotalDec": "' + getTotalDec() + '", "StartDec": "' + getStart() + '", "HourSchedule": "' + getHourSchedule() + '"}';
		localStorage.setItem(todayDate(), timeinfo);
		localStorage.setItem("nosave", "false");
	} else {
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
};

$(document).ready(function() {
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