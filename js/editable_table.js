console.log("loaded editable_table.js");
// source: https://mdbootstrap.com/docs/jquery/tables/editable/

// Redraw table on opening modal
$('#modaledithistory').on('shown.bs.modal', function() {
	setHistory(true);
});

const $tableID = $('#edit_history_table');

const newTr = `
<tr class="hide">
  <td class="pt-3-half new_cell text-black-50" contenteditable="true" onfocus='clearPlaceholder(this)'>01-01-1900</td>
  <td class="pt-3-half new_cell text-black-50" contenteditable="true" onfocus='clearPlaceholder(this)'>Total Time No Break</td>
  <td class="pt-3-half new_cell text-black-50" contenteditable="true" onfocus='clearPlaceholder(this)'>Overtime</td>
  <td class="pt-3-half new_cell text-black-50" contenteditable="true" onfocus='clearPlaceholder(this)'>Total Work Time</td>
  <td class="pt-3-half new_cell text-black-50" contenteditable="true" onfocus='clearPlaceholder(this)'>Start Time</td>
  <td class="pt-3-half new_cell text-black-50" contenteditable="true" onfocus='clearPlaceholder(this)'>Hour Schedule</td>
  <td>
	<span class="record-save">
		<a href="#" class="text-success fontsize150 my-0 mx-2 waves-effect waves-light">
			<i class="fa fa-save"></i>
		</a>
	</span> 
	<span class="record-delete">
		<a href="#" class="text-danger fontsize150 my-0 mx-2 waves-effect waves-light">
			<i class="fa fa-trash"></i>
		</a>
	</span>
  </td>
</tr>`;

$('.table-add').on('click', 'button', function() {
	$('#edit_history_table_body').prepend(newTr);
});

$('.table-save-all').on('click', 'button', function() {
	var table = document.getElementById('edit_history_table_body');

	const iconToggle = (abtn, state) => {
		if (state == "save") {
			if (abtn.tagName == "BUTTON") {
				abtn.innerHTML = '<i class="fa fa-save"></i> Save all';
			} else {
				abtn.innerHTML = '<i class="fa fa-save"></i>';
			}
		} else if (state == "check") {
			abtn.innerHTML = '<i class="fa fa-check"></i>';
		}
	}

	// loop through each row of the table.
	for (row = 0; row < table.rows.length; row++) {
		var currentRow = table.rows.item(row);

		var key = currentRow.cells.item(0).innerHTML;
		var TotalNoBreakDec = parseFloat(currentRow.cells.item(1).innerHTML);
		var OvertimeDec = parseFloat(currentRow.cells.item(2).innerHTML);
		var TotalDec = parseFloat(currentRow.cells.item(3).innerHTML);
		var StartDec = parseFloat(currentRow.cells.item(4).innerHTML);
		var HourSchedule = parseFloat(currentRow.cells.item(5).innerHTML);

		var returncode = save_row(key, TotalNoBreakDec, OvertimeDec, TotalDec, StartDec, HourSchedule);
	
		if (returncode == 0) {
			const btn = currentRow.getElementsByClassName('record-save')[0].firstElementChild;
			iconToggle(btn, "check");
			setTimeout(() => { iconToggle(btn, "save") }, 2000);	
		} else {
			currentRow.style.backgroundColor = "#ffcccc";
			app_alert_message = "<b>Ai caramba!</b> An entry hasn't been saved!";
			setAlertMessage(app_alert_message);
		}
	}

	const btn_all = document.getElementsByClassName('table-save-all')[0].firstElementChild;
	iconToggle(btn_all, "check");
	setTimeout(() => { iconToggle(btn_all, "save") }, 2000);

	setHistory(false);
});

$('.table-delete-all').on('click', 'button', function() {
	deleteHistory();
});

function clearPlaceholder(cell) {
	if (cell.classList.contains("text-black-50")) {
		cell.innerHTML = "";
		cell.classList.remove("text-black-50");
	}
}

function save_row(key, TotalNoBreakDec, OvertimeDec, TotalDec, StartDec, HourSchedule){
	const isnumber = /^-?[0-9]+.*[0-9]*$/;
	if (!testDateFormat(key)) {
		alert("\nDate for date " + key +"\n\nis not in the DD-MM-YYYY format.\nPlease correct your entry and try again.");
		return 1;
	}
	if (!isnumber.test(TotalNoBreakDec)) {
		alert("\nTotal Time No Break for date " + key +"\n\nis not a (decimal) number.\nPlease correct your entry and try again.");
		return 1;
	}
	if (!isnumber.test(OvertimeDec)) {
		alert("\nOvertime for date " + key +"\n\nis not a (decimal) number.\nPlease correct your entry and try again.");
		return 1;
	}
	if (!isnumber.test(TotalDec)) {
		alert("\nTotal Work Time for date " + key +"\n\nis not a (decimal) number.\nPlease correct your entry and try again.");
		return 1;
	}
	if (!isnumber.test(StartDec)) {
		alert("\nStart Time for date " + key +"\n\nis not a (decimal) number.\nPlease correct your entry and try again.");
		return 1;
	}
	if (!isnumber.test(HourSchedule)) {
		alert("\Hour Schedule for date " + key +"\n\nis not a (decimal) number.\nPlease correct your entry and try again.");
		return 1;
	}

	var timeinfo = '{"TotalNoBreakDec": "' + TotalNoBreakDec.toFixed(2) + '", "OvertimeDec": "' + OvertimeDec.toFixed(2) + '", "TotalDec": "' + TotalDec.toFixed(2) + '", "StartDec": "' + StartDec.toFixed(2) + '", "HourSchedule": "' + HourSchedule.toFixed(2) + '"}';
	localStorage.setItem(key, timeinfo);
	return 0;
}

$tableID.on('click', '.record-save', function() {
	var currentRow = $(this).closest("tr");

	var key = currentRow.find("td:eq(0)").text(); // get current row 1st TD value
	var TotalNoBreakDec = parseFloat(currentRow.find("td:eq(1)").text()); // get current row 2nd TD
	var OvertimeDec = parseFloat(currentRow.find("td:eq(2)").text()); // get current row 3rd TD
	var TotalDec = parseFloat(currentRow.find("td:eq(3)").text()); // get current row 4th TD
	var StartDec = parseFloat(currentRow.find("td:eq(4)").text()); // get current row 5th TD
	var HourSchedule = parseFloat(currentRow.find("td:eq(5)").text()); // get current row 6th TD

	var returncode = save_row(key, TotalNoBreakDec, OvertimeDec, TotalDec, StartDec, HourSchedule);

	var btn = $(this).find("a:eq(0)");
	const iconToggle = () => {
		const isCheckIcon = btn.find('.fa-check').length > 0;
		if (isCheckIcon) {
			btn.html('<i class="fa fa-save fontsize150"></i>')
		} else {
			btn.html('<i class="fa fa-check fontsize150"></i>')
		}
	}
	if (returncode == 0) {
		iconToggle();
		setTimeout(iconToggle, 2000);
		setHistory(false);
	}
});

$tableID.on('click', '.record-delete', function() {
	var currentRow = $(this).closest("tr");

	var key = currentRow.find("td:eq(0)").text(); // get current row 1st TD value
	var TotalNoBreakDec = currentRow.find("td:eq(1)").text(); // get current row 2nd TD
	var OvertimeDec = currentRow.find("td:eq(2)").text(); // get current row 3rd TD
	var TotalDec = currentRow.find("td:eq(3)").text(); // get current row 4th TD
	var StartDec = currentRow.find("td:eq(4)").text(); // get current row 5th TD
	var HourSchedule = currentRow.find("td:eq(5)").text(); // get current row 6th TD
	var record = "\nDelete history record with \n \nDate:                             " + key + "\nTotal Time No Break:    " + TotalNoBreakDec + "\nOvertime:                      " + OvertimeDec + "\nTotal Work Time:          " + TotalDec + "\nStart Time:                    " + StartDec  + "\nHour Schedule:            " + HourSchedule;

	var confirm_response = confirm(record);
	if (confirm_response == true) {
		//$(this).parents('tr').detach();  // This is replaced by setHistory()
		delete localStorage[key];
		setHistory(true);
	}
});