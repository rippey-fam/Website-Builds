export class FireworksDisplay {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext("2d");
        this.fireworks = [];
        this.particles = [];
        this.animationId = null;

        // Bind methods
        this.resizeCanvas = this.resizeCanvas.bind(this);
        this.animate = this.animate.bind(this);

        // Set up event listeners
        window.addEventListener("resize", this.resizeCanvas);
        this.resizeCanvas();
        this.animate();
    }

    resizeCanvas() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    animate() {
        this.animationId = requestAnimationFrame(this.animate);
        this.ctx.fillStyle = "rgba(0, 0, 0, 0.2)";
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // Update and draw fireworks
        for (let i = this.fireworks.length - 1; i >= 0; i--) {
            this.fireworks[i].update();
            this.fireworks[i].draw();
        }

        // Update and draw particles
        for (let i = this.particles.length - 1; i >= 0; i--) {
            this.particles[i].update();
            this.particles[i].draw();
        }
    }

    createFirework(x, targetY) {
        const firework = new Firework(x, targetY, this.ctx, this);
        this.fireworks.push(firework);
        return firework;
    }

    removeFirework(firework) {
        this.fireworks = this.fireworks.filter((f) => f !== firework);
    }

    removeParticle(particle) {
        this.particles = this.particles.filter((p) => p !== particle);
    }

    explode(x, y, hue) {
        const particleCount = 50;
        for (let i = 0; i < particleCount; i++) {
            const particle = new FwParticle(x, y, hue, this.ctx, this);
            this.particles.push(particle);
        }
    }

    destroy() {
        window.removeEventListener("resize", this.resizeCanvas);
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }
        this.fireworks = [];
        this.particles = [];
    }
}

class Firework {
    constructor(x, targetY, ctx, display) {
        this.x = x;
        this.y = window.innerHeight;
        this.startY = this.y;
        this.targetY = targetY;
        this.ctx = ctx;
        this.display = display;
        this.hue = Math.random() * 360;
        this.brightness = 50 + Math.random() * 50;
        this.speed = (this.startY - this.targetY) / 50; // Adjust for speed
        this.progress = 0;
    }

    update() {
        this.progress += 0.02;
        this.y = this.startY - (this.startY - this.targetY) * this.progress;

        if (this.progress >= 1) {
            this.display.explode(this.x, this.y, this.hue);
            this.display.removeFirework(this);
        }
    }

    draw() {
        this.ctx.beginPath();
        this.ctx.arc(this.x, this.y, 3, 0, Math.PI * 2);
        this.ctx.fillStyle = `hsl(${this.hue}, 100%, ${this.brightness}%)`;
        this.ctx.fill();
    }
}

class FwParticle {
    constructor(x, y, hue, ctx, display) {
        this.x = x;
        this.y = y;
        this.ctx = ctx;
        this.display = display;
        this.hue = hue;
        this.brightness = 50 + Math.random() * 50;
        this.angle = Math.random() * Math.PI * 2;
        this.velocity = {
            x: Math.cos(this.angle) * (Math.random() * 8),
            y: Math.sin(this.angle) * (Math.random() * 8),
        };
        this.gravity = 0.2;
        this.opacity = 1;
        this.friction = 0.98;
    }

    update() {
        this.velocity.x *= this.friction;
        this.velocity.y *= this.friction;
        this.velocity.y += this.gravity;
        this.x += this.velocity.x;
        this.y += this.velocity.y;
        this.opacity -= 0.02;

        if (this.opacity <= 0) {
            this.display.removeParticle(this);
        }
    }

    draw() {
        this.ctx.save();
        this.ctx.globalAlpha = this.opacity;
        this.ctx.beginPath();
        this.ctx.arc(this.x, this.y, 2, 0, Math.PI * 2);
        this.ctx.fillStyle = `hsl(${this.hue}, 100%, ${this.brightness}%)`;
        this.ctx.fill();
        this.ctx.restore();
    }
}
