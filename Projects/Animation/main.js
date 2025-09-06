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
    constructor(
        delay,
        time,
        p1,
        p2,
        equation = (x) => {
            return x;
        },
    ) {
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
        ctx.beginPath();
        ctx.strokeStyle = "red";
        ctx.lineCap = "round";
        ctx.lineWidth = 5;
        ctx.moveTo(this.p1.x, this.p1.y);
        ctx.lineTo(this.p1.x + (this.p2.x - this.p1.x) * r, this.p1.y + (this.p2.y - this.p1.y) * r);
        ctx.closePath();
        ctx.stroke();
    }
}

class Circle {
    constructor(
        delay,
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
    ) {
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
        ctx.strokeStyle = "green";
        ctx.lineCap = "round";
        ctx.lineWidth = 10;
        ctx.beginPath();
        ctx.arc(
            this.p.x,
            this.p.y,
            this.r,
            this.start,
            this.clockwise ? this.start + this.end * r : this.start + 2 * Math.PI - this.end * r,
            !this.clockwise,
        );
        ctx.stroke();
        if (this.fill) ctx.fill();
    }
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
});

let positions = [];
let time = 1000;
canvas.addEventListener("click", (e) => {
    let canvasBounds = canvas.getBoundingClientRect();
    positions.push({ x: e.x - canvasBounds.x, y: e.y - canvasBounds.y });
    console.log(positions);
    if (positions.length === 2) {
        instances.push(new Line(0, time, positions[0], positions[1], easeInOutCubic));
        positions = [];
    }
});

canvas.addEventListener("dblclick", (e) => {
    let canvasBounds = canvas.getBoundingClientRect();
    instances.push(
        new Circle(
            0,
            time,
            { x: e.x - canvasBounds.x, y: e.y - canvasBounds.y },
            50,
            0,
            2 * Math.PI,
            false,
            true,
            easeInOutCubic,
        ),
    );
});

const timeEl = document.getElementById("time");
const timeDisp = document.getElementById("time-display");
timeDisp.innerHTML = timeEl.value;
timeEl.addEventListener("input", () => {
    timeDisp.innerHTML = timeEl.value;
    time = Number(timeEl.value);
});
