import { Bullet } from "./Bullet.js";

function deadzone(joy, min) {
    if (Math.hypot(joy.x, joy.y) < min) {
        return { x: 0, y: 0 };
    }
    return joy;
}

export class Player {
    colors = ["red", "blue", "green", "yellow", "purple", "orange", "pink", "grey"];
    constructor(x, y, playerNumber) {
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
        this.speed = 0.03;
        this.playerNumber = playerNumber;
        this.color = this.colors[playerNumber];
        this.a = false;
        this.bullets = [];
        this.pushBackForce = 0.5;
        this.friction = 0.015;
    }
    input(leftJoy, rightJoy, a, x, vibration, bullets) {
        leftJoy = deadzone(leftJoy, 0.9);
        if (leftJoy.x !== 0 && leftJoy.y !== 0) {
            this.angle = Math.atan2(leftJoy.y, leftJoy.x);
        }
        rightJoy = deadzone(rightJoy, 0.2);

        let scalarX = 1;
        let scalarY = 1;
        if (Math.sign(this.velocity.x) * -1 === Math.sign(rightJoy.x) && this.velocity.x !== 0) scalarX = 2;
        if (Math.sign(this.velocity.y) * -1 === Math.sign(rightJoy.y) && this.velocity.y !== 0) scalarY = 2;
        this.velocity.x += rightJoy.x * this.speed * scalarX;
        this.velocity.y += rightJoy.y * this.speed * scalarY;

        if (!a && this.a) {
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
                    force: 1.5,
                    parent: this,
                }),
            );
            this.velocity.x -= Math.cos(this.angle) * this.pushBackForce;
            this.velocity.y -= Math.sin(this.angle) * this.pushBackForce;
            vibration.playEffect("dual-rumble", {
                startDelay: 0,
                duration: 100,
                weakMagnitude: 1.0,
                strongMagnitude: 1.0,
            });
        }
        this.a = a;
    }
    move() {
        this.x += this.velocity.x;
        this.y += this.velocity.y;
        this.bullets.forEach((bullet) => bullet.move());
        // friction
        this.velocity.x *= 1 - this.friction;
        this.velocity.y *= 1 - this.friction;
    }
    act(allBullets) {
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

        let dx = this.x + this.radius * cos + (this.w / 2) * cosMinus;
        let dy = this.y + this.radius * sin + (this.w / 2) * sinMinus;

        ctx.strokeStyle = this.color;
        ctx.lineWidth = 6;

        ctx.fillStyle = "black";
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

        this.bullets.forEach((bullet) => bullet.draw(ctx));
    }
}
