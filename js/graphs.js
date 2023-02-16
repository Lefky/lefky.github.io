console.log("loaded graphs.js");

/*global $, moment, google, testDateFormat, floatToTimeString, getHistoryKeys, colorScheme, bs_blue, bs_washed_red, bs_washed_green, bs_washed_yellow, bs_purple, bs_teal, bs_cyan, bs_green, bs_red, bs_yellow, bs_pink, bs_gray, ,bs_gray_dark, bs_white, bs_indigo, bs_orange, bs_light*/
/*eslint no-undef: "error"*/

/*
In HTML
  <script type="text/javascript" src="https://www.gstatic.com/charts/loader.js"></script>
  <div id="div_where_graph_comes"></div>
*/

var sortedkeys = getHistoryKeys(),
	numberOfDaysRegistered = 0,
	datasetOvertimeDec = [],
	datasetOvertimeCumulative = [],
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
google.charts.load('current', { packages: ['corechart', 'gauge', 'timeline'] });

// ASYNC loading - unused atm
/*function initGoogleLibraries(googleLib) {
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
}*/

// In comment to not load on page load, only when modal is opened
//google.charts.setOnLoadCallback(drawAreagraph);

function initGraphs() {
	numberOfDaysRegistered = 0,
	datasetOvertimeDec = [],
	datasetOvertimeCumulative = [],
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
	//drawTimelinegraph("Workdays");
	drawGaugegraph("DaysRegisteredGauge");
	drawGaugegraph("AvgStarttimeGauge");
	drawGaugegraph("AvgStoptimeGauge");
	drawGaugegraph("SumOvertimeGauge");
	drawPiegraph("OvertimeDays");
	drawPiegraph("Hourschedules");
	drawAreagraph("OvertimeDec");
	drawAreagraph("OvertimeCumulative");
	drawAreagraph("StartDec");
	drawAreagraph("StopDec");
	drawBargraph("TotalDec");
	drawBargraph("TotalNoBreakDec");
	drawAreagraph("BreakDec");
}

function initDateSelector() {
	document.getElementById('start_reporting_selection').value = moment(sortedkeys[0], 'DD-MM-YYYY').format('YYYY-MM-DD');
	document.getElementById('end_reporting_selection').value = moment().format('YYYY-MM-DD');
}

function setDateSelector(start, end) {
	document.getElementById('start_reporting_selection').value = moment(start).format('YYYY-MM-DD');
	document.getElementById('end_reporting_selection').value = moment(end).format('YYYY-MM-DD');
	initGraphs();
	drawGraphs();
}

function mobileRotateScreen(rotate) {
	if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
		if (rotate) {
			document.documentElement.requestFullscreen();
			document.documentElement.webkitRequestFullScreen();

			let current_mode = screen.orientation;
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
	const data = new google.visualization.DataTable();
	let linecolor = "";
	data.addColumn('date', 'X');

	switch (graphtype) {
		case "OvertimeDec":
			data.addColumn('number', 'Overtime');
			data.addColumn({ 'type': 'string', 'role': 'tooltip', 'p': { 'html': true } });
			data.addRows(datasetOvertimeDec);
			linecolor = [bs_teal];
			break;
		case "OvertimeCumulative":
			data.addColumn('number', 'Cumulative Overtime');
			data.addColumn({ 'type': 'string', 'role': 'tooltip', 'p': { 'html': true } });
			data.addRows(datasetOvertimeCumulative);
			linecolor = [bs_cyan];
			break;
		case "StartDec":
			data.addColumn('number', 'Starttime');
			data.addColumn({ 'type': 'string', 'role': 'tooltip', 'p': { 'html': true } });
			data.addRows(datasetStartDec);
			linecolor = [bs_green];
			break;
		case "StopDec":
			data.addColumn('number', 'Stoptime');
			data.addColumn({ 'type': 'string', 'role': 'tooltip', 'p': { 'html': true } });
			data.addRows(datasetStopDec);
			linecolor = [bs_red];
			break;
		case "BreakDec":
			data.addColumn('number', 'Break');
			data.addColumn({ 'type': 'string', 'role': 'tooltip', 'p': { 'html': true } });
			data.addColumn('number', 'Hour schedule');
			data.addColumn({ 'type': 'string', 'role': 'tooltip', 'p': { 'html': true } });
			data.addRows(datasetBreakDec);
			linecolor = colorScheme == "light" ? [bs_gray, bs_gray_dark] : [bs_light, bs_pink];
			break;
		default:
			// code block
			console.log("No valid graphtype entered");
	}

	const options = {
		tooltip: { isHtml: true },
		explorer: {
			axis: 'horizontal',
			actions: ['dragToZoom', 'rightClickToReset'],
			maxZoomIn: 0.05
		},
		hAxis: {
			//title: 'Date',
			format: 'dd-MM-YYYY',
			slantedText: true,
			textStyle: {
				color: colorScheme == "light" ? bs_gray_dark : bs_white
			}
			//slantedTextAngle: 60
		},
		vAxis: {
			title: 'Time (decimal hours)',
			titleTextStyle: {
				color: colorScheme == "light" ? bs_gray_dark : bs_white
			},
			textStyle: {
				color: colorScheme == "light" ? bs_gray_dark : bs_white
			}
		},
		chartArea: {
			// leave room for y-axis labels
			left: 65,
			width: '100%'
		},
		legend: {
			position: 'top',
			alignment: 'center',
			textStyle: {
				color: colorScheme == "light" ? bs_gray_dark : bs_white
			}
		},
		series: {
			0: {},
			1: {
				lineWidth: 1,
				lineDashStyle: [5, 1],
				areaOpacity: 0
			}
		},
		trendlines: {
			0: {
				labelInLegend: 'Trend',
				visibleInLegend: true,
				color: bs_indigo,
				lineWidth: 3,
				opacity: colorScheme == "light" ? 0.2 : 1,
				type: 'linear'
			}
		},
		colors: linecolor,
		width: '100%',
		height: 500,
		backgroundColor: colorScheme == "light" ? bs_white : '#2f2f2f'
	};

	const chart = new google.visualization.AreaChart(document.getElementById(graphtype + '_div'));
	chart.draw(data, options);
}

function drawBargraph(graphtype) {
	const data = new google.visualization.DataTable();
	let linecolor = "";
	data.addColumn('date', 'X');

	switch (graphtype) {
		case "TotalDec":
			data.addColumn('number', 'Total');
			data.addColumn({ 'type': 'string', 'role': 'tooltip', 'p': { 'html': true } });
			data.addColumn('number', 'Hour schedule');
			data.addColumn({ 'type': 'string', 'role': 'tooltip', 'p': { 'html': true } });
			data.addRows(datasetTotalDec);
			linecolor = colorScheme == "light" ? [bs_yellow, bs_gray_dark] : [bs_yellow, bs_pink];
			break;
		case "TotalNoBreakDec":
			data.addColumn('number', 'Total no break');
			data.addColumn({ 'type': 'string', 'role': 'tooltip', 'p': { 'html': true } });
			data.addColumn('number', 'Hour schedule');
			data.addColumn({ 'type': 'string', 'role': 'tooltip', 'p': { 'html': true } });
			data.addRows(datasetTotalNoBreakDec);
			linecolor = colorScheme == "light" ? [bs_orange, bs_gray_dark] : [bs_orange, bs_pink];
			break;
		default:
			// code block
			console.log("No valid graphtype entered");
	}

	const options = {
		tooltip: { isHtml: true },
		explorer: {
			axis: 'horizontal',
			actions: ['dragToZoom', 'rightClickToReset'],
			maxZoomIn: 0.05
		},
		hAxis: {
			//title: 'Date',
			format: 'dd-MM-YYYY',
			slantedText: true,
			textStyle: {
				color: colorScheme == "light" ? bs_gray_dark : bs_white
			}
			//slantedTextAngle: 60
		},
		vAxis: {
			title: 'Time (decimal hours)',
			titleTextStyle: {
				color: colorScheme == "light" ? bs_gray_dark : bs_white
			},
			textStyle: {
				color: colorScheme == "light" ? bs_gray_dark : bs_white
			}
		},
		chartArea: {
			// leave room for y-axis labels
			left: 65,
			width: '100%'
		},
		legend: {
			position: 'top',
			alignment: 'center',
			textStyle: {
				color: colorScheme == "light" ? bs_gray_dark : bs_white
			}
		},
		seriesType: 'bars',
		series: {
			1: {
				type: 'line',
				lineWidth: 1,
				lineDashStyle: [5, 1]
			}
		},
		trendlines: {
			0: {
				labelInLegend: 'Trend',
				visibleInLegend: true,
				color: bs_indigo,
				lineWidth: 3,
				opacity: colorScheme == "light" ? 0.2 : 1,
				type: 'linear'
			}
		},
		colors: linecolor,
		width: '100%',
		height: 500,
		backgroundColor: colorScheme == "light" ? bs_white : '#2f2f2f'
	};

	const chart = new google.visualization.ComboChart(document.getElementById(graphtype + '_div'));
	chart.draw(data, options);
}

function drawPiegraph(graphtype) {
	const data = new google.visualization.DataTable();
	let slicecolor,
		title = "";

	switch (graphtype) {
		case "OvertimeDays":
			data.addColumn('string', 'Metric');
			data.addColumn('number', 'Value');
			data.addRows([
				['# positive overtime days', positiveOvertimeDays],
				['# negative overtime days', negativeOvertimeDays]
			]);
			slicecolor = [bs_green, bs_red];
			title = "Days of overtime";
			break;
		case "Hourschedules":
			data.addColumn('string', 'Schedule');
			data.addColumn('number', 'Value');
			data.addRows(datasetHourscheduleDec);
			slicecolor = [bs_red, bs_orange, bs_yellow, bs_green, bs_blue, bs_gray, bs_indigo, bs_purple, bs_pink, bs_teal, bs_cyan, bs_gray_dark];
			title = "Hourschedules";
			break;
		default:
			// code block
			console.log("No valid graphtype entered");
	}

	const options = {
		//pieStartAngle: 270,
		legend: {
			textStyle: {
				color: colorScheme == "light" ? bs_gray_dark : bs_white
			}
		},
		titleTextStyle: {
			color: colorScheme == "light" ? bs_gray_dark : bs_white
		},
		title: title,
		colors: slicecolor,
		width: '100%',
		height: 300,
		backgroundColor: colorScheme == "light" ? bs_white : '#2f2f2f'
	};

	const chart = new google.visualization.PieChart(document.getElementById(graphtype + '_div'));
	chart.draw(data, options);

	// If there isn't any data to display, display a notification
	if (graphtype == "OvertimeDays" && positiveOvertimeDays == 0 && negativeOvertimeDays == 0) {
		$('#OvertimeDays_div svg g text:first').html("No days of overtime in window");
	}
}

function drawGaugegraph(graphtype) {
	const data = new google.visualization.DataTable();
	let min = 0,
		max = 0,
		redFrom,
		redTo,
		yellowFrom,
		yellowTo,
		greenFrom,
		greenTo,
		redColor = bs_washed_red,
		yellowColor = bs_washed_yellow,
		greenColor = bs_washed_green,
		majorTicks,
		minorTicks = 5;

	let avg_starttime,
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
			redColor = bs_washed_yellow;
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
			redColor = bs_washed_yellow;
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

	const options = {
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

	const chart = new google.visualization.Gauge(document.getElementById(graphtype + '_div'));
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

/*async function drawTimelinegraph(graphtype) {
	const data = new google.visualization.DataTable();
	let title = "";

	switch (graphtype) {
		case "Workdays":
			data.addColumn({ type: 'string', id: 'Day' });
			data.addColumn({ type: 'string', id: 'dummy bar label' });
			data.addColumn({ type: 'string', role: 'tooltip' });
			data.addColumn({ type: 'date', id: 'Start' });
			data.addColumn({ type: 'date', id: 'End' });

			const calendar = await businessDays(getCountry(), todayDate(), "31-12-" + moment().format('YYYY'));
			calendar.forEach(function (element) {
				let type = "Workday";
				if (element[1])
					type = "Weekend";
				else if (element[2])
					type = "Holiday";

				const tooltip = "<b>" + element[0] + "</b><br><br>Weekend: " + element[1] + "<br>Holiday: " + element[2];

				data.addRows([
					[type, "", tooltip, new Date(moment(element[0], 'DD-MM-YYYY').format('YYYY-MM-DD')), new Date(moment(element[0], 'DD-MM-YYYY').add(1, 'd').format('YYYY-MM-DD'))]
				]);
			});

			break;
		default:
			// code block
			console.log("No valid graphtype entered");
	}

	const options = {
		//pieStartAngle: 270,
		title: title,
		width: document.getElementById("OvertimeDec_div").offsetWidth,
		tooltip: {
			isHtml: true
		}
		//height: 300
	};

	const chart = new google.visualization.Timeline(document.getElementById(graphtype + '_div'));
	chart.draw(data, options);
}*/

function getReportingStartDate() {
	return moment(document.getElementById('start_reporting_selection').value, 'YYYY-MM-DD').subtract(1, 'days').format('YYYY-MM-DD');
}

function getReportingEndDate() {
	return document.getElementById('end_reporting_selection').value;
}

function formatJSONdata() {
	//var start = sortedkeys.length - datasetlength; // howmany datapoints need to be skipped before starting to draw graphs
	const start_reporting_selection = getReportingStartDate(),
			end_reporting_selection = getReportingEndDate();

	let timeinfo,
		variable,
		hourschedule,
		tooltip,
		hourscheduletooltip,
		dateKey, key;

	// eslint-disable-next-line no-cond-assign
	for (let i = 0; key = sortedkeys[i]; i++) {

		if (testDateFormat(key)/* && i >= start*/) {
			timeinfo = JSON.parse(localStorage.getItem(key));
			dateKey = moment(key, "DD-MM-YYYY");

			try {
				// replace by const
				var in_range = dateKey.isBetween(start_reporting_selection, end_reporting_selection) ? true : false,
					correction = timeinfo.HourSchedule.toLowerCase() == "correction" ? true : false;
			} catch (err) {
				console.log(err);
				console.log(dateKey);
				console.log(timeinfo);
			}

			if (in_range && correction)
				sumOvertime = parseFloat(sumOvertime.toFixed(2)) + parseFloat(timeinfo.OvertimeDec);

			if (in_range && !correction) {

				dateKey = key.split('-');
				dateKey = new Date(dateKey[2], dateKey[1] - 1, dateKey[0]);
				numberOfDaysRegistered++;

				if (Object.prototype.hasOwnProperty.call(timeinfo, "OvertimeDec")) {
					variable = parseFloat(timeinfo.OvertimeDec);

					tooltip = "<div style='padding: 5%; width: 150px; font-family:Arial;font-size:14px;color:#000000;opacity:1;margin:0;font-style:none;text-decoration:none;font-weight:bold;'><span style='margin-bottom: 5%;'>" + key + "</span><br><span style='font-weight:normal;'>Overtime: </span>" + floatToTimeString(variable) + "</div>";
					datasetOvertimeDec.push([dateKey, variable, tooltip]);

					sumOvertime = sumOvertime + variable;

					tooltip = "<div style='padding: 5%; width: 150px; font-family:Arial;font-size:14px;color:#000000;opacity:1;margin:0;font-style:none;text-decoration:none;font-weight:bold;'><span style='margin-bottom: 5%;'>" + key + "</span><br><span style='font-weight:normal;'>Overtime: </span>" + floatToTimeString(sumOvertime) + "</div>";
					datasetOvertimeCumulative.push([dateKey, sumOvertime, tooltip]);

					if (variable > 0)
						positiveOvertimeDays++;
					else if (variable < 0)
						negativeOvertimeDays++;
				}
				if (Object.prototype.hasOwnProperty.call(timeinfo, "StartDec")) {
					variable = parseFloat(timeinfo.StartDec);
					tooltip = "<div style='padding: 5%; width: 150px; font-family:Arial;font-size:14px;color:#000000;opacity:1;margin:0;font-style:none;text-decoration:none;font-weight:bold;'><span style='margin-bottom: 5%;'>" + key + "</span><br><span style='font-weight:normal;'>Starttime: </span>" + floatToTimeString(variable) + "</div>";
					sumStarttime = sumStarttime + variable;
					datasetStartDec.push([dateKey, variable, tooltip]);

					if (Object.prototype.hasOwnProperty.call(timeinfo, "TotalDec")) {
						variable = variable + parseFloat(timeinfo.TotalDec);
						tooltip = "<div style='padding: 5%; width: 150px; font-family:Arial;font-size:14px;color:#000000;opacity:1;margin:0;font-style:none;text-decoration:none;font-weight:bold;'><span style='margin-bottom: 5%;'>" + key + "</span><br><span style='font-weight:normal;'>Stoptime: </span>" + floatToTimeString(variable) + "</div>";
						sumStoptime = sumStoptime + variable;

						//console.log(key + " = " + moment().format("DD-MM-YYYY"));
						datasetStopDec.push([dateKey, variable, tooltip]);
					}
				}

				if (Object.prototype.hasOwnProperty.call(timeinfo, "HourSchedule")) {
					hourschedule = parseFloat(timeinfo.HourSchedule);
					hourscheduletooltip = "<div style='padding: 5%; width: 150px; font-family:Arial;font-size:14px;color:#000000;opacity:1;margin:0;font-style:none;text-decoration:none;font-weight:bold;'><span style='margin-bottom: 5%;'>" + key + "</span><br><span style='font-weight:normal;'>Hourschedule: </span>" + hourschedule + "h</div>";
				}

				if (Object.prototype.hasOwnProperty.call(timeinfo, "TotalDec")) {
					variable = parseFloat(timeinfo.TotalDec);
					tooltip = "<div style='padding: 5%; width: 150px; font-family:Arial;font-size:14px;color:#000000;opacity:1;margin:0;font-style:none;text-decoration:none;font-weight:bold;'><span style='margin-bottom: 5%;'>" + key + "</span><br><span style='font-weight:normal;'>Total time: </span>" + floatToTimeString(variable) + "</div>";
					if (Object.prototype.hasOwnProperty.call(timeinfo, "HourSchedule"))
						datasetTotalDec.push([dateKey, variable, tooltip, hourschedule, hourscheduletooltip]);
					else
						datasetTotalDec.push([dateKey, variable, null]);
				}
				if (Object.prototype.hasOwnProperty.call(timeinfo, "TotalNoBreakDec")) {
					variable = parseFloat(timeinfo.TotalNoBreakDec);
					tooltip = "<div style='padding: 5%; width: 150px; font-family:Arial;font-size:14px;color:#000000;opacity:1;margin:0;font-style:none;text-decoration:none;font-weight:bold;'><span style='margin-bottom: 5%;'>" + key + "</span><br><span style='font-weight:normal;'>Total time (no break): </span>" + floatToTimeString(variable) + "</div>";
					if (Object.prototype.hasOwnProperty.call(timeinfo, "HourSchedule")) {
						datasetTotalNoBreakDec.push([dateKey, variable, tooltip, hourschedule, hourscheduletooltip]);
					} else {
						datasetTotalNoBreakDec.push([dateKey, variable, null]);
					}
				}
				if (Object.prototype.hasOwnProperty.call(timeinfo, "TotalDec") && Object.prototype.hasOwnProperty.call(timeinfo, "TotalNoBreakDec")) {
					variable = Math.abs(parseFloat(timeinfo.TotalDec) - parseFloat(timeinfo.TotalNoBreakDec));
					tooltip = "<div style='padding: 5%; width: 150px; font-family:Arial;font-size:14px;color:#000000;opacity:1;margin:0;font-style:none;text-decoration:none;font-weight:bold;'><span style='margin-bottom: 5%;'>" + key + "</span><br><span style='font-weight:normal;'>Breaktime: </span>" + floatToTimeString(variable) + "</div>";
					if (Object.prototype.hasOwnProperty.call(timeinfo, "HourSchedule")) {
						//datasetBreakDec.push([dateKey, variable, parseFloat(timeinfo['HourSchedule'])]);
						datasetBreakDec.push([dateKey, variable, tooltip, hourschedule, hourscheduletooltip]);
					} else {
						datasetBreakDec.push([dateKey, variable, tooltip, null]);
					}
				}
				if (Object.prototype.hasOwnProperty.call(timeinfo, "HourSchedule"))
					datasetHourscheduleDec = updateArray(datasetHourscheduleDec, timeinfo.HourSchedule + "h");
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

/*
async function calcBusinessDays(country, start, end) {
	// Takes start date into account, if it's a workday it gets added
	let day = moment(start),
		businessDays = 0;

	return new Promise(resolve => $.getJSON('https://date.nager.at/api/v3/PublicHolidays/' + moment().format('YYYY') + '/' + country, function (response) {
		// JSON result in `response` variable

		let holidays = [];
		response.forEach(function (element) {
			holidays.push(element.date);
		});

		while (day.isSameOrBefore(end, 'day')) {
			const isholiday = holidays.indexOf(day.format('YYYY-MM-DD')) > -1;
			//console.log(day.day() + " != 0 && " + day.day() + " != 6 && " + !isholiday);
			if (day.day() != 0 && day.day() != 6 && !isholiday)
				businessDays++;
			//console.log(businessDays);

			day.add(1, 'd');
		}
		console.log("final: " + businessDays);
		resolve(businessDays);
	}));
}

async function businessDays(country, start, end){
	// Takes start date into account, if it's a workday it gets added
	return new Promise(resolve => $.getJSON('https://date.nager.at/api/v3/PublicHolidays/' + moment().format('YYYY') + '/' + country, function (response) {
		// JSON result in `response` variable

		let holidays = [],
			calendar = [],
			day = moment(start, 'DD-MM-YYYY'),
			lastDay = moment(end, 'DD-MM-YYYY');

		response.forEach(function (element) {
			holidays.push(element.date);
		});

		while (day.isSameOrBefore(lastDay, 'day')) {
			const isholiday = holidays.indexOf(day.format('YYYY-MM-DD')) > -1,
				  isweekend = day.day() == 0 || day.day() == 6 ? true : false;

			calendar.push([day.format('DD-MM-YYYY'), isweekend, isholiday]);
			day.add(1, 'd');
		}

		resolve(calendar);
	}));
}
*/

// Listeners
document.getElementById("start_reporting_selection").addEventListener("load", initDateSelector());

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

$('#reporting_weektodate').on('click', function () {
	setDateSelector(moment().startOf('week').add(1, 'day'), moment());
});

$('#reporting_previousweek').on('click', function () {
	setDateSelector(moment().subtract(1, 'week').startOf('week').add(1, 'day'), moment().subtract(1, 'week').endOf('week').add(1, 'day'));
});

$('#reporting_monthtodate').on('click', function () {
	setDateSelector(moment().startOf('month'), moment());
});

$('#reporting_previousmonth').on('click', function () {
	setDateSelector(moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month'));
});

$('#reporting_yeartodate').on('click', function () {
	setDateSelector(moment().startOf('year'), moment());
});

$('#reporting_alltime').on('click', function () {
	setDateSelector(moment(sortedkeys[0], 'DD-MM-YYYY'), moment());
});

/*
// testing
setTimeout(async function () {
	var f = 'DD-MM-YYYY',
		start = moment("15-08-2022", f),
		end = moment("21-08-2022", f);
	var country = "BE";
	//var calculated = await calcBusinessDays(country, start, end);

	//console.log('from: ' + start.format(f), 'to: ' + end.format(f), 'is ' + calculated + ' workday(s)');


	//console.log(await businessDays(country, start, end));
}, 600);
*/