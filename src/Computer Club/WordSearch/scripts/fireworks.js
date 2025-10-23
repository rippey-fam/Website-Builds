const fireworksCanvas = document.getElementById("fireworksCanvas");
const fwCtx = fireworksCanvas.getContext("2d");
let fireworks = [];
let particles = [];

function resizeFireworksCanvas() {
    fireworksCanvas.width = window.innerWidth;
    fireworksCanvas.height = window.innerHeight;
}
window.addEventListener("resize", resizeFireworksCanvas);
resizeFireworksCanvas();

class Firework {
    constructor(x, targetY) {
        this.x = x;
        this.y = window.innerHeight;
        this.targetY = targetY;
        this.hue = Math.random() * 360;
        this.brightness = 50 + Math.random() * 50;
        this.element = { x: this.x, y: this.y }; // For GSAP animation
        this.animate();
    }

    animate() {
        // Animate firework rising using GSAP
        gsap.to(this.element, {
            y: this.targetY,
            duration: 2,
            ease: "power2.out",
            onUpdate: () => {
                this.y = this.element.y;
                this.draw();
            },
            onComplete: () => {
                explode(this.x, this.y, this.hue);
                fireworks = fireworks.filter((f) => f !== this); // Remove firework after explosion
            },
        });
    }

    draw(fwCTX) {
        fwCtx.beginPath();
        fwCtx.arc(this.x, this.y, 3, 0, 2 * Math.PI);
        fwCtx.fillStyle = `hsl(${this.hue}, 100%, ${this.brightness}%)`;
        fwCtx.fill();
    }
}

class FwParticle {
    constructor(x, y, hue) {
        this.x = x;
        this.y = y;
        this.hue = hue;
        this.brightness = 50 + Math.random() * 50;
        this.angle = Math.random() * Math.PI * 2;
        this.speed = 2 + Math.random() * 5;
        this.friction = 0.95;
        this.gravity = 0.5;
        this.opacity = 1;
        this.decay = 0.015 + Math.random() * 0.03;
        this.element = { x: this.x, y: this.y, opacity: this.opacity };
        this.animate();
    }

    animate() {
        // Animate particle using GSAP
        gsap.to(this.element, {
            x: this.x + Math.cos(this.angle) * this.speed * 50,
            y: this.y + Math.sin(this.angle) * this.speed * 50 + this.gravity * 50,
            opacity: 0,
            duration: 1,
            ease: "power1.out",
            onUpdate: () => {
                this.x = this.element.x;
                this.y = this.element.y;
                this.opacity = this.element.opacity;
                this.draw();
            },
            onComplete: () => {
                particles = particles.filter((p) => p !== this); // Remove particle after animation
            },
        });
    }

    draw() {
        fwCtx.save();
        fwCtx.globalAlpha = this.opacity;
        fwCtx.beginPath();
        fwCtx.arc(this.x, this.y, 2, 0, 2 * Math.PI);
        fwCtx.fillStyle = `hsl(${this.hue}, 100%, ${this.brightness}%)`;
        fwCtx.fill();
        fwCtx.restore();
    }
}

function createFirework(x, y) {
    const firework = new Firework(x, y);
    fireworks.push(firework);
}

function explode(x, y, hue) {
    for (let i = 0; i < 50; i++) {
        particles.push(new FwParticle(x, y, hue));
    }
}

function animateFireworks() {
    // Clear canvas with slight fade for trail effect
    fwCtx.fillStyle = "rgba(0, 0, 0, 0.1)";
    fwCtx.fillRect(0, 0, fireworksCanvas.width, fireworksCanvas.height);
    requestAnimationFrame(animateFireworks);
}

// Start automatic fireworks
function startAutoFireworks(interval = 600) {
    setInterval(() => {
        createFirework(Math.random() * fireworksCanvas.width, Math.random() * fireworksCanvas.height * 0.5);
    }, interval);
}

// Initialize
animateFireworks();
startAutoFireworks();
