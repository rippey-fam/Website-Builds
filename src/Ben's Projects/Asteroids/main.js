function clamp(variable, max, min) {
    if (variable > max) return max;
    if (variable < min) return min;
    return variable;
}

function distance(p1, p2) {
    return Math.hypot(p1.x - p2.x, p1.y - p2.y);
}

class Asteroid {
    constructor(x, y, size) {
        this.x = x;
        this.y = y;
        this.size = size;
        this.radius = 10 * size;
        this.angle = 0;
        this.velocity = { x: (Math.random() - 0.5) * 2, y: (Math.random() - 0.5) * 2 };
    }
    move() {
        this.x += this.velocity.x;
        this.y += this.velocity.y;
    }
    act(bullets) {
        if (this.x < -this.size * 10) {
            this.x = canvas.width + this.size * 10;
        } else if (this.x > canvas.width + this.size * 10) {
            this.x = -this.size * 10;
        }
        if (this.y < -this.size * 10) {
            this.y = canvas.height + this.size * 10;
        } else if (this.y > canvas.height + this.size * 10) {
            this.y = -this.size * 10;
        }
        for (const bullet of bullets) {
            if (Math.hypot(this.x - bullet.x, this.y - bullet.y) < this.radius) {
                bullets.splice(bullets.indexOf(bullet), 1);
                return true;
            }
        }
        return false;
    }
    draw(ctx) {
        ctx.lineWidth = 5;
        ctx.strokeStyle = "white";
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
        ctx.closePath();
        ctx.stroke();
    }
}

class BG {
    constructor(width, height, count) {
        this.stars = [];
        for (let i = 0; i < count; i++) {
            this.stars.push({
                x: Math.random() * width,
                y: Math.random() * height,
            });
        }
    }
    draw(ctx) {
        ctx.beginPath();
        ctx.strokeStyle = "white";
        ctx.lineWidth = 2;
        ctx.lineCap = "round";
        this.stars.forEach((star) => {
            ctx.moveTo(star.x, star.y);
            ctx.lineTo(star.x, star.y);
        });
        ctx.closePath();
        ctx.stroke();
    }
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
        this.rotationSpeed = 0.07;
        this.shape = [
            { x: 0, y: -11 },
            { x: -10, y: 8 },
            { x: 0, y: 5 },
            { x: 10, y: 8 },
        ];
        this.space = false;
        this.friction = 0.01;
        this.lives = 3;
        this.isDead = false;
        this.radius = 8;
        this.wasTouchingAsteroid = false;
    }
    input(keyMap, bullets) {
        this.angle += keyMap.x * this.rotationSpeed;
        this.velocity.x += Math.cos(this.angle) * this.speed * keyMap.y;
        this.velocity.y += Math.sin(this.angle) * this.speed * keyMap.y;
        this.velocity.x = clamp(this.velocity.x, 10, -10);
        this.velocity.y = clamp(this.velocity.y, 10, -10);

        this.velocity.x *= 1 - this.friction;
        this.velocity.y *= 1 - this.friction;
        if (!keyMap.space && this.space) {
            bullets.push(
                new Bullet({
                    x: this.x + Math.cos(this.angle) * -11,
                    y: this.y + Math.sin(this.angle) * -11,
                    angle: this.angle - Math.PI,
                    speed: 15,
                    h: 5,
                    w: 2,
                    round: true,
                    color: "white",
                }),
            );
        }
        this.space = keyMap.space;
    }
    move() {
        this.x += this.velocity.x;
        this.y += this.velocity.y;
    }
    act(asteroids) {
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
        let touchingAnyAsteroid = false;
        asteroids.forEach((asteroid) => {
            if (distance(this, asteroid) < asteroid.radius + this.radius) {
                if (!this.wasTouchingAsteroid) {
                    this.lives--;
                }
                touchingAnyAsteroid = true;
                if (this.lives < 0) {
                    this.isDead = true;
                }
            }
        });
        this.wasTouchingAsteroid = touchingAnyAsteroid;
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

        ctx.lineWidth = 5;
        // a good shade of blue
        ctx.strokeStyle = "#0055bc";
        ctx.fillStyle = "rgb(21, 2, 28)";
        ctx.beginPath();
        ctx.moveTo(points[0].x, points[0].y);
        for (let i = 1; i < points.length; i++) {
            ctx.lineTo(points[i].x, points[i].y);
        }
        ctx.closePath();
        ctx.stroke();
        ctx.fill();
        ctx.font = "20px Arial";
        ctx.fillStyle = "white";
        ctx.textAlign = "center";
        ctx.beginPath();
        ctx.fillText(this.lives, this.x, this.y - 20);
        ctx.closePath();
        ctx.fill();
    }
}

class Bullet {
    constructor({ x, y, angle, speed, w, h, round = true, color }) {
        this.x = x;
        this.y = y;
        this.angle = angle;
        this.speed = speed;
        this.w = w;
        this.h = h;
        this.round = round;
        this.xAngle = Math.cos(angle);
        this.yAngle = Math.sin(angle);
        this.color = color;
    }
    move() {
        this.x += this.xAngle * this.speed;
        this.y += this.yAngle * this.speed;
    }
    act() {
        if (this.x < 0 || this.x > canvas.width || this.y < 0 || this.y > canvas.height) {
            return true;
        }
        return false;
    }
    /**
     *
     * @param {CanvasRenderingContext2D} ctx
     */
    draw(ctx) {
        ctx.strokeStyle = this.color;
        ctx.lineCap = this.round ? "round" : "square";
        ctx.lineWidth = this.w;
        ctx.beginPath();
        ctx.moveTo(this.x, this.y);
        ctx.lineTo(this.x - this.xAngle * this.h, this.y - this.yAngle * this.h);
        ctx.stroke();
    }
}

/**
 * @type {HTMLCanvasElement}
 */
const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");
function resize() {
    let windowRatio = window.innerHeight / window.innerWidth;
    let canvasRatio = canvas.height / canvas.width;
    let windowTooNarrow = windowRatio > canvasRatio;
    if (windowTooNarrow) {
        canvas.style.width = `${window.innerWidth * 0.95}px`;
        canvas.style.height = "auto";
    } else {
        canvas.style.width = "auto";
        canvas.style.height = `${window.innerHeight * 0.95}px`;
    }
}
resize();
window.addEventListener("resize", resize);

let keyDown = {
    x: 0,
    y: 0,
    space: false,
};
function game() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    player.input(keyDown, bullets);

    player.move();
    bullets.forEach((bullet) => bullet.move());
    asteroids.forEach((asteroid) => asteroid.move());

    player.act(asteroids);
    bullets.forEach((bullet) => {
        let deleteBullet = bullet.act();
        if (deleteBullet) {
            bullets.filter((bullet2) => bullet2 !== bullet);
        }
    });
    asteroids.forEach((asteroid) => {
        if (asteroid.act(bullets)) {
            asteroids = asteroids.filter((asteroid2) => asteroid2 !== asteroid);
        }
    });

    background.draw(ctx);
    asteroids.forEach((asteroid) => asteroid.draw(ctx));
    player.draw(ctx);
    bullets.forEach((bullet) => bullet.draw(ctx));

    requestAnimationFrame(game);
}

let bullets = [];
let asteroids = Array(10);
for (let i = 0; i < asteroids.length; i++) {
    asteroids[i] = new Asteroid(Math.random() * canvas.width, Math.random() * canvas.height, 3);
}
let player = new Player(canvas.width / 2, canvas.height / 2);
let background = new BG(canvas.width, canvas.height, 500);

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
    } else if ((e.key = " ")) {
        keyDown.space = true;
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
    } else if ((e.key = " ")) {
        keyDown.space = false;
    }
});
