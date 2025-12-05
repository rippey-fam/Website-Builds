function clamp(value, min, max) {
    let fixedMax = max;
    let fixedMin = min;
    if (min > max) {
        fixedMax = min;
        fixedMin = max;
    }
    return Math.min(Math.max(value, fixedMin), fixedMax);
}

export default class Wall {
    constructor() {
        this.cursor = {
            x: 0,
            y: 0,
        };
        this.walls = [];
        this.width = 5;
    }
    addPath(x, y) {
        this.cursor = { x, y };
        return this;
    }
    h(x) {
        this.walls.push({
            a: { x: this.cursor.x, y: this.cursor.y },
            b: { x: this.cursor.x + x, y: this.cursor.y },
        });
        this.cursor.x += x;
        return this;
    }
    H(x) {
        this.walls.push({
            a: { x: this.cursor.x, y: this.cursor.y },
            b: { x: x, y: this.cursor.y },
        });
        this.cursor.x = x;
        return this;
    }
    v(y) {
        this.walls.push({
            a: { x: this.cursor.x, y: this.cursor.y },
            b: { x: this.cursor.x, y: this.cursor.y + y },
        });
        this.cursor.y += y;
        return this;
    }
    V(y) {
        this.walls.push({
            a: { x: this.cursor.x, y: this.cursor.y },
            b: { x: this.cursor.x, y: y },
        });
        this.cursor.y = y;
        return this;
    }
    check(x, y, r) {
        for (const wall of this.walls) {
            let a = wall.a;
            let b = wall.b;
            let c = { x: 0, y: 0 };

            if (a.x === b.x) {
                c.y = clamp(y, a.y, b.y);
                c.x = a.x;
            } else {
                c.x = clamp(x, a.x, b.x);
                c.y = a.y;
            }

            let dx = x - c.x;
            let dy = y - c.y;

            if (Math.hypot(dx, dy) <= r) return true;
        }
        return false;
    }
    draw(ctx) {
        ctx.strokeStyle = "black";
        ctx.lineWidth = this.width;
        ctx.lineCap = "round";
        ctx.beginPath();
        ctx.moveTo(this.walls[0].a.x, this.walls[0].a.y);
        ctx.lineTo(this.walls[0].b.x, this.walls[0].b.y);
        for (let i = 1; i < this.walls.length; i++) {
            ctx.moveTo(this.walls[i].a.x, this.walls[i].a.y);
            ctx.lineTo(this.walls[i].b.x, this.walls[i].b.y);
            // if (this.walls[i - 1].b.x === this.walls[i].a.x && this.walls[i - 1].b.y === this.walls[i].a.y) {
            //     ctx.lineTo(this.walls[i].b.x, this.walls[i].b.y);
            // } else {
            //     ctx.moveTo(this.walls[i].a.x, this.walls[i].a.y);
            //     ctx.lineTo(this.walls[i].b.x, this.walls[i].b.y);
            // }
        }
        ctx.stroke();
    }
}
