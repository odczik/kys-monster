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
let locateMode = false;
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
    { x: 0.25, y: -0.25, z: 1.5 },
    { x: 0.75, y: 0.2, z: 1.25 },
    { x: 0.75, y: 0.185, z: 1.174 }, { x: 0.717, y: 0.185, z: 1.187 }, { x: 0.696, y: 0.185, z: 1.212 }, { x: 0.692, y: 0.185, z: 1.25 }, { x: 0.696, y: 0.185, z: 1.288 }, { x: 0.717, y: 0.185, z: 1.313 }, { x: 0.75, y: 0.185, z: 1.326 }, { x: 0.783, y: 0.185, z: 1.313 }, { x: 0.804, y: 0.185, z: 1.288 }, { x: 0.808, y: 0.185, z: 1.25 }, { x: 0.804, y: 0.185, z: 1.212 }, { x: 0.783, y: 0.185, z: 1.187 },
    { x: 0.75, y: 0.141, z: 1.109 }, { x: 0.678, y: 0.141, z: 1.134 }, { x: 0.630, y: 0.141, z: 1.180 }, { x: 0.609, y: 0.141, z: 1.25 }, { x: 0.630, y: 0.141, z: 1.320 }, { x: 0.678, y: 0.141, z: 1.366 }, { x: 0.75, y: 0.141, z: 1.391 }, { x: 0.822, y: 0.141, z: 1.366 }, { x: 0.870, y: 0.141, z: 1.320 }, { x: 0.891, y: 0.141, z: 1.25 }, { x: 0.870, y: 0.141, z: 1.180 }, { x: 0.822, y: 0.141, z: 1.134 },
    { x: 0.75, y: 0.076, z: 1.065 }, { x: 0.657, y: 0.076, z: 1.098 }, { x: 0.596, y: 0.076, z: 1.163 }, { x: 0.565, y: 0.076, z: 1.25 }, { x: 0.596, y: 0.076, z: 1.337 }, { x: 0.657, y: 0.076, z: 1.402 }, { x: 0.75, y: 0.076, z: 1.435 }, { x: 0.843, y: 0.076, z: 1.402 }, { x: 0.904, y: 0.076, z: 1.337 }, { x: 0.935, y: 0.076, z: 1.25 }, { x: 0.904, y: 0.076, z: 1.163 }, { x: 0.843, y: 0.076, z: 1.098 },
    { x: 0.75, y: 0, z: 1.05 }, { x: 0.647, y: 0, z: 1.087 }, { x: 0.577, y: 0, z: 1.154 }, { x: 0.550, y: 0, z: 1.25 }, { x: 0.577, y: 0, z: 1.346 }, { x: 0.647, y: 0, z: 1.413 }, { x: 0.75, y: 0, z: 1.45 }, { x: 0.853, y: 0, z: 1.413 }, { x: 0.923, y: 0, z: 1.346 }, { x: 0.950, y: 0, z: 1.25 }, { x: 0.923, y: 0, z: 1.154 }, { x: 0.853, y: 0, z: 1.087 },
    { x: 0.75, y: -0.076, z: 1.065 }, { x: 0.657, y: -0.076, z: 1.098 }, { x: 0.596, y: -0.076, z: 1.163 }, { x: 0.565, y: -0.076, z: 1.25 }, { x: 0.596, y: -0.076, z: 1.337 }, { x: 0.657, y: -0.076, z: 1.402 }, { x: 0.75, y: -0.076, z: 1.435 }, { x: 0.843, y: -0.076, z: 1.402 }, { x: 0.904, y: -0.076, z: 1.337 }, { x: 0.935, y: -0.076, z: 1.25 }, { x: 0.904, y: -0.076, z: 1.163 }, { x: 0.843, y: -0.076, z: 1.098 },
    { x: 0.75, y: -0.141, z: 1.109 }, { x: 0.678, y: -0.141, z: 1.134 }, { x: 0.630, y: -0.141, z: 1.180 }, { x: 0.609, y: -0.141, z: 1.25 }, { x: 0.630, y: -0.141, z: 1.320 }, { x: 0.678, y: -0.141, z: 1.366 }, { x: 0.75, y: -0.141, z: 1.391 }, { x: 0.822, y: -0.141, z: 1.366 }, { x: 0.870, y: -0.141, z: 1.320 }, { x: 0.891, y: -0.141, z: 1.25 }, { x: 0.870, y: -0.141, z: 1.180 }, { x: 0.822, y: -0.141, z: 1.134 },
    { x: 0.75, y: -0.185, z: 1.174 }, { x: 0.717, y: -0.185, z: 1.187 }, { x: 0.696, y: -0.185, z: 1.212 }, { x: 0.692, y: -0.185, z: 1.25 }, { x: 0.696, y: -0.185, z: 1.288 }, { x: 0.717, y: -0.185, z: 1.313 }, { x: 0.75, y: -0.185, z: 1.326 }, { x: 0.783, y: -0.185, z: 1.313 }, { x: 0.804, y: -0.185, z: 1.288 }, { x: 0.808, y: -0.185, z: 1.25 }, { x: 0.804, y: -0.185, z: 1.212 }, { x: 0.783, y: -0.185, z: 1.187 },
    { x: 0.75, y: -0.2, z: 1.25 }
];
let faces = [
    [0, 1, 2, 3], [4, 5, 6, 7], [0, 4], [1, 5], [2, 6], [3, 7],
    [8, 9, 10], [8, 10, 11], [8, 11, 12], [8, 12, 13], [8, 13, 14], [8, 14, 15], [8, 15, 16], [8, 16, 17], [8, 17, 18], [8, 18, 19], [8, 19, 20], [8, 20, 9],
    [9, 21, 22, 10], [10, 22, 23, 11], [11, 23, 24, 12], [12, 24, 25, 13], [13, 25, 26, 14], [14, 26, 27, 15], [15, 27, 28, 16], [16, 28, 29, 17], [17, 29, 30, 18], [18, 30, 31, 19], [19, 31, 32, 20], [20, 32, 21, 9],
    [21, 33, 34, 22], [22, 34, 35, 23], [23, 35, 36, 24], [24, 36, 37, 25], [25, 37, 38, 26], [26, 38, 39, 27], [27, 39, 40, 28], [28, 40, 41, 29], [29, 41, 42, 30], [30, 42, 43, 31], [31, 43, 44, 32], [32, 44, 33, 21],
    [33, 45, 46, 34], [34, 46, 47, 35], [35, 47, 48, 36], [36, 48, 49, 37], [37, 49, 50, 38], [38, 50, 51, 39], [39, 51, 52, 40], [40, 52, 53, 41], [41, 53, 54, 42], [42, 54, 55, 43], [43, 55, 56, 44], [44, 56, 45, 33],
    [45, 57, 58, 46], [46, 58, 59, 47], [47, 59, 60, 48], [48, 60, 61, 49], [49, 61, 62, 50], [50, 62, 63, 51], [51, 63, 64, 52], [52, 64, 65, 53], [53, 65, 66, 54], [54, 66, 67, 55], [55, 67, 68, 56], [56, 68, 57, 45],
    [57, 69, 70, 58], [58, 70, 71, 59], [59, 71, 72, 60], [60, 72, 73, 61], [61, 73, 74, 62], [62, 74, 75, 63], [63, 75, 76, 64], [64, 76, 77, 65], [65, 77, 78, 66], [66, 78, 79, 67], [67, 79, 80, 68], [68, 80, 69, 57],
    [69, 81, 82, 70], [70, 82, 83, 71], [71, 83, 84, 72], [72, 84, 85, 73], [73, 85, 86, 74], [74, 86, 87, 75], [75, 87, 88, 76], [76, 88, 89, 77], [77, 89, 90, 78], [78, 90, 91, 79], [79, 91, 92, 80], [80, 92, 81, 69],
    [93, 82, 81], [93, 83, 82], [93, 84, 83], [93, 85, 84], [93, 86, 85], [93, 87, 86], [93, 88, 87], [93, 89, 88], [93, 90, 89], [93, 91, 90], [93, 92, 91], [93, 81, 92]
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
const drawPoint = ({ x, y, z }, index) => {
    const offsetted = offsetAndRotate({ x, y, z });
    const projected = project(offsetted);
    const remapped = remap(projected);
    if (locateMode && index !== undefined) {
        ctx.fillStyle = "white";
        ctx.font = '21px monospace';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(index.toString(), remapped.x, remapped.y);
    }
    else {
        ctx.fillStyle = FOREGROUND;
        ctx.fillRect(remapped.x - s / 2, remapped.y - s / 2, s, s);
    }
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
    if (renderVertices || locateMode) {
        vertices.forEach((vertex, index) => {
            drawPoint(vertex, index);
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
        yaw -= 0.02;
    if (pressedButtons.has("ArrowRight"))
        yaw += 0.02;
    if (pressedButtons.has("ArrowUp"))
        pitch -= 0.02;
    if (pressedButtons.has("ArrowDown"))
        pitch += 0.02;
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
    document.documentElement.style.setProperty('--ui-color', UI_COLOR);
});
const updateVerticesList = () => {
    const verticesList = document.getElementById('verticesList');
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
    const facesList = document.getElementById('facesList');
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
window.removeVertex = (index) => {
    vertices.splice(index, 1);
    faces = faces.filter(face => face.indexOf(index) === -1);
    faces = faces.map(face => face.map(i => i > index ? i - 1 : i));
    updateVerticesList();
    updateFacesList();
};
window.editVertex = (index) => {
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
window.removeFace = (index) => {
    faces.splice(index, 1);
    updateFacesList();
};
document.getElementById('addVertex').addEventListener('click', () => {
    const x = parseFloat(document.getElementById('vertexX').value);
    const y = parseFloat(document.getElementById('vertexY').value);
    const z = parseFloat(document.getElementById('vertexZ').value);
    if (!isNaN(x) && !isNaN(y) && !isNaN(z)) {
        vertices.push({ x, y, z });
        updateVerticesList();
    }
});
document.getElementById('addFace').addEventListener('click', () => {
    const input = document.getElementById('faceIndices').value;
    const indices = input.split(',').map(s => parseInt(s.trim())).filter(n => !isNaN(n) && n >= 0 && n < vertices.length);
    if (indices.length >= 2) {
        faces.push(indices);
        updateFacesList();
        document.getElementById('faceIndices').value = '';
    }
});
updateVerticesList();
updateFacesList();
const locateButton = document.getElementById('locateButton');
locateButton.addEventListener('click', () => {
    locateMode = !locateMode;
    locateButton.classList.toggle('active', locateMode);
    locateButton.textContent = locateMode ? 'Exit Locate Mode' : 'Locate Vertices';
});
export {};
//# sourceMappingURL=script.js.map