const canvas = document.getElementById("canvas")
const ctx = canvas.getContext("2d");

class Dot {
    constructor(x, y) {
        this.x = x
        this.y = y
        this.speed = Math.random() * 10 + 10
        this.velocity = [Math.random(), Math.random()]
    }
    move() {
        this.x += this.velocity[0] * this.speed
        this.x %= canvas.width
        this.y += this.velocity[1] * this.speed
        this.y %= canvas.height
    }
    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, 5, 0, Math.PI * 2);
        ctx.fillStyle = "black";
        ctx.fill();
        ctx.stroke();
    }
}


function move() {
    dots.forEach((val)=>{
        val.move()
    })
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    dots.forEach((val)=>{
        val.draw()
    })
}

function game() {
    move()
    draw()
    requestAnimationFrame(game)
}

let dots = [new Dot(10, 10)]
document.addEventListener("DOMContentLoaded", () => {
    game()
})
document.addEventListener("mousedown", (e)=>{
    dots.push(new Dot(e.x-canvas.x, e.y-canvas.y))
})