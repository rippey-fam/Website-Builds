import { Bullet } from "./Bullet.js";
import { COM } from "./COM.js";

function easeOutCubic(x) {
    return 1 - Math.pow(1 - x, 3);
}

function easeInCubic(x) {
    return x * x * x;
}

let point = (x, y) => {
    return { x, y };
};

function deadzone(joy, min) {
    if (Math.hypot(joy.x, joy.y) < min) {
        return { x: 0, y: 0 };
    }
    return joy;
}

function clampMagnitude({ x, y }, max, min) {
    let dist = Math.hypot(x, y);
    if (Math.abs(dist) < max) return deadzone({ x, y }, min);
    let y1 = (max * y) / dist;
    let x1 = Math.sqrt(max ** 2 - y1 ** 2) * Math.sign(x);
    return point(x1, y1);
}

function clamp(x, min, max) {
    return Math.min(Math.max(x, min), max);
}

export class Player {
    colors = [
        "hsl(0, 100%, 34%)", // Red
        "hsl(210, 90%, 40%)", // Blue
        "hsl(140, 70%, 35%)", // Green
        "hsl(25, 95%, 50%)", // Orange
        "hsl(180, 70%, 30%)", // Deep Teal
        "hsl(300, 70%, 40%)", // Vibrant Magenta
        "hsl(45, 90%, 45%)", // Gold/Mustard
        "hsl(280, 50%, 30%)", // Deep Violet
    ];
    gold = "hsl(50, 97%, 43%)";
    constructor(x, y, playerNumber, options = {}) {
        this.x = x;
        this.y = y;
        this.radius = 15;
        this.w = 10;
        this.h = 8;
        this.angle = 0;
        this.velocity = {
            x: 0,
            y: 0,
        };
        this.speed = 0.1;
        this.playerNumber = playerNumber;
        this.color = this.colors[playerNumber];
        this.aButton = false;
        this.bButton = false;
        this.xButton = false;
        this.bullets = [];
        this.pushBackForce = options.pushBackForce === undefined ? true : options.pushBackForce;
        this.place = 0;
        this.friction = 0.015;
        this.isDead = false;
        this.drawNozzle = options.drawNozzle === undefined ? true : options.drawNozzle;
        this.goldenGun = options.goldenGun === undefined ? false : options.goldenGun;
        console.log(options.drawNozzle);
        this.goldenGunCharge = 1000;
        this.goldenGunCurrentHold = 0;
        this.goldenGunLastTime = null;
    }
    input(leftJoy, rightJoy, aButton, xButton, bButton, vibration, bullets) {
        leftJoy = deadzone(leftJoy, 0.9);
        if (leftJoy.x !== 0 && leftJoy.y !== 0) {
            this.angle = Math.atan2(leftJoy.y, leftJoy.x);
        }

        rightJoy = clampMagnitude(rightJoy, 1, 0.1);

        let scalarX = 1;
        let scalarY = 1;
        if (Math.sign(this.velocity.x) * -1 === Math.sign(rightJoy.x) && this.velocity.x !== 0) scalarX = 2;
        if (Math.sign(this.velocity.y) * -1 === Math.sign(rightJoy.y) && this.velocity.y !== 0) scalarY = 2;
        this.velocity.x += rightJoy.x * this.speed * scalarX;
        this.velocity.y += rightJoy.y * this.speed * scalarY;

        if (!aButton && this.aButton) {
            bullets.push(
                new Bullet({
                    x: this.x + Math.cos(this.angle) * (this.radius + this.h + 10),
                    y: this.y + Math.sin(this.angle) * (this.radius + this.h + 10),
                    angle: this.angle,
                    speed: 10,
                    w: 5,
                    h: 10,
                    round: true,
                    color: this.color,
                    force: 3,
                    parent: this,
                    width: canvas.width,
                    height: canvas.height,
                }),
            );
            this.velocity.x -= Math.cos(this.angle) * this.pushBackForce;
            this.velocity.y -= Math.sin(this.angle) * this.pushBackForce;
            vibration?.playEffect("dual-rumble", {
                startDelay: 0,
                duration: 100,
                weakMagnitude: 1.0,
                strongMagnitude: 1.0,
            });
        }
        if (this.goldenGun) {
            if (xButton) {
                if (!this.goldenGunLastTime) {
                    this.goldenGunLastTime = Date.now();
                } else {
                    let now = Date.now();
                    this.goldenGunCurrentHold += now - this.goldenGunLastTime;
                    this.goldenGunLastTime = now;
                }
            }
        }
        if (!xButton && this.xButton) {
            if (this.goldenGun) {
                if (this.goldenGunCurrentHold > this.goldenGunCharge) {
                    bullets.push(
                        new Bullet({
                            x: this.x + Math.cos(this.angle) * (this.radius + this.h + 10),
                            y: this.y + Math.sin(this.angle) * (this.radius + this.h + 10),
                            angle: this.angle,
                            speed: 15,
                            w: 7,
                            h: 15,
                            round: true,
                            color: this.gold,
                            force: 50,
                            parent: this,
                            width: canvas.width,
                            height: canvas.height,
                        }),
                    );
                    this.velocity.x -= Math.cos(this.angle) * this.pushBackForce * 7;
                    this.velocity.y -= Math.sin(this.angle) * this.pushBackForce * 7;
                    vibration?.playEffect("dual-rumble", {
                        startDelay: 0,
                        duration: 200,
                        weakMagnitude: 1.0,
                        strongMagnitude: 1.0,
                    });
                }
                this.goldenGunLastTime = null;
                this.goldenGunCurrentHold = 0;
            } else {
                bullets.push(
                    new Bullet({
                        x: this.x + Math.cos(this.angle) * (this.radius + this.h + 10),
                        y: this.y + Math.sin(this.angle) * (this.radius + this.h + 10),
                        angle: this.angle,
                        speed: 7,
                        w: 7,
                        h: 15,
                        round: true,
                        color: this.color,
                        force: 10,
                        parent: this,
                        width: canvas.width,
                        height: canvas.height,
                    }),
                );
                this.velocity.x -= Math.cos(this.angle) * this.pushBackForce * 3;
                this.velocity.y -= Math.sin(this.angle) * this.pushBackForce * 3;
                vibration?.playEffect("dual-rumble", {
                    startDelay: 0,
                    duration: 200,
                    weakMagnitude: 1.0,
                    strongMagnitude: 1.0,
                });
            }
        }
        if (!bButton && this.bButton) {
            bullets.push(
                new Bullet({
                    x: this.x + Math.cos(this.angle) * (this.radius + this.h + 10),
                    y: this.y + Math.sin(this.angle) * (this.radius + this.h + 10),
                    angle: this.angle,
                    speed: 20,
                    w: 3,
                    h: 7,
                    round: true,
                    color: this.color,
                    force: 1.5,
                    parent: this,
                    width: canvas.width,
                    height: canvas.height,
                }),
            );

            this.velocity.x -= Math.cos(this.angle) * this.pushBackForce * 0.5;
            this.velocity.y -= Math.sin(this.angle) * this.pushBackForce * 0.5;
            vibration?.playEffect("dual-rumble", {
                startDelay: 0,
                duration: 50,
                weakMagnitude: 1.0,
                strongMagnitude: 1.0,
            });
        }
        this.xButton = xButton;
        this.bButton = bButton;
        this.aButton = aButton;
    }
    move() {
        this.x += this.velocity.x;
        this.y += this.velocity.y;
        // friction
        this.velocity.x *= 1 - this.friction;
        this.velocity.y *= 1 - this.friction;
    }
    act(allBullets, wall) {
        if (this.x < -this.radius) {
            this.x = canvas.width + this.radius;
        }
        if (this.x > canvas.width + this.radius) {
            this.x = -this.radius;
        }
        if (this.y < -this.radius) {
            this.y = canvas.height + this.radius;
        }
        if (this.y > canvas.height + this.radius) {
            this.y = -this.radius;
        }

        if (wall.check(this.x, this.y, this.radius)) this.isDead = true;

        allBullets.forEach((bullet) => {
            let dx = this.x - bullet.x;
            let dy = this.y - bullet.y;
            if (Math.hypot(dx, dy) < this.radius) {
                this.velocity.x += Math.cos(bullet.angle) * bullet.force;
                this.velocity.y += Math.sin(bullet.angle) * bullet.force;
                allBullets = allBullets.filter((b) => b !== bullet);
            }
        });
        return allBullets;
    }
    /**
     *
     * @param {CanvasRenderingContext2D} ctx
     */
    draw(ctx) {
        if (this.drawNozzle) {
            let cos = Math.cos(this.angle);
            let sin = Math.sin(this.angle);
            let cosPlus = Math.cos(this.angle + Math.PI / 2);
            let sinPlus = Math.sin(this.angle + Math.PI / 2);
            let cosMinus = Math.cos(this.angle - Math.PI / 2);
            let sinMinus = Math.sin(this.angle - Math.PI / 2);

            let ax = this.x + (this.radius + this.h) * cos + (this.w / 2) * cosPlus;
            let ay = this.y + (this.radius + this.h) * sin + (this.w / 2) * sinPlus;

            let bx = this.x + this.radius * cos + (this.w / 2) * cosPlus;
            let by = this.y + this.radius * sin + (this.w / 2) * sinPlus;

            let cx = this.x + (this.radius + this.h) * cos + (this.w / 2) * cosMinus;
            let cy = this.y + (this.radius + this.h) * sin + (this.w / 2) * sinMinus;

            ctx.strokeStyle = this.color;
            ctx.lineWidth = 10;

            ctx.fillStyle = "white";
            ctx.lineCap = "round";
            ctx.beginPath();
            ctx.moveTo(ax, ay);
            ctx.lineTo(bx, by);
            ctx.arc(
                this.x,
                this.y,
                this.radius,
                this.angle + Math.asin(this.w / 2 / this.radius),
                this.angle - Math.asin(this.w / 2 / this.radius),
                true,
            );
            ctx.lineTo(cx, cy);
            ctx.closePath();

            ctx.moveTo(this.x + this.radius, this.y);
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);

            ctx.stroke();
            ctx.fill();

            if (this.goldenGun) {
                ctx.fillStyle =
                    this.gold.slice(0, 3) +
                    "a(" +
                    this.gold.slice(4, -1) +
                    `, ${clamp(easeInCubic(this.goldenGunCurrentHold / this.goldenGunCharge), 0, 1)})`;
            } else {
                ctx.fillStyle = this.color.slice(0, 3) + "a(" + this.color.slice(4, -1) + ", 0.3)";
            }
            ctx.lineCap = "round";
            ctx.beginPath();
            ctx.moveTo(ax, ay);
            ctx.lineTo(bx, by);
            ctx.arc(
                this.x,
                this.y,
                this.radius,
                this.angle + Math.asin(this.w / 2 / this.radius),
                this.angle - Math.asin(this.w / 2 / this.radius),
                true,
            );
            ctx.lineTo(cx, cy);
            ctx.closePath();

            ctx.moveTo(this.x + this.radius, this.y);
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);

            ctx.fill();
        } else {
            ctx.strokeStyle = this.color;
            ctx.lineWidth = 10;

            ctx.fillStyle = "white";
            ctx.lineCap = "round";
            ctx.beginPath();
            ctx.moveTo(this.x + this.radius, this.y);
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);

            ctx.stroke();
            ctx.fill();
            ctx.closePath();
            ctx.beginPath();
            ctx.fillStyle = this.color.slice(0, 3) + "a(" + this.color.slice(4, -1) + ", 0.3)";
            ctx.lineCap = "round";

            ctx.moveTo(this.x + this.radius, this.y);
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            ctx.closePath();
            ctx.fill();
        }
        if (this.place !== 0) {
            ctx.beginPath();
            ctx.font = "30px Himagsikan";
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.fillStyle = this.color;
            let suffix = "";
            if (10 <= this.place && this.place <= 20) {
                suffix = "th";
            } else {
                let lastDigit = this.place - Math.floor(this.place / 10) * 10;
                if (lastDigit === 1) {
                    suffix = "st";
                } else if (lastDigit === 2) {
                    suffix = "nd";
                } else if (lastDigit === 3) {
                    suffix = "rd";
                } else {
                    suffix = "th";
                }
            }
            let r = this.y < 75 ? 1 : -1;
            let length = ctx.measureText(this.place + suffix).width;
            ctx.strokeStyle = "white";
            ctx.lineWidth = 7;
            ctx.strokeText(
                this.place + suffix,
                clamp(this.x, length / 2 + 5, ctx.canvas.width - length / 2 - 5),
                this.y + r * (this.radius + 32),
            );
            ctx.fillText(
                this.place + suffix,
                clamp(this.x, length / 2 + 5, ctx.canvas.width - length / 2 - 5),
                this.y + r * (this.radius + 32),
            );
            ctx.fill();
            ctx.stroke();
        }
    }
}
