console.log("loaded graphs.js");

/*global $, dayjs, google, testDateFormat, floatToTimeString, getHistoryKeys, importBootstrapColors, colorScheme, bs_blue, bs_washed_red, bs_washed_green, bs_washed_yellow, bs_purple, bs_teal, bs_cyan, bs_green, bs_red, bs_yellow, bs_pink, bs_gray, ,bs_gray_dark, bs_body_bg, bs_white, bs_indigo, bs_orange, bs_light*/
/*eslint no-undef: "error"*/

/*
In HTML
  <script type="text/javascript" src="https://www.gstatic.com/charts/loader.js"></script>
  <div id="div_where_graph_comes"></div>
*/

var sortedkeys = [],
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
	sumOvertime = 0,
	moneyRate = "",
	moneyRateUnit = "";

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

function initGraphs(resetDates = false) {
	// Refresh the list of dates, in case data has been removed/added
	sortedkeys = getHistoryKeys();

	if (resetDates) {
		initDateSelector();
	}

	// Load money rate settings
	moneyRate = localStorage.getItem("moneyRate");
	moneyRateUnit = localStorage.getItem("moneyRateUnit");
	if (moneyRate)
		document.getElementById("moneyRate").value = moneyRate;
	if (moneyRateUnit == "hourly")
		document.getElementById("moneyRateUnitHourly").click();
	else if (moneyRateUnit == "daily")
		document.getElementById("moneyRateUnitMonthy").click();

	// Reset variables
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
	importBootstrapColors();
	//drawTimelinegraph("Workdays");
	drawGaugegraph("DaysRegisteredGauge");
	drawGaugegraph("AvgStarttimeGauge");
	drawGaugegraph("AvgStoptimeGauge");
	drawGaugegraph("SumOvertimeGauge");
	drawGaugegraph("moneyRateOvertimeGauge");
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
	// Check if there is data to prevent crashing
	if (sortedkeys && sortedkeys.length > 0) {
		document.getElementById('start_reporting_selection').value = dayjs(reverseDateRepresentation(sortedkeys[0])).format('YYYY-MM-DD');
	} else {
		// No data? Take the first of this month as fallback
		document.getElementById('start_reporting_selection').value = dayjs().startOf('month').format('YYYY-MM-DD');
	}
	document.getElementById('end_reporting_selection').value = dayjs().add(1, "d").format('YYYY-MM-DD');
}

function setDateSelector(start, end) {
	document.getElementById('start_reporting_selection').value = dayjs(start).format('YYYY-MM-DD');
	document.getElementById('end_reporting_selection').value = dayjs(end).format('YYYY-MM-DD');
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
		backgroundColor: bs_body_bg
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
		backgroundColor: bs_body_bg
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
		backgroundColor: bs_body_bg
	};

	const chart = new google.visualization.PieChart(document.getElementById(graphtype + '_div'));
	chart.draw(data, options);

	// If there isn't any data to display, display a notification
	if (graphtype == "OvertimeDays" && positiveOvertimeDays == 0 && negativeOvertimeDays == 0) {
		const svgText = document.querySelector('#OvertimeDays_div svg g text');
		if (svgText)
			svgText.innerHTML = "No days of overtime in window";
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
		case "moneyRateOvertimeGauge":
			data.addColumn('string', 'Metric');
			data.addColumn('number', 'Value');

			let outputRate = 0;
			if (moneyRateUnit == "monthly") {
				outputRate = (parseFloat(moneyRate) / (22 * localStorage.getItem("hourschedule"))) * sumOvertime; // assuming 22 workdays each month
			} else if (moneyRateUnit == "hourly") {
				outputRate = parseFloat(moneyRate) * sumOvertime;
			} else {
				outputRate = 0;
			}

			if (isNaN(outputRate)) outputRate = 0;

			data.addRows([
				['Overtime earnings', outputRate]
			]);
			min = 0;
			max = Math.ceil(outputRate / 100) * 100;
			if (isNaN(max) || max <= 0) max = 10;
			redFrom = min;
			redTo = 0;
			greenFrom = 0;
			greenTo = max;
			break;
		default:
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

	const gaugeTitle = document.querySelector('#' + graphtype + '_div svg g text');
	if (gaugeTitle)
		gaugeTitle.setAttribute('font-size', 20); // change the fontsize of the title, there's no parameter for this

	// change the format of the starttime gauge to non-decimal
	if (graphtype == "AvgStarttimeGauge") {
		const startText = document.querySelector('#AvgStarttimeGauge_div svg g g text');
		if (startText)
			startText.innerHTML = floatToTimeString(avg_starttime);
	}
	if (graphtype == "AvgStoptimeGauge") {
		const stopText = document.querySelector('#AvgStoptimeGauge_div svg g g text');
		if (stopText)
			stopText.innerHTML = floatToTimeString(avg_stoptime);
	}
	if (graphtype == "moneyRateOvertimeGauge") {
		const gaugeContainer = document.getElementById('moneyRateOvertimeGauge_div');
		const textElements = gaugeContainer.querySelectorAll('text');

		textElements.forEach(textEl => {
			const currentText = textEl.textContent.trim();
			if (currentText === max.toString() || currentText === min.toString()) {
				textEl.setAttribute('font-size', '12');
				if (currentText === max.toString()) {
					textEl.textContent = 'Millionaire';
				} else {
					textEl.textContent = 'Broke';
				}
			}
		});
	}
}

function getReportingStartDate() {
	return dayjs(document.getElementById('start_reporting_selection').value, 'YYYY-MM-DD').subtract(1, 'days').format('YYYY-MM-DD');
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
		dateKey,
		key,
		in_range,
		correction;

	// eslint-disable-next-line no-cond-assign
	for (let i = 0; key = sortedkeys[i]; i++) {

		if (testDateFormat(key)/* && i >= start*/) {
			timeinfo = JSON.parse(localStorage.getItem(key));
			if (!timeinfo) // Prevent possible infinite loop
				continue;

			dateKey = dayjs(key, "DD-MM-YYYY");

			try {
				// replace by const
				in_range = dateKey.isBetween(start_reporting_selection, end_reporting_selection) ? true : false;
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

						//console.log(key + " = " + dayjs().format("DD-MM-YYYY"));
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
	let day = dayjs(start),
		businessDays = 0;

	return new Promise(resolve => $.getJSON('https://date.nager.at/api/v3/PublicHolidays/' + dayjs().format('YYYY') + '/' + country, function (response) {
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
	return new Promise(resolve => $.getJSON('https://date.nager.at/api/v3/PublicHolidays/' + dayjs().format('YYYY') + '/' + country, function (response) {
		// JSON result in `response` variable

		let holidays = [],
			calendar = [],
			day = dayjs(start, 'DD-MM-YYYY'),
			lastDay = dayjs(end, 'DD-MM-YYYY');

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
// Modal Events
const modalReporting = document.getElementById('modalreporting');
if (modalReporting) {
	modalReporting.addEventListener('shown.bs.modal', function () {
		// Redraw charts on opening modal
		initGraphs(true);
		drawGraphs();
		mobileRotateScreen(true);
	});

	modalReporting.addEventListener('hidden.bs.modal', function () {
		mobileRotateScreen(false);
	});
}

function saveMoneyRateSettings() {
	moneyRateUnit = document.querySelector('input[name="moneyRateUnit"]:checked').id == "moneyRateUnitHourly" ? "hourly" : "monthly";
	moneyRate = document.getElementById("moneyRate").value;

	localStorage.setItem("moneyRateUnit", moneyRateUnit);
	localStorage.setItem("moneyRate", moneyRate);

	drawGaugegraph("moneyRateOvertimeGauge");
};

// Window Resize
window.addEventListener('resize', function () {
	drawGraphs();
});

// Button Click Handlers
function addClickListener(id, startFunc, endFunc) {
	const el = document.getElementById(id);
	if (el) {
		el.addEventListener('click', function () {
			setDateSelector(startFunc(), endFunc());
		});
	}
}

// Using functions to prevent immediate execution on page load. This way the date is always calculated on click
addClickListener('reporting_weektodate',
	() => dayjs().startOf('week').add(1, 'day'),
	() => dayjs()
);

addClickListener('reporting_previousweek',
	() => dayjs().subtract(1, 'week').startOf('week').add(1, 'day'),
	() => dayjs().subtract(1, 'week').endOf('week').add(1, 'day')
);

addClickListener('reporting_monthtodate',
	() => dayjs().startOf('month'),
	() => dayjs()
);

addClickListener('reporting_previousmonth',
	() => dayjs().subtract(1, 'month').startOf('month'),
	() => dayjs().subtract(1, 'month').endOf('month')
);

addClickListener('reporting_yeartodate',
	() => dayjs().startOf('year'),
	() => dayjs()
);

addClickListener('reporting_alltime',
	() => dayjs(sortedkeys[0], 'DD-MM-YYYY'),
	() => dayjs()
);
