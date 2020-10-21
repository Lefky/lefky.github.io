// source: https://mdbootstrap.com/docs/jquery/tables/editable/
const $tableID = $('#edit_history_table');

const newTr = `
<tr class="hide">
  <td class="pt-3-half new_cell text-black-50" contenteditable="true" onclick='clearPlaceholder(this)'>01-01-1900</td>
  <td class="pt-3-half new_cell text-black-50" contenteditable="true" onclick='clearPlaceholder(this)'>Total Time No Break</td>
  <td class="pt-3-half new_cell text-black-50" contenteditable="true" onclick='clearPlaceholder(this)'>Overtime</td>
  <td class="pt-3-half new_cell text-black-50" contenteditable="true" onclick='clearPlaceholder(this)'>Total Work Time</td>
  <td class="pt-3-half new_cell text-black-50" contenteditable="true" onclick='clearPlaceholder(this)'>Start Time</td>
  <td class="pt-3-half new_cell text-black-50" contenteditable="true" onclick='clearPlaceholder(this)'>Hour Schedule</td>
  <td>
	<span class="table-save">
		<button type="button" class="btn btn-outline-success btn-rounded btn-sm my-0 waves-effect waves-light">
			<i class="far fa-save"></i>
		</button>
	</span> 
	<span class="table-remove">
		<button type="button" class="btn btn-outline-danger btn-rounded btn-sm my-0 waves-effect waves-light">
			<i class="far fa-trash-alt"></i>
		</button>
	</span>
  </td>
</tr>`;

$('.table-add').on('click', 'i', () => {
	$('#edit_history_table_body').prepend(newTr);
});

function clearPlaceholder(cell) {
	if (cell.classList.contains("text-black-50")) {
		cell.innerHTML = "";
		cell.classList.remove("text-black-50");
	}
}

$tableID.on('click', '.table-save', function() {
	var currentRow = $(this).closest("tr");

	var key = currentRow.find("td:eq(0)").text(); // get current row 1st TD value
	var TotalNoBreakDec = currentRow.find("td:eq(1)").text(); // get current row 2nd TD
	var OvertimeDec = currentRow.find("td:eq(2)").text(); // get current row 3rd TD
	var TotalDec = currentRow.find("td:eq(3)").text(); // get current row 4th TD
	var StartDec = currentRow.find("td:eq(4)").text(); // get current row 5th TD
	var HourSchedule = currentRow.find("td:eq(5)").text(); // get current row 6th TD

	const userKeyRegExp = /^[0-9]{2}-[0-9]{2}-[0-9]{4}/;
	const isnumber = /^-?[0-9]+.*[0-9]*$/;
	if (!userKeyRegExp.test(key)) {
		alert("\nDate \n\nis not in the DD-MM-YYYY format.\nPlease correct your entry and try again.");
		return;
	}
	if (!isnumber.test(TotalNoBreakDec)) {
		alert("\nTotal Time No Break \n\nis not a (decimal) number.\nPlease correct your entry and try again.");
		return;
	}
	if (!isnumber.test(OvertimeDec)) {
		alert("\nOvertime \n\nis not a (decimal) number.\nPlease correct your entry and try again.");
		return;
	}
	if (!isnumber.test(TotalDec)) {
		alert("\nTotal Work Time \n\nis not a (decimal) number.\nPlease correct your entry and try again.");
		return;
	}
	if (!isnumber.test(StartDec)) {
		alert("\nStart Time \n\nis not a (decimal) number.\nPlease correct your entry and try again.");
		return;
	}
	if (!isnumber.test(HourSchedule)) {
		alert("\Hour Schedule \n\nis not a (decimal) number.\nPlease correct your entry and try again.");
		return;
	}

	var timeinfo = '{"TotalNoBreakDec": "' + TotalNoBreakDec + '", "OvertimeDec": "' + OvertimeDec + '", "TotalDec": "' + TotalDec + '", "StartDec": "' + StartDec + '", "HourSchedule": "' + HourSchedule + '"}';
	localStorage.setItem(key, timeinfo);

	var btn = $(this).find("button:eq(0)");
	const iconToggle = () => {
		const isCheckIcon = btn.find('.fa-check').length > 0;
		if (isCheckIcon) {
			btn.html('<i class="far fa-save"></i>')
		} else {
			btn.html('<i class="fas fa-check"></i>')
		}
	}
	iconToggle();
	setTimeout(iconToggle, 2000);

	setHistory(false);
});

$tableID.on('click', '.table-remove', function() {
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