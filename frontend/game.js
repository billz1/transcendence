const gameBoard = document.getElementById('gameBoard');
const leftPaddle = document.getElementById('leftPaddle');
const rightPaddle = document.getElementById('rightPaddle');
const ball = document.getElementById('ball');
const scoreLeft = document.getElementById('scoreLeft');
const scoreRight = document.getElementById('scoreRight');

let ballX = 292, ballY = 192;
let ballSpeedX = 2, ballSpeedY = 2;
let leftPaddleY = 160, rightPaddleY = 160;

// Paddle controls
document.addEventListener('keydown', (e) => {
    if (e.key === 'w') leftPaddleY = Math.max(0, leftPaddleY - 10);
    if (e.key === 's') leftPaddleY = Math.min(320, leftPaddleY + 10);
    if (e.key === 'ArrowUp') rightPaddleY = Math.max(0, rightPaddleY - 10);
    if (e.key === 'ArrowDown') rightPaddleY = Math.min(320, rightPaddleY + 10);

    updatePaddles();
});

// Update paddle positions
function updatePaddles() {
    leftPaddle.style.top = `${leftPaddleY}px`;
    rightPaddle.style.top = `${rightPaddleY}px`;
}

// Move ball and detect collisions
function updateBall() {
    ballX += ballSpeedX;
    ballY += ballSpeedY;

    if (ballY <= 0 || ballY >= 385) ballSpeedY *= -1;
    if (ballX <= 10 && ballY >= leftPaddleY && ballY <= leftPaddleY + 80) ballSpeedX *= -1;
    if (ballX >= 575 && ballY >= rightPaddleY && ballY <= rightPaddleY + 80) ballSpeedX *= -1;

    if (ballX <= 0) {
        scoreRight.textContent = parseInt(scoreRight.textContent) + 1;
        resetBall();
    }

    if (ballX >= 590) {
        scoreLeft.textContent = parseInt(scoreLeft.textContent) + 1;
        resetBall();
    }

    ball.style.left = `${ballX}px`;
    ball.style.top = `${ballY}px`;
}

// Reset ball to the center
function resetBall() {
    ballX = 292;
    ballY = 192;
    ballSpeedX *= -1;
}

// Game loop
function gameLoop() {
    updateBall();
    requestAnimationFrame(gameLoop);
}

gameLoop();
