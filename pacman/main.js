/** @type {HTMLCanvasElement} */

const canvas = document.getElementById("canvas")
const ctx = canvas.getContext('2d')
const scale = 30

canvas.height = 31 * scale
canvas.width = 28 * scale

const rows = canvas.height / scale
const cols = canvas.width / scale

let score = 0;

const matrix = [
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
    [1,2,2,2,2,2,2,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,2,1,1,1,1,2,1,1,1,1,1,0,1,1,0,1,1,1,1,1,0,1,1,1,1,0,1],
    [1,2,1,1,1,1,2,1,1,1,1,1,0,1,1,0,1,1,1,1,1,0,1,1,1,1,0,1],
    [1,2,1,1,1,1,2,1,1,1,1,1,0,1,1,0,1,1,1,1,1,0,1,1,1,1,0,1],
    [1,2,2,2,2,2,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,2,1,1,1,1,2,1,1,0,1,1,1,1,1,1,1,1,0,1,1,0,1,1,1,1,0,1],
    [1,2,1,1,1,1,2,1,1,0,1,1,1,1,1,1,1,1,0,1,1,0,1,1,1,1,0,1],
    [1,2,2,2,2,2,2,1,1,0,0,0,0,1,1,0,0,0,0,1,1,0,0,0,0,0,0,1],
    [1,1,1,1,1,1,2,1,1,1,1,1,0,1,1,0,1,1,1,1,1,0,1,1,1,1,1,1],
    [0,0,0,0,0,1,2,1,1,1,1,1,0,1,1,0,1,1,1,1,1,0,1,0,0,0,0,0],
    [0,0,0,0,0,1,2,1,1,0,0,0,0,0,0,0,0,0,0,1,1,0,1,0,0,0,0,0],
    [0,0,0,0,0,1,2,1,1,0,1,1,1,0,0,1,1,1,0,1,1,0,1,0,0,0,0,0],
    [1,1,1,1,1,1,2,1,1,0,1,0,0,0,0,0,0,1,0,1,1,0,1,1,1,1,1,1],
    [1,0,0,0,0,0,2,0,0,0,1,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,1], 
    [1,1,1,1,1,1,2,1,1,0,1,0,0,0,0,0,0,1,0,1,1,0,1,1,1,1,1,1],
    [0,0,0,0,0,1,2,1,1,0,1,1,1,1,1,1,1,1,0,1,1,0,1,0,0,0,0,0],
    [0,0,0,0,0,1,2,1,1,0,0,0,0,0,0,0,0,0,0,1,1,0,1,0,0,0,0,0],
    [0,0,0,0,0,1,2,1,1,0,1,1,1,1,1,1,1,1,0,1,1,0,1,0,0,0,0,0],
    [1,1,1,1,1,1,2,1,1,0,1,1,1,1,1,1,1,1,0,1,1,0,1,1,1,1,1,1],
    [1,0,0,0,0,0,2,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,1,1,1,1,2,1,1,1,1,1,0,1,1,0,1,1,1,1,1,0,1,1,1,1,0,1],
    [1,0,1,1,1,1,2,1,1,1,1,1,0,1,1,0,1,1,1,1,1,0,1,1,1,1,0,1],
    [1,0,0,0,1,1,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,1],
    [1,1,1,0,1,1,2,1,1,0,1,1,1,1,1,1,1,1,0,1,1,0,1,1,0,1,1,1],
    [1,1,1,0,1,1,2,1,1,0,1,1,1,1,1,1,1,1,0,1,1,0,1,1,0,1,1,1],
    [1,0,0,0,0,0,2,1,1,0,0,0,0,1,1,0,0,0,0,1,1,0,0,0,0,0,0,1],
    [1,0,1,1,1,1,1,1,1,1,1,1,0,1,1,0,1,1,1,1,1,1,1,1,1,1,0,1],
    [1,0,1,1,1,1,1,1,1,1,1,1,0,1,1,0,1,1,1,1,1,1,1,1,1,1,0,1],
    [1,0,0,0,0,0,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
]

var pacman = new Pacman()

const drawMap = () => {
    matrix.forEach((row, rowI) => {
        row.forEach((col, colI) => {
            switch(col){
                case 1:
                    ctx.fillStyle = "#fff";
                    ctx.fillRect(colI * scale, rowI * scale, scale, scale);
                    break;
                case 2:
                    ctx.fillStyle = "#ff0";
                    ctx.fillRect((colI * scale) + ((scale - (scale / 5)) / 2), (rowI * scale) + ((scale - (scale / 5)) / 2), scale / 5, scale / 5);
                    break;
                
            }
        })
    })
}

const update = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    pacman.update()
    pacman.draw()

    if(matrix[pacman.realY][pacman.realX] == 2){
        matrix[pacman.realY][pacman.realX] = 0;
        score++;
    }
    
    drawMap();
}

let interval = setInterval(() => {
    update()
}, 5)

window.addEventListener("keydown", (e) => {
    if(e.key.includes("Arrow") || e.key=="w" || e.key=="a" || e.key=="s" || e.key=="d"){
        let direction = e.key.replace("Arrow", "")
        switch(direction){
            case "w":
            case "Up":
                pacman.nextDir = 0;
                break;
            case "s":
            case "Down":
                pacman.nextDir = 1;
                break;
            case "a":
            case "Left":
                pacman.nextDir = 2;
                break;
            case "d":
            case "Right":
                pacman.nextDir = 3;
                break;
        }
    }
})

let startTouch = {}
window.addEventListener("touchstart", e => {
    startTouch = {x: e.touches[0].clientX, y: e.touches[0].clientY}
})
window.addEventListener("touchend", e => {
    let endTouch = {x: e.changedTouches[0].clientX, y: e.changedTouches[0].clientY}
    let diffX = startTouch.x - endTouch.x
    let diffY = startTouch.y - endTouch.y
    document.getElementById("text").innerText = "diff x: " +  diffX + " diff y: " +  diffY
    if(Math.abs(diffX) > Math.abs(diffY)){
        if(diffX > 0){
            pacman.nextDir = 2
        } else {
            pacman.nextDir = 3
        }
    } else {
        if(diffY > 0){
            pacman.nextDir = 0
        } else {
            pacman.nextDir = 1
        }
    }
})