function startPongGame(isAIEnabled = false) {
  const canvas = document.getElementById('pongCanvas');
  const ctx = canvas.getContext('2d');

  //game state
  const paddleWidth = 10, paddleHeight = 100;
  const ballRadius = 10;
  let ballX = canvas.width / 2, ballY = canvas.height / 2;
  let ballSpeedX = 5, ballSpeedY = 5;
  let leftPaddleY = (canvas.height - paddleHeight) / 2;
  let rightPaddleY = (canvas.height - paddleHeight) / 2;
  const paddleSpeed = 20;

  //listeners for paddle movement
  document.addEventListener('keydown', (e) => {
    // Left Paddle Controls
    if (e.key === 'w' && leftPaddleY > 0) leftPaddleY -= paddleSpeed;
    if (e.key === 's' && leftPaddleY < canvas.height - paddleHeight) leftPaddleY += paddleSpeed;

    //right paddle controls (when two players are registered, the right paddle is normally reserved for the AI)
    if (!isAIEnabled) {
      if (e.key === 'ArrowUp' && rightPaddleY > 0) rightPaddleY -= paddleSpeed;
      if (e.key === 'ArrowDown' && rightPaddleY < canvas.height - paddleHeight) rightPaddleY += paddleSpeed;
    }
  });

  //draw functions
  function drawRect(x, y, width, height, color) {
    ctx.fillStyle = color;
    ctx.fillRect(x, y, width, height);
  }

  function drawCircle(x, y, radius, color) {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.closePath();
    ctx.fill();
  }

  function drawNet() {
    for (let i = 0; i < canvas.height; i += 20) {
      drawRect(canvas.width / 2 - 1, i, 2, 10, 'white');
    }
  }

  //AI logic
  function moveAIPaddle() {
    const aiSpeed = 4;

    if (ballY > rightPaddleY + paddleHeight / 2) {
      rightPaddleY += aiSpeed; //paddle down
    } else if (ballY < rightPaddleY + paddleHeight / 2) {
      rightPaddleY -= aiSpeed; //paddle up
    }

    //prevent AI paddle from going too high or too low to leave the game canvas(it was happening :) )
    rightPaddleY = Math.max(0, Math.min(canvas.height - paddleHeight, rightPaddleY));
  }

  //game loop
  function gameLoop() {
    //clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    //draw paddles and ball
    drawRect(0, leftPaddleY, paddleWidth, paddleHeight, 'white');
    drawRect(canvas.width - paddleWidth, rightPaddleY, paddleWidth, paddleHeight, 'white');
    drawCircle(ballX, ballY, ballRadius, 'red');
    drawNet();

    //update ball position
    ballX += ballSpeedX;
    ballY += ballSpeedY;

    //ball collision with walls
    if (ballY - ballRadius < 0 || ballY + ballRadius > canvas.height) {
      ballSpeedY = -ballSpeedY;
    }

    //ball collision with paddles
    if (
      (ballX - ballRadius < paddleWidth && ballY > leftPaddleY && ballY < leftPaddleY + paddleHeight) ||
      (ballX + ballRadius > canvas.width - paddleWidth && ballY > rightPaddleY && ballY < rightPaddleY + paddleHeight)
    ) {
      ballSpeedX = -ballSpeedX;
    }

    //track ball out of bounds
    if (ballX - ballRadius < 0 || ballX + ballRadius > canvas.width) {
      ballX = canvas.width / 2;
      ballY = canvas.height / 2;
      ballSpeedX = -ballSpeedX;
    }

    //AI paddle movement
    if (isAIEnabled) {
      moveAIPaddle();
    }

    requestAnimationFrame(gameLoop);
  }

  gameLoop();
}


