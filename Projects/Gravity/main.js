const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const wrapper = document.querySelector("#canvas-wrapper");
const fullscreenButton = document.querySelector("#fullscreen-button");
canvas.width = wrapper.clientWidth - 20;
canvas.height = wrapper.clientHeight - 25;

function clamp(variable, min, max) {
    if (variable > max) return max;
    if (variable < min) return min;
    return variable;
}

let friction = 0;
let tailLen = 10;
let mouseGravity = true;
let ballGravity = false;
let bouncy = false;
let radius = 3;
class Dot {
    colorsCount = 12;
    constructor(x, y) {
        this.points = [];
        this.x = x;
        this.y = y;
        this.velocity = { x: 0, y: 0 };
        this.accelerationSpeed = 0.5;
        this.color = `hsl(${Math.floor(Math.random() * this.colorsCount) * (360 / this.colorsCount)}, 100%, 50%)`;
    }
    act() {
        let bodies = [];
        if (mouseGravity) bodies.push(mouse);
        if (ballGravity) bodies.push(...dots);
        bodies.forEach((body) => {
            if (body !== this) {
                let dx = body.x - this.x;
                let dy = body.y - this.y;
                let dist = Math.sqrt(dx * dx + dy * dy);
                if (dist !== 0) {
                    dx /= dist;
                    dy /= dist;
                    this.velocity.x += dx * this.accelerationSpeed;
                    this.velocity.y += dy * this.accelerationSpeed;
                }
            }
        });
        this.velocity.x -= friction * Math.sign(this.velocity.x);
        this.velocity.y -= friction * Math.sign(this.velocity.y);
    }
    move() {
        this.x += this.velocity.x;
        this.y += this.velocity.y;
        if (this.x > canvas.width - radius || this.x < radius) {
            this.velocity.x = bouncy ? -this.velocity.x : 0;
            if (this.x < radius) this.x = radius;
            else this.x = canvas.width - radius;
        }
        if (this.y > canvas.height - radius || this.y < radius) {
            this.velocity.y = bouncy ? -this.velocity.y : 0;
            if (this.y < radius) this.y = radius;
            else this.y = canvas.height - radius;
        }
        this.points.push({ x: this.x, y: this.y });
        if (this.points.length >= tailLen) {
            while (this.points.length > tailLen + 1) this.points.shift();
        }
    }
    draw() {
        ctx.beginPath();
        ctx.strokeStyle = this.color;
        ctx.lineCap = "round";
        ctx.moveTo(this.points[0].x, this.points[0].y);
        ctx.lineWidth = radius == 0 ? 0.5 : radius;
        this.points.forEach((val) => {
            ctx.lineTo(val.x, val.y);
        });
        ctx.stroke();
        ctx.beginPath();
        ctx.fillStyle = this.color;
        this.strokeStyle = "black";
        ctx.lineWidth = 2;
        ctx.arc(this.x, this.y, radius, 0, Math.PI * 2);
        ctx.stroke();
        ctx.fill();
    }
}

function move() {
    dots.forEach((val) => {
        val.move();
    });
}

function draw() {
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    dots.forEach((val) => {
        val.draw();
    });
}

function act() {
    dots.forEach((val) => {
        val.act();
    });
}

let speed = 1;

function game() {
    for (let i = 0; i < speed; i++) {
        act();
        move();
    }
    draw();
    requestAnimationFrame(game);
}

dots = [new Dot(100, 100)];
document.addEventListener("DOMContentLoaded", () => {
    game();
});

let mouse = { x: canvas.width / 2, y: canvas.height / 2 };
let realMouse = { x: canvas.width / 2, y: canvas.height / 2 };
let mouseLocked = false;
document.addEventListener("mousemove", (e) => {
    let canvasBounds = canvas.getBoundingClientRect();
    realMouse.x = e.x - canvasBounds.x;
    realMouse.y = e.y - canvasBounds.y;
    if (!mouseLocked) {
        mouse.x = e.x - canvasBounds.x;
        mouse.y = e.y - canvasBounds.y;
    }
});

canvas.addEventListener("click", (e) => {
    dots.push(new Dot(mouse.x, mouse.y));
});

canvas.addEventListener("dblclick", (e) => {
    for (let i = 0; i < 5; i++) {
        dots.push(new Dot(mouse.x + (Math.random() - 0.5) * 500, mouse.y + (Math.random() - 0.5) * 500));
    }
});

let displayButton = true;
fullscreenButton.addEventListener("click", (e) => {
    wrapper.requestFullscreen();
    fullscreenButton.style.display = "none";
    deleteButton.style.display = "none";
});

wrapper.addEventListener("fullscreenchange", (e) => {
    if (!displayButton) {
        fullscreenButton.style.display = "flex";
        deleteButton.style.display = "flex";
        displayButton = true;
    } else {
        displayButton = false;
    }
});

const frictionEl = document.querySelector("#friction");
const frictionDisp = document.querySelector("#friction-display");
frictionEl.addEventListener("input", () => {
    friction = parseInt(frictionEl.value);
    frictionDisp.innerHTML = frictionEl.value;
});

const tailLenEl = document.querySelector("#tail-length");
const tailLenDisp = document.querySelector("#tail-length-display");
tailLenEl.addEventListener("input", () => {
    tailLen = parseInt(tailLenEl.value);
    tailLenDisp.innerHTML = tailLenEl.value;
});

const speedEl = document.querySelector("#speed");
const speedDisp = document.querySelector("#speed-display");
speedEl.addEventListener("input", () => {
    speed = parseInt(speedEl.value);
    speedDisp.innerHTML = speedEl.value + "x";
});

const radiusEl = document.querySelector("#ball-radius");
const radiusDisp = document.querySelector("#ball-radius-display");
radiusEl.addEventListener("input", () => {
    radius = parseInt(radiusEl.value);
    radiusDisp.innerHTML = radiusEl.value;
});

const mouseGravityEl = document.querySelector("#mouse-gravity");
mouseGravityEl.addEventListener("input", () => {
    mouseGravity = mouseGravityEl.checked;
});

const ballGravityEl = document.querySelector("#ball-gravity");
ballGravityEl.addEventListener("input", () => {
    ballGravity = ballGravityEl.checked;
});

const bouncyEl = document.querySelector("#bouncy");
bouncyEl.addEventListener("input", () => {
    bouncy = bouncyEl.checked;
});

const deleteButton = document.querySelector("#trash-button");
deleteButton.addEventListener("click", () => {
    dots = [];
});

const mouseLockedDisp = document.querySelector("#mouse-locked-indicator");

document.addEventListener("keydown", (e) => {
    switch (e.key) {
        case "ArrowLeft":
            tailLen -= 5;
            tailLen = clamp(tailLen, 0, 1000);
            tailLenEl.value = tailLen;
            tailLenDisp.innerHTML = tailLenEl.value;
            break;
        case "ArrowRight":
            tailLen += 5;
            tailLen = clamp(tailLen, 0, 1000);
            tailLenEl.value = tailLen;
            tailLenDisp.innerHTML = tailLenEl.value;
            break;
        case "m":
            mouseGravityEl.checked = !mouseGravityEl.checked;
            mouseGravity = mouseGravityEl.checked;
            break;
        case "b":
            ballGravityEl.checked = !ballGravityEl.checked;
            ballGravity = ballGravityEl.checked;
            break;
        case "o":
            bouncyEl.checked = !bouncyEl.checked;
            bouncy = bouncyEl.checked;
            break;
        case "l":
            mouseLocked = !mouseLocked;
            if (mouseLocked) mouseLockedDisp.innerHTML = "✔";
            else {
                mouseLockedDisp.innerHTML = "✖";
                mouse.x = realMouse.x;
                mouse.y = realMouse.y;
            }
            break;
        case "u":
            if (dots.length > 0) dots.pop();
            break;
        case ",":
            speed -= 1;
            speed = clamp(speed, 0, 10);
            speedEl.value = speed;
            speedDisp.innerHTML = speedEl.value + "x";
            break;
        case ".":
            speed += 1;
            speed = clamp(speed, 0, 10);
            speedEl.value = speed;
            speedDisp.innerHTML = speedEl.value + "x";
            break;
        default:
            break;
    }
});
