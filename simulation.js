const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

let players = [];
let alliances = [];

function generateRandomName() {
  const first = ["Lee", "Kim", "Park", "Choi", "Song", "Shin"];
  const last = ["Ji-hoon", "Min-su", "Yeon", "Tae-hyun", "Ha-eun", "Seo-jun"];
  return `${first[Math.floor(Math.random() * first.length)]} ${last[Math.floor(Math.random() * last.length)]}`;
}

function createPlayers() {
  players = [];
  alliances = [];
  for (let i = 1; i <= 456; i++) {
    players.push({
      id: i,
      name: generateRandomName(),
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      alive: true,
      stats: {
        strength: Math.random(),
        agility: Math.random(),
        luck: Math.random(),
        intelligence: Math.random(),
        trust: Math.random(),
        betrayal: Math.random(),
      },
    });
  }
  formAlliances();
}

function formAlliances() {
  alliances = [];
  const alivePlayers = players.filter((p) => p.alive);
  for (let i = 0; i < alivePlayers.length; i += 2) {
    if (alivePlayers[i + 1]) {
      alliances.push([alivePlayers[i].id, alivePlayers[i + 1].id]);
    }
  }
}

function drawPlayers() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (const p of players) {
    ctx.fillStyle = p.alive ? "#0f0" : "#f00";
    ctx.beginPath();
    ctx.arc(p.x, p.y, 3, 0, Math.PI * 2);
    ctx.fill();
  }
}

function simulateRedLightGreenLight() {
  for (let p of players) {
    if (p.alive && Math.random() > (p.stats.agility + p.stats.luck) / 2) {
      p.alive = false;
    }
  }
}

function simulateHoneycomb() {
  for (let p of players) {
    if (p.alive && Math.random() > p.stats.intelligence) {
      p.alive = false;
    }
  }
}

function simulateTugOfWar() {
  const teams = [];
  const alive = players.filter((p) => p.alive);
  for (let i = 0; i < alive.length; i += 4) {
    teams.push(alive.slice(i, i + 4));
  }
  for (let i = 0; i < teams.length; i += 2) {
    if (teams[i + 1]) {
      const teamA = teams[i];
      const teamB = teams[i + 1];
      const strengthA = teamA.reduce((acc, p) => acc + p.stats.strength, 0);
      const strengthB = teamB.reduce((acc, p) => acc + p.stats.strength, 0);
      const losingTeam = strengthA >= strengthB ? teamB : teamA;
      for (let p of losingTeam) p.alive = false;
    }
  }
}

function simulateMarbles() {
  formAlliances(); // Re-pair alive players
  for (let pair of alliances) {
    const [id1, id2] = pair;
    const p1 = players.find((p) => p.id === id1 && p.alive);
    const p2 = players.find((p) => p.id === id2 && p.alive);
    if (p1 && p2) {
      const betrayer = Math.random() < p1.stats.betrayal ? p1 : p2;
      const victim = betrayer === p1 ? p2 : p1;
      victim.alive = false;
    }
  }
}

function simulateGlassBridge() {
  const alive = players.filter((p) => p.alive);
  for (let i = 0; i < alive.length; i++) {
    if (Math.random() > alive[i].stats.luck) {
      alive[i].alive = false;
    }
  }
}

function simulateFinalSquidGame() {
  const alive = players.filter((p) => p.alive);
  if (alive.length === 2) {
    const p1 = alive[0];
    const p2 = alive[1];
    const power1 = p1.stats.strength + p1.stats.intelligence + Math.random();
    const power2 = p2.stats.strength + p2.stats.intelligence + Math.random();
    const loser = power1 >= power2 ? p2 : p1;
    loser.alive = false;
  }
}

function updateStatsPanel() {
  const list = document.getElementById("playerList");
  list.innerHTML = "";
  players
    .filter((p) => p.alive)
    .forEach((p) => {
      const div = document.createElement("div");
      div.innerHTML = `<span data-id="${p.id}" style="cursor:pointer;">#${p.id} ${p.name}</span> | STR: ${p.stats.strength.toFixed(
        2
      )} AGI: ${p.stats.agility.toFixed(2)} LCK: ${p.stats.luck.toFixed(2)} INT: ${p.stats.intelligence.toFixed(
        2
      )}`;
      list.appendChild(div);
    });
}

function showLeaderboard() {
  const sorted = [...players].sort((a, b) => (a.alive === b.alive ? 0 : a.alive ? -1 : 1));
  const lb = document.getElementById("leaderboard");
  const list = document.getElementById("leaderboardList");
  list.innerHTML = "";
  lb.classList.remove("hidden");

  for (let p of sorted) {
    const li = document.createElement("li");
    li.textContent = `#${p.id} ${p.name} - ${p.alive ? "🟢 ALIVE" : "🔴 DEAD"}`;
    list.appendChild(li);
  }
}

function startSimulation() {
  createPlayers();
  drawPlayers();
  updateStatsPanel();

  setTimeout(() => {
    simulateRedLightGreenLight();
    drawPlayers();
    updateStatsPanel();
    alert("Red Light, Green Light complete!");

    setTimeout(() => {
      simulateHoneycomb();
      drawPlayers();
      updateStatsPanel();
      alert("Honeycomb complete!");

      setTimeout(() => {
        simulateTugOfWar();
        drawPlayers();
        updateStatsPanel();
        alert("Tug of War complete!");

        setTimeout(() => {
          simulateMarbles();
          drawPlayers();
          updateStatsPanel();
          alert("Marbles complete!");

          setTimeout(() => {
            simulateGlassBridge();
            drawPlayers();
            updateStatsPanel();
            alert("Glass Bridge complete!");

            setTimeout(() => {
              simulateFinalSquidGame();
              drawPlayers();
              updateStatsPanel();
              alert("Final 1v1 Squid Game complete!");
              showLeaderboard();
            }, 3000);
          }, 3000);
        }, 3000);
      }, 3000);
    }, 3000);
  }, 3000);
}

function saveSimulation() {
  const state = JSON.stringify(players);
  localStorage.setItem("squid_sim_save", state);
  alert("Simulation saved!");
}

function loadSimulation() {
  const state = localStorage.getItem("squid_sim_save");
  if (!state) return alert("No save found!");
  players = JSON.parse(state);
  drawPlayers();
  updateStatsPanel();
  alert("Simulation loaded!");
}

document.getElementById("playerList").addEventListener("click", (e) => {
  if (e.target && e.target.dataset && e.target.dataset.id) {
    const p = players.find((pl) => pl.id == e.target.dataset.id);
    if (p) showProfile(p);
  }
});

function showProfile(player) {
  document.getElementById("profileModal").classList.remove("hidden");
  document.getElementById("profileName").textContent = `#${player.id} ${player.name}`;
  document.getElementById("profileStats").textContent = 
`STR: ${player.stats.strength.toFixed(2)}
AGI: ${player.stats.agility.toFixed(2)}
LCK: ${player.stats.luck.toFixed(2)}
INT: ${player.stats.intelligence.toFixed(2)}
Trust: ${player.stats.trust.toFixed(2)}
Betrayal: ${player.stats.betrayal.toFixed(2)}`;
}

function closeProfile() {
  document.getElementById("profileModal").classList.add("hidden");
}
