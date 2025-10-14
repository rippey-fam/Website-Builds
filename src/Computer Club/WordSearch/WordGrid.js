export class WordGrid {
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
        console.log(JSON.stringify(this.grid, null, 2));
    }
    get size() {
        return this.grid.length;
    }
    fill(useAlphabet, weightedLettersArray = null, weight = 1) {
        let alphabet;
        if (useAlphabet) {
            alphabet = "abcdefghijklmnopqrstuvwxyz".toUpperCase().split("");
        } else {
            alphabet = [];
        }
        if (weightedLettersArray !== null) {
            for (let i = 0; i < weight; i++) {
                alphabet.push(...weightedLettersArray);
            }
        }
        this.grid.forEach((val, i) => {
            val.forEach((val2, j) => {
                if (val2 === "") {
                    // this.grid[i][j] = alphabet[Math.floor(Math.random() * (alphabet.length - 1))];
                    this.grid[i][j] = "#";
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
        try {
            ctx.font = `${cellSize * 0.5}px 'Poppins', sans-serif`;
        } catch {
            ctx.font = `${cellSize * 0.5}px Arial`;
        }

        for (let i = 0; i < this.size; i++) {
            for (let j = 0; j < this.size; j++) {
                ctx.fillText(this.getLetter(j, i), offsetX + (j + 0.5) * cellSize, offsetY + (i + 0.5) * cellSize);
            }
        }
    }
}
