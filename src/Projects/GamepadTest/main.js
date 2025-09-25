let gamepadCount = 0;
let gamepadDisplays = [];

window.addEventListener("gamepadconnected", (e) => {
    gamepadCount++;
    let p = document.createElement("p");
    gamepadDisplays.push(p);
    document.body.append(p);
});

/**
 * @param {Gamepad} gp
 * @returns {Object}
 */
export default function mapController(gp) {
    return {
        leftX: Math.round(gp.axes[0] * 100) / 100,
        leftY: Math.round(gp.axes[1] * 100) / 100,
        rightX: Math.round(gp.axes[2] * 100) / 100,
        rightY: Math.round(gp.axes[3] * 100) / 100,
        a: gp.buttons[0].pressed,
        b: gp.buttons[1].pressed,
        x: gp.buttons[2].pressed,
        y: gp.buttons[3].pressed,
        leftBumper: gp.buttons[4].pressed,
        rightBumper: gp.buttons[5].pressed,
        leftTrigger: Math.round(gp.buttons[6].value * 100) / 100,
        rightTrigger: Math.round(gp.buttons[7].value * 100) / 100,
        select: gp.buttons[8].pressed,
        start: gp.buttons[9].pressed,
        leftStick: gp.buttons[10].pressed,
        rightStick: gp.buttons[11].pressed,
        up: gp.buttons[12].pressed,
        down: gp.buttons[13].pressed,
        left: gp.buttons[14].pressed,
        right: gp.buttons[15].pressed,
        xBoxButton: gp.buttons[16].pressed,
    };
}

function game() {
    for (let i = 0; i < gamepadCount; i++) {
        let gamepadDisp = gamepadDisplays[i];
        let gp = navigator.getGamepads()[i];
        if (gp !== null) {
            let string = "";
            let controllerMap = mapController(gp);
            Object.keys(controllerMap).forEach((val, i) => {
                string += `${val}: ${controllerMap[val]}, ${i % 2 === 0 ? "" : "<br>"}`;
            });
            gamepadDisp.innerHTML = string.slice(0, -2);
        } else {
            gamepadDisp.innerHTML = "Press A to connect";
        }
    }
    requestAnimationFrame(game);
}

document.addEventListener("DOMContentLoaded", () => {
    game();
    // setInterval(() => {
    //     gp?.vibrationActuator.playEffect("dual-rumble", {
    //         startDelay: 0,
    //         duration: 1000,
    //         weakMagnitude: 1.0,
    //         strongMagnitude: 1.0,
    //     });
    // }, 1500);
});
