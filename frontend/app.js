// Main Application Logic
const app = document.getElementById('app');

// Global State
let players = [];
let currentMatchIndex = 0;

// Utility to render pages
function renderPage(content) {
  app.innerHTML = content;
}

// Landing Page
function showLandingPage() {
  renderPage(`
    <h1>Welcome to the Pong Contest</h1>
    <button onclick="showGameLobby()">Join Tournament</button>
    <button onclick="showLeaderboard()">View Leaderboard</button>
  `);
}

// Game Lobby
function showGameLobby() {
  renderPage(`
    <h1>Game Lobby</h1>
    <form id="joinForm">
      <label for="alias">Enter your alias:</label>
      <input type="text" id="alias" required>
      <button type="submit">Join Tournament</button>
    </form>
    <div id="playerList"></div>
    <button onclick="startTournament()">Start Tournament</button>
    <button onclick="showLandingPage()">Back to Home</button>
  `);

  const joinForm = document.getElementById('joinForm');
  const playerList = document.getElementById('playerList');

  // Update player list
  function updatePlayerList() {
    playerList.innerHTML = `
      <h3>Players in the tournament:</h3>
      <ul>
        ${players.map(player => `<li>${player}</li>`).join('')}
      </ul>
    `;
  }

  joinForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const alias = document.getElementById('alias').value.trim();
    if (alias && !players.includes(alias)) {
      players.push(alias);
      updatePlayerList();
      document.getElementById('alias').value = '';
    } else {
      alert('Alias is either empty or already taken!');
    }
  });

  updatePlayerList();
}

// Tournament View
function startTournament() {
  if (players.length < 2) {
    alert('At least 2 players are required to start a tournament!');
    return;
  }

  currentMatchIndex = 0;
  showTournamentView();
}

function showTournamentView() {
  if (currentMatchIndex >= players.length - 1) {
    renderPage(`
      <h1>Tournament Complete</h1>
      <p>Congratulations to <strong>${players[currentMatchIndex]}</strong> for winning!</p>
      <button onclick="resetTournament()">Start a New Tournament</button>
      <button onclick="showLandingPage()">Back to Home</button>
    `);
    return;
  }

  const player1 = players[currentMatchIndex];
  const player2 = players[currentMatchIndex + 1];

  renderPage(`
    <h1>Tournament Bracket</h1>
    <p>Match: <strong>${player1}</strong> vs <strong>${player2}</strong></p>
    <button onclick="startGame('${player1}', '${player2}')">Start Game</button>
    <button onclick="showLandingPage()">Exit</button>
  `);
}

function resetTournament() {
  players = [];
  currentMatchIndex = 0;
  showGameLobby();
}

// Pong Game Screen
function startGame(player1, player2) {
  renderPage(`
    <h1>Pong Game</h1>
    <canvas id="pongCanvas" width="800" height="400"></canvas>
    <p>Players: <strong>${player1}</strong> (Left) vs <strong>${player2}</strong> (Right)</p>
    <button onclick="endGame()">End Game</button>
    <button onclick="showTournamentView()">Back to Tournament</button>
  `);

  startPongGame();
}

// End Game and Advance Tournament
function endGame() {
  currentMatchIndex++;
  showTournamentView();
}

// Leaderboard (Placeholder for Backend Integration)
function showLeaderboard() {
  renderPage(`
    <h1>Leaderboard</h1>
    <p>Leaderboard content will be fetched from the backend.</p>
    <button onclick="showLandingPage()">Back to Home</button>
  `);
}

// Initialize the app
showLandingPage();


// // Main Application Logic
// const app = document.getElementById('app');

// // Global State
// let players = [];
// let currentMatchIndex = 0;
// const isAI = "AI Opponent"; // Name for the AI opponent

// // Utility to render pages
// function renderPage(content) {
//   app.innerHTML = content;
// }

// // Landing Page
// function showLandingPage() {
//   renderPage(`
//     <h1>Welcome to the Pong Contest</h1>
//     <button onclick="showGameLobby()">Join Tournament</button>
//     <button onclick="showLeaderboard()">View Leaderboard</button>
//   `);
// }

// // Game Lobby
// function showGameLobby() {
//   renderPage(`
//     <h1>Game Lobby</h1>
//     <form id="joinForm">
//       <label for="alias">Enter your alias:</label>
//       <input type="text" id="alias" required>
//       <button type="submit">Join Tournament</button>
//     </form>
//     <div id="playerList"></div>
//     <button onclick="startTournament()">Start Tournament</button>
//     <button onclick="showLandingPage()">Back to Home</button>
//   `);

//   const joinForm = document.getElementById('joinForm');
//   const playerList = document.getElementById('playerList');

//   // Update player list
//   function updatePlayerList() {
//     playerList.innerHTML = `
//       <h3>Players in the tournament:</h3>
//       <ul>
//         ${players.map(player => `<li>${player}</li>`).join('')}
//       </ul>
//     `;
//   }

//   joinForm.addEventListener('submit', (e) => {
//     e.preventDefault();
//     const alias = document.getElementById('alias').value.trim();
//     if (alias && !players.includes(alias)) {
//       players.push(alias);
//       updatePlayerList();
//       document.getElementById('alias').value = '';
//     } else {
//       alert('Alias is either empty or already taken!');
//     }
//   });

//   updatePlayerList();
// }

// // Tournament View
// function startTournament() {
//   if (players.length === 0) {
//     alert('At least 1 player is required to start a tournament!');
//     return;
//   }

//   // If only one player, add the AI opponent automatically
//   if (players.length === 1) {
//     players.push(isAI);
//   }

//   currentMatchIndex = 0;
//   showTournamentView();
// }

// function showTournamentView() {
//   if (currentMatchIndex >= players.length - 1) {
//     renderPage(`
//       <h1>Tournament Complete</h1>
//       <p>Congratulations to <strong>${players[currentMatchIndex]}</strong> for winning!</p>
//       <button onclick="resetTournament()">Start a New Tournament</button>
//       <button onclick="showLandingPage()">Back to Home</button>
//     `);
//     return;
//   }

//   const player1 = players[currentMatchIndex];
//   const player2 = players[currentMatchIndex + 1];

//   renderPage(`
//     <h1>Tournament Bracket</h1>
//     <p>Match: <strong>${player1}</strong> vs <strong>${player2}</strong></p>
//     <button onclick="startGame('${player1}', '${player2}')">Start Game</button>
//     <button onclick="showLandingPage()">Exit</button>
//   `);
// }

// function resetTournament() {
//   players = [];
//   currentMatchIndex = 0;
//   showGameLobby();
// }

// // Pong Game Screen
// function startGame(player1, player2) {
//   renderPage(`
//     <h1>Pong Game</h1>
//     <canvas id="pongCanvas" width="800" height="400"></canvas>
//     <p>Players: <strong>${player1}</strong> (Left) vs <strong>${player2}</strong> (Right)</p>
//     <button onclick="endGame()">End Game</button>
//     <button onclick="showTournamentView()">Back to Tournament</button>
//   `);

//   const isAIPlaying = player2 === isAI;
//   startPongGame(isAIPlaying);
// }

// // End Game and Advance Tournament
// function endGame() {
//   currentMatchIndex++;
//   showTournamentView();
// }

// // Leaderboard (Placeholder for Backend Integration)
// function showLeaderboard() {
//   renderPage(`
//     <h1>Leaderboard</h1>
//     <p>Leaderboard content will be fetched from the backend.</p>
//     <button onclick="showLandingPage()">Back to Home</button>
//   `);
// }

// // Initialize the app
// showLandingPage();
