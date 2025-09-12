const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth - 20;
canvas.height = window.innerHeight - 25;

class Dot {
    colorsCount = 12;
    constructor(x, y, angle, speed) {
        this.x = x;
        this.y = y;
        this.radius = 10;
        this.speed = speed;
        this.acc = 0;
        this.color = `hsl(${Math.floor(Math.random() * this.colorsCount) * (360 / this.colorsCount)}, 100%, 50%)`;
        this.velocity = [Math.cos(angle), Math.sin(angle)];
    }

    move() {
        for (let i = 0; i < this.speed; i++) {
            this.x += this.velocity[0];
            if (this.x > canvas.width - this.radius || this.x < 5) this.velocity[0] *= -1;
            this.y += this.velocity[1];
            if (this.y > canvas.height - this.radius || this.y < 5) this.velocity[1] *= -1;
        }
    }
    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
    }
}

function move() {
    dots.forEach((val) => {
        val.move();
    });
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    dots.forEach((val) => {
        val.draw();
    });
    if (mouseDown) {
        ctx.beginPath();
        ctx.arc(...mouseStart, 2, 0, Math.PI * 2);
        ctx.fillStyle = "black";
        ctx.fill();
        ctx.stroke();
        ctx.strokeStyle = "black";
        ctx.beginPath();
        ctx.setLineDash([5, 10]);
        ctx.moveTo(...mouseStart);
        ctx.lineTo(mouse.x, mouse.y);
        ctx.stroke();
    }
}

function game() {
    move();
    draw();
    requestAnimationFrame(game);
}

const dots = [];
for (let i = 0; i < 10; i++) {
    dots.push(new Dot(canvas.width / 2, canvas.height / 2, Math.random() * Math.PI * 2, Math.random() * 10 + 10));
}

document.addEventListener("DOMContentLoaded", () => {
    game();
});

let mouseStart;
let mouseDown = false;
let mouse = {
    x: 0,
    y: 0,
};

canvas.addEventListener("mousemove", (e) => {
    mouse.x = e.offsetX;
    mouse.y = e.offsetY;
});

canvas.addEventListener("mousedown", (e) => {
    mouseStart = [e.offsetX, e.offsetY];
    mouseDown = true;
});

canvas.addEventListener("mouseup", (e) => {
    mouseDown = false;
    dots.push(
        new Dot(
            ...mouseStart,
            Math.atan((e.offsetY - mouseStart[1]) / (e.offsetX - mouseStart[0])),
            (Math.sign(e.offsetX - mouseStart[0]) * Math.hypot(e.offsetX - mouseStart[0], e.offsetY - mouseStart[1])) /
                10,
        ),
    );
});
