const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const gridSize = 20;
const snakeSize = gridSize;
const initialSnakeLength = 3;
const snakeRadius = snakeSize / 2;

let snake = [];
let food = {};
let direction = "right";
let score = 0;

function init() {
    snake = [];
    for (let i = initialSnakeLength - 1; i >= 0; i--) {
        snake.push({ x: i, y: 0 });
    }
    generateFood();
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height); 

    // Draw the snake
    ctx.fillStyle = "#00bcd4";
    snake.forEach((segment, index) => {
        if (index === 0) {
            drawTriangle(segment.x * gridSize + snakeRadius, segment.y * gridSize + snakeRadius, direction);
        } else {
            ctx.beginPath();
            ctx.arc((segment.x * gridSize) + snakeRadius, (segment.y * gridSize) + snakeRadius, snakeRadius, 0, Math.PI * 2);
            ctx.fill();
            ctx.strokeStyle = "#00796b";
            ctx.stroke();
        }
    });

    // Draw the food
    ctx.fillStyle = "#ff4081";
    ctx.beginPath();
    ctx.arc((food.x * gridSize) + snakeRadius, (food.y * gridSize) + snakeRadius, snakeRadius, 0, Math.PI * 2);
    ctx.fill();

    // Draw the score
    ctx.fillStyle = "#009688";
    ctx.font = "20px Arial";
    ctx.fillText("Score: " + score, 10, canvas.height - 10);
}

function update() {
    const head = { ...snake[0] };

    switch (direction) {
        case "up":
            head.y -= 1;
            break;
        case "down":
            head.y += 1;
            break;
        case "left":
            head.x -= 1;
            break;
        case "right":
            head.x += 1;
            break;
    }

    if (head.x < 0 || head.x >= canvas.width / gridSize || head.y < 0 || head.y >= canvas.height / gridSize) {
        resetGame();
        return;
    }

    if (head.x === food.x && head.y === food.y) {
        score++;
        snake.unshift({ ...food });
        generateFood();
    } else {
        snake.pop();
        snake.unshift(head);
    }

    for (let i = 1; i < snake.length; i++) {
        if (head.x === snake[i].x && head.y === snake[i].y) {
            resetGame();
            return;
        }
    }
}

function generateFood() {
    food = {
        x: Math.floor(Math.random() * (canvas.width / gridSize)),
        y: Math.floor(Math.random() * (canvas.height / gridSize))
    };

    // Ensure the food does not appear on the snake
    while (snake.some(segment => segment.x === food.x && segment.y === food.y)) {
        food = {
            x: Math.floor(Math.random() * (canvas.width / gridSize)),
            y: Math.floor(Math.random() * (canvas.height / gridSize))
        };
    }
}

function resetGame() {
    score = 0;
    init();
}

function gameLoop() {
    update();
    draw();
}

document.addEventListener("keydown", (e) => {
    switch (e.key) {
        case "ArrowUp":
            if (direction !== "down") direction = "up";
            break;
        case "ArrowDown":
            if (direction !== "up") direction = "down";
            break;
        case "ArrowLeft":
            if (direction !== "right") direction = "left";
            break;
        case "ArrowRight":
            if (direction !== "left") direction = "right";
            break;
    }
});

init();
setInterval(gameLoop, 150);

function drawTriangle(x, y, direction) {
    ctx.beginPath();
    switch (direction) {
        case "up":
            ctx.moveTo(x, y);
            ctx.lineTo(x - snakeRadius, y + snakeRadius);
            ctx.lineTo(x + snakeRadius, y + snakeRadius);
            break;
        case "down":
            ctx.moveTo(x, y);
            ctx.lineTo(x - snakeRadius, y - snakeRadius);
            ctx.lineTo(x + snakeRadius, y - snakeRadius);
            break;
        case "left":
            ctx.moveTo(x, y);
            ctx.lineTo(x + snakeRadius, y - snakeRadius);
            ctx.lineTo(x + snakeRadius, y + snakeRadius);
            break;
        case "right":
            ctx.moveTo(x, y);
            ctx.lineTo(x - snakeRadius, y - snakeRadius);
            ctx.lineTo(x - snakeRadius, y + snakeRadius);
            break;
    }
    ctx.closePath();
    ctx.fill();
}