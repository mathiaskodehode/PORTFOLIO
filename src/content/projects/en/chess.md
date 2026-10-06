---
title: Chess
description: A modular chess UI engine
year: 2026
category: frontend
technologies: [Vite, JavaScript, chess.js]
featured: true
githubUrl: https://github.com/mathiaskodehode/chess
demoUrl: https://mathiaskodehode.github.io/chess
thumbnailImagePath: /images/chessBoard.png
---

# Building a Chess Game with Vanilla JavaScript

<img src="/images/chessBoard.png" style="width: 855px"/>

## Overview

In this project, I built chess using Vanilla `JavaScript`, `HTML`, and `CSS`. I used pure DOM manipulation for the interface and relied on `chess.js` to handle the chess rules, and `stockfish` as the ai you're playing against.

---

## Flipping the Y-axis to match the board orientation

To align the board representation from `chess.js` with my visual board, I flip the Y-axis during rendering. Since `chess.js` returns a nested array where row index 0 represents rank 8 and row index 7 represents rank 1, while my visual board coordinates map index 0 to rank 1, while my visual board is structured from row 1 to row 8, I use `7 - y` to place each piece on the correct square:

```javascript
for (let y = 0; y < 8; y++) {
    for (let x = 0; x < 8; x++) {
        const pieceData = board[y][x];
        if (!pieceData) continue;

        const piece = new ChessPiece(pieceData.type, pieceData.color === "w" ? "white" : "black", this.#squares[x][7 - y]);
        this.addPiece(piece);
    }
}
```

---

## Streamlining DOM generation

I created a utility wrapper that combines attribute assignment and parent node attachment into a single function:

```javascript
this.#element = createElement(
    "img",
    {
        src: this.getImagePath(),
        classList: "piece",
        draggable: false,
    },
    square.element,
);
```

The utility function handles element creation and attribute binding. This reduces boilerplate across the `Board`, `Square`, and `Piece` modules and keeps the DOM generation logic consistent.

---

## Handling clicks based on the current state

Instead of creating separate event listeners for pieces and squares, I bound all squares to a single, centralized state-driven handler. This function evaluates each click based on the current selection state and determines the next action:

```js
async handleSquareClick(square) {
    if (this.#isEngineThinking || this.#game.turn() !== this.#playerColor) return;

    if (!this.#selectedSquare) {
        if (!square.piece) return;
        this.selectSquare(square);
        return;
    }
    else if (square === this.#selectedSquare) {
        this.clearSelection();
        return;
    }
    else if (square.piece && square.piece.color === this.#selectedSquare.piece.color) {
        this.selectSquare(square);
        return;
    }

    let move;
    try {
        move = this.#game.move({
            from: this.#selectedSquare.notation,
            to: square.notation,
            promotion: "q",
        });
    } catch {
        console.log("illegal move attempted");
    }

    this.clearSelection();
    if (!move) return;

    this.showLastMove(move);
    this.renderPosition();

    if (this.#engine && !this.#game.isGameOver()) await this.makeEngineMove();
}
```

If no piece is selected, the handler selects the clicked piece. Clicking the selected piece again clears the selection, while clicking another piece of the same color transfers the selection to that piece.

Any other click is treated as a potential move and passed to `chess.js` for validation. If the move is legal, I display the last move and re-render the board. If the move is illegal, the selection is cleared and the board remains unchanged.

---

## Stockfish

The `StockfishEngine` class has a Web Worker and communicates with it through the UCI (Universal Chess Interface) protocol, while `ChessBoard` remains responsible for applying and rendering moves. Trying to keep every piece of the application seperate and modular.

```js
export class StockfishEngine {
    #worker = null;
    #isReady = false;
    #onMoveCallback = null;

    constructor() {
        const workerPath = `${import.meta.env.BASE_URL}stockfish.js`;
        this.#worker = new Worker(workerPath);
        this.#initWorker();
    }

    #initWorker() {
        this.#worker.onmessage = (event) => {
            const line = event.data;
            if (line === "readyok") this.#isReady = true;
            if (line.startsWith("bestmove")) {
                const parts = line.split(" ");
                const bestMoveStr = parts[1];
                if (this.#onMoveCallback) {
                    const callback = this.#onMoveCallback;
                    this.#onMoveCallback = null;
                    callback(bestMoveStr);
                }
            }
        };

        this.#send("uci");
        this.#send("isready");
    }

    #send(command) {
        this.#worker.postMessage(command);
    }

    findBestMove(fen, depth = 10) {
        depth = depth || 1;
        return new Promise((resolve) => {
            this.#onMoveCallback = resolve;
            this.#send(`position fen ${fen}`);
            this.#send(`go depth ${depth}`);
        });
    }
}
```

### Running the engine in a Web Worker

Stockfish runs in a Web Worker so its calculations don't block the browser's main thread. The engine is initialized independently of the board and communicates through `postMessage()`:

```js
constructor() {
    const workerPath = `${import.meta.env.BASE_URL}stockfish.js`;
    this.#worker = new Worker(workerPath);
    this.#initWorker();
}
```

### Using the UCI protocol as the engine interface

Rather than exposing Stockfish-specific logic throughout the application, `StockfishEngine` provides a small interface around the UCI commands:

```js
findBestMove(fen, depth = 10) {
    depth = depth || 1;
    return new Promise(resolve => {
        this.#onMoveCallback = resolve;
        this.#send(`position fen ${fen}`);
        this.#send(`go depth ${depth}`);
    });
}
```

The current game position is converted to FEN (Forsyth–Edwards Notation) and sent to Stockfish, which returns a UCI move through a `bestmove` message. `StockfishEngine` converts that asynchronous worker response into a Promise, allowing the board to treat engine calculations as an asynchronous operation rather than managing worker callbacks itself.

This keeps Stockfish isolated from the rest of the application.

### Keeping game state and engine calculation separate

Stockfish only calculates the move. The resulting move is still passed through `chess.js` before the board state is changed:

```js
const move = this.#game.move({
    from: fromNotation,
    to: toNotation,
    promotion: promotion,
});
```

This gives each part of the application a clear responsibility.

### Preventing player input during engine calculation

Because engine calculations are asynchronous, the board tracks whether Stockfish is currently thinking:

```js
if (this.#isEngineThinking || this.#game.turn() !== this.#playerColor) return;
```

This prevents player input while an engine request is pending and makes sure moves can only be made by the player during their turn.

The engine also captures the FEN before starting its calculation:

```js
const currentFen = this.#game.fen();
const bestMoveUCI = await this.#engine.findBestMove(currentFen, 1);
```

This means the engine operates on a specific snapshot of the game position rather than directly depending on mutable board state while it is calculating.

## What I Could Add Next

- **Board Inversion:** Add a toggle to flip the view so the board can be comfortably viewed from both perspectives.
- **Performance Optimization:** Update `renderPosition()` to only replace elements that changed during the last turn, rather than clearing and rebuilding the entire DOM grid on every move.
- **Winning:** Let the player know when they've won/lost/stalemate.
- **Undo:** Let the player undo moves by pressing a button.
- **Graveyard:** Display captured pieces.
- **Whose turn is it:** Display whose turn it is.
- **Rematch button:** Add a button that resets the game.
- **Board preservation:** Preserve the current game state when refreshing the browser.
- **Difficulty:** Add easier difficulties so I can win one (1) singular game.
