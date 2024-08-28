const canvas = document.getElementById('gameCanvas');
const context = canvas.getContext('2d');

const gridSize = 20;
let snake = [
    { x: 200, y: 200 },
    { x: 180, y: 200 },
    { x: 160, y: 200 },
    { x: 140, y: 200 },
]; 
let dx = gridSize;
let dy = 0; 
let food = getRandomFoodPosition(); 
let directionChanged = false;
let gameRunning = true; 
let score = 0; 
let highScore = localStorage.getItem('highScore') || 0; 

let frameCount = 0; 
const moveInterval = 2; 

function drawSnake() {
    context.fillStyle = 'green';
    
    snake.forEach(segment => {
        context.fillRect(segment.x, segment.y, gridSize, gridSize);
    });
}

function drawFood() {
    context.fillStyle = 'yellow';
    context.fillRect(food.x, food.y, gridSize, gridSize);
}

function moveSnake() {
    const head = { x: snake[0].x + dx, y: snake[0].y + dy };

    snake.unshift(head);

    if (head.x === food.x && head.y === food.y) {
        food = getRandomFoodPosition();
        score++; // Incrementa a pontuação
    } else {
        snake.pop();
    }

    directionChanged = false;
}

function checkCollisions() {
    const head = snake[0];

    if (head.x < 0 || head.x >= canvas.width || head.y < 0 || head.y >= canvas.height) {
        gameRunning = false;
    }

    // Verifica colisão com o corpo da cobra
    for (let i = 1; i < snake.length; i++) {
        if (head.x === snake[i].x && head.y === snake[i].y) {
            gameRunning = false;
        }
    }
}

function getRandomFoodPosition() {
    let newFoodPosition;
    let isOnSnake;

    do {
        isOnSnake = false;
        const x = Math.floor(Math.random() * (canvas.width / gridSize)) * gridSize;
        const y = Math.floor(Math.random() * (canvas.height / gridSize)) * gridSize;
        newFoodPosition = { x, y };

        for (let segment of snake) {
            if (segment.x === newFoodPosition.x && segment.y === newFoodPosition.y) {
                isOnSnake = true;
                break;
            }
        }
    } while (isOnSnake);

    return newFoodPosition;
}

function changeDirection(event) {
    if (directionChanged) return; 

    const keyPressed = event.key;

    if (keyPressed === 'ArrowUp' && dy === 0) {
        dx = 0;
        dy = -gridSize;
    } else if (keyPressed === 'ArrowDown' && dy === 0) {
        dx = 0;
        dy = gridSize;
    } else if (keyPressed === 'ArrowLeft' && dx === 0) {
        dx = -gridSize;
        dy = 0;
    } else if (keyPressed === 'ArrowRight' && dx === 0) {
        dx = gridSize;
        dy = 0;
    }

    directionChanged = true;
}

function updateGame() {
    if (!gameRunning) {
        handleGameOver();
        return;
    }

    context.clearRect(0, 0, canvas.width, canvas.height); 

    frameCount++;
    if (frameCount === moveInterval) {
        moveSnake();
        frameCount = 0;
    }

    drawSnake();
    drawFood();
    checkCollisions();
    drawScore(); 
}

function handleGameOver() {
    alert(`Game Over! Sua pontuação foi: ${score}${score > highScore ? ' - Novo Recorde!' : ''}`);
    
    if (score > highScore) {
        highScore = score;
        localStorage.setItem('highScore', highScore);
    }

    snake = [
        { x: 200, y: 200 },
        { x: 180, y: 200 },
        { x: 160, y: 200 },
        { x: 140, y: 200 },
    ];
    dx = gridSize;
    dy = 0;
    food = getRandomFoodPosition();
    gameRunning = true;
    score = 0; 
}

function drawScore() {
    context.fillStyle = 'black';
    context.font = '16px Arial';
    context.fillText(`Pontuação: ${score}`, canvas.width - 120, 20);
    context.fillText(`Recorde: ${highScore}`, canvas.width - 120, 40);
}

const gameInterval = setInterval(updateGame, 50);

document.addEventListener('keydown', changeDirection);
