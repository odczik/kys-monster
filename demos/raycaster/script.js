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

let frames = [];
let lastFrameTime = performance.now();
function update() {
    let currentFrameTime = performance.now();
    let fps = 1000 / (currentFrameTime - lastFrameTime);
    lastFrameTime = currentFrameTime;

    frames.push(fps);
    if (frames.length > 100) frames.shift();
    let avg = frames.reduce((a, b) => a + b) / frames.length;
    document.getElementById('fps').innerText = "FPS: " + Math.floor(fps) + " / " + Math.floor(avg);

    tdCtx.clearRect(0, 0, tdCanvas.width, tdCanvas.height);
    fpCtx.clearRect(0, 0, fpCanvas.width, fpCanvas.height);
    
    renderMap();

    player.update(buttons);
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

const fishEyeCheckbox = document.getElementById('fisheye');
fishEyeCheckbox.addEventListener('change', () => {
    player.fishEyeFix = fishEyeCheckbox.checked;
});
const fovSlider = document.getElementById('fov');
const fovValue = document.getElementById('fov-value');
fovSlider.addEventListener('input', () => {
    player.setFov(fovSlider.value);
    fovValue.innerText = "FOV: " + player.FOV;
    if(player.FOV > 180){
        player.fishEyeFix = false;
        fishEyeCheckbox.checked = false;
    }
});
const raysSlider = document.getElementById('rays');
const raysValue = document.getElementById('rays-value');
raysSlider.addEventListener('input', () => {
    player.setRays(raysSlider.value);
    raysValue.innerText = "Rays: " + player.rays;
});
const collisionsCheckbox = document.getElementById('collisions');
collisionsCheckbox.addEventListener('change', () => {
    player.collisions = collisionsCheckbox.checked;
});
const texturesCheckbox = document.getElementById('textures');
texturesCheckbox.addEventListener('change', () => {
    player.textures = texturesCheckbox.checked;
});


tdCanvas.addEventListener('click', (e) => {
    let x = Math.floor(e.offsetX / mapS);
    let y = Math.floor(e.offsetY / mapS);
    if (map[y][x] === 0) map[y][x] = 1;
    else map[y][x] = 0;
});

const resetButton = document.getElementById('reset');
resetButton.addEventListener('click', () => {
    player.setRays(100)
    const interval = setInterval(() => {
        if(player.rays == 1){
            map = [
                [1,1,1,1,1,1,1,1],
                [1,0,0,0,0,0,0,1],
                [1,0,1,0,0,0,0,1],
                [1,0,1,0,0,0,0,1],
                [1,0,0,0,0,0,0,1],
                [1,0,0,0,0,1,0,1],
                [1,0,0,0,0,0,0,1],
                [1,1,1,1,1,1,1,1]
            ];
            player.FOV = 60;
            fovSlider.value = 60;
            fovValue.innerText = "FOV: 60";
            player.fishEyeFix = true;
            fishEyeCheckbox.checked = true;
            player.collisions = true;
            collisionsCheckbox.checked = true;
            player.textures = true;
            texturesCheckbox.checked = true;
            player.x = 2 * mapS + mapS / 2;
            player.y = 5 * mapS + mapS / 2;
            player.direction = 0;
            player.speed = 2;
            player.turnSpeed = 3;
            player.size = 10;
            player.radius = 5;
        
            player.setRays(480);
            raysValue.innerText = "Rays: " +  player.rays;

            clearInterval(interval);
            return;
        }
        player.setRays(player.rays - 1);
        raysValue.innerText = "Rays: " +  player.rays;
    }, player.rays / 10);
});