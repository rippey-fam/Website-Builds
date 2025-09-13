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
    draw() {
        let t = Date.now() - this.creationTime;
        let r = interpolate(t, 100000, (x) => x);
        ctx.strokeStyle = "red";
        ctx.lineCap = "round";
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(this.x, this.y);
        for (let theta = 0; theta <= 2 * Math.PI * this.a * r; theta += 0.1) {
            ctx.lineTo(
                this.x + (theta / 2) * Math.PI * this.s * Math.cos(theta),
                this.y + (theta / 2) * Math.PI * this.s * Math.sin(theta),
            );
        }
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
        instance.draw();
    });
    requestAnimationFrame(game);
}

document.addEventListener("DOMContentLoaded", () => {
    game();
});

let mouse = { x: canvas.width / 2, y: canvas.height / 2 };
document.addEventListener("mousemove", (e) => {
    let canvasBounds = canvas.getBoundingClientRect();
    mouse.x = e.x - canvasBounds.x;
    mouse.y = e.y - canvasBounds.y;
});

document.addEventListener("click", () => {
    instances.push(
        new Spiral({
            p: mouse,
            r: 1000,
            s: 2,
        }),
    );
});
