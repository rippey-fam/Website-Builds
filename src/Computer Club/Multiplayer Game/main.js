import { Player } from "./utils/Player.js";
import mapController from "./utils/controllerMapping.js";

/**
 * @type {HTMLCanvasElement}
 */
const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");
canvas.height = window.innerHeight * 0.95;
canvas.width = window.innerWidth * 0.98;

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
        new Player(10 + Math.random() * (canvas.width - 10), 10 + Math.random() * (canvas.height - 10), players.length),
    );
});

let players = [];
let bullets = [];
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
            player.input(
                { x: mapping.leftX, y: mapping.leftY },
                { x: mapping.rightX, y: mapping.rightY },
                mapping.a,
                mapping.x,
                gp.vibrationActuator,
                bullets,
            );
        }

        players.forEach((player) => player.move());
        bullets.forEach((bullet) => bullet.move());

        players.forEach((player) => {
            bullets = player.act(bullets);
        });
        bullets.forEach((bullet) => bullet.act);

        players.forEach((player) => player.draw(ctx));
        bullets.forEach((bullet) => bullet.draw(ctx));
    }
    requestAnimationFrame(game);
}
game();
