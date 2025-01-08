//main app logic
const app = document.getElementById('app');

//global state
let players = [];
let currentMatchIndex = 0;

//to render pages
function renderPage(content) {
  app.innerHTML = content;
}

//landing page
function showLandingPage() {
  console.log("Landing page is being shown"); // Debugging
  renderPage(`
    <h1>Welcome to the Pong Contest</h1>
    <button onclick="showGameLobby()">Join Tournament</button>
    <button onclick="showLeaderboard()">View Leaderboard</button>
  `);
}

//game lobby
function showGameLobby() {
  console.log("Game lobby is being shown"); // Debugging
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

//start the game with AI or two players
function startGame(player1, player2 = "AI") {
  console.log(`Starting game: ${player1} vs ${player2}`); // Debugging
  renderPage(`
    <h1>Pong Game</h1>
    <canvas id="pongCanvas" width="800" height="400"></canvas>
    <p>Players: <strong>${player1}</strong> (Left) vs <strong>${player2}</strong> (Right)</p>
    <button onclick="endGame()">End Game</button>
    <button onclick="showTournamentView()">Back to Tournament</button>
  `);

  const isAIEnabled = player2 === "AI";
  startPongGame(isAIEnabled);
}

//tournament functions
function startTournament() {
  if (players.length === 0) {
    alert('At least 1 player is required to start the tournament!');
    return;
  }
  //single player, start a match with AI
  if (players.length === 1) {
    const player1 = players[0];
    startGame(player1, "AI");
  } else {
    //two or more players, proceed with tournament
    currentMatchIndex = 0;
    showTournamentView();
  }
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

function endGame() {
  currentMatchIndex++;
  showTournamentView();
}

//leaderboard (Placeholder awaiting backend integration)
function showLeaderboard() {
  renderPage(`
    <h1>Leaderboard</h1>
    <p>Leaderboard content will be fetched from the backend.</p>
    <button onclick="showLandingPage()">Back to Home</button>
  `);
}

//initialize app
console.log("App loaded"); //only for debugging :)
showLandingPage();

