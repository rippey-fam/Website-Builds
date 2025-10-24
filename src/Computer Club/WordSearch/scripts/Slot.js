export class Slot {
    constructor(p1, p2, radius) {
        this.p1 = p1;
        this.p2 = p2;
        this.radius = radius;
        this.color = "#6C97D3";
    }
    /**
     * @param {CanvasRenderingContext2D} ctx
     */
    draw(ctx) {
        let p1 = this.p1;
        let p2 = this.p2;
        let radius = this.radius;
        // Calculate the distance between points
        const dx = p2.x - p1.x;
        const dy = p2.y - p1.y;
        const dist = Math.hypot(dx, dy);

        ctx.strokeStyle = this.color;
        ctx.lineWidth = 3;
        // Handle degenerate case (points are too close)
        if (dist < 0.01) {
            ctx.beginPath();
            ctx.arc(p1.x, p1.y, radius, 0, Math.PI * 2);
            ctx.closePath();
            ctx.stroke();
            return;
        }

        // Calculate unit vector along the line
        const ux = dx / dist;
        const uy = dy / dist;

        // Calculate perpendicular unit vector (rotated 90° counterclockwise)
        const px = -uy;
        const py = ux;

        // Calculate the four corner points of the slot body
        const x1 = p1.x + px * radius;
        const y1 = p1.y + py * radius;

        const x2 = p2.x + px * radius;
        const y2 = p2.y + py * radius;

        const x3 = p2.x - px * radius;
        const y3 = p2.y - py * radius;

        const x4 = p1.x - px * radius;
        const y4 = p1.y - py * radius;

        // Calculate angles for the arcs
        const angle1 = Math.atan2(py, px);
        const angle2 = Math.atan2(-py, -px);

        // Draw the slot
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.arc(p2.x, p2.y, radius, angle1, angle2, true);
        ctx.lineTo(x4, y4);
        ctx.arc(p1.x, p1.y, radius, angle2, angle1, true);
        ctx.closePath();
        ctx.stroke();
    }
}
