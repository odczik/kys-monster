const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');

var scale = 60;

var ball = new Ball();

const update = () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
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

document.getElementById("slider").addEventListener("input", e => {
    scale = e.target.value;
})

document.addEventListener('keydown', (e) => {
    if(e.key === ' ' || e.key === 'ArrowUp' || e.key === 'w'){
        ball.velocityY += -10;
    }
    if(e.key === 'ArrowDown' || e.key === 's'){
        ball.velocityY += 10;
    }
    if(e.key === 'ArrowLeft' || e.key === 'a'){
        ball.velocityX += -5;
    }
    if(e.key === 'ArrowRight' || e.key === 'd'){
        ball.velocityX += 5;
    }
    if(e.key === 'r'){
        ball.velocityX = 0;
        ball.velocityY = 0;
    }
})
