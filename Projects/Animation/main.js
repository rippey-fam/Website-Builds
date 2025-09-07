const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");

function easeInOutCubic(x) {
    return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
}

function interpolate(t, time, equation) {
    if (t >= 0) return equation(t < time ? t / time : 1);
    else return 0;
}

function getMillisecondsPlusDate() {
    let date = new Date();
    return (
        date.getMilliseconds() +
        date.getSeconds() * 1000 +
        date.getMinutes() * 60 * 1000 +
        date.getHours() * 60 * 60 * 1000
    );
}

class Line {
    constructor({
        delay = 0,
        time,
        p1,
        p2,
        equation = (x) => {
            return x;
        },
    }) {
        this.delay = delay;
        this.time = time;
        this.p1 = p1;
        this.p2 = p2;
        this.equation = equation;
        this.creationTime = getMillisecondsPlusDate();
    }
    draw() {
        let t = getMillisecondsPlusDate() - this.creationTime;
        t -= this.delay;
        let r = interpolate(t, this.time, this.equation);
        if (r !== 0) {
            ctx.beginPath();
            ctx.strokeStyle = "red";
            ctx.lineCap = "round";
            ctx.lineWidth = 7;
            ctx.moveTo(this.p1.x, this.p1.y);
            ctx.lineTo(this.p1.x + (this.p2.x - this.p1.x) * r, this.p1.y + (this.p2.y - this.p1.y) * r);
            ctx.stroke();
        }
    }
    getDelay() {
        return this.delay;
    }
}

class Circle {
    constructor({
        delay = 0,
        time,
        p,
        r,
        start,
        end,
        fill,
        clockwise,
        equation = (x) => {
            return x;
        },
    }) {
        this.delay = delay;
        this.time = time;
        this.p = p;
        this.r = r;
        this.start = start;
        this.end = end;
        this.fill = fill;
        this.clockwise = clockwise;
        this.equation = equation;
        this.creationTime = getMillisecondsPlusDate();
    }
    draw() {
        let t = getMillisecondsPlusDate() - this.creationTime;
        t -= this.delay;
        let r = interpolate(t, this.time, this.equation);
        if (r !== 0) {
            ctx.strokeStyle = "green";
            ctx.lineCap = "round";
            ctx.lineWidth = 8;
            ctx.beginPath();
            ctx.arc(
                this.p.x,
                this.p.y,
                this.r,
                this.start,
                this.clockwise ? this.start + this.end * r : this.start - this.end * r,
                !this.clockwise,
            );
            ctx.stroke();
            if (this.fill) ctx.fill();
        }
    }
    getDelay() {
        return this.delay;
    }
}

class Queue {
    constructor() {
        this.totalDelay = 0;
    }
    next(callback) {
        this.totalDelay += callback(this.totalDelay);
        return this;
    }
    delay(num) {
        this.totalDelay += num;
        return this;
    }
    reset() {
        this.totalDelay = 0;
        return this;
    }
}

// ...existing code...
function drawX(delay) {
    let x = Math.random() * 500 + 50;
    let y = Math.random() * 500 + 50;
    let size = 50;
    let time = 1000;
    let overlap = 500;
    const half = size / 2;
    const p1 = { x: x - half, y: y - half };
    const p2 = { x: x + half, y: y + half };
    const p3 = { x: x - half, y: y + half };
    const p4 = { x: x + half, y: y - half };
    let left = new Line({
        delay,
        time: time,
        p1: p1,
        p2: p2,
        equation: easeInOutCubic,
    });
    let right = new Line({
        delay: delay + time - overlap,
        time: time,
        p1: p4,
        p2: p3,
        equation: easeInOutCubic,
    });
    instances.push(left);
    instances.push(right);
    return left.getDelay() + right.getDelay() - overlap;
}

function drawO(delay) {
    let x = Math.random() * 500 + 50;
    let y = Math.random() * 500 + 50;
    let size = 30;
    let time = 1000;
    let circle = new Circle({
        delay,
        time,
        p: { x, y },
        r: size,
        start: 0,
        end: 2 * Math.PI,
        fill: false,
        clockwise: true,
        equation: easeInOutCubic,
    });
    instances.push(circle);
    return circle.getDelay();
}

/**
 * @type Line[]
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
    let queue = new Queue();
    queue.delay(1000).next(drawO).next(drawX).delay(500).next(drawO).next(drawX).next(drawO).next(drawX).reset();
});

let positions = [];
let time = 1000;
canvas.addEventListener("click", (e) => {
    let canvasBounds = canvas.getBoundingClientRect();
    positions.push({ x: e.x - canvasBounds.x, y: e.y - canvasBounds.y });
    console.log(positions);
    if (positions.length === 2) {
        if (positions[0].x !== positions[1].x && positions[0].y !== positions[1].y)
            instances.push(new Line({ delay: 0, time, p1: positions[0], p2: positions[1], equation: easeInOutCubic }));
        positions = [];
    }
});

canvas.addEventListener("dblclick", (e) => {
    let canvasBounds = canvas.getBoundingClientRect();
    instances.push(
        new Circle({
            delay: 0,
            time,
            p: { x: e.x - canvasBounds.x, y: e.y - canvasBounds.y },
            r: 50,
            start: 0,
            end: 2 * Math.PI,
            fill: false,
            clockwise: !true,
            equation: easeInOutCubic,
        }),
    );
    positions = [];
});

const timeEl = document.getElementById("time");
const timeDisp = document.getElementById("time-display");
timeDisp.innerHTML = timeEl.value;
timeEl.addEventListener("input", () => {
    timeDisp.innerHTML = timeEl.value;
    time = Number(timeEl.value);
});
