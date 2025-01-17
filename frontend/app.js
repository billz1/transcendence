const app = document.getElementById('app');

let players = [];
let currentMatchIndex = 0;

function renderPage(content) {
  app.innerHTML = content;
}

let currentUser = null;

//fetch logged in user nnfo
async function fetchUser() {
  try {
    const response = await fetch('/auth/me/', {
      method: 'GET',
      credentials: 'include',
    });
    if (response.ok) {
      currentUser = await response.json();
    } else {
      currentUser = null;
    }
  } catch (error) {
    console.error('Error fetching user:', error);
    currentUser = null;
  }
  updateNavbar();
}

const API_BASE_URL = 'http://127.0.0.1:8000';

function loginWith42() {
  window.location.href = `${API_BASE_URL}/auth/login/`; // Dynamically build the URL
}



function showLandingPage() {
  renderPage(`
    <h1>Welcome to the Pong Contest</h1>
    <div id="userSection"></div> <!-- User Section -->
    <button onclick="showGameLobby()">Join Tournament</button>
    <button onclick="showLeaderboard()">View Leaderboard</button>
    <button onclick="showStatsPage()">View Stats</button>
    <button onclick="window.location.href='http://localhost:8000/auth/login/'">Login with 42</button>

  `);
  fetchUser();
}


function updateNavbar() {
  const navSection = document.getElementById('userSection');
  if (currentUser) {
    //show logged-in user info (not yet working fully)
    navSection.innerHTML = `
      <div>
        <img src="${currentUser.avatar || 'default-avatar.png'}" alt="Avatar" style="width:40px; height:40px; border-radius:50%; margin-right:10px;">
        <strong>${currentUser.username}</strong>
        <button onclick="logout()">Logout</button>
      </div>
    `;
  } else {
    
    navSection.innerHTML = `
      <button onclick="loginWith42()">Login with 42</button>
    `;
  }
}

async function logout() {
  try {
    const response = await fetch('/auth/logout/', {
      method: 'POST',
      credentials: 'include',
    });
    if (response.ok) {
      currentUser = null;
      updateNavbar();
    } else {
      alert('Failed to log out.');
    }
  } catch (error) {
    console.error('Error logging out:', error);
  }
}

function showGameLobby() {
  console.log("Game lobby is being shown"); //debugging
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
    <h1>Pong Arena</h1>
    <canvas id="pongCanvas" width="800" height="400"></canvas>
    <p>Players: <strong>${player1}</strong> (Left) vs <strong>${player2}</strong> (Right)</p>
    <button onclick="endGame()">End Game</button>
    <button onclick="showTournamentView()">Back to Tournament</button>
  `);

  const isAIEnabled = player2 === "AI";
  startPongGame(isAIEnabled);
}

function startTournament() {
  if (players.length === 0) {
    alert('At least 1 player is required to start the tournament!');
    return;
  }
  //make single player start a match with AI
  if (players.length === 1) {
    const player1 = players[0];
    startGame(player1, "AI");
  } else {
    //two or more players
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
      <button onclick="showStatsPage()">View Stats</button>
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

//initialize app (debugging)
console.log("App loaded");
showLandingPage();

//mock webSocket to be replaced with backend websocket -- simulates real time chat using a shared message array and subscriber callbacks
const mockWebSocket = (() => {
  const messages = [];
  const subscribers = [];

  return {
    send: (message) => {
      messages.push(message);
      subscribers.forEach((callback) => callback(messages));
    },
    subscribe: (callback) => {
      subscribers.push(callback);
      callback(messages);
    },
  };
})();

function renderChatbox() {
  const chatHTML = `
    <div class="chat-container">
      <div class="chat-header">Live Chat</div>
      <div id="chatMessages" class="chat-messages"></div>
      <div class="chat-input">
        <input type="text" id="chatInput" placeholder="Type your message here..." />
        <button onclick="sendMessage()">Send</button>
      </div>
    </div>
  `;

  document.body.insertAdjacentHTML('beforeend', chatHTML);

  mockWebSocket.subscribe(updateChatMessages);
}

function updateChatMessages(messages) {
  const chatMessagesDiv = document.getElementById('chatMessages');
  if (chatMessagesDiv) {
    chatMessagesDiv.innerHTML = messages
      .map((msg) => `<p>${msg}</p>`)
      .join('');
    chatMessagesDiv.scrollTop = chatMessagesDiv.scrollHeight;//
  }
}

function sendMessage() {
  const chatInput = document.getElementById('chatInput');
  if (chatInput && chatInput.value.trim() !== '') {
    const message = `Player: ${chatInput.value.trim()}`;
    mockWebSocket.send(message);
    chatInput.value = '';
  }
}

renderChatbox();

//note: the stats are mock ups for now because we dont have a backend yet, i'm using temp in-memory storage
//stats Storage (Temporary In-Memory Storage)
const userStats = {
  players: {},
};

const gameStats = [];

function initializePlayerStats(playerName) {
  if (!userStats.players[playerName]) {
    userStats.players[playerName] = {
      matchesPlayed: 0,
      wins: 0,
      losses: 0,
    };
  }
}

function updateStats(winner, loser) {
  initializePlayerStats(winner);
  initializePlayerStats(loser);

  userStats.players[winner].matchesPlayed++;
  userStats.players[winner].wins++;
  userStats.players[loser].matchesPlayed++;
  userStats.players[loser].losses++;

  console.log("Updated user stats:", userStats);
}

//sdd general game stats
function addGameStats(duration, avgBallSpeed) {
  gameStats.push({
    duration,
    avgBallSpeed,
  });
  console.log("Updated game stats:", gameStats);
}

//to display the stats page i added the html here so its easy to debug as all the logic is in this file, just a lazy mans choice
function showStatsPage() {
  renderPage(`
    <div class="stats-container">
      <div class="stats-header">User and Game Stats</div>
      <div class="stats-section">
        <h2>User Stats</h2>
        <div id="userStats">
          ${Object.entries(userStats.players)
            .map(
              ([name, stats]) => `
            <div class="stats-item">
              <strong>${name}</strong>: 
              Matches Played: ${stats.matchesPlayed}, Wins: ${stats.wins}, Losses: ${stats.losses}
            </div>
          `
            )
            .join('')}
        </div>
      </div>
      <div class="stats-section">
        <h2>Game Stats</h2>
        <canvas id="gameStatsChart" class="stats-chart"></canvas>
      </div>
      <button onclick="showLandingPage()">Back to Home</button>
    </div>
  `);

  renderGameStatsChart();
}

function renderGameStatsChart() {
  const ctx = document.getElementById('gameStatsChart').getContext('2d');
  const durations = gameStats.map((stat) => stat.duration);
  const avgSpeeds = gameStats.map((stat) => stat.avgBallSpeed);

  new Chart(ctx, {
    type: 'line',
    data: {
      labels: durations.map((_, i) => `Game ${i + 1}`),
      datasets: [
        {
          label: 'Match Duration (s)',
          data: durations,
          borderColor: '#61dafb',
          borderWidth: 2,
          fill: false,
        },
        {
          label: 'Avg Ball Speed (px/frame)',
          data: avgSpeeds,
          borderColor: '#4caf50',
          borderWidth: 2,
          fill: false,
        },
      ],
    },
    options: {
      responsive: true,
      scales: {
        x: {
          title: {
            display: true,
            text: 'Games',
            color: '#fff',
          },
        },
        y: {
          title: {
            display: true,
            text: 'Values',
            color: '#fff',
          },
          ticks: {
            color: '#fff',
          },
        },
      },
      plugins: {
        legend: {
          labels: {
            color: '#fff',
          },
        },
      },
    },
  });
}

//modification for the end game logic
function endGame() {
  //mock stats just for testing
  const duration = Math.floor(Math.random() * 200) + 50;
  const avgBallSpeed = Math.random() * 10 + 5;

  //determine winner and loser (mocked for now so player always wins lol but only for the stats)
  const winner = players[currentMatchIndex];
  const loser = players[currentMatchIndex + 1] || "AI";

  updateStats(winner, loser);
  addGameStats(duration, avgBallSpeed);

  currentMatchIndex++;
  showTournamentView();
}
