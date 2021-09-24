console.log("loaded leaves.js");

// source: https://codepen.io/uurrnn/pen/Kuylr?editors=1100

var startedLeaves = false;
var interval = "";

function startLeaves(){
	loadLeavesCSS();
	
	startedLeaves = true;
	
	var leaves_div = document.createElement("div");   
	leaves_div.id = "leaves";
	
	for (var i = 0; i <= 15; i++){
		var leaves_element = document.createElement("i");
		leaves_element.id = "leaf " + i;
		leaves_div.appendChild(leaves_element);
	}
	
	document.getElementsByTagName("body")[0].appendChild(leaves_div);
	
	showLeafMessage();

	playNotificationSound();
	document.title = "Done for the day!";

	interval = setInterval(function () {
		if (document.title == "Working hours") {
			document.title = "Done for the day!";
		} else {
			document.title = "Working hours";
		}
	}, 1000);
}

function stopLeaves(){
	startedLeaves = false;	
	document.getElementById("leaves_alert").remove();
	document.getElementById("leaves").remove();

	clearInterval(interval);
	document.title = "Working hours";
}

function loadLeavesCSS(){
	var fileref=document.createElement("link");
		fileref.setAttribute("rel", "stylesheet");
		fileref.setAttribute("type", "text/css");
		fileref.setAttribute("href", "css/leaves.css");
	document.getElementsByTagName("head")[0].appendChild(fileref);
	
	var fileref=document.createElement("link");
		fileref.setAttribute("rel", "stylesheet");
		fileref.setAttribute("type", "text/css");
		fileref.setAttribute("href", "css/font-awsome-custom-animations.css");
	document.getElementsByTagName("head")[0].appendChild(fileref);
}

function showLeafMessage(){
	var alertMessage = document.createElement("div");
	alertMessage.id = "leaves_alert";
	alertMessage.classList = "alert alert-success alert-dismissible fade show mr-1";
	alertMessage.setAttribute("role", "alert");
	alertMessage.setAttribute("style", "position: absolute; top: 4rem; right: 4rem; z-index: 2; font-size: 2rem;");
	
	alertMessage.innerHTML = "<audio id='audioNotification' src='sounds/pristine-609.mp3' muted></audio><span><i class='fas fa-glass-cheers faa-shake animated'></i> Time to 'LEAF' work <i class='far fa-smile-wink'></i></span>" + "<button type='button' class='btn-close' style='font-size: 13px' data-bs-dismiss='alert' aria-label='Close'></button>";
	
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