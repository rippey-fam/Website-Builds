function easeOutBack(x) {
    const c1 = 1.70158;
    const c3 = c1 + 1;

    return 1 + c3 * Math.pow(x - 1, 3) + c1 * Math.pow(x - 1, 2);
}

function easeInOutCubic(x) {
    return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
}

function easeOutCubic(x) {
    return 1 - Math.pow(1 - x, 3);
}

function easeInCubic(x) {
    return x * x * x;
}

function easeOutElastic(x) {
    const c4 = (2 * Math.PI) / 3;

    return x === 0 ? 0 : x === 1 ? 1 : Math.pow(2, -10 * x) * Math.sin((x * 10 - 0.75) * c4) + 1;
}

function easeOutBounce(x) {
    const n1 = 7.5625;
    const d1 = 2.75;

    if (x < 1 / d1) {
        return n1 * x * x;
    } else if (x < 2 / d1) {
        return n1 * (x -= 1.5 / d1) * x + 0.75;
    } else if (x < 2.5 / d1) {
        return n1 * (x -= 2.25 / d1) * x + 0.9375;
    } else {
        return n1 * (x -= 2.625 / d1) * x + 0.984375;
    }
}

const interpFunctions = {
    easeIn: easeInCubic,
    easeOut: easeOutCubic,
    easeInOut: easeInOutCubic,
    easeOutBack: easeOutBack,
    easeOutElastic: easeOutElastic,
    easeOutBounce: easeOutBounce,
};

function interpolate(t, time, equation) {
    if (t >= 0) return equation(t < time ? t / time : 1);
    else return 0;
}

function getMillisecondsPlusDate() {
    let date = new Date();
    return (
        date.getMilliseconds() +
        date.getSeconds() * 1000 +
        date.getMinutes() * 60 * 1000 +
        date.getHours() * 60 * 60 * 1000
    );
}

/**
 * @typedef {object} Point
 * @property {number} x
 * @property {number} y
 */

export class Line {
    /**
     * @param {object} param0
     * @param {number} [param0.delay=0] - delay time
     * @param {number} param0.time - length of animation
     * @param {Point} param0.p1 - start point
     * @param {Point} param0.p2 - end point
     * @param {string} [param0.color="black"] - line color
     * @param {number} [param0.lineWidth=7] - line width
     * @param {keyof typeof interpFunctions | function} [param0.equation = (x=>x)] - interpolate function or name of interpolate function
     */
    constructor({ delay = 0, time, p1, p2, color = "black", lineWidth = 7, equation = (x) => x }) {
        this.delay = delay;
        this.time = time;
        this.p1 = p1;
        this.p2 = p2;
        this.color = color;
        this.lineWidth = lineWidth;
        if (typeof equation === "function") {
            this.equation = equation;
        } else {
            this.equation = interpFunctions[equation] ?? ((x) => x);
        }
        this.creationTime = getMillisecondsPlusDate();
    }
    draw(ctx) {
        let t = getMillisecondsPlusDate() - this.creationTime;
        t -= this.delay;
        let r = interpolate(t, this.time, this.equation);
        if (r !== 0) {
            ctx.beginPath();
            ctx.strokeStyle = this.color;
            ctx.lineCap = "round";
            ctx.lineWidth = this.lineWidth;
            ctx.moveTo(this.p1.x, this.p1.y);
            ctx.lineTo(this.p1.x + (this.p2.x - this.p1.x) * r, this.p1.y + (this.p2.y - this.p1.y) * r);
            ctx.stroke();
        }
    }
    get totalTime() {
        return this.delay + this.time;
    }
}

export class Circle {
    /**
     *
     * @param {Object} param0
     * @param {number} [param0.delay=0] - delay time
     * @param {number} param0.time - length of animation
     * @param {Point} param0.p - center point
     * @param {number} param0.r - radius
     * @param {number} param0.start - start angle in radians
     * @param {number} param0.end - angle length in radians
     * @param {boolean} param0.fill - whether to fill the circle
     * @param {boolean} param0.clockwise - draw direction
     * @param {string} [param0.color="black"] - line color
     * @param {number} [param0.lineWidth=7] - line width
     * @param {keyof typeof interpFunctions | function} [param0.equation = (x=>x)] - interpolate function or name of interpolate function
     */
    constructor({
        delay = 0,
        time,
        p,
        r,
        start,
        end,
        fill,
        clockwise,
        color = "black",
        lineWidth = 7,
        equation = (x) => x,
    }) {
        this.delay = delay;
        this.time = time;
        this.p = p;
        this.r = r;
        this.start = start;
        this.end = end;
        this.fill = fill;
        this.clockwise = clockwise;
        this.equation = equation;
        this.color = color;
        this.lineWidth = lineWidth;
        this.creationTime = getMillisecondsPlusDate();
    }
    draw(ctx) {
        let t = getMillisecondsPlusDate() - this.creationTime;
        t -= this.delay;
        let r = interpolate(t, this.time, this.equation);
        if (r !== 0) {
            ctx.strokeStyle = this.color;
            ctx.lineCap = "round";
            ctx.lineWidth = this.lineWidth;
            ctx.beginPath();
            ctx.arc(
                this.p.x,
                this.p.y,
                this.r,
                this.start,
                this.clockwise ? this.start + this.end * r : this.start - this.end * r,
                !this.clockwise,
            );
            ctx.stroke();
            if (this.fill) ctx.fill();
        }
    }
    get totalTime() {
        return this.delay + this.time;
    }
}

export class Queue {
    constructor() {
        this.totalDelay = 0;
    }
    /**
     * @param {Function} callback
     */
    next(callback) {
        let delayToAdd = callback(this.totalDelay);
        this.totalDelay = delayToAdd;
        return this;
    }
    delay(num) {
        this.totalDelay += num;
        return this;
    }
    reset() {
        this.totalDelay = 0;
        return this;
    }
}
/**
 * @param {Object} param0
 * @param {Point} param0.p1 - one corner of rectangle
 * @param {Point} param0.p2 - opposite corner of rectangle
 * @param {number} param0.overlap - time to overlap the two line animations
 * @param {keyof typeof interpFunctions | function} [param0.equation] - interpolate function or name of interpolate function
 * @param {number} param0.time - length of animation
 * @param {string} [param0.color="black"] - line color
 * @param {number} [param0.lineWidth=7] - line width
 * @param {Array} param0.instances - array to push created line into
 */
export function drawRect({ time, p1, p2, overlap, equation = undefined, color = "black", lineWidth = 7, instances }) {
    return (delay) => {
        let line1 = new Line({
            delay,
            time,
            p1: { x: p1.x, y: p1.y },
            p2: { x: p2.x, y: p1.y },
            color,
            lineWidth,
            equation,
        });
        let line2 = new Line({
            delay,
            time,
            p1: { x: p1.x, y: p1.y },
            p2: { x: p1.x, y: p2.y },
            color,
            lineWidth,
            equation,
        });
        let line3 = new Line({
            delay: line1.totalTime - overlap,
            time,
            p1: { x: p2.x, y: p1.y },
            p2: { x: p2.x, y: p2.y },
            color,
            lineWidth,
            equation,
        });
        let line4 = new Line({
            delay: line1.totalTime - overlap,
            time,
            p1: { x: p1.x, y: p2.y },
            p2: { x: p2.x, y: p2.y },
            color,
            lineWidth,
            equation,
        });
        instances.push(line1, line2, line3, line4);
        return line4.totalTime;
    };
}
/**
 *
 * @param {Object} param0
 * @param {Point} param0.time - length of animation
 * @param {Point} param0.p1 - start point
 * @param {Point} param0.p2 - end point
 * @param {keyof typeof interpFunctions | function} [param0.equation] - interpolate function or name of interpolate function
 * @param {string} [param0.color="black"] - line color
 * @param {number} [param0.lineWidth=7] - line width
 * @param {Array} param0.instances - array to push created line into
 */
export function drawLine({ time, p1, p2, equation = undefined, color = "black", lineWidth = 7, instances }) {
    return (delay) => {
        let line = new Line({ delay, time, p1, p2, equation, color, lineWidth });
        instances.push(line);
        return line.totalTime;
    };
}

/**
 *
 * @param {Object} param0
 * @param {number} param0.time - length of animation
 * @param {Point} param0.p1 - center point
 * @param {number} param0.r - radius
 * @param {number} param0.start - start angle in radians
 * @param {number} param0.end - angle length in radians
 * @param {boolean} param0.fill - whether to fill the circle
 * @param {boolean} param0.clockwise - draw direction
 * @param {keyof typeof interpFunctions | function} [param0.equation] - interpolate function or name of interpolate function
 * @param {string} [param0.color="black"] - line color
 * @param {number} [param0.lineWidth=7] - line width
 * @param {Array} param0.instances - array to push created circle into
 */
export function drawCircle({
    time,
    p1,
    r,
    start,
    end,
    fill,
    clockwise,
    color = "black",
    lineWidth = 7,
    equation = undefined,
    instances,
}) {
    return (delay) => {
        let circle = new Circle({ delay, time, p: p1, r, start, end, fill, clockwise, color, lineWidth, equation });
        instances.push(circle);
        return circle.totalTime;
    };
}

///////////////////
//  Main Code   //
//////////////////

const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");

/**
 * @type Line|Circle[]
 */
let instances = [];
function game() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    instances.forEach((instance) => {
        instance.draw(ctx);
    });
    requestAnimationFrame(game);
}

document.addEventListener("DOMContentLoaded", () => {
    game();
    let queue = new Queue();
    queue
        .next(
            drawRect({
                time: 1000,
                p1: { x: 100, y: 100 },
                p2: { x: 300, y: 300 },
                overlap: 0,
                color: "red",
                lineWidth: 5,
                equation: easeInOutCubic,
                instances,
            }),
        )
        .next(
            drawLine({
                time: 1000,
                p1: { x: 400, y: 100 },
                p2: { x: 400, y: 300 },
                color: "blue",
                lineWidth: 10,
                equation: easeInOutCubic,
                instances,
            }),
        )
        .next(
            drawCircle({
                time: 1000,
                p1: { x: 600, y: 200 },
                r: 50,
                start: 0,
                end: 2 * Math.PI,
                fill: false,
                clockwise: true,
                color: "green",
                lineWidth: 8,
                equation: easeInOutCubic,
                instances,
            }),
        )
        .reset();
});
