import type { Point3D, Point2D } from "./types.js";

const canvas = document.getElementById('canvas') as HTMLCanvasElement;
const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;

canvas.width = window.innerHeight;
canvas.height = window.innerHeight;

let FOREGROUND = "#00FF00";
const BACKGROUND = "#0F0F0F";
let UI_COLOR = "#006400";
const s: number = 10;

let renderVertices = false;
let renderFaces = true;

let offsetX: number = 0,
    offsetY: number = 0,
    offsetZ: number = 0;
let yaw = 0,
    pitch = 0;

let vertices: Point3D[] = [
    {x: -0.25, y: -0.25, z: 1},
    {x: -0.25, y: 0.25, z: 1},
    {x: 0.25, y: 0.25, z: 1},
    {x: 0.25, y: -0.25, z: 1},
    
    {x: -0.25, y: -0.25, z: 1.5},
    {x: -0.25, y: 0.25, z: 1.5},
    {x: 0.25, y: 0.25, z: 1.5},
    {x: 0.25, y: -0.25, z: 1.5}
];

let faces: number[][] = [
    [0,1,2,3],
    [4,5,6,7],
    [0,4],
    [1,5],
    [2,6],
    [3,7]
]

const rotateCamera = ({x, y, z}: Point3D) => {
    // Inverse rotation for camera (negate angles)
    let cy = Math.cos(-yaw);
    let sy = Math.sin(-yaw);
    let cp = Math.cos(-pitch);
    let sp = Math.sin(-pitch);

    // Yaw rotation (around Y axis)
    let rx = x * cy + z * sy;
    let rz = -x * sy + z * cy;

    // Pitch rotation (around X axis)
    let ry = y * cp - rz * sp;
    rz = y * sp + rz * cp;

    return { x: rx, y: ry, z: rz };
}

const offsetAndRotate = (p: Point3D) => {
    // First apply camera offset (translate world relative to camera)
    const translated = {
        x: p.x - offsetX,
        y: p.y - offsetY,
        z: p.z - offsetZ
    };
    
    // Then rotate from camera's perspective
    return rotateCamera(translated);
}

const project = ({x, y, z}: Point3D) => {
    return {
        x: x/z,
        y: y/z,
        z
    }
}

const remap = ({x, y}: Point2D) => {
    return {
        x: (x + 1) / 2 * canvas.width,
        y: (1 - (y + 1) / 2) * canvas.height
    }
}

const drawPoint = ({x, y, z}: Point3D) => {
    // Add offset and rotation
    const offsetted: Point3D = offsetAndRotate({x, y, z});

    // Project
    const projected: Point3D = project(offsetted);

    // Remap to -1 ... 1
    const remapped: Point2D = remap(projected)

    // Draw the point
    ctx.fillStyle = FOREGROUND;
    ctx.fillRect(remapped.x - s/2, remapped.y - s/2, s, s)
}

const drawFace = (face: number[]) => {
    ctx.strokeStyle = FOREGROUND;
    ctx.beginPath();
    for(let i = 0; i <= face.length; ++i){
        // Add offset and rotation
        const offsetted: Point3D = offsetAndRotate(vertices[face[i % face.length]]);

        // Project
        const projected: Point3D = project(offsetted);

        // Remap to -1 ... 1
        const remapped: Point2D = remap(projected)

        // Draw line
        if(i == 0) ctx.moveTo(remapped.x, remapped.y);
        else ctx.lineTo(remapped.x, remapped.y);

        ctx.stroke();
    }
    ctx.closePath();
}

const draw = () => {
    // Clear canvas
    ctx.fillStyle = BACKGROUND;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Render vertices
    if(renderVertices) {
        vertices.forEach(vertex => {
            drawPoint(vertex);
        })
    }

    // Render faces
    if(renderFaces) {
        faces.forEach(face => {
            drawFace(face);
        })
    }
}

let pressedButtons: Set<string> = new Set();
const logic = () => {
    const speed = 0.01;
    
    // Calculate forward and right vectors based on yaw
    const forward = {
        x: Math.sin(yaw),
        z: Math.cos(yaw)
    };
    const right = {
        x: Math.cos(yaw),
        z: -Math.sin(yaw)
    };
    
    // Move relative to camera rotation
    if(pressedButtons.has("w")) {
        offsetX += forward.x * speed;
        offsetZ += forward.z * speed;
    }
    if(pressedButtons.has("s")) {
        offsetX -= forward.x * speed;
        offsetZ -= forward.z * speed;
    }
    if(pressedButtons.has("d")) {
        offsetX += right.x * speed;
        offsetZ += right.z * speed;
    }
    if(pressedButtons.has("a")) {
        offsetX -= right.x * speed;
        offsetZ -= right.z * speed;
    }
    if(pressedButtons.has("q")) offsetY -= speed;
    if(pressedButtons.has("e")) offsetY += speed;
    
    if(pressedButtons.has("ArrowLeft")) yaw -= 0.02;
    if(pressedButtons.has("ArrowRight")) yaw += 0.02;
    if(pressedButtons.has("ArrowUp")) pitch -= 0.02;
    if(pressedButtons.has("ArrowDown")) pitch += 0.02;
}

const loop = () => {
    logic();
    draw();

    requestAnimationFrame(loop);
}
loop();

document.body.addEventListener("keydown", e => {
    pressedButtons.add(e.key);
})
document.body.addEventListener("keyup", e => {
    pressedButtons.delete(e.key);
})

// Settings checkboxes
const renderVerticesCheckbox = document.getElementById('renderVertices') as HTMLInputElement;
const renderFacesCheckbox = document.getElementById('renderFaces') as HTMLInputElement;

renderVerticesCheckbox.addEventListener('change', () => {
    renderVertices = renderVerticesCheckbox.checked;
});

renderFacesCheckbox.addEventListener('change', () => {
    renderFaces = renderFacesCheckbox.checked;
});

// Color pickers
const foregroundColorPicker = document.getElementById('foregroundColor') as HTMLInputElement;
const uiColorPicker = document.getElementById('uiColor') as HTMLInputElement;

foregroundColorPicker.addEventListener('input', () => {
    FOREGROUND = foregroundColorPicker.value;
});

uiColorPicker.addEventListener('input', () => {
    UI_COLOR = uiColorPicker.value;
    document.body.style.color = UI_COLOR;
    const settings = document.getElementById('settings')!;
    settings.style.borderColor = UI_COLOR;
    canvas.style.borderColor = UI_COLOR;
    const colorInputs = document.querySelectorAll<HTMLInputElement>('#settings input[type="color"]');
    colorInputs.forEach(input => {
        input.style.borderColor = UI_COLOR;
    });
});