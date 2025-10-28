import mapController from "./utils/controllerMapping.js";

function deadzone(joy, min) {
    if (Math.hypot(joy.x, joy.y) < min) {
        return { x: 0, y: 0 };
    }
    return joy;
}

class Player {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.radius = 15;
        this.w = 10;
        this.h = 8;
        this.angle = 0;
        this.velocity = {
            x: 0,
            y: 0,
        };
        this.speed = 0.01;
    }
    input(leftJoy, rightJoy, a, x) {
        leftJoy = deadzone(leftJoy, 0.9);
        if (leftJoy.x !== 0 && leftJoy.y !== 0) {
            this.angle = Math.atan2(leftJoy.y, leftJoy.x);
        }
        rightJoy = deadzone(rightJoy, 0.2);
        this.velocity.x += rightJoy.x * this.speed;
        this.velocity.y += rightJoy.y * this.speed;
    }
    move() {
        this.x += this.velocity.x;
        this.y += this.velocity.y;
    }
    act() {}
    /**
     *
     * @param {CanvasRenderingContext2D} ctx
     */
    draw(ctx) {
        let cos = Math.cos(this.angle);
        let sin = Math.sin(this.angle);
        let cosPlus = Math.cos(this.angle + Math.PI / 2);
        let sinPlus = Math.sin(this.angle + Math.PI / 2);
        let cosMinus = Math.cos(this.angle - Math.PI / 2);
        let sinMinus = Math.sin(this.angle - Math.PI / 2);

        let ax = this.x + (this.radius + this.h) * cos + (this.w / 2) * cosPlus;
        let ay = this.y + (this.radius + this.h) * sin + (this.w / 2) * sinPlus;

        let bx = this.x + this.radius * cos + (this.w / 2) * cosPlus;
        let by = this.y + this.radius * sin + (this.w / 2) * sinPlus;

        let cx = this.x + (this.radius + this.h) * cos + (this.w / 2) * cosMinus;
        let cy = this.y + (this.radius + this.h) * sin + (this.w / 2) * sinMinus;

        let dx = this.x + this.radius * cos + (this.w / 2) * cosMinus;
        let dy = this.y + this.radius * sin + (this.w / 2) * sinMinus;

        ctx.strokeStyle = "red";
        ctx.lineWidth = 6;

        ctx.fillStyle = "black";
        ctx.beginPath();
        ctx.moveTo(ax, ay);
        ctx.lineTo(bx, by);
        ctx.arc(
            this.x,
            this.y,
            this.radius,
            this.angle + Math.asin(this.w / 2 / this.radius),
            this.angle - Math.asin(this.w / 2 / this.radius),
            true,
        );
        ctx.lineTo(cx, cy);
        ctx.closePath();

        ctx.moveTo(this.x + this.radius, this.y);
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);

        ctx.stroke();
        ctx.fill();
    }
}

/**
 * @type {HTMLCanvasElement}
 */
const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");
canvas.height = window.innerHeight * 0.95;
canvas.width = window.innerWidth * 0.98;

ctx.textAlign = "left";
ctx.font = "30px Arial";
ctx.fillText("Connect Your Controller", canvas.width / 2 - 200, canvas.height / 2);
let count = 0;
let interval = setInterval(() => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillText(
        "Connect Your Controller" + (count % 4 === 1 ? "." : count % 4 === 2 ? ".." : count % 4 === 3 ? "..." : ""),
        canvas.width / 2 - 200,
        canvas.height / 2,
    );
    ctx.fill();
    count++;
}, 200);

window.addEventListener("gamepadconnected", (e) => {
    clearInterval(interval);
    let player = new Player(canvas.width / 2, canvas.height / 2);
    player.draw(ctx);

    function game() {
        let gp = navigator.getGamepads()[0];
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        let mapping = mapController(gp);
        player.input(
            { x: mapping.leftX, y: mapping.leftY },
            { x: mapping.rightX, y: mapping.rightY },
            mapping.a,
            mapping.x,
        );
        player.move();
        player.draw(ctx);

        requestAnimationFrame(game);
    }
    game();
});
