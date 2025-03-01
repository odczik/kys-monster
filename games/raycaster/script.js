const tdCanvas = document.getElementById('top-down-canvas');
const tdCtx = tdCanvas.getContext('2d');
const fpCanvas = document.getElementById('first-person-canvas');
const fpCtx = fpCanvas.getContext('2d');

let buttons = [];

let size = 8;
let mapXsize = size,
    mapYsize = size,
    mapS = 64;
let map = [
    [1,1,1,1,1,1,1,1],
    [1,0,0,0,0,0,0,1],
    [1,0,1,0,0,0,0,1],
    [1,0,1,0,0,0,0,1],
    [1,0,0,0,0,0,0,1],
    [1,0,0,0,0,1,0,1],
    [1,0,0,0,0,0,0,1],
    [1,1,1,1,1,1,1,1]
];

const player = new Player(2 * mapS + mapS / 2, 5 * mapS + mapS / 2, tdCtx, fpCtx);

const renderMap = () => {
    for (let y = 0; y < mapYsize; y++) {
        for (let x = 0; x < mapXsize; x++) {
            if (map[y][x] === 1) tdCtx.fillStyle = 'black';
            else tdCtx.fillStyle = 'lightgrey';
            tdCtx.fillRect(x * mapS + 1, y * mapS + 1, mapS - 2, mapS - 2);
        }
    }
}

function update() {
    tdCtx.clearRect(0, 0, tdCanvas.width, tdCanvas.height);
    fpCtx.clearRect(0, 0, fpCanvas.width, fpCanvas.height);

    player.update(buttons);

    renderMap();
    player.render();

    requestAnimationFrame(update);
}
update();

document.addEventListener('keydown', (e) => {
    buttons[e.key] = true;
});
document.addEventListener('keyup', (e) => {
    buttons[e.key] = false;
});

const fovSlider = document.getElementById('fov');
const fovValue = document.getElementById('fov-value');
fovSlider.addEventListener('input', () => {
    player.FOV = fovSlider.value;
    player.DR = (player.FOV / player.rays) * Math.PI / 180;
    fovValue.innerText = "FOV: " + player.FOV;
});
const raysSlider = document.getElementById('rays');
const raysValue = document.getElementById('rays-value');
raysSlider.addEventListener('input', () => {
    player.rays = raysSlider.value;
    player.DR = (player.FOV / player.rays) * Math.PI / 180;
    raysValue.innerText = "Rays: " + player.rays;
});