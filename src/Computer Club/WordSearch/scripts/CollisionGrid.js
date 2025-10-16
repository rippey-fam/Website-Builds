export class CollisionGrid {
    constructor(x, y, spacing, squareSize, gridSize) {
        this.x = x;
        this.y = y;
        this.spacing = spacing;
        this.squareSize = squareSize;
        this.gridSize = gridSize;
    }
    _inArea(x, y, area) {
        if (area.p1.x <= x && x <= area.p2.x) {
            if (area.p1.y <= y && y <= area.p2.y) {
                return true;
            }
        }
        return false;
    }

    _getAll(x, y) {
        if (
            !this._inArea(x, y, {
                p1: { x: this.x, y: this.y },
                p2: {
                    x: this.x + this.gridSize * this.squareSize + (this.gridSize - 1) * this.spacing,
                    y: this.y + this.gridSize * this.squareSize + (this.gridSize - 1) * this.spacing,
                },
            })
        )
            return false;

        let xOut, yOut, i1, j1;

        for (let i = 0; i < this.gridSize; i++) {
            if (
                this._inArea(x, y, {
                    p1: { x: this.x + i * (this.squareSize + this.spacing), y: this.y },
                    p2: {
                        x: this.x + (i + 1) * this.squareSize + i * this.spacing,
                        y: this.y + this.gridSize * this.squareSize + (this.gridSize - 1) * this.spacing,
                    },
                })
            ) {
                i1 = i;
            }
        }
        if (i1 === undefined) return false;

        for (let j = 0; j < this.gridSize; j++) {
            if (
                this._inArea(x, y, {
                    p1: {
                        x: this.x + i1 * (this.squareSize + this.spacing),
                        y: this.y + j * (this.squareSize + this.spacing),
                    },
                    p2: {
                        x: this.x + (i1 + 1) * this.squareSize + i1 * this.spacing,
                        y: this.y + (j + 1) * this.squareSize + j * this.spacing,
                    },
                })
            ) {
                j1 = j;
                xOut = this.x + i1 * (this.squareSize + this.spacing) + this.squareSize / 2;
                yOut = this.y + j1 * (this.squareSize + this.spacing) + this.squareSize / 2;
            }
        }
        if (j1 === undefined) return false;
        return { x: xOut, y: yOut, i: i1, j: j1 };
    }

    getAbsolute(x, y) {
        let v = this._getAll(x, y);
        if (!v) return false;
        return { x: v.x, y: v.y };
    }
    getRelative(x, y) {
        let v = this._getAll(x, y);
        if (!v) return false;
        return { i: v.i, j: v.j };
    }
}
