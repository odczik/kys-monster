const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');

var scale = 60;
var force = 10;
var airResistance = 0.025;

var ball = new Ball();

const update = () => {
    canvas.width = window.innerWidth - 10;
    canvas.height = window.innerHeight - 10;
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    ball.update();
    ball.draw();
}

let timer = 0;
setInterval(() => {
    if(Date.now() - timer >= 1000 / 60){
        update();
        timer = Date.now();
    }
}, 1);

document.getElementById("scaleSlider").addEventListener("input", e => {
    scale = e.target.value;
    document.getElementById("scaleTxt").innerText = scale;
})
document.getElementById("forceSlider").addEventListener("change", e => {
    force = e.target.value;
})
document.getElementById("airSlider").addEventListener("input", e => {
    console.log(e.target.value / 1000);
    airResistance = e.target.value / 1000;
    document.getElementById("airTxt").innerText = airResistance;
})

document.addEventListener('keydown', (e) => {
    if(e.key === ' ' || e.key === 'ArrowUp' || e.key === 'w'){
        ball.velocityY += -force;
    }
    if(e.key === 'ArrowDown' || e.key === 's'){
        ball.velocityY += force;
    }
    if(e.key === 'ArrowLeft' || e.key === 'a'){
        ball.velocityX += -force;
    }
    if(e.key === 'ArrowRight' || e.key === 'd'){
        ball.velocityX += force;
    }
    if(e.key === 'r'){
        ball.velocityX = 0;
        ball.velocityY = 0;
    }
})
