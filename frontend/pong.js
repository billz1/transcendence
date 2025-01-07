//pong game logic
function startPongGame() {
    const canvas = document.getElementById('pongCanvas');
    const ctx = canvas.getContext('2d');
  
    //game State
    const paddleWidth = 10, paddleHeight = 100;
    const ballRadius = 10;
    let ballX = canvas.width / 2, ballY = canvas.height / 2;
    let ballSpeedX = 5, ballSpeedY = 5;
    let leftPaddleY = (canvas.height - paddleHeight) / 2;
    let rightPaddleY = (canvas.height - paddleHeight) / 2;
    const paddleSpeed = 20;
  
    //event listeners for paddle movement
    document.addEventListener('keydown', (e) => {
      if (e.key === 'w' && leftPaddleY > 0) leftPaddleY -= paddleSpeed; //prevent paddle from going above the top
      if (e.key === 's' && leftPaddleY < canvas.height - paddleHeight) leftPaddleY += paddleSpeed; //prevent paddle from going below the bottom
      if (e.key === 'ArrowUp' && rightPaddleY > 0) rightPaddleY -= paddleSpeed; //prevent paddle from going above the top
      if (e.key === 'ArrowDown' && rightPaddleY < canvas.height - paddleHeight) rightPaddleY += paddleSpeed; //prevent paddle from going below the bottom
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
  
      //ball out of bounds
      if (ballX - ballRadius < 0 || ballX + ballRadius > canvas.width) {
        ballX = canvas.width / 2;
        ballY = canvas.height / 2;
        ballSpeedX = -ballSpeedX;
      }
  
      requestAnimationFrame(gameLoop);
    }
  
    gameLoop();
  }


// // Pong Game Logic
// function startPongGame(isAIPlaying) {
//     const canvas = document.getElementById('pongCanvas');
//     const ctx = canvas.getContext('2d');
  
//     // Game State
//     const paddleWidth = 10, paddleHeight = 100;
//     const ballRadius = 10;
//     let ballX = canvas.width / 2, ballY = canvas.height / 2;
//     let ballSpeedX = 5, ballSpeedY = 5;
//     let leftPaddleY = (canvas.height - paddleHeight) / 2;
//     let rightPaddleY = (canvas.height - paddleHeight) / 2;
//     const paddleSpeed = 20;
  
//     // AI Speed
//     const aiSpeed = 3;
  
//     // Event Listeners for Paddle Movement
//     document.addEventListener('keydown', (e) => {
//       if (e.key === 'w' && leftPaddleY > 0) leftPaddleY -= paddleSpeed;
//       if (e.key === 's' && leftPaddleY < canvas.height - paddleHeight) leftPaddleY += paddleSpeed;
//     });
  
//     // Draw Functions
//     function drawRect(x, y, width, height, color) {
//       ctx.fillStyle = color;
//       ctx.fillRect(x, y, width, height);
//     }
  
//     function drawCircle(x, y, radius, color) {
//       ctx.fillStyle = color;
//       ctx.beginPath();
//       ctx.arc(x, y, radius, 0, Math.PI * 2);
//       ctx.closePath();
//       ctx.fill();
//     }
  
//     function drawNet() {
//       for (let i = 0; i < canvas.height; i += 20) {
//         drawRect(canvas.width / 2 - 1, i, 2, 10, 'white');
//       }
//     }
  
//     // Game Loop
//     function gameLoop() {
//       // Clear canvas
//       ctx.clearRect(0, 0, canvas.width, canvas.height);
  
//       // Draw paddles and ball
//       drawRect(0, leftPaddleY, paddleWidth, paddleHeight, 'white');
//       drawRect(canvas.width - paddleWidth, rightPaddleY, paddleWidth, paddleHeight, 'white');
//       drawCircle(ballX, ballY, ballRadius, 'red');
//       drawNet();
  
//       // Update Ball Position
//       ballX += ballSpeedX;
//       ballY += ballSpeedY;
  
//       // Ball Collision with Walls
//       if (ballY - ballRadius < 0 || ballY + ballRadius > canvas.height) {
//         ballSpeedY = -ballSpeedY;
//       }
  
//       // Ball Collision with Paddles
//       if (
//         (ballX - ballRadius < paddleWidth && ballY > leftPaddleY && ballY < leftPaddleY + paddleHeight) ||
//         (ballX + ballRadius > canvas.width - paddleWidth && ballY > rightPaddleY && ballY < rightPaddleY + paddleHeight)
//       ) {
//         ballSpeedX = -ballSpeedX;
//       }
  
//       // Ball Out of Bounds
//       if (ballX - ballRadius < 0 || ballX + ballRadius > canvas.width) {
//         ballX = canvas.width / 2;
//         ballY = canvas.height / 2;
//         ballSpeedX = -ballSpeedX;
//       }
  
//       // AI Movement
//       if (isAIPlaying) {
//         if (ballY < rightPaddleY + paddleHeight / 2) {
//           rightPaddleY -= aiSpeed;
//         } else if (ballY > rightPaddleY + paddleHeight / 2) {
//           rightPaddleY += aiSpeed;
//         }
//       }
  
//       requestAnimationFrame(gameLoop);
//     }
  
//     gameLoop();
//   }
  