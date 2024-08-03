const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');

let scale = 20;

let midPoint = {x: canvas.width / 2, y: canvas.height / 2};

let velocity = 0.5;

let resolution = 40;
let points = [];

let visualStyle = 0;

const logic = () => {
    // create points if there are none
    if(points.length === 0){
        const offset = canvas.width / resolution;
        for (let i = 0; i <= canvas.width; i+=offset){
            points.push({x: i, y: canvas.height / 2, velocity: 0});
        }
        points[points.length - 1].x = canvas.width;
    }

    points.forEach(point => {
        // update position based on velocity
        point.y += point.velocity;

        // dampen velocity
        point.velocity *= Math.round(Math.random() * (99 - 97) + 97) / 100;
        //point.velocity *= 0.97;

        // stick to mid point
        if(point.y > midPoint.y + scale/3){
            point.velocity -= velocity;
        } else if(point.y < midPoint.y - scale/3){
            point.velocity += velocity * 0.97;
        }
        if(point.velocity < 0.1 && point.velocity > -0.1){
            point.velocity = 0;
        }
    });

    // get point with the highest velocity
    let highest = points[0];
    points.forEach(point => {
        if(point.velocity > highest.velocity){
            highest = point;
        }
    });
    // get the average velocity
    let average = 0;
    points.forEach(point => {
        average += point.velocity;
    });
    average /= points.length;
}

const draw = () => {
    ctx.beginPath();
    points.forEach((point, i) => {
        switch(visualStyle % 3){
            case 0:
                if(i === 0){
                    ctx.moveTo(point.x, point.y);
                } else {
                    //ctx.lineTo(point.x, point.y);
                    ctx.quadraticCurveTo(points[i - 1].x + (point.x - points[i - 1].x)/2 + points[i - 1].velocity, 
                                        points[i - 1].y+(points[i - 1].velocity), 
                                        point.x, point.y);
                }
                ctx.lineWidth = 3;
                ctx.strokeStyle = 'blue';
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

    function fillBelowLine(points) {
        if (points.length < 2) return; // Need at least two points

        // Begin the path
        ctx.beginPath();

        // Move to the first point
        ctx.moveTo(points[0].x, points[0].y);

        // Draw the line through each point
        points.forEach((point, i) => {
            if(i === 0){
                ctx.moveTo(point.x, point.y);
            } else {
                //ctx.lineTo(point.x, point.y);
                ctx.quadraticCurveTo(points[i - 1].x + (point.x - points[i - 1].x)/2 + points[i - 1].velocity, 
                                    points[i - 1].y+(points[i - 1].velocity), 
                                    point.x, point.y);
            }
        });

        // Extend the line to the bottom edge of the canvas
        ctx.lineTo(points[points.length - 1].x, canvas.height); // Down to the bottom at the last x position
        ctx.lineTo(points[0].x, canvas.height); // Line to the left edge at the bottom
        ctx.lineTo(points[0].x, points[0].y); // Back to the starting point
        ctx.closePath(); // Close the path

        // Set fill color
        ctx.fillStyle = 'rgba(0, 150, 255, 0.5)'; // Semi-transparent blue

        // Fill the shape
        ctx.fill();
    }
    // Draw the filled area under the line
    fillBelowLine(points);
}

const update = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    logic();
    draw();

    if(frames % 30 === 0){
        points.forEach(point => {
            point.velocity += Math.random() * (velocity / 2 - velocity / 4) + velocity / 4;
        });
    }
}

canvas.addEventListener('click', (e) => {
    const clickX = e.x - canvas.getBoundingClientRect().left;
    const clickY = e.y - canvas.getBoundingClientRect().top;

    // get closest point
    const closest = points.reduce((prev, curr) => {
        return (Math.abs(curr.x - clickX) < Math.abs(prev.x - clickX) ? curr : prev);
    });
    const closestIndex = points.indexOf(closest);

    let velocityMultiplier = 30;

    closest.velocity += velocity * velocityMultiplier;

    points.forEach((point, i) => {
        if(i === closestIndex) return;
        const distance = Math.abs(closestIndex - i);
        let distanceMultiplier = (100 - Math.pow(distance, 80/resolution)) / 100;
        if(distanceMultiplier < 0) distanceMultiplier = 0;
        point.velocity += velocity * velocityMultiplier * distanceMultiplier;
    })
})

const changeStyle = () => {
    visualStyle++;
}
document.getElementById("resolution").addEventListener('change', (e) => {
    resolution = parseInt(e.target.value);
    points = [];
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