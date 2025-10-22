# tic-tac-toe

A 2-player Tic-Tac-Toe Game made with HTML/CSS and vanilla JS.

### Features

- Two-player mode

  - Players can enter their names and select custom marker colors.

- Color customization

  - Each player’s moves are displayed in their chosen color.

- Click-based gameplay

  - Players make moves by clicking directly on the board.

- Win and tie detection

  - The game automatically determines winners or draws.

- Built with no frameworks
  - Uses plain HTML, CSS, and JavaScript (plus PaperCSS styling).

### What I learned

This project was my first hands-on experience with the Module Pattern using IIFEs, and it became a practical way to learn about modular JavaScript, DOM interaction, and structured front-end logic.

I built this project to explore:

- How to organize JavaScript using Immediately Invoked Function Expressions (IIFEs).

- How to separate concerns between game logic, display logic, and state management.

- How to structure a small app without relying on frameworks or libraries.

#### Structure

| Module              | Responsibility                                                                               |
| ------------------- | -------------------------------------------------------------------------------------------- |
| `GameBoard`         | Maintains the internal 3×3 grid and provides controlled access via getters/setters.          |
| `Game`              | Manages players, turn order, win detection, and round resets.                                |
| `DisplayController` | Handles all DOM manipulation, form input, and rendering of the board and messages.           |
| `createPlayer()`    | Factory function for generating player objects with customizable names, colors, and markers. |
