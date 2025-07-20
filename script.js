const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const team1ScoreElem = document.getElementById('team1Score');
const team2ScoreElem = document.getElementById('team2Score');
const timerElem = document.getElementById('timer');

let team1Score = 0;
let team2Score = 0;
let timeLeft = 300; // 5 minutes in seconds

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

let player = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    radius: 20,
    speed: 5,
    dx: 0,
    dy: 0
};

let team1 = [];
let team2 = [];

function createTeams() {
    for (let i = 0; i < 5; i++) {
        team1.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            radius: 20,
            color: 'red'
        });
        team2.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            radius: 20,
            color: 'green'
        });
    }
}

function drawTeams() {
    for (let i = 0; i < 5; i++) {
        ctx.beginPath();
        ctx.arc(team1[i].x, team1[i].y, team1[i].radius, 0, Math.PI * 2);
        ctx.fillStyle = team1[i].color;
        ctx.fill();
        ctx.closePath();

        ctx.beginPath();
        ctx.arc(team2[i].x, team2[i].y, team2[i].radius, 0, Math.PI * 2);
        ctx.fillStyle = team2[i].color;
        ctx.fill();
        ctx.closePath();
    }
}

function drawPlayer() {
    ctx.beginPath();
    ctx.arc(player.x, player.y, player.radius, 0, Math.PI * 2);
    ctx.fillStyle = "red";
    ctx.fill();
    ctx.closePath();
}

function drawBasketball() {
    ctx.beginPath();
    ctx.arc(basketball.x, basketball.y, basketball.radius, 0, Math.PI * 2);
    ctx.fillStyle = "#FFA500";
    ctx.fill();
    ctx.closePath();
}

function drawCourt() {
    // Half-court line
    ctx.beginPath();
    ctx.moveTo(canvas.width / 2, 0);
    ctx.lineTo(canvas.width / 2, canvas.height);
    ctx.strokeStyle = "black";
    ctx.stroke();
    ctx.closePath();

    // Center circle
    ctx.beginPath();
    ctx.arc(canvas.width / 2, canvas.height / 2, 60, 0, Math.PI * 2);
    ctx.stroke();
    ctx.closePath();

    // Three-point line (left)
    ctx.beginPath();
    ctx.arc(100, canvas.height / 2, 200, -Math.PI / 2, Math.PI / 2);
    ctx.stroke();
    ctx.closePath();

    // Three-point line (right)
    ctx.beginPath();
    ctx.arc(canvas.width - 100, canvas.height / 2, 200, Math.PI / 2, -Math.PI / 2);
    ctx.stroke();
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

    drawCourt();
    drawTeams();
    drawPlayer();
    drawBasketball();
    drawHoop();

    // Player movement
    player.x += player.dx;
    player.y += player.dy;

    // Wall collision for player
    if (player.x + player.radius > canvas.width) {
        player.x = canvas.width - player.radius;
    }
    if (player.x - player.radius < 0) {
        player.x = player.radius;
    }
    if (player.y + player.radius > canvas.height) {
        player.y = canvas.height - player.radius;
    }
    if (player.y - player.radius < 0) {
        player.y = player.radius;
    }

    if (basketball.isShooting) {
        basketball.dy += basketball.gravity;
        basketball.x += basketball.dx;
        basketball.y += basketball.dy;

        // Collision with walls
    } else {
        basketball.x = player.x + player.radius;
        basketball.y = player.y;
    }
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
            if (player.x < canvas.width / 2) {
                team1Score++;
                team1ScoreElem.textContent = team1Score;
            } else {
                team2Score++;
                team2ScoreElem.textContent = team2Score;
            }
            resetBasketball();
        }
    }

    requestAnimationFrame(update);
}

function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

setInterval(() => {
    if (timeLeft > 0) {
        timeLeft--;
        timerElem.textContent = formatTime(timeLeft);
    }
}, 1000);

function shoot(e) {
    if (!basketball.isShooting) {
        basketball.isShooting = true;
        let angle = Math.atan2(e.clientY - player.y, e.clientX - player.x);
        basketball.dx = Math.cos(angle) * 15;
        basketball.dy = Math.sin(angle) * 15;
    }
}

function resetBasketball() {
    basketball.isShooting = false;
    basketball.dx = 0;
    basketball.dy = 0;
}

canvas.addEventListener('click', shoot);

document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight' || e.key === 'd') {
        player.dx = player.speed;
    } else if (e.key === 'ArrowLeft' || e.key === 'a') {
        player.dx = -player.speed;
    } else if (e.key === 'ArrowDown' || e.key === 's') {
        player.dy = player.speed;
    } else if (e.key === 'ArrowUp' || e.key === 'w') {
        player.dy = -player.speed;
    }
});

document.addEventListener('keyup', (e) => {
    if (
        e.key === 'ArrowRight' ||
        e.key === 'd' ||
        e.key === 'ArrowLeft' ||
        e.key === 'a'
    ) {
        player.dx = 0;
    }
    if (
        e.key === 'ArrowDown' ||
        e.key === 's' ||
        e.key === 'ArrowUp' ||
        e.key === 'w'
    ) {
        player.dy = 0;
    }
});

function updateAI() {
    for (let i = 0; i < 5; i++) {
        // Team 1 AI
        if (basketball.x < team1[i].x) {
            team1[i].x -= 1;
        } else {
            team1[i].x += 1;
        }
        if (basketball.y < team1[i].y) {
            team1[i].y -= 1;
        } else {
            team1[i].y += 1;
        }

        // Team 2 AI
        if (basketball.x < team2[i].x) {
            team2[i].x -= 1;
        } else {
            team2[i].x += 1;
        }
        if (basketball.y < team2[i].y) {
            team2[i].y -= 1;
        } else {
            team2[i].y += 1;
        }
    }
}

setInterval(updateAI, 100);
createTeams();
update();
