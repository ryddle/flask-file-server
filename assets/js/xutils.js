const angleAndModule = function (x1, y1, x2, y2) {
    var x = x2 - x1,
        y = y2 - y1,
        mod = Math.hypot(x, y);
    return { angle: Math.round((Math.atan2(y, x) * 180 / Math.PI + 360)%360), module: mod };
}

const angle = function (x1, y1, x2, y2) {
    var x = x2 - x1,
        y = y2 - y1;
    return Math.round((Math.atan2(y, x) * 180 / Math.PI + 360)%360);
}

const mod = function (x1, y1, x2, y2) {
    var x = x2 - x1,
        y = y2 - y1;
    return Math.hypot(x, y);
}

const map = function (value, x1, y1, x2, y2) {
    const nv = Math.round((value - x1) * (y2 - x2) / (y1 - x1) + x2);
    return (x2 > y2) ? Math.min(Math.max(nv, y2), x2) : Math.max(Math.min(nv, y2), x2);
}

const mapFloat = function (value, x1, y1, x2, y2) {
    const nv = (value - x1) * (y2 - x2) / (y1 - x1) + x2;
    return (x2 > y2) ? Math.min(Math.max(nv, y2), x2) : Math.max(Math.min(nv, y2), x2);
}

const clamp = function (value, min, max) {
    return Math.max(Math.min(value, max), min);
}

const clamp01 = function (value) {
    return clamp(value, 0, 1);
}

const truncFloat = function (value, digits) {
    return Math.trunc(value * 10**digits) / 10**digits;
}

const lerp = function (a, b, n) {
    return (1 - n) * a + n * b;
}

const lerp01 = function (a, b) {
    return lerp(a, b, 0.5);
}

const inverseLerp = function (a, b, value) {
    return (value - a) / (b - a);
}

const inverseLerp01 = function (a, b, value) {
    return clamp01(inverseLerp(a, b, value));
}

const random = function (min, max) {
    return Math.random() * (max - min) + min;
}

const randomInt = function (min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

const randomRange = function (min, max) {
    return Math.random() * (max - min) + min;
}

const randomRangeInt = function (min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

const randomSign = function () {
    return Math.random() < 0.5 ? -1 : 1;
}

const randomBool = function () {
    return Math.random() < 0.5;
}

const randomChoice = function (choices) {
    return choices[Math.floor(Math.random() * choices.length)];
}

const randomArray = function (array) {
    return array[Math.floor(Math.random() * array.length)];
}

export default {
    angleAndModule,
    angle,
    mod,
    map,
    mapFloat,
    clamp,
    clamp01,
    truncFloat,
    lerp,
    lerp01,
    inverseLerp,
    inverseLerp01,
    random,
    randomInt,
    randomRange,
    randomRangeInt,
    randomSign,
    randomBool,
    randomChoice,
    randomArray
}