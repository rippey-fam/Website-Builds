export class Bullet {
    constructor({ x, y, angle, speed, w, h, round = true, color, force, parent, width, height }) {
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
        this.width = width;
        this.height = height;
    }
    move() {
        this.x += this.xAngle * this.speed;
        this.y += this.yAngle * this.speed;
    }
    act(wall) {
        let prevX = this.x - this.xAngle * this.speed;
        let prevY = this.y - this.yAngle * this.speed;

        let stepX = (this.x - prevX) / this.speed;
        let stepY = (this.y - prevY) / this.speed;

        for (let i = 0; i < this.speed; i++) {
            let checkX = prevX + stepX * i;
            let checkY = prevY + stepY * i;
            if (wall.check(checkX, checkY, this.w / 2)) {
                return true;
            }
        }
        if (this.x < 0) this.x = this.width;
        if (this.x > this.width) this.x = 0;
        if (this.y < 0) this.y = this.height;
        if (this.y > this.height) this.y = 0;
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
