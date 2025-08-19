const canvas = document.getElementById("canvas")
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth - 20
canvas.height = window.innerHeight - 25

class Dot {
    colorsCount = 12
    constructor(x, y) {
        this.points = []
        this.x = x
        this.y = y
        this.velocity = { x: 0, y: 0 }
        this.accelerationSpeed = 0.5
        this.radius = 3
        this.friction = Math.random()*0.02+0.01
        this.color = `hsl(${Math.floor(Math.random() * this.colorsCount) * (360 / this.colorsCount)}, 100%, 50%)`
    }
    act() {
        let dx = mouse.x - this.x;
        let dy = mouse.y - this.y;
        let dist = Math.sqrt(dx * dx + dy * dy);
        if (dist !== 0) {
            dx /= dist;
            dy /= dist;
            this.velocity.x += dx * this.accelerationSpeed;
            this.velocity.y += dy * this.accelerationSpeed;

        }
        this.velocity.x -= this.friction * Math.sign(this.velocity.x)
        this.velocity.y -= this.friction * Math.sign(this.velocity.y)
    }
    move() {
        this.x += this.velocity.x
        this.y += this.velocity.y
        // Keep the dot inside the canvas bounds and stop velocity if it hits the edge
        if (this.x > canvas.width - this.radius) {
            this.x = canvas.width - this.radius;
            this.velocity.x = 0;
        }
        if (this.x < this.radius) {
            this.x = this.radius;
            this.velocity.x = 0;
        }
        if (this.y > canvas.height - this.radius) {
            this.y = canvas.height - this.radius;
            this.velocity.y = 0;
        }
        if (this.y < this.radius) {
            this.y = this.radius;
            this.velocity.y = 0;
        }
        this.points.push({x: this.x, y: this.y})
        if(this.points.length > 50){
            this.points.shift()
        }
    }
    draw() {
        ctx.beginPath()
        ctx.strokeStyle = this.color;
        ctx.moveTo(this.points[0].x, this.points[0].y)
        this.points.forEach((val, i)=>{
            ctx.lineWidth = i/this.points.length*this.radius
            ctx.lineTo(val.x, val.y)
        })
        ctx.stroke()
        ctx.beginPath();
        ctx.fillStyle = this.color;
        this.strokeStyle = "black"
        ctx.lineWidth = 2
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.stroke()
        ctx.fill();
    }
}


function move() {
    dots.forEach((val) => {
        val.move()
    })
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    dots.forEach((val) => {
        val.draw()
    })
}

function act() {
    dots.forEach((val) => {
        val.act()
    })
}


function game() {
    act()
    move()
    draw()
    requestAnimationFrame(game)
}

dots = [new Dot(100, 100)]
document.addEventListener("DOMContentLoaded", () => {
    game()
})

let mouse = { x: 0, y: 0 }
document.addEventListener("mousemove", (e) => {
    mouse.x = e.offsetX;
    mouse.y = e.offsetY;
    console.log(mouse)
});

document.addEventListener("click", (e)=>{
    dots.push(new Dot(e.offsetX, e.offsetY))
})

document.addEventListener("dblclick", (e)=>{
    for (let i = 0; i < 5; i++) {
        dots.push(new Dot(e.offsetX+(Math.random()-0.5)*50, e.offsetY+(Math.random()-0.5)*50))
    }
})