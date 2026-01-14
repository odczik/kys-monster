import type { Point3D, Point2D } from "./types.js";

const canvas = document.getElementById('canvas') as HTMLCanvasElement;
const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const FOREGROUND = "#00FF00";
const BACKGROUND = "#0F0F0F";
const s: number = 10;

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
    
    {x: -0.25, y: -0.25, z: 1.25},
    {x: -0.25, y: 0.25, z: 1.25},
    {x: 0.25, y: 0.25, z: 1.25},
    {x: 0.25, y: -0.25, z: 1.25}
];

let faces: number[][] = [
    [0,1,2,3],
    [4,5,6,7],
    [0,4],
    [1,5],
    [2,6],
    [3,7]
]

const rotateEuler = ({x, y, z}: Point3D) => {
    let c: Point3D = {
        x: Math.cos(pitch),
        y: Math.cos(yaw),
        z
    };
    let s = {
        x: Math.sin(pitch),
        y: Math.sin(yaw),
        z
    };

    let r: Point3D = {x, y, z};

    r = {
        x: r.x * c.y + r.z * s.y,
        y,
        z: -r.x * s.y + r.z * c.y
    }

    return r;
}

const offsetAndRotate = (p: Point3D) => {
    const c: Point3D = {
        x: -offsetX,
        y: -offsetY,
        z: -offsetZ
    }

    return {
        x: p.x + offsetX,
        y: p.y + offsetY,
        z: p.z + offsetZ
    }
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
    vertices.forEach(vertex => {
        drawPoint(vertex);
    })

    // Render faces
    faces.forEach(face => {
        drawFace(face);
    })
}

let pressedButtons: Set<string> = new Set();
const logic = () => {
    if(pressedButtons.has("w")) offsetZ -= 0.01;
    if(pressedButtons.has("s")) offsetZ += 0.01;
    if(pressedButtons.has("d")) offsetX -= 0.01;
    if(pressedButtons.has("a")) offsetX += 0.01;
    if(pressedButtons.has("e")) offsetY -= 0.01;
    if(pressedButtons.has("q")) offsetY += 0.01;
    
    if(pressedButtons.has("ArrowLeft")) yaw -= 0.01;
    if(pressedButtons.has("ArrowRight")) yaw += 0.01;
    if(pressedButtons.has("ArrowDown")) pitch -= 0.01;
    if(pressedButtons.has("ArrowUp")) pitch += 0.01;
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