/** @type {HTMLCanvasElement} */

const canvas = document.getElementById("canvas")
const ctx = canvas.getContext('2d')
const scale = 20

canvas.height = 30 * scale
canvas.width = 30 * scale

const rows = canvas.height / scale
const cols = canvas.width / scale

let start = {x: 0, y: 0}
let end = {x: 0, y: 0}
let toChange = 0;
let lastNode = {x: 0, y: 0}

let matrix = [
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
]

const drawMatrix = () => {
    matrix.forEach((row, rowI) => {
        row.forEach((col, colI) => {
            switch(col){
                case 0:
                    ctx.fillStyle = "#fff";
                    //ctx.fillRect(colI * scale, rowI * scale, scale, scale);
                    ctx.fillRect((colI * scale) + (scale / 10) / 2, (rowI * scale) + (scale / 10) / 2, scale - (scale / 10), scale - (scale / 10));
                    break;
                case 1:
                    ctx.fillStyle = "#0f0";
                    ctx.fillRect((colI * scale) + (scale / 10) / 2, (rowI * scale) + (scale / 10) / 2, scale - (scale / 10), scale - (scale / 10));
                    break;
                case 2:
                    ctx.fillStyle = "#f00";
                    ctx.fillRect((colI * scale) + (scale / 10) / 2, (rowI * scale) + (scale / 10) / 2, scale - (scale / 10), scale - (scale / 10));
                    break;
                case 3:
                    ctx.fillStyle = "#444";
                    ctx.fillRect((colI * scale) + (scale / 10) / 2, (rowI * scale) + (scale / 10) / 2, scale - (scale / 10), scale - (scale / 10));
                    break;
                case 4:
                    ctx.fillStyle = "#0ff";
                    ctx.fillRect(colI * scale, rowI * scale, scale, scale);
                    break;
                
            }
        })
    })
}

const update = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    
    drawMatrix();
}

let interval = setInterval(() => {
    update()
}, 1)

canvas.addEventListener("mousemove", (e) => {
    const x = Math.floor((e.layerX / scale))
    const y = Math.floor((e.layerY / scale))

    if( matrix[lastNode.y][lastNode.x] !== 2 && 
        matrix[lastNode.y][lastNode.x] !== 3 && 
        matrix[lastNode.y][lastNode.x] !== 4) matrix[lastNode.y][lastNode.x] = 0
    if( matrix[y][x] !== 2 && 
        matrix[y][x] !== 3 && 
        matrix[y][x] !== 4) matrix[y][x] = 1

    lastNode = {x, y}
})

canvas.addEventListener("click", () => {
    if(matrix[lastNode.y][lastNode.x] == 2){
        matrix[lastNode.y][lastNode.x] = 1;
    } else {
        matrix[lastNode.y][lastNode.x] = 2;
        if(!toChange){
            start = {x: lastNode.x, y: lastNode.y};
            document.getElementById("start").innerText = `Start: (${start.x}, ${start.y})`
            toChange = 1;
        } else {
            end = {x: lastNode.x, y: lastNode.y};
            document.getElementById("end").innerText = `End: (${end.x}, ${end.y})`
            toChange = 0;
        }
    }
})
// listen for right click
canvas.addEventListener("contextmenu", (e) => {
    e.preventDefault();

    if(matrix[lastNode.y][lastNode.x] == 3){
        matrix[lastNode.y][lastNode.x] = 1;
    } else {
        matrix[lastNode.y][lastNode.x] = 3;
    }
})

document.getElementById("find").addEventListener("click", () => {
    matrix.forEach((row, rowI) => {
        row.forEach((col, colI) => {
            if(matrix[rowI][colI] === 4) matrix[rowI][colI] = 0;
        })
    })

    let path = findPath(matrix, start, end)
    console.log(path)
    path.forEach((node) => {
        if(matrix[node.y][node.x] !== 2) matrix[node.y][node.x] = 0
        matrix[node.y][node.x] = 4
    })
})