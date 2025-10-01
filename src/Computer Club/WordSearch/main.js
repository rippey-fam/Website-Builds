class WordGrid {
    constructor(size = 1) {
        this.grid = new Array(size);
        for (let i = 0; i < this.grid.length; i++) {
            this.grid[i] = new Array(size).fill("");
        }
    }
    setLetter(x, y, val) {
        this.grid[y][x] = val;
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
}

document.addEventListener("DOMContentLoaded", () => {
    /**
     * @type {HTMLCanvasElement}
     */
    const canvas = document.querySelector("canvas");
    const ctx = canvas.getContext("2d");

    let words = ["hi", "hello", "hola", "hey", "sup"];
    words.sort((a, b) => {
        return b.length - a.length;
    });
    console.log(words);
    const grid = new WordGrid(words[0].length);
    let directions = ["E", "S", "SE"];
    let alphabet = "abcdefghijklmnopqrstuvwxyz".toUpperCase().split("");
    function findPos(word, grid) {
        let good;
        do {
            let range = grid.size - word.length;
            directions.sort((a, b) => Math.random() - 0.5);
            for (const direction of directions) {
                let positions = new Array(range).fill(0);
                positions = positions.map((v, i) => i);
                console.log(positions);
                positions.sort(() => Math.random() - 0.5);
                for (let i = 0; i < range; i++) {
                    for (let j = 0; j < range; j++) {
                        let x = positions[i];
                        let y = positions[j];
                        let x1 = x;
                        let y1 = y;
                        good = true;
                        for (const letter of word) {
                            console.log(x1, y1);
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
    for (const word of words) {
        findPos(word, grid);
    }
    grid.display();

    let gridSize = 10;
    ctx.textAlign = "center";
    ctx.font = `20px Arial`;
    for (let i = 0; i < grid.size; i++) {
        for (let j = 0; j < grid.size; j++) {
            ctx.fillText(
                grid.getLetter(i, j),
                (j + 0.5) * (canvas.width / gridSize),
                (i + 0.7) * (canvas.height / gridSize),
            );
            ctx.fill();
        }
    }
});
