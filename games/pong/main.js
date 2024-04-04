/** @type {HTMLCanvasElement} */

const canvas = document.querySelector('canvas')
const ctx = canvas.getContext('2d')
const scale = 30

canvas.height = 20 * scale
canvas.width = 30 * scale

let keysDown = [];
let debug = false;
let caps = false;

var speed = scale / 10;

var paddle1 = new Paddle({side: "left"});
var paddle2 = new Paddle({side: "right"});
const paddles = [paddle1, paddle2];

var ball = new Ball();


const update = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    ball.update()
    ball.draw()

    paddle1.update()
    paddle1.draw()
    paddle2.update()
    paddle2.draw()
}

setTimeout(() => {
    ball.started = true;
}, 1000);

window.addEventListener("keydown", (e) => {
    if(e.key == "e"){
        debug = !debug;
    }
    if(e.getModifierState("CapsLock")){
       caps = true;
    } else {
        caps = false;
    }
})
window.addEventListener("keydown", e => {
    if(!keysDown.includes(e.key)) keysDown.push(e.key.toLowerCase());
    if(e.key.includes("Arrow")) paddle2.ai = false;
})
window.addEventListener("keyup", e => {
    keysDown.pop(e.key.toLowerCase());
})

let timer = 0;
setInterval(() => {
    if(Date.now() - timer > 1000 / 120){
        update()
        timer = Date.now()
    }
}, 1)