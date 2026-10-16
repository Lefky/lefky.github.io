/**
 * export.js
 * Manages data export (JSON, CSV, PDF) and file import functionality.
 */

/*global bootstrap, dayjs */
import { testDateFormat, todayDate } from './time-calc.js';
import { getHistoryKeys } from './storage.js';

/**
 * Exports entire localStorage state as a formatted JSON file.
 */
export function exportHistory() {
	const myArray = JSON.stringify(localStorage, null, 4);
	const vLink = document.getElementById('exportHistoryLink');

	if (!vLink) return;

	const vBlob = new Blob([myArray], { type: "application/json" });
	const vName = 'working_history_' + todayDate() + '.json';
	const vUrl = window.URL.createObjectURL(vBlob);

	vLink.setAttribute('href', vUrl);
	vLink.setAttribute('download', vName);
	vLink.click();
}

/**
 * Generates and downloads a CSV export containing all historical work records.
 */
export function exportCSV() {
	const keys = getHistoryKeys();
	const items = [];

	for (let i = 0; i < keys.length; i++) {
		const key = keys[i];
		try {
			let timeinfo = JSON.parse(localStorage.getItem(key));
			if (timeinfo && Object.prototype.hasOwnProperty.call(timeinfo, "OvertimeDec")) {
				timeinfo = Object.assign({ Date: key }, timeinfo);
				items.push(timeinfo);
			}
		} catch (e) {
			console.error("Error parsing history key for CSV:", key, e);
		}
	}

	if (items.length === 0) {
		alert("No data available to export.");
		return;
	}

	const replacer = (key, value) => (value === null ? '' : value);
	const header = Object.keys(items[0]);
	const csv = [
		header.join(','),
		...items.map(row => header.map(fieldName => JSON.stringify(row[fieldName], replacer)).join(','))
	].join('\r\n');

	const vLink = document.getElementById('exportCSVLink');
	if (!vLink) return;

	const vName = 'working_history_' + todayDate() + '.csv';
	const vUrl = 'data:text/csv;charset=utf-8,' + encodeURI(csv);

	vLink.setAttribute('href', vUrl);
	vLink.setAttribute('download', vName);
	vLink.click();
}

/**
 * Quick selector to set date range inputs for PDF/CSV export.
 * @param {'thisMonth'|'lastMonth'|'allTime'} type
 */
export function setExportRange(type) {
	if (typeof dayjs === 'undefined') return;

	const startInput = document.getElementById('export_start_date');
	const endInput = document.getElementById('export_end_date');

	if (!startInput || !endInput) return;

	if (type === 'thisMonth') {
		startInput.value = dayjs().startOf('month').format('YYYY-MM-DD');
		endInput.value = dayjs().endOf('month').format('YYYY-MM-DD');
	} else if (type === 'lastMonth') {
		startInput.value = dayjs().subtract(1, 'month').startOf('month').format('YYYY-MM-DD');
		endInput.value = dayjs().subtract(1, 'month').endOf('month').format('YYYY-MM-DD');
	} else if (type === 'allTime') {
		const keys = getHistoryKeys();
		if (keys.length > 0) {
			startInput.value = dayjs(keys[0], 'DD-MM-YYYY').format('YYYY-MM-DD');
		} else {
			startInput.value = dayjs().format('YYYY-MM-DD');
		}
		endInput.value = dayjs().format('YYYY-MM-DD');
	}
}

/**
 * Generates and downloads a clean, styled PDF report using jsPDF and AutoTable.
 */
export function exportPDF() {
	if (typeof window.jspdf === 'undefined' || typeof dayjs === 'undefined') {
		console.error("jsPDF or dayjs is not loaded.");
		return;
	}

	const { jsPDF } = window.jspdf;
	const doc = new jsPDF();

	const startVal = document.getElementById('export_start_date') ? document.getElementById('export_start_date').value : '';
	const endVal = document.getElementById('export_end_date') ? document.getElementById('export_end_date').value : '';

	const startDate = startVal ? dayjs(startVal) : dayjs('1900-01-01');
	const endDate = endVal ? dayjs(endVal) : dayjs('2100-01-01');

	const keys = getHistoryKeys();
	const tableData = [];
	let totalHours = 0;
	let totalOvertime = 0;

	keys.forEach(key => {
		if (testDateFormat(key)) {
			const currentObj = dayjs(key, "DD-MM-YYYY");
			if (currentObj.isBetween(startDate, endDate, 'day', '[]')) {
				try {
					const timeinfo = JSON.parse(localStorage.getItem(key));
					if (timeinfo) {
						const date = key;
						const start = timeinfo.StartDec !== "correction" ? parseFloat(timeinfo.StartDec).toFixed(2) : "-";
						let end = "-";
						if (timeinfo.StartDec !== "correction" && timeinfo.TotalDec !== "correction") {
							end = (parseFloat(timeinfo.StartDec) + parseFloat(timeinfo.TotalDec)).toFixed(2);
							if (parseFloat(end) >= 24) end = (parseFloat(end) - 24).toFixed(2);
						}

						const total = timeinfo.TotalDec !== "correction" ? parseFloat(timeinfo.TotalDec).toFixed(2) : "0.00";
						const overtime = timeinfo.OvertimeDec;
						const summary = timeinfo.Summary ? timeinfo.Summary.replace(/\n/g, " ") : "";

						tableData.push([date, start, end, total, overtime, summary]);

						if (!isNaN(parseFloat(total))) totalHours += parseFloat(total);
						if (!isNaN(parseFloat(overtime))) totalOvertime += parseFloat(overtime);
					}
				} catch (e) {
					console.error("Error reading entry for PDF:", key, e);
				}
			}
		}
	});

	doc.setFontSize(18);
	doc.text("Working Hours Report", 14, 22);

	doc.setFontSize(11);
	doc.setTextColor(100);
	doc.text(`Period: ${startDate.format('DD/MM/YYYY')} - ${endDate.format('DD/MM/YYYY')}`, 14, 30);
	doc.text(`Total Days Recorded: ${tableData.length}`, 14, 36);
	doc.text(`Total Hours Recorded: ${totalHours.toFixed(2)}h`, 14, 42);
	doc.text(`Total Overtime Recorded: ${totalOvertime.toFixed(2)}h`, 14, 48);

	if (typeof doc.autoTable === 'function') {
		doc.autoTable({
			head: [['Date', 'Start', 'End', 'Total', 'Overtime', 'Summary']],
			body: tableData,
			startY: 57,
			theme: 'grid',
			styles: { fontSize: 8 },
			headStyles: { fillColor: [41, 128, 185] },
			columnStyles: {
				0: { cellWidth: 25 },
				5: { cellWidth: 'auto' }
			}
		});
	}

	doc.save(`working_hours_${startDate.format('YYYYMMDD')}_to_${endDate.format('YYYYMMDD')}.pdf`);

	const modalEl = document.getElementById('modalexport');
	if (modalEl && typeof bootstrap !== 'undefined') {
		const modalInstance = bootstrap.Modal.getInstance(modalEl);
		if (modalInstance) modalInstance.hide();
	}
}

/**
 * Handles JSON file import and parses data into localStorage.
 * @param {Event} e
 */
export function importHistoryData(e) {
	const files = e.target.files;
	if (!files || files.length === 0) return;

	const importFile = document.getElementById('importFile');
	const reader = new FileReader();

	reader.onload = readerEvent => {
		try {
			const content = JSON.parse(readerEvent.target.result);
			Object.keys(content).forEach(function (k) {
				const value = content[k];
				try {
					JSON.parse(value);
					localStorage.setItem(k, value);
				} catch (innerError) {
					localStorage.setItem(k, typeof value === 'object' ? JSON.stringify(value) : value);
				}
			});

			if (importFile) importFile.value = '';

			if (typeof window !== 'undefined') {
				if (typeof window.setHistory === 'function') window.setHistory(true);
				if (typeof window.setParameters === 'function') window.setParameters();
			}

			const closeBtn = document.getElementById("settingsmodalclosebutton");
			if (closeBtn) closeBtn.click();

			alert("Import successful!");
		} catch (error) {
			alert("Import failed! The file contains invalid JSON data.");
			console.error("Error parsing imported file:", error);
		}
	};
	reader.readAsText(files[0]);
}

/**
 * Initializes DOM click and change event listeners for import/export controls.
 */
export function initImportExport() {
	const importHistoryBtn = document.getElementById('importHistory');
	const importFile = document.getElementById('importFile');

	if (importFile) {
		importFile.addEventListener("change", importHistoryData, false);
	}
	if (importHistoryBtn && importFile) {
		importHistoryBtn.onclick = function () {
			importFile.click();
		};
	}
}
