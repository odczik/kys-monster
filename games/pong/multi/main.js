// Websocket connection

//const address = "ws://192.168.0.236:8080"
const address = "wss://pong-server-n8nb.onrender.com/"

const ws = new WebSocket(address)
var host;

ws.onopen = () => {
  console.log('WebSocket connection with server established.')
}

document.getElementById("hostRoom").addEventListener("click", e => {
    ws.send(JSON.stringify({type: "create"}))
    document.getElementById("multiplayerCont").innerHTML = "<h1 style='color: white;'>Waiting for player...</h1>";
    host = true;
})
document.getElementById("joinRoom").addEventListener("click", e => {
    ws.send(JSON.stringify({type: "rooms"}))
    document.getElementById("multiplayerCont").style.display = "none";
    document.getElementById("roomCont").style.display = "block";
    host = false;
})

ws.onmessage = (message) => {
    const msg = JSON.parse(message.data)
    //console.log(`Received>`, msg)
    switch(msg.type){
        case "room":
            ws.send(JSON.stringify({type: "rooms"}))
            break;
        case "rooms":
            document.getElementById("roomCont").innerHTML = "";
            msg.value.forEach(room => {
                const roomDiv = document.createElement("div");
                roomDiv.classList.add("room");
                roomDiv.innerText = room.id + " " + room.players + "/2";
                roomDiv.addEventListener("click", e => {
                    ws.send(JSON.stringify({type: "join", params: room.id}))
                    document.getElementById("multiplayerCont").style.display = "none";
                    document.getElementById("roomCont").style.display = "block";
                })
                document.getElementById("roomCont").appendChild(roomDiv);
            })
            break;
        case "start":
            document.getElementById("multiplayerCont").style.display = "none";
            document.getElementById("roomCont").style.display = "none";
            document.querySelector("canvas").style.display = "block";
            update();
            break;
        case "update":
            if(msg.value.ball){
                ball.x = msg.value.ball.x;
                ball.y = msg.value.ball.y;

                ball.dirX = msg.value.ball.dirX;
                ball.dirY = msg.value.ball.dirY;

                ball.center = msg.value.ball.center;
                ball.bouncePoint = msg.value.ball.bouncePoint;
                ball.dest = msg.value.ball.dest;
                ball.interceptPoint = msg.value.ball.interceptPoint;

                paddle1.x = msg.value.paddle1.x;
                paddle1.y = msg.value.paddle1.y;

                paddle1.score = msg.value.paddle1.score;

                paddle1.ai = msg.value.paddle1.ai;
            } else {
                paddle2.x = msg.value.paddle2.x;
                paddle2.y = msg.value.paddle2.y;

                paddle2.score = msg.value.paddle2.score;

                paddle2.ai = msg.value.paddle2.ai;
            }
            break;
    }
}

ws.onclose = (message) => {
    console.error("Connection closed:", message.reason)
    window.location.reload();
}


/** @type {HTMLCanvasElement} */

const canvas = document.querySelector('canvas')
const ctx = canvas.getContext('2d')
const scale = 30

canvas.height = 20 * scale
canvas.width = 30 * scale

canvas.style.border = `${scale / 2}px solid white`;

let keysDown = {};
let debug = false;
let caps = false;

const defaultSpeed = scale / 10;
var speed = defaultSpeed;

var paddle1 = new Paddle({side: "left"});
var paddle2 = new Paddle({side: "right"});
const paddles = [paddle1, paddle2];

var ball = new Ball();

const drawCenterLine = () => {
    ctx.strokeStyle = "white"
    ctx.lineWidth = scale / 2
    ctx.beginPath();
    ctx.setLineDash([scale, scale / 2]);
    ctx.moveTo(canvas.width / 2 - scale / 4, 0);
    ctx.lineTo(canvas.width / 2 - scale / 4, canvas.height);
    ctx.stroke();
}

let frames = 0;
const update = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    drawCenterLine();

    if(host){
        ball.update()
        paddle1.update()
    } else {
        paddle2.update()
    }

    ball.draw()
    paddle1.draw()
    paddle2.draw()

    window.requestAnimationFrame(update)
    frames++;

    if(host){
        ws.send(JSON.stringify({type: "update", value: {ball, paddle1}}))
    } else {
        ws.send(JSON.stringify({type: "update", value: {paddle2}}))
    }
}

// fps counter
const refreshRate = 0.5;
let frameTimer = refreshRate;
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

    frameTimer+=refreshRate;
    if(frameTimer > 10){
        frameTimer = refreshRate;
        frames = 0;
    }
}, refreshRate * 1000)

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

// Prevent bullshit on long press
document.addEventListener('touchstart', function(event) {
    console.log(event)
    // Check if the target element is not a checkbox
    if (event.target.localName !== "input" && 
        event.target.localName !== "select" && 
        event.target.localName !== "option") {
        // Prevent default behavior
        event.preventDefault();
    }
}, { passive: false });