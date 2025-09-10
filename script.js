// --- Game State ---
let gameState = loadGame() || {
  day: 1,
  money: 0,
  customers: [],
  unlockedToppings: ["sprinkles"]
};

const names = ["Alex", "Maya", "Jordan", "Sam", "Luna", "Chris", "Riley", "Ava"];

// --- Save/Load ---
function saveGame() {
  localStorage.setItem("scooperiaSave", JSON.stringify(gameState));
}
function loadGame() {
  let data = localStorage.getItem("scooperiaSave");
  return data ? JSON.parse(data) : null;
}

// --- Day System ---
function getCustomersForDay(day) {
  let count = day <= 5 ? Math.floor(Math.random() * 3) + 1 : Math.floor(Math.random() * 8) + 3;
  let customers = [];
  for (let i = 0; i < count; i++) {
    let name = names[Math.floor(Math.random() * names.length)];
    customers.push({ name, orderDone: false });
  }
  return customers;
}

function renderCustomers() {
  const area = document.getElementById("customerArea");
  area.innerHTML = "";
  gameState.customers.forEach(cust => {
    let div = document.createElement("div");
    div.className = "customer";
    div.innerText = `😀 ${cust.name}`;
    area.appendChild(div);
  });
}

// --- Order Flow ---
let step = 0;

// 🥄 ROLLING DOUGH
let rollProgress = 0;
function startRolling() {
  if (step !== 0) return;
  let canvas = document.getElementById("rollGame");
  let ctx = canvas.getContext("2d");
  rollProgress = 0;

  canvas.onmousemove = () => {
    rollProgress += 1;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#c96";
    ctx.beginPath();
    ctx.arc(150, 75, rollProgress, 0, Math.PI * 2);
    ctx.fill();

    if (rollProgress > 60) {
      step = 1;
      canvas.onmousemove = null;
      showResult("Dough rolled! 🍪");
    }
  };
}

// 🔥 BAKING
let bakeTime = 0, bakeTarget = 0, baking = false;
function startBaking() {
  if (step !== 1) return;
  let canvas = document.getElementById("bakeGame");
  let ctx = canvas.getContext("2d");
  bakeTime = 0;
  bakeTarget = 100 + Math.random() * 50;
  baking = true;

  let interval = setInterval(() => {
    if (!baking) { clearInterval(interval); return; }
    bakeTime += 5;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "orange";
    ctx.fillRect(0, 0, bakeTime, 50);

    if (bakeTime >= 200) {
      baking = false;
      step = 2;
      showResult("Dough baked! 🔥");
      clearInterval(interval);
    }
  }, 100);

  canvas.onclick = () => {
    baking = false;
    clearInterval(interval);
    if (Math.abs(bakeTime - bakeTarget) < 30) {
      step = 2;
      showResult("Perfect bake! ⭐");
    } else {
      step = 2;
      showResult("Over/undercooked 😬");
    }
  };
}

// 🍨 SCOOPING
function startScooping() {
  if (step !== 2) return;
  let canvas = document.getElementById("scoopGame");
  let ctx = canvas.getContext("2d");
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  let scoop = { x: 20, y: 20, grabbed: false };
  let cookie = { x: 130, y: 100, r: 40 };

  canvas.onmousedown = e => {
    if (e.offsetX > scoop.x && e.offsetX < scoop.x + 30 && e.offsetY > scoop.y && e.offsetY < scoop.y + 30) {
      scoop.grabbed = true;
    }
  };
  canvas.onmouseup = () => {
    scoop.grabbed = false;
    // check drop
    let dx = scoop.x - cookie.x, dy = scoop.y - cookie.y;
    if (Math.sqrt(dx * dx + dy * dy) < cookie.r) {
      step = 3;
      showResult("Scooped ice cream! 🍦");
    }
  };
  canvas.onmousemove = e => {
    if (scoop.grabbed) {
      scoop.x = e.offsetX - 15;
      scoop.y = e.offsetY - 15;
    }
    draw();
  };

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    // cookie
    ctx.fillStyle = "#d2a679";
    ctx.beginPath();
    ctx.arc(cookie.x, cookie.y, cookie.r, 0, Math.PI * 2);
    ctx.fill();
    // scoop
    ctx.fillStyle = "pink";
    ctx.beginPath();
    ctx.arc(scoop.x + 15, scoop.y + 15, 15, 0, Math.PI * 2);
    ctx.fill();
  }
  draw();
}

// 🍫 TOPPING
function addTopping() {
  if (step !== 3) return;
  step = 4;
  showResult("Added toppings 🍫");
}

// ✅ FINISH ORDER
function finishOrder() {
  if (step !== 4) return;
  step = 0;
  let cust = gameState.customers.find(c => !c.orderDone);
  if (cust) {
    cust.orderDone = true;
    gameState.money += 10;
    showResult(`${cust.name} is happy! ⭐ +$10`);
    saveGame();
    checkDayEnd();
  }
}

function checkDayEnd() {
  if (gameState.customers.every(c => c.orderDone)) {
    gameState.day++;
    gameState.customers = getCustomersForDay(gameState.day);
    saveGame();
    updateUI();
  }
}

// --- UI ---
function updateUI() {
  document.getElementById("dayDisplay").innerText = `Day ${gameState.day} | Money: $${gameState.money}`;
  renderCustomers();
}

// --- Init ---
if (gameState.customers.length === 0) {
  gameState.customers = getCustomersForDay(gameState.day);
  saveGame();
}
updateUI();

function showResult(msg) {
  document.getElementById("orderResult").innerText = msg;
}
