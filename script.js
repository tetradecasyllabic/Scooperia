// --- Game State ---
let gameState = loadGame() || {
  day: 1,
  money: 0,
  customers: [],
  unlockedToppings: ["sprinkles"]
};

const names = ["Alex", "Maya", "Jordan", "Sam", "Luna", "Chris", "Riley", "Ava"];

// --- Utilities ---
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

// --- Display Customers ---
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
let currentStep = 0;
function doStep(stepName) {
  if (currentStep === 0 && stepName === "roll") {
    currentStep = 1;
    showResult("You rolled the dough 🍪");
  } else if (currentStep === 1 && stepName === "bake") {
    currentStep = 2;
    showResult("You baked the dough 🔥");
  } else if (currentStep === 2 && stepName === "scoop") {
    currentStep = 3;
    showResult("You scooped ice cream 🍦");
  } else if (currentStep === 3 && stepName === "topping") {
    currentStep = 4;
    showResult("You added toppings 🍫");
  } else if (currentStep === 4 && stepName === "finish") {
    finishOrder();
  } else {
    showResult("Wrong step ❌");
  }
}

function showResult(msg) {
  document.getElementById("orderResult").innerText = msg;
}

function finishOrder() {
  currentStep = 0;
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

// --- UI Update ---
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

// --- Button Hooks ---
document.getElementById("rollDough").onclick = () => doStep("roll");
document.getElementById("bakeDough").onclick = () => doStep("bake");
document.getElementById("scoopIceCream").onclick = () => doStep("scoop");
document.getElementById("addTopping").onclick = () => doStep("topping");
document.getElementById("finishOrder").onclick = () => doStep("finish");
