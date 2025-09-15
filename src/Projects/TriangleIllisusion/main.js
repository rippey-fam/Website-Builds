/**
 * @type {HTMLCanvasElement}
 */
const canvas = document.querySelector("#canvas");
const ctx = canvas.getContext("2d");

sum = (end) => (end ** 2 + end) / 2;

let v = {
    x: [],
    y: [],
};

let total = 0;
let xCount = 55;
let xScale = canvas.width / sum(xCount);
for (let i = 1; i <= xCount; i++) {
    total += i;
    v.x.push(total * xScale);
}

total = 0;
let yCount = 30;
let yScale = canvas.height / sum(yCount);
for (let i = 1; i <= yCount; i++) {
    total += i;
    v.y.push(total * yScale);
}

function drawTriangle(p1, p2, p3) {
    ctx.beginPath();
    ctx.moveTo(p1.x, p1.y);
    ctx.lineTo(p2.x, p2.y);
    ctx.lineTo(p3.x, p3.y);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
}

for (let i = 0; i < v.x.length; i++) {
    for (let j = 0; j < v.y.length; j++) {
        ctx.fillStyle = `hsl(${(j / v.y.length) * 360}, 100%, ${40 + (i / v.x.length) * 25}%)`;
        drawTriangle({ x: v.x[i], y: v.y[j + 1] }, { x: v.x[i + 1], y: v.y[j] }, { x: v.x[i + 1], y: v.y[j + 1] });
    }
}
