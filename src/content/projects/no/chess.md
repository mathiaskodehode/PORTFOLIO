---
title: Sjakk
description: Ein modulær sjakk UI engine
year: 2026
category: frontend
technologies: [Vite, JavaScript, chess.js]
featured: true
githubUrl: https://github.com/mathiaskodehode/chess
demoUrl: https://mathiaskodehode.github.io/chess
thumbnailImagePath: /images/chessBoard.png
---

# Lage Sjakk med Vanilla JavaScript

<img src="/images/chessBoard.png" style="width: 855px"/>

## Oversikt

I dette prosjektet lagde eg sjakk med vanilla `JavaScript`, `HTML` og `CSS`. Eg brukte rein DOM-manipulasjon for grensesnittet og brukte `chess.js` til reglar og `Stockfish` som AI-en du spelar mot.

---

## Flipping av Y-aksen for å matche brettorienteringa

For å tilpasse brettrepresentasjonen frå `chess.js` til det visuelle brettet, snur eg Y-aksen under rendering. `chess.js` returnerer eit nested array der radindeks 0 representerer rang 8 og radindeks 7 representerer rang 1, medan koordinatane til det visuelle brettet mitt mappar indeks 0 til rang 1. Det visuelle brettet er strukturert frå rad 1 til rad 8, så eg brukar `7 - y` for å plassere kvar brikke på riktig rute:

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

## Forenkling av DOM-genereringa

Eg laga ein hjelpefunksjon som kombinerer tilordning av attributt og plassering av elementet i ein forelder til ein funksjon:

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

Hjelpefunksjonen handterer oppretting av element og attribute binding. Dette reduserer mengda boilerplate på tvers av `Board`-, `Square`- og `Piece`-modulane og gjer DOM-genereringa konsistent.

---

## Handtering av klikk basert på gjeldande tilstand

I staden for å opprette separate event listeners for brikker og ruter, knytte eg alle rutene til ein sentralisert, state-driven handler. Denne funksjonen vurderer kvart klikk basert på den gjeldande utvalstilstanden og avgjer kva som skal skje vidare:

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

Dersom ingen brikke er vald, vel handteraren den klikka brikka. Dersom spelaren klikkar på den valde brikka igjen, blir valet fjerna. Dersom spelaren klikkar på ei anna brikke med same farge, blir valet flytta til den nye brikka.

Alle andre klikk blir behandla som eit mogleg trekk og sendt til `chess.js` for validering. Dersom trekket er lovleg, viser eg det siste trekket og renderar brettet på nytt. Dersom trekket er ulovleg, blir valet fjerna og brettet forblir uendra.

---

## Stockfish

`StockfishEngine`-klassen har ein Web Worker og kommuniserer med han gjennom UCI-protokollen (Universal Chess Interface), medan `ChessBoard` har ansvar for å utføre og rendere trekk. Målet er å halde dei ulike delane av applikasjonen separate og modulære.

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

### Kjøring av motoren i ein Web Worker

Stockfish kjører i ein Web Worker slik at berekningane ikkje blokkerer hovudtråden i nettlesaren. Motoren blir initialisert uavhengig av brettet og kommuniserer gjennom `postMessage()`:

```js
constructor() {
    const workerPath = `${import.meta.env.BASE_URL}stockfish.js`;
    this.#worker = new Worker(workerPath);
    this.#initWorker();
}
```

### Bruk av UCI-protokollen som grensesnitt for StockfishEngine

I staden for å skrive Stockfish logikk rundt i applikasjonen, tilbyr `StockfishEngine` eit lite interface rundt UCI-kommandoane:

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

Den gjeldande spelposisjonen blir konvertert til FEN (Forsyth–Edwards Notation) og sendt til Stockfish, som returnerer eit UCI-trekk gjennom ei `bestmove`-melding. `StockfishEngine` gjer det asynkrone svaret frå Web Workeren om til eit Promise, slik at brettet kan behandle motorkalkulasjonane som ein asynkron operasjon i staden for å handtere worker-callbacks sjølv.

Dette held Stockfish isolert frå resten av applikasjonen.

### Halde speltilstand og motorkalkulasjon separert

Stockfish bereknar berre trekket. Trekket som blir returnert blir framleis sendt gjennom `chess.js` før tilstanden til brettet blir endra:

```js
const move = this.#game.move({
    from: fromNotation,
    to: toNotation,
    promotion: promotion,
});
```

Dette gir kvar del av applikasjonen eit tydeleg ansvar.

### Hindre spelarinput under motorkalkulasjon

Sidan motorkalkulasjonane er asynkron, held brettet styr på om Stockfish held på å tenkje:

```js
if (this.#isEngineThinking || this.#game.turn() !== this.#playerColor) return;
```

Dette hindrar spelaren i å gjere trekk medan ei motorkalkulasjon ventar, og sørgjer for at trekk berre kan gjerast av spelaren når det er spelaren sin tur.

Motoren tek også vare på FEN-en før berekninga startar:

```js
const currentFen = this.#game.fen();
const bestMoveUCI = await this.#engine.findBestMove(currentFen, 1);
```

Dette gjer at motoren arbeider med eit spesifikt augeblikk av spelposisjonen, i staden for å vere direkte avhengig av ein speltilstand som kan endre seg medan berekninga pågår.

---

## Kva eg kan leggje til vidare

- **Brettinvertering:** Legg til ein knapp for å snu brettet slik at det kan visast komfortabelt frå begge perspektiv.
- **Ytingsoptimalisering:** Oppdater `renderPosition()` slik at berre elementa som har endra seg sidan førre trekk blir erstatta, i staden for å tømme og byggje opp heile DOM-rutenettet på nytt for kvart trekk.
- **Vinne:** Vis spelaren når han har vunne, tapt eller når spelet endar med patt (uavgjort heiter tydligvis patt i sjakk).
- **Angre:** La spelaren angre trekk ved å trykkje på ein knapp.
- **Graveyard:** Vis brikkene som har blitt slått.
- **Kven sin tur:** Vis kven sin tur det er.
- **Rematch-knapp:** Legg til ein knapp som startar spelet på nytt.
- **Ta vare på brettet:** Ta vare på gjeldande speltilstand når nettlesaren blir oppdatert.
- **Vanskegrad:** Legg til lettare vanskegrader slik at eg faktisk kan vinne ein (1) einaste kamp.
