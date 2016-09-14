var App = {
  wrapper: null,
  cellsRows: [],
  colors: {},
};

function randomBoolean() {
  return !! Math.floor(Math.random() * 2);
}

function randomHex() {
  var values = {
    10: 'a',
    11: 'b',
    12: 'c',
    13: 'd',
    14: 'e',
    15: 'f',
  };
  var hex = Math.floor(Math.random() * 16);
  var value = (hex > 9) ? values[hex] : hex;

  return value;
}

function randomColor() {
  var color = ['#'];

  for (var i = 0; i < 6; i++) {
    color.push(randomHex());
  }

  return color.join('');
}

function getCellState(cell) {
  return cell.dataset.active === 'true';
}

function getStateByRules(position) {
  if (App.cellsRows.length === 1) {
    return randomBoolean();
  }

  var previousRowCells = App.cellsRows[App.cellsRows.length - 2].childNodes;
  var previousCell = previousRowCells[position];
  var previousLeftSimbling = previousCell.previousSibling || previousRowCells[previousRowCells.length - 1];
  var previousRightSimbling = previousCell.nextSibling || previousRowCells[0];

  for (var i = 0; i < config.rules.length; i++) {
    var rule = config.rules[i];
    if (
      getCellState(previousLeftSimbling) == rule[0] &&
      getCellState(previousCell) == rule[1] &&
      getCellState(previousRightSimbling) == rule[2]
    ) {
      return !! rule[3];
    }
  }
}

function setup() {
  var wrapper = document.createElement('div');
  wrapper.classList.add('wrapper');
  wrapper.style.width = (config.margin * config.perRow) + (config.perRow * config.size) + 'px';

  document.body.appendChild(wrapper);

  App.wrapper = wrapper;
  App.colors.active = randomColor();
  App.colors.inactive = randomColor();

  document.body.style.background = App.colors.inactive;

  if (config.interval.use) {
    setInterval(createCellsRow, config.interval.velocity);
  } else {
    for (var i = 0; i < config.rows; i++) {
      createCellsRow();
    }
  }
}

function createCellsRow() {
  var cellsRow = document.createElement('div');
  cellsRow.classList.add('cells-row');
  cellsRow.dataset.id = App.cellsRows.length;
  cellsRow.style.height = config.size + 'px';

  App.wrapper.appendChild(cellsRow);
  App.cellsRows.push(cellsRow);

  createCells();
}

function createCells() {
  var row = App.cellsRows.length === 1
    ? App.cellsRows[0]
    : App.cellsRows[App.cellsRows.length - 1];

  for (var index = 0; index < config.perRow; index++) {
    var cell = document.createElement('div');
    var state = getStateByRules(index);

    cell.classList.add('cell');

    cell.style.width = config.size + 'px';
    cell.style.height = config.size + 'px';
    cell.style.marginLeft = config.margin + 'px';
    cell.style.marginBottom = config.margin + 'px';
    cell.style.background = (state) ? App.colors.active : App.colors.inactive;

    cell.dataset.active = state;

    row.appendChild(cell);
  }
}

setup();
