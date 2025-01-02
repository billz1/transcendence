const statsWins = document.getElementById("stats-wins");
const statsLosses = document.getElementById("stats-losses");
const matchHistory = document.getElementById("match-history");

//load stats
function loadStats()
{
    const stats = JSON.parse(localStorage.getItem("stats")) || { wins: 0, losses: 0 };
    statsWins.textContent = stats.wins;
    statsLosses.textContent = stats.losses;
}

//save match result
function saveMatch(winner)
{
    const stats = JSON.parse(localStorage.getItem("stats")) || { wins: 0, losses: 0 };
    if (winner === "player1") stats.wins++;
    else stats.losses++;
    localStorage.setItem("stats", JSON.stringify(stats));
    const historyItem = document.createElement("li");
    historyItem.textContent = `${winner} won!`;
    matchHistory.appendChild(historyItem);
}

//load history
function loadHistory()
{
    matchHistory.innerHTML = "";
    const history = JSON.parse(localStorage.getItem("history")) || [];
    history.forEach((match) => {
        const historyItem = document.createElement("li");
        historyItem.textContent = match;
        matchHistory.appendChild(historyItem);
    });
}
loadStats();
loadHistory();
