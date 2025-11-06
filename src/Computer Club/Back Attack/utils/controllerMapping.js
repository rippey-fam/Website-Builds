/**
 * Maps gamepad inputs to a standardized controller object
 * @param {Gamepad} gp - The gamepad object from the Gamepad API
 * @returns {{
 *   leftX: number,
 *   leftY: number,
 *   rightX: number,
 *   rightY: number,
 *   a: boolean,
 *   b: boolean,
 *   x: boolean,
 *   y: boolean,
 *   leftBumper: boolean,
 *   rightBumper: boolean,
 *   leftTrigger: number,
 *   rightTrigger: number,
 *   select: boolean,
 *   start: boolean,
 *   leftStick: boolean,
 *   rightStick: boolean,
 *   up: boolean,
 *   down: boolean,
 *   left: boolean,
 *   right: boolean,
 *   xBoxButton: boolean
 * }} Mapped controller object with normalized values
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
