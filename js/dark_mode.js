console.log("loaded dark_mode.js");

/*global $, importBootstrapColors */
/*eslint no-undef: "error"*/

// eslint-disable-next-line no-unused-vars
var colorScheme; // Variable to know if in dark or light mode

window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', event => {
    // Dark mode listener
    colorScheme = event.matches ? "dark" : "light";
    importBootstrapColors();
});

$(document).ready(function () {
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches)
        colorScheme = "dark";
    else
        colorScheme = "light";
    importBootstrapColors();
});
/*
//determines if the user has a set theme
function detectColorScheme() {
    var theme = "light";    //default to light

    //local storage is used to override OS theme settings
    if (localStorage.getItem("theme")) {
        if (localStorage.getItem("theme") == "dark") {
            theme = "dark";
        }
    } else if (!window.matchMedia) {
        //matchMedia method not supported
        return false;
    } else if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
        //OS theme setting detected as dark
        theme = "dark";
    }

    //dark theme preferred, set document with a `data-theme` attribute
    if (theme == "dark") {
        document.documentElement.setAttribute("data-theme", "dark");
        //document.querySelector('meta[name="color-scheme"]').setAttribute("content", "dark");
    }
}
detectColorScheme();

//function that changes the theme, and sets a localStorage variable to track the theme between page loads
function switchTheme(e) {
    const toggleSwitch = document.getElementById("dark_mode_toggle_btn");
    if (e.target.checked) {
        localStorage.setItem('theme', 'dark');
        document.documentElement.setAttribute('data-theme', 'dark');
        //document.querySelector('meta[name="color-scheme"]').setAttribute("content", "dark");
        toggleSwitch.checked = true;
    } else {
        localStorage.setItem('theme', 'light');
        document.documentElement.setAttribute('data-theme', 'light');
        //document.querySelector('meta[name="color-scheme"]').setAttribute("content", "light");
        toggleSwitch.checked = false;
    }
}

//listener for changing themes
document.getElementById("dark_mode_toggle_btn").addEventListener('change', switchTheme, false);

//pre-check the dark-theme checkbox if dark-theme is set
if (document.documentElement.getAttribute("data-theme") == "dark") {
//if (document.querySelector('meta[name="color-scheme"]').getAttribute("content") == "dark") {
    document.getElementById("dark_mode_toggle_btn").checked = true;
}
*/