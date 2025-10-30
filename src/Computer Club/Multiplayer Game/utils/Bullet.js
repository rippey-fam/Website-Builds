export class Bullet {
    constructor({ x, y, angle, speed, w, h, round = true, color, force, parent }) {
        this.x = x;
        this.y = y;
        this.angle = angle;
        this.speed = speed;
        this.w = w;
        this.h = h;
        this.round = round;
        this.xAngle = Math.cos(angle);
        this.yAngle = Math.sin(angle);
        this.color = color;
        this.force = force;
        this.parent = parent;
    }
    move() {
        this.x += this.xAngle * this.speed;
        this.y += this.yAngle * this.speed;
    }
    act() {
        if (this.x < 0 || this.x > canvas.width || this.y < 0 || this.y > canvas.height) {
            return true;
        }
        return false;
    }
    /**
     *
     * @param {CanvasRenderingContext2D} ctx
     */
    draw(ctx) {
        ctx.strokeStyle = this.color;
        ctx.lineCap = this.round ? "round" : "square";
        ctx.lineWidth = this.w;
        ctx.beginPath();
        ctx.moveTo(this.x, this.y);
        ctx.lineTo(this.x - this.xAngle * this.h, this.y - this.yAngle * this.h);
        ctx.stroke();
    }
}
