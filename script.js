const canvas = document.getElementById('gameCanvas');
const context = canvas.getContext('2d');

const gridSize = 20; // Tamanho de cada segmento da cobra
let snake = [
    { x: 200, y: 200 },
    { x: 180, y: 200 },
    { x: 160, y: 200 },
    { x: 140, y: 200 },
]; // Inicializa a cobra com 4 segmentos
let dx = gridSize; // Delta x (movimento em x)
let dy = 0; // Delta y (movimento em y)
let food = getRandomFoodPosition(); // Inicializa a comida em uma posição aleatória
let directionChanged = false; // Variável para impedir a mudança de direção para o oposto imediatamente
let gameRunning = true; // Variável para verificar se o jogo está em execução
let score = 0; // Inicializa a pontuação
let highScore = localStorage.getItem('highScore') || 0; // Carrega o recorde do armazenamento local

let frameCount = 0; // Contador de quadros para controle de movimento
const moveInterval = 2; // Define a frequência de movimento da cobra (ajustado para 20 FPS para manter velocidade original)

// Função para desenhar a cobra
function drawSnake() {
    context.fillStyle = 'green';
    
    // Desenha cada segmento da cobra
    snake.forEach(segment => {
        context.fillRect(segment.x, segment.y, gridSize, gridSize);
    });
}

// Função para desenhar a comida
function drawFood() {
    context.fillStyle = 'yellow';
    context.fillRect(food.x, food.y, gridSize, gridSize);
}

// Função para atualizar a posição da cobra
function moveSnake() {
    // Cria um novo segmento na direção atual
    const head = { x: snake[0].x + dx, y: snake[0].y + dy };

    // Adiciona o novo segmento no início do array
    snake.unshift(head);

    // Verifica se a cobra comeu a comida
    if (head.x === food.x && head.y === food.y) {
        // Gera nova comida em posição aleatória
        food = getRandomFoodPosition();
        score++; // Incrementa a pontuação
    } else {
        // Remove o último segmento para que a cobra pareça se mover
        snake.pop();
    }

    // Permite a mudança de direção novamente
    directionChanged = false;
}

// Função para verificar colisões
function checkCollisions() {
    const head = snake[0];

    // Verifica colisão com bordas
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

// Função para obter uma posição aleatória para a comida, garantindo que não esteja na cobra
function getRandomFoodPosition() {
    let newFoodPosition;
    let isOnSnake;

    do {
        isOnSnake = false;
        const x = Math.floor(Math.random() * (canvas.width / gridSize)) * gridSize;
        const y = Math.floor(Math.random() * (canvas.height / gridSize)) * gridSize;
        newFoodPosition = { x, y };

        // Verifica se a comida está na cobra
        for (let segment of snake) {
            if (segment.x === newFoodPosition.x && segment.y === newFoodPosition.y) {
                isOnSnake = true;
                break;
            }
        }
    } while (isOnSnake);

    return newFoodPosition;
}

// Função para atualizar a direção com base na tecla pressionada
function changeDirection(event) {
    if (directionChanged) return; // Ignora mudanças de direção adicionais até o próximo movimento

    const keyPressed = event.key;

    // Previne que a cobra faça um movimento reverso
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

    directionChanged = true; // Impede a mudança de direção até que o próximo movimento ocorra
}

// Função principal para atualizar o jogo
function updateGame() {
    if (!gameRunning) {
        handleGameOver();
        return;
    }

    context.clearRect(0, 0, canvas.width, canvas.height); // Limpa o canvas

    frameCount++;
    if (frameCount === moveInterval) {
        moveSnake();
        frameCount = 0;
    }

    drawSnake();
    drawFood();
    checkCollisions();
    drawScore(); // Desenha a pontuação no canvas
}

// Função para exibir o Game Over e reiniciar o jogo
function handleGameOver() {
    alert(`Game Over! Sua pontuação foi: ${score}${score > highScore ? ' - Novo Recorde!' : ''}`);
    
    // Atualiza o recorde se a pontuação atual for maior
    if (score > highScore) {
        highScore = score;
        localStorage.setItem('highScore', highScore);
    }

    // Reinicializa o jogo
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
    score = 0; // Reinicializa a pontuação
}

// Função para desenhar a pontuação no canvas
function drawScore() {
    context.fillStyle = 'black';
    context.font = '16px Arial';
    context.fillText(`Pontuação: ${score}`, canvas.width - 120, 20);
    context.fillText(`Recorde: ${highScore}`, canvas.width - 120, 40);
}

// Atualiza o jogo a cada 50 milissegundos (mantendo o FPS alto)
const gameInterval = setInterval(updateGame, 50);

// Adiciona o evento de teclado
document.addEventListener('keydown', changeDirection);
