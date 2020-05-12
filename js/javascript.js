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

// Conversion functions
function timeStringToFloat(time) {
	var hoursMinutes = time.split(/[.:]/);
	var hours = parseInt(hoursMinutes[0], 10);
	var minutes = hoursMinutes[1] ? parseInt(hoursMinutes[1], 10) : 0;
	return hours + minutes / 60;
}

function floatToTimeString(timedec){
	var sign = timedec < 0 ? "-" : "";
	var hours = Math.floor(Math.abs(timedec));
	var minutes = Math.floor((Math.abs(timedec) * 60) % 60);
	return sign + (hours < 10 ? "0" : "") + hours + ":" + (minutes < 10 ? "0" : "") + minutes;
}

// Setters & getters
function getStart(){
	var time = document.getElementById("start_time").value;
	var time_dec = timeStringToFloat(time);
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
	var time_dec = timeStringToFloat(time);
	if (!time_dec) {
		time_dec = now();
	}
	return time_dec;
}

function setEnd(time){
	document.getElementById("end_time").value = floatToTimeString(time);
}

function getBreak(){
	var time = document.getElementById("break_time").value;
	var time_dec = timeStringToFloat(time);
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
	var new_break_dec = getBreak() - break_time_default_init + getBreakDefault();
	
	if ( new_break_dec > 0 ) {
		setBreak(new_break_dec);
	} else {
		setBreak(0);
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

function calculateTotal() {
	var worktime = getEnd() - getStart();
	
	setTotal(worktime);
	setOvertime(worktime - getBreak() - getHourSchedule());
	setTotalNoBreak(Math.abs(worktime - getBreak()));
	
	setTotalDec((parseFloat(worktime).toFixed(2)));
	setOvertimeDec(parseFloat(worktime - getBreak() - getHourSchedule()).toFixed(2));
	setTotalNoBreakDec(getTotalNoBreakDec());
}

function setTotal(time){
	document.getElementById("total").value = floatToTimeString(time);
}

function getTotalDec(){
	var worktime = getEnd() - getStart();
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
	var worktime = getEnd() - getStart();
	return parseFloat(worktime - getBreak() - getHourSchedule()).toFixed(2);
}

function setOvertimeDec(time){
	document.getElementById("overtimedec").value = time;
}

function setOvertimeTotal(time){
	document.getElementById("overtimetotal").value = floatToTimeString(time);
	if ( time > 0 ) {
		document.getElementById("overtimetotal").setAttribute("style", "color:green;");
	} else {
		document.getElementById("overtimetotal").setAttribute("style", "color:red;");
	}
}

function setOvertimeWeekly(time){
	document.getElementById("overtimeweekly").value = floatToTimeString(time);
	if ( time > 0 ) {
		document.getElementById("overtimeweekly").setAttribute("style", "color:green;");
	} else {
		document.getElementById("overtimeweekly").setAttribute("style", "color:red;");
	}
}

function setTotalNoBreak(time){
	document.getElementById("totalnobreak").value = floatToTimeString(time);
}

function getTotalNoBreakDec(){
	var worktime = getEnd() - getStart();
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
		days = 30;
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

function setHistory(){
	const reverseDateRepresentation = date => {
	  let parts = date.split('-');
	  return `${parts[2]}-${parts[1]}-${parts[0]}`;
	};
	
	var //entry = "<span style='float: left; text-align: left;'>Date</span><span style=''>Time (no break)</span><span style='width: 30%; float: right;'>Overtime</span><br><div class='greyed' style='border-bottom: 1px solid black; width: 100%;'></div>",
		entry = "<table width='100%' height='100%'><tr style='border-bottom: 1px solid #000;'><th style='width: 33%;'>Date</th><th style='width: 33%;'>Time (no break)</th><th style='width: 33%;'>Overtime</th></tr>",
		keys = Object.keys(localStorage),
		revkeys = keys.map(reverseDateRepresentation).sort().reverse().map(reverseDateRepresentation),
		overtimetotal = 0,
		overtimeweekly = 0,
		i = 0, 
		key;
		
	const userKeyRegExp = /^[0-9]{2}-[0-9]{2}-[0-9]{4}/;
	
	for (; key = revkeys[i]; i++) {
		if ( userKeyRegExp.test(key) ) {
			var timeinfo = JSON.parse(localStorage.getItem(key));
			if (timeinfo.hasOwnProperty('OvertimeDec')){
				//entry = entry + "<span style='float:left; text-align: left;'>" + key + "</span><span style=''>" + timeinfo['TotalNoBreakDec'] + "</span><span style='width: 30%; float: right;'>" + timeinfo['OvertimeDec'] + "</span><br>";
				entry = entry + "<tr><td>" + key + "</td><td>" + timeinfo['TotalNoBreakDec'] + "</td><td>" + timeinfo['OvertimeDec'] + "</td></tr>"
				overtimetotal = overtimetotal + parseFloat(timeinfo['OvertimeDec']);
				
				if ( moment(key, "DD-MM-YYYY") >= moment().startOf('week') ) {
					overtimeweekly = overtimeweekly + parseFloat(timeinfo['OvertimeDec']);
				}
			} else {
				//entry = entry + "<span class='' style='float:left; text-align: left;'>" + key + "</span><span style=''>" + timeinfo['TotalNoBreakDec'] + "</span><span style='width: 30%; float: right;'>" + timeinfo['RecupDec'] + "</span><br>";
				entry = entry + "<tr><td>" + key + "</td><td>" + timeinfo['TotalNoBreakDec'] + "</td><td>" + timeinfo['RecupDec'] + "</td></tr>"
				overtimetotal = overtimetotal + parseFloat(timeinfo['RecupDec']);
				// convert to new json key
				if (timeinfo.hasOwnProperty('StartDec')){
					timeinfo = '{"TotalNoBreakDec": "' + timeinfo['TotalNoBreakDec'] + '", "OvertimeDec": "' + timeinfo['RecupDec'] + '", "TotalDec": "' + timeinfo['TotalDec'] + '", "StartDec": "' + timeinfo['StartDec'] + '"}';
				} else {
					timeinfo = '{"TotalNoBreakDec": "' + timeinfo['TotalNoBreakDec'] + '", "OvertimeDec": "' + timeinfo['RecupDec'] + '"}';
				}
				localStorage.setItem(key, timeinfo);
			}
		}
	}
	if ( keys == "" || keys == null ) {
		entry = "No previous data yet :("
	} else {
		entry = entry + "</table>"
	}
	document.getElementById("history").innerHTML = entry;		
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
		setHistory();
		document.getElementById("settingsmodalclosebutton").click();
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
		setHistory();
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
	return timeStringToFloat(timestamp);
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
	setHistory();
	
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
		startmin5 = localStorage.getItem("startmin5"),
		historydeleteoption = localStorage.getItem("historydeleteoption"),
		historyretain = localStorage.getItem("historyretain"),
		historyresetday = localStorage.getItem("historyresetday"),
		historyresetperiod = localStorage.getItem("historyresetperiod"),
		historyresetperiodunit = localStorage.getItem("historyresetperiodunit"),
		weeklyovertimeoption = localStorage.getItem("weeklyovertimeoption");

	if ( autoend == "true" )
		document.getElementById("autoend").checked = true;
	if ( nosave == todayDate() )
		document.getElementById("nosave").checked = true;
	document.getElementById("hourschedule").value = "7.6";
	if ( hourschedule )
		document.getElementById("hourschedule").value = hourschedule;
	if ( break_time_default ) {
		document.getElementById("break_time_default").value = break_time_default;
		setBreak(break_time_default);
	} else {
		document.getElementById("break_time_default").value = 0;
	}
	if ( historydeleteoption == "days" ) {
		document.getElementById("historydeleteoptiondays").checked = true;
	} else if (historydeleteoption == "period") {
		document.getElementById("historydeleteoptionperiod").checked = true;
	}
	if ( historyretain )
		document.getElementById("historyretain").value = historyretain;
	if ( historyresetday )
		document.getElementById("historyresetday").value = historyresetday;
	if ( historyresetperiod )
		document.getElementById("historyresetperiod").value = historyresetperiod;
	if ( historyresetperiodunit )
		document.getElementById("historyresetperiodunit").value = historyresetperiodunit;
	if ( weeklyovertimeoption == "true" ) {
		document.getElementById("weeklyovertimeoption").checked = true;
		document.getElementById("divovertimeweekly").classList.add("show");
	}

	showHistorydeleteoptionContent();
	
	/*try {
		var timeinfo = JSON.parse(localStorage.getItem(todayDate()));
		setStart(timeinfo['StartDec']);
		if ( startmin5 == "true" )
			document.getElementById("startmin5").checked = true;
	} catch(e) {
		if ( startmin5 == "true" ) {
			document.getElementById("startmin5").checked = true;
			setStart(now() - 0.08);
		} else {
			setStart(now());
		}	
	}*/
	var timeinfo = JSON.parse(localStorage.getItem(todayDate()));
	if ( timeinfo == null ) {
		if ( startmin5 == "true" ) {
			document.getElementById("startmin5").checked = true;
			setStart(now() - 0.08);
		} else {
			setStart(now());
		}
	} else {
		setStart(timeinfo['StartDec']);
		if ( startmin5 == "true" )
			document.getElementById("startmin5").checked = true;
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

$( document ).on( 'keydown', function ( e ) {
	if ( e.keyCode === 13 ) { //ENTER key code
		add_time(getHourSchedule());
	}
});

window.onbeforeunload = function(e) {
	// Set 'dont save today' and 'automatically set end time' parameters in local storage
	var nosave = document.getElementById("nosave"),
		autoend = document.getElementById("autoend");
	if ( nosave.checked == false ) {
		if (autoend.checked == false ) {
			var timeinfo = '{"TotalNoBreakDec": "' + getTotalNoBreakDec() + '", "OvertimeDec": "' + getOvertimeDec() + '", "TotalDec": "' + getTotalDec() + '", "StartDec": "' + getStart() + '"}';
			localStorage.setItem("autoend", "false");
		} else {
			setEnd(now());
			var timeinfo = '{"TotalNoBreakDec": "' + getTotalNoBreakDec() + '", "OvertimeDec": "' + getOvertimeDec() + '", "TotalDec": "' + getTotalDec() + '", "StartDec": "' + getStart() + '"}';
			localStorage.setItem("autoend", "true");
		}
		localStorage.setItem(todayDate(), timeinfo);
		localStorage.setItem("nosave", "false");
	} else {
		localStorage.setItem("nosave", todayDate());
	}
	// Set 'subtract 5 min from start time' parameter in local storage
	var startmin5 = document.getElementById("startmin5");
	if ( startmin5.checked == false ) {
		localStorage.setItem("startmin5", "false");
	} else {
		localStorage.setItem("startmin5", "true");
	}
	// Set 'hour schedule' parameter in local storage
	localStorage.setItem("hourschedule", getHourSchedule());
	// Set 'default break time' parameter in local storage
	localStorage.setItem("break_time_default", getBreakDefault());
	// Set 'history retain time' parameter in local storage
	localStorage.setItem("historydeleteoption", getHistoryDeleteOption());
	localStorage.setItem("historyretain", getHistoryRetain());
	localStorage.setItem("historyresetday", getHistoryResetDay());
	localStorage.setItem("historyresetperiod", getHistoryResetPeriod());
	localStorage.setItem("historyresetperiodunit", getHistoryResetPeriodUnit());
	// Set UI visibility options
	if ( document.getElementById("weeklyovertimeoption").checked == false ) {
		localStorage.setItem("weeklyovertimeoption", "false");
	} else {
		localStorage.setItem("weeklyovertimeoption", "true");
	}
};
