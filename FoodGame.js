"use strict";
var _a, _b;
let score = 0;
let timeLeft = 60;
let currentOrder = null;
const scoreEl = document.getElementById("score");
const timerEl = document.getElementById("timer");
const currentOrderEl = document.getElementById("current-order");
const ingredientsNeededEl = document.getElementById("ingredients-needed");
const prepAreaEl = document.getElementById("prep-area");
const ingredientTrayEl = document.getElementById("ingredient-tray");
const dishes = [
    { dish: "Toast 🍞", ingredients: ["🍞", "🧈"] },
    { dish: "Salad 🥗", ingredients: ["🥬", "🥕", "🥒"] },
    { dish: "Hot Dog 🌭", ingredients: ["🌭", "🍞", "🧅"] },
    { dish: "Pizza 🍕", ingredients: ["🍞", "🍅", "🧀"] },
    { dish: "Pasta 🍝", ingredients: ["🍝", "🍅", "🧀", "🌿"] },
];
function startGame() {
    score = 0;
    timeLeft = 60;
    updateScore();
    updateTimer();
    generateOrder();
    startTimer();
}
function updateScore() {
    scoreEl.textContent = score.toString();
}
function updateTimer() {
    timerEl.textContent = timeLeft.toString();
}
function generateOrder() {
    currentOrder = dishes[Math.floor(Math.random() * dishes.length)];
    if (currentOrder) {
        currentOrderEl.textContent = currentOrder.dish;
        ingredientsNeededEl.innerHTML = currentOrder.ingredients
            .map((ing) => `<span class="ingredient">${ing}</span>`)
            .join("");
    }
    generateTray();
}
function generateTray() {
    const allIngredients = [
        "🍞", "🧈", "🥬", "🥕", "🥒", "🌭", "🍅", "🧀", "🍝", "🌿", "🥩",
    ];
    const trayIngredients = [
        ...((currentOrder === null || currentOrder === void 0 ? void 0 : currentOrder.ingredients) || []),
        ...Array(5)
            .fill(null)
            .map(() => allIngredients[Math.floor(Math.random() * allIngredients.length)]),
    ].sort(() => Math.random() - 0.5);
    ingredientTrayEl.innerHTML = trayIngredients
        .map((ing) => `<span class="ingredient">${ing}</span>`)
        .join("");
    ingredientTrayEl.querySelectorAll(".ingredient").forEach((ingredientEl) => {
        ingredientEl.addEventListener("click", () => addIngredient(ingredientEl.textContent || ""));
    });
}
function addIngredient(ingredient) {
    const prepItems = Array.from(prepAreaEl.children).map((el) => el.textContent || "");
    if (!prepItems.includes(ingredient)) {
        prepAreaEl.innerHTML += `<span class="ingredient">${ingredient}</span>`;
    }
    checkOrder();
}
function checkOrder() {
    const prepItems = Array.from(prepAreaEl.children).map((el) => el.textContent || "");
    if (currentOrder &&
        prepItems.sort().join("") === currentOrder.ingredients.sort().join("")) {
        score += 10;
        updateScore();
        generateOrder();
        prepAreaEl.innerHTML = "";
    }
}
function startTimer() {
    const timerInterval = setInterval(() => {
        timeLeft--;
        updateTimer();
        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            endGame();
        }
    }, 1000);
}
function endGame() {
    alert(`Game Over! Your score: ${score}`);
    prepAreaEl.innerHTML = "";
    ingredientsNeededEl.innerHTML = "";
}
function saveGame() {
    if (currentOrder) {
        const gameState = {
            score,
            timeLeft,
            currentOrder,
            prepItems: Array.from(prepAreaEl.children).map((el) => el.textContent || ""),
        };
        localStorage.setItem("foodGameState", JSON.stringify(gameState));
        alert("Game Saved!");
    }
}
function loadGame() {
    const savedState = localStorage.getItem("foodGameState");
    if (savedState) {
        const gameState = JSON.parse(savedState);
        score = gameState.score;
        timeLeft = gameState.timeLeft;
        updateScore();
        updateTimer();
        ingredientsNeededEl.innerHTML = gameState.prepItems
            .map((item) => `<span class="ingredient">${item}</span>`)
            .join("");
        prepAreaEl.innerHTML = gameState.prepItems
            .map((item) => `<span class="ingredient">${item}</span>`)
            .join("");
        alert("Game Loaded!");
    }
    else {
        alert("No saved game found!");
    }
}
(_a = document.getElementById("save-game")) === null || _a === void 0 ? void 0 : _a.addEventListener("click", saveGame);
(_b = document.getElementById("load-game")) === null || _b === void 0 ? void 0 : _b.addEventListener("click", loadGame);
startGame();
