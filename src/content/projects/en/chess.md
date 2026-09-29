---
title: Chess Frontend
description: A modular chess UI engine
year: 2026
category: frontend
technologies: [Vite, JavaScript, chess.js]
featured: true
githubUrl: https://github.com/mathiaskodehode/chess
demoUrl: https://mathiaskodehode.github.io/chess
---

# Building a Chess Game with Vanilla JavaScript

![Chess Board Overview](path/to/hero-image.png)

## Overview

In this project, I built a chess UI using Vanilla JavaScript, HTML, and CSS. I used pure DOM manipulation for the interface and relied on `chess.js` to handle the chess rules, such as legal move validation and checkmate detection.

---

## Key Implementation Decisions

### Flipping the Y-axis to match the board orientation

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

### Streamlining DOM generation

I created a utility wrapper that combines attribute assignment and parent node attachment into a single function call:

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

The utility function handles element creation and attribute binding internally. This reduces boilerplate code across the `Board`, `Square`, and `Piece` modules and keeps the DOM generation logic more consistent.

---

### Handling clicks based on the current state

Instead of creating separate event listeners for pieces and squares, I bound all squares to a single, centralized state-driven handler. This function evaluates each click based on the current selection state and determines the next logical action:

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

If no piece is selected, the handler selects the clicked piece, provided that the square is occupied. Clicking the selected piece again clears the selection, while clicking another piece of the same color transfers the selection to that piece.

Any other click is treated as a potential move and passed to `chess.js` for validation. If the move is legal, I display the last move and re-render the board. If the move is illegal, the selection is cleared and the board remains unchanged.

#### Selection Flow Overview

1. **Initial selection:** Check whether the clicked square contains a piece before storing it as the selected square.
2. **Deselection:** Clear the selection if the user clicks the currently selected square again.
3. **Selection transfer:** Select the new piece if the user clicks another piece of the same color.
4. **Move execution:** Pass the origin and target squares to `chess.js` using standard algebraic notation. The library validates the move and handles captures and pawn promotion.

## What I Could Add Next

- **Board Inversion:** Add a toggle to flip the view so the board can be comfortably viewed from both perspectives.
- **Performance Optimization:** Update `renderPosition()` to only replace elements that changed during the last turn, rather than clearing and rebuilding the entire DOM grid on every move.
- **Stockfish Integration:** Add the Stockfish engine to introduce an AI opponent that players can compete against.
- **Winning:** Let the player know when they've won/lost/stalemate.
- **Undo:** Let the player undo moves by pressing a button.
- **Graveyard:** Display captured pieces.
- **Whose turn is it:** Display whose turn it is.
- **Rematch button:** Add a button that resets the game.
- **Board preservation:** Preserve the current game state when refreshing the browser.
