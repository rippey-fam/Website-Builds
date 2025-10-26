/**
 * @type {HTMLCanvasElement}
 */
const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");
function resize() {
    canvas.height = window.innerHeight * 0.97;
    canvas.width = window.innerWidth * 0.99;
}

window.addEventListener("resize", resize);
resize();

let frameCount = 0;
let x = 10;
let y = 100;
let keyDown = {
    x: 0,
    y: 0,
};
let speed = 10;
function game() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x + 50, y + 100);
    ctx.lineTo(x + 100, y);
    ctx.closePath();
    ctx.fill();
    ctx.fillText(frameCount++, 500, 500);
    ctx.fill();
    x = x + keyDown.x * speed;
    y = y + keyDown.y * speed;
    requestAnimationFrame(game);
}

game();

document.addEventListener("keydown", (e) => {
    if (e.key === "ArrowUp") {
        keyDown.y = -1;
    } else if (e.key === "ArrowDown") {
        keyDown.y = 1;
    } else if (e.key === "ArrowLeft") {
        keyDown.x = -1;
    } else if (e.key === "ArrowRight") {
        keyDown.x = 1;
    }
});

document.addEventListener("keyup", (e) => {
    keyDown.x = 0;
    keyDown.y = 0;
});
