const pongGame = document.getElementById("pong-game");
const paddle1 = document.createElement("div");
const paddle2 = document.createElement("div");
const ball = document.createElement("div");

paddle1.classList.add("paddle");
paddle2.classList.add("paddle");
ball.classList.add("ball");

pongGame.append(paddle1, paddle2, ball);

// Initial positions
paddle1.style.left = "10px";
paddle1.style.top = "125px";
paddle2.style.right = "10px";
paddle2.style.top = "125px";
ball.style.left = "245px";
ball.style.top = "145px";

// Game state
let ballDirectionX = 2;
let ballDirectionY = 2;
let paddle1Y = 125;
let paddle2Y = 125;
let player1Score = 0;
let player2Score = 0;
let isSinglePlayer = true;

// AI logic
function moveAI() {
    const ballTop = parseInt(ball.style.top);
    const paddleTop = parseInt(paddle2.style.top);
    if (ballTop > paddleTop + 25) paddle2Y += 2;
    else if (ballTop < paddleTop + 25) paddle2Y -= 2;
    paddle2.style.top = `${paddle2Y}px`;
}

// Ball movement
function moveBall() {
    const ballX = parseInt(ball.style.left);
    const ballY = parseInt(ball.style.top);

    // Ball collision with walls
    if (ballY <= 0 || ballY >= 290) ballDirectionY *= -1;

    // Ball collision with paddles
    if (
        (ballX <= 20 && ballY >= paddle1Y && ballY <= paddle1Y + 50) ||
        (ballX >= 470 && ballY >= paddle2Y && ballY <= paddle2Y + 50)
    ) {
        ballDirectionX *= -1;
    }

    // Scoring
    if (ballX <= 0) {
        player2Score++;
        resetBall();
    } else if (ballX >= 490) {
        player1Score++;
        resetBall();
    }

    // Move ball
    ball.style.left = `${ballX + ballDirectionX}px`;
    ball.style.top = `${ballY + ballDirectionY}px`;
}

// Reset ball position
function resetBall() {
    ball.style.left = "245px";
    ball.style.top = "145px";
}

// Game loop
function gameLoop() {
    moveBall();
    if (isSinglePlayer) moveAI();
    requestAnimationFrame(gameLoop);
}

// Player controls
document.addEventListener("keydown", (event) => {
    if (event.key === "w" && paddle1Y > 0) paddle1Y -= 5;
    if (event.key === "s" && paddle1Y < 250) paddle1Y += 5;
    if (!isSinglePlayer) {
        if (event.key === "ArrowUp" && paddle2Y > 0) paddle2Y -= 5;
        if (event.key === "ArrowDown" && paddle2Y < 250) paddle2Y += 5;
    }
    paddle1.style.top = `${paddle1Y}px`;
    paddle2.style.top = `${paddle2Y}px`;
});

// Start game
document.getElementById("game-section").addEventListener("click", () => {
    isSinglePlayer = confirm("Play against AI? Cancel for 2 players.");
    gameLoop();
});
