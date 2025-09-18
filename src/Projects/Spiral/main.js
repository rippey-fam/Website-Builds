import { Circle, Queue, Line, drawRect, drawLine, drawCircle } from "../../animationLib.js";
/**
 * @type {HTMLCanvasElement}
 */
const canvas = document.querySelector("#canvas");
const ctx = canvas.getContext("2d");

/**
 * @typedef {object} Point
 * @property {number} x
 * @property {number} y
 */

function interpolate(t, time, equation) {
    if (t >= 0) return equation(t < time ? t / time : 1);
    else return 0;
}

class Spiral {
    /**
     * @param {Object} param0
     * @param {Point} param0.p - x/y of spiral
     * @param {number} param0.r - radius
     * @param {number} param0.s - spacing between spiral lines
     */
    constructor({ p, r, s }) {
        this.x = p.x;
        this.y = p.y;
        this.r = r;
        this.s = s;
        this.a = r / s;
        this.creationTime = Date.now();
    }
    draw(ctx) {
        let t = Date.now() - this.creationTime;
        let r = interpolate(t, 0, (x) => x);
        ctx.strokeStyle = "black";
        ctx.lineCap = "round";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(this.x, this.y);
        for (let theta = 0; theta <= 2 * Math.PI * this.a * r; theta += 0.05) {
            let angle = theta + (Date.now() - this.creationTime) / 100;
            ctx.lineTo(
                this.x + (theta / 2) * Math.PI * this.s * Math.cos(angle),
                this.y + (theta / 2) * Math.PI * this.s * Math.sin(angle),
            );
        }
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(this.x, this.y, Math.PI * this.a * r * Math.PI * this.s, 0, 2 * Math.PI);
        ctx.stroke();
        ctx.beginPath();
        ctx.lineWidth = 10;
        ctx.moveTo(this.x, this.y);
        ctx.lineTo(this.x, this.y);
        ctx.stroke();
    }
}

/**
 * @type {Spiral[]}
 */
let instances = [];
function game() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    instances.forEach((instance) => {
        instance.draw(ctx);
    });
    requestAnimationFrame(game);
}

document.addEventListener("DOMContentLoaded", () => {
    instances.push(
        new Spiral({
            p: { x: canvas.width / 2, y: canvas.height / 2 },
            r: 32,
            s: 2,
        }),
    );
    game();
    let queue = new Queue();
    // Scaling factor
    const scale = 2;
    const margin = 300;
    // Calculate base positions
    const baseX = margin;
    const baseY = canvas.height / 2;

    queue
        .next(
            drawCircle({
                time: 30000,
                p1: { x: baseX + 7, y: baseY - 3 * scale }, // center Y, slight offset for visual balance
                r: 35 * scale,
                start: 0,
                end: 2 * Math.PI,
                fill: false,
                clockwise: true,
                color: "green",
                lineWidth: 7 * scale,
                equation: (t) => t,
                instances,
            }),
        )
        .next(
            drawLine({
                time: 500,
                p1: { x: baseX - 10 * scale, y: baseY }, // left of circle
                p2: { x: baseX, y: baseY + 10 * scale },
                color: "green",
                lineWidth: 5 * scale,
                equation: "easeIn",
                instances,
            }),
        )
        .next(
            drawLine({
                time: 500,
                p1: { x: baseX, y: baseY + 10 * scale },
                p2: { x: baseX + 20 * scale, y: baseY - 15 * scale },
                color: "green",
                lineWidth: 5 * scale,
                equation: "easeOut",
                instances,
            }),
        );
});
