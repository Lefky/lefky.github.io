console.log("loaded editable_table.js");

/*global app_alert_message, testDateFormat, setHistory, setAlertMessage, deleteHistory */
/*eslint no-undef: "error"*/

// Helper: Wacht tot DOM geladen is (vervangt $(document).ready)
document.addEventListener("DOMContentLoaded", function () {

	// 1. Modal Events
	const modalEditHistory = document.getElementById('modaledithistory');
	if (modalEditHistory) {
		modalEditHistory.addEventListener('show.bs.modal', function () {
			setHistory(true);
		});

		modalEditHistory.addEventListener('hide.bs.modal', function () {
			setHistory(false);
		});
	}

	// 2. Add New Row
	const tableBody = document.getElementById('edit_history_table_body');
	const newTr = `
    <tr class="hide">
        <td class="p-1">
            <input type="date" class="form-control history-date" value="${new Date().toISOString().split('T')[0]}">
        </td>
        <td class="p-1">
            <input type="time" class="form-control history-start" value="08:00">
        </td>
        <td class="p-1">
            <input type="time" class="form-control history-break" value="00:30">
        </td>
        <td class="p-1">
            <input type="time" class="form-control history-total" value="08:00">
        </td>
        <td class="p-1">
             <input type="number" step="0.1" class="form-control history-schedule" value="8">
        </td>
        <td class="p-1">
            <input type="text" class="form-control history-summary" placeholder="Summary">
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

	// Find the button inside .table-add
	const addBtn = document.querySelector('.table-add button');
	if (addBtn) {
		addBtn.addEventListener('click', function () {
			if (tableBody) {
				tableBody.insertAdjacentHTML('afterbegin', newTr);
			}
		});
	}

	// 3. Save All
	const saveAllBtn = document.querySelector('.table-save-all button');
	if (saveAllBtn) {
		saveAllBtn.addEventListener('click', function () {
			const table = document.getElementById('edit_history_table_body');
			if (!table) return;

			const iconToggle = (btn, state) => {
				if (state == "save") {
					if (btn.id == "btn_save_all")
						btn.innerHTML = '<i class="fa fa-save"></i> Save all';
					else
						btn.innerHTML = '<i class="fa fa-save"></i>';
				} else if (state == "check")
					btn.innerHTML = '<i class="fa fa-check"></i>';
			};

			let local_alert_message = "";

			// Loop through rows
			for (let row = 0; row < table.rows.length; row++) {
				const currentRow = table.rows.item(row);

				// Safety check: does this row contain inputs? (Skip empty/hidden rows)
				if (!currentRow.querySelector('.history-date')) continue;

				const dateVal = currentRow.querySelector('.history-date').value;
				const startVal = currentRow.querySelector('.history-start').value;
				const breakVal = currentRow.querySelector('.history-break').value;
				const workedVal = currentRow.querySelector('.history-total').value;
				const scheduleVal = currentRow.querySelector('.history-schedule').value;
				const summaryVal = currentRow.querySelector('.history-summary').value;

				const returncode = save_row(dateVal, startVal, breakVal, workedVal, scheduleVal, summaryVal);

				const btnSpan = currentRow.querySelector('.record-save');
				const btn = btnSpan ? btnSpan.firstElementChild : null;

				if (!returncode) {
					currentRow.classList.remove("bg-washed-red");
					if (btn) {
						// Visual feedback (Check icon for 2 seconds)
						btn.innerHTML = '<i class="fa fa-check"></i>';
						setTimeout(() => { btn.innerHTML = '<i class="fa fa-save"></i>'; }, 2000);
					}
				} else {
					currentRow.classList.add("bg-washed-red");
					local_alert_message = local_alert_message + returncode;
				}
			}

			if (local_alert_message) {
				local_alert_message = "<b>Ai caramba!</b> One or multiple entries haven't been saved!" + local_alert_message;
				setAlertMessage(local_alert_message);
			}

			iconToggle(saveAllBtn, "check");
			setTimeout(() => { iconToggle(saveAllBtn, "save"); }, 2000);

			// Reload history to reflect changes
			setHistory(false);
		});
	}

	// 4. Delete All
	const deleteAllBtn = document.querySelector('.table-delete-all button');
	if (deleteAllBtn) {
		deleteAllBtn.addEventListener('click', function () {
			deleteHistory();
		});
	}

	// 5. Event Delegation for Save & Delete (Clicking icons inside the table)
	const tableElement = document.getElementById('edit_history_table');
	if (tableElement) {
		tableElement.addEventListener('click', function (e) {

			// --- SAVE CLICK ---
			const saveWrapper = e.target.closest('.record-save');
			if (saveWrapper) {
				const currentRow = saveWrapper.closest("tr");

				// Get values from inputs
				const dateVal = currentRow.querySelector('.history-date').value;
				const startVal = currentRow.querySelector('.history-start').value;
				const breakVal = currentRow.querySelector('.history-break').value;
				const workedVal = currentRow.querySelector('.history-total').value;
				const scheduleVal = currentRow.querySelector('.history-schedule').value;
				const summaryVal = currentRow.querySelector('.history-summary').value;

				const returncode = save_row(dateVal, startVal, breakVal, workedVal, scheduleVal, summaryVal);

				const btn = saveWrapper.querySelector("button");
				const iconToggle = () => {
					// Check if icon exists
					const icon = btn.querySelector('i');
					if (icon) {
						if (icon.classList.contains('fa-check')) {
							btn.innerHTML = '<i class="fa fa-save"></i>';
						} else {
							btn.innerHTML = '<i class="fa fa-check"></i>';
						}
					}
				};

				if (!returncode) {
					currentRow.classList.remove("bg-washed-red");
					// Visual feedback (Check icon for 2 seconds)
					btn.innerHTML = '<i class="fa fa-check"></i>';
					setTimeout(() => { btn.innerHTML = '<i class="fa fa-save"></i>'; }, 2000);

					// Reload history to reflect changes
					setHistory(false);
				} else {
					currentRow.classList.add("bg-washed-red");
					let msg = "<b>Ai caramba!</b><br>An entry hasn't been saved!";
					setAlertMessage(msg + returncode);
				}
			}

			// --- DELETE CLICK ---
			const deleteWrapper = e.target.closest('.record-delete');
			if (deleteWrapper) {
				const currentRow = deleteWrapper.closest("tr");

				const dateVal = currentRow.querySelector('.history-date').value; // YYYY-MM-DD
				const startVal = currentRow.querySelector('.history-start').value;
				const breakVal = currentRow.querySelector('.history-break').value;
				const workedVal = currentRow.querySelector('.history-total').value;
				const scheduleVal = currentRow.querySelector('.history-schedule').value;
				const summaryVal = currentRow.querySelector('.history-summary').value;

				// 2. Generate key (YYYY-MM-DD -> DD-MM-YYYY)
				const key = reverseDateRepresentation(dateVal);

				// 3. Build confirmation message
				let record =
					"\nDelete history record?" +
					"\n\nDate:                " + key +
					"\nStart Time:       " + startVal +
					"\nBreak Time:      " + breakVal +
					"\nWork Time:       " + workedVal +
					"\nSchedule:         " + scheduleVal;

				if (summaryVal.trim() !== "")
					record += "\nSummary:\n" + summaryVal;

				if (confirm(record)) {
					delete localStorage[key];
					setHistory(true);
				}
			}
		});
	}

	// 6. Search Filter
	const searchInput = document.getElementById("edit_history_search");
	if (searchInput) {
		searchInput.addEventListener("input", function () {
			const value = this.value.toLowerCase();
			const rows = document.querySelectorAll("#edit_history_table tbody tr");
			let visibleIndex = 0;

			rows.forEach(row => {
				// We build a string of all data in this row
				// We get all inputs within this row
				const inputs = row.querySelectorAll('input');
				let rowText = "";

				// Paste all values together (date, time, summary, etc.)
				inputs.forEach(input => {
					const val = input.value.toLowerCase();
					rowText += val + " ";

					// Set date formats for searching
					if (input.classList.contains('history-date') && val) {
						// YYYY-MM-DD
						const key = dayjs(val);

						if (key.isValid()) {
							// Add formats you want to search on
							// Search for 02-09-2025
							rowText += key.format('DD-MM-YYYY') + " ";
							// Search for 02/09/2025 (dekt ook '09/2025')
							rowText += key.format('DD/MM/YYYY') + " ";
						}
					}
				});

				// Check if the search term is in that concatenated text
				const shouldShow = rowText.indexOf(value) > -1;

				row.style.display = shouldShow ? "" : "none";

				if (shouldShow) {
					row.classList.remove('visible-odd', 'visible-even');
					if (visibleIndex % 2 !== 0) {
						row.classList.add('visible-odd');
					} else {
						row.classList.add('visible-even');
					}
					visibleIndex++;
				}
			});
		});
	}
}); // End DOMContentLoaded

// Global functions (needed for onclick attributes in HTML string)
function clearPlaceholder(cell) {
	if (cell.classList.contains("text-black-50")) {
		cell.innerHTML = "";
		cell.classList.remove("text-black-50");
	}
}

function save_row(dateVal, startVal, breakVal, workedVal, scheduleVal, summaryVal) {
	let error_message = "";

	if (!dateVal) error_message += "<br>Date is required.";
	if (!startVal) error_message += "<br>Start time is required.";
	if (!workedVal) error_message += "<br>Worked hours are required.";
	if (!scheduleVal) error_message += "<br>Schedule is required.";

	if (error_message !== "") {
		return error_message;
	}

	// 1. Generate key (YYYY-MM-DD -> DD-MM-YYYY)
	const key = reverseDateRepresentation(dateVal);

	// 2. Convert times to decimals
	const startDec = startVal ? timeStringToFloat(startVal) : 0;
	const breakDec = breakVal ? timeStringToFloat(breakVal) : 0;
	const workedDec = workedVal ? timeStringToFloat(workedVal) : 0;
	const scheduleDec = parseFloat(scheduleVal);

	// 3. Calculations
	const totalDec = workedDec + breakDec;
	const overtimeDec = workedDec - scheduleDec;

	// 4. Object building
	const timeinfo = {
		TotalNoBreakDec: workedDec.toFixed(2),
		OvertimeDec: overtimeDec.toFixed(2),
		TotalDec: totalDec.toFixed(2),
		StartDec: startDec.toFixed(2),
		HourSchedule: scheduleDec.toFixed(2),
		Summary: summaryVal ? summaryVal.trim() : ""
	};

	// 5. Save
	localStorage.setItem(key, JSON.stringify(timeinfo));

	return ""; // Succes
}
