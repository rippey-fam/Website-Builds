// Canvas setup
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const SCALE = 5;
const SCREEN_WIDTH = 128;
const SCREEN_HEIGHT = 64;
const HUD_HEIGHT = 10;

// Set canvas to crisp pixel rendering
ctx.imageSmoothingEnabled = false;

// Input handling
const input = {
    left: false,
    right: false,
    up: false,
    down: false,
    shoot: false,
    reset: false,
};

let prevShoot = false;

document.addEventListener("keydown", (e) => {
    switch (e.code) {
        case "ArrowLeft":
            input.left = true;
            break;
        case "ArrowRight":
            input.right = true;
            break;
        case "ArrowUp":
            input.up = true;
            break;
        case "ArrowDown":
            input.down = true;
            break;
        case "Space":
            input.shoot = true;
            e.preventDefault();
            break;
        case "KeyR":
            input.reset = true;
            break;
    }
});

document.addEventListener("keyup", (e) => {
    switch (e.code) {
        case "ArrowLeft":
            input.left = false;
            break;
        case "ArrowRight":
            input.right = false;
            break;
        case "ArrowUp":
            input.up = false;
            break;
        case "ArrowDown":
            input.down = false;
            break;
        case "Space":
            input.shoot = false;
            break;
        case "KeyR":
            input.reset = false;
            break;
    }
});

// Utility functions
function distance(x1, y1, x2, y2) {
    return Math.sqrt((x1 - x2) ** 2 + (y1 - y2) ** 2);
}

function normalize(x, y) {
    const len = Math.sqrt(x * x + y * y);
    if (len === 0) return { x: 0, y: 0 };
    return { x: x / len, y: y / len };
}

function wrapPosition(x, y, radius = 0) {
    let newX = x,
        newY = y;

    if (x > SCREEN_WIDTH + radius) newX = -radius;
    if (x < -radius) newX = SCREEN_WIDTH + radius;
    if (y > SCREEN_HEIGHT + radius) newY = HUD_HEIGHT - radius;
    if (y < HUD_HEIGHT - radius) newY = SCREEN_HEIGHT + radius;

    return { x: newX, y: newY };
}

// High score management
function getHighScore() {
    return parseInt(localStorage.getItem("spaceRocksHigh") || "0");
}

function setHighScore(score) {
    localStorage.setItem("spaceRocksHigh", score.toString());
}

// Drawing functions
function clear() {
    ctx.fillStyle = "#000";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function drawPixel(x, y) {
    ctx.fillRect(Math.floor(x * SCALE), Math.floor(y * SCALE), SCALE, SCALE);
}

function drawCircle(x, y, radius, filled = false) {
    ctx.beginPath();
    ctx.arc(x * SCALE + SCALE / 2, y * SCALE + SCALE / 2, radius * SCALE, 0, Math.PI * 2);
    if (filled) {
        ctx.fill();
    } else {
        ctx.stroke();
    }
}

function drawText(text, x, y, color = "#fff") {
    ctx.fillStyle = color;
    ctx.font = `${8 * SCALE}px monospace`;
    ctx.textBaseline = "top";
    ctx.fillText(text, x * SCALE, y * SCALE);
}

function drawLine(x1, y1, x2, y2) {
    ctx.strokeStyle = "#fff";
    ctx.lineWidth = SCALE;
    ctx.beginPath();
    ctx.moveTo(x1 * SCALE, y1 * SCALE);
    ctx.lineTo(x2 * SCALE, y2 * SCALE);
    ctx.stroke();
    ctx.lineWidth = 1;
}

function drawHeart(x, y) {
    // Simple heart shape using pixels
    ctx.fillStyle = "#fff";
    const heart = [
        [0, 1, 1, 0, 1, 1, 0],
        [1, 1, 1, 1, 1, 1, 1],
        [1, 1, 1, 1, 1, 1, 1],
        [0, 1, 1, 1, 1, 1, 0],
        [0, 0, 1, 1, 1, 0, 0],
        [0, 0, 0, 1, 0, 0, 0],
    ];

    for (let row = 0; row < heart.length; row++) {
        for (let col = 0; col < heart[row].length; col++) {
            if (heart[row][col]) {
                drawPixel(x + col, y + row);
            }
        }
    }
}

// Particle system
class Particle {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.vx = (Math.random() - 0.5) * 8;
        this.vy = (Math.random() - 0.5) * 8;
        this.life = 30;
        this.maxLife = 30;
    }

    update() {
        this.x += this.vx;
        this.y += this.vy;
        this.life--;
        return this.life > 0;
    }

    draw() {
        const alpha = this.life / this.maxLife;
        ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
        drawPixel(this.x, this.y);
    }
}

// Bullet class
class Bullet {
    constructor(x, y, vx, vy) {
        this.x = x;
        this.y = y;
        // If player isn't moving, shoot upward
        if (vx === 0 && vy === 0) {
            this.vx = 0;
            this.vy = -8;
        } else {
            const norm = normalize(vx, vy);
            this.vx = norm.x * 8;
            this.vy = norm.y * 8;
        }
    }

    update() {
        this.x += this.vx;
        this.y += this.vy;

        // Remove if off screen
        return !(this.x < 0 || this.x > SCREEN_WIDTH || this.y < HUD_HEIGHT || this.y > SCREEN_HEIGHT);
    }

    draw() {
        ctx.fillStyle = "#fff";
        drawPixel(this.x, this.y);
    }
}

// Asteroid class
class Asteroid {
    constructor() {
        this.radius = 7 + Math.random() * 5; // 7-12
        this.size = Math.floor(((this.radius - 7) / 5) * 2); // 0 or 1
        this.speed = 1.5 - this.size * 0.5;

        // Spawn from edges
        const edge = Math.floor(Math.random() * 4);
        switch (edge) {
            case 0: // top
                this.x = Math.random() * SCREEN_WIDTH;
                this.y = -this.radius;
                break;
            case 1: // right
                this.x = SCREEN_WIDTH + this.radius;
                this.y = HUD_HEIGHT + Math.random() * (SCREEN_HEIGHT - HUD_HEIGHT);
                break;
            case 2: // bottom
                this.x = Math.random() * SCREEN_WIDTH;
                this.y = SCREEN_HEIGHT + this.radius;
                break;
            case 3: // left
                this.x = -this.radius;
                this.y = HUD_HEIGHT + Math.random() * (SCREEN_HEIGHT - HUD_HEIGHT);
                break;
        }

        // Move toward center with some randomness
        const centerX = SCREEN_WIDTH / 2;
        const centerY = SCREEN_HEIGHT / 2;
        const norm = normalize(
            centerX - this.x + (Math.random() - 0.5) * 40,
            centerY - this.y + (Math.random() - 0.5) * 40,
        );
        this.vx = norm.x * this.speed;
        this.vy = norm.y * this.speed;

        this.rotateTimer = 0;
        this.destroyed = false;
        this.particles = [];
    }

    update() {
        if (!this.destroyed) {
            this.x += this.vx;
            this.y += this.vy;

            // Slight direction changes
            this.rotateTimer++;
            if (this.rotateTimer > 60) {
                this.rotateTimer = 0;
                this.vx += (Math.random() - 0.5) * 0.5;
                this.vy += (Math.random() - 0.5) * 0.5;
                const norm = normalize(this.vx, this.vy);
                this.vx = norm.x * this.speed;
                this.vy = norm.y * this.speed;
            }

            // Wrap around screen
            const wrapped = wrapPosition(this.x, this.y, this.radius);
            this.x = wrapped.x;
            this.y = wrapped.y;
        } else {
            // Update particles
            this.particles = this.particles.filter((p) => p.update());
        }

        return !this.destroyed || this.particles.length > 0;
    }

    destroy() {
        this.destroyed = true;
        // Create explosion particles
        for (let i = 0; i < 15; i++) {
            this.particles.push(new Particle(this.x, this.y));
        }
        return this.size === 0 ? 2 : 1; // Small asteroids worth more
    }

    draw() {
        if (!this.destroyed) {
            ctx.strokeStyle = "#fff";
            ctx.lineWidth = SCALE;
            drawCircle(this.x, this.y, this.radius);
        } else {
            this.particles.forEach((p) => p.draw());
        }
    }
}

// Player class
class Player {
    constructor() {
        this.x = SCREEN_WIDTH / 2;
        this.y = SCREEN_HEIGHT / 2;
        this.vx = 0;
        this.vy = 0;
        this.radius = 2;
        this.lives = 3;
        this.invulnerable = 0;
        this.shootCooldown = 0;
        this.bullets = [];
        this.destroyed = false;
        this.particles = [];
    }

    update() {
        if (!this.destroyed) {
            // Handle input
            const accel = 0.3;
            if (input.left) this.vx -= accel;
            if (input.right) this.vx += accel;
            if (input.up) this.vy -= accel;
            if (input.down) this.vy += accel;

            // Apply friction
            this.vx *= 0.98;
            this.vy *= 0.98;

            // Move
            this.x += this.vx;
            this.y += this.vy;

            // Wrap around screen
            const wrapped = wrapPosition(this.x, this.y, this.radius);
            this.x = wrapped.x;
            this.y = wrapped.y;

            // Shooting
            this.shootCooldown--;
            if (input.shoot && !prevShoot && this.shootCooldown <= 0) {
                this.bullets.push(new Bullet(this.x, this.y, this.vx, this.vy));
                this.shootCooldown = 10;
            }
            prevShoot = input.shoot;

            // Update bullets
            this.bullets = this.bullets.filter((bullet) => bullet.update());

            // Update invulnerability
            if (this.invulnerable > 0) this.invulnerable--;
        } else {
            // Update death particles
            this.particles = this.particles.filter((p) => p.update());
        }
    }

    hit() {
        if (this.invulnerable === 0) {
            this.lives--;
            if (this.lives <= 0) {
                this.destroyed = true;
                // Create death explosion
                for (let i = 0; i < 20; i++) {
                    this.particles.push(new Particle(this.x, this.y));
                }
            } else {
                this.invulnerable = 120; // 2 seconds of invulnerability
            }
        }
    }

    draw() {
        if (!this.destroyed) {
            // Flash when invulnerable
            if (this.invulnerable === 0 || Math.floor(this.invulnerable / 5) % 2 === 0) {
                ctx.strokeStyle = "#fff";
                ctx.lineWidth = SCALE;
                drawCircle(this.x, this.y, this.radius);
            }

            // Draw bullets
            this.bullets.forEach((bullet) => bullet.draw());
        } else {
            this.particles.forEach((p) => p.draw());
        }
    }
}

// HUD class
class HUD {
    draw(score, lives, highScore) {
        // Clear HUD area
        ctx.fillStyle = "#000";
        ctx.fillRect(0, 0, canvas.width, HUD_HEIGHT * SCALE);

        // Draw line
        drawLine(0, HUD_HEIGHT, SCREEN_WIDTH, HUD_HEIGHT);

        // Draw score
        drawText(score.toString(), 2, 1);

        // Draw high score (centered)
        const highStr = highScore.toString();
        const highX = Math.floor((SCREEN_WIDTH - highStr.length * 8) / 2);
        drawText(highStr, highX, 1);

        // Draw lives as hearts
        for (let i = 0; i < lives; i++) {
            drawHeart(SCREEN_WIDTH - 10 - i * 10, 1);
        }
    }
}

// Game class
class Game {
    constructor() {
        this.state = "menu";
        this.player = null;
        this.asteroids = [];
        this.hud = new HUD();
        this.score = 0;
        this.highScore = getHighScore();
        this.menuTimer = 0;
        this.gameOverTimer = 0;
        this.logoPos = -50;
        this.showPressStart = true;
        this.blinkTimer = 0;
    }

    update() {
        switch (this.state) {
            case "menu":
                this.updateMenu();
                break;
            case "playing":
                this.updateGame();
                break;
            case "gameOver":
                this.updateGameOver();
                break;
        }
    }

    updateMenu() {
        this.menuTimer++;

        // Animate logo
        if (this.logoPos < SCREEN_WIDTH / 2) {
            this.logoPos += 2;
        }

        // Blink "PRESS TO START"
        this.blinkTimer++;
        if (this.blinkTimer > 60) {
            this.showPressStart = !this.showPressStart;
            this.blinkTimer = 0;
        }

        // Start game
        if (input.shoot) {
            this.startGame();
        }
    }

    updateGame() {
        // Update player
        this.player.update();

        // Spawn asteroids
        if (this.asteroids.length < 3) {
            this.asteroids.push(new Asteroid());
        }
        if (Math.random() < 0.01 && this.asteroids.length < 5) {
            this.asteroids.push(new Asteroid());
        }

        // Update asteroids
        this.asteroids = this.asteroids.filter((asteroid) => asteroid.update());

        // Check collisions - bullets vs asteroids
        for (let bullet of this.player.bullets) {
            for (let i = this.asteroids.length - 1; i >= 0; i--) {
                const asteroid = this.asteroids[i];
                if (!asteroid.destroyed && distance(bullet.x, bullet.y, asteroid.x, asteroid.y) < asteroid.radius) {
                    // Remove bullet
                    const bulletIndex = this.player.bullets.indexOf(bullet);
                    this.player.bullets.splice(bulletIndex, 1);

                    // Destroy asteroid and add score
                    this.score += asteroid.destroy();
                    break;
                }
            }
        }

        // Check collisions - player vs asteroids
        if (!this.player.destroyed) {
            for (let asteroid of this.asteroids) {
                if (
                    !asteroid.destroyed &&
                    distance(this.player.x, this.player.y, asteroid.x, asteroid.y) <
                        asteroid.radius + this.player.radius
                ) {
                    this.player.hit();
                    break;
                }
            }
        }

        // Update high score
        if (this.score > this.highScore) {
            this.highScore = this.score;
            setHighScore(this.score);
        }

        // Check game over
        if (this.player.destroyed && this.player.particles.length === 0) {
            this.state = "gameOver";
            this.gameOverTimer = 0;
        }

        // Reset high score
        if (input.reset && input.shoot) {
            setHighScore(0);
            this.highScore = 0;
        }
    }

    updateGameOver() {
        this.gameOverTimer++;
        if (this.gameOverTimer > 180) {
            // 3 seconds
            this.resetGame();
        }
    }

    startGame() {
        this.state = "playing";
        this.player = new Player();
        this.asteroids = [];
        this.score = 0;
        // Add initial asteroids
        for (let i = 0; i < 3; i++) {
            this.asteroids.push(new Asteroid());
        }
    }

    resetGame() {
        this.state = "menu";
        this.menuTimer = 0;
        this.logoPos = -50;
        this.showPressStart = true;
        this.blinkTimer = 0;
    }

    draw() {
        clear();

        switch (this.state) {
            case "menu":
                this.drawMenu();
                break;
            case "playing":
                this.drawGame();
                break;
            case "gameOver":
                this.drawGameOver();
                break;
        }
    }

    drawMenu() {
        // Draw animated logo
        ctx.strokeStyle = "#fff";
        ctx.lineWidth = SCALE;
        drawCircle(this.logoPos, SCREEN_HEIGHT / 2, 22);
        drawText("SPACE", this.logoPos - 20, SCREEN_HEIGHT / 2 - 8);
        drawText("ROCKS", this.logoPos - 20, SCREEN_HEIGHT / 2);

        // Draw "PRESS TO START" if visible and logo is in position
        if (this.showPressStart && this.logoPos >= SCREEN_WIDTH / 2) {
            drawText("PRESS TO START", 8, 50);
        }
    }

    drawGame() {
        // Draw all game objects
        this.player.draw();
        this.asteroids.forEach((asteroid) => asteroid.draw());
        this.hud.draw(this.score, this.player.lives, this.highScore);
    }

    drawGameOver() {
        // Draw final game state
        this.asteroids.forEach((asteroid) => asteroid.draw());
        this.player.draw();
        this.hud.draw(this.score, 0, this.highScore);

        // Draw game over text
        ctx.fillStyle = "#fff";
        ctx.fillRect(32 * SCALE, (SCREEN_HEIGHT / 2 - 4) * SCALE, 64 * SCALE, 8 * SCALE);
        drawText("GAME OVER", 38, SCREEN_HEIGHT / 2 - 4, "#000");
    }
}

// Game loop
const game = new Game();

function gameLoop() {
    game.update();
    game.draw();
    requestAnimationFrame(gameLoop);
}

// Start the game
gameLoop();
