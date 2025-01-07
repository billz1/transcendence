// Optional Features
console.log("Optional features loaded!");

// Enable Remote Players via WebSocket (requires backend)
function enableRemotePlayers() {
  const socket = new WebSocket("ws://localhost:8000/game");

  socket.onopen = () => {
    console.log("Connected to WebSocket server.");
    alert("Remote players feature enabled!");
  };

  socket.onmessage = (event) => {
    const data = JSON.parse(event.data);
    console.log("Received message:", data);

    // Example: Sync ball position or paddle movements
    if (data.type === "update") {
      updateGameState(data.payload);
    }
  };

  socket.onclose = () => {
    console.log("Disconnected from WebSocket server.");
  };

  // Send game updates
  function sendGameUpdate(update) {
    socket.send(JSON.stringify({ type: "update", payload: update }));
  }

  // Placeholder for updating game state
  function updateGameState(state) {
    console.log("Game state updated:", state);
  }
}

// Add Live Chat
function enableLiveChat() {
  const chatBox = document.createElement("div");
  chatBox.id = "chatBox";
  chatBox.innerHTML = `
    <div id="chatMessages" style="border: 1px solid #61dafb; height: 150px; overflow-y: auto; margin-bottom: 10px;"></div>
    <form id="chatForm">
      <input type="text" id="chatInput" placeholder="Type your message" required>
      <button type="submit">Send</button>
    </form>
  `;

  document.body.appendChild(chatBox);

  const chatMessages = document.getElementById("chatMessages");
  const chatForm = document.getElementById("chatForm");
  const chatInput = document.getElementById("chatInput");

  chatForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const message = chatInput.value.trim();
    if (message) {
      const messageElement = document.createElement("p");
      messageElement.textContent = `You: ${message}`;
      chatMessages.appendChild(messageElement);
      chatInput.value = "";

      // Send to WebSocket (backend integration required)
      console.log(`Message sent: ${message}`);
    }
  });
}

// Add Game Customization Options
function enableGameCustomization() {
  renderPage(`
    <h1>Game Customization</h1>
    <form id="customizationForm">
      <label for="paddleSize">Paddle Size:</label>
      <select id="paddleSize">
        <option value="100">Normal</option>
        <option value="150">Large</option>
        <option value="50">Small</option>
      </select>
      <br><br>
      <label for="ballSpeed">Ball Speed:</label>
      <select id="ballSpeed">
        <option value="5">Normal</option>
        <option value="8">Fast</option>
        <option value="3">Slow</option>
      </select>
      <br><br>
      <button type="submit">Save</button>
    </form>
    <button onclick="showLandingPage()">Back to Home</button>
  `);

  const form = document.getElementById("customizationForm");
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const paddleSize = document.getElementById("paddleSize").value;
    const ballSpeed = document.getElementById("ballSpeed").value;

    localStorage.setItem("paddleSize", paddleSize);
    localStorage.setItem("ballSpeed", ballSpeed);

    alert("Game customization saved!");
    showLandingPage();
  });
}

// Initialization for Optional Features
function initializeOptionalFeatures() {
  enableRemotePlayers();
  enableLiveChat();
  enableGameCustomization();
}

initializeOptionalFeatures();
