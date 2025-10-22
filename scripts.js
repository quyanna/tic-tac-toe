/* 
Script for a game of Tic-tac-toe. Has three "classes", GameBoard, Game, and DisplayController, as well as a
Player object type. 

Game is heavily coupled with DisplayController, and DisplayController makes many assumptions about attribute names 
on the front-end. 

Things I would like to add if I had free time: 
- The ability to play with either a human or a computer player. 
- Animations when symbols are added to the board to make them look "drawn". 
- Dynamic hover colors over the board so that it's easier to see who is playing. 
*/

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
      console.log(Error("GameBoard index out of bounds"));
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
  return function (
    marker,
    name = `Player ${id + 1}`,
    color = null,
    winner = false
  ) {
    return { name, marker, id, color, winner };
  };
})();

//GAME
const Game = (function (board) {
  let player1 = createPlayer("X", "Player 1", "blue");
  let player2 = createPlayer("O", "Player 2", "red");
  let p1Turn = true;
  let gameOver = false;

  const resetGameScore = () => {
    player1.winner = false;
    player2.winner = false;
    gameOver = false;
  };

  const setPlayers = (first, second) => {
    player1 = first;
    player2 = second;
  };

  const getPlayers = () => {
    return { player1, player2 };
  };

  const newGame = function () {
    board.clearBoard();
    resetGameScore();
    DisplayController.showBoard();
    p1Turn = true; // p1 always starts first
    DisplayController.displayTurn(player1);
  };

  // Gets called whenever a player makes a move by clicking the board
  const playTurn = (row, col) => {
    if (gameOver) {
      return;
    }
    const player = p1Turn ? player1 : player2;

    //Display what player's turn it is
    DisplayController.displayTurn(player);

    if (board.isEmptyAt(row, col)) {
      board.addToBoard(row, col, player.marker);
      //CHECK FOR A WIN AND IF NOT THEN NEXT PLAYER'S TURN
      if (playerWon(row, col, player.marker)) {
        gameOver = true;
        player.winner = true;
      } else if (board.isFull()) {
        gameOver = true;
      }

      if (gameOver) {
        DisplayController.displayWinner(player1, player2);
        DisplayController.showBoard();
        return;
      }

      p1Turn = !p1Turn;
      const nextPlayer = p1Turn ? player1 : player2;
      DisplayController.displayTurn(nextPlayer);
    } else {
      //do nothing
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
      return true;
    }

    //Check columns
    if (
      board.getBoardAt(1, playedCol) == marker &&
      board.getBoardAt(2, playedCol) == marker &&
      board.getBoardAt(3, playedCol) == marker
    ) {
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
    getPlayers,
  };
})(GameBoard);

//Object that represents a controller for displaying game state to the user
const DisplayController = (function (document, GameBoard, Game) {
  const displayBoard = document.querySelector(".game-board");
  const playerForm = document.querySelector("#player-form");
  const modalController = document.querySelector(".modal-state");
  const colorPicker1 = document.getElementById("p1-color");
  const colorPicker2 = document.getElementById("p2-color");
  const gameStatus = document.querySelector(".status-text");

  //Set default colors for players
  let p1Color = "blue";
  let p2Color = "red";

  setCSSVar("--p1-color", p1Color);
  setCSSVar("--p2-color", p2Color);

  //Helper function to set CSS variables
  function setCSSVar(name, value) {
    document.documentElement.style.setProperty(name, value);
  }

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
          currentDiv.dataset.owner = "p1";
          currentDiv.textContent = "X";
        } else if (GameBoard.getBoardAt(i, n) == "O") {
          currentDiv.dataset.owner = "p2";
          currentDiv.textContent = "O";
        } else {
          currentDiv.textContent = "";
          delete currentDiv.dataset.owner;
        }
      }
    }
  };

  const displayTurn = (player = null) => {
    if (player == null) {
      gameStatus.textContent = "";
      return;
    }
    gameStatus.style.color = player.color;
    gameStatus.textContent = `${player.name}'s Turn!`;

    // currentPlayerMarker = player.marker; // "X" or "O"
    setCSSVar("--hover-color", player.color); // drives the desktop-only hover color
  };

  const displayWinner = (player1, player2) => {
    let winnerText = "It's a tie!";
    let winnerColor = "black";
    if (player1.winner) {
      winnerText = `${player1.name} Wins!`;
      winnerColor = player1.color;
    } else if (player2.winner) {
      winnerText = `${player2.name} Wins!`;
      winnerColor = player2.color;
    }

    gameStatus.style.color = winnerColor;
    gameStatus.textContent = winnerText;
  };

  //          EVENT LISTENERS

  //Update color of player info text to match the player's selected color
  colorPicker1.addEventListener("input", (e) => {
    const p1TextItems = document.querySelectorAll(".player-1");
    p1TextItems.forEach((p1Element) => {
      p1Element.style.color = e.target.value;
    });
  });

  colorPicker2.addEventListener("input", (e) => {
    const p2TextItems = document.querySelectorAll(".player-2");
    p2TextItems.forEach((p2Element) => {
      p2Element.style.color = e.target.value;
    });
  });

  displayBoard.addEventListener("click", (e) => {
    const squarePlayed = e.target.closest("div[data-row]");
    const row = squarePlayed.dataset.row;
    const col = squarePlayed.dataset.col;
    Game.playTurn(row, col);
  });

  //When player info form is submitted
  playerForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const formData = new FormData(playerForm);
    const p1Name =
      formData.get("p1-name") == "" ? "Player 1" : formData.get("p1-name");
    const p2Name =
      formData.get("p2-name") == "" ? "Player 2" : formData.get("p2-name");

    p1Color = formData.get("p1-color");
    p2Color = formData.get("p2-color");

    setCSSVar("--p1-color", p1Color);
    setCSSVar("--p2-color", p2Color);

    const p1 = createPlayer("X", p1Name, p1Color);
    const p2 = createPlayer("O", p2Name, p2Color);

    Game.setPlayers(p1, p2);

    // Hides the modal
    Game.newGame();
    modalController.checked = false;
  });

  //   // optional event listener to reset the form whenever it is closed without input
  //   const resetFormDefaults = () => {
  //     const { player1, player2 } = Game.getPlayers();
  //     document.getElementById("player1-name").value = player1.name;
  //     document.getElementById("p1-color").value = player1.color;
  //     document.getElementById("player2-name").value = player2.name;
  //     document.getElementById("p2-color").value = player2.color;
  //   };

  //   modalController.addEventListener("change", (e) => {
  //     if (!e.target.checked) {
  //       resetFormDefaults();
  //     }
  //   });

  return {
    showBoard,
    disableBoard,
    enableBoard,
    displayTurn,
    displayWinner,
  };
})(document, GameBoard, Game);

Game.newGame();

//TEST DRIVER
// const Driver = () => {
//   Game.newGame();
//   // Test if can win on rows
//   Game.playTurn(1, 1);
//   Game.playTurn(2, 1);
//   Game.playTurn(1, 2);
//   Game.playTurn(2, 2);
//   Game.playTurn(1, 3);

//   //Test if can win on columns
//   Game.newGame();
//   Game.playTurn(1, 1);
//   Game.playTurn(2, 2);
//   Game.playTurn(2, 1);
//   Game.playTurn(2, 3);
//   Game.playTurn(3, 1);

//   //Check if it can detect when full
//   Game.playTurn(1, 2);
//   Game.playTurn(1, 3);
//   Game.playTurn(3, 2);
//   Game.playTurn(3, 3);

//   //Check if it can detect diagonal wins
//   Game.newGame();
//   Game.playTurn(1, 1);
//   Game.playTurn(3, 2);
//   Game.playTurn(2, 2);
//   Game.playTurn(2, 3);
//   Game.playTurn(3, 3);

//   Game.newGame();
//   Game.playTurn(3, 1);
//   Game.playTurn(3, 2);
//   Game.playTurn(2, 2);
//   Game.playTurn(2, 3);
//   Game.playTurn(1, 3);

//   //Check tie detection
//   Game.newGame();
//   Game.playTurn(3, 3);
//   Game.playTurn(1, 1);
//   Game.playTurn(3, 2);
//   Game.playTurn(1, 2);
//   Game.playTurn(2, 2);
//   Game.playTurn(2, 3);
//   Game.playTurn(2, 1);
//   Game.playTurn(3, 1);
//   Game.playTurn(1, 3);

//   Game.newGame();
//   DisplayController.showBoard();
// };

// Driver();
