const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');

let scale = 20;

let midPoint = {x: canvas.width / 2, y: canvas.height / 2};

let velocity = 0.5;

let resolution = 10;
let points = [];

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

    points.forEach(point => {
        ctx.beginPath();
        ctx.fillStyle = 'blue';
        ctx.strokeStyle = 'black';
        ctx.arc(point.x, point.y, scale / 2, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
    });
}

const update = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    logic();

    requestAnimationFrame(update);
}
update();

canvas.addEventListener('click', (e) => {
    const clickX = e.x - canvas.getBoundingClientRect().left;
    const clickY = e.y - canvas.getBoundingClientRect().top;
    
    points.forEach(point => {
        if(clickX > point.x - scale/2 && clickX < point.x + scale/2){
            point.velocity += velocity * 10;
        }
    });
})