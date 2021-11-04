console.log("loaded graphs.js");
/*
In HTML
  <script type="text/javascript" src="https://www.gstatic.com/charts/loader.js"></script>
  <div id="div_where_graph_comes"></div>
*/

var sortedkeys = getHistory(),
	numberOfDaysRegistered = 0,
	datasetOvertimeDec = [],
	datasetStartDec = [],
	datasetStopDec = [],
	datasetTotalDec = [],
	datasetTotalNoBreakDec = [],
	datasetBreakDec = [],
	datasetHourscheduleDec = [],
	positiveOvertimeDays = 0,
	negativeOvertimeDays = 0,
	sumStarttime = 0,
	sumStoptime = 0,
	sumOvertime = 0;


// SYNC loading
google.charts.load('current', { packages: ['corechart', 'gauge'] });

// ASYNC loading
function initGoogleLibraries(googleLib) {
	return new Promise(function (resolve, reject) {
		if (filesadded.indexOf("[" + googleLib + "]") == -1) {
			google.charts.load('current', {
				packages: ['corechart', 'gauge']
			}).then(function () {
				filesadded += "[" + googleLib + "]";
				console.log("loaded google Lib");
				resolve("loaded google Lib");
			});
		} else {
			resolve("already loaded google Lib");
		}
	});
}

document.getElementById("start_reporting_selection").addEventListener("load", initDateSelector());

// In comment to not load on page load, only when modal is opened
//google.charts.setOnLoadCallback(drawAreagraph);

function initGraphs() {
	/* jshint -W030 */
	numberOfDaysRegistered = 0,
	datasetOvertimeDec = [],
	datasetStartDec = [],
	datasetStopDec = [],
	datasetTotalDec = [],
	datasetTotalNoBreakDec = [],
	datasetBreakDec = [],
	datasetHourscheduleDec = [],
	positiveOvertimeDays = 0,
	negativeOvertimeDays = 0,
	sumStarttime = 0,
	sumStoptime = 0,
	sumOvertime = 0;

	formatJSONdata();
}

function drawGraphs() {
	drawGaugegraph("DaysRegisteredGauge");
	drawGaugegraph("AvgStarttimeGauge");
	drawGaugegraph("AvgStoptimeGauge");
	drawGaugegraph("SumOvertimeGauge");
	drawPiegraph("OvertimeDays");
	drawPiegraph("Hourschedules");
	drawAreagraph("OvertimeDec");
	drawAreagraph("StartDec");
	drawAreagraph("StopDec");
	drawBargraph("TotalDec");
	drawBargraph("TotalNoBreakDec");
	drawAreagraph("BreakDec");
}

function initDateSelector() {
	//document.getElementById('start_reporting_selection').value = moment().startOf('year').subtract(1, 'year').format('YYYY-MM-DD');
	document.getElementById('start_reporting_selection').value = moment(sortedkeys[0], 'DD-MM-YYYY').format('YYYY-MM-DD');

	document.getElementById('end_reporting_selection').value = moment().format('YYYY-MM-DD');
}

$('#modalreporting').on('shown.bs.modal', function () {
	// Redraw charts on opening modal
	initGraphs();
	drawGraphs();

	// Rotate screen for mobile users so it displays the entire width
	// https://usefulangle.com/post/105/javascript-change-screen-orientation
	mobileRotateScreen(true);
});

$('#modalreporting').on('hidden.bs.modal', function () {
	// Rotate screen for mobile users so it displays normal again
	mobileRotateScreen(false);
});

$(window).resize(function () {
	drawGraphs();
});

function mobileRotateScreen(rotate) {
	if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
		if (rotate) {
			document.documentElement.requestFullscreen();
			document.documentElement.webkitRequestFullScreen();

			var current_mode = screen.orientation;
			console.log(current_mode.type);
			console.log(current_mode.angle);

			screen.orientation.lock("landscape");
			current_mode = screen.orientation;
		} else {
			screen.orientation.unlock();
			document.exitFullscreen();
			document.webkitExitFullscreen();
		}
	}
}

function drawAreagraph(graphtype) {
	var data = new google.visualization.DataTable(),
		linecolor = "";
	data.addColumn('date', 'X');

	switch (graphtype) {
		case "OvertimeDec":
			data.addColumn('number', 'Overtime');
			data.addColumn({ 'type': 'string', 'role': 'tooltip', 'p': { 'html': true } });
			data.addRows(datasetOvertimeDec);
			linecolor = ['#28a745'];
			break;
		case "StartDec":
			data.addColumn('number', 'Starttime');
			data.addColumn({ 'type': 'string', 'role': 'tooltip', 'p': { 'html': true } });
			data.addRows(datasetStartDec);
			linecolor = ['#007bff'];
			break;
		case "StopDec":
			data.addColumn('number', 'Stoptime');
			data.addColumn({ 'type': 'string', 'role': 'tooltip', 'p': { 'html': true } });
			data.addRows(datasetStopDec);
			linecolor = ['#ff9900'];
			break;
		case "BreakDec":
			data.addColumn('number', 'Break');
			data.addColumn({ 'type': 'string', 'role': 'tooltip', 'p': { 'html': true } });
			data.addColumn('number', 'Hour schedule');
			data.addColumn({ 'type': 'string', 'role': 'tooltip', 'p': { 'html': true } });
			data.addRows(datasetBreakDec);
			linecolor = ['#17a2b8', 'black'];
			break;
		default:
			// code block
			console.log("No valid graphtype entered");
	}

	var options = {
		tooltip: { isHtml: true },
		explorer: {
			axis: 'horizontal',
			actions: ['dragToZoom', 'rightClickToReset'],
			maxZoomIn: 0.05
		},
		hAxis: {
			//title: 'Date',
			format: 'dd-MM-YYYY',
			slantedText: true
			//slantedTextAngle: 60
		},
		vAxis: {
			title: 'Time (decimal hours)'
		},
		chartArea: {
			// leave room for y-axis labels
			left: 65,
			width: '100%'
		},
		legend: {
			position: 'top',
			alignment: 'center'
		},
		series: {
			0: {},
			1: {
				lineWidth: 1,
				lineDashStyle: [1, 1],
				areaOpacity: 0
			}
		},
		trendlines: {
			0: {
				labelInLegend: 'Trend',
				visibleInLegend: true,
				color: 'purple',
				lineWidth: 3,
				opacity: 0.2,
				type: 'linear'
			}
		},
		colors: linecolor,
		width: '100%',
		height: 500
	};

	var chart = new google.visualization.AreaChart(document.getElementById(graphtype + '_div'));
	chart.draw(data, options);
}

function drawBargraph(graphtype) {
	var data = new google.visualization.DataTable(),
		linecolor = "";
	data.addColumn('date', 'X');

	switch (graphtype) {
		case "TotalDec":
			data.addColumn('number', 'Total');
			data.addColumn({ 'type': 'string', 'role': 'tooltip', 'p': { 'html': true } });
			data.addColumn('number', 'Hour schedule');
			data.addColumn({ 'type': 'string', 'role': 'tooltip', 'p': { 'html': true } });
			data.addRows(datasetTotalDec);
			linecolor = ['#ffc107', 'black'];
			break;
		case "TotalNoBreakDec":
			data.addColumn('number', 'Total no break');
			data.addColumn({ 'type': 'string', 'role': 'tooltip', 'p': { 'html': true } });
			data.addColumn('number', 'Hour schedule');
			data.addColumn({ 'type': 'string', 'role': 'tooltip', 'p': { 'html': true } });
			data.addRows(datasetTotalNoBreakDec);
			linecolor = ['#dc3545', 'black'];
			break;
		default:
			// code block
			console.log("No valid graphtype entered");
	}

	var options = {
		tooltip: { isHtml: true },
		explorer: {
			axis: 'horizontal',
			actions: ['dragToZoom', 'rightClickToReset'],
			maxZoomIn: 0.05
		},
		hAxis: {
			//title: 'Date',
			format: 'dd-MM-YYYY',
			slantedText: true
			//slantedTextAngle: 60
		},
		vAxis: {
			title: 'Time (decimal hours)'
		},
		chartArea: {
			// leave room for y-axis labels
			left: 65,
			width: '100%'
		},
		legend: {
			position: 'top',
			alignment: 'center'
		},
		seriesType: 'bars',
		series: {
			1: {
				type: 'line',
				lineWidth: 1,
				lineDashStyle: [1, 1]
			}
		},
		trendlines: {
			0: {
				labelInLegend: 'Trend',
				visibleInLegend: true,
				color: 'purple',
				lineWidth: 3,
				opacity: 0.2,
				type: 'linear'
			}
		},
		colors: linecolor,
		width: '100%',
		height: 500
	};

	var chart = new google.visualization.ComboChart(document.getElementById(graphtype + '_div'));
	chart.draw(data, options);
}

function drawPiegraph(graphtype) {
	var data = new google.visualization.DataTable(),
		slicecolor,
		title = "";

	switch (graphtype) {
		case "OvertimeDays":
			data.addColumn('string', 'Metric');
			data.addColumn('number', 'Value');
			data.addRows([
				['# positive overtime days', positiveOvertimeDays],
				['# negative overtime days', negativeOvertimeDays]
			]);
			slicecolor = ['#28a745', '#dc3545'];
			title = "Days of overtime";
			break;
		case "Hourschedules":
			data.addColumn('string', 'Schedule');
			data.addColumn('number', 'Value');
			data.addRows(datasetHourscheduleDec);
			title = "Hourschedules";
			break;
		default:
			// code block
			console.log("No valid graphtype entered");
	}

	var options = {
		//pieStartAngle: 270,
		title: title,
		colors: slicecolor,
		width: '100%',
		height: 300
	};

	var chart = new google.visualization.PieChart(document.getElementById(graphtype + '_div'));
	chart.draw(data, options);

	// If there isn't any data to display, display a notification
	if (graphtype == "OvertimeDays" && positiveOvertimeDays == 0 && negativeOvertimeDays == 0) {
		$('#OvertimeDays_div svg g text:first').html("No days of overtime in window");
	}
}

function drawGaugegraph(graphtype) {
	var data = new google.visualization.DataTable(),
		min = 0,
		max = 0,
		redFrom,
		redTo,
		yellowFrom,
		yellowTo,
		greenFrom,
		greenTo,
		redColor = 'rgb(251, 216, 208)',
		yellowColor = 'rgb(255, 235, 204)',
		greenColor = 'rgb(209, 250, 211)',
		majorTicks,
		minorTicks = 5;

	var avg_starttime,
		avg_stoptime;

	switch (graphtype) {
		case "DaysRegisteredGauge":
			data.addColumn('string', 'Metric');
			data.addColumn('number', 'Value');
			data.addRows([
				['Days registered', numberOfDaysRegistered],
			]);
			min = 0;
			max = localStorage.getItem("historyretain");
			redFrom = max - ((max / 100) * 5);
			redTo = max;
			yellowFrom = max - ((max / 100) * 7.5);
			yellowTo = max - ((max / 100) * 5);
			break;
		case "AvgStarttimeGauge":
			data.addColumn('string', 'Metric');
			data.addColumn('number', 'Value');
			avg_starttime = sumStarttime / numberOfDaysRegistered;
			data.addRows([
				['Avg starttime', avg_starttime]
			]);
			min = 0;
			max = 24;
			redFrom = 4;
			redTo = 6;
			yellowFrom = 10;
			yellowTo = 12;
			greenFrom = 6;
			greenTo = 10;
			redColor = 'rgb(255, 235, 204)';
			majorTicks = ["0", "3", "", "", "12", "", "", "21", "24"];
			minorTicks = 3;
			break;
		case "AvgStoptimeGauge":
			data.addColumn('string', 'Metric');
			data.addColumn('number', 'Value');
			avg_stoptime = sumStoptime / numberOfDaysRegistered;
			data.addRows([
				['Avg stoptime', avg_stoptime]
			]);
			min = 0;
			max = 24;
			redFrom = 12.5;
			redTo = 14.5;
			yellowFrom = 18.5;
			yellowTo = 20.5;
			greenFrom = 14.5;
			greenTo = 18.5;
			redColor = 'rgb(255, 235, 204)';
			majorTicks = ["0", "3", "", "", "12", "", "", "21", "24"];
			minorTicks = 3;
			break;
		case "SumOvertimeGauge":
			data.addColumn('string', 'Metric');
			data.addColumn('number', 'Value');
			data.addRows([
				['Total overtime', sumOvertime]
			]);
			min = -50;
			max = 50;
			redFrom = min;
			redTo = 0;
			greenFrom = 0;
			greenTo = max;
			break;
		default:
			// code block
			console.log("No valid graphtype entered");
	}

	var options = {
		/* https://developers.google.com/chart/interactive/docs/gallery/gauge#configuration-options */
		redFrom: redFrom,
		redTo: redTo,
		yellowFrom: yellowFrom,
		yellowTo: yellowTo,
		greenFrom: greenFrom,
		greenTo: greenTo,
		redColor: redColor,
		yellowColor: yellowColor,
		greenColor: greenColor,
		majorTicks: majorTicks,
		minorTicks: minorTicks,
		min: min,
		max: max,
		width: '100%',
		height: 250
	};

	var chart = new google.visualization.Gauge(document.getElementById(graphtype + '_div'));
	chart.draw(data, options);

	$('#' + graphtype + '_div svg g text:first').attr('font-size', 20); // change the fontsize of the title, there's no parameter for this

	// change the format of the starttime gauge to non-decimal
	if (graphtype == "AvgStarttimeGauge") {
		$('#AvgStarttimeGauge_div svg g g text:first').html(floatToTimeString(avg_starttime));
	}
	if (graphtype == "AvgStoptimeGauge") {
		$('#AvgStoptimeGauge_div svg g g text:first').html(floatToTimeString(avg_stoptime));
	}
}

function formatJSONdata() {
	//var start = sortedkeys.length - datasetlength; // howmany datapoints need to be skipped before starting to draw graphs
	var start_reporting_selection = moment(document.getElementById('start_reporting_selection').value, 'YYYY-MM-DD').subtract(1, 'days').format('YYYY-MM-DD'),
		end_reporting_selection = document.getElementById('end_reporting_selection').value;

	var timeinfo,
		variable,
		hourschedule,
		tooltip,
		hourscheduletooltip,
		dateKey;

	/* jshint -W084 */
	for (var i = 0; key = sortedkeys[i]; i++) {

		if (testDateFormat(key)/* && i >= start*/) {
			timeinfo = JSON.parse(localStorage.getItem(key));
			dateKey = moment(key, "DD-MM-YYYY");

			if (dateKey.isBetween(start_reporting_selection, end_reporting_selection) && timeinfo.HourSchedule.toLowerCase() == "correction") {
				sumOvertime = parseFloat(sumOvertime.toFixed(2)) + parseFloat(timeinfo.OvertimeDec);
			}

			if (dateKey.isBetween(start_reporting_selection, end_reporting_selection) && timeinfo.HourSchedule.toLowerCase() != "correction") {

				dateKey = key.split('-');
				dateKey = new Date(dateKey[2], dateKey[1] - 1, dateKey[0]);
				numberOfDaysRegistered++;

				if (timeinfo.hasOwnProperty('OvertimeDec')) {
					variable = parseFloat(timeinfo.OvertimeDec);
					tooltip = "<div style='padding: 5%; width: 150px; font-family:Arial;font-size:14px;color:#000000;opacity:1;margin:0;font-style:none;text-decoration:none;font-weight:bold;'><span style='margin-bottom: 5%;'>" + key + "</span><br><span style='font-weight:normal;'>Overtime: </span>" + floatToTimeString(variable) + "</div>";
					datasetOvertimeDec.push([dateKey, variable, tooltip]);
					sumOvertime = sumOvertime + variable;
					if (variable > 0) {
						positiveOvertimeDays++;
					} else if (variable < 0) {
						negativeOvertimeDays++;
					}
				}
				if (timeinfo.hasOwnProperty('StartDec')) {
					variable = parseFloat(timeinfo.StartDec);
					tooltip = "<div style='padding: 5%; width: 150px; font-family:Arial;font-size:14px;color:#000000;opacity:1;margin:0;font-style:none;text-decoration:none;font-weight:bold;'><span style='margin-bottom: 5%;'>" + key + "</span><br><span style='font-weight:normal;'>Starttime: </span>" + floatToTimeString(variable) + "</div>";
					sumStarttime = sumStarttime + variable;
					datasetStartDec.push([dateKey, variable, tooltip]);

					if (timeinfo.hasOwnProperty('TotalDec')) {
						variable = variable + parseFloat(timeinfo.TotalDec);
						tooltip = "<div style='padding: 5%; width: 150px; font-family:Arial;font-size:14px;color:#000000;opacity:1;margin:0;font-style:none;text-decoration:none;font-weight:bold;'><span style='margin-bottom: 5%;'>" + key + "</span><br><span style='font-weight:normal;'>Stoptime: </span>" + floatToTimeString(variable) + "</div>";
						sumStoptime = sumStoptime + variable;

						//console.log(key + " = " + moment().format("DD-MM-YYYY"));
						datasetStopDec.push([dateKey, variable, tooltip]);
					}
				}

				if (timeinfo.hasOwnProperty('HourSchedule')) {
					hourschedule = parseFloat(timeinfo.HourSchedule);
					hourscheduletooltip = "<div style='padding: 5%; width: 150px; font-family:Arial;font-size:14px;color:#000000;opacity:1;margin:0;font-style:none;text-decoration:none;font-weight:bold;'><span style='margin-bottom: 5%;'>" + key + "</span><br><span style='font-weight:normal;'>Hourschedule: </span>" + hourschedule + "h</div>";
				}

				if (timeinfo.hasOwnProperty('TotalDec')) {
					variable = parseFloat(timeinfo.TotalDec);
					tooltip = "<div style='padding: 5%; width: 150px; font-family:Arial;font-size:14px;color:#000000;opacity:1;margin:0;font-style:none;text-decoration:none;font-weight:bold;'><span style='margin-bottom: 5%;'>" + key + "</span><br><span style='font-weight:normal;'>Total time: </span>" + floatToTimeString(variable) + "</div>";
					if (timeinfo.hasOwnProperty('HourSchedule')) {
						datasetTotalDec.push([dateKey, variable, tooltip, hourschedule, hourscheduletooltip]);
					} else {
						datasetTotalDec.push([dateKey, variable, null]);
					}
				}
				if (timeinfo.hasOwnProperty('TotalNoBreakDec')) {
					variable = parseFloat(timeinfo.TotalNoBreakDec);
					tooltip = "<div style='padding: 5%; width: 150px; font-family:Arial;font-size:14px;color:#000000;opacity:1;margin:0;font-style:none;text-decoration:none;font-weight:bold;'><span style='margin-bottom: 5%;'>" + key + "</span><br><span style='font-weight:normal;'>Total time (no break): </span>" + floatToTimeString(variable) + "</div>";
					if (timeinfo.hasOwnProperty('HourSchedule')) {
						datasetTotalNoBreakDec.push([dateKey, variable, tooltip, hourschedule, hourscheduletooltip]);
					} else {
						datasetTotalNoBreakDec.push([dateKey, variable, null]);
					}
				}
				if (timeinfo.hasOwnProperty('TotalDec') && timeinfo.hasOwnProperty('TotalNoBreakDec')) {
					variable = Math.abs(parseFloat(timeinfo.TotalDec) - parseFloat(timeinfo.TotalNoBreakDec));
					tooltip = "<div style='padding: 5%; width: 150px; font-family:Arial;font-size:14px;color:#000000;opacity:1;margin:0;font-style:none;text-decoration:none;font-weight:bold;'><span style='margin-bottom: 5%;'>" + key + "</span><br><span style='font-weight:normal;'>Breaktime: </span>" + floatToTimeString(variable) + "</div>";
					if (timeinfo.hasOwnProperty('HourSchedule')) {
						//datasetBreakDec.push([dateKey, variable, parseFloat(timeinfo['HourSchedule'])]);
						datasetBreakDec.push([dateKey, variable, tooltip, hourschedule, hourscheduletooltip]);
					} else {
						datasetBreakDec.push([dateKey, variable, tooltip, null]);
					}
				}
				if (timeinfo.hasOwnProperty('HourSchedule')) {
					datasetHourscheduleDec = updateArray(datasetHourscheduleDec, timeinfo.HourSchedule + "h");
				}
				//console.log("accepted value record");
			}
		}
	}
	//console.log("sumOvertime: "+sumOvertime);
}

function updateArray(array, category) {
	const entry = array.find(([cat]) => cat === category);
	if (entry) {
		// Update the value
		++entry[1];
		//console.log("category updated");
	} else {
		// Add a new entry
		array.push([category, 1]);
		//console.log("category created");
	}
	return array;
}