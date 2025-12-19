import "https://cdnjs.cloudflare.com/ajax/libs/ZzFX/2.29/ZzFX.js";
const bulletVol = 2;
const COMVol = 0.5;
const noteVol = 2.5;
const pauseVol = 3;
const menuVol = 0.8;
const shot1 = (vol) => () => zzfx(...[vol, , 71, 0.01, 0.04, 0.06, 1, 2.9, -6, -10, , , , 0.3, , , 0.06, 0.57, 0.08]);
const shot2 = (vol) => () =>
    zzfx(...[vol, , 262, , 0.11, 0.07, , 1.6, -14, 48, , , 0.01, , , , , 0.74, 0.08, 0.21, 102]); // Shoot 105; // Shoot 105; // Shoot 105; // Shoot 105
const shot3 = (vol) => () => zzfx(...[vol, , 495, 0.03, 0.03, 0.05, 1, 3.2, -6, 11, , , , , , , , 0.55, 0.09, , -1293]); // Shoot 115
const note1 = () => zzfx(...[noteVol, 0, 261.6256, 0.15, , 0.13, , 3.2, , , , , , , , 0.1, 0.07, 0.7, 0.04]);
const note2 = () => zzfx(...[noteVol, 0, 523.2511, 0.15, , 0.13, , 3.2, , , , , , , , 0.1, 0.07, 0.7, 0.04]);
const death1 = () => zzfx(...[5, 0, 130.8128, 0.01, 0.18, 0.34, 2, 2, , , , , , , , 0.1, 0.07, 0.87, 0.01]); // Music 109
const pause1 = () => zzfx(...[pauseVol, 0, , 0.04, 0.12, 0, 1, 0.5, , , , , , , , 0.05, 0.1, 2]); // Music 120 - Copy 1
const pause2 = () => zzfx(...[pauseVol * 0.8, 0, 110, 0.04, 0.12, 0, 1, 0.5, , , , , , , , 0.05, 0.1, 2]); // Music 120 - Copy 1
const menu1 = () => zzfx(...[menuVol, 0, 391.9954, 0.02, 0.03, 0.02, , 2, , -9, , , , , , 0.1, , 0.87]); // Jump 127
export const soundFX = {
    normalShot: shot1(bulletVol),
    bigShot: shot2(bulletVol),
    smallShot: shot3(bulletVol),
    COMNormalShot: shot1(COMVol),
    COMBigShot: shot2(COMVol),
    COMSmallShot: shot3(COMVol),
    countdown: note1,
    endCountdown: note2,
    die: death1,
    pause: pause1,
    unpause: pause2,
    menu: menu1,
};
