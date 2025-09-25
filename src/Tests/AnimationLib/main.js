import { Circle, Queue, Line, drawRect, drawLine, drawCircle } from "../../animationLib.js";

const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");

/**
 * @type Line|Circle[]
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
    game();
    let queue = new Queue();
    queue
        .next(
            drawRect({
                time: 4000,
                drawType: "windmill",
                p1: { x: 100, y: 100 },
                p2: { x: 300, y: 300 },
                overlap: 1000,
                color: "red",
                lineWidth: 5,
                equation: "easeInOut",
                instances,
            }),
        )
        .next(
            drawLine({
                time: 1000,
                p1: { x: 400, y: 100 },
                p2: { x: 400, y: 300 },
                color: "blue",
                lineWidth: 10,
                equation: "easeOutBounce",
                instances,
            }),
        )
        .next(
            drawCircle({
                time: 1000,
                p1: { x: 600, y: 200 },
                r: 50,
                start: 0,
                end: 2 * Math.PI,
                fill: false,
                clockwise: true,
                color: "green",
                lineWidth: 8,
                equation: "easeOut",
                instances,
            }),
        )
        .reset();
});
