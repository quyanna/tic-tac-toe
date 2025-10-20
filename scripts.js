console.log("Hello, world!");

const GameBoard = (function (rows, cols, initFill = null) {
  // Create a 2D Board with given rows and columns, initialized to "0";
  const board = Array.from({ length: rows }, () =>
    Array.from({ length: cols }).fill(0)
  );

  //NOTE: GameBoard interface is 1-indexed instead of 0-indexed, we only use 0-indexing internally.
  // Valid indexes must be from 1-rows or 1-cols.
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

  return { getBoard, addToBoard, isEmptyAt, getBoardAt };
})(3, 3, 0);

const createPlayer = (function () {
  let id = 0;
  return function (marker, name = `Player ${id + 1}`) {
    id++;
    return { name, marker, id };
  };
})();

console.log(GameBoard.getBoard());
console.log(GameBoard.isEmptyAt(1, 1));
GameBoard.addToBoard(1, 1, "X");
console.log(GameBoard.getBoard());
console.log(GameBoard.isEmptyAt(1, 1));
// console.log(GameBoard.addToBoard(9, 9));

player1 = createPlayer("X", "Quyanna");
console.log(player1);
player2 = createPlayer("O", "William");
console.log(player2);

player3 = createPlayer("X");
console.log(player3);
