console.log("loaded leaves.js");

/*global $, now, getEnd, createNotification */
/*eslint no-undef: "error"*/

// source: https://codepen.io/uurrnn/pen/Kuylr?editors=1100

let startedLeaves = false,
	interval = "",
	manualStoppedLeaves = false;

function intervalListener() {
	if (getEnd() <= now() && !startedLeaves && !manualStoppedLeaves)
		startLeaves();
	else if (getEnd() > now() && startedLeaves)
		stopLeaves();
}
setInterval(intervalListener, 1 * 10000); // (Every 5) * (60 * 1000 milliseconds = 60 seconds = 1 minute)

function startLeaves() {
	loadLeavesCSS();

	startedLeaves = true;

	const leaves_div = document.createElement("div");
	leaves_div.id = "leaves";

	for (let i = 0; i <= 15; i++) {
		const leaves_element = document.createElement("i");
		leaves_element.id = "leaf " + i;
		leaves_div.appendChild(leaves_element);
	}

	document.getElementsByTagName("body")[0].appendChild(leaves_div);

	const bb8_div = document.createElement("div");
	bb8_div.classList = "bb8";
	bb8_div.id = "bb8";
	document.getElementsByTagName("body")[0].appendChild(bb8_div);

	showLeafMessage();
	createNotification("Done for the day!", "You did your time. Time to drink!");
	playNotificationSound();
	$(".bb8").css({ animation: "moving 3s infinite linear" });

	document.title = "Done for the day!";

	interval = setInterval(function () {
		if (document.title == "Working hours")
			document.title = "Done for the day!";
		else
			document.title = "Working hours";
	}, 1000);
}

function stopLeaves() {
	startedLeaves = false;
	document.getElementById("leaves_alert").remove();
	document.getElementById("leaves").remove();
	document.getElementById("bb8").remove();

	clearInterval(interval);
	document.title = "Working hours";
}

function loadLeavesCSS() {
	let fileref = document.createElement("link");
	fileref.setAttribute("rel", "stylesheet");
	fileref.setAttribute("type", "text/css");
	fileref.setAttribute("href", "css/leaves.css");
	document.getElementsByTagName("head")[0].appendChild(fileref);

	fileref = document.createElement("link");
	fileref.setAttribute("rel", "stylesheet");
	fileref.setAttribute("type", "text/css");
	fileref.setAttribute("href", "css/bb8.css");
	document.getElementsByTagName("head")[0].appendChild(fileref);

	fileref = document.createElement("link");
	fileref.setAttribute("rel", "stylesheet");
	fileref.setAttribute("type", "text/css");
	fileref.setAttribute("href", "css/font-awsome-custom-animations.css");
	document.getElementsByTagName("head")[0].appendChild(fileref);
}

function showLeafMessage() {
	const alertMessage = document.createElement("div");
	alertMessage.id = "leaves_alert";
	alertMessage.classList = "alert alert-success alert-dismissible fade show mr-1";
	alertMessage.setAttribute("role", "alert");
	alertMessage.setAttribute("style", "position: absolute; top: 4rem; right: 4rem; z-index: 2; font-size: 2rem;");

	alertMessage.innerHTML = "<audio id='audioNotification' src='sounds/pristine-609.mp3' muted></audio><span><i class='fas fa-glass-cheers faa-shake animated'></i> Time to 'LEAF' work <i class='far fa-smile-wink'></i></span>" + "<button type='button' class='btn-close' style='font-size: 13px' onclick='stopLeaves(); manualStoppedLeaves = true;' data-bs-dismiss='alert' aria-label='Close'></button>";

	document.getElementsByTagName("body")[0].appendChild(alertMessage);
}

function playNotificationSound() {
	// https://notificationsounds.com/

	// Doesn't launch without user interaction because of browsers not supporting autoplay sounds anymore
	document.getElementById('audioNotification').muted = false;
	document.getElementById('audioNotification').play();

	/*
		var audio = new Audio('sounds/pristine-609.mp3');

		setTimeout(() => {
			audio.play();
		}, 500)
	*/
	/*
		let audioPlay = document.getElementById('audioNotification')

		audioPlay.play()

		setTimeout(() => {
			audioPlay.pause()
			audioPlay.load()
		}, 100)
	*/
}
