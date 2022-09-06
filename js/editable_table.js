console.log("loaded editable_table.js");
// source: https://mdbootstrap.com/docs/jquery/tables/editable/

// Redraw table on opening modal
$('#modaledithistory').on('show.bs.modal', function () {
	setHistory(true);
});

$('#modaledithistory').on('hide.bs.modal', function () {
	setHistory(false);
});

const $tableID = '#edit_history_table';

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

$('.table-add').on('click', 'button', function () {
	$('#edit_history_table_body').prepend(newTr);
});

$('.table-save-all').on('click', 'button', function () {
	const table = document.getElementById('edit_history_table_body');

	const iconToggle = (btn, state) => {
		if (state == "save") {
			if (btn.id == "btn_save_all")
				btn.innerHTML = '<i class="fa fa-save"></i> Save all';
			else
				btn.innerHTML = '<i class="fa fa-save"></i>';
		} else if (state == "check")
			btn.innerHTML = '<i class="fa fa-check"></i>';
	};

	// loop through each row of the table.
	let app_alert_message = "";
	for (row = 0; row < table.rows.length; row++) {
		const currentRow = table.rows.item(row);

		const key = currentRow.cells.item(0).innerHTML,
			TotalNoBreakDec = currentRow.cells.item(1).innerHTML,
			OvertimeDec = currentRow.cells.item(2).innerHTML,
			TotalDec = currentRow.cells.item(3).innerHTML,
			StartDec = currentRow.cells.item(4).innerHTML,
			HourSchedule = currentRow.cells.item(5).innerHTML,
			Summary = currentRow.cells.item(6).innerHTML;

		const returncode = save_row(key, TotalNoBreakDec, OvertimeDec, TotalDec, StartDec, HourSchedule, Summary);

		if (!returncode) {
			const btn = currentRow.getElementsByClassName('record-save')[0].firstElementChild;
			currentRow.style.backgroundColor = "";
			iconToggle(btn, "check");
			setTimeout(() => { iconToggle(btn, "save"); }, 2000);
		} else {
			currentRow.style.backgroundColor = bs_washed_red;
			app_alert_message = app_alert_message + returncode;
		}
	}

	if (app_alert_message) {
		app_alert_message = "<b>Ai caramba!</b> One or multiple entries haven't been saved!" + app_alert_message;
		setAlertMessage(app_alert_message);
	}

	const btn_all = document.getElementsByClassName('table-save-all')[0].firstElementChild;
	iconToggle(btn_all, "check");
	setTimeout(() => { iconToggle(btn_all, "save"); }, 2000);

	setHistory(false);
});

$('.table-delete-all').on('click', 'button', function () {
	deleteHistory();
});

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

	Summary = Summary.replace(/\n/g, '\\n');
	console.log(Summary);

	if (!testDateFormat(key))
		error_message = error_message + "<br><br>Date for date \"" + key + "\" is not in the DD-MM-YYYY format.";

	if (!isnumber.test(TotalNoBreakDec) && TotalNoBreakDec.toLowerCase() != "correction")
		error_message = error_message + "<br><br>Total Time No Break for date \"" + key + "\" is not a (decimal) number or the word \"correction\".";

	if (!isnumber.test(OvertimeDec))
		error_message = error_message + "<br><br>Overtime for date \"" + key + "\" is not a (decimal) number.";

	if (!isnumber.test(TotalDec) && TotalDec.toLowerCase() != "correction")
		error_message = error_message + "<br><br>Total Work Time for date \"" + key + "\" is not a (decimal) number or the word \"correction\".";

	if (!isnumber.test(StartDec) && StartDec.toLowerCase() != "correction")
		error_message = error_message + "<br><br>Start Time for date \"" + key + "\" is not a (decimal) number or the word \"correction\".";

	if (!isnumber.test(HourSchedule) && HourSchedule.toLowerCase() != "correction")
		error_message = error_message + "<br><br>Hour Schedule for date \"" + key + "\" is not a (decimal) number or the word \"correction\".";

	if (!istext.test(Summary) && Summary.toLowerCase() != "correction")
		error_message = error_message + "<br><br>Summary for date \"" + key + "\" is not a valid text or the word \"correction\".";


	if (error_message == "") {
		Summary = Summary == "Summary" ? "" : Summary;
		const timeinfo = '{"TotalNoBreakDec": "' + (TotalNoBreakDec.toLowerCase() != "correction" ? parseFloat(TotalNoBreakDec).toFixed(2) : "correction") + '", "OvertimeDec": "' + parseFloat(OvertimeDec).toFixed(2) + '", "TotalDec": "' + (TotalDec.toLowerCase() != "correction" ? parseFloat(TotalDec).toFixed(2) : "correction") + '", "StartDec": "' + (StartDec.toLowerCase() != "correction" ? parseFloat(StartDec).toFixed(2) : "correction") + '", "HourSchedule": "' + (HourSchedule.toLowerCase() != "correction" ? parseFloat(HourSchedule).toFixed(2) : "correction") + '", "Summary": "' + (Summary.toLowerCase() != "correction" ? Summary : "correction") + '"}';
		localStorage.setItem(key, timeinfo);
		console.log(Summary);
	} else {
		error_message = error_message + "<br><br>Please correct your entry and try again.";
		return error_message;
	}
	return;
}

$($tableID).on('click', '.record-save', function () {
	const currentRow = $(this).closest("tr");

	const key = currentRow.find("td:eq(0)").text(), // get current row 1st TD value
		TotalNoBreakDec = currentRow.find("td:eq(1)").text(), // get current row 2nd TD
		OvertimeDec = currentRow.find("td:eq(2)").text(), // get current row 3rd TD
		TotalDec = currentRow.find("td:eq(3)").text(), // get current row 4th TD
		StartDec = currentRow.find("td:eq(4)").text(), // get current row 5th TD
		HourSchedule = currentRow.find("td:eq(5)").text(), // get current row 6th
		Summary = currentRow.find("td:eq(6)").text(), // get current row 7th
		returncode = save_row(key, TotalNoBreakDec, OvertimeDec, TotalDec, StartDec, HourSchedule, Summary);

	const btn = $(this).find("button:eq(0)");
	const iconToggle = () => {
		const isCheckIcon = btn.find('.fa-check').length > 0;
		if (isCheckIcon)
			btn.html('<i class="fa fa-save"></i>');
		else
			btn.html('<i class="fa fa-check"></i>');
	};
	if (!returncode) {
		currentRow.css("backgroundColor", "");
		iconToggle();
		setTimeout(iconToggle, 2000);
		setHistory(false);
	} else {
		currentRow.css("backgroundColor", bs_washed_red);
		app_alert_message = "<b>Ai caramba!</b><br>An entry hasn't been saved!";
		setAlertMessage(app_alert_message + returncode);
	}
});

$($tableID).on('click', '.record-delete', function () {
	const currentRow = $(this).closest("tr");

	const key = currentRow.find("td:eq(0)").text(), // get current row 1st TD value
		TotalNoBreakDec = currentRow.find("td:eq(1)").text(), // get current row 2nd TD
		OvertimeDec = currentRow.find("td:eq(2)").text(), // get current row 3rd TD
		TotalDec = currentRow.find("td:eq(3)").text(), // get current row 4th TD
		StartDec = currentRow.find("td:eq(4)").text(), // get current row 5th TD
		HourSchedule = currentRow.find("td:eq(5)").text(), // get current row 6th TD
		Summary = currentRow.find("td:eq(6)").text(); // get current row 7th TD
	const record = "\nDelete history record with \n \nDate:                             " + key + "\nTotal Time No Break:    " + TotalNoBreakDec + "\nOvertime:                      " + OvertimeDec + "\nTotal Work Time:          " + TotalDec + "\nStart Time:                    " + StartDec + "\nHour Schedule:            " + HourSchedule + "\nSummary:\n" + Summary;

	const confirm_response = confirm(record);
	if (confirm_response == true) {
		//$(this).parents('tr').detach();  // This is replaced by setHistory()
		delete localStorage[key];
		setHistory(true);
	}
});

$("#edit_history_search").on("input", function () {
	const value = $(this).val().toLowerCase();
	$($tableID + " tr").filter(function () {
		$(this).toggle(
			$(this).text().toLowerCase().indexOf(value) > -1 || $(this).text().toLowerCase().indexOf("edit") > -1
		);
	});

	$("tr:visible").each(function (index, obj) {
		if (index % 2)
			$(this).addClass('visible-odd').removeClass('visible-even');
		else
			$(this).addClass('visible-even').removeClass('visible-odd');
	});
});