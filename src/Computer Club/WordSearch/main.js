import { CollisionGrid } from "./CollisionGrid.js";
import { Slot } from "./Slot.js";
import { WordGrid } from "./WordGrid.js";

function shuffle(array) {
    return array.sort(() => Math.random() - 0.5);
}

document.addEventListener("DOMContentLoaded", () => {
    /**
     * @type {HTMLCanvasElement}
     */
    const canvas = document.querySelector("canvas");
    const ctx = canvas.getContext("2d");
    canvas.height = window.innerHeight * 0.91;
    canvas.width = canvas.height * 1.5;

    let puzzles = shuffle([
        ["hi", "hello", "hola", "hey", "sup"],
        ["cat", "dog", "mouse", "elephant", "giraffe", "tiger", "lion"],
        ["javascript", "python", "java", "csharp", "ruby", "html", "css", "php"],
        ["red", "blue", "green", "yellow", "purple", "orange", "black", "white"],
        ["apple", "banana", "grape", "orange", "kiwi", "mango", "peach", "pear"],
        ["soccer", "basketball", "baseball", "tennis", "golf", "hockey", "football"],
    ]);

    let words = puzzles[0];
    words.sort((a, b) => {
        return b.length - a.length;
    });
    console.log(words);
    const grid = new WordGrid(Math.max(words[0].length + 1, 10));
    words.sort(() => Math.random() - 0.5);
    let directions = ["E", "S", "SE"];
    function findPos(word, grid) {
        let good;
        do {
            let range = grid.size - word.length;
            directions.sort(() => Math.random() - 0.5);
            for (const direction of directions) {
                let positions = new Array(range).fill(0);
                positions = positions.map((v, i) => i);
                positions.sort(() => Math.random() - 0.5);
                for (let i = 0; i < range; i++) {
                    for (let j = 0; j < range; j++) {
                        let x = positions[i];
                        let y = positions[j];
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

    let lettersInPuzzle = new Set();
    let wordBankEl = document.querySelector("#word-bank");

    for (const word of words) {
        findPos(word, grid);
        for (const letter of word) {
            lettersInPuzzle.add(letter.toUpperCase());
        }
        wordBankEl.innerHTML += `<br />${word.toUpperCase()}`;
    }
    grid.fill(Array.from(lettersInPuzzle), 3);

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
    function snap(mouse, origin) {
        let dx = mouse.x - origin.x;
        let dy = mouse.y - origin.y;

        let angle = Math.atan2(dy, dx);
        let increment = Math.PI / 4;
        let snapped = Math.round(angle / increment) * increment;
        let deltaA = snapped - angle;
        let dist = Math.hypot(dx, dy);
        let b = dist * Math.cos(deltaA);
        let x = b * Math.cos(snapped);
        let y = b * Math.sin(snapped);
        return { x: origin.x + x, y: origin.y + y };
    }
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

    document.addEventListener("mousedown", () => {
        let a = collisionGrid.getAbsolute(mouse.x, mouse.y);
        if (a) {
            currentSlot = new Slot(
                { x: a.x, y: a.y },
                { x: a.x, y: a.y },
                (Math.min(canvas.width, canvas.height) / grid.size) * 0.3,
            );
        }
    });

    document.addEventListener("mouseup", () => {
        let start = collisionGrid.getRelative(currentSlot.p1.x, currentSlot.p1.y);
        let end = collisionGrid.getRelative(currentSlot.p2.x, currentSlot.p2.y);
        console.log(start, end);
        currentSlot = null;
    });
});
