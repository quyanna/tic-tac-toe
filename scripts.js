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

  const getDimensions = () => {
    return { rows, cols };
  };

  return {
    getBoard,
    addToBoard,
    isEmptyAt,
    getBoardAt,
    clearBoard,
    isFull,
    getDimensions,
  };
})(3, 3, 0);

// PLAYER

const createPlayer = (function () {
  let id = 0;
  return function (marker, name = `Player ${id + 1}`, color = null) {
    id++;
    return { name, marker, id, color };
  };
})();

//GAME
const Game = (function (board) {
  let player1 = createPlayer("X", "Player 1");
  let player2 = createPlayer("O", "Player 2");
  let p1Turn = true;

  const setPlayers = (first, second) => {
    player1 = first;
    player2 = second;
  };

  const newGame = function () {
    board.clearBoard();
  };

  let gameOver = false;

  const playTurn = (row, col) => {
    const player = p1Turn ? player1 : player2;

    console.log(`${player.name}'s turn: ${player.marker} at ${row},${col}`);

    if (board.isEmptyAt(row, col)) {
      board.addToBoard(row, col, player.marker);
      //CHECK FOR A WIN AND IF NOT THEN NEXT PLAYER'S TURN
      if (playerWon(row, col, player.marker)) {
        console.log("WON");
      } else if (board.isFull()) {
        console.log("Game over - tie");
      }

      p1Turn = !p1Turn;
    } else {
      console.log("Invalid choice");
    }

    DisplayController.showBoard();
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

    const diagonals1 = ["11", "22", "33"];
    const diagonals2 = ["31", "22", "13"];

    let check = `${playedRow}${playedCol}`;
    if (diagonals1.includes(check)) {
      if (
        board.getBoardAt(1, 1) == marker &&
        board.getBoardAt(2, 2) == marker &&
        board.getBoardAt(3, 3) == marker
      ) {
        return true;
      }
    } else if (diagonals2.includes(check)) {
      if (
        board.getBoardAt(3, 1) == marker &&
        board.getBoardAt(2, 2) == marker &&
        board.getBoardAt(1, 3) == marker
      ) {
        return true;
      }
    }

    return false; //if no win found
  };

  return {
    newGame,
    playTurn,
    setPlayers,
  };
})(GameBoard);

//Object that represents a controller for displaying game state to the user
const DisplayController = (function (document, GameBoard, Game) {
  const displayBoard = document.querySelector(".game-board");
  const playerForm = document.querySelector("#player-form");
  const modalController = document.querySelector(".modal-state");
  let p1Color = "blue";
  let p2Color = "red";

  playerForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const formData = new FormData(playerForm);
    const p1Name =
      formData.get("p1-name") == "" ? "Player 1" : formData.get("p1-name");
    const p2Name =
      formData.get("p2-name") == "" ? "Player 2" : formData.get("p2-name");

    p1Color = formData.get("p1-color");
    p2Color = formData.get("p2-color");

    const p1 = createPlayer("X", p1Name, p1Color);
    const p2 = createPlayer("O", p2Name, p2Color);

    Game.setPlayers(p1, p2);
    playerForm.reset();
    // Hides the modal
    modalController.checked = false;
  });

  //Functions to disable and enable board
  const disableBoard = () => {
    displayBoard.classList.add("disabled");
  };

  const enableBoard = () => {
    displayBoard.classList.remove("disabled");
  };

  //Displays the content of the board to the screen.
  const showBoard = () => {
    const { rows, cols } = GameBoard.getDimensions();
    for (let i = 1; i <= rows; i++) {
      for (let n = 1; n <= cols; n++) {
        const currentDiv = document.querySelector(
          `div[data-row="${i}"][data-col="${n}"]`
        );
        if (GameBoard.getBoardAt(i, n) == "X") {
          currentDiv.style.backgroundColor = p1Color;
          currentDiv.textContent = "X";
        } else if (GameBoard.getBoardAt(i, n) == "O") {
          currentDiv.style.backgroundColor = p2Color;
          currentDiv.textContent = "O";
        } else {
          currentDiv.style.backgroundColor = "white";
          currentDiv.textContent = "";
        }
      }
    }
  };

  displayBoard.addEventListener("click", (e) => {
    const squarePlayed = e.target.closest("div[data-row]");
    const row = squarePlayed.dataset.row;
    const col = squarePlayed.dataset.col;
    Game.playTurn(row, col);
  });

  return { showBoard, disableBoard, enableBoard };
})(document, GameBoard, Game);

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

  //Check if it can detect diagonal wins
  Game.newGame();
  Game.playTurn(1, 1);
  Game.playTurn(3, 2);
  Game.playTurn(2, 2);
  Game.playTurn(2, 3);
  Game.playTurn(3, 3);

  Game.newGame();
  Game.playTurn(3, 1);
  Game.playTurn(3, 2);
  Game.playTurn(2, 2);
  Game.playTurn(2, 3);
  Game.playTurn(1, 3);

  //Check tie detection
  Game.newGame();
  Game.playTurn(3, 3);
  Game.playTurn(1, 1);
  Game.playTurn(3, 2);
  Game.playTurn(1, 2);
  Game.playTurn(2, 2);
  Game.playTurn(2, 3);
  Game.playTurn(2, 1);
  Game.playTurn(3, 1);
  Game.playTurn(1, 3);

  Game.newGame();
  DisplayController.showBoard();
};

Driver();
