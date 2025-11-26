import { COM } from "./utils/COM.js";
import { Player } from "./utils/Player.js";
import Wall from "./utils/Wall.js";
import mapController from "./utils/controllerMapping.js";
import { Queue, drawText } from "../../animationLib.js";
import { Selector } from "./utils/Selector.js";

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

ctx.fillText("Connect Your Controller", canvas.width / 2 - 200, canvas.height / 2);
let count = 0;
ctx.textAlign = "left";
ctx.font = "30px Arial";
let interval = setInterval(() => {
    ctx.textAlign = "left";
    ctx.font = "30px Arial";
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillText(
        "Connect Your Controller" + (count % 4 === 1 ? "." : count % 4 === 2 ? ".." : count % 4 === 3 ? "..." : ""),
        canvas.width / 2 - 200,
        canvas.height / 2,
    );
    ctx.fill();
    count++;
}, 200);

function onGamepadConnected(e) {
    if (gameState === "beginning") {
        let position = positions.pop();
        players.push(new Player(position.x, position.y, players.length));
        indexes.push(e.gamepad.index);
        if (players.length === playerCount) window.removeEventListener("gamepadconnected", onGamepadConnected);
    } else window.removeEventListener("gamepadconnected", onGamepadConnected);
    console.log(e.gamepad);
}
window.addEventListener("gamepadconnected", onGamepadConnected);

window.addEventListener("gamepaddisconnected", (e) => {
    indexes.indexOf(e.gamepad.index);
    let newPlayers = [];
    for (let i = 0; i < players.length; i++) {
        if (indexes[i] !== e.gamepad.index) {
            newPlayers.push(players[i]);
        }
    }
    players = [...newPlayers];
});

document.addEventListener(
    "keypress",
    (e) => {
        if (e.key === " ") {
            let position = positions.pop();
            players.push(new COM(position.x, position.y));
        }
    },
    { once: true },
);

document.addEventListener("click", (e) => {
    let canvasBounds = canvas.getBoundingClientRect();
    players.push(new COM(e.x - canvasBounds.x, e.y - canvasBounds.y));
});

let players = [];
let countdown = [];
let bullets = [];
let indexes = [];
let menuSelector = new Selector(
    canvas.width / 2,
    75,
    [
        ["Golden Gun", "No R", "Fatso"],
        ["Level 1", "Level 2", "Level 3", "Level 4"],
    ],
    ctx,
);
const startOffset = 100;
let positions = [
    { x: startOffset + 0.1, y: startOffset },
    { x: startOffset, y: startOffset + (canvas.height - 2 * startOffset) / 3 },
    { x: startOffset, y: startOffset + (2 * (canvas.height - 2 * startOffset)) / 3 },
    { x: startOffset, y: canvas.height - startOffset },
    { x: canvas.width - startOffset, y: startOffset },
    { x: canvas.width - startOffset, y: startOffset + (canvas.height - 2 * startOffset) / 3 },
    { x: canvas.width - startOffset, y: startOffset + (2 * (canvas.height - 2 * startOffset)) / 3 },
    { x: canvas.width - startOffset - 0.1, y: canvas.height - startOffset },
].sort(() => Math.random() - 0.5);
/**
 * @type {"starting"|"playing"|"paused"|"cutscene"|"beginning"}
 */
let gameState = "beginning";
let place = 0;
const margin = 10;
let playerCount = 8;
playerCount = playerCount > positions.length ? positions.length : playerCount;

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
        gameState = "starting";
        function goAndStart(delay) {
            setTimeout(() => (gameState = "playing"), delay);
            drawText({
                time: 1000,
                text: "GO!",
                textStyle: { size: 100, font: "Arial" },
                color: { r: 255, g: 0, b: 0 },
                p: { x: canvas.width / 2, y: canvas.height / 2 },
                equation: "easeIn",
                instances: countdown,
            })(delay);
        }
        queue
            .next(
                drawText({
                    time: 1000,
                    text: "3",
                    textStyle: { size: 100, font: "Arial" },
                    color: { r: 255, g: 0, b: 0 },
                    p: { x: canvas.width / 2, y: canvas.height / 2 },
                    equation: "easeIn",
                    instances: countdown,
                }),
            )
            .next(
                drawText({
                    time: 1000,
                    text: "2",
                    textStyle: { size: 100, font: "Arial" },
                    color: { r: 255, g: 0, b: 0 },
                    p: { x: canvas.width / 2, y: canvas.height / 2 },
                    equation: "easeIn",
                    instances: countdown,
                }),
            )
            .next(
                drawText({
                    time: 1000,
                    text: "1",
                    textStyle: { size: 100, font: "Arial" },
                    color: { r: 255, g: 0, b: 0 },
                    p: { x: canvas.width / 2, y: canvas.height / 2 },
                    equation: "easeIn",
                    instances: countdown,
                }),
            )
            .next(goAndStart);

        let currentPlayerLen = players.length;
        for (let i = 0; i < playerCount - currentPlayerLen; i++) {
            let position = positions.pop();
            players.push(new COM(position.x, position.y));
        }
    }
    if (players.length !== 0) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        let skipped = 0;
        for (let i = 0; i < players.length; i++) {
            let player = players[i];
            if (gameState !== "cutscene") {
                if (!(player instanceof COM)) {
                    let gp = navigator.getGamepads()[indexes[i] - skipped];
                    let mapping = mapController(gp);
                    if (gameState !== "paused") {
                        player.input(
                            { x: mapping.leftX, y: mapping.leftY },
                            gameState === "starting" ? { x: 0, y: 0 } : { x: mapping.rightX, y: mapping.rightY },
                            gameState === "starting" ? 0 : mapping.a,
                            gameState === "starting" ? 0 : mapping.x,
                            gameState === "starting" ? 0 : mapping.b,
                            gp.vibrationActuator,
                            bullets,
                        );
                        if (mapping.start && gameState !== "starting") gameState = "paused";
                    } else if (gameState === "paused") {
                        let [letter, number] = menuSelector.input(
                            { x: mapping.right - mapping.left, y: mapping.up - mapping.down },
                            mapping.a,
                        ) || [null, null];
                        if (letter !== null) {
                            console.log(`Selection was made: ${letter}, ${number}`);
                            window.location.reload();
                            gameState = "playing";
                        }
                        if (mapping.select) gameState = "playing";
                    }
                } else {
                    if (!(gameState === "starting" || gameState === "paused")) {
                        player.input({ players, wall, bullets, ctx });
                    }
                    skipped++;
                }
            }
        }

        if (gameState !== "paused") {
            players.forEach((player) => {
                console.log(player.isDead);
                if (!player.isDead) {
                    player.move();
                }
            });
            bullets.forEach((bullet) => bullet.move());
        }

        players.forEach((player) => {
            bullets = player.act(bullets, wall);
            if (player.isDead && player.place === 0) {
                if (place === 0) {
                    player.place = players.length;
                    place = players.length - 1;
                } else {
                    player.place = place--;
                }
            }
            if (!player.isDead && place === 1) {
                player.place = 1;
            }
        });
        bullets.forEach((bullet) => {
            if (bullet.act(wall)) {
                bullets = bullets.filter((b) => b !== bullet);
            }
        });

        wall.draw(ctx);
        players.forEach((player) => player.draw(ctx));
        bullets.forEach((bullet) => bullet.draw(ctx));
        countdown.forEach((text) => text.draw(ctx));
        if (gameState === "paused") menuSelector.draw(ctx);
    }
    requestAnimationFrame(game);
}
let queue = new Queue();
game();
