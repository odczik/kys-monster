/** @type {HTMLCanvasElement} */

const canvas = document.querySelector('canvas')
const ctx = canvas.getContext('2d')
const scale = 30

canvas.height = 20 * scale
canvas.width = 30 * scale

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
    if(e.key.includes("Arrow") || e.key=="w" || e.key=="a" || e.key=="s" || e.key=="d"){
        let direction = e.key.replace("Arrow", "")
        switch(direction){
            case "w":
                paddle1.y -= speed * 2;
                break;
            case "s":
                paddle1.y += speed * 2;
                break;
            case "Up":
                paddle2.ai = 0;
                paddle2.y -= speed * 2;
                break;
            case "Down":
                paddle2.ai = 0;
                paddle2.y += speed * 2;
                break;
        }
    }
    if(e.getModifierState("CapsLock")){
       caps = true;
    } else {
        caps = false;
    }
})

let timer = 0;
setInterval(() => {
    if(Date.now() - timer > 1000 / 120){
        update()
        timer = Date.now()
    }
}, 1)