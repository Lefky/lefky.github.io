console.log("loaded animations.js");

/*global $, now, getEnd, createNotification */
/*eslint no-undef: "error"*/

let startedAnimation = false,
	animation_list = ["leaves_div", "bb8", "superman", "carlton_dance", "pikachu", "super_mario", "ghosts", "whale", "stormtrooper", "rocket", "sonic_div"],
	//animation_list = ["sonic_div"],
	randomAnimation = animation_list[Math.floor(Math.random() * animation_list.length)],
	interval = "",
	manualStoppedLeaves = false;

//startLeaves(); // Start animation on page load

function intervalListener() {
	if (getEnd() <= now() && !startedAnimation && !manualStoppedLeaves)
		startLeaves();
	else if (getEnd() > now() && startedAnimation)
		stopLeaves();
}
setInterval(intervalListener, 1 * 10000); // (Every 5) * (60 * 1000 milliseconds = 60 seconds = 1 minute)

function startLeaves() {
	startedAnimation = true;

	loadAnimationCSS(randomAnimation);

	createNotification("Done for the day!", "You did your time. Time to drink!");
	playNotificationSound();
	document.title = "Done for the day!";

	interval = setInterval(function () {
		if (document.title == "Working hours")
			document.title = "Done for the day!";
		else
			document.title = "Working hours";
	}, 1000);
}

function stopLeaves() {
	startedAnimation = false;
	document.getElementById("animation_alert").remove();
	document.getElementById(randomAnimation).remove();

	clearInterval(interval);
	document.title = "Working hours";
}

function loadAnimationCSS(selected_animation) {
	let fileref = document.createElement("link");
	fileref.setAttribute("rel", "stylesheet");
	fileref.setAttribute("type", "text/css");
	fileref.setAttribute("href", "css/font-awsome-custom-animations.css");
	document.getElementsByTagName("head")[0].appendChild(fileref);

	if (selected_animation === "leaves_div") {
		let fileref = document.createElement("link");
		fileref.setAttribute("rel", "stylesheet");
		fileref.setAttribute("type", "text/css");
		fileref.setAttribute("href", "css/leaves.css");
		document.head.appendChild(fileref);

		const leaves_div = document.createElement("div");
		leaves_div.id = "leaves";
		for (let i = 0; i <= 15; i++) {
			const leaves_element = document.createElement("i");
			leaves_element.id = "leaf " + i;
			leaves_div.appendChild(leaves_element);
		}
		document.getElementsByTagName("body")[0].appendChild(leaves_div);

		showAnimationMessage("<i class='fas fa-glass-cheers faa-shake animated'></i> Time to 'LEAF' work <i class='far fa-smile-wink'></i>");

	} else if (selected_animation === "bb8") {
		fileref = document.createElement("link");
		fileref.setAttribute("rel", "stylesheet");
		fileref.setAttribute("type", "text/css");
		fileref.setAttribute("href", "css/bb8.css");
		document.head.appendChild(fileref);

		const bb8_div = document.createElement("div");
		bb8_div.classList = "bb8";
		bb8_div.id = "bb8";
		document.getElementsByTagName("body")[0].appendChild(bb8_div);

		showAnimationMessage("\"Beeep boop beep beep boop beeeeeep\" - BB8");

	} else if (selected_animation === "superman") {
		fileref = document.createElement("link");
		fileref.setAttribute("rel", "stylesheet");
		fileref.setAttribute("type", "text/css");
		fileref.setAttribute("href", "css/superman.css");
		document.head.appendChild(fileref);

		const superman_div = document.createElement("div");
		superman_div.classList = "superman";
		superman_div.id = "superman";
		document.getElementsByTagName("body")[0].appendChild(superman_div);

		showAnimationMessage("Enjoy the rest of your SUPER day! <i class='fas fa-mask faa-vertical animated'></i>");

	} else if (selected_animation === "carlton_dance") {
		const fileref = document.createElement("link");
		fileref.setAttribute("rel", "stylesheet");
		fileref.setAttribute("type", "text/css");
		fileref.setAttribute("href", "css/carlton_dance.css");
		document.head.appendChild(fileref);

		const carlton_dance_div = document.createElement("div");
		carlton_dance_div.className = "carlton_dance";
		carlton_dance_div.id = "carlton_dance";

		const screenDiv = document.createElement("div");
		screenDiv.className = "screen";

		const ul = document.createElement("ul");
		ul.className = "dance-animation";

		for (let i = 1; i <= 11; i++) {
			const li = document.createElement("li");
			li.className = `dance-frame dance-animation--dancer${i}`;
			ul.appendChild(li);
		}

		carlton_dance_div.appendChild(screenDiv);
		carlton_dance_div.appendChild(ul);
		document.body.appendChild(carlton_dance_div);

		showAnimationMessage("<i class='fas fa-music faa-tada animated'></i> <a href='https://www.youtube.com/watch?v=jKlxjbhB9HE' style='color: inherit; text-decoration: inherit;' onmouseover=\"this.style.color=bs_blue\" onmouseout=\"this.style.color='inherit'\">It's not unusual to see me cry-yyyyy-yyyy, I wanna dieeeeee</a> <i class='fas fa-music faa-tada animated'></i>");

	} else if (selected_animation === "pikachu") {
		fileref = document.createElement("link");
		fileref.setAttribute("rel", "stylesheet");
		fileref.setAttribute("type", "text/css");
		fileref.setAttribute("href", "css/pikachu.css");
		document.head.appendChild(fileref);

		const pikachu_div = document.createElement("div");
		pikachu_div.classList = "pikachu";
		pikachu_div.id = "pikachu";
		document.getElementsByTagName("body")[0].appendChild(pikachu_div);

		showAnimationMessage("Pika Pika! <i class='fas fa-bolt faa-pulse animated'></i> Step into the light and go be awesome outside!");

	} else if (selected_animation === "super_mario") {
		fileref = document.createElement("link");
		fileref.setAttribute("rel", "stylesheet");
		fileref.setAttribute("type", "text/css");
		fileref.setAttribute("href", "css/super_mario.css");
		document.head.appendChild(fileref);

		const super_mario_div = document.createElement("div");
		super_mario_div.classList = "super_mario";
		super_mario_div.id = "super_mario";
		document.getElementsByTagName("body")[0].appendChild(super_mario_div);

		showAnimationMessage("It's-a me, Mario! <i class='fas fa-star faa-pulse animated'></i> Let's-a go HOME!");

	} else if (selected_animation === "ghosts") {
		fileref = document.createElement("link");
		fileref.setAttribute("rel", "stylesheet");
		fileref.setAttribute("type", "text/css");
		fileref.setAttribute("href", "css/ghosts.css");
		document.head.appendChild(fileref);

		const ghosts_div = document.createElement("div");
		ghosts_div.classList = "ghosts";
		ghosts_div.id = "ghosts";
		document.getElementsByTagName("body")[0].appendChild(ghosts_div);

		for (let i = 1; i <= 20; i++) {
			const boo_div = document.createElement("div");
			boo_div.classList = "boo";
			boo_div.id = "boo" + i;
			ghosts_div.appendChild(boo_div);
		}

		showAnimationMessage("Boo! <i class='fas fa-ghost faa-pulse animated'></i> Your haunting hours are over. Time to float on home!");

	} else if (selected_animation === "whale") {
		fileref = document.createElement("link");
		fileref.setAttribute("rel", "stylesheet");
		fileref.setAttribute("type", "text/css");
		fileref.setAttribute("href", "css/whale.css");
		document.head.appendChild(fileref);

		const whale_div = document.createElement("div");
		whale_div.id = "whale";
		document.getElementsByTagName("body")[0].appendChild(whale_div);

		const animal_div = document.createElement("div");
		animal_div.classList = "whale";
		const fountain_div = document.createElement("div");
		fountain_div.classList = "fountain";
		animal_div.appendChild(fountain_div);
		whale_div.appendChild(animal_div);

		const ocean_div = document.createElement("div");
		ocean_div.classList = "ocean";
		ocean_div.id = "ocean";
		for (let i = 1; i <= 4; i++) {
			const wave_div = document.createElement("div");
			wave_div.classList = "wave";
			wave_div.id = "wave" + i;
			ocean_div.appendChild(wave_div);
		}
		whale_div.appendChild(ocean_div);

		showAnimationMessage("Whale done! <i class='fas fa-whale faa-bounce animated'></i> Go ahead and ride the wave home! <i class='fas fa-water faa-horizontal animated'></i>");

	} else if (selected_animation === "stormtrooper") {
		fileref = document.createElement("link");
		fileref.setAttribute("rel", "stylesheet");
		fileref.setAttribute("type", "text/css");
		fileref.setAttribute("href", "css/stormtrooper.css");
		document.head.appendChild(fileref);

		const stormtrooper_div = document.createElement("div");
		stormtrooper_div.classList = "stormtrooper";
		stormtrooper_div.id = "stormtrooper";
		document.getElementsByTagName("body")[0].appendChild(stormtrooper_div);

		showAnimationMessage("The Force is weak with this one... until 9 AM tomorrow! <i class='fas fa-battery-quarter faa-flash animated'></i>");

	} else if (selected_animation === "rocket") {
		fileref = document.createElement("link");
		fileref.setAttribute("rel", "stylesheet");
		fileref.setAttribute("type", "text/css");
		fileref.setAttribute("href", "css/rocket.css");
		document.head.appendChild(fileref);

		const rocket_div = document.createElement("div");
		rocket_div.classList = "rocket";
		rocket_div.id = "rocket";
		document.getElementsByTagName("body")[0].appendChild(rocket_div);

		showAnimationMessage("Ready for launch! <i class='fas fa-rocket faa-pulse animated'></i> Let's go see the alien(s) at home :p");

		fileref = document.createElement("script");
		fileref.setAttribute("type", "text/javascript");
		fileref.setAttribute("src", "js/rocket.js");
		document.head.appendChild(fileref);

	} else if (selected_animation === "sonic_div") {
		fileref = document.createElement("link");
		fileref.setAttribute("rel", "stylesheet");
		fileref.setAttribute("type", "text/css");
		fileref.setAttribute("href", "css/sonic.css");
		document.head.appendChild(fileref);

		const sonic_div = document.createElement("div");
		sonic_div.classList = "sonic_div";
		sonic_div.id = "sonic_div";
		document.getElementsByTagName("body")[0].appendChild(sonic_div);

		const sonic_running_div = document.createElement("div");
		sonic_running_div.classList = "sonic";
		sonic_running_div.id = "sonic";
		sonic_div.appendChild(sonic_running_div);

		const ground_div = document.createElement("div");
		ground_div.classList = "ground";
		ground_div.id = "ground";
		sonic_div.appendChild(ground_div);

		for (let i = 1; i <= 20; i++) {
			const tile_div = document.createElement("div");
			tile_div.classList = "tile";
			tile_div.id = "tile" + i;
			ground_div.appendChild(tile_div);
		}

		showAnimationMessage("Gotta go fast... to the couch! <i class='fas fa-running fa-pulse'></i> <i class='fas fa-couch'></i>");

	} else {
		console.error("Unknown animation selected: " + selected_animation);
	}
}

function showAnimationMessage(message) {
	const alertMessage = document.createElement("div");
	alertMessage.id = "animation_alert";
	alertMessage.classList = "alert alert-success alert-dismissible fade show mr-1";
	alertMessage.setAttribute("role", "alert");
	alertMessage.setAttribute("style", "position: absolute; top: 4rem; right: 4rem; z-index: 2; font-size: 2rem;");

	alertMessage.innerHTML = "<audio id='audioNotification' src='sounds/pristine-609.mp3' muted></audio><span>" + message + "</span>" + "<button type='button' class='btn-close' style='font-size: 13px' onclick='stopLeaves(); manualStoppedLeaves = true;' data-bs-dismiss='alert' aria-label='Close'></button>";

	document.getElementsByTagName("body")[0].appendChild(alertMessage);
}

function playNotificationSound() {
	// https://notificationsounds.com/

	// Doesn't launch without user interaction because of browsers not supporting autoplay sounds anymore
	document.getElementById('audioNotification').muted = false;
	document.getElementById('audioNotification').play();
}
