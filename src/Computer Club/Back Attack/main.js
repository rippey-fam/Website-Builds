import { COM } from "./utils/COM.js";
import { Player } from "./utils/Player.js";
import Wall from "./utils/Wall.js";
import mapController from "./utils/controllerMapping.js";
import { Queue, drawText } from "../../animationLib.js";

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

function inArea(x, y, area) {
    if (area.p1.x <= x && x <= area.p2.x) {
        if (area.p1.y <= y && y <= area.p2.y) {
            return true;
        }
    }
    return false;
}

function onGamepadConnected(e) {
    if (gameState === "beginning") {
        let position = positions.pop();
        players.push(new Player(position.x, position.y, players.length));
        indexes.push(e.gamepad.index);
        if (players.length === 8) window.removeEventListener("gamepadconnected", onGamepadConnected);
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

let players = [];
let countdown = [];
let bullets = [];
let indexes = [];
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
let comCount = 5;
let place = 0;
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
        for (let i = 0; i < 8 - currentPlayerLen; i++) {
            let x = 20 + Math.random() * (canvas.width - 20);
            let y = 20 + Math.random() * (canvas.height - 20);
            // while (
            //     wall.check(x, y, 30) ||
            //     inArea(x, y, {
            //         p1: { x: centerX, y: centerY },
            //         p2: { x: centerX + squareSize, y: centerY + squareSize },
            //     })
            // ) {
            //     x = 20 + Math.random() * (canvas.width - 20);
            //     y = 20 + Math.random() * (canvas.height - 20);
            // }
            let position = positions.pop();
            players.push(new COM(position.x, position.y));
        }
    }
    if (players.length !== 0) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        let skipped = 0;
        for (let i = 0; i < players.length; i++) {
            let player = players[i];
            if (!(gameState === "paused" || gameState === "cutscene")) {
                if (!(player instanceof COM)) {
                    let gp = navigator.getGamepads()[indexes[i] - skipped];
                    let mapping = mapController(gp);
                    if (mapping.select) window.location.reload();
                    player.input(
                        { x: mapping.leftX, y: mapping.leftY },
                        gameState === "starting" ? { x: 0, y: 0 } : { x: mapping.rightX, y: mapping.rightY },
                        gameState === "starting" ? 0 : mapping.a,
                        gameState === "starting" ? 0 : mapping.x,
                        gameState === "starting" ? 0 : mapping.b,
                        gp.vibrationActuator,
                        bullets,
                    );
                } else {
                    if (gameState !== "starting") {
                        player.input(players, bullets);
                    }
                    skipped++;
                }
            }
        }

        players.forEach((player) => player.move());
        bullets.forEach((bullet) => bullet.move());

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
    }
    requestAnimationFrame(game);
}
let queue = new Queue();
game();

// from https://ncase.me/sight-and-light/
function getIntersection(ray, segment) {
    // RAY in parametric: Point + Direction*T1
    var r_px = ray.a.x;
    var r_py = ray.a.y;
    var r_dx = ray.b.x - ray.a.x;
    var r_dy = ray.b.y - ray.a.y;

    // SEGMENT in parametric: Point + Direction*T2
    var s_px = segment.a.x;
    var s_py = segment.a.y;
    var s_dx = segment.b.x - segment.a.x;
    var s_dy = segment.b.y - segment.a.y;

    // Are they parallel? If so, no intersect
    var r_mag = Math.sqrt(r_dx * r_dx + r_dy * r_dy);
    var s_mag = Math.sqrt(s_dx * s_dx + s_dy * s_dy);
    if (r_dx / r_mag == s_dx / s_mag && r_dy / r_mag == s_dy / s_mag) {
        // Directions are the same.
        return null;
    }

    // SOLVE FOR T1 & T2
    // r_px+r_dx*T1 = s_px+s_dx*T2 && r_py+r_dy*T1 = s_py+s_dy*T2
    // ==> T1 = (s_px+s_dx*T2-r_px)/r_dx = (s_py+s_dy*T2-r_py)/r_dy
    // ==> s_px*r_dy + s_dx*T2*r_dy - r_px*r_dy = s_py*r_dx + s_dy*T2*r_dx - r_py*r_dx
    // ==> T2 = (r_dx*(s_py-r_py) + r_dy*(r_px-s_px))/(s_dx*r_dy - s_dy*r_dx)
    var T2 = (r_dx * (s_py - r_py) + r_dy * (r_px - s_px)) / (s_dx * r_dy - s_dy * r_dx);
    var T1 = (s_px + s_dx * T2 - r_px) / r_dx;

    // Must be within parametic whatevers for RAY/SEGMENT
    if (T1 < 0) return null;
    if (T2 < 0 || T2 > 1) return null;

    // Return the POINT OF INTERSECTION
    return {
        x: r_px + r_dx * T1,
        y: r_py + r_dy * T1,
        param: T1,
    };
}
