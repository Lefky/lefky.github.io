console.log("loaded introduction.js");

function startIntroduction(){
	document.getElementById('settingsmodalclosebutton').click();
	
	var new_element = document.createElement("div");
	new_element.id = "overlay";
	new_element.style.cssText = "z-index: 1090; background: rgba(0, 0, 0, 0.5); position: fixed; top: 0; right: 0; bottom: 0; left: 0;";
	document.body.appendChild(new_element);

	var introductioncontainer = document.createElement("div");
	introductioncontainer.id = "introductioncontainer";
	introductioncontainer.className = "row d-flex justify-content-center";
	document.getElementById("alertcontainer").appendChild(introductioncontainer);
	
	new_element = document.createElement("div");
	new_element.className = "alert alert-primary fade show my-4 w-33";
	new_element.style.cssText = "position: absolute; margin-left: 1rem; z-index: 1099;";
	new_element.setAttribute("role", "alert");
	new_element.innerHTML = 
		'<button type="button" onclick="stopIntroduction();" class="btn-close float-end" data-bs-dismiss="alert" aria-label="Close"></button>' +
		'<div id="app_introduction_message">Welcome to the working hours web app!</div>' +
		'<div class=" d-flex justify-content-end mt-4">' +
			'<button type="button" class="btn btn-sm btn-primary me-2" onclick="stopIntroduction();">Skip introduction</button>' +
			'<button type="button" class="btn btn-sm btn-primary" onclick=' +
					'"playIntroduction();' +
					'this.parentElement.parentElement.remove();' +
					'document.getElementById(\'arrow_inputarea\').style.removeProperty(\'display\');' +
					'document.getElementById(\'inputarea\').style.cssText = \'z-index: 1095; pointer-events: none;\';">' +
				'<span aria-hidden="true">Next</span>' +
			'</button>' +
		'</div>'
	document.getElementById("introductioncontainer").appendChild(new_element);
}

function playIntroduction() {
	// Dismiss the changes notification
	const alertNode = document.querySelector('#alertnotification');
	const alert = new bootstrap.Alert(alertNode)
	alert.close()

	new_element = document.createElement("div");
	new_element.id = "arrow_inputarea";
	new_element.style.cssText = "max-width: 50%; text-align: right; position: absolute; right: 30px; top: 45px; z-index: 1099; display: none;";
	new_element.innerHTML = 
		'<div class="alert alert-primary fade show text-start">' +
			'<button type="button" onclick="stopIntroduction();" class="btn-close float-end" data-bs-dismiss="alert" aria-label="Close"></button>' +
			'Here you can edit your time data.<br><br>Different sections can be shown / hidden through the settings (which you\'ll discover later).<br>The different fields are pretty self explanatory.<br>But let\'s go over the most important ones.' +
			'<div class="d-flex justify-content-end mt-4">' +
				'<button type="button" class="btn btn-sm btn-primary" onclick=' +
						'"this.parentElement.parentElement.parentElement.remove();' +
						'document.getElementById(\'arrow_inputarea_start_end\').style.removeProperty(\'display\');' +
						'document.getElementById(\'inputarea\').style.cssText = \'z-index: initial; pointer-events: initial;\';' +
						'document.getElementById(\'divstarttime\').style.cssText = \'background-color: #f8f9fa; z-index: 1095; pointer-events: none;\';' +
						'document.getElementById(\'divbreaktime\').style.cssText = \'background-color: #f8f9fa; z-index: 1095; pointer-events: none;\';' +
						'document.getElementById(\'divendtime\').style.cssText = \'background-color: #f8f9fa; z-index: 1095; pointer-events: none;\';">' +
					'<span aria-hidden="true">Next</span>' +
				'</button>' +
			'</div>' +
		'</div>'
	document.getElementById("introductioncontainer").appendChild(new_element);
	
	new_element = document.createElement("div");
	new_element.id = "arrow_inputarea_start_end";
	new_element.style.cssText = "max-width: 50%; text-align: right; position: absolute; right: 30px; top: 45px; z-index: 1099; display: none;";
	new_element.innerHTML = 
		'<div class="alert alert-primary fade show text-start">' +
			'<button type="button" onclick="stopIntroduction();" class="btn-close float-end" data-bs-dismiss="alert" aria-label="Close"></button>' +
			'These are pretty much the only editable fields.<br><br>Start time can be set automatically on opening the app (we\'ll cover parameter later).<br><br>Your break time can be entered in 2 modes: duration and timerange. The timerange mode can be triggered in the settings.<br>You can also set a default breaktime that will get filled in when opening the page.<br><br>The endtime will get filled in automatically based on the hour schedule you entered (let\'s get to that in a second) or by pressing the enter key. It\'s also possible to manually edit the endtime.' +
			'<div class="d-flex justify-content-end mt-4">' +
				'<button type="button" class="btn btn-sm btn-primary d-block" onclick=' +
						'"this.parentElement.parentElement.parentElement.remove();' +
						'document.getElementById(\'arrow_inputarea_total_hours\').style.removeProperty(\'display\');' +
						'document.getElementById(\'divstarttime\').style.cssText = \'background-color: inherit; z-index: initial; pointer-events: initial;\';' +
						'document.getElementById(\'divbreaktime\').style.cssText = \'background-color: inherit; z-index: initial; pointer-events: initial;\';' +
						'document.getElementById(\'divendtime\').style.cssText = \'background-color: inherit; z-index: initial; pointer-events: initial;\';' +
						'document.getElementById(\'divtotalnobreaktime\').style.cssText = \'background-color: #f8f9fa; z-index: 1095; pointer-events: none;\';' +
						'document.getElementById(\'divtotalhours\').style.cssText = \'background-color: #f8f9fa; z-index: 1095; pointer-events: none;\';">' +
					'<span aria-hidden="true">Next</span>' +
				'</button>' +
			'</div>' +
		'</div>'
	document.getElementById("introductioncontainer").appendChild(new_element);
	
	new_element = document.createElement("div");
	new_element.id = "arrow_inputarea_total_hours";
	new_element.style.cssText = "max-width: 50%; text-align: right; position: absolute; right: 30px; top: 45px; z-index: 1099; display: none;";
	new_element.innerHTML = 
		'<div class="alert alert-primary fade show text-start">' +
			'<button type="button" onclick="stopIntroduction();" class="btn-close float-end" data-bs-dismiss="alert" aria-label="Close"></button>' +
			'These sections display the total amount of time spent both in decimal and in a 24h time format.' +
			'<div class="d-flex justify-content-end mt-4">' +
				'<button type="button" class="btn btn-sm btn-primary" onclick=' +
						'"this.parentElement.parentElement.parentElement.remove();' +
						'document.getElementById(\'arrow_inputarea_overtime\').style.removeProperty(\'display\');' +
						'document.getElementById(\'divtotalnobreaktime\').style.cssText = \'background-color: inherit; z-index: initial; pointer-events: initial;\';' +
						'document.getElementById(\'divtotalhours\').style.cssText = \'background-color: inherit; z-index: initial; pointer-events: initial;\';' +
						'document.getElementById(\'divovertime\').style.cssText = \'background-color: #f8f9fa; z-index: 1095; pointer-events: none;\';">' +
					'<span aria-hidden="true">Next</span>' +
				'</button>' +
			'</div>' +
		'</div>'
	document.getElementById("introductioncontainer").appendChild(new_element);
	
	new_element = document.createElement("div");
	new_element.id = "arrow_inputarea_overtime";
	new_element.style.cssText = "max-width: 50%; text-align: right; position: absolute; right: 30px; top: 45px; z-index: 1099; display: none;";
	new_element.innerHTML = 
		'<div class="alert alert-primary fade show text-start">' +
			'<button type="button" onclick="stopIntroduction();" class="btn-close float-end" data-bs-dismiss="alert" aria-label="Close"></button>' +
			'Overtime in both decimal and in a 24h time format.<br><br>The dropdown allows you to select the time you work each day.<br>It also contains some guidelines for when you work for example 4/5 but split between 5 days.<br>If you actually work 4 out of 5 days, with 1 day of absence, you should probably set this to 7,6 or 8h.' +
			'<div class="d-flex justify-content-end mt-4">' +
				'<button type="button" class="btn btn-sm btn-primary" onclick=' +
						'"this.parentElement.parentElement.parentElement.remove();' +
						'document.getElementById(\'arrow_inputarea_total_weekly_overtime\').style.removeProperty(\'display\');' +
						'document.getElementById(\'divovertime\').style.cssText = \'background-color: inherit; z-index: initial; pointer-events: initial;\';' +
						'document.getElementById(\'divovertimeweekly\').style.cssText = \'background-color: #f8f9fa; z-index: 1095; pointer-events: none;\';' +
						'document.getElementById(\'divovertimetotal\').style.cssText = \'background-color: #f8f9fa; z-index: 1095; pointer-events: none;\';">' +
					'<span aria-hidden="true">Next</span>' +
				'</button>' +
			'</div>' +
		'</div>'
	document.getElementById("introductioncontainer").appendChild(new_element);
	
	
	new_element = document.createElement("div");
	new_element.id = "arrow_inputarea_total_weekly_overtime";
	new_element.style.cssText = "max-width: 50%; text-align: right; position: absolute; right: 30px; top: 45px; z-index: 1099; display: none;";
	new_element.innerHTML = 
		'<div class="alert alert-primary fade show text-start">' +
			'<button type="button" onclick="stopIntroduction();" class="btn-close float-end" data-bs-dismiss="alert" aria-label="Close"></button>' +
			'Your overtime total on a weekly basis and all-time.' +
			'<div class="d-flex justify-content-end mt-4">' +
				'<button type="button" class="btn btn-sm btn-primary" onclick=' +
						'"this.parentElement.parentElement.parentElement.remove();' +
						'document.getElementById(\'arrow_inputarea_history\').style.removeProperty(\'display\');' +
						'document.getElementById(\'divovertimeweekly\').style.cssText = \'background-color: inherit; z-index: initial; pointer-events: initial;\';' +
						'document.getElementById(\'divovertimetotal\').style.cssText = \'background-color: inherit; z-index: initial; pointer-events: initial;\';' +
						'document.getElementById(\'historycontainer\').style.cssText = \'background-color: #f8f9fa; z-index: 1095; pointer-events: none;\';">' +
					'<span aria-hidden="true">Next</span>' +
				'</button>' +
			'</div>' +
		'</div>'
	document.getElementById("introductioncontainer").appendChild(new_element);
	
	new_element = document.createElement("div");
	new_element.id = "arrow_inputarea_history";
	new_element.style.cssText = "max-width: 50%; text-align: right; position: absolute; right: 30px; top: 45px; z-index: 1099; display: none;";
	new_element.innerHTML = 
		'<div class="alert alert-primary fade show text-start">' +
			'<button type="button" onclick="stopIntroduction();" class="btn-close float-end" data-bs-dismiss="alert" aria-label="Close"></button>' +
			'The history of your registered days will be displayed here.' +
			'<div class="d-flex justify-content-end mt-4">' +
				'<button type="button" class="btn btn-sm btn-primary" onclick=' +
						'"this.parentElement.parentElement.parentElement.remove();' +
						'document.getElementById(\'arrow_inputarea_edit_history\').style.removeProperty(\'display\');' +
						'document.getElementById(\'historycontainer\').style.cssText = \'background-color: inherit; z-index: initial; pointer-events: initial;\';' +
						'document.getElementById(\'btnedithistory\').style.cssText = \'background-color: #f8f9fa; z-index: 1095; pointer-events: none;\';">' +
					'<span aria-hidden="true">Next</span>' +
				'</button>' +
			'</div>' +
		'</div>'
	document.getElementById("introductioncontainer").appendChild(new_element);
	
	new_element = document.createElement("div");
	new_element.id = "arrow_inputarea_edit_history";
	new_element.style.cssText = "max-width: 50%; text-align: right; position: absolute; right: 30px; top: 45px; z-index: 1099; display: none;";
	new_element.innerHTML = 
		'<div class="alert alert-primary fade show text-start">' +
			'<button type="button" onclick="stopIntroduction();" class="btn-close float-end" data-bs-dismiss="alert" aria-label="Close"></button>' +
			'By clicking this button a window will open where you can add, remove and edit the values of registered days.<br><br>USE THIS AT YOUR OWN RISK!' +
			'<div class="d-flex justify-content-end mt-4">' +
				'<button type="button" class="btn btn-sm btn-primary" onclick=' +
						'"this.parentElement.parentElement.parentElement.remove();' +
						'document.getElementById(\'arrow_inputarea_parameters\').style.removeProperty(\'display\');' +
						'document.getElementById(\'btnedithistory\').style.cssText = \'background-color: inherit; z-index: initial; pointer-events: initial;\';' +
						'document.getElementById(\'divparameters\').style.cssText = \'background-color: #f8f9fa; z-index: 1095; pointer-events: none;\';">' +
					'<span aria-hidden="true">Next</span>' +
				'</button>' +
			'</div>' +
		'</div>'
	document.getElementById("introductioncontainer").appendChild(new_element);
	
	new_element = document.createElement("div");
	new_element.id = "arrow_inputarea_parameters";
	new_element.style.cssText = "max-width: 50%; text-align: right; position: absolute; right: 30px; top: 45px; z-index: 1099; display: none;";
	new_element.innerHTML = 
		'<div class="alert alert-primary fade show text-start">' +
			'<button type="button" onclick="stopIntroduction();" class="btn-close float-end" data-bs-dismiss="alert" aria-label="Close"></button>' +
			'The first parameter makes you not save this day, this value will persist if you reopen the page.<br><br>The second parameter will set the endtime to the current time when you close / reload the page. This makes it possible to never having to manually enter anything as the page also sets the starttime automatically on opening.<br><br>The last parameter subtracts a custom number of minutes (by default 5 but editable in the settings) from the starttime.' +
			'<div class="d-flex justify-content-end mt-4">' +
				'<button type="button" class="btn btn-sm btn-primary" onclick=' +
						'"this.parentElement.parentElement.parentElement.remove();' +
						'document.getElementById(\'arrow_buttonarea\').style.removeProperty(\'display\');' +
						'document.getElementById(\'divparameters\').style.cssText = \'background-color: inherit; z-index: initial; pointer-events: initial;\';' +
						'document.getElementById(\'buttonarea\').style.cssText = \'background-color: #f8f9fa; z-index: 1095; pointer-events: none;\';">' +
					'<span aria-hidden="true">Next</span>' +
				'</button>' +
			'</div>' +
		'</div>'
	document.getElementById("introductioncontainer").appendChild(new_element);
	
	new_element = document.createElement("div");
	new_element.id = "arrow_buttonarea";
	new_element.style.cssText = "max-width: 50%; text-align: left; position: absolute; left: 30px; top: 45px; z-index: 1099; display: none;";
	new_element.innerHTML = 
		'<div class="alert alert-primary fade show text-start">' +
			'<button type="button" onclick="stopIntroduction();" class="btn-close float-end" data-bs-dismiss="alert" aria-label="Close"></button>' +
			'The green buttons edit the end time. You can add time based on your hourschedule (same as the enter button) or quickly fill in the current time.<br><br>Blue bottons edit the break field. You can reset, add 5 or 30 minutes or start a stopwatch.<br><br>The red button will reset the page to what it would be like when you first opened it today.' +
			'<div class="d-flex justify-content-end mt-4">' +
				'<button type="button" class="btn btn-sm btn-primary" onclick=' +
						'"this.parentElement.parentElement.parentElement.remove();' +
						'document.getElementById(\'arrow_footer_reporting\').style.removeProperty(\'display\');' +
						'document.getElementById(\'buttonarea\').style.cssText = \'background-color: inherit; z-index: initial; pointer-events: initial;\';' +
						'document.getElementById(\'footer\').style.cssText = \'z-index: 9999; pointer-events: none;\';' +
						'document.getElementById(\'footer_button_group\').style.cssText = \'background-color: white;\';">' +
					'<span aria-hidden="true">Next</span>' +
				'</button>' +
			'</div>' +
		'</div>'
	document.getElementById("introductioncontainer").appendChild(new_element);
	
	new_element = document.createElement("div");
	new_element.id = "arrow_footer_reporting";
	new_element.style.cssText = "max-width: 50%; text-align: right; position: absolute; right: 175px; bottom: 45px; z-index: 1099; display: none;";
	new_element.innerHTML = 
		'<div class="alert alert-primary fade show text-start">' +
			'<button type="button" onclick="stopIntroduction();" class="btn-close float-end" data-bs-dismiss="alert" aria-label="Close"></button>' +
			'This button houses access to different graphs and visuals on your personal time data.' +
			'<div class="d-flex justify-content-end mt-4">' +
				'<button type="button" class="btn btn-sm btn-primary" onclick=' +
						'"this.parentElement.parentElement.parentElement.remove();' +
						'document.getElementById(\'arrow_footer_about\').style.removeProperty(\'display\');">' +
					'<span aria-hidden="true">Next</span>' +
				'</button>' +
			'</div>' +
		'</div><br>' +
		'<i class="fas fa-arrow-down text-primary pulsate" style="font-size: 3rem; -webkit-text-stroke: 1px white;"></i>'
	document.getElementById("introductioncontainer").appendChild(new_element);
	
	new_element = document.createElement("div");
	new_element.id = "arrow_footer_about";
	new_element.style.cssText = "max-width: 50%; text-align: right; position: absolute; right: 130px; bottom: 45px; z-index: 1099; display: none;";
	new_element.innerHTML = 
		'<div class="alert alert-primary fade show text-start">' +
			'<button type="button" onclick="stopIntroduction();" class="btn-close float-end" data-bs-dismiss="alert" aria-label="Close"></button>' +
			'If you want to know more about the author, version or changelog click this button.' +
			'<div class="d-flex justify-content-end mt-4">' +
				'<button type="button" class="btn btn-sm btn-primary" onclick=' +
						'"this.parentElement.parentElement.parentElement.remove();' +
						'document.getElementById(\'arrow_footer_info\').style.removeProperty(\'display\');">' +
					'<span aria-hidden="true">Next</span>' +
				'</button>' +
			'</div>' +
		'</div><br>' +
		'<i class="fas fa-arrow-down text-primary pulsate" style="font-size: 3rem; -webkit-text-stroke: 1px white;"></i>'
	document.getElementById("introductioncontainer").appendChild(new_element);
	
	new_element = document.createElement("div");
	new_element.id = "arrow_footer_info";
	new_element.style.cssText = "max-width: 50%; text-align: right; position: absolute; right: 75px; bottom: 45px; z-index: 1099; display: none;";
	new_element.innerHTML = 
		'<div class="alert alert-primary fade show text-start">' +
			'<button type="button" onclick="stopIntroduction();" class="btn-close float-end" data-bs-dismiss="alert" aria-label="Close"></button>' +
			'Info on other useful applications and pieces of software can be found here.' +
			'<div class="d-flex justify-content-end mt-4">' +
				'<button type="button" class="btn btn-sm btn-primary" onclick=' +
						'"this.parentElement.parentElement.parentElement.remove();' +
						'document.getElementById(\'arrow_footer_settings\').style.removeProperty(\'display\');">' +
					'<span aria-hidden="true">Next</span>' +
				'</button>' +
			'</div>' +
		'</div><br>' +
		'<i class="fas fa-arrow-down text-primary pulsate" style="font-size: 3rem; -webkit-text-stroke: 1px white;"></i>'
	document.getElementById("introductioncontainer").appendChild(new_element);
	
	new_element = document.createElement("div");
	new_element.id = "arrow_footer_settings";
	new_element.style.cssText = "max-width: 50%; text-align: right; position: absolute; right: 20px; bottom: 45px; z-index: 1099; display: none;";
	new_element.innerHTML = 
		'<div class="alert alert-primary fade show text-start">' +
			'<button type="button" onclick="stopIntroduction();" class="btn-close float-end" data-bs-dismiss="alert" aria-label="Close"></button>' +
			'This is where you can change various settings.' +
			'<div class="d-flex justify-content-end mt-4">' +
				'<button type="button" class="btn btn-sm btn-primary" onclick=' +
						'"this.parentElement.parentElement.parentElement.remove();' +
						'document.getElementById(\'app_introduction\').style.removeProperty(\'display\');' +
						
						'document.getElementById(\'footer\').style.cssText = \'z-index: 1030; pointer-events: initial;\';' +
						'document.getElementById(\'footer_button_group\').style.cssText = \'background-color: initial;\';">' +
					'<span aria-hidden="true">Next</span>' +
				'</button>' +
			'</div>' +
		'</div><br>' +
		'<i class="fas fa-arrow-down text-primary pulsate" style="font-size: 3rem; -webkit-text-stroke: 1px white;"></i>'
	document.getElementById("introductioncontainer").appendChild(new_element);
	
	new_element = document.createElement("div");
	new_element.id = "app_introduction";
	new_element.className = "alert alert-primary fade show my-4 text-start w-33";
	new_element.style.cssText = "position: absolute; margin-left: 1rem; z-index: 1099; display: none;";
	new_element.innerHTML = 
		'<button type="button" onclick="stopIntroduction();" class="btn-close float-end" data-bs-dismiss="alert" aria-label="Close"></button>' +
		'<div id="app_introduction_message">You are good to go!<br><br>' +
		'Be sure to take a look at the <a href="#" onclick="$(\'#modalsettings\').modal(\'show\');">settings</a> to download and import sample data so you have a better understanding what everything looks like when actually using the application.<br><br>' +
		'But don\'t forget to delete the history again afterwards through the <a href="#" onclick="$(\'#modalsettings\').modal(\'show\');">settings</a>.</div>' +
		'<div class="d-flex justify-content-end mt-4">' +
			'<button type="button" class="btn btn-sm btn-primary" onclick="stopIntroduction()">' +
				'<span aria-hidden="true">Finish</span>' +
			'</button>' +
		'</div>'
	document.getElementById("introductioncontainer").appendChild(new_element);
}

function stopIntroduction() {
	$("#overlay").remove();
	$("#introductioncontainer").remove();
	document.getElementById("inputarea").style.cssText = "z-index: initial; pointer-events: initial;";
	document.getElementById("divstarttime").style.cssText = "background-color: inherit; z-index: initial; pointer-events: initial;";
	document.getElementById("divbreaktime").style.cssText = "background-color: inherit; z-index: initial; pointer-events: initial;";
	document.getElementById("divendtime").style.cssText = "background-color: inherit; z-index: initial; pointer-events: initial;";
	document.getElementById("divtotalnobreaktime").style.cssText = "background-color: inherit; z-index: initial; pointer-events: initial;";
	document.getElementById("divtotalhours").style.cssText = "background-color: inherit; z-index: initial; pointer-events: initial;";
	document.getElementById("divovertime").style.cssText = "background-color: inherit; z-index: initial; pointer-events: initial;";
	document.getElementById("divovertimeweekly").style.cssText = "background-color: inherit; z-index: initial; pointer-events: initial;";
	document.getElementById("divovertimetotal").style.cssText = "background-color: inherit; z-index: initial; pointer-events: initial;";
	document.getElementById("historycontainer").style.cssText = "background-color: inherit; z-index: initial; pointer-events: initial;";
	document.getElementById("btnedithistory").style.cssText = "background-color: inherit; z-index: initial; pointer-events: initial;";
	document.getElementById("divparameters").style.cssText = "background-color: inherit; z-index: initial; pointer-events: initial;";
	document.getElementById("buttonarea").style.cssText = "background-color: inherit; z-index: initial; pointer-events: initial;";
}