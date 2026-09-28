---
title: chess frontend
description: A modular chess ui engine
year: 2026
category: frontend
technologies: [vite, javascript, chess.js]
featured: true
---

# Building a Chess Game with Vanilla JavaScript

![Chess Board Overview](path/to/hero-image.png)

## Overview

In this project, I built a chess UI using vanilla JavaScript, HTML, and CSS. The engine uses pure DOM manipulation and delegates chess rules (such as legal moves and checkmate detection) to `chess.js`.

The implementation focuses on modular design, state encapsulation, coordinate translation, and user interaction.

---

## Key Implementation Decisions

### Inverting 2D Grid Coordinates to Match Chess Notation

To align the internal representation from `chess.js` with the visual board without altering underlying data structures, the Y-axis coordinate is flipped during rendering:

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

By mapping array index `y` to index `7 - y`, the visual board correctly reflects the standard board orientation while preserving natural array indexing in memory.

---

### Streamlining DOM Generation

Frequent DOM construction can clutter application logic. A tiny utility wrapper abstracts attribute assignment and parent node attachment into a single declarative call:

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

This utility handles element instantiation and attribute binding internally, reducing boilerplates across the `Board`, `Square`, and `Piece` modules.

---

### State-Driven Click Dispatching

Rather than adding a unique event listener to every piece, a single click handler manages all interaction logic sequentially based on current selection state:

```javascript
handleSquareClick(square) {
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
}
```

#### Selection Flow Overview

1. **Initial Selection:** Validates piece presence before storing selection state.
2. **Deselection:** Toggles selection off if the same square is clicked twice.
3. **Selection Transfer:** Directly updates target piece if clicking another friendly piece.
4. **Move Execution:** Passes origin and target standard algebraic notations to `chess.js` to validate legal movement and handle piece capture or pawn promotion automatically.
