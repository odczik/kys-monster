function Pacman(){
    this.dir = 4;
    this.nextDir = 4;
    this.x = scale * 13.5;
    this.y = scale * 17;
    this.lastX = scale * 13.5;
    this.lastY = scale * 17;
    this.realX = 0;
    this.realY = 0;
    this.state = 1;
    this.stateChange = 0;

    /*const pacman = [
        [
            [0,0,0,0,1,1,1,1,1,0,0,0,0],
            [0,0,1,1,1,1,1,1,1,1,1,0,0],
            [0,1,1,1,1,1,1,1,1,1,1,1,0],
            [0,0,0,1,1,1,1,1,1,1,1,1,0],
            [0,0,0,0,0,0,1,1,1,1,1,1,1],
            [0,0,0,0,0,0,0,0,1,1,1,1,1],
            [0,0,0,0,0,0,0,0,0,1,1,1,1],
            [0,0,0,0,0,0,0,0,1,1,1,1,1],
            [0,0,0,0,0,0,1,1,1,1,1,1,1],
            [0,0,0,1,1,1,1,1,1,1,1,1,0],
            [0,1,1,1,1,1,1,1,1,1,1,1,0],
            [0,0,1,1,1,1,1,1,1,1,1,0,0],
            [0,0,0,0,1,1,1,1,1,0,0,0,0]
        ],
        [
            [0,0,0,0,1,1,1,1,1,0,0,0,0],
            [0,0,1,1,1,1,1,1,1,1,1,0,0],
            [0,1,1,1,1,1,1,1,1,1,1,1,0],
            [0,1,1,1,1,1,1,1,1,1,1,1,0],
            [0,0,0,1,1,1,1,1,1,1,1,1,1],
            [0,0,0,0,0,0,1,1,1,1,1,1,1],
            [0,0,0,0,0,0,0,0,0,1,1,1,1],
            [0,0,0,0,0,0,1,1,1,1,1,1,1],
            [0,0,0,1,1,1,1,1,1,1,1,1,1],
            [0,1,1,1,1,1,1,1,1,1,1,1,0],
            [0,1,1,1,1,1,1,1,1,1,1,1,0],
            [0,0,1,1,1,1,1,1,1,1,1,0,0],
            [0,0,0,0,1,1,1,1,1,0,0,0,0]
        ],
        [
            [0,0,0,0,1,1,1,1,1,0,0,0,0],
            [0,0,1,1,1,1,1,1,1,1,1,0,0],
            [0,1,1,1,1,1,1,1,1,1,1,1,0],
            [0,1,1,1,1,1,1,1,1,1,1,1,0],
            [1,1,1,1,1,1,1,1,1,1,1,1,1],
            [1,1,1,1,1,1,1,1,1,1,1,1,1],
            [1,1,1,1,1,1,1,1,1,1,1,1,1],
            [1,1,1,1,1,1,1,1,1,1,1,1,1],
            [1,1,1,1,1,1,1,1,1,1,1,1,1],
            [0,1,1,1,1,1,1,1,1,1,1,1,0],
            [0,1,1,1,1,1,1,1,1,1,1,1,0],
            [0,0,1,1,1,1,1,1,1,1,1,0,0],
            [0,0,0,0,1,1,1,1,1,0,0,0,0]
        ]
    ]*/

    const pacman = [
        [
            [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,1,1,1,1,1,1,0,0,0,0,0],
            [0,0,0,0,1,1,1,1,1,1,1,1,1,0,0,0],
            [0,0,0,0,0,1,1,1,1,1,1,1,1,1,0,0],
            [0,0,0,0,0,0,1,1,1,1,1,1,1,1,0,0],
            [0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,0],
            [0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,0],
            [0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,0],
            [0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,0],
            [0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,0],
            [0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,0],
            [0,0,0,0,0,0,1,1,1,1,1,1,1,1,0,0],
            [0,0,0,0,0,1,1,1,1,1,1,1,1,1,0,0],
            [0,0,0,0,1,1,1,1,1,1,1,1,1,0,0,0],
            [0,0,0,0,0,1,1,1,1,1,1,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
        ],
        [
            [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,1,1,1,1,1,1,0,0,0,0,0],
            [0,0,0,1,1,1,1,1,1,1,1,1,1,0,0,0],
            [0,0,1,1,1,1,1,1,1,1,1,1,1,1,0,0],
            [0,0,0,1,1,1,1,1,1,1,1,1,1,1,0,0],
            [0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,0],
            [0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,0],
            [0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,0],
            [0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,0],
            [0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,0],
            [0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,0],
            [0,0,0,1,1,1,1,1,1,1,1,1,1,1,0,0],
            [0,0,1,1,1,1,1,1,1,1,1,1,1,1,0,0],
            [0,0,0,1,1,1,1,1,1,1,1,1,1,0,0,0],
            [0,0,0,0,0,1,1,1,1,1,1,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
        ],
        [
            [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,1,1,1,1,1,1,0,0,0,0,0],
            [0,0,0,1,1,1,1,1,1,1,1,1,1,0,0,0],
            [0,0,1,1,1,1,1,1,1,1,1,1,1,1,0,0],
            [0,0,1,1,1,1,1,1,1,1,1,1,1,1,0,0],
            [0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0],
            [0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0],
            [0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0],
            [0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0],
            [0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0],
            [0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0],
            [0,0,1,1,1,1,1,1,1,1,1,1,1,1,0,0],
            [0,0,1,1,1,1,1,1,1,1,1,1,1,1,0,0],
            [0,0,0,1,1,1,1,1,1,1,1,1,1,0,0,0],
            [0,0,0,0,0,1,1,1,1,1,1,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
        ],
    ]

    const rotateMatrix = (pacmanMatrix) => {
        let newMatrix = [];
        for(let i = 0; i < pacmanMatrix.length; i++){
            newMatrix.push([]);
        }

        for(let i = 0; i < pacmanMatrix.length; i++){
            for(let j = 0; j < pacmanMatrix[i].length; j++){
                newMatrix[j].push(pacmanMatrix[i][j]);
            }
        }

        return newMatrix;
    }
    const flipMatrixVertically = (pacmanMatrix) => {
        let newMatrix = [];
        for(let i = 0; i < pacmanMatrix.length; i++){
            newMatrix.push([]);
        }

        for(let i = 0; i < pacmanMatrix.length; i++){
            for(let j = 0; j < pacmanMatrix[i].length; j++){
                newMatrix[i].unshift(pacmanMatrix[i][j]);
            }
        }

        return newMatrix;
    }

    const drawPacman = (x, y) => {
        ctx.fillStyle = "#ff0";
        
        let rotatedPacman;
        switch(this.dir){
            case 0: // up
                rotatedPacman = rotateMatrix(pacman[this.state]);
                break;
            case 1: // down
                // TODO: flip vertically
                rotatedPacman = rotateMatrix(flipMatrixVertically(pacman[this.state]));
                break;
            case 2: // left
                rotatedPacman = pacman[this.state];
                break;
            case 3: // right
                rotatedPacman = flipMatrixVertically(pacman[this.state]);
                break;
            case 4:
                rotatedPacman = pacman[this.state];
                break;
        }
        
        rotatedPacman.forEach((row, rowI) => {
            row.forEach((col, colI) => {
                if(col){
                    //ctx.fillRect(x - (scale / 4) + (colI * 4), y - (scale / 4) + (rowI * 4), 4, 4);
                    ctx.fillRect(x + (colI * scale / 8) - (scale / 2), y + (rowI * scale / 8) - (scale / 2), scale / 8, scale / 8);
                }
            })
        })
    }

    this.draw = () => {
        drawPacman(this.x, this.y);
    }

    this.update = () => {
        this.realX = Math.round(this.x / scale);
        this.realY = Math.round(this.y / scale);

        // round real position by direction
        switch(this.dir){
            case 0: // up
                this.realY = Math.ceil(this.y / scale)
                break;
            case 1: // down
                this.realY = Math.floor(this.y / scale)
                break;
            case 2: // left
                this.realX = Math.ceil(this.x / scale)
                break;
            case 3: // right
                this.realX = Math.floor(this.x / scale)
                break;
        }

        // debug
        //console.log("dir:", this.dir, "nextDir:", this.nextDir, "x:", this.x, "y:", this.y, "realX:", this.realX, "realY:", this.realY)

        // change dir to nextDir if can
        if(this.dir !== this.nextDir){
            switch(this.nextDir){
                case 0: // up
                    if(matrix[this.realY - 1][this.realX] == 0 || matrix[this.realY - 1][this.realX] == 2){
                        if(this.x == this.realX * scale) this.dir = 0;
                    }
                    break;
                case 1: // down
                    if(matrix[this.realY + 1][this.realX] == 0 || matrix[this.realY + 1][this.realX] == 2){
                        if(this.x == this.realX * scale) this.dir = 1;
                    }
                    break;
                case 2: // left
                    if(matrix[this.realY][this.realX - 1] == 0 || matrix[this.realY][this.realX - 1] == 2){
                        if(this.y == this.realY * scale) this.dir = 2;
                    }
                    break;
                case 3: // right
                    if(matrix[this.realY][this.realX + 1] == 0 || matrix[this.realY][this.realX + 1] == 2){
                        if(this.y == this.realY * scale) this.dir = 3;
                    }
                    break;
            }
        }

        this.lastX = this.x;
        this.lastY = this.y;

        // movement
        switch(this.dir){
            case 0: // up
                if(matrix[this.realY - 1][this.realX] == 0 || matrix[this.realY - 1][this.realX] == 2){
                    this.y-=4;
                }
                break;
            case 1: // down
                if(matrix[this.realY + 1][this.realX] == 0 || matrix[this.realY + 1][this.realX] == 2){
                    this.y+=4;
                }
                break;
            case 2: // left
                if(matrix[this.realY][this.realX - 1] == 0 || matrix[this.realY][this.realX - 1] == 2){
                    this.x-=4;
                }
                break;
            case 3: // right
                if(matrix[this.realY][this.realX + 1] == 0 || matrix[this.realY][this.realX + 1] == 2){
                    this.x+=4;
                }
                break;
        }
    }
}