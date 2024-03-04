/** @type {HTMLCanvasElement} */

const canvas = document.getElementById("canvas")
const ctx = canvas.getContext('2d')
const scale = 40

canvas.height = 31 * scale
canvas.width = 28 * scale

const rows = canvas.height / scale
const cols = canvas.width / scale

let score = 0;

const blocks = {
    "outer_walls": {
        "left": [
            [1,0,0,1,0,0,0,0],
            [1,0,0,1,0,0,0,0],
            [1,0,0,1,0,0,0,0],
            [1,0,0,1,0,0,0,0],
            [1,0,0,1,0,0,0,0],
            [1,0,0,1,0,0,0,0],
            [1,0,0,1,0,0,0,0],
            [1,0,0,1,0,0,0,0]
        ],
        "right": [
            [0,0,0,0,1,0,0,1],
            [0,0,0,0,1,0,0,1],
            [0,0,0,0,1,0,0,1],
            [0,0,0,0,1,0,0,1],
            [0,0,0,0,1,0,0,1],
            [0,0,0,0,1,0,0,1],
            [0,0,0,0,1,0,0,1],
            [0,0,0,0,1,0,0,1]
        ],
        "top": [
            [1,1,1,1,1,1,1,1],
            [0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0],
            [1,1,1,1,1,1,1,1],
            [0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0]
        ],
        "bot": [
            [0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0],
            [1,1,1,1,1,1,1,1],
            [0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0],
            [1,1,1,1,1,1,1,1]
        ],
        "corners": {
            "top": {
                "left": [
                    [0,0,0,0,1,1,1,1],
                    [0,0,1,1,0,0,0,0],
                    [0,1,0,0,0,0,0,0],
                    [0,1,0,0,0,1,1,1],
                    [1,0,0,0,1,0,0,0],
                    [1,0,0,1,0,0,0,0],
                    [1,0,0,1,0,0,0,0],
                    [1,0,0,1,0,0,0,0],
                ],
                "right": [
                    [1,1,1,1,0,0,0,0],
                    [0,0,0,0,1,1,0,0],
                    [0,0,0,0,0,0,1,0],
                    [1,1,1,0,0,0,1,0],
                    [0,0,0,1,0,0,0,1],
                    [0,0,0,0,1,0,0,1],
                    [0,0,0,0,1,0,0,1],
                    [0,0,0,0,1,0,0,1],
                ]
            },
            "bot": {
                "left": [
                    [1,0,0,1,0,0,0,0],
                    [1,0,0,1,0,0,0,0],
                    [1,0,0,1,0,0,0,0],
                    [1,0,0,0,1,0,0,0],
                    [0,1,0,0,0,1,1,1],
                    [0,1,0,0,0,0,0,0],
                    [0,0,1,1,0,0,0,0],
                    [0,0,0,0,1,1,1,1],
                ],
                "right": [
                    [0,0,0,0,1,0,0,1],
                    [0,0,0,0,1,0,0,1],
                    [0,0,0,0,1,0,0,1],
                    [0,0,0,1,0,0,0,1],
                    [1,1,1,0,0,0,1,0],
                    [0,0,0,0,0,0,1,0],
                    [0,0,0,0,1,1,0,0],
                    [1,1,1,1,0,0,0,0],
                ]
            },
            "special": {
                "top": {
                    "left": [
                        [1,1,1,1,1,1,1,1],
                        [0,0,0,0,0,0,0,0],
                        [0,0,0,0,0,0,0,0],
                        [1,1,1,0,0,0,0,0],
                        [0,0,0,1,0,0,0,0],
                        [0,0,0,0,1,0,0,0],
                        [0,0,0,0,1,0,0,0],
                        [0,0,0,0,1,0,0,0],
                    ],
                    "right": [
                        [1,1,1,1,1,1,1,1],
                        [0,0,0,0,0,0,0,0],
                        [0,0,0,0,0,0,0,0],
                        [0,0,0,0,0,1,1,1],
                        [0,0,0,0,1,0,0,0],
                        [0,0,0,1,0,0,0,0],
                        [0,0,0,1,0,0,0,0],
                        [0,0,0,1,0,0,0,0],
                    ]
                },
                "left": {
                    "top": [
                        [1,0,0,0,0,0,0,0],
                        [1,0,0,0,0,0,0,0],
                        [1,0,0,0,0,0,0,0],
                        [1,0,0,0,0,1,1,1],
                        [1,0,0,0,1,0,0,0],
                        [1,0,0,1,0,0,0,0],
                        [1,0,0,1,0,0,0,0],
                        [1,0,0,1,0,0,0,0],
                    ],
                    "bot": [
                        [1,0,0,1,0,0,0,0],
                        [1,0,0,1,0,0,0,0],
                        [1,0,0,1,0,0,0,0],
                        [1,0,0,0,1,0,0,0],
                        [1,0,0,0,0,1,1,1],
                        [1,0,0,0,0,0,0,0],
                        [1,0,0,0,0,0,0,0],
                        [1,0,0,0,0,0,0,0],
                    ]
                },
                "right": {
                    "top": [
                        [0,0,0,0,0,0,0,1],
                        [0,0,0,0,0,0,0,1],
                        [0,0,0,0,0,0,0,1],
                        [1,1,1,0,0,0,0,1],
                        [0,0,0,1,0,0,0,1],
                        [0,0,0,0,1,0,0,1],
                        [0,0,0,0,1,0,0,1],
                        [0,0,0,0,1,0,0,1],
                    ],
                    "bot": [
                        [0,0,0,0,1,0,0,1],
                        [0,0,0,0,1,0,0,1],
                        [0,0,0,0,1,0,0,1],
                        [0,0,0,1,0,0,0,1],
                        [1,1,1,0,0,0,0,1],
                        [0,0,0,0,0,0,0,1],
                        [0,0,0,0,0,0,0,1],
                        [0,0,0,0,0,0,0,1],
                    ]
                },
            }
        }
    },
    "walls":{
        "top": [
            [0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0],
            [1,1,1,1,1,1,1,1],
            [0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0],
        ],
        "bot": [
            [0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0],
            [1,1,1,1,1,1,1,1],
            [0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0],
        ],
        "left": [
            [0,0,0,0,1,0,0,0],
            [0,0,0,0,1,0,0,0],
            [0,0,0,0,1,0,0,0],
            [0,0,0,0,1,0,0,0],
            [0,0,0,0,1,0,0,0],
            [0,0,0,0,1,0,0,0],
            [0,0,0,0,1,0,0,0],
            [0,0,0,0,1,0,0,0],
        ],
        "right": [
            [0,0,0,1,0,0,0,0],
            [0,0,0,1,0,0,0,0],
            [0,0,0,1,0,0,0,0],
            [0,0,0,1,0,0,0,0],
            [0,0,0,1,0,0,0,0],
            [0,0,0,1,0,0,0,0],
            [0,0,0,1,0,0,0,0],
            [0,0,0,1,0,0,0,0],
        ],
    },
    "corners": {
        "top": {
            "left": [
                [0,0,0,0,0,0,0,0],
                [0,0,0,0,0,0,0,0],
                [0,0,0,0,0,0,0,0],
                [0,0,0,0,0,0,0,0],
                [0,0,0,0,0,0,1,1],
                [0,0,0,0,0,1,0,0],
                [0,0,0,0,1,0,0,0],
                [0,0,0,0,1,0,0,0],
            ],
            "right": [
                [0,0,0,0,0,0,0,0],
                [0,0,0,0,0,0,0,0],
                [0,0,0,0,0,0,0,0],
                [0,0,0,0,0,0,0,0],
                [1,1,0,0,0,0,0,0],
                [0,0,1,0,0,0,0,0],
                [0,0,0,1,0,0,0,0],
                [0,0,0,1,0,0,0,0],
            ]
        },
        "bot": {
            "left": [
                [0,0,0,0,1,0,0,0],
                [0,0,0,0,1,0,0,0],
                [0,0,0,0,0,1,0,0],
                [0,0,0,0,0,0,1,1],
                [0,0,0,0,0,0,0,0],
                [0,0,0,0,0,0,0,0],
                [0,0,0,0,0,0,0,0],
                [0,0,0,0,0,0,0,0],
            ],
            "right": [
                [0,0,0,1,0,0,0,0],
                [0,0,0,1,0,0,0,0],
                [0,0,1,0,0,0,0,0],
                [1,1,0,0,0,0,0,0],
                [0,0,0,0,0,0,0,0],
                [0,0,0,0,0,0,0,0],
                [0,0,0,0,0,0,0,0],
                [0,0,0,0,0,0,0,0],
            ]
        }
    },
    "house": {
        "walls":{
            "top": [
                [0,0,0,0,0,0,0,0],
                [0,0,0,0,0,0,0,0],
                [0,0,0,0,0,0,0,0],
                [0,0,0,0,0,0,0,0],
                [1,1,1,1,1,1,1,1],
                [0,0,0,0,0,0,0,0],
                [0,0,0,0,0,0,0,0],
                [1,1,1,1,1,1,1,1],
            ],
            "bot": [
                [1,1,1,1,1,1,1,1],
                [0,0,0,0,0,0,0,0],
                [0,0,0,0,0,0,0,0],
                [1,1,1,1,1,1,1,1],
                [0,0,0,0,0,0,0,0],
                [0,0,0,0,0,0,0,0],
                [0,0,0,0,0,0,0,0],
                [0,0,0,0,0,0,0,0],
            ],
            "left": [
                [0,0,0,0,1,0,0,1],
                [0,0,0,0,1,0,0,1],
                [0,0,0,0,1,0,0,1],
                [0,0,0,0,1,0,0,1],
                [0,0,0,0,1,0,0,1],
                [0,0,0,0,1,0,0,1],
                [0,0,0,0,1,0,0,1],
                [0,0,0,0,1,0,0,1],
            ],
            "right": [
                [1,0,0,1,0,0,0,0],
                [1,0,0,1,0,0,0,0],
                [1,0,0,1,0,0,0,0],
                [1,0,0,1,0,0,0,0],
                [1,0,0,1,0,0,0,0],
                [1,0,0,1,0,0,0,0],
                [1,0,0,1,0,0,0,0],
                [1,0,0,1,0,0,0,0],
            ],
        },
        "corners": {
            "top": {
                "left": [
                    [0,0,0,0,0,0,0,0],
                    [0,0,0,0,0,0,0,0],
                    [0,0,0,0,0,0,0,0],
                    [0,0,0,0,0,0,0,0],
                    [0,0,0,0,1,1,1,1],
                    [0,0,0,0,1,0,0,0],
                    [0,0,0,0,1,0,0,0],
                    [0,0,0,0,1,0,0,1],
                ],
                "right": [
                    [0,0,0,0,0,0,0,0],
                    [0,0,0,0,0,0,0,0],
                    [0,0,0,0,0,0,0,0],
                    [0,0,0,0,0,0,0,0],
                    [1,1,1,1,0,0,0,0],
                    [0,0,0,1,0,0,0,0],
                    [0,0,0,1,0,0,0,0],
                    [1,0,0,1,0,0,0,0],
                ]
            },
            "bot": {
                "left": [
                    [0,0,0,0,1,0,0,1],
                    [0,0,0,0,1,0,0,0],
                    [0,0,0,0,1,0,0,0],
                    [0,0,0,0,1,1,1,1],
                    [0,0,0,0,0,0,0,0],
                    [0,0,0,0,0,0,0,0],
                    [0,0,0,0,0,0,0,0],
                    [0,0,0,0,0,0,0,0],
                ],
                "right": [
                    [1,0,0,1,0,0,0,0],
                    [0,0,0,1,0,0,0,0],
                    [0,0,0,1,0,0,0,0],
                    [1,1,1,1,0,0,0,0],
                    [0,0,0,0,0,0,0,0],
                    [0,0,0,0,0,0,0,0],
                    [0,0,0,0,0,0,0,0],
                    [0,0,0,0,0,0,0,0],
                ]
            }
        },
        "gate": [
            [0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0],
            [1,1,1,1,1,1,1,1],
            [1,1,1,1,1,1,1,1],
            [0,0,0,0,0,0,0,0],
        ]
    }
}

const debugblock = [
    [1,1,1,1,1,1,1,1],
    [1,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,1],
    [1,0,0,1,1,0,0,1],
    [1,0,0,1,1,0,0,1],
    [1,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,1],
    [1,1,1,1,1,1,1,1],
]

const matrix = [[8,6,6,6,6,6,6,6,6,6,6,6,6,20,21,6,6,6,6,6,6,6,6,6,6,6,6,9],
                [4,2,2,2,2,2,2,2,2,2,2,2,2,18,19,2,2,2,2,2,2,2,2,2,2,2,2,5],
                [4,2,12,16,16,13,2,12,16,16,16,13,2,18,19,2,12,16,16,16,13,2,12,16,16,13,2,5],
                [4,2,18,0,0,19,2,18,0,0,0,19,2,18,19,2,18,0,0,0,19,2,18,0,0,19,2,5],
                [4,2,14,17,17,15,2,14,17,17,17,15,2,14,15,2,14,17,17,17,15,2,14,17,17,15,2,5],
                [4,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,5],
                [4,2,12,16,16,13,2,12,13,2,12,16,16,16,16,16,16,13,2,12,13,2,12,16,16,13,2,5],
                [4,2,14,17,17,15,2,18,19,2,14,17,17,13,12,17,17,15,2,18,19,2,14,17,17,15,2,5],
                [4,2,2,2,2,2,2,18,19,2,2,2,2,18,19,2,2,2,2,18,19,2,2,2,2,2,2,5],
                [10,7,7,7,7,13,2,18,14,16,16,13,0,18,19,0,12,16,16,15,19,2,12,7,7,7,7,11],
                [0,0,0,0,0,4,2,18,12,17,17,15,0,14,15,0,14,17,17,13,19,2,5,0,0,0,0,0],
                [0,0,0,0,0,4,2,18,19,0,0,0,0,0,0,0,0,0,0,18,19,2,5,0,0,0,0,0],
                [0,0,0,0,0,4,2,18,19,0,30,26,26,34,34,26,26,31,0,18,19,2,5,0,0,0,0,0],
                [6,6,6,6,6,15,2,14,15,0,28,0,0,0,0,0,0,29,0,14,15,2,14,6,6,6,6,6],
                [2,2,2,2,2,2,2,0,0,0,28,0,0,0,0,0,0,29,0,0,0,2,2,2,2,2,2,2],
                [7,7,7,7,7,13,2,12,13,0,28,0,0,0,0,0,0,29,0,12,13,2,12,7,7,7,7,7],
                [0,0,0,0,0,4,2,18,19,0,32,27,27,27,27,27,27,33,0,18,19,2,5,0,0,0,0,0],
                [0,0,0,0,0,4,2,18,19,0,0,0,0,0,0,0,0,0,0,18,19,2,5,0,0,0,0,0],
                [0,0,0,0,0,4,2,18,19,0,12,16,16,16,16,16,16,13,0,18,19,2,5,0,0,0,0,0],
                [8,6,6,6,6,15,2,14,15,0,14,17,17,13,12,17,17,15,0,14,15,2,14,6,6,6,6,9],
                [4,2,2,2,2,2,2,2,2,2,2,2,2,18,19,2,2,2,2,2,2,2,2,2,2,2,2,5],
                [4,2,12,16,16,13,2,12,16,16,16,13,2,18,19,2,12,16,16,16,13,2,12,16,16,13,2,5],
                [4,2,14,17,13,19,2,14,17,17,17,15,2,14,15,2,14,17,17,17,15,2,18,12,17,15,2,5],
                [4,2,2,2,18,19,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,18,19,2,2,2,5],
                [23,16,13,2,18,19,2,12,13,2,12,16,16,16,16,16,16,13,2,12,13,2,18,19,2,12,16,25],
                [22,17,15,2,14,15,2,18,19,2,14,17,17,13,12,17,17,15,2,18,19,2,14,15,2,14,17,24],
                [4,2,2,2,2,2,2,18,19,2,2,2,2,18,19,2,2,2,2,18,19,2,2,2,2,2,2,5],
                [4,2,12,16,16,16,16,15,14,16,16,13,2,18,19,2,12,16,16,15,14,16,16,16,16,13,2,5],
                [4,2,14,17,17,17,17,17,17,17,17,15,2,14,15,2,14,17,17,17,17,17,17,17,17,15,2,5],
                [4,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,5],
                [10,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,11]]

var pacman = new Pacman()
var blinky = new Ghost({who: "blinky", startX: 13.5, startY: 11, delay: 1000, color: "#f00"})
var inky = new Ghost({who: "inky", startX: 11.5, startY: 14, delay: 12000, color: "#35d0d0"})
var pinky = new Ghost({who: "pinky", startX: 15.5, startY: 14, delay: 6000, color: "#ffc0cb"})

//var blinky = new Ghost({who: "blinky", startX: 13.5, startY: 11, delay: 999999, color: "#f00"})
//var inky = new Ghost({who: "inky", startX: 11.5, startY: 14, delay: 999999, color: "#35d0d0"})
//var pinky = new Ghost({who: "pinky", startX: 15.5, startY: 14, delay: 999999, color: "#ffc0cb"})

const drawBlock = (x, y, block, color) => {
    if(color){
        ctx.fillStyle = color;
    } else {
        ctx.fillStyle = "#1919a6";
    }
    block.forEach((row, rowI) => {
        row.forEach((col, colI) => {
            if(col){
                ctx.fillRect((x * scale) + (colI * (scale / 8)), (y * scale) + (rowI * (scale / 8)), scale / 8, scale / 8);
            }
        })
    })
}

const drawMap = () => {
    matrix.forEach((row, rowI) => {
        row.forEach((col, colI) => {
            switch(col){
                case 1:
                    ctx.fillStyle = "#1919a6";
                    ctx.fillRect(colI * scale, rowI * scale, scale, scale);
                    break;
                case 2:
                    ctx.fillStyle = "#dea185";
                    ctx.fillRect((colI * scale) + ((scale - (scale / 5)) / 2), (rowI * scale) + ((scale - (scale / 5)) / 2), scale / 5, scale / 5);
                    break;
                case 3:
                    ctx.fillStyle = "#f00";
                    ctx.fillRect(colI * scale, rowI * scale, scale, scale);
                    break;
                case 4:
                    drawBlock(colI, rowI, blocks.outer_walls.left);
                    break;
                case 5:
                    drawBlock(colI, rowI, blocks.outer_walls.right);
                    break;
                case 6:
                    drawBlock(colI, rowI, blocks.outer_walls.top);
                    break;
                case 7:
                    drawBlock(colI, rowI, blocks.outer_walls.bot);
                    break;
                case 8:
                    drawBlock(colI, rowI, blocks.outer_walls.corners.top.left);
                    break;
                case 9:
                    drawBlock(colI, rowI, blocks.outer_walls.corners.top.right);
                    break;
                case 10:
                    drawBlock(colI, rowI, blocks.outer_walls.corners.bot.left);
                    break;
                case 11:
                    drawBlock(colI, rowI, blocks.outer_walls.corners.bot.right);
                    break;
                case 12:
                    drawBlock(colI, rowI, blocks.corners.top.left);
                    break;
                case 13:
                    drawBlock(colI, rowI, blocks.corners.top.right);
                    break;
                case 14:
                    drawBlock(colI, rowI, blocks.corners.bot.left);
                    break;
                case 15:
                    drawBlock(colI, rowI, blocks.corners.bot.right);
                    break;
                case 16:
                    drawBlock(colI, rowI, blocks.walls.top);
                    break;
                case 17:
                    drawBlock(colI, rowI, blocks.walls.bot);
                    break;
                case 18:
                    drawBlock(colI, rowI, blocks.walls.left);
                    break;
                case 19:
                    drawBlock(colI, rowI, blocks.walls.right);
                    break;
                case 20:
                    drawBlock(colI, rowI, blocks.outer_walls.corners.special.top.left);
                    break;
                case 21:
                    drawBlock(colI, rowI, blocks.outer_walls.corners.special.top.right);
                    break;
                case 22:
                    drawBlock(colI, rowI, blocks.outer_walls.corners.special.left.top);
                    break;
                case 23:
                    drawBlock(colI, rowI, blocks.outer_walls.corners.special.left.bot);
                    break;
                case 24:
                    drawBlock(colI, rowI, blocks.outer_walls.corners.special.right.top);
                    break;
                case 25:
                    drawBlock(colI, rowI, blocks.outer_walls.corners.special.right.bot);
                    break;
                case 26:
                    drawBlock(colI, rowI, blocks.house.walls.top);
                    break;
                case 27:
                    drawBlock(colI, rowI, blocks.house.walls.bot);
                    break;
                case 28:
                    drawBlock(colI, rowI, blocks.house.walls.left);
                    break;
                case 29:
                    drawBlock(colI, rowI, blocks.house.walls.right);
                    break;
                case 30:
                    drawBlock(colI, rowI, blocks.house.corners.top.left);
                    break;
                case 31:
                    drawBlock(colI, rowI, blocks.house.corners.top.right);
                    break;
                case 32:
                    drawBlock(colI, rowI, blocks.house.corners.bot.left);
                    break;
                case 33:
                    drawBlock(colI, rowI, blocks.house.corners.bot.right);
                    break;
                case 34:
                    drawBlock(colI, rowI, blocks.house.gate, "#ffc0cb");
                    break;
            }
        })
    })
}

const update = () => {
    pacman.update()

    blinky.update()
    inky.update()
    pinky.update()

    //console.log("pacman: " + pacmanTimer + " blinky: " + blinkyTimer + " inky: " + inkyTimer)


    if(matrix[pacman.realY][pacman.realX] == 2){
        matrix[pacman.realY][pacman.realX] = 0;
        score++;
    }
}
const render = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    
    drawMap();

    pacman.draw()

    blinky.draw()
    inky.draw()
    pinky.draw()
}

let timer = 0;
let updateTook = 0;
setInterval(() => {
    if(Date.now() - timer >= 1000 / 120){
        updateTook = Date.now();
        update();
        render();
        updateTook = Date.now() - updateTook;
        //console.log("Update took: " + updateTook + "ms");

        timer = Date.now();
    }
}, 1);

let pacmanTimer = 0;
setInterval(() => {
    if(Date.now() - pacmanTimer >= 1000 / 36){

        if(pacman.x == pacman.lastX && pacman.y == pacman.lastY) return;

        if(!pacman.stateChange){
            if(pacman.state == 2){
                pacman.stateChange = 1;
                return;
            }
            pacman.state++;
        } else {
            if(pacman.state == 0){
                pacman.stateChange = 0;
                return;
            }
            pacman.state--;
        }

        pacmanTimer = Date.now();
    }
}, 1);
let ghostTimer = 0;
setInterval(() => {
    if(Date.now() - ghostTimer >= 1000 / 12){

        blinky.state = blinky.state == 0 ? 1 : 0;
        inky.state = inky.state == 0 ? 1 : 0;
        pinky.state = pinky.state == 0 ? 1 : 0;

        ghostTimer = Date.now();
    }
}, 1);

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
    if(e.key == "e"){
        blinky.dir++;
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

// requires scale to be at 20
/*let tmp = 30;
canvas.addEventListener("click", e => {
    const rect = e.target.getBoundingClientRect();
    const x = Math.floor((e.clientX - rect.left) / scale);
    const y = Math.floor((e.clientY - rect.top) / scale);
    matrix[y][x] = 34;
    tmp++
    console.log(JSON.stringify(matrix))
})*/