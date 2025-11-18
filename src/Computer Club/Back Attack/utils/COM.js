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
            Math.random() > 0.95,
            false,
            false,
            null,
            bullets,
        );
    }
}
