import { Player } from "./Player.js";

let point = (x, y) => {
    return { x, y };
};

function deadzone(joy, min) {
    if (Math.hypot(joy.x, joy.y) < min) {
        return { x: 0, y: 0 };
    }
    return joy;
}

function clampMagnitude({ x, y }, max, min) {
    let dist = Math.hypot(x, y);
    if (Math.abs(dist) < max) return deadzone({ x, y }, min);
    let y1 = (max * y) / dist;
    let x1 = Math.sqrt(max ** 2 - y1 ** 2) * Math.sign(x);
    return point(x1, y1);
}

export class COM extends Player {
    constructor(x, y, options = {}) {
        super(x, y, 0, options);
        this.rightStick = options.rightStick !== undefined ? options.rightStick : true;
        this.color = "hsl(0, 0%, 55%)";
        /**
         * @type {"wandering"|"hunting"|"escaping"}
         */
        this.state = "wandering";
        this.debug = false;
        this.wanderState = {
            point: null,
            timeout: null,
            prevPoint: null,
            shouldChange: false,
            gravitationForce: 0.5,
        };
        this.shoot = {
            a: 0,
            x: 0,
            b: 0,
        };
        this.shootFrameCooldown = 30;
    }

    input(context) {
        switch (this.state) {
            case "wandering":
                if (this.isDead) {
                    this.inputDumb(context);
                } else {
                    this.inputWander(context);
                    if (this.rightStick) {
                        this.inputDumb(context);
                    }
                }
                break;
            case "hunting":
                this.inputHunting(context);
                break;
            case "escaping":
                this.inputEscaping(context);
                break;
            default:
                throw new Error("Unexpected State");
        }
    }

    inputDumb({ players, wall, bullets }) {
        players = [...players];
        players = players.filter((p) => p !== this).filter((p) => !p.isDead);
        players.sort((a, b) => Math.hypot(this.x - a.x, this.y - a.y) - Math.hypot(this.x - b.x, this.y - b.y));

        let closest = Infinity;
        let closestCoor = null;

        players.forEach((player) => {
            let intersection = getClosestIntersection({ a: this, b: player }, wall.walls);
            let dist = distance(this, player);
            if (intersection !== null) {
                if (intersection.dist > dist) {
                    if (dist < closest) {
                        closest = dist;
                        closestCoor = { x: player.x, y: player.y };
                    }
                }
            } else {
                if (dist < closest) {
                    closest = dist;
                    closestCoor = { x: player.x, y: player.y };
                }
            }
        });
        let angle = this.angle;
        if (closestCoor) {
            angle = Math.atan2(closestCoor.y - this.y, closestCoor.x - this.x);
            if (closest < (this.isDead ? 500 : 200)) {
                if (this.shoot.a === 0) {
                    this.shoot.a = this.shootFrameCooldown;
                }
            }
        }
        super.input(
            { x: Math.cos(angle), y: Math.sin(angle) },
            { x: 0, y: 0 },
            this.shoot.a === this.shootFrameCooldown,
            false,
            false,
            null,
            bullets,
        );
        if (this.shoot.a > 0) this.shoot.a--;
    }

    chooseDirection() {}
    inputWander({ players, wall, bullets, ctx }) {
        let intersections = this.getRaycast(wall.walls);

        if (this.wanderState.shouldChange) {
            this.wanderState.point = null;
            this.wanderState.shouldChange = false;
        }
        if (this.wanderState.point !== null) {
            if (distance(this, this.wanderState.point) < 200) {
                this.wanderState.prevPoint = { x: this.wanderState.point.x, y: this.wanderState.point.y };
                this.wanderState.point = null;
            }
        }

        if (this.wanderState.point === null) {
            if (this.wanderState.timeout !== null) clearTimeout(this.wanderState.timeout);
            let canvasWidth = 800; // Default canvas width
            let canvasHeight = 600; // Default canvas height
            if (ctx && ctx.canvas) {
                canvasWidth = ctx.canvas.width;
                canvasHeight = ctx.canvas.height;
            }
            let boundaryWalls = [
                { a: { x: 0, y: 0 }, b: { x: canvasWidth, y: 0 } }, // Top wall
                { a: { x: canvasWidth, y: 0 }, b: { x: canvasWidth, y: canvasHeight } }, // Right wall
                { a: { x: canvasWidth, y: canvasHeight }, b: { x: 0, y: canvasHeight } }, // Bottom wall
                { a: { x: 0, y: canvasHeight }, b: { x: 0, y: 0 } }, // Left wall
            ];
            let intersections = this.getRaycast([...wall.walls, ...boundaryWalls]).sort((a, b) => b.dist - a.dist);
            let findNewPoint = () => {
                if (this.wanderState.prevPoint !== null) {
                    let prevPointDir = Math.atan2(
                        this.wanderState.prevPoint.y - this.y,
                        this.wanderState.prevPoint.x - this.x,
                    );
                    for (const point of intersections) {
                        let direction = Math.atan2(point.y - this.y, point.x - this.x);
                        if (Math.abs(direction - prevPointDir) > Math.PI / 2) {
                            return point;
                        }
                    }
                } else {
                    return intersections[0];
                }
            };
            let point = findNewPoint();
            if (!this.wanderState.point) {
                this.wanderState.point = { x: 0, y: 0 };
                this.wanderState.findNewPoint = true;
            } else {
                this.wanderState.point = point;
            }
            this.wanderState.timeout = setTimeout(() => {
                this.wanderState.shouldChange = true;
            }, 7000);
        }

        let gravitate = this.repelFromPoints(intersections);
        if (this.debug) {
            for (const point of intersections) {
                ctx.beginPath();
                ctx.strokeStyle = "red";
                ctx.fillStyle = "red";
                ctx.lineWidth = "3";
                ctx.moveTo(this.x, this.y);
                ctx.lineTo(point.x, point.y);
                ctx.stroke();
                ctx.beginPath();
                ctx.arc(point.x, point.y, 10, 0, 2 * Math.PI);
                ctx.fill();
            }
        }

        let strength = this.wanderState.gravitationForce;
        let dist = distance(this, this.wanderState.point);

        let dx = this.x - this.wanderState.point.x;
        let dy = this.y - this.wanderState.point.y;

        let ex = (dx / dist) * strength;
        let ey = (dy / dist) * strength;

        gravitate.x -= ex;
        gravitate.y -= ey;

        if (this.debug) {
            ctx.beginPath();
            ctx.strokeStyle = "blue";
            ctx.fillStyle = "blue";
            ctx.lineWidth = "3";
            ctx.moveTo(this.x, this.y);
            ctx.lineTo(this.wanderState.point.x, this.wanderState.point.y);
            ctx.stroke();
            ctx.beginPath();
            ctx.arc(this.wanderState.point.x, this.wanderState.point.y, 10, 0, 2 * Math.PI);
            ctx.fill();
        }
        if (!this.rightStick) {
            if (Math.hypot(gravitate.x, gravitate.y) < 0.1) {
                this.inputDumb({ players, wall, bullets });
                return;
            }
            let angle = Math.atan2(-gravitate.y, -gravitate.x);
            this.angle = angle;
            if (this.shoot.a === 0) {
                this.shoot.a = this.shootFrameCooldown;
            }
        }
        super.input(
            { x: Math.cos(this.angle), y: Math.sin(this.angle) },
            this.rightStick ? clampMagnitude(gravitate, 0.75, 0) : { x: 0, y: 0 },
            !this.rightStick ? this.shoot.a === this.shootFrameCooldown : false,
            false,
            false,
            null,
            bullets,
        );
        if (!this.rightStick && this.shoot.a > 0) this.shoot.a--;
    }
    inputHunting({ players, wall, bullets }) {}
    inputEscaping({ players, wall, bullets }) {}

    getRaycast(walls) {
        let rays = [];
        let rayCount = 100;
        for (let i = Math.PI / rayCount; i < 2 * Math.PI + Math.PI / rayCount; i += (2 * Math.PI) / rayCount) {
            rays.push({
                a: { x: this.x, y: this.y },
                b: { x: this.x + Math.cos(i), y: this.y + Math.sin(i) },
            });
        }
        return getIntersections(rays, walls);
    }
    repelFromPoints(intersections) {
        let gravitate = { x: 0, y: 0 };
        for (const point of intersections) {
            let dist = point.dist;
            let factor = 3;
            let strength = factor / dist;

            let dx = this.x - point.x;
            let dy = this.y - point.y;

            let ex = (dx / dist) * strength;
            let ey = (dy / dist) * strength;

            gravitate.x += ex;
            gravitate.y += ey;
        }
        // console.log(gravitate);
        return gravitate;
    }
}

// from https://ncase.me/sight-and-light/

function getIntersection(ray, segment) {
    // RAY in parametric: Point + Direction*T1
    let r_px = ray.a.x;
    let r_py = ray.a.y;
    let r_dx = ray.b.x - ray.a.x;
    let r_dy = ray.b.y - ray.a.y;

    // SEGMENT in parametric: Point + Direction*T2
    let s_px = segment.a.x;
    let s_py = segment.a.y;
    let s_dx = segment.b.x - segment.a.x;
    let s_dy = segment.b.y - segment.a.y;

    // Are they parallel? If so, no intersect
    let r_mag = Math.sqrt(r_dx * r_dx + r_dy * r_dy);
    let s_mag = Math.sqrt(s_dx * s_dx + s_dy * s_dy);
    if (r_dx / r_mag == s_dx / s_mag && r_dy / r_mag == s_dy / s_mag) {
        // Directions are the same.
        return null;
    }

    // SOLVE FOR T1 & T2
    // r_px+r_dx*T1 = s_px+s_dx*T2 && r_py+r_dy*T1 = s_py+s_dy*T2
    // ==> T1 = (s_px+s_dx*T2-r_px)/r_dx = (s_py+s_dy*T2-r_py)/r_dy
    // ==> s_px*r_dy + s_dx*T2*r_dy - r_px*r_dy = s_py*r_dx + s_dy*T2*r_dx - r_py*r_dx
    // ==> T2 = (r_dx*(s_py-r_py) + r_dy*(r_px-s_px))/(s_dx*r_dy - s_dy*r_dx)
    let T2 = (r_dx * (s_py - r_py) + r_dy * (r_px - s_px)) / (s_dx * r_dy - s_dy * r_dx);
    let T1 = (s_px + s_dx * T2 - r_px) / r_dx;

    // Must be within parametric what-ever for RAY/SEGMENT
    if (T1 < 0) return null;
    if (T2 < 0 || T2 > 1) return null;

    // Return the POINT OF INTERSECTION

    let p = {
        x: r_px + r_dx * T1,
        y: r_py + r_dy * T1,
    };
    let dx = p.x - ray.a.x;
    let dy = p.y - ray.a.y;
    let dist = Math.hypot(dx, dy);
    return {
        x: p.x,
        y: p.y,
        dx,
        dy,
        dist,
    };
}

function distance(p1, p2) {
    return Math.hypot(p1.x - p2.x, p1.y - p2.y);
}

function getClosestIntersection(ray, segments) {
    let closest = Infinity;
    let closestPoint = null;
    for (const segment of segments) {
        let intersection = getIntersection(ray, segment);
        if (intersection) {
            //if(Math.hypot(ray.a.x - intersection.x, ray.a.y - intersection.y) < closest){
            let dist = intersection.dist;
            if (dist < closest) {
                closest = dist;
                closestPoint = intersection;
            }
        }
    }
    return closestPoint;
}

function getIntersections(rays, segments) {
    return rays.map((r) => getClosestIntersection(r, segments)).filter((i) => i !== null);
}
