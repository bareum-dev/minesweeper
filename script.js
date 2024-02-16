const field = document.querySelector('.field');
const gameSizeButtons = document.querySelectorAll('.btn__game-size');

let gameSize = 10; // widt, height and bomb count
let openedCells = 0; // for check win
let bombsArr = [];
let buttonsArr = [];

startGame();

gameSizeButtons.forEach((btn) => {
  btn.addEventListener('click', (e) => {
    let newGameSize = +e.target.getAttribute('data-size');

    gameSize = newGameSize;
    openedCells = 0;
    bombsArr = [];
    buttonsArr = [];

    startGame();
  })
})


// startGame
function startGame() {
  fillField();
  setFieldStyle();
  fillBombsArr();

  buttonsArr = [...field.children];

  field.onclick = function(e) {
    if (e.target.tagName !== 'BUTTON') return;
    if (e.target.classList.contains('check')) return;

    const index = buttonsArr.indexOf(e.target);
    const column = index % gameSize;
    const row = (index - column) / gameSize;

    openCell(row, column);
  }

  field.oncontextmenu = function(e) {
    e.preventDefault();
    if (e.target.tagName !== 'BUTTON') return;
    if (e.target.disabled) return;
    if (e.target.classList.contains('check')) {
      e.target.classList.remove('check');
    } else {
      e.target.classList.add('check');
    }
  }
}

// openCell
function openCell(row, column) {
  if (!isValidCell(row, column)) return;

  const index = row * gameSize + column;
  const cell = buttonsArr[index];

  if (cell.disabled) return;
  if (cell.classList.contains('check')) return;

  cell.disabled = true;

  if (isBomb(row, column)) {
    cell.innerHTML = '<span>X</span>';
    cell.classList.add('bomb');
    openModal(false);
    openAllBombs();
  }
  else {
    openedCells += 1;
    if (openedCells === gameSize ** 2 - gameSize) openModal();

    const count = bombsNear(row, column);
    if (count !== 0) {
      cell.innerHTML = `<span>${count}</span>`;
    }
    else {
      for (let x = -1; x <= 1; x += 1) {
        for (let y = -1; y <= 1; y += 1) {
          openCell(row + y, column + x);
        }
      }
    }
  }
}

// setColumns
function setColumns() {
  field.style.gridTemplateColumns = `repeat(${gameSize}, 1fr)`;
}

// fillField
function fillField() {
  field.innerHTML = '';
  for (let i = 0; i < gameSize * gameSize; i += 1) {
    let button = document.createElement('button');
    button.classList.add('cell');
    field.appendChild(button);
  }
}

// setFieldStyle
function setFieldStyle() {
  if (gameSize === 15) field.className = 'field size__15';
  if (gameSize === 12) field.className = 'field size__12';
  if (gameSize === 10) field.className = 'field size__10';
  if (gameSize === 8) field.className = 'field size__8';
  if (gameSize === 6) field.className = 'field size__6';
}

// getRandomNumber
function getRandomNumber(min = 0, max = gameSize ** 2) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min) + min);
}

// fillBombsArr
function fillBombsArr() {
  for (let i = 0; i < gameSize; i += 1) {
    const randomNum = getRandomNumber();
    bombsArr.push(randomNum);
  }
}

// isBomb
function isBomb(row, column) {
  if (!isValidCell(row, column)) return;
  const index = row * gameSize + column;
  return bombsArr.includes(index);
}

// bombsNear
function bombsNear(row, column) {
  let bombs = 0;

  for (let x = -1; x <= 1; x += 1) {
    for (let y = -1; y <= 1; y += 1) {
      if (isBomb(row + y, column + x)) bombs++;
    }
  }

  return bombs;
}

// isValidCell
function isValidCell(row, column) {
  return (row >= 0) && (row < gameSize) && (column >= 0) && (column < gameSize);
}

// openModal
function openModal(result = true) {
  field.appendChild(getModal());

  if (result === false) {
    document.querySelector('.modal__wrapper > p').textContent = 'Game over. You lose =(('
  } else {
    document.querySelector('.modal__wrapper > p').textContent = 'Congrads! You win';
  }
}

// getModal
function getModal() {
  const modal = document.createElement('div');
  modal.classList.add('modal');

  const modalWrapper = document.createElement('div');
  modalWrapper.classList.add('modal__wrapper');

  const p = document.createElement('p');

  modalWrapper.appendChild(p);

  modal.appendChild(modalWrapper);

  return modal;
}

// openAllBombs
function openAllBombs() {
  buttonsArr.forEach((btn, index) => {
    if (!btn.disabled) btn.disabled = true;
    if (bombsArr.includes(index)) {
      btn.innerHTML = '<span>X</span>';
      btn.classList.add('bomb');
      btn.className = 'cell bomb game-over';
    }
  })
}