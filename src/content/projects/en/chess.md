---
title: chess frontend
description: A modular chess ui engine
year: 2026
category: frontend
technologies: [vite, javascript, chess.js]
featured: true
---

# Building a Modular Vanilla JS Chess UI Engine

![Chess Board Overview](path/to/hero-image.png)

## Overview

For this project, I wanted to build a chess UI from scratch without relying on a frontend framework or a rendering library like Canvas. I used **Vanilla JavaScript with ES Modules** and [chess.js](https://github.com/jhlywa/chess.js) to handle move validation and the rules of chess.

The main focus was keeping the code modular and easy to work with. I built the board around separate classes for the board, squares, and pieces, along with a few custom DOM helpers to cut down on repetitive code.

## Key Architecture & Design Decisions

### 1. Encapsulating State with Private Fields

I used ES2022 private fields (`#field`) in `ChessBoard`, `ChessSquare`, and `ChessPiece` to keep their internal state encapsulated.

For example, `ChessSquare` handles its own coordinates, DOM element, and piece reference:

```javascript
export default class ChessSquare {
    #element;
    #x;
    #y;
    #piece = null;

    constructor(x, y, element) {
        this.#x = x;
        this.#y = y;
        this.#element = element;
    }

    get notation() {
        return ["a", "b", "c", "d", "e", "f", "g", "h"][this.#x] + (this.#y + 1);
    }

    // Controlled getters & setters...
}
```

The `notation` getter converts the square's coordinates into standard chess notation, such as `a1` or `e4`, without having to store that value separately.

Keeping the state private also means other classes have to go through the methods and accessors I've exposed instead of directly modifying internal properties.

### 2. Mapping Board Coordinates to Chess Notation

One thing I had to account for was the difference between the board's internal coordinates and the way chess positions are represented.

The board uses a 0-indexed coordinate system, while chess notation runs from `a1` to `h8`. Since the engine's board array and the UI use different orientations, I had to map the coordinates correctly when placing pieces.

Here's how I handle that when rendering the board:

```javascript
const board = this.#game.board();

for (let y = 0; y < 8; y++) {
    for (let x = 0; x < 8; x++) {
        const pieceData = board[y][x];
        if (!pieceData) continue;

        const piece = new ChessPiece(pieceData.type, pieceData.color === "w" ? "white" : "black", this.#squares[x][7 - y]);

        this.addPiece(piece);
    }
}
```

The `7 - y` mapping flips the vertical coordinate so pieces end up on the correct squares. This lets the UI keep its own coordinate system while staying in sync with `chess.js`.

### 3. Custom DOM Helpers and Method Chaining

I wanted to avoid repeating the same DOM setup code everywhere, so I built a small element factory and extended `HTMLElement.prototype` with an `applyOptions` method.

The method handles things like setting element properties and applying classes from an options object:

```javascript
HTMLElement.prototype.applyOptions = function (options, overrideExistingValues = false) {
    if (options === null || typeof options !== "object" || Array.isArray(options)) {
        throw new Error("OPTIONS MUST BE AN OBJECT");
    }

    Object.entries(options).forEach(([key, value]) => {
        if (this[key] instanceof DOMTokenList) {
            if (overrideExistingValues) this[key].value = "";
            if (Array.isArray(value)) value.forEach((e) => this[key].add(e));
            else this[key].add(value);
        } else {
            this[key] = value;
        }
    });
};
```

This lets me create and configure elements in a single call instead of spreading the setup across several lines:

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

It's a small abstraction, but it keeps the DOM-related code more compact and consistent across the different classes.

### 4. Handling Square Selection and Moves

![Move Handling Flowchart](path/to/flowchart-image.png)

For move handling, I kept the selection state inside `ChessBoard` rather than relying on global variables or separate drag-and-drop state.

The `handleSquareClick` method handles the different selection and move scenarios:

1. **Selecting a piece:** If no square is selected, clicking a piece selects it and fetches its legal moves from `chess.js`.
2. **Deselecting:** Clicking the currently selected square clears the selection and board highlights.
3. **Switching pieces:** Clicking another piece of the same color switches the selection to that piece.
4. **Attempting a move:** Clicking an opponent's piece or an empty square attempts a move through the chess engine.

Here's the move-handling logic:

```javascript
handleSquareClick(square) {
    if (!this.#selectedSquare) {
        if (!square.piece) return;
        this.selectSquare(square);
        return;
    } else if (square === this.#selectedSquare) {
        this.clearSelection();
        return;
    } else if (square.piece && square.piece.color === this.#selectedSquare.piece.color) {
        this.selectSquare(square);
        return;
    }

    let move;

    try {
        move = this.#game.move({
            from: this.#selectedSquare.notation,
            to: square.notation,
            promotion: "q", // Default auto-promotion
        });
    } catch {
        console.log("illegal move attempted");
    }

    this.clearSelection();
    if (!move) return;

    this.showLastMove(move);
    this.renderPosition();
}
```

The chess engine handles move validation, while the board takes care of selection, highlighting, and updating the UI after a successful move. I also added automatic queen promotion due to time constraint.
