/** @type {HTMLCanvasElement} */

const canvas = document.getElementById("canvas")
const ctx = canvas.getContext('2d')
const scale = 20

canvas.height = 30 * scale
canvas.width = 30 * scale

const rows = canvas.height / scale
const cols = canvas.width / scale

let start = {x: 0, y: 0}
let end = {x: 29, y: 29}
let toChange = 0;
let lastNode = {x: 0, y: 0}

let held = false;
let erase = false;

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

/*const matrix = [
    [3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3],
    [3,0,0,0,0,0,0,0,0,0,0,0,0,3,3,0,0,0,0,0,0,0,0,0,0,0,0,3],
    [3,0,3,3,3,3,0,3,3,3,3,3,0,3,3,0,3,3,3,3,3,0,3,3,3,3,0,3],
    [3,0,3,3,3,3,0,3,3,3,3,3,0,3,3,0,3,3,3,3,3,0,3,3,3,3,0,3],
    [3,0,3,3,3,3,0,3,3,3,3,3,0,3,3,0,3,3,3,3,3,0,3,3,3,3,0,3],
    [3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3],
    [3,0,3,3,3,3,0,3,3,0,3,3,3,3,3,3,3,3,0,3,3,0,3,3,3,3,0,3],
    [3,0,3,3,3,3,0,3,3,0,3,3,3,3,3,3,3,3,0,3,3,0,3,3,3,3,0,3],
    [3,0,0,0,0,0,0,3,3,0,0,0,0,3,3,0,0,0,0,3,3,0,0,0,0,0,0,3],
    [3,3,3,3,3,3,0,3,3,3,3,3,0,3,3,0,3,3,3,3,3,0,3,3,3,3,3,3],
    [0,0,0,0,0,3,0,3,3,3,3,3,0,3,3,0,3,3,3,3,3,0,3,0,0,0,0,0],
    [0,0,0,0,0,3,0,3,3,0,0,0,0,0,0,0,0,0,0,3,3,0,3,0,0,0,0,0],
    [0,0,0,0,0,3,0,3,3,0,3,3,3,0,0,3,3,3,0,3,3,0,3,0,0,0,0,0],
    [3,3,3,3,3,3,0,3,3,0,3,0,0,0,0,0,0,3,0,3,3,0,3,3,3,3,3,3],
    [3,0,0,0,0,0,0,0,0,0,3,0,0,0,0,0,0,3,0,0,0,0,0,0,0,0,0,3], 
    [3,3,3,3,3,3,0,3,3,0,3,0,0,0,0,0,0,3,0,3,3,0,3,3,3,3,3,3],
    [0,0,0,0,0,3,0,3,3,0,3,3,3,3,3,3,3,3,0,3,3,0,3,0,0,0,0,0],
    [0,0,0,0,0,3,0,3,3,0,0,0,0,0,0,0,0,0,0,3,3,0,3,0,0,0,0,0],
    [0,0,0,0,0,3,0,3,3,0,3,3,3,3,3,3,3,3,0,3,3,0,3,0,0,0,0,0],
    [3,3,3,3,3,3,0,3,3,0,3,3,3,3,3,3,3,3,0,3,3,0,3,3,3,3,3,3],
    [3,0,0,0,0,0,0,0,0,0,0,0,0,3,3,0,0,0,0,0,0,0,0,0,0,0,0,3],
    [3,0,3,3,3,3,0,3,3,3,3,3,0,3,3,0,3,3,3,3,3,0,3,3,3,3,0,3],
    [3,0,3,3,3,3,0,3,3,3,3,3,0,3,3,0,3,3,3,3,3,0,3,3,3,3,0,3],
    [3,0,0,0,3,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3,3,0,0,0,3],
    [3,3,3,0,3,3,0,3,3,0,3,3,3,3,3,3,3,3,0,3,3,0,3,3,0,3,3,3],
    [3,3,3,0,3,3,0,3,3,0,3,3,3,3,3,3,3,3,0,3,3,0,3,3,0,3,3,3],
    [3,0,0,0,0,0,0,3,3,0,0,0,0,3,3,0,0,0,0,3,3,0,0,0,0,0,0,3],
    [3,0,3,3,3,3,3,3,3,3,3,3,0,3,3,0,3,3,3,3,3,3,3,3,3,3,0,3],
    [3,0,3,3,3,3,3,3,3,3,3,3,0,3,3,0,3,3,3,3,3,3,3,3,3,3,0,3],
    [3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3],
    [3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3],
]*/

const drawMatrix = () => {
    let tempMatrix = matrix;
    tempMatrix[start.y][start.x] = 2;
    tempMatrix[end.y][end.x] = 2;

    tempMatrix.forEach((row, rowI) => {
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
    if(held){
        if(erase){
            matrix[lastNode.y][lastNode.x] = 1;
        } else {
            matrix[lastNode.y][lastNode.x] = 3;
        }
    }

    update()
}, 1)

canvas.addEventListener("mousemove", (e) => {
    const rect = e.target.getBoundingClientRect();
    const x = Math.floor((e.clientX - rect.left) / scale);
    const y = Math.floor((e.clientY - rect.top) / scale);


    if( matrix[lastNode.y][lastNode.x] !== 2 && 
        matrix[lastNode.y][lastNode.x] !== 3 && 
        matrix[lastNode.y][lastNode.x] !== 4) matrix[lastNode.y][lastNode.x] = 0
    if( matrix[y][x] !== 2 && 
        matrix[y][x] !== 3 && 
        matrix[y][x] !== 4) matrix[y][x] = 1

    lastNode = {x, y}
})

canvas.addEventListener("click", () => {
    if(!toChange){
        matrix[start.y][start.x] = 0;
        start = {x: lastNode.x, y: lastNode.y};
        document.getElementById("start").innerText = `Start: (${start.x}, ${start.y})`
        toChange = 1;
    } else {
        matrix[end.y][end.x] = 0;
        end = {x: lastNode.x, y: lastNode.y};
        document.getElementById("end").innerText = `End: (${end.x}, ${end.y})`
        toChange = 0;
    }
})

canvas.addEventListener("mousedown", (e) => {
    if(e.button !== 2) return;
    held = true;
    if(matrix[lastNode.y][lastNode.x] == 3){
        erase = true;
    } else {
        erase = false;
    }
})
document.addEventListener("mouseup", () => {
    held = false;
})
document.addEventListener("contextmenu", (e) => {
    e.preventDefault();
})

document.getElementById("find").addEventListener("click", () => {
    matrix.forEach((row, rowI) => {
        row.forEach((col, colI) => {
            if(matrix[rowI][colI] === 4 || matrix[rowI][colI] === 1) matrix[rowI][colI] = 0;
        })
    })

    let timer = Date.now();

    let path = findPath(matrix, start, end, document.getElementById('idk').checked)
    console.log(path)
    path.forEach((node) => {
        matrix[node.y][node.x] = 4
    })

    timer = Date.now() - timer;
    document.getElementById("time").innerText = `Time: ${timer}ms`
})