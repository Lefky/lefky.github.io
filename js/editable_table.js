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
        <td class="pt-3-half new_cell text-black-50" contenteditable="true" onfocus='clearPlaceholder(this)'>01-01-1900</td>
        <td class="pt-3-half new_cell text-black-50" contenteditable="true" onfocus='clearPlaceholder(this)'>Total Time No Break</td>
        <td class="pt-3-half new_cell text-black-50" contenteditable="true" onfocus='clearPlaceholder(this)'>Overtime</td>
        <td class="pt-3-half new_cell text-black-50" contenteditable="true" onfocus='clearPlaceholder(this)'>Total Work Time</td>
        <td class="pt-3-half new_cell text-black-50" contenteditable="true" onfocus='clearPlaceholder(this)'>Start Time</td>
        <td class="pt-3-half new_cell text-black-50" contenteditable="true" onfocus='clearPlaceholder(this)'>Hour Schedule</td>
        <td class="pt-3-half new_cell text-black-50" contenteditable="true" onfocus='clearPlaceholder(this)'>Summary</td>
        <td>
            <span class="record-save">
                <button type="button" class="btn btn-outline-success">
                    <i class="fa fa-save"></i>
                </button>
            </span>
            <span class="record-delete">
                <button type="button" class="btn btn-outline-danger">
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

				// Safe access to cells
				const key = currentRow.cells[0].innerText;
				const TotalNoBreakDec = currentRow.cells[1].innerText;
				const OvertimeDec = currentRow.cells[2].innerText;
				const TotalDec = currentRow.cells[3].innerText;
				const StartDec = currentRow.cells[4].innerText;
				const HourSchedule = currentRow.cells[5].innerText;
				const Summary = currentRow.cells[6].innerText;

				const returncode = save_row(key, TotalNoBreakDec, OvertimeDec, TotalDec, StartDec, HourSchedule, Summary);

				const btnSpan = currentRow.querySelector('.record-save');
				const btn = btnSpan ? btnSpan.firstElementChild : null;

				if (!returncode) {
					currentRow.classList.remove("bg-washed-red");
					if (btn) {
						iconToggle(btn, "check");
						setTimeout(() => { iconToggle(btn, "save"); }, 2000);
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

				const key = currentRow.cells[0].innerText;
				const TotalNoBreakDec = currentRow.cells[1].innerText;
				const OvertimeDec = currentRow.cells[2].innerText;
				const TotalDec = currentRow.cells[3].innerText;
				const StartDec = currentRow.cells[4].innerText;
				const HourSchedule = currentRow.cells[5].innerText;
				const Summary = currentRow.cells[6].innerText;

				const returncode = save_row(key, TotalNoBreakDec, OvertimeDec, TotalDec, StartDec, HourSchedule, Summary);

				const btn = saveWrapper.querySelector("button");
				const iconToggle = () => {
					const icon = btn.querySelector('.fa-check');
					if (icon)
						btn.innerHTML = '<i class="fa fa-save"></i>';
					else
						btn.innerHTML = '<i class="fa fa-check"></i>';
				};

				if (!returncode) {
					currentRow.classList.remove("bg-washed-red");
					iconToggle();
					setTimeout(iconToggle, 2000);
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

				const key = currentRow.cells[0].innerText;
				const TotalNoBreakDec = currentRow.cells[1].innerText;
				const OvertimeDec = currentRow.cells[2].innerText;
				const TotalDec = currentRow.cells[3].innerText;
				const StartDec = currentRow.cells[4].innerText;
				const HourSchedule = currentRow.cells[5].innerText;
				const Summary = currentRow.cells[6].innerText;

				const record = "\nDelete history record with \n \nDate:                             " + key + "\nTotal Time No Break:    " + TotalNoBreakDec + "\nOvertime:                      " + OvertimeDec + "\nTotal Work Time:          " + TotalDec + "\nStart Time:                    " + StartDec + "\nHour Schedule:            " + HourSchedule + "\nSummary:\n" + Summary;

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
				const text = row.innerText.toLowerCase();
				const shouldShow = text.indexOf(value) > -1 || text.indexOf("edit") > -1;

				row.style.display = shouldShow ? "" : "none";

				if (shouldShow) {
					// Re-apply striping classes
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

function save_row(key, TotalNoBreakDec, OvertimeDec, TotalDec, StartDec, HourSchedule, Summary) {
	const isnumber = /^(-?)\d+(\.\d+)?$/;
	const istext = /^[.\\\s\w\d]*$/;
	let error_message = "";

	// Sanitize inputs
	key = key.trim();
	TotalNoBreakDec = TotalNoBreakDec.trim();
	OvertimeDec = OvertimeDec.trim();
	TotalDec = TotalDec.trim();
	StartDec = StartDec.trim();
	HourSchedule = HourSchedule.trim();
	// Summary handling
	if (Summary.trim() === "Summary") Summary = "";

	if (!testDateFormat(key)) {
		error_message += "<br><br>Date for date \"" + key + "\" is not in the DD-MM-YYYY format.";
	}
	if (!isnumber.test(TotalNoBreakDec) && TotalNoBreakDec.toLowerCase() !== "correction") {
		error_message += "<br><br>Total Time No Break for date \"" + key + "\" is not a (decimal) number or the word \"correction\".";
	}
	if (!isnumber.test(OvertimeDec)) {
		error_message += "<br><br>Overtime for date \"" + key + "\" is not a (decimal) number.";
	}
	if (!isnumber.test(TotalDec) && TotalDec.toLowerCase() !== "correction") {
		error_message += "<br><br>Total Work Time for date \"" + key + "\" is not a (decimal) number or the word \"correction\".";
	}
	if (!isnumber.test(StartDec) && StartDec.toLowerCase() !== "correction") {
		error_message += "<br><br>Start Time for date \"" + key + "\" is not a (decimal) number or the word \"correction\".";
	}
	if (!isnumber.test(HourSchedule) && HourSchedule.toLowerCase() !== "correction") {
		error_message += "<br><br>Hour Schedule for date \"" + key + "\" is not a (decimal) number or the word \"correction\".";
	}
	// Note: RegEx check for text disabled or customized as per original logic requirements,
	// but here we allow basic text.
	// if (!istext.test(Summary) && Summary.toLowerCase() !== "correction") ...

	if (error_message === "") {
		const timeinfo = {
			TotalNoBreakDec: TotalNoBreakDec.toLowerCase() !== "correction" ? parseFloat(TotalNoBreakDec).toFixed(2) : "correction",
			OvertimeDec: parseFloat(OvertimeDec).toFixed(2),
			TotalDec: TotalDec.toLowerCase() !== "correction" ? parseFloat(TotalDec).toFixed(2) : "correction",
			StartDec: StartDec.toLowerCase() !== "correction" ? parseFloat(StartDec).toFixed(2) : "correction",
			HourSchedule: HourSchedule.toLowerCase() !== "correction" ? parseFloat(HourSchedule).toFixed(2) : "correction",
			Summary: Summary.toLowerCase() === "correction" ? "correction" : Summary
		};

		const validJsonString = JSON.stringify(timeinfo);
		localStorage.setItem(key, validJsonString);

		return; // Success
	} else {
		error_message += "<br><br>Please correct your entry and try again.";
		return error_message; // Failure
	}
}
