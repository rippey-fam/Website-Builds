import { Player } from "./Player.js";

export class COM extends Player {
    constructor(x, y) {
        super(x, y, 0);
        this.color = "hsl(0, 0%, 40%)";
    }
    input(players, bullets) {
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
            Math.random() > 0.97,
            false,
            false,
            null,
            bullets,
        );
    }
}

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
