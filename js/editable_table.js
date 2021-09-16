console.log("loaded editable_table.js");
// source: https://mdbootstrap.com/docs/jquery/tables/editable/

// Redraw table on opening modal
$('#modaledithistory').on('shown.bs.modal', function() {
	setHistory(true);
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
	var returncode, 
		app_alert_message = "";
	for (row = 0; row < table.rows.length; row++) {
		var currentRow = table.rows.item(row);

		var key = currentRow.cells.item(0).innerHTML;
		var TotalNoBreakDec = currentRow.cells.item(1).innerHTML;
		var OvertimeDec = currentRow.cells.item(2).innerHTML;
		var TotalDec = currentRow.cells.item(3).innerHTML;
		var StartDec = currentRow.cells.item(4).innerHTML;
		var HourSchedule = currentRow.cells.item(5).innerHTML;

		returncode = save_row(key, TotalNoBreakDec, OvertimeDec, TotalDec, StartDec, HourSchedule);
	
		if (!returncode) {
			const btn = currentRow.getElementsByClassName('record-save')[0].firstElementChild;
			currentRow.style.backgroundColor = "";
			iconToggle(btn, "check");
			setTimeout(() => { iconToggle(btn, "save") }, 2000);	
		} else {
			currentRow.style.backgroundColor = "#ffcccc";
			app_alert_message = app_alert_message + returncode;
		}
	}
	
	if (app_alert_message) {
		app_alert_message = "<b>Ai caramba!</b> One or multiple entries haven't been saved!" + app_alert_message;
		setAlertMessage(app_alert_message);
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
	const isnumber = /^(?<=^| )(-?)\d+(\.\d+)?(?=$| )$/;
	var error_message = "";

	if (!testDateFormat(key)) {
		error_message = error_message + "<br><br>Date for date " + key +"<br><br>is not in the DD-MM-YYYY format.";
	}
	if (!isnumber.test(TotalNoBreakDec) && TotalNoBreakDec.toLowerCase() != "correction") {
		error_message = error_message + "<br><br>Total Time No Break for date " + key +"<br><br>is not a (decimal) number.";
	}
	if (!isnumber.test(OvertimeDec)) {
		error_message = error_message + "<br><br>Overtime for date " + key +"<br><br>is not a (decimal) number.";
	}
	if (!isnumber.test(TotalDec) && TotalDec.toLowerCase() != "correction") {
		error_message = error_message + "<br><br>Total Work Time for date " + key +"<br><br>is not a (decimal) number.";
	}
	if (!isnumber.test(StartDec) && StartDec.toLowerCase() != "correction") {
		error_message = error_message + "<br><br>Start Time for date " + key +"<br><br>is not a (decimal) number.";
	}
	if (!isnumber.test(HourSchedule) && HourSchedule.toLowerCase() != "correction") {
		error_message = error_message + "<br><br>Hour Schedule for date " + key +"<br><br>is not a (decimal) number.";
	}

	if (error_message == "") {
		var timeinfo = '{"TotalNoBreakDec": "' + (TotalNoBreakDec.toLowerCase() != "correction" ? parseFloat(TotalNoBreakDec).toFixed(2) : "correction") + '", "OvertimeDec": "' + parseFloat(OvertimeDec).toFixed(2) + '", "TotalDec": "' + (TotalDec.toLowerCase() != "correction" ? parseFloat(TotalDec).toFixed(2) : "correction") + '", "StartDec": "' + (StartDec.toLowerCase() != "correction" ? parseFloat(StartDec).toFixed(2) : "correction") + '", "HourSchedule": "' + (HourSchedule.toLowerCase() != "correction" ? parseFloat(HourSchedule).toFixed(2) : "correction") + '"}';
		localStorage.setItem(key, timeinfo);
	} else {
		error_message = error_message + "<br><br>Please correct your entry and try again.";
		return error_message;
	}
	return;
}

$($tableID).on('click', '.record-save', function() {
	var currentRow = $(this).closest("tr");

	var key = currentRow.find("td:eq(0)").text(); // get current row 1st TD value
	var TotalNoBreakDec = currentRow.find("td:eq(1)").text(); // get current row 2nd TD
	var OvertimeDec = currentRow.find("td:eq(2)").text(); // get current row 3rd TD
	var TotalDec = currentRow.find("td:eq(3)").text(); // get current row 4th TD
	var StartDec = currentRow.find("td:eq(4)").text(); // get current row 5th TD
	var HourSchedule = currentRow.find("td:eq(5)").text(); // get current row 6th TD

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
	if (!returncode) {
		currentRow.css("backgroundColor", "");
		iconToggle();
		setTimeout(iconToggle, 2000);
		setHistory(false);
	} else {
		currentRow.css("backgroundColor", "#ffcccc");
		app_alert_message = "<b>Ai caramba!</b> An entry hasn't been saved!";
		setAlertMessage(app_alert_message + returncode);
	}
});

$($tableID).on('click', '.record-delete', function() {
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

$("#edit_history_search").on("input", function () {
	var value = $(this).val().toLowerCase();
	$($tableID + " tr").filter(function () {
		$(this).toggle(
			$(this).text().toLowerCase().indexOf(value) > -1 || $(this).text().toLowerCase().indexOf("edit") > -1
		)
	});
});