const tournamentBracket = document.getElementById("tournament-bracket");
const players = [];

// Add player
document.getElementById("tournament-form").addEventListener("submit", (event) => {
    event.preventDefault();
    const playerName = document.getElementById("tournament-player").value;
    players.push({ name: playerName, wins: 0 });
    updateBracket();
});

// Update bracket
function updateBracket() {
    tournamentBracket.innerHTML = "";
    players.forEach((player, index) => {
        const playerDiv = document.createElement("div");
        playerDiv.textContent = `${index + 1}. ${player.name}`;
        tournamentBracket.appendChild(playerDiv);
    });
}

// Simulate match
document.getElementById("tournament-section").addEventListener("dblclick", () => {
    if (players.length < 2) {
        alert("At least 2 players required.");
        return;
    }
    const winner = players[Math.floor(Math.random() * players.length)];
    winner.wins++;
    alert(`${winner.name} wins this round!`);
    updateBracket();
});
