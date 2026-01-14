const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerHeight;
canvas.height = window.innerHeight;
let FOREGROUND = "#00FF00";
const BACKGROUND = "#0F0F0F";
let UI_COLOR = "#006400";
const s = 10;
let renderVertices = false;
let renderFaces = true;
let offsetX = 0, offsetY = 0, offsetZ = 0;
let yaw = 0, pitch = 0;
let vertices = [
    { x: -0.25, y: -0.25, z: 1 },
    { x: -0.25, y: 0.25, z: 1 },
    { x: 0.25, y: 0.25, z: 1 },
    { x: 0.25, y: -0.25, z: 1 },
    { x: -0.25, y: -0.25, z: 1.5 },
    { x: -0.25, y: 0.25, z: 1.5 },
    { x: 0.25, y: 0.25, z: 1.5 },
    { x: 0.25, y: -0.25, z: 1.5 }
];
let faces = [
    [0, 1, 2, 3],
    [4, 5, 6, 7],
    [0, 4],
    [1, 5],
    [2, 6],
    [3, 7]
];
const rotateCamera = ({ x, y, z }) => {
    let cy = Math.cos(-yaw);
    let sy = Math.sin(-yaw);
    let cp = Math.cos(-pitch);
    let sp = Math.sin(-pitch);
    let rx = x * cy + z * sy;
    let rz = -x * sy + z * cy;
    let ry = y * cp - rz * sp;
    rz = y * sp + rz * cp;
    return { x: rx, y: ry, z: rz };
};
const offsetAndRotate = (p) => {
    const translated = {
        x: p.x - offsetX,
        y: p.y - offsetY,
        z: p.z - offsetZ
    };
    return rotateCamera(translated);
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
    if (renderVertices) {
        vertices.forEach(vertex => {
            drawPoint(vertex);
        });
    }
    if (renderFaces) {
        faces.forEach(face => {
            drawFace(face);
        });
    }
};
let pressedButtons = new Set();
const logic = () => {
    const speed = 0.01;
    const forward = {
        x: Math.sin(yaw),
        z: Math.cos(yaw)
    };
    const right = {
        x: Math.cos(yaw),
        z: -Math.sin(yaw)
    };
    if (pressedButtons.has("w")) {
        offsetX += forward.x * speed;
        offsetZ += forward.z * speed;
    }
    if (pressedButtons.has("s")) {
        offsetX -= forward.x * speed;
        offsetZ -= forward.z * speed;
    }
    if (pressedButtons.has("d")) {
        offsetX += right.x * speed;
        offsetZ += right.z * speed;
    }
    if (pressedButtons.has("a")) {
        offsetX -= right.x * speed;
        offsetZ -= right.z * speed;
    }
    if (pressedButtons.has("q"))
        offsetY -= speed;
    if (pressedButtons.has("e"))
        offsetY += speed;
    if (pressedButtons.has("ArrowLeft"))
        yaw -= 0.01;
    if (pressedButtons.has("ArrowRight"))
        yaw += 0.01;
    if (pressedButtons.has("ArrowUp"))
        pitch -= 0.01;
    if (pressedButtons.has("ArrowDown"))
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
const renderVerticesCheckbox = document.getElementById('renderVertices');
const renderFacesCheckbox = document.getElementById('renderFaces');
renderVerticesCheckbox.addEventListener('change', () => {
    renderVertices = renderVerticesCheckbox.checked;
});
renderFacesCheckbox.addEventListener('change', () => {
    renderFaces = renderFacesCheckbox.checked;
});
const foregroundColorPicker = document.getElementById('foregroundColor');
const uiColorPicker = document.getElementById('uiColor');
foregroundColorPicker.addEventListener('input', () => {
    FOREGROUND = foregroundColorPicker.value;
});
uiColorPicker.addEventListener('input', () => {
    UI_COLOR = uiColorPicker.value;
    document.body.style.color = UI_COLOR;
    const settings = document.getElementById('settings');
    settings.style.borderColor = UI_COLOR;
    canvas.style.borderColor = UI_COLOR;
    const colorInputs = document.querySelectorAll('#settings input[type="color"]');
    colorInputs.forEach(input => {
        input.style.borderColor = UI_COLOR;
    });
});
export {};
//# sourceMappingURL=script.js.map