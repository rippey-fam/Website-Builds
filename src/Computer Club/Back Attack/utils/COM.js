import { Player } from "./Player.js";

export class COM extends Player {
    constructor(x, y) {
        super(x, y, 0);
        this.color = "hsl(0, 0%, 40%)";
        /**
         * @type {"wandering"|"hunting"|"escaping"}
         */
        this.state = "wandering";
        this.wanderState = {
            direction: 0,
        };
    }

    input(context) {
        switch (this.state) {
            case "wandering":
                this.inputWander(context);
                // this.inputDumb(context);
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
        players = players.filter((p) => p !== this);
        players.sort((a, b) => Math.hypot(this.x - a.x, this.y - a.y) - Math.hypot(this.x - b.x, this.y - b.y));

        let closest = Infinity;
        let closestCoor = null;

        players.forEach((player) => {
            if (player !== this) {
                let dist = Math.hypot(this.x - player.x, this.y - player.y);
                if (dist < closest) {
                    closest = dist;
                    closestCoor = { x: player.x, y: player.y };
                }
                if (dist < 50) {
                    //shoot
                }
            }
        });
        let angle = this.angle;
        if (closestCoor) angle = Math.atan2(closestCoor.y - this.y, closestCoor.x - this.x);
        super.input(
            { x: Math.cos(angle), y: Math.sin(angle) },
            { x: 0, y: 0 },
            Math.random() > 0.95,
            false,
            false,
            null,
            bullets,
        );
    }

    chooseDirection() {}
    inputWander({ players, wall, bullets, ctx }) {
        let intersections = this.getRaycast(wall.walls);
        this.repelFromPoints(intersections);
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
        super.input(
            { x: Math.cos(this.angle), y: Math.sin(this.angle) },
            this.repelFromPoints(intersections),
            false,
            false,
            null,
            bullets,
        );
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
            let dist = distance(this, point);
            let factor = 3;
            let strength = factor / dist;

            let dx = this.x - point.x;
            let dy = this.y - point.y;

            let ex = (dx / dist) * strength;
            let ey = (dy / dist) * strength;

            gravitate.x += ex;
            gravitate.y += ey;
        }
        console.log(gravitate);
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
            let dist = distance(ray.a, intersection);
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
