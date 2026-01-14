const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
const FOREGROUND = "#00FF00";
const BACKGROUND = "#0F0F0F";
const s = 10;
let offsetX = 0, offsetY = 0, offsetZ = 0;
let yaw = 0, pitch = 0;
let vertices = [
    { x: -0.25, y: -0.25, z: 1 },
    { x: -0.25, y: 0.25, z: 1 },
    { x: 0.25, y: 0.25, z: 1 },
    { x: 0.25, y: -0.25, z: 1 },
    { x: -0.25, y: -0.25, z: 1.25 },
    { x: -0.25, y: 0.25, z: 1.25 },
    { x: 0.25, y: 0.25, z: 1.25 },
    { x: 0.25, y: -0.25, z: 1.25 }
];
let faces = [
    [0, 1, 2, 3],
    [4, 5, 6, 7],
    [0, 4],
    [1, 5],
    [2, 6],
    [3, 7]
];
const rotateEuler = ({ x, y, z }) => {
    let c = {
        x: Math.cos(pitch),
        y: Math.cos(yaw),
        z
    };
    let s = {
        x: Math.sin(pitch),
        y: Math.sin(yaw),
        z
    };
    let r = { x, y, z };
    r = {
        x: r.x * c.y + r.z * s.y,
        y,
        z: -r.x * s.y + r.z * c.y
    };
    return r;
};
const offsetAndRotate = (p) => {
    const c = {
        x: -offsetX,
        y: -offsetY,
        z: -offsetZ
    };
    return {
        x: p.x + offsetX,
        y: p.y + offsetY,
        z: p.z + offsetZ
    };
};
const project = ({ x, y, z }) => {
    return {
        x: x / z,
        y: y / z,
        z
    };
};
const remap = ({ x, y }) => {
    return {
        x: (x + 1) / 2 * canvas.width,
        y: (1 - (y + 1) / 2) * canvas.height
    };
};
const drawPoint = ({ x, y, z }) => {
    const offsetted = offsetAndRotate({ x, y, z });
    const projected = project(offsetted);
    const remapped = remap(projected);
    ctx.fillStyle = FOREGROUND;
    ctx.fillRect(remapped.x - s / 2, remapped.y - s / 2, s, s);
};
const drawFace = (face) => {
    ctx.strokeStyle = FOREGROUND;
    ctx.beginPath();
    for (let i = 0; i <= face.length; ++i) {
        const offsetted = offsetAndRotate(vertices[face[i % face.length]]);
        const projected = project(offsetted);
        const remapped = remap(projected);
        if (i == 0)
            ctx.moveTo(remapped.x, remapped.y);
        else
            ctx.lineTo(remapped.x, remapped.y);
        ctx.stroke();
    }
    ctx.closePath();
};
const draw = () => {
    ctx.fillStyle = BACKGROUND;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    vertices.forEach(vertex => {
        drawPoint(vertex);
    });
    faces.forEach(face => {
        drawFace(face);
    });
};
let pressedButtons = new Set();
const logic = () => {
    if (pressedButtons.has("w"))
        offsetZ -= 0.01;
    if (pressedButtons.has("s"))
        offsetZ += 0.01;
    if (pressedButtons.has("d"))
        offsetX -= 0.01;
    if (pressedButtons.has("a"))
        offsetX += 0.01;
    if (pressedButtons.has("e"))
        offsetY -= 0.01;
    if (pressedButtons.has("q"))
        offsetY += 0.01;
    if (pressedButtons.has("ArrowLeft"))
        yaw -= 0.01;
    if (pressedButtons.has("ArrowRight"))
        yaw += 0.01;
    if (pressedButtons.has("ArrowDown"))
        pitch -= 0.01;
    if (pressedButtons.has("ArrowUp"))
        pitch += 0.01;
};
const loop = () => {
    logic();
    draw();
    requestAnimationFrame(loop);
};
loop();
document.body.addEventListener("keydown", e => {
    pressedButtons.add(e.key);
});
document.body.addEventListener("keyup", e => {
    pressedButtons.delete(e.key);
});
export {};
//# sourceMappingURL=script.js.map