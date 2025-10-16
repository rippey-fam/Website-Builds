export function snap(mouse, origin) {
    let dx = mouse.x - origin.x;
    let dy = mouse.y - origin.y;

    let angle = Math.atan2(dy, dx);
    let increment = Math.PI / 4;
    let snapped = Math.round(angle / increment) * increment;
    let deltaA = snapped - angle;
    let dist = Math.hypot(dx, dy);
    let b = dist * Math.cos(deltaA);
    let x = b * Math.cos(snapped);
    let y = b * Math.sin(snapped);
    return { x: origin.x + x, y: origin.y + y };
}
export function shuffle(array) {
    return array.sort(() => Math.random() - 0.5);
}
