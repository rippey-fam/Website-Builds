import { Player } from "./Player.js";

export class COM extends Player {
    constructor(x, y) {
        super(x, y, 0);
        this.color = "hsl(0, 0%, 40%)";
    }
    input(players) {
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
        if (closestCoor) this.angle = Math.atan2(closestCoor.y - this.y, closestCoor.x - this.x);
    }
}
