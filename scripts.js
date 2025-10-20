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
  // returns false also if out of bounds.
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

  const isFull = () => {
    let checkFull = true;
    board.forEach((row) => {
      row.forEach((col) => {
        if (col == initFill) {
          checkFull = false;
        }
      });
    });

    return checkFull;
  };

  return {
    getBoard,
    addToBoard,
    isEmptyAt,
    getBoardAt,
    clearBoard,
    isFull,
  };
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
      //CHECK FOR A WIN AND IF NOT THEN NEXT PLAYER'S TURN
      if (playerWon(row, col, player.marker)) {
        console.log("WON");
      }

      p1Turn = !p1Turn;
    } else {
      console.log("Invalid choice");
    }
  };

  // Check if the player that just played has won.
  const playerWon = (playedRow, playedCol, marker) => {
    //Check rows
    if (
      board.getBoardAt(playedRow, 1) == marker &&
      board.getBoardAt(playedRow, 2) == marker &&
      board.getBoardAt(playedRow, 3) == marker
    ) {
      console.log("Winner - rows!");
      return true;
    }

    //Check columns
    if (
      board.getBoardAt(1, playedCol) == marker &&
      board.getBoardAt(2, playedCol) == marker &&
      board.getBoardAt(3, playedCol) == marker
    ) {
      console.log("Winner - columns!");
      return true;
    }
  };

  return {
    newGame,
    playTurn,
  };
})(GameBoard);

Game.newGame();

const Driver = () => {
  Game.newGame();
  // Test if can win on rows
  Game.playTurn(1, 1);
  Game.playTurn(2, 1);
  Game.playTurn(1, 2);
  Game.playTurn(2, 2);
  Game.playTurn(1, 3);

  //Test if can win on columns
  Game.newGame();
  Game.playTurn(1, 1);
  Game.playTurn(2, 2);
  Game.playTurn(2, 1);
  Game.playTurn(2, 3);
  Game.playTurn(3, 1);

  //Check if it can detect when full
  Game.playTurn(1, 2);
  Game.playTurn(1, 3);
  Game.playTurn(3, 2);
  Game.playTurn(3, 3);
};

Driver();

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
