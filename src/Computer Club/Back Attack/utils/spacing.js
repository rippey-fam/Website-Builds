function point(x, y) {
    return { x, y };
}

export default function spacing(m, M, width, height) {
    M = M + m;
    let mbox = {
        top: m,
        bottom: height - m,
        left: m,
        right: width - m,
        center: width / 2,
        middle: height / 2,
        width: width - m * 2,
        height: height - m * 2,
    };
    let Mbox = {
        top: M,
        bottom: height - M,
        left: M,
        right: width - M,
        center: width / 2,
        middle: height / 2,
        width: width - M * 2,
        height: height - M * 2,
    };

    let playerSpacing = {
        third: {
            top: [point(Mbox.left, Mbox.top), point(Mbox.center, Mbox.top), point(Mbox.right, Mbox.top)],
            bottom: [point(Mbox.left, Mbox.bottom), point(Mbox.center, Mbox.bottom), point(Mbox.right, Mbox.bottom)],
            left: [point(Mbox.left, Mbox.top), point(Mbox.left, Mbox.middle), point(Mbox.left, Mbox.bottom)],
            right: [point(Mbox.right, Mbox.top), point(Mbox.right, Mbox.middle), point(Mbox.right, Mbox.bottom)],
        },
        quarter: {
            top: [
                point(Mbox.left, Mbox.top),
                point(Mbox.left + Mbox.width / 3, Mbox.top),
                point(Mbox.left + (Mbox.width / 3) * 2, Mbox.top),
                point(Mbox.right, Mbox.top),
            ],
            bottom: [
                point(Mbox.left, Mbox.bottom),
                point(Mbox.left + Mbox.width / 3, Mbox.bottom),
                point(Mbox.left + (Mbox.width / 3) * 2, Mbox.bottom),
                point(Mbox.right, Mbox.bottom),
            ],
            left: [
                point(Mbox.left, Mbox.top),
                point(Mbox.left, Mbox.top + Mbox.height / 3),
                point(Mbox.left, Mbox.top + (Mbox.height / 3) * 2),
                point(Mbox.left, Mbox.bottom),
            ],
            right: [
                point(Mbox.right, Mbox.top),
                point(Mbox.right, Mbox.top + Mbox.height / 3),
                point(Mbox.right, Mbox.top + (Mbox.height / 3) * 2),
                point(Mbox.right, Mbox.bottom),
            ],
        },
        middle: {
            top: {
                left: point(Mbox.center - mbox.height / 12, Mbox.middle - mbox.height / 12),
                right: point(Mbox.center + mbox.height / 12, Mbox.middle - mbox.height / 12),
            },
            bottom: {
                left: point(Mbox.center - mbox.height / 12, Mbox.middle + mbox.height / 12),
                right: point(Mbox.center + mbox.height / 12, Mbox.middle + mbox.height / 12),
            },
        },
    };

    let wallSpacing = {
        side: {
            top: mbox.top,
            bottom: mbox.bottom,
            left: mbox.left,
            right: mbox.right,
        },
        center: mbox.center,
        middle: mbox.middle,
        box: {
            top: mbox.top + mbox.height / 3,
            bottom: mbox.bottom - mbox.height / 3,
            left: mbox.center - mbox.height / 6,
            right: mbox.center + mbox.height / 6,
        },
    };

    return [playerSpacing, wallSpacing];
}
