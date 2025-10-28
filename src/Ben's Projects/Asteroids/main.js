function clamp(variable, max, min) {
    if (variable > max) return max;
    if (variable < min) return min;
    return variable;
}

class Player {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.velocity = {
            x: 0,
            y: 0,
        };
        this.speed = 0.1;
        this.angle = Math.PI / 2;
        this.maxSpeed = 10;
        this.rotationSpeed = 0.1;
        this.shape = [
            { x: 0, y: -11 },
            { x: -10, y: 8 },
            { x: 0, y: 5 },
            { x: 10, y: 8 },
        ];
    }
    input(keyMap) {
        this.angle += keyMap.x * this.rotationSpeed;
        this.velocity.x += Math.cos(this.angle) * this.speed * keyMap.y;
        this.velocity.y += Math.sin(this.angle) * this.speed * keyMap.y;
        this.velocity.x = clamp(this.velocity.x, 10, -10);
        this.velocity.y = clamp(this.velocity.y, 10, -10);
    }
    move() {
        this.x += this.velocity.x;
        this.y += this.velocity.y;
    }
    act() {
        if (this.x < 0) {
            this.x = canvas.width;
        } else if (this.x > canvas.width) {
            this.x = 0;
        }
        if (this.y < 0) {
            this.y = canvas.height;
        } else if (this.y > canvas.height) {
            this.y = 0;
        }
    }
    /**
     *
     * @param {CanvasRenderingContext2D} ctx
     */
    draw(ctx) {
        let points = [];
        let cos = Math.cos(this.angle - Math.PI / 2);
        let sin = Math.sin(this.angle - Math.PI / 2);

        for (let i = 0; i < this.shape.length; i++) {
            let point = this.shape[i];
            let xP = point.x;
            let yP = point.y;
            let absx = xP * cos - yP * sin;
            let absy = xP * sin + yP * cos;
            points.push({ x: this.x + absx, y: this.y + absy });
        }

        ctx.lineWidth = 2;
        // a good shade of blue
        ctx.strokeStyle = "#0055bcff";
        ctx.beginPath();
        ctx.moveTo(points[0].x, points[0].y);
        for (let i = 1; i < points.length; i++) {
            ctx.lineTo(points[i].x, points[i].y);
        }
        ctx.closePath();
        ctx.stroke();
    }
}

/**
 * @type {HTMLCanvasElement}
 */
const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");
function resize() {
    canvas.height = window.innerHeight * 0.95;
    canvas.width = window.innerWidth * 0.95;
}

window.addEventListener("resize", resize);
resize();

let keyDown = {
    x: 0,
    y: 0,
};
function game() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    player.input(keyDown);
    player.move();
    player.act();
    player.draw(ctx);
    requestAnimationFrame(game);
}

let player = new Player(canvas.width / 2, canvas.height / 2);

game();

document.addEventListener("keydown", (e) => {
    if (e.repeat) return;
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
    if (e.key === "ArrowUp") {
        keyDown.y = 0;
    } else if (e.key === "ArrowDown") {
        keyDown.y = 0;
    } else if (e.key === "ArrowLeft") {
        keyDown.x = 0;
    } else if (e.key === "ArrowRight") {
        keyDown.x = 0;
    }
});
