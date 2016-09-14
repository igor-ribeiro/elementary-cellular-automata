const App = {
  wrapper: null,
  cellsRows: [],
  colors: {},
};

function randomBoolean() {
  return !! Math.floor(Math.random() * 2);
}

function randomColor() {
  const color = [];

  for (let i = 0; i < 3; i++) {
    color.push(Math.floor(Math.random() * 256));
  }

  return `rgb(${color.join(',')})`;
}

function getCellState(cell) {
  return cell.classList.contains('active');
}

function getStateByRules(position) {
  if (App.cellsRows.length === 1) {
    return randomBoolean();
  }

  const previousRowCells = App.cellsRows[App.cellsRows.length - 2].childNodes;
  const previousCell = previousRowCells[position];
  const previousLeftSimbling = previousCell.previousSibling || previousRowCells[previousRowCells.length - 1];
  const previousRightSimbling = previousCell.nextSibling || previousRowCells[0];

  for (let i = 0; i < config.rules.length; i++) {
    const rule = config.rules[i];

    if (
      getCellState(previousLeftSimbling) == rule[0] &&
      getCellState(previousCell) == rule[1] &&
      getCellState(previousRightSimbling) == rule[2]
    ) {
      return !! rule[3];
    }
  }

  return false;
}

function createStyle() {
  var style = document.createElement('style');
  style.innerHTML = `
    body {
      background-color: ${App.colors.inactive};
    }

    .wrapper {
      width: ${(config.margin * config.perRow) + (config.perRow * config.size)}px;
    }

    .cells-row {
      height: ${config.size}px;
    }

    .cell {
      width: ${config.size}px;
      height: ${config.size}px;
      margin-left: ${config.margin}px;
      margin-bottom: ${config.margin}px;
      background-color: ${App.colors.inactive};
    }

    .cell.active {
      background-color: ${App.colors.active};
    }
  `;

  document.body.appendChild(style);
}

function setup() {
  const wrapper = document.createElement('div');
  wrapper.classList.add('wrapper');

  App.wrapper = wrapper;
  App.colors.active = (config.colors.use) ? config.colors.active : randomColor();
  App.colors.inactive = (config.colors.use) ? config.colors.inactive : randomColor();

  createStyle();

  document.body.appendChild(wrapper);

  if (config.interval.use) {
    setInterval(createCellsRow, config.interval.velocity);
  } else {
    for (let i = 0; i < config.rows; i++) {
      createCellsRow();
    }
  }
}

function createCellsRow() {
  let cellsRow = null;

  if (! App.cellsRows.length) {
    cellsRow = document.createElement('div');
    cellsRow.classList.add('cells-row');
    App.cellsRows.push(cellsRow);
    createCells();
  } else {
    cellsRow = App.cellsRows[App.cellsRows.length - 1].cloneNode(true);
    App.cellsRows.push(cellsRow);
  }

  updateCells();
  App.wrapper.appendChild(cellsRow);
}

function createCells() {
  const row = App.cellsRows.length === 1
    ? App.cellsRows[0]
    : App.cellsRows[App.cellsRows.length - 1];

  for (let index = 0; index < config.perRow; index++) {
    const cell = document.createElement('div');

    cell.classList.add('cell');

    row.appendChild(cell);
  }
}

function updateCells() {
  const lastRow = App.cellsRows[App.cellsRows.length - 1];

  [].forEach.call(lastRow.childNodes, function (cell, index) {
    if (getStateByRules(index)) {
      cell.classList.add('active');
    } else {
      cell.classList.remove('active');
    }
  });
}

setup();
