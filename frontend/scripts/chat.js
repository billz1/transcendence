const chatForm = document.getElementById("chat-form");
const chatWindow = document.getElementById("chat-window");

chatForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const message = document.getElementById("chat-message").value;
    const messageNode = document.createElement("div");
    messageNode.innerText = `You: ${message}`;
    chatWindow.appendChild(messageNode);
    document.getElementById("chat-message").value = "";

    console.log(`Sending message: ${message}`);
    // Placeholder for sending message via WebSocket
});
