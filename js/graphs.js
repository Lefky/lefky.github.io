/*
In HTML
  <script type="text/javascript" src="https://www.gstatic.com/charts/loader.js"></script>
  <div id="chart_div"></div>
*/
console.log("loading graph.js");

var datasetOvertimeDec = [],
	datasetStartDec = [],
	datasetTotalDec = [],
	datasetTotalNoBreakDec = [],
	datasetBreakDec = [];

google.charts.load('current', {
	packages: ['corechart', 'line']
});

//In comment to not load on page load, only when modal is opened
//google.charts.setOnLoadCallback(drawBasic);

function drawBasic(graphtype) {

	var data = new google.visualization.DataTable(),
		linecolor = "";
	data.addColumn('string', 'X');

	switch (graphtype) {
		case "OvertimeDec":
			data.addColumn('number', 'Overtime');
			data.addRows(datasetOvertimeDec);
			linecolor = ['#28a745'];
			break;
		case "StartDec":
			data.addColumn('number', 'Starttime');
			data.addRows(datasetStartDec);
			linecolor = ['#007bff'];
			break;
		case "TotalDec":
			data.addColumn('number', 'Total');
			data.addColumn('number', 'Hour schedule');
			data.addRows(datasetTotalDec);
			linecolor = ['#ffc107', 'black'];
			break;
		case "TotalNoBreakDec":
			data.addColumn('number', 'Total no break');
			data.addColumn('number', 'Hour schedule');
			data.addRows(datasetTotalNoBreakDec);
			linecolor = ['#dc3545', 'black'];
			break;
		case "BreakDec":
			data.addColumn('number', 'Break');
			data.addColumn('number', 'Hour schedule');
			data.addRows(datasetBreakDec);
			linecolor = ['#17a2b8', 'black'];
			break;
		default:
			// code block
			console.log("No valid graphtype entered");
	}

	/*data.addRows([
		[0, 0],   [1, 10],  [2, 23],  [3, 17],  [4, 18],  [5, 9],
		[6, 11],  [7, 27],  [8, 33],  [9, 40],  [10, 32], [11, 35],
		[12, 30], [13, 40], [14, 42], [15, 47], [16, 44], [17, 48],
		[18, 52], [19, 54], [20, 42], [21, 55], [22, 56], [23, 57],
		[24, 60], [25, 50], [26, 52], [27, 51], [28, 49], [29, 53],
		[30, 55], [31, 60], [32, 61], [33, 59], [34, 62], [35, 65],
		[36, 62], [37, 58], [38, 55], [39, 61], [40, 64], [41, 65],
		[42, 63], [43, 66], [44, 67], [45, 69], [46, 69], [47, 70],
		[48, 72], [49, 68], [50, 66], [51, 65], [52, 67], [53, 70],
		[54, 71], [55, 72], [56, 73], [57, 75], [58, 70], [59, 68],
		[60, 64], [61, 60], [62, 65], [63, 67], [64, 68], [65, 69],
		[66, 70], [67, 72], [68, 75], [69, 80]
	]);*/

	var options = {
		/*explorer: {
			keepInBounds: true
		},*/
		hAxis: {
			title: 'Date',
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
		  0: {
		  },
          1: {
            lineWidth: 1,
            lineDashStyle: [1, 1]
          }
        },
		colors: linecolor,
		width: '100%',
		height: 450
	};

	var chart = new google.visualization.LineChart(document.getElementById(graphtype + '_div'));
	chart.draw(data, options);
}

function initGraphs() {
	datasetOvertimeDec = [];
	datasetStartDec = [];
	datasetTotalDec = [];
	datasetTotalNoBreakDec = [];
	datasetBreakDec = [];
	formatJSONdata();
	drawBasic("OvertimeDec");
	drawBasic("StartDec");
	drawBasic("TotalDec");
	drawBasic("TotalNoBreakDec");
	drawBasic("BreakDec");
}

// Redraw chart on opening modal
$('#modalreporting').on('shown.bs.modal', function() {
	initGraphs();
});

$(window).resize(function() {
	initGraphs();
});

function formatJSONdata() {
	const reverseDateRepresentation = date => {
		let parts = date.split('-');
		return `${parts[2]}-${parts[1]}-${parts[0]}`;
	};

	var keys = Object.keys(localStorage),
		sortedkeys = keys.map(reverseDateRepresentation).sort().map(reverseDateRepresentation), // don't do reverse() here to have dates ascending
		i = 0,
		key,
		datasetlength = document.getElementById('graphdatasetlength_value').value;

	const userKeyRegExp = /^[0-9]{2}-[0-9]{2}-[0-9]{4}/;
	
	//console.log(sortedkeys);

	for (; key = sortedkeys[i]; i++) {
		if (!userKeyRegExp.test(key)) {
			sortedkeys.splice(i, 1)
			i--;
		}
	}

	i = 0;
	var start = sortedkeys.length - datasetlength;

	for (; key = sortedkeys[i]; i++) {
		if (userKeyRegExp.test(key) && i >= start) {
			var timeinfo = JSON.parse(localStorage.getItem(key));
			if (timeinfo.hasOwnProperty('OvertimeDec')) {
				datasetOvertimeDec.push([key, parseFloat(timeinfo['OvertimeDec'])]);
			}
			if (timeinfo.hasOwnProperty('StartDec')) {
				var StartDec = parseFloat(timeinfo['StartDec']);
				datasetStartDec.push([key, StartDec]);
			}
			if (timeinfo.hasOwnProperty('TotalDec')) {
				if (timeinfo.hasOwnProperty('HourSchedule')) {
					datasetTotalDec.push([key, parseFloat(timeinfo['TotalDec']), parseFloat(timeinfo['HourSchedule'])]);
				} else {
					datasetTotalDec.push([key, parseFloat(timeinfo['TotalDec']), null]);
				}
			}
			if (timeinfo.hasOwnProperty('TotalNoBreakDec')) {
				if (timeinfo.hasOwnProperty('HourSchedule')) {
					datasetTotalNoBreakDec.push([key, parseFloat(timeinfo['TotalNoBreakDec']), parseFloat(timeinfo['HourSchedule'])]);
				} else {
					datasetTotalNoBreakDec.push([key, parseFloat(timeinfo['TotalNoBreakDec']), null]);
				}
			}
			if (timeinfo.hasOwnProperty('TotalDec') && timeinfo.hasOwnProperty('TotalNoBreakDec')) {
				if (timeinfo.hasOwnProperty('HourSchedule')) {
					datasetBreakDec.push([key, Math.abs(parseFloat(timeinfo['TotalDec']) - parseFloat(timeinfo['TotalNoBreakDec'])), parseFloat(timeinfo['HourSchedule'])]);
				} else {
					datasetBreakDec.push([key, Math.abs(parseFloat(timeinfo['TotalDec']) - parseFloat(timeinfo['TotalNoBreakDec'])), null]);
				}
			}
			//console.log("accepted value record");
		}
	}
}