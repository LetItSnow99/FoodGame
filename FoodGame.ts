let score: number = 0;
let timeLeft: number = 60;
let currentOrder: { dish: string; ingredients: string[] } | null = null;

const scoreEl = document.getElementById("score") as HTMLElement;
const timerEl = document.getElementById("timer") as HTMLElement;
const currentOrderEl = document.getElementById("current-order") as HTMLElement;
const ingredientsNeededEl = document.getElementById("ingredients-needed") as HTMLElement;
const prepAreaEl = document.getElementById("prep-area") as HTMLElement;
const ingredientTrayEl = document.getElementById("ingredient-tray") as HTMLElement;

const dishes = [
    { dish: "Toast 🍞", ingredients: ["🍞", "🧈"] },
    { dish: "Salad 🥗", ingredients: ["🥬", "🥕", "🥒"] },
    { dish: "Hot Dog 🌭", ingredients: ["🌭", "🍞", "🧅"] },
    { dish: "Pizza 🍕", ingredients: ["🍞", "🍅", "🧀"] },
    { dish: "Pasta 🍝", ingredients: ["🍝", "🍅", "🧀", "🌿"] },
];

function startGame(): void {
    score = 0;
    timeLeft = 60;
    updateScore();
    updateTimer();
    generateOrder();
    startTimer();
}

function updateScore(): void {
    scoreEl.textContent = score.toString();
}

function updateTimer(): void {
    timerEl.textContent = timeLeft.toString();
}

function generateOrder(): void {
    currentOrder = dishes[Math.floor(Math.random() * dishes.length)];
    if (currentOrder) {
        currentOrderEl.textContent = currentOrder.dish;
        ingredientsNeededEl.innerHTML = currentOrder.ingredients
            .map((ing) => `<span class="ingredient">${ing}</span>`)
            .join("");
    }
    generateTray();
}

function generateTray(): void {
    const allIngredients = [
        "🍞", "🧈", "🥬", "🥕", "🥒", "🌭", "🍅", "🧀", "🍝", "🌿", "🥩",
    ];
    const trayIngredients = [
        ...(currentOrder?.ingredients || []),
        ...Array(5)
            .fill(null)
            .map(() => allIngredients[Math.floor(Math.random() * allIngredients.length)]),
    ].sort(() => Math.random() - 0.5);

    ingredientTrayEl.innerHTML = trayIngredients
        .map((ing) => `<span class="ingredient">${ing}</span>`)
        .join("");

    ingredientTrayEl.querySelectorAll(".ingredient").forEach((ingredientEl) => {
        ingredientEl.addEventListener("click", () =>
            addIngredient((ingredientEl as HTMLElement).textContent || "")
        );
    });
}

function addIngredient(ingredient: string): void {
    const prepItems = Array.from(prepAreaEl.children).map(
        (el) => (el as HTMLElement).textContent || ""
    );
    if (!prepItems.includes(ingredient)) {
        prepAreaEl.innerHTML += `<span class="ingredient">${ingredient}</span>`;
    }
    checkOrder();
}

function checkOrder(): void {
    const prepItems = Array.from(prepAreaEl.children).map(
        (el) => (el as HTMLElement).textContent || ""
    );
    if (
        currentOrder &&
        prepItems.sort().join("") === currentOrder.ingredients.sort().join("")
    ) {
        score += 10;
        updateScore();
        generateOrder();
        prepAreaEl.innerHTML = "";
    }
}

function startTimer(): void {
    const timerInterval = setInterval(() => {
        timeLeft--;
        updateTimer();

        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            endGame();
        }
    }, 1000);
}

function endGame(): void {
    alert(`Game Over! Your score: ${score}`);
    prepAreaEl.innerHTML = "";
    ingredientsNeededEl.innerHTML = "";
}

function saveGame(): void {
    if (currentOrder) {
        const gameState = {
            score,
            timeLeft,
            currentOrder,
            prepItems: Array.from(prepAreaEl.children).map(
                (el) => (el as HTMLElement).textContent || ""
            ),
        };
        localStorage.setItem("foodGameState", JSON.stringify(gameState));
        alert("Game Saved!");
    }
}

function loadGame(): void {
    const savedState = localStorage.getItem("foodGameState");
    if (savedState) {
        const gameState = JSON.parse(savedState);
        score = gameState.score;
        timeLeft = gameState.timeLeft;

        updateScore();
        updateTimer();
        ingredientsNeededEl.innerHTML = gameState.prepItems
            .map((item: string) => `<span class="ingredient">${item}</span>`)
            .join("");
        prepAreaEl.innerHTML = gameState.prepItems
            .map((item: string) => `<span class="ingredient">${item}</span>`)
            .join("");

        alert("Game Loaded!");
    } else {
        alert("No saved game found!");
    }
}

document.getElementById("save-game")?.addEventListener("click", saveGame);
document.getElementById("load-game")?.addEventListener("click", loadGame);

startGame();
