const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const gridSize = 30; // Počet buněk na řádek/sloupec
const cellSize = 20; // Velikost jedné buňky v pixelech
canvas.width = gridSize * cellSize;
canvas.height = gridSize * cellSize;

let grid = createEmptyGrid(gridSize);
let animationFrame;

// Vytvoření prázdné mřížky
function createEmptyGrid(size) {
    return Array.from({ length: size }, () => Array(size).fill(0));
}

// Nakreslení mřížky na plátno
function drawGrid() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < gridSize; i++) {
        for (let j = 0; j < gridSize; j++) {
            ctx.fillStyle = grid[i][j] ? '#00ff00' : '#000000';
            ctx.fillRect(j * cellSize, i * cellSize, cellSize, cellSize);
            ctx.strokeStyle = '#555555';
            ctx.strokeRect(j * cellSize, i * cellSize, cellSize, cellSize);
        }
    }
}

// Přepnutí stavu buňky po kliknutí
canvas.addEventListener('click', (event) => {
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const row = Math.floor(y / cellSize);
    const col = Math.floor(x / cellSize);
    grid[row][col] = grid[row][col] ? 0 : 1;
    drawGrid();
});

// Počítání sousedů
function countNeighbors(grid, x, y) {
    let count = 0;
    for (let i = -1; i <= 1; i++) {
        for (let j = -1; j <= 1; j++) {
            if (i === 0 && j === 0) continue;
            const row = (x + i + gridSize) % gridSize;
            const col = (y + j + gridSize) % gridSize;
            count += grid[row][col];
        }
    }
    return count;
}

// Generování další generace
function getNextGeneration(grid) {
    const newGrid = createEmptyGrid(gridSize);
    for (let i = 0; i < gridSize; i++) {
        for (let j = 0; j < gridSize; j++) {
            const neighbors = countNeighbors(grid, i, j);
            if (grid[i][j] === 1) {
                newGrid[i][j] = neighbors === 2 || neighbors === 3 ? 1 : 0;
            } else {
                newGrid[i][j] = neighbors === 3 ? 1 : 0;
            }
        }
    }
    return newGrid;
}

// Aktualizace hry
function updateGame() {
    grid = getNextGeneration(grid);
    drawGrid();
    animationFrame = requestAnimationFrame(updateGame);
}

// Spuštění hry
function startGame() {
    if (!animationFrame) {
        updateGame();
    }
}

// Zastavení hry
function stopGame() {
    cancelAnimationFrame(animationFrame);
    animationFrame = null;
}

// Vymazání mřížky
function clearGrid() {
    stopGame();
    grid = createEmptyGrid(gridSize);
    drawGrid();
}

// Inicializace
drawGrid();
