console.log("Hello, world!");

// GAME BOARD
const GameBoard = (function (rows, cols, initFill = null) {
  // Create a 2D Board with given rows and columns, initialized to "0";
  const board = Array.from({ length: rows }, () =>
    Array.from({ length: cols }).fill(initFill)
  );

  //NOTE: GameBoard interface is 1-indexed instead of 0-indexed, we only use 0-indexing internally.
  // Valid indexes must be from 1-rows or 1-cols. PRIVATE
  const indexValid = (row, col) => {
    if (row > rows || col > cols || row <= 0 || col <= 0) {
      console.log(Error("GameBoard index out of bounds")); //TODO: Change error messaging later maybe
      return false;
    } else return true;
  };

  //NOTE: GameBoard interface is 1-indexed instead of 0-indexed, we only use 0-indexing internally.
  const isEmptyAt = (row, col) => {
    if (indexValid(row, col) && board[row - 1][col - 1] === initFill) {
      console.log(board[row - 1][col - 1]);
      return true;
    } else {
      return false;
    }
  };

  const getBoard = () => board;

  const getBoardAt = (row, col) => {
    if (indexValid(row, col)) {
      return board[row - 1][col - 1];
    } else return undefined;
  };

  const addToBoard = (row, col, marker) => {
    if (indexValid(row, col)) {
      board[row - 1][col - 1] = marker;
    }
  };

  const clearBoard = () => {
    board.forEach((row) => row.fill(initFill));
    console.log(board);
  };

  return { getBoard, addToBoard, isEmptyAt, getBoardAt, clearBoard };
})(3, 3, 0);

// PLAYER

const createPlayer = (function () {
  let id = 0;
  return function (marker, name = `Player ${id + 1}`) {
    id++;
    return { name, marker, id };
  };
})();

//GAME
const Game = (function (board) {
  const newGame = function () {
    board.clearBoard();
  };

  let gameOver = false;

  const player1 = createPlayer("X", "Quyanna");
  const player2 = createPlayer("O", "William");
  let p1Turn = true;

  const playTurn = (row, col) => {
    let player = "";
    if (p1Turn) {
      player = player1;
    } else {
      player = player2;
    }

    console.log(`${player.name}'s turn: `);

    if (board.isEmptyAt(row, col)) {
      board.addToBoard(row, col, player.marker);
    } else {
      //Do nothing if index isn't empty for now
    }

    //CHECK FOR A WIN AND IF NOT THEN NEXT PLAYER'S TURN
    p1Turn = !p1Turn;
  };

  return {
    newGame,
    playTurn,
  };
})(GameBoard);

Game.newGame();

// console.log(GameBoard.getBoard());
// console.log(GameBoard.isEmptyAt(1, 1));
// GameBoard.addToBoard(1, 1, "X");
// console.log(GameBoard.getBoard());
// console.log(GameBoard.isEmptyAt(1, 1));
// GameBoard.clearBoard();
// // console.log(GameBoard.addToBoard(9, 9));

// player1 = createPlayer("X", "Quyanna");
// console.log(player1);
// player2 = createPlayer("O", "William");
// console.log(player2);

// player3 = createPlayer("X");
// console.log(player3);
