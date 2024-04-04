/** @type {HTMLCanvasElement} */

const canvas = document.querySelector('canvas')
const ctx = canvas.getContext('2d')
const scale = 30

canvas.height = 20 * scale
canvas.width = 30 * scale

let keysDown = {};
let debug = false;
let caps = false;

const defaultSpeed = scale / 10;
var speed = defaultSpeed;

var paddle1 = new Paddle({side: "left"});
var paddle2 = new Paddle({side: "right"});
const paddles = [paddle1, paddle2];

var ball = new Ball();

let frames = 0;
const update = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    ball.update()
    ball.draw()

    paddle1.update()
    paddle1.draw()
    paddle2.update()
    paddle2.draw()

    window.requestAnimationFrame(update)
    frames++;
}
update();

// fps counter
let frameTimer = 1;
setInterval(() => {
    const fps = (frames / frameTimer).toFixed(2);
    document.getElementById("fps").innerText = fps + " fps";
    if(fps < 35){
        speed = defaultSpeed * 2;
    } else {
        speed = defaultSpeed;
    }
    if(fps > 70){
        speed = defaultSpeed / 2;
    }

    frameTimer++;
}, 1000)

setTimeout(() => {
    ball.started = true;
}, 1000);

// Key handling
window.addEventListener("keyup", e => {
    keysDown[e.key.toLowerCase()] = false;
    if(e.key.includes("Arrow")) paddle2.ai = false;
})
window.addEventListener("keydown", e => {
    keysDown[e.key.toLowerCase()] = true;
    if(e.key == "e"){
        debug = !debug;
    }
})
document.getElementById("debugCheckbox").addEventListener("change", e => {
    if(e.target.checked){
        debug = true;
    } else {
        debug = false
    }
})

// Prevent bullshit on long press
document.addEventListener('touchstart', function(event) {
    // Check if the target element is not a checkbox
    if (event.target.type !== 'checkbox') {
        // Prevent default behavior
        event.preventDefault();
    }
}, { passive: false });

// Touch handling
window.addEventListener("touchstart", e => {
    e.preventDefault();
    let left;
    let top;
    for(let touch of e.touches){
        if(touch.clientX < window.innerWidth / 2){
            left = true;
        } else {
            left = false;
        }
        if(touch.clientY < window.innerHeight / 2){
            top = true;
        } else {
            top = false;
        }
        
        if(left && top) keysDown["w"] = true;
        if(left && !top) keysDown["s"] = true;
        if(!left && top){ keysDown["arrowup"] = true; paddle2.ai = false; }
        if(!left && !top){ keysDown["arrowdown"] = true; paddle2.ai = false; } 
    }
})
window.addEventListener("touchend", e => {
    let left;
    let top;
    if(e.changedTouches[0].clientX < window.innerWidth / 2){
        left = true;
    } else {
        left = false;
    }
    if(e.changedTouches[0].clientY < window.innerHeight / 2){
        top = true;
    } else {
        top = false;
    }
    
    if(left && top) keysDown["w"] = false;
    if(left && !top) keysDown["s"] = false;
    if(!left && top) keysDown["arrowup"] = false;
    if(!left && !top) keysDown["arrowdown"] = false;
})