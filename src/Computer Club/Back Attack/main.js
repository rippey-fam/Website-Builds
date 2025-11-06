import { Player } from "./utils/Player.js";
import Wall from "./utils/Wall.js";
import mapController from "./utils/controllerMapping.js";

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

ctx.textAlign = "left";
ctx.font = "30px Arial";
ctx.fillText("Connect Your Controller", canvas.width / 2 - 200, canvas.height / 2);
let count = 0;
let interval = setInterval(() => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillText(
        "Connect Your Controller" + (count % 4 === 1 ? "." : count % 4 === 2 ? ".." : count % 4 === 3 ? "..." : ""),
        canvas.width / 2 - 200,
        canvas.height / 2,
    );
    ctx.fill();
    count++;
}, 200);

window.addEventListener("gamepadconnected", (e) => {
    players.push(
        new Player(20 + Math.random() * (canvas.width - 20), 20 + Math.random() * (canvas.height - 20), players.length),
    );
});

let players = [];
let bullets = [];
const margin = 10;
const doorHeight = canvas.height / 3;
let wall = new Wall();
// shape like this:
//  ________
// |   _    |
//    |_|
// |________|

// Left segment
wall.addPath(margin, (canvas.height - doorHeight) / 2)
    .V(margin) // up to top
    .H(canvas.width - margin) // across top
    .V((canvas.height - doorHeight) / 2); // down to door

// Right segment
wall.addPath(margin, (canvas.height + doorHeight) / 2)
    .V(canvas.height - margin) // down to bottom
    .H(canvas.width - margin) // across bottom
    .V((canvas.height + doorHeight) / 2); // up to door

// Center square
const squareSize = doorHeight;
const centerX = canvas.width / 2 - squareSize / 2;
const centerY = canvas.height / 2 - squareSize / 2;

wall.addPath(centerX, centerY) // Start at top-left of square
    .h(squareSize) // Top line
    .v(squareSize) // Right line
    .h(-squareSize) // Bottom line
    .v(-squareSize); // Left line back to start

function game() {
    if (players.length !== 0 && interval !== null) {
        clearInterval(interval);
        interval = null;
    }
    if (players.length !== 0) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        for (let i = 0; i < players.length; i++) {
            let gp = navigator.getGamepads()[i];
            let player = players[i];
            let mapping = mapController(gp);
            if (mapping.select) window.location.reload();
            console.log(mapping.a, mapping.x, mapping.b);
            player.input(
                { x: mapping.leftX, y: mapping.leftY },
                { x: mapping.rightX, y: mapping.rightY },
                mapping.a,
                mapping.x,
                mapping.b,
                gp.vibrationActuator,
                bullets,
            );
        }

        players.forEach((player) => player.move());
        bullets.forEach((bullet) => bullet.move());

        players.forEach((player) => {
            bullets = player.act(bullets, wall);
        });
        bullets.forEach((bullet) => {
            if (bullet.act(wall)) {
                bullets = bullets.filter((b) => b !== bullet);
            }
        });

        wall.draw(ctx);
        players.forEach((player) => player.draw(ctx));
        bullets.forEach((bullet) => bullet.draw(ctx));
    }
    requestAnimationFrame(game);
}
game();
