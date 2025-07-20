const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

let score = 0;
let basketball = {
    x: 100,
    y: 400,
    radius: 15,
    dx: 0,
    dy: 0,
    gravity: 0.4,
    lift: -10,
    isShooting: false
};

let hoop = {
    x: 700,
    y: 150,
    width: 100,
    height: 10,
    rimWidth: 5
};

let backboard = {
    x: hoop.x + hoop.width,
    y: hoop.y - 100,
    width: 5,
    height: 150
};

function drawBasketball() {
    ctx.beginPath();
    ctx.arc(basketball.x, basketball.y, basketball.radius, 0, Math.PI * 2);
    ctx.fillStyle = "#FFA500";
    ctx.fill();
    ctx.closePath();
}

function drawHoop() {
    // Backboard
    ctx.fillStyle = "#A9A9A9";
    ctx.fillRect(backboard.x, backboard.y, backboard.width, backboard.height);

    // Hoop
    ctx.fillStyle = "#FF0000";
    ctx.fillRect(hoop.x, hoop.y, hoop.width, hoop.height);

    // Rim
    ctx.fillStyle = "#FF0000";
    ctx.fillRect(hoop.x, hoop.y, hoop.rimWidth, hoop.height);
    ctx.fillRect(hoop.x + hoop.width - hoop.rimWidth, hoop.y, hoop.rimWidth, hoop.height);
}

function update() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    drawBasketball();
    drawHoop();

    if (basketball.isShooting) {
        basketball.dy += basketball.gravity;
        basketball.x += basketball.dx;
        basketball.y += basketball.dy;

        // Collision with walls
        if (basketball.x + basketball.radius > canvas.width || basketball.x - basketball.radius < 0) {
            basketball.dx = -basketball.dx;
        }

        // Reset if it goes off screen
        if (basketball.y + basketball.radius > canvas.height) {
            resetBasketball();
        }

        // Collision with hoop
        if (
            basketball.x > hoop.x &&
            basketball.x < hoop.x + hoop.width &&
            basketball.y + basketball.radius > hoop.y &&
            basketball.y - basketball.radius < hoop.y + hoop.height
        ) {
            score++;
            resetBasketball();
        }
    }

    requestAnimationFrame(update);
}

function shoot(e) {
    if (!basketball.isShooting) {
        basketball.isShooting = true;
        let angle = Math.atan2(e.clientY - basketball.y, e.clientX - basketball.x);
        basketball.dx = Math.cos(angle) * 15;
        basketball.dy = Math.sin(angle) * 15;
    }
}

function resetBasketball() {
    basketball.x = 100;
    basketball.y = 400;
    basketball.dx = 0;
    basketball.dy = 0;
    basketball.isShooting = false;
}

canvas.addEventListener('click', shoot);

update();
