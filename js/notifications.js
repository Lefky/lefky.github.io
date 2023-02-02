console.log("loaded notifications.js");

//https://developer.mozilla.org/en-US/docs/Web/API/Notifications_API/Using_the_Notifications_API

const notificationBtn = document.getElementById("notificationsoption");
notificationBtn.addEventListener('change', function () {
    if (this.checked)
        askNotificationPermission();
});

if (Notification.permission === 'denied' || Notification.permission === 'default')
    notificationBtn.style.disabled = false;
else
    notificationBtn.style.disabled = true;

if (Notification.permission === 'granted')
    notificationBtn.checked = true;

// askNotificationPermission function to ask for permission when the "Enable notifications" button is clicked
function askNotificationPermission() {
    // function to actually ask the permissions
    function handlePermission(permission) {
        // Whatever the user answers, we make sure Chrome stores the information
        if (!('permission' in Notification))
            Notification.permission = permission;

        // set the button to shown or hidden, depending on what the user answers
        if (Notification.permission === 'denied' || Notification.permission === 'default')
            notificationBtn.style.disabled = false;
        else
            notificationBtn.style.disabled = true;
    }

    // Let's check if the browser supports notifications
    if ("Notification" in window === false) {
        console.warn("This browser does not support notifications.");
    } else {
        if (checkNotificationPromise()) {
            Notification.requestPermission()
                .then((permission) => {
                    handlePermission(permission);
                });
        } else {
            Notification.requestPermission(function (permission) {
                handlePermission(permission);
            });
        }
    }
}

// Function to check whether browser supports the promise version of requestPermission()
// Safari only supports the old callback-based version
function checkNotificationPromise() {
    try {
        Notification.requestPermission().then();
    } catch (e) {
        return false;
    }
    return true;
}


// Function for creating the notification
// eslint-disable-next-line no-unused-vars
function createNotification(title, text) {
    if (Notification.permission === 'granted') {
        // Create and show the notification
        const img = '/images/clock128.png',
            // eslint-disable-next-line no-unused-vars
            notification = new Notification(title, { body: text, icon: img, silent: false });
        // https://developer.mozilla.org/en-US/docs/Web/API/Notifications_API
    }
}