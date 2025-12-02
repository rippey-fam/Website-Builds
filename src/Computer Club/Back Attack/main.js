import { COM } from "./utils/COM.js";
import { Player } from "./utils/Player.js";
import Wall from "./utils/Wall.js";
import mapController from "./utils/controllerMapping.js";
import { Queue, drawText } from "../../animationLib.js";
import { Selector } from "./utils/Selector.js";
import spacing from "./utils/spacing.js";

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
    let disconnectedIndex = indexes.indexOf(e.gamepad.index);
    indexes.splice(disconnectedIndex, 1);
    players.splice(disconnectedIndex, 1);
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

const params = new URLSearchParams(window.location.search);
const level = params.get("level") || 1;
const powerup = params.get("powerup") || "Plain Level";
console.log(`Level selected: ${level}, Powerup selected: ${powerup}`);

let players = [];
let countdown = [];
let bullets = [];
let indexes = [];
let menuSelector = new Selector(
    canvas.width / 2,
    120,
    [
        ["Golden Gun", "No R Stick", "Pushforward", "Sneaky-Aim", "Man-vs-Man", "Plain Level"],
        ["Level 1", "Level 2", "Level 3", "Level 4", "Level 5", "Level 6", "Level 7", "Level 8", "Level 9"],
    ],
    ctx,
);

const [playerSpacing, wallSpacing] = spacing(10, 90, canvas.width, canvas.height);

const startOffset = 100;
let positions = [
    { x: startOffset, y: startOffset },
    { x: startOffset, y: startOffset + (canvas.height - 2 * startOffset) / 3 },
    { x: startOffset, y: startOffset + (2 * (canvas.height - 2 * startOffset)) / 3 },
    { x: startOffset, y: canvas.height - startOffset },
    { x: canvas.width - startOffset, y: startOffset },
    { x: canvas.width - startOffset, y: startOffset + (canvas.height - 2 * startOffset) / 3 },
    { x: canvas.width - startOffset, y: startOffset + (2 * (canvas.height - 2 * startOffset)) / 3 },
    { x: canvas.width - startOffset, y: canvas.height - startOffset },
].sort(() => Math.random() - 0.5);

/**
 * @type {"starting"|"playing"|"paused"|"cutscene"|"beginning"}
 */
let gameState = "beginning";
let place = 0;
let pausedPlayerID = null;
let playerCount = 8;
playerCount = playerCount > positions.length ? positions.length : playerCount;

const margin = 10;
const doorHeight = canvas.height / 3;
let wall = new Wall();
// shape like this:
//  ________
// |   _    |
//    |_|
// |________|

// Left segment
// wall.addPath(wallSpacing.side.left, wallSpacing.box.top)
//     .V(wallSpacing.side.top)
//     .H(wallSpacing.side.right)
//     .V(wallSpacing.box.top);

// wall.addPath(wallSpacing.side.left, wallSpacing.box.bottom)
//     .V(wallSpacing.side.bottom)
//     .H(wallSpacing.side.right)
//     .V(wallSpacing.box.bottom);

// wall.addPath(wallSpacing.box.left, wallSpacing.box.top)
//     .h(wallSpacing.box.right - wallSpacing.box.left)
//     .v(wallSpacing.box.bottom - wallSpacing.box.top)
//     .h(-(wallSpacing.box.right - wallSpacing.box.left))
//     .v(-(wallSpacing.box.bottom - wallSpacing.box.top));
switch (level[level.length - 1]) {
    case "1":
        wall.addPath(wallSpacing.side.left, wallSpacing.box.top)
            .V(wallSpacing.side.top)
            .H(wallSpacing.side.right)
            .V(wallSpacing.box.top);

        wall.addPath(wallSpacing.side.left, wallSpacing.box.bottom)
            .V(wallSpacing.side.bottom)
            .H(wallSpacing.side.right)
            .V(wallSpacing.box.bottom);

        wall.addPath(wallSpacing.box.left, wallSpacing.box.top)
            .h(wallSpacing.box.right - wallSpacing.box.left)
            .v(wallSpacing.box.bottom - wallSpacing.box.top)
            .h(-(wallSpacing.box.right - wallSpacing.box.left))
            .v(-(wallSpacing.box.bottom - wallSpacing.box.top));
        break;

    case "2":
        wall.addPath(wallSpacing.side.left, wallSpacing.side.top)
            .H(wallSpacing.side.right)
            .V(wallSpacing.side.bottom)
            .H(wallSpacing.side.left)
            .V(wallSpacing.side.top);
        break;

    case "3":
        wall.addPath(wallSpacing.center, wallSpacing.box.top).V(wallSpacing.middle).H(wallSpacing.box.right);

        wall.addPath(wallSpacing.center, wallSpacing.middle).V(wallSpacing.box.bottom);

        wall.addPath(wallSpacing.center, wallSpacing.middle).H(wallSpacing.box.left);
        break;

    case "4":
        wall.addPath(wallSpacing.side.left, wallSpacing.side.top)
            .H(wallSpacing.side.right)
            .V(wallSpacing.side.bottom)
            .H(wallSpacing.side.left)
            .V(wallSpacing.side.top);

        wall.addPath(wallSpacing.center, wallSpacing.side.top).V(wallSpacing.box.top);

        wall.addPath(wallSpacing.center, wallSpacing.box.bottom).V(wallSpacing.side.bottom);

        wall.addPath(wallSpacing.side.left, wallSpacing.middle).H(wallSpacing.box.left);

        wall.addPath(wallSpacing.box.right, wallSpacing.middle).H(wallSpacing.side.right);
        break;

    case "5":
        wall.addPath(wallSpacing.side.left, wallSpacing.side.top)
            .H(wallSpacing.side.right)
            .V(wallSpacing.side.bottom)
            .H(wallSpacing.side.left)
            .V(wallSpacing.side.top);

        wall.addPath(wallSpacing.side.left, wallSpacing.box.top).H(wallSpacing.box.left);

        wall.addPath(wallSpacing.box.right, wallSpacing.box.top).H(wallSpacing.side.right);

        wall.addPath(wallSpacing.side.left, wallSpacing.box.bottom).H(wallSpacing.box.left);

        wall.addPath(wallSpacing.box.right, wallSpacing.box.bottom).H(wallSpacing.side.right);
        break;

    case "7":
        wall.addPath(wallSpacing.side.left, wallSpacing.side.top)
            .H(wallSpacing.side.right)
            .V(wallSpacing.side.bottom)
            .H(wallSpacing.side.left)
            .V(wallSpacing.side.top);
        break;

    case "8":
        wall.addPath(wallSpacing.side.left, wallSpacing.side.top)
            .H(wallSpacing.side.right)
            .V(wallSpacing.side.bottom)
            .H(wallSpacing.side.left)
            .V(wallSpacing.side.top);

        wall.addPath(wallSpacing.box.left, wallSpacing.side.top).V(wallSpacing.box.top);

        wall.addPath(wallSpacing.box.left, wallSpacing.box.bottom).V(wallSpacing.side.bottom);

        wall.addPath(wallSpacing.box.right, wallSpacing.side.top).V(wallSpacing.box.top);

        wall.addPath(wallSpacing.box.right, wallSpacing.box.bottom).V(wallSpacing.side.bottom);
        break;

    case "9":
        wall.addPath(wallSpacing.side.left, wallSpacing.side.top)
            .H(wallSpacing.side.right)
            .V(wallSpacing.side.bottom)
            .H(wallSpacing.side.left)
            .V(wallSpacing.side.top);

        wall.addPath(wallSpacing.side.left, wallSpacing.box.top).H(wallSpacing.box.left);

        wall.addPath(wallSpacing.box.right, wallSpacing.box.top).H(wallSpacing.side.right);

        wall.addPath(wallSpacing.side.left, wallSpacing.box.bottom).H(wallSpacing.box.left);

        wall.addPath(wallSpacing.box.right, wallSpacing.box.bottom).H(wallSpacing.side.right);
        break;
    default:
        wall.addPath(wallSpacing.side.left, wallSpacing.box.top)
            .V(wallSpacing.side.top)
            .H(wallSpacing.side.right)
            .V(wallSpacing.box.top);

        wall.addPath(wallSpacing.side.left, wallSpacing.box.bottom)
            .V(wallSpacing.side.bottom)
            .H(wallSpacing.side.right)
            .V(wallSpacing.box.bottom);

        wall.addPath(wallSpacing.box.left, wallSpacing.box.top)
            .h(wallSpacing.box.right - wallSpacing.box.left)
            .v(wallSpacing.box.bottom - wallSpacing.box.top)
            .h(-(wallSpacing.box.right - wallSpacing.box.left))
            .v(-(wallSpacing.box.bottom - wallSpacing.box.top));
        break;
}

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
                    let gp = navigator.getGamepads()[indexes[i - skipped]];
                    if (!gp) continue;
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
                        if (mapping.start && gameState !== "starting") {
                            gameState = "paused";
                            pausedPlayerID = indexes[i - skipped];
                        }
                    } else if (gameState === "paused") {
                        if (indexes[i - skipped] === pausedPlayerID) {
                            let [powerup, level] = menuSelector.input(
                                { x: mapping.right - mapping.left, y: mapping.up - mapping.down },
                                mapping.a,
                            ) || [null, null];
                            if (powerup !== null) {
                                console.log(`Selection was made: ${powerup}, ${level}`);
                                window.location.href = `../Back%20Attack/index.html?powerup=${encodeURIComponent(powerup)}&level=${encodeURIComponent(
                                    level.at(-1),
                                )}`;
                            }
                            if (mapping.select) gameState = "playing";
                        }
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
                if (!player.isDead || player.place === 1) {
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
