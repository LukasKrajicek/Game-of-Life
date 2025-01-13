let rows = 15;
let cols = 15;
let playing = false;
let timer;
let reproductionTime = 500;
let grid = [];
let nextGrid = [];
let generation = 0;

document.addEventListener("DOMContentLoaded", () => {
  createTable();
  initializeGrids();
  resetGrids();
  setupControlButtons();
});

function resetGrids() {
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      grid[i][j] = 0;
      nextGrid[i][j] = 0;
    }
  }
  generation = 0;
  updateStatistics();
  updateView();
}

function initializeGrids() {
  grid = new Array(rows).fill(null).map(() => new Array(cols).fill(0));
  nextGrid = new Array(rows).fill(null).map(() => new Array(cols).fill(0));
}

function createTable() {
  let gridContainer = document.getElementById("gridContainer");
  gridContainer.innerHTML = ""; // Clear previous grid
  let table = document.createElement("table");

  for (let i = 0; i < rows; i++) {
    let tr = document.createElement("tr");
    for (let j = 0; j < cols; j++) {
      let cell = document.createElement("td");
      cell.setAttribute("id", `${i}_${j}`);
      cell.setAttribute("class", "dead");
      cell.onclick = cellClickHandler;
      tr.appendChild(cell);
    }
    table.appendChild(tr);
  }
  gridContainer.appendChild(table);
}

function cellClickHandler() {
  let [row, col] = this.id.split("_").map(Number);
  grid[row][col] = grid[row][col] ? 0 : 1;
  this.setAttribute("class", grid[row][col] ? "live" : "dead");
  updateStatistics();
}

function setupControlButtons() {
  document.querySelector("#start").onclick = () => {
    playing = !playing;
    document.querySelector("#start").textContent = playing ? "Pause" : "Start";
    if (playing) play();
  };

  document.querySelector("#clear").onclick = () => {
    playing = false;
    document.querySelector("#start").textContent = "Start";
    resetGrids();
  };

  document.querySelector("#random").onclick = () => {
    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < cols; j++) {
        grid[i][j] = Math.random() > 0.5 ? 1 : 0;
      }
    }
    updateView();
    updateStatistics();
  };
}

function play() {
  if (!playing) return;
  computeNextGen();
  generation++;
  updateStatistics();
  timer = setTimeout(play, reproductionTime);
}

function computeNextGen() {
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      applyRules(i, j);
    }
  }
  [grid, nextGrid] = [nextGrid, grid];
  nextGrid = nextGrid.map(row => row.fill(0));
  updateView();
}

function applyRules(row, col) {
  let neighbors = countNeighbors(row, col);
  if (grid[row][col]) {
    nextGrid[row][col] = neighbors === 2 || neighbors === 3 ? 1 : 0;
  } else {
    nextGrid[row][col] = neighbors === 3 ? 1 : 0;
  }
}

function countNeighbors(row, col) {
  let directions = [
    [-1, -1], [-1, 0], [-1, 1],
    [0, -1],           [0, 1],
    [1, -1], [1, 0], [1, 1]
  ];
  return directions.reduce((count, [dx, dy]) => {
    let x = row + dx, y = col + dy;
    return count + (grid[x] && grid[x][y] ? 1 : 0);
  }, 0);
}

function updateView() {
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      let cell = document.getElementById(`${i}_${j}`);
      cell.setAttribute("class", grid[i][j] ? "live" : "dead");
    }
  }
}

function updateStatistics() {
  let livingCells = grid.flat().filter(cell => cell === 1).length;
  document.querySelector("#generation").textContent = generation;
  document.querySelector("#livingCells").textContent = livingCells;
}
