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
let locateMode = false;

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

const drawPoint = ({x, y, z}: Point3D, index?: number) => {
    // Add offset and rotation
    const offsetted: Point3D = offsetAndRotate({x, y, z});

    // Project
    const projected: Point3D = project(offsetted);

    // Remap to -1 ... 1
    const remapped: Point2D = remap(projected)

    if(locateMode && index !== undefined) {
        // Draw index number when in locate mode
        ctx.fillStyle = "white";
        ctx.font = '21px monospace';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(index.toString(), remapped.x, remapped.y);
    } else {
        // Draw the point rectangle
        ctx.fillStyle = FOREGROUND;
        ctx.fillRect(remapped.x - s/2, remapped.y - s/2, s, s)
    }
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
    if(renderVertices || locateMode) {
        vertices.forEach((vertex, index) => {
            drawPoint(vertex, index);
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

// Geometry Editor
const updateVerticesList = () => {
    const verticesList = document.getElementById('verticesList')!;
    verticesList.innerHTML = '';
    vertices.forEach((vertex, index) => {
        const item = document.createElement('div');
        item.className = 'geometry-item';
        item.innerHTML = `
            <span>${index}: (${vertex.x.toFixed(2)}, ${vertex.y.toFixed(2)}, ${vertex.z.toFixed(2)})</span>
            <div>
                <button onclick="editVertex(${index})">Edit</button>
                <button onclick="removeVertex(${index})">Remove</button>
            </div>
        `;
        verticesList.appendChild(item);
    });
};

const updateFacesList = () => {
    const facesList = document.getElementById('facesList')!;
    facesList.innerHTML = '';
    faces.forEach((face, index) => {
        const item = document.createElement('div');
        item.className = 'geometry-item';
        item.innerHTML = `
            <span>${index}: [${face.join(', ')}]</span>
            <button onclick="removeFace(${index})">Remove</button>
        `;
        facesList.appendChild(item);
    });
};

(window as any).removeVertex = (index: number) => {
    vertices.splice(index, 1);
    // First, filter out faces that reference the removed vertex
    faces = faces.filter(face => face.indexOf(index) === -1);
    // Then, update remaining faces to decrement indices greater than removed index
    faces = faces.map(face => face.map(i => i > index ? i - 1 : i));
    updateVerticesList();
    updateFacesList();
};

(window as any).editVertex = (index: number) => {
    const vertex = vertices[index];
    const newX = prompt(`Edit X coordinate (current: ${vertex.x}):`, vertex.x.toString());
    const newY = prompt(`Edit Y coordinate (current: ${vertex.y}):`, vertex.y.toString());
    const newZ = prompt(`Edit Z coordinate (current: ${vertex.z}):`, vertex.z.toString());
    
    if (newX !== null && newY !== null && newZ !== null) {
        const x = parseFloat(newX);
        const y = parseFloat(newY);
        const z = parseFloat(newZ);
        
        if (!isNaN(x) && !isNaN(y) && !isNaN(z)) {
            vertices[index] = { x, y, z };
            updateVerticesList();
        }
    }
};

(window as any).removeFace = (index: number) => {
    faces.splice(index, 1);
    updateFacesList();
};

document.getElementById('addVertex')!.addEventListener('click', () => {
    const x = parseFloat((document.getElementById('vertexX') as HTMLInputElement).value);
    const y = parseFloat((document.getElementById('vertexY') as HTMLInputElement).value);
    const z = parseFloat((document.getElementById('vertexZ') as HTMLInputElement).value);
    
    if (!isNaN(x) && !isNaN(y) && !isNaN(z)) {
        vertices.push({ x, y, z });
        updateVerticesList();
    }
});

document.getElementById('addFace')!.addEventListener('click', () => {
    const input = (document.getElementById('faceIndices') as HTMLInputElement).value;
    const indices = input.split(',').map(s => parseInt(s.trim())).filter(n => !isNaN(n) && n >= 0 && n < vertices.length);
    
    if (indices.length >= 2) {
        faces.push(indices);
        updateFacesList();
        (document.getElementById('faceIndices') as HTMLInputElement).value = '';
    }
});

// Initialize lists
updateVerticesList();
updateFacesList();

// Locate button
const locateButton = document.getElementById('locateButton')!;
locateButton.addEventListener('click', () => {
    locateMode = !locateMode;
    locateButton.classList.toggle('active', locateMode);
    locateButton.textContent = locateMode ? 'Exit Locate Mode' : 'Locate Vertices';
});