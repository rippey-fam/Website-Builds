export class Selector {
    constructor(x, y, choices, ctx) {
        this.x = x;
        this.y = y;
        this.choices = choices;
        this.i = 0;
        this.j = 0;
        this.prevAxis = { x: 0, y: 0 };
        this.prevSelect = false;
        this.size = 50;
        this.smallerSize = this.size - 10;
        let longest1 = 0;
        let longest2 = 0;
        ctx.font = `${this.size}px Arial`;
        for (const choice of choices[0]) {
            let length = ctx.measureText(choice + " ,").width;
            if (length > longest1) {
                longest1 = length;
            }
        }
        for (const choice of choices[1]) {
            let length = ctx.measureText(choice).width;
            if (length > longest2) {
                longest2 = length;
            }
        }
        this.longest = longest1 + longest2;
    }
    input(axis, select) {
        if (Math.abs(this.prevAxis.x) && axis.x === 0) {
            this.i += this.prevAxis.x;
            this.i %= this.choices[0].length;
            if (this.i < 0) this.i += this.choices[0].length;
        }
        if (Math.abs(this.prevAxis.y) && axis.y === 0) {
            this.j += this.prevAxis.y;
            this.j %= this.choices[1].length;
            if (this.j < 0) this.j += this.choices[1].length;
        }
        if (select && !this.prevSelect) {
            return [this.choices[0][this.i], this.choices[1][this.j]];
        }
        this.prevAxis = axis;
        this.prevSelect = select;
    }
    draw(ctx) {
        ctx.fillStyle = "black";
        ctx.font = `${this.size}px Arial`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.strokeStyle = "white";
        let currentSelection = this.choices[0][this.i].toUpperCase() + ", " + this.choices[1][this.j];
        ctx.fillText(currentSelection, this.x, this.y);
        ctx.fill();
        ctx.stroke();

        ctx.font = `${this.smallerSize}px Arial`;
        ctx.fillStyle = "rgba(0, 0, 0, 0.69)";

        ctx.textAlign = "right";
        ctx.fillText(this.choices[0][(this.i + 1) % this.choices[0].length], this.x - this.longest / 2 - 50, this.y);
        ctx.fill();
        ctx.stroke();

        ctx.textAlign = "left";
        ctx.fillText(
            this.choices[0][this.i - 1 < 0 ? this.choices[0].length - 1 : this.i - 1],
            this.x + this.longest / 2 + 50,
            this.y,
        );
        ctx.fill();
        ctx.stroke();
    }
}
