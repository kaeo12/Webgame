const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

let scoreA = 0;
let scoreB = 0;
let timer = 60;
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

let hoopA = {
    x: 700,
    y: 150,
    width: 100,
    height: 10,
    rimWidth: 5
};

let backboardA = {
    x: hoopA.x + hoopA.width,
    y: hoopA.y - 100,
    width: 5,
    height: 150
};

let hoopB = {
    x: 0,
    y: 150,
    width: 100,
    height: 10,
    rimWidth: 5
};

let backboardB = {
    x: hoopB.x,
    y: hoopB.y - 100,
    width: 5,
    height: 150
};

let teamA = [
    { x: 50, y: 500, width: 50, height: 50, speed: 5, color: "blue" },
    { x: 150, y: 500, width: 50, height: 50, speed: 5, color: "blue" },
    { x: 250, y: 500, width: 50, height: 50, speed: 5, color: "blue" },
    { x: 350, y: 500, width: 50, height: 50, speed: 5, color: "blue" },
    { x: 450, y: 500, width: 50, height: 50, speed: 5, color: "blue" }
];

let teamB = [
    { x: 550, y: 500, width: 50, height: 50, speed: 5, color: "red" },
    { x: 650, y: 500, width: 50, height: 50, speed: 5, color: "red" },
    { x: 750, y: 500, width: 50, height: 50, speed: 5, color: "red" },
    { x: 50, y: 200, width: 50, height: 50, speed: 5, color: "red" },
    { x: 150, y: 200, width: 50, height: 50, speed: 5, color: "red" }
];

let player = teamA[0];

function drawPlayers() {
    for (let i = 0; i < teamA.length; i++) {
        ctx.fillStyle = teamA[i].color;
        ctx.fillRect(teamA[i].x, teamA[i].y, teamA[i].width, teamA[i].height);
    }
    for (let i = 0; i < teamB.length; i++) {
        ctx.fillStyle = teamB[i].color;
        ctx.fillRect(teamB[i].x, teamB[i].y, teamB[i].width, teamB[i].height);
    }
}

function drawBasketball() {
    ctx.beginPath();
    ctx.arc(basketball.x, basketball.y, basketball.radius, 0, Math.PI * 2);
    ctx.fillStyle = "#FFA500";
    ctx.fill();
    ctx.closePath();
}

function drawCourt() {
    // Center circle
    ctx.beginPath();
    ctx.arc(canvas.width / 2, canvas.height / 2, 60, 0, 2 * Math.PI);
    ctx.strokeStyle = "white";
    ctx.stroke();

    // Half-court line
    ctx.beginPath();
    ctx.moveTo(canvas.width / 2, 0);
    ctx.lineTo(canvas.width / 2, canvas.height);
    ctx.stroke();

    // Three-point line (left)
    ctx.beginPath();
    ctx.arc(120, canvas.height / 2, 200, -Math.PI / 2, Math.PI / 2);
    ctx.stroke();

    // Three-point line (right)
    ctx.beginPath();
    ctx.arc(canvas.width - 120, canvas.height / 2, 200, Math.PI / 2, -Math.PI / 2);
    ctx.stroke();
}

function drawHoops() {
    // Hoop A
    ctx.fillStyle = "#A9A9A9";
    ctx.fillRect(backboardA.x, backboardA.y, backboardA.width, backboardA.height);
    ctx.fillStyle = "#FF0000";
    ctx.fillRect(hoopA.x, hoopA.y, hoopA.width, hoopA.height);
    ctx.fillRect(hoopA.x, hoopA.y, hoopA.rimWidth, hoopA.height);
    ctx.fillRect(hoopA.x + hoopA.width - hoopA.rimWidth, hoopA.y, hoopA.rimWidth, hoopA.height);

    // Hoop B
    ctx.fillStyle = "#A9A9A9";
    ctx.fillRect(backboardB.x, backboardB.y, backboardB.width, backboardB.height);
    ctx.fillStyle = "#FF0000";
    ctx.fillRect(hoopB.x, hoopB.y, hoopB.width, hoopB.height);
    ctx.fillRect(hoopB.x, hoopB.y, hoopB.rimWidth, hoopB.height);
    ctx.fillRect(hoopB.x + hoopB.width - hoopB.rimWidth, hoopB.y, hoopB.rimWidth, hoopB.height);
}

function drawScoreboardAndTimer() {
    ctx.fillStyle = "black";
    ctx.font = "20px Arial";
    ctx.fillText("Team A: " + scoreA, 10, 20);
    ctx.fillText("Team B: " + scoreB, canvas.width - 120, 20);
    ctx.fillText("Time: " + Math.ceil(timer), canvas.width / 2 - 40, 20);
}

function update() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    drawCourt();
    drawPlayers();
    drawBasketball();
    drawHoops();
    drawScoreboardAndTimer();

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

        // Collision with hoop A
        if (
            basketball.x > hoopA.x &&
            basketball.x < hoopA.x + hoopA.width &&
            basketball.y + basketball.radius > hoopA.y &&
            basketball.y - basketball.radius < hoopA.y + hoopA.height
        ) {
            scoreB++;
            resetBasketball();
        }

        // Collision with hoop B
        if (
            basketball.x > hoopB.x &&
            basketball.x < hoopB.x + hoopB.width &&
            basketball.y + basketball.radius > hoopB.y &&
            basketball.y - basketball.radius < hoopB.y + hoopB.height
        ) {
            scoreA++;
            resetBasketball();
        }
    } else {
        // Check for player picking up the ball
        for (let i = 0; i < teamA.length; i++) {
            if (
                basketball.x > teamA[i].x &&
                basketball.x < teamA[i].x + teamA[i].width &&
                basketball.y > teamA[i].y &&
                basketball.y < teamA[i].y + teamA[i].height
            ) {
                player = teamA[i];
                basketball.x = player.x + player.width / 2;
                basketball.y = player.y;
            }
        }
        for (let i = 0; i < teamB.length; i++) {
            if (
                basketball.x > teamB[i].x &&
                basketball.x < teamB[i].x + teamB[i].width &&
                basketball.y > teamB[i].y &&
                basketball.y < teamB[i].y + teamB[i].height
            ) {
                player = teamB[i];
                basketball.x = player.x + player.width / 2;
                basketball.y = player.y;
            }
        }
    }

    updateAI();
    requestAnimationFrame(update);
}

function updateAI() {
    // Team A AI (excluding player)
    for (let i = 1; i < teamA.length; i++) {
        // Move towards the ball if the other team has it
        if (player.color === 'red') {
            if (teamA[i].x < basketball.x) {
                teamA[i].x += teamA[i].speed / 2;
            } else {
                teamA[i].x -= teamA[i].speed / 2;
            }
        }
    }

    // Team B AI
    for (let i = 0; i < teamB.length; i++) {
        if (player === teamB[i] && !basketball.isShooting) {
            // If this player has the ball, shoot
            let angle = Math.atan2(hoopA.y - teamB[i].y, hoopA.x - teamB[i].x);
            basketball.dx = Math.cos(angle) * 15;
            basketball.dy = Math.sin(angle) * 15;
            basketball.isShooting = true;
        } else if (player.color === 'blue') {
            // Move towards the ball if the other team has it
            if (teamB[i].x < basketball.x) {
                teamB[i].x += teamB[i].speed / 2;
            } else {
                teamB[i].x -= teamB[i].speed / 2;
            }
        }
    }
}

function shoot(e) {
    if (!basketball.isShooting) {
        basketball.isShooting = true;
        let angle = Math.atan2(e.clientY - player.y, e.clientX - (player.x + player.width / 2));
        basketball.dx = Math.cos(angle) * 15;
        basketball.dy = Math.sin(angle) * 15;
    }
}

function resetBasketball() {
    basketball.x = player.x + player.width / 2;
    basketball.y = player.y;
    basketball.dx = 0;
    basketball.dy = 0;
    basketball.isShooting = false;
}

function movePlayer(e) {
    if (e.key === "ArrowLeft") {
        player.x -= player.speed;
    } else if (e.key === "ArrowRight") {
        player.x += player.speed;
    } else if (e.key === "s") {
        let currentPlayerIndex = teamA.indexOf(player);
        let nextPlayerIndex = (currentPlayerIndex + 1) % teamA.length;
        player = teamA[nextPlayerIndex];
    }
}

canvas.addEventListener('click', shoot);
window.addEventListener('keydown', movePlayer);

function gameLoop() {
    if (timer > 0) {
        timer -= 1 / 60;
        update();
        requestAnimationFrame(gameLoop);
    } else {
        ctx.fillStyle = "black";
        ctx.font = "50px Arial";
        ctx.fillText("Game Over", canvas.width / 2 - 150, canvas.height / 2);
    }
}

gameLoop();
