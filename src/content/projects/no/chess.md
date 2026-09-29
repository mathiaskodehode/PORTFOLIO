---
title: Sjakk Frontend
description: Ein modulær sjakk-UI engine
year: 2026
category: frontend
technologies: [Vite, JavaScript, chess.js]
featured: true
githubUrl: https://github.com/mathiaskodehode/chess
demoUrl: https://mathiaskodehode.github.io/chess
---

# Sjakk med Vanilla JavaScript

![Chess Board Overview](/images/chessBoard.png)

## Overview

I dette prosjektet bygde eg ein sjakk-UI med Vanilla JavaScript, HTML og CSS. Eg brukte rein DOM manipulation for interfacet og let `chess.js` handtere sjakkreglane, som validering av lovlege trekk og oppdaging av sjakkmatt.

---

## Viktige implementation valg

### Flipping av Y-aksen for å matche brettorienteringa

For å tilpasse board representation frå `chess.js` til det visuelle brettet mitt, inverterer eg Y-aksen under rendering. `chess.js` returnerer eit nested array der row index 0 representerer rank 8, og row index 7 representerer rank 1. Det visuelle brettet mitt er derimot strukturert med index 0 som rank 1 og index 7 som rank 8. Derfor bruker eg `7 - y` for å plassere kvar brikke på riktig square:

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

### Streamlining av DOM-generering

Eg laga ein utility wrapper som kombinerer attribute assignment og parent node attachment i eitt function call:

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

Utility function-en handterer element creation og attribute binding internt. Dette reduserer boilerplate i `Board`, `Square` og `Piece`-modulane, og held DOM generation logic meir konsistent.

---

### Handtering av klikk basert på state

I staden for å lage separate event listeners for brikker og squares, knytte eg alle squares til éin sentralisert, state-driven handler. Denne function-en vurderer kvar click basert på den gjeldande selection state-en og avgjer kva som skal skje vidare:

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

Dersom ingen brikke er selected, selectar handler-en den klikka brikka, så lenge square-en er occupied. Dersom brukaren klikkar på den selected brikka igjen, blir selection-en cleara. Dersom brukaren klikkar på ei anna brikke med same color, blir selection-en flytta til den brikka.

Alle andre clicks blir behandla som eit mogleg trekk og sende til `chess.js` for validering. Dersom trekket er lovleg, viser eg det siste trekket og re-render brettet. Dersom trekket er ulovleg, blir selection-en cleara og brettet forblir uendra.

#### Oversikt over selection flow

1. **Initial selection:** Sjekk om den klikka square-en inneheld ei brikke før ho blir lagra som selected square.
2. **Deselection:** Fjern selection dersom brukaren klikkar på den currently selected square-en igjen.
3. **Selection transfer:** Vel den nye brikka dersom brukaren klikkar på ei anna brikke med same color.
4. **Move execution:** Send origin og target squares til `chess.js` ved å bruke standard algebraic notation. Library-en validerer trekket og handterer captures og pawn promotion.

## Ting eg kan byggje vidare på

- **Board Inversion:** Leggje til ein toggle slik at board view kan snuast og bli lettare å sjå frå begge perspektiv.
- **Performance:** Oppdatere `renderPosition()` slik at berre elementa som blei endra under det siste trekket, blir erstatta. Då slepp eg å cleare og byggje opp heile DOM grid-en på nytt etter kvart trekk.
- **Stockfish:** Integrere Stockfish for å leggje til ein AI-motstandar som spelarar kan konkurrere mot.
- **Vinn:** Informer spelaren når dei har vunne/tapt/uavgjort
- **Angre:** La spelaren andre trekk ved å trykke ein knapp.
- **Gravplass:** Vis captured brikker.
- **Hvem sin tur er det:** Vis hvem sin tur det er.
- **Rematch-knapp:** Legg til en knapp som tilbakestiller spillet.
- **Brettbevaring:** Bevar gjeldende spillstatus når nettleseren oppdateres.
