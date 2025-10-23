import { CollisionGrid } from "./scripts/CollisionGrid.js";
import { FireworksDisplay } from "./scripts/FireworksDisplay.js";
import puzzles from "./scripts/puzzles.js";
import { Slot } from "./scripts/Slot.js";
import { shuffle, snap } from "./scripts/utils.js";
import { WordGrid } from "./scripts/WordGrid.js";

document.addEventListener("DOMContentLoaded", () => {
    /**
     * @type {HTMLCanvasElement}
     */
    const canvas = document.querySelector("#canvas");
    const ctx = canvas.getContext("2d");
    canvas.height = window.innerHeight * 0.85;
    canvas.width = canvas.height * 1.5;

    document.getElementById("regenerate").setAttribute("href", window.location.href);

    const params = new URLSearchParams(window.location.search);
    const difficulty = params.get("difficulty");
    console.log("DIFFICULTY:", difficulty.toUpperCase());

    let puzzle = puzzles[Math.floor(Math.random() * puzzles.length)];
    let words = puzzle.words;
    if (puzzle.title !== "Three-letter words") {
        switch (difficulty) {
            case "easy":
                words = words.sort(() => Math.random() - 0.5).slice(0, 1);
                break;
            case "normal":
                words = words.sort(() => Math.random() - 0.5).slice(0, 7);
                break;
            case "hard":
                words = words.sort(() => Math.random() - 0.5).slice(0, 10);
                break;
            case "spicy":
                words = words.sort(() => Math.random() - 0.5).slice(0, 10);
                break;
            default:
                words = words.sort(() => Math.random() - 0.5).slice(0, 7);
                break;
        }
    }

    let foundWords = new Set();
    document.getElementsByClassName("word-bank-header")[0].innerText = puzzle.title + ":";

    words.sort((a, b) => {
        return b.length - a.length;
    });
    let grid;
    switch (difficulty) {
        case "easy":
            grid = new WordGrid(words[0].length + 1);
            break;
        case "normal":
            grid = new WordGrid(Math.max(words[0].length + 1, 10));
            break;
        case "hard":
            grid = new WordGrid(Math.max(words[0].length + 1, 10));
            break;
        case "spicy":
            grid = new WordGrid(Math.max(words[0].length + 1, 15));
            break;
        default:
            grid = new WordGrid(Math.max(words[0].length + 1, 10));
            break;
    }
    words.sort(() => Math.random() - 0.5);
    let directions = [];
    switch (difficulty) {
        case "easy":
            directions.push("S", "E");
            break;
        case "normal":
            directions.push("S", "E", "SE");
            break;
        case "hard":
            directions.push("N", "NE", "E", "SE", "S", "SW", "W", "NW");
            break;
        case "spicy":
            directions.push("N", "NE", "E", "SE", "S", "SW", "W", "NW");
            break;
        default:
            directions.push("S", "E", "SE");
            break;
    }
    function findPos(word, grid) {
        let good;
        do {
            let range = grid.size - word.length;
            directions.sort(() => Math.random() - 0.5);
            for (const direction of directions) {
                let xPosition;
                let yPosition;
                switch (direction) {
                    case "N":
                        xPosition = new Array(grid.size).fill(0).map((v, i) => i);
                        yPosition = new Array(range).fill(0).map((v, i) => grid.size - 1 - i);
                        break;
                    case "NE":
                        xPosition = new Array(range).fill(0).map((v, i) => i);
                        yPosition = new Array(range).fill(0).map((v, i) => grid.size - 1 - i);
                        break;
                    case "E":
                        xPosition = new Array(range).fill(0).map((v, i) => i);
                        yPosition = new Array(grid.size).fill(0).map((v, i) => i);
                        break;
                    case "SE":
                        xPosition = new Array(range).fill(0).map((v, i) => i);
                        yPosition = new Array(range).fill(0).map((v, i) => i);
                        break;
                    case "S":
                        xPosition = new Array(grid.size).fill(0).map((v, i) => i);
                        yPosition = new Array(range).fill(0).map((v, i) => i);
                        break;
                    case "SW":
                        xPosition = new Array(range).fill(0).map((v, i) => grid.size - 1 - i);
                        yPosition = new Array(range).fill(0).map((v, i) => i);
                        break;
                    case "W":
                        xPosition = new Array(range).fill(0).map((v, i) => grid.size - 1 - i);
                        yPosition = new Array(grid.size).fill(0).map((v, i) => i);
                        break;
                    case "NW":
                        xPosition = new Array(range).fill(0).map((v, i) => grid.size - 1 - i);
                        yPosition = new Array(range).fill(0).map((v, i) => grid.size - 1 - i);
                        break;
                }
                xPosition.sort(() => Math.random() - 0.5);
                yPosition.sort(() => Math.random() - 0.5);
                for (let i = 0; i < xPosition.length; i++) {
                    for (let j = 0; j < yPosition.length; j++) {
                        let x = xPosition[i];
                        let y = yPosition[j];
                        let x1 = x;
                        let y1 = y;
                        good = true;
                        for (const letter of word) {
                            let gridLetter = grid.getLetter(x1, y1);
                            good = good && (gridLetter === "" || gridLetter === letter);
                            switch (direction) {
                                case "SE":
                                    x1++;
                                    y1++;
                                    break;
                                case "E":
                                    x1++;
                                    break;
                                case "S":
                                    y1++;
                                    break;
                                case "N":
                                    y1--;
                                    break;
                                case "NE":
                                    x1++;
                                    y1--;
                                    break;
                                case "SW":
                                    x1--;
                                    y1++;
                                    break;
                                case "W":
                                    x1--;
                                    break;
                                case "NW":
                                    x1--;
                                    y1--;
                                    break;
                            }
                        }
                        if (good) {
                            x1 = x;
                            y1 = y;
                            for (const letter of word) {
                                grid.setLetter(x1, y1, letter);
                                switch (direction) {
                                    case "SE":
                                        x1++;
                                        y1++;
                                        break;
                                    case "E":
                                        x1++;
                                        break;
                                    case "S":
                                        y1++;
                                        break;
                                    case "N":
                                        y1--;
                                        break;
                                    case "NE":
                                        x1++;
                                        y1--;
                                        break;
                                    case "SW":
                                        x1--;
                                        y1++;
                                        break;
                                    case "W":
                                        x1--;
                                        break;
                                    case "NW":
                                        x1--;
                                        y1--;
                                        break;
                                }
                            }
                            return;
                        }
                    }
                }
            }
            grid.enlarge();
        } while (!good);
    }

    let lettersInPuzzle = [];
    let wordBankEl = document.querySelector("#word-bank");

    for (const word of words) {
        findPos(word, grid);
        for (const letter of word) {
            lettersInPuzzle.push(letter.toUpperCase());
        }
        wordBankEl.innerHTML += `<span id="${word}">${word.toUpperCase()}<span><br />`;
    }

    switch (difficulty) {
        case "easy":
            grid.fill(true);
            break;
        case "normal":
            grid.fill(true, lettersInPuzzle, 3);
            break;
        case "hard":
            grid.fill(true, lettersInPuzzle, 5);
            break;
        case "spicy":
            grid.fill(false, lettersInPuzzle, 1);
            break;
        default:
            grid.fill(true, lettersInPuzzle, 3);
            break;
    }
    grid.fill(lettersInPuzzle, 3, false);

    let instances = [grid];
    /**
     * @type {null | Slot}
     */
    let currentSlot = null;

    function game() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        for (const instance of instances) {
            if (instance instanceof WordGrid) instance.draw(ctx, canvas.width, canvas.height);
            else if (instance instanceof Slot) instance.draw(ctx);

            if (currentSlot !== null) currentSlot.draw(ctx);
        }
        requestAnimationFrame(game);
    }
    game();

    const cellSize = Math.min(canvas.width, canvas.height) / grid.size;
    const offsetX = (canvas.width - cellSize * grid.size) / 2;
    const offsetY = (canvas.height - cellSize * grid.size) / 2;

    const collisionGrid = new CollisionGrid(
        offsetX, // x position (same as WordGrid offset)
        offsetY, // y position (same as WordGrid offset)
        0, // spacing (0 since letters are adjacent)
        cellSize, // squareSize (same as letter cell size)
        grid.size, // gridSize (same number of cells as WordGrid)
    );

    let mouse = { x: canvas.width / 2, y: canvas.height / 2 };
    document.addEventListener("mousemove", (e) => {
        let canvasBounds = canvas.getBoundingClientRect();
        mouse.x = e.x - canvasBounds.x;
        mouse.y = e.y - canvasBounds.y;
        if (currentSlot !== null) {
            let snappedCoor = snap(mouse, currentSlot.p1);
            let a = collisionGrid.getAbsolute(snappedCoor.x, snappedCoor.y);
            if (a) {
                currentSlot.p2 = { x: a.x, y: a.y };
            }
        }
    });

    canvas.addEventListener("mousedown", () => {
        let a = collisionGrid.getAbsolute(mouse.x, mouse.y);
        if (a) {
            currentSlot = new Slot(
                { x: a.x, y: a.y },
                { x: a.x, y: a.y },
                (Math.min(canvas.width, canvas.height) / grid.size) * 0.3,
            );
        }
    });

    canvas.addEventListener("mouseup", () => {
        let start = collisionGrid.getRelative(currentSlot.p1.x, currentSlot.p1.y);
        let end = collisionGrid.getRelative(currentSlot.p2.x, currentSlot.p2.y);
        let string = "";
        let i1 = start.i;
        let j1 = start.j;
        string += grid.getLetter(i1, j1);
        while (!(i1 === end.i && j1 === end.j)) {
            i1 += Math.sign(end.i - start.i);
            j1 += Math.sign(end.j - start.j);
            string += grid.getLetter(i1, j1);
        }
        let foundWord = words.find((word) => {
            return (
                word.toUpperCase() === string.toUpperCase() ||
                word.toUpperCase() === string.split("").reverse().join("").toUpperCase()
            );
        });
        if (foundWord) {
            console.log(foundWord);
            document.getElementById(foundWord).classList.add("found-word");
            instances.push(currentSlot);
            foundWords.add(foundWord);
        }
        if (foundWords.size === words.length) {
            const fireworks = new FireworksDisplay("fireworks-canvas");
            setInterval(() => {
                const x = Math.random() * window.innerWidth;
                const targetY = window.innerHeight * 0.3;
                fireworks.createFirework(x, targetY);
            }, 600);

            console.log("YOU WIN!!!");
        }

        currentSlot = null;
    });
});
