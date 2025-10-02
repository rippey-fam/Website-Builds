class WordGrid {
    constructor(size = 1) {
        this.grid = new Array(size);
        for (let i = 0; i < this.grid.length; i++) {
            this.grid[i] = new Array(size).fill("");
        }
    }
    setLetter(x, y, val) {
        this.grid[y][x] = val.toUpperCase();
    }
    getLetter(x, y) {
        return this.grid[y][x];
    }
    enlarge(amount = 1) {
        let size = this.grid.length;
        for (let i = 0; i < amount; i++) {
            this.grid.push(new Array(size).fill(""));
        }
        for (const item of this.grid) {
            for (let j = 0; j < amount; j++) {
                item.push("");
            }
        }
    }
    display() {
        console.log(JSON.stringify(this.grid).split("],").join("],\n"));
    }
    get size() {
        return this.grid.length;
    }
    fill(weightedLettersArray = null, weight = 1) {
        let alphabet = "abcdefghijklmnopqrstuvwxyz".toUpperCase().split("");
        if (weightedLettersArray !== null) {
            for (let i = 0; i < weight; i++) {
                alphabet.push(...weightedLettersArray);
            }
        }
        this.grid.forEach((val, i) => {
            val.forEach((val2, j) => {
                if (val2 === "") {
                    this.grid[i][j] = alphabet[Math.floor(Math.random() * (alphabet.length - 1))];
                }
            });
        });
    }
    draw(ctx, width, height) {
        const cellSize = Math.min(width, height) / this.size;
        const offsetX = (width - cellSize * this.size) / 2;
        const offsetY = (height - cellSize * this.size) / 2;

        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.font = `${cellSize * 0.5}px Arial`;

        for (let i = 0; i < this.size; i++) {
            for (let j = 0; j < this.size; j++) {
                ctx.fillText(this.getLetter(j, i), offsetX + (j + 0.5) * cellSize, offsetY + (i + 0.5) * cellSize);
            }
        }
    }
}

class Slot {
    constructor(p1, p2, radius) {
        this.p1 = p1;
        this.p2 = p2;
        this.radius = radius;
    }
    // Function to draw a slot (rounded rectangle/stadium shape)
    draw(ctx) {
        let p1 = this.p1;
        let p2 = this.p2;
        let radius = this.radius;
        // Calculate the distance between points
        const dx = p2.x - p1.x;
        const dy = p2.y - p1.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        // Handle degenerate case (points are too close)
        if (dist < 0.001) {
            ctx.beginPath();
            ctx.arc(p1.x, p1.y, radius, 0, Math.PI * 2);
            ctx.closePath();
            return;
        }

        // Calculate unit vector along the line
        const ux = dx / dist;
        const uy = dy / dist;

        // Calculate perpendicular unit vector (rotated 90° counterclockwise)
        const px = -uy;
        const py = ux;

        // Calculate the four corner points of the slot body
        const x1 = p1.x + px * radius;
        const y1 = p1.y + py * radius;

        const x2 = p2.x + px * radius;
        const y2 = p2.y + py * radius;

        const x3 = p2.x - px * radius;
        const y3 = p2.y - py * radius;

        const x4 = p1.x - px * radius;
        const y4 = p1.y - py * radius;

        // Calculate angles for the arcs
        const angle1 = Math.atan2(py, px);
        const angle2 = Math.atan2(-py, -px);

        // Draw the slot
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.arc(p2.x, p2.y, radius, angle1, angle2, true);
        ctx.lineTo(x4, y4);
        ctx.arc(p1.x, p1.y, radius, angle2, angle1, true);
        ctx.closePath();
        ctx.stroke();
    }
}

document.addEventListener("DOMContentLoaded", () => {
    /**
     * @type {HTMLCanvasElement}
     */
    const canvas = document.querySelector("canvas");
    const ctx = canvas.getContext("2d");
    canvas.height = window.innerHeight * 0.91;
    canvas.width = canvas.height;

    let puzzles = [
        ["hi", "hello", "hola", "hey", "sup"],
        ["cat", "dog", "mouse", "elephant", "giraffe", "tiger", "lion"],
        ["javascript", "python", "java", "csharp", "ruby", "html", "css", "php"],
        ["red", "blue", "green", "yellow", "purple", "orange", "black", "white"],
        ["apple", "banana", "grape", "orange", "kiwi", "mango", "peach", "pear"],
        ["soccer", "basketball", "baseball", "tennis", "golf", "hockey", "football"],
    ].sort(() => Math.random() - 0.5);

    let words = puzzles[0];
    words.sort((a, b) => {
        return b.length - a.length;
    });
    console.log(words);
    const grid = new WordGrid(words[0].length + 1);
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

    for (const word of words) {
        findPos(word, grid);
        for (const letter of word) {
            lettersInPuzzle.add(letter.toUpperCase());
        }
    }
    grid.fill(Array.from(lettersInPuzzle), 3);

    let instances = [grid, new Slot({ x: 100, y: 100 }, { x: 0, y: 0 }, 10)];

    function game() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        for (const instance of instances) {
            if (instance instanceof WordGrid) {
                instance.draw(ctx, canvas.width, canvas.height);
            } else if (instance instanceof Slot) {
                instance.draw(ctx);
            }
        }
        requestAnimationFrame(game);
    }
    game();

    let currentSlot = null;

    let mouse = { x: canvas.width / 2, y: canvas.height / 2 };
    document.addEventListener("mousemove", (e) => {
        let canvasBounds = canvas.getBoundingClientRect();
        mouse.x = e.x - canvasBounds.x;
        mouse.y = e.y - canvasBounds.y;
        if (currentSlot !== null) {
            currentSlot.p2 = { x: mouse.x, y: mouse.y };
        }
    });

    document.addEventListener("mousedown", () => {
        currentSlot = new Slot({ x: mouse.x, y: mouse.y }, { x: mouse.x, y: mouse.y }, 10);
        instances.push(currentSlot);
    });
    document.addEventListener("mouseup", () => {
        instances.pop();
        currentSlot = null;
    });
});
