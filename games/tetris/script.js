/** @type {HTMLCanvasElement} */
const canvas = document.getElementById('myCanvas');
const ctx = canvas.getContext('2d');

const len = 4
const block = canvas.width/10
var loc = {
    x:4*block,
    y:-4*block
}
//1
const L0x = [[0,0,0,0],[1,0,0,0],[1,0,0,0],[1,1,0,0]]
const L1x = [[0,0,0,0],[0,0,0,0],[0,0,1,0],[1,1,1,0]]
const L2x = [[0,0,0,0],[1,1,0,0],[0,1,0,0],[0,1,0,0]]
const L3x = [[0,0,0,0],[0,0,0,0],[1,1,1,0],[1,0,0,0]]
const shape_L = [L0x, L1x, L2x, L3x]
//2
const TxTx0 = [[0,0,0,0],[0,0,0,0],[1,1,0,0],[1,1,0,0]]
const shape_2x2 = [TxTx0, TxTx0, TxTx0, TxTx0]
//3
const Tx0 = [[0,0,0,0],[0,0,0,0],[0,1,0,0],[1,1,1,0]]
const Tx1 = [[0,0,0,0],[0,1,0,0],[1,1,0,0],[0,1,0,0]]
const Tx2 = [[0,0,0,0],[0,0,0,0],[1,1,1,0],[0,1,0,0]]
const Tx3 = [[0,0,0,0],[1,0,0,0],[1,1,0,0],[1,0,0,0]]
const shape_T = [Tx0, Tx1, Tx2, Tx3]
//4
const Sx0 = [[0,0,0,0],[0,0,0,0],[0,1,1,0],[1,1,0,0]]
const Sx1 = [[0,0,0,0],[1,0,0,0],[1,1,0,0],[0,1,0,0]]
const shape_S = [Sx0, Sx1, Sx0, Sx1]
//5
const Ix0 = [[1,0,0,0],[1,0,0,0],[1,0,0,0],[1,0,0,0]]
const Ix1 = [[0,0,0,0],[0,0,0,0],[0,0,0,0],[1,1,1,1]]
const shape_I = [Ix0, Ix1, Ix0, Ix1]
//6
const shape_options = [shape_L, shape_S, shape_I, shape_T, shape_2x2]

var SHAPE = shape_options[Math.floor(Math.random() * shape_options.length)][0]
var COLOR = ['red', 'green', 'blue', 'aqua', 'purple', 'yellow'][Math.floor(Math.random() * 6)]
ctx.fillStyle = COLOR
var speed = 1
var level = 1

var matrix = [
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
]

// ctx.fillRect(loc.x, loc.y, block, block)
var last_level = performance.now()
var pause = true
update_window(SHAPE)
function gap_right(){
    if(SHAPE[0][3]==0 && SHAPE[1][3]==0 && SHAPE[2][3]==0 && SHAPE[3][3]==0){
        if(SHAPE[0][2]==0 && SHAPE[1][2]==0 && SHAPE[2][2]==0 && SHAPE[3][2]==0){
            if(SHAPE[0][1]==0 && SHAPE[1][1]==0 && SHAPE[2][1]==0 && SHAPE[3][1]==0) return 3
            else return 2
        }else return 1
    }else return 0
}
function gap_right_var(SM){
    if(SM[0][3]==0 && SM[1][3]==0 && SM[2][3]==0 && SM[3][3]==0){
        if(SM[0][2]==0 && SM[1][2]==0 && SM[2][2]==0 && SM[3][2]==0){
            if(SM[0][1]==0 && SM[1][1]==0 && SM[2][1]==0 && SM[3][1]==0) return 3
            else return 2
        }else return 1
    }else return 0

}
function gap_under(){
    if(SHAPE[3]==[0,0,0,0]){
        if(SHAPE[2]==[0,0,0,0]){
            if(SHAPE[1]==[0,0,0,0])return 2
            else return 3
        }else return 1
    }else return 4
}
function overlay(loc_x, loc_y){
    for(let y = 0; y<len; y++){
        for(let x = 0/block; x<len; x++){
            if(SHAPE[y][x] == 1 && matrix[y+loc_y][x+loc_x] != 0) return false
        }
    }
    return true
}
function save_shape(shape_matrix){
    for(let y = 0; y<len; y++){
        for(let x = 0/block; x<len; x++){
            if(shape_matrix[y][x]==1) matrix[loc.y/ block+y][loc.x/ block+x] = COLOR
        }
    }
    SHAPE = shape_options[Math.floor(Math.random() * shape_options.length)][0]
    COLOR = ['red', 'green', 'blue', 'aqua', 'purple', 'yellow'][Math.floor(Math.random() * 6)]
}
function draw_shape_matrix(shape_matrix){
    for(let y = 0; y<len; y++){
        for(let x = 0; x<len; x++){
            if(shape_matrix[y][x]==1) ctx.fillRect(loc.x+x*block, loc.y+y*block, block, block)
        }
    }
}

function rotate(){
    for(let i of shape_options){
        if(i.includes(SHAPE)){
            if(i.indexOf(SHAPE)+1 < 4) SHAPE = i[i.indexOf(SHAPE)+1]
            else SHAPE = i[0]
            break
        }   
    }
}

function load_matrix(){
    for(let y = 0; y<20; y++){
        for(let x = 0; x<10; x++){
            if(matrix[y][x]!=0) {
                ctx.fillStyle = matrix[y][x]
                ctx.fillRect(x*block, y*block, block, block)
            }
        }
    }
}

function update_window(shape_matrix){
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    draw_shape_matrix(shape_matrix)
    load_matrix(matrix)
}

function shift_matrix(){
    for(let i of matrix){
        if(!i.includes(0)){
            var line_num = matrix.indexOf(i)
            matrix.splice(line_num, 1)
            matrix.unshift([0,0,0,0,0,0,0,0,0,0])
        }
    }
}

function drop_down(){
    document.getElementById('level').textContent = `level: ${level}` 
    ctx.fillStyle = COLOR
    shift_matrix()
    update_window(SHAPE)
    if(loc.y<0) loc.y += block
    else if(loc.y/block < 20-gap_under() && overlay(loc.x/block, loc.y/block + 1)) loc.y += block
    else{
        save_shape(SHAPE)
        loc = {x:4*block, y:0}
    } 
}
function y_movement(){

}
window.addEventListener('keypress', (e) => {
    document.getElementById('keypressed').textContent = e.key
    ctx.fillStyle = COLOR
    if(e.key == 'a' && loc.x-block >= 0 && overlay(loc.x/block - 1, loc.y/block)) loc.x -= block
    else if(e.key == 'd' && loc.x+block < canvas.width && overlay(loc.x/block + 1, loc.y/block)) loc.x += block
    // else if(e.key == 'w' && loc.y-block >= 0) loc.y -= block
    else if(e.key == 's' && loc.y+block*4 < canvas.height && overlay(loc.x/block, loc.y/block + 1)) loc.y += block
    else if(e.key == 'e') save_shape(SHAPE)
    else if(e.key == 'q'){
        const old_SM = SHAPE
        rotate()
        loc.x -= (gap_right_var(old_SM) - gap_right_var(SHAPE))*block
        
    }

    update_window(SHAPE, matrix)
})
if(last_level + 30000 <= performance.now()){
    last_level = performance.now()
    speed = (speed*1.1).toFixed(5)
    level++

}
setInterval(drop_down, 400/speed)