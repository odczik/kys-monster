const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');

let scale = 20;

let midPoint = {x: canvas.width / 2, y: canvas.height / 2};

let velocity = 0.5;

let resolution = 15;
let points = [];

let visualStyle = 0;

const logic = () => {
    if(points.length === 0){
        const offset = canvas.width / resolution;
        for (let i = offset / 2; i < canvas.width; i+=offset){
            points.push({x: i, y: canvas.height / 3, velocity: 0});
        }
    }

    points.forEach(point => {
        point.y += point.velocity;

        point.velocity *= Math.round(Math.random() * (99 - 97) + 97) / 100;

        if(point.y > midPoint.y + scale/2){
            point.velocity -= velocity;
        } else if(point.y < midPoint.y - scale/2){
            point.velocity += velocity;
        }
    });

    ctx.beginPath();
    points.forEach((point, i) => {
        switch(visualStyle % 3){
            case 0:
                if(i === 0){
                    ctx.moveTo(point.x, point.y);
                } else {
                    ctx.lineTo(point.x, point.y);
                }
                ctx.lineWidth = 2;
                ctx.strokeStyle = 'red';
                ctx.stroke();
                break;
            case 1:
                ctx.beginPath();
                ctx.fillStyle = 'blue';
                ctx.lineWidth = 1;
                ctx.strokeStyle = 'black';
                ctx.arc(point.x, point.y, scale / 2, 0, Math.PI * 2);
                ctx.fill();
                ctx.stroke();
                ctx.closePath();
                break;
            case 2:
                if(i === 0){
                    ctx.moveTo(point.x, point.y);
                } else {
                    ctx.lineTo(point.x, point.y);
                }
                ctx.lineWidth = 2;
                ctx.strokeStyle = 'red';
                ctx.stroke();
                
                ctx.beginPath();
                ctx.fillStyle = 'blue';
                ctx.lineWidth = 1;
                ctx.strokeStyle = 'black';
                ctx.arc(point.x, point.y, scale / 2, 0, Math.PI * 2);
                ctx.fill();
                ctx.stroke();
                ctx.closePath();
                break;
        }
    });
}

const update = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    logic();

    if(frames % 30 === 0){
        points.forEach(point => {
            point.velocity += Math.random() * (velocity / 2 - velocity / 4) + velocity / 4;
        });
    }
}

canvas.addEventListener('click', (e) => {
    const clickX = e.x - canvas.getBoundingClientRect().left;
    const clickY = e.y - canvas.getBoundingClientRect().top;
    
    points.forEach(point => {
        if(clickX > point.x - scale*2 && clickX < point.x + scale*2){
            point.velocity += velocity * 10;
        }
    });
})

const changeStyle = () => {
    visualStyle++;
}
document.getElementById("resolution").addEventListener('change', (e) => {
    resolution = parseInt(e.target.value);
    points = [];
    console.log(resolution);
})



let frames = 0;
let updateTook = 0;
const updateHandler = () => {
    updateTook = Date.now();
    update();
    updateTook = Date.now() - updateTook;

    document.getElementById("updateTook").innerText = "Update took: " + updateTook + "ms";
    
    frames++;
}

var frameCount = 0;
var fps, fpsInterval, startTime, now, then, elapsed;
startAnimating(60);
function startAnimating(fps) {
    fpsInterval = 1000 / fps;
    then = Date.now();
    startTime = then;
    animate();
}
function animate() {
    requestAnimationFrame(animate);
    now = Date.now();
    elapsed = now - then;
    if (elapsed > fpsInterval) {
        then = now - (elapsed % fpsInterval);

        updateHandler();
    }
}

// fps counter
const refreshRate = 0.1;
let frameTimer = refreshRate;
setInterval(() => {
    const fps = (frames / frameTimer).toFixed(2);
    document.getElementById("fps").innerText = "FPS: " + fps;

    frameTimer+=refreshRate;
    if(frameTimer > 10){
        frameTimer = refreshRate;
        frames = 0;
    }
}, refreshRate * 1000)