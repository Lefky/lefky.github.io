const rocket = document.querySelector('.rocket');

// --- Configuration ---
const ACCELERATION = 0.04;
const MAX_SPEED = 2.0;
const TURN_SPEED = 0.02;
const DRAG = 0.99;
const REACH_THRESHOLD = 150;
const BORDER_MARGIN = 100;

// --- State Variables ---
let pos = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
let vel = { x: 0, y: 0 }; // Velocity
let target = { x: 0, y: 0 };
let currentAngle = -Math.PI / 2; // Start pointing straight up

/** Picks a new random target within the screen boundaries */
function setNewTarget() {
    target.x = Math.random() * (window.innerWidth - BORDER_MARGIN * 2) + BORDER_MARGIN;
    target.y = Math.random() * (window.innerHeight - BORDER_MARGIN * 2) + BORDER_MARGIN;
}

/** Calculates the shortest angle difference between two angles */
function shortestAngleDiff(a0, a1) {
    const max = Math.PI * 2;
    const da = (a1 - a0) % max;
    return 2 * da % max - da;
}

/** The main animation loop */
function update() {
    // 1. Calculate angle towards the target
    const dx = target.x - pos.x;
    const dy = target.y - pos.y;
    const distanceToTarget = Math.sqrt(dx * dx + dy * dy);
    const targetAngle = Math.atan2(dy, dx);

    // 2. Smoothly steer the rocket's angle towards the target
    const angleDiff = shortestAngleDiff(currentAngle, targetAngle);
    currentAngle += angleDiff * TURN_SPEED;

    // 3. Accelerate in the direction the rocket is currently facing
    vel.x += Math.cos(currentAngle) * ACCELERATION;
    vel.y += Math.sin(currentAngle) * ACCELERATION;

    // 4. Apply drag/friction to slow down over time
    vel.x *= DRAG;
    vel.y *= DRAG;

    // 5. Limit the rocket's speed
    const speed = Math.sqrt(vel.x * vel.x + vel.y * vel.y);
    if (speed > MAX_SPEED) {
        vel.x = (vel.x / speed) * MAX_SPEED;
        vel.y = (vel.y / speed) * MAX_SPEED;
    }

    // 6. Update the rocket's position based on its velocity
    pos.x += vel.x;
    pos.y += vel.y;

    // 7. If target is reached, get a new one
    if (distanceToTarget < REACH_THRESHOLD) {
        setNewTarget();
    }

    // 8. Screen wrap: if rocket goes off one side, it appears on the other
    if (pos.x < -BORDER_MARGIN) pos.x = window.innerWidth + BORDER_MARGIN;
    if (pos.x > window.innerWidth + BORDER_MARGIN) pos.x = -BORDER_MARGIN;
    if (pos.y < -BORDER_MARGIN) pos.y = window.innerHeight + BORDER_MARGIN;
    if (pos.y > window.innerHeight + BORDER_MARGIN) pos.y = -BORDER_MARGIN;

    // 9. Apply the position and rotation to the CSS
    // The final rotation is the rocket's current angle of movement,
    // plus 90 degrees (PI/2) to correct for the visual orientation of the pixel art.
    rocket.style.transform = `translate(${pos.x}px, ${pos.y}px) rotate(${currentAngle + Math.PI / 2}rad)`;

    requestAnimationFrame(update);
}

// --- Start the animation ---
setNewTarget();
update();
