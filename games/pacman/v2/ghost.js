function Ghost({who, startX, startY, delay, color}){
    this.dir = 0;
    this.nextDir = 4;
    this.x = scale * startX;
    this.y = scale * startY;
    this.realX = 0;
    this.realY = 0;
    this.lastRealX = 0;
    this.lastRealY = 0;
    this.lastPathEnd = {x: 0, y: 0};
    this.path = [];
    this.timer = Date.now();
    this.state = 0;

    const ghost = [
        [
            [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,1,1,1,1,0,0,0,0,0,0],
            [0,0,0,0,1,1,1,1,1,1,1,1,0,0,0,0],
            [0,0,0,1,1,1,1,1,1,1,1,1,1,0,0,0],
            [0,0,1,1,1,1,1,1,1,1,1,1,1,1,0,0],
            [0,0,1,1,1,1,1,1,1,1,1,1,1,1,0,0],
            [0,0,1,1,1,1,1,1,1,1,1,1,1,1,0,0],
            [0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0],
            [0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0],
            [0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0],
            [0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0],
            [0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0],
            [0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0],
            [0,1,1,0,1,1,1,0,0,1,1,1,0,1,1,0],
            [0,1,0,0,0,1,1,0,0,1,1,0,0,0,1,0],
            [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
        ],
        [
            [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,1,1,1,1,0,0,0,0,0,0],
            [0,0,0,0,1,1,1,1,1,1,1,1,0,0,0,0],
            [0,0,0,1,1,1,1,1,1,1,1,1,1,0,0,0],
            [0,0,1,1,1,1,1,1,1,1,1,1,1,1,0,0],
            [0,0,1,1,1,1,1,1,1,1,1,1,1,1,0,0],
            [0,0,1,1,1,1,1,1,1,1,1,1,1,1,0,0],
            [0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0],
            [0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0],
            [0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0],
            [0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0],
            [0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0],
            [0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0],
            [0,1,1,1,1,0,1,1,1,1,0,1,1,1,1,0],
            [0,0,1,1,0,0,0,1,1,0,0,0,1,1,0,0]
        ],
    ]

    const drawGhost = (x, y, color) => {
        ghost[this.state].forEach((row, rowI) => {
            row.forEach((col, colI) => {
                switch(col){
                    case 1:
                        ctx.fillStyle = color;
                        break;
                    case 2:
                        ctx.fillStyle = "#fff";
                        break;
                    case 3:
                        ctx.fillStyle = "#000";
                        break;
                    default:
                        ctx.fillStyle = "transparent";
                        return;
                }
                //ctx.fillRect(x + (colI * scale / 10) *1.2 - 14, y + (rowI * scale / 10) * 1.2 - 14, scale / 10 * 1.2, scale / 10 * 1.2);
                ctx.fillRect(x + (colI * scale / 8) - (scale / 2), y + (rowI * scale / 8) - (scale / 2), scale / 8, scale / 8);
            })
        })
    }

    this.draw = () => {
        drawGhost(this.x, this.y, color);
    }

    this.update = () => {
        if(Date.now() - this.timer < delay) return;

        this.realX = Math.round(this.x / scale);
        this.realY = Math.round(this.y / scale);
        

        let dest = {x: pacman.x + scale / 2, y: pacman.y + scale / 2};
        switch(who){
            case "blinky":
                dest = {x: pacman.x + scale / 2, y: pacman.y + scale / 2};
                break;
            case "inky":
                switch(pacman.dir){
                    case 0: // up
                        dest = {x: (pacman.x + scale / 2) - scale * 2, y: (pacman.y + scale / 2) - scale * 2};
                        break;
                    case 1: // right
                        dest = {x: (pacman.x + scale / 2) + scale * 2, y: (pacman.y + scale / 2) - scale * 2};
                        break;
                    case 2: // down
                        dest = {x: (pacman.x + scale / 2), y: (pacman.y + scale / 2) + scale * 2};
                        break;
                    case 3: // left
                        dest = {x: (pacman.x + scale / 2) - scale * 2, y: (pacman.y + scale / 2)};
                        break;
                }
                break;
            case "pinky":
                break;
            case "clyde":
                break;
        }

        // round real position by direction
        switch(this.dir){
            case 0: // up
                this.realY = Math.ceil(this.y / scale)
                break;
            case 1: // right
                this.realX = Math.floor(this.x / scale)
                break;
            case 2: // down
                this.realY = Math.floor(this.y / scale)
                break;
            case 3: // left
                this.realX = Math.ceil(this.x / scale)
                break;
        }

        // change dir towards dest point
        /*const paths = [this.dir - 1, this.dir, this.dir + 1];
        paths.forEach((path, i) => {
            switch(path){
                case -1:
                    paths[i] = 3;
                    break;
                case 4:
                    paths[i] = 0;
                    break;
            }
        })*/
        const paths = [];
        for(let i = 0; i < 4; i++){
            if(paths[i] == this.dir - 2 || paths[i] == this.dir + 2){
                paths.splice(i, 1);
            } else {
                paths.push(i)
            }
            switch(i){
                case 0:
                    if(matrix[this.realY - 1][this.realX] !== 0 || matrix[this.realY - 1][this.realX] !== 2){
                        paths.splice(i, 1);
                    }
                    break;
                case 1:
                    if(matrix[this.realY][this.realX + 1] !== 0 || matrix[this.realY][this.realX + 1] !== 2){
                        paths.splice(i, 1);
                    }
                    break;
                case 2:
                    if(matrix[this.realY + 1][this.realX] !== 0 || matrix[this.realY + 1][this.realX] !== 2){
                        paths.splice(i, 1);
                    }
                    break;
                case 3:
                    if(matrix[this.realY][this.realX - 1] !== 0 || matrix[this.realY][this.realX - 1] !== 2){
                        paths.splice(i, 1);
                    }
                    break;
            }
        }
        console.log(this.realX, this.realY, paths)

        if(this.x + scale / 2 < dest.x){
            
            /*paths.forEach(path => {
                switch(path){
                    case 0: // up
                        if(matrix[this.realY - 1][this.realX] == 0 || matrix[this.realY - 1][this.realX] == 2 || matrix[this.realY - 1][this.realX] == 34){
                            if(this.x == this.realX * scale) this.dir = 0;
                        }
                        break;
                    case 1: // right
                        if(matrix[this.realY][this.realX + 1] == 0 || matrix[this.realY][this.realX + 1] == 2 || matrix[this.realY][this.realX + 1] == 34){
                            if(this.y == this.realY * scale) this.dir = 1;
                        }
                        break;
                    case 2: // down
                        if(matrix[this.realY + 1][this.realX] == 0 || matrix[this.realY + 1][this.realX] == 2 || matrix[this.realY + 1][this.realX] == 34){
                            if(this.x == this.realX * scale) this.dir = 2;
                        }
                        break;
                    case 3: // left
                        if(matrix[this.realY][this.realX - 1] == 0 || matrix[this.realY][this.realX - 1] == 2 || matrix[this.realY][this.realX - 1] == 34){
                            if(this.y == this.realY * scale) this.dir = 3;
                        }
                        break;
                }
            }*/
        }

        // movement
        switch(this.dir){
            case 0: // up
                if(matrix[this.realY - 1][this.realX] == 0 || matrix[this.realY - 1][this.realX] == 2 || matrix[this.realY - 1][this.realX] == 34){
                    this.y-=2;
                }
                break;
            case 1: // right
                if(matrix[this.realY][this.realX + 1] == 0 || matrix[this.realY][this.realX + 1] == 2 || matrix[this.realY][this.realX + 1] == 34){
                    this.x+=2;
                }
                break;
            case 2: // down
                if(matrix[this.realY + 1][this.realX] == 0 || matrix[this.realY + 1][this.realX] == 2 || matrix[this.realY + 1][this.realX] == 34){
                    this.y+=2;
                }
                break;
            case 3: // left
                if(matrix[this.realY][this.realX - 1] == 0 || matrix[this.realY][this.realX - 1] == 2 || matrix[this.realY][this.realX - 1] == 34){
                    this.x-=2;
                }
                break;
        }
    }
}