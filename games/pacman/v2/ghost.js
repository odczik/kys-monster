function Ghost({who, startX, startY, delay, color}){
    this.dir = 0;
    this.nextDir = 0;
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
    this.dest = {x: this.x, y: this.y};

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

    const heuristic = (pos0, pos1) => {
        var d1 = Math.pow(Math.abs(pos1.x - pos0.x), 2);
        var d2 = Math.pow(Math.abs(pos1.y - pos0.y), 2);
        return Math.sqrt(d1 + d2);
    }

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

        // draw dest
        if(showDebug){
            ctx.fillStyle = color;
            ctx.fillRect(this.dest.x * scale - 10, this.dest.y * scale - 10, 20, 20);
        }
        }

    const pinkyDest = () => {
        switch(pacman.dir){
            case 0: // up
                return {x: pacman.realX + 0.5 - 4, y: pacman.realY + 0.5 - 4};
            case 1: // down
                return {x: pacman.realX + 0.5, y: pacman.realY + 0.5 + 4};
            case 2: // left
                return {x: pacman.realX + 0.5 - 4, y: pacman.realY + 0.5};
            case 3: // right
                return {x: pacman.realX + 0.5 + 4, y: pacman.realY + 0.5};
        }
    }
    this.update = () => {
        if(Date.now() - this.timer < delay) return;

        this.realX = Math.round(this.x / scale);
        this.realY = Math.round(this.y / scale);

        this.dest = {x: pacman.realX + 0.5, y: pacman.realY + 0.5};
        switch(who){
            case "blinky":
                this.dest = {x: pacman.realX + 0.5, y: pacman.realY + 0.5};
                break;
            case "inky":
                const tmpDest = pinkyDest()
                this.dest = {x: tmpDest.x + (tmpDest.x - blinky.realX), y: tmpDest.y + (tmpDest.y - blinky.realY)}
                break;
            case "pinky":
                this.dest = pinkyDest()
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

        // get available paths
        let paths = [];
        if(matrix[this.realY - 1][this.realX] === 0 || matrix[this.realY - 1][this.realX] === 2) paths.push(0);
        if(matrix[this.realY][this.realX + 1] === 0 || matrix[this.realY][this.realX + 1] === 2) paths.push(1);
        if(matrix[this.realY + 1][this.realX] === 0 || matrix[this.realY + 1][this.realX] === 2) paths.push(2);
        if(matrix[this.realY][this.realX - 1] === 0 || matrix[this.realY][this.realX - 1] === 2) paths.push(3);
        // can't go back
        paths.forEach((path, i) => {
            if(path - 2 === this.dir || path + 2 === this.dir) paths.splice(i, 1);
        })

        paths.forEach((path, i) => {
            switch(path){
                case 0: // up
                    paths[i] = {x: this.realX, y: this.realY - 1, weight: heuristic({x: this.realX, y: this.realY - 1}, this.dest)};
                    if((paths[i].y == 12 || paths[i].y == 24) && (paths[i].x == 12 || paths[i].x == 15)) paths.splice(i, 1);
                    break;
                case 1: // right
                    paths[i] = {x: this.realX + scale, y: this.realY, weight: heuristic({x: this.realX + 1, y: this.realY}, this.dest)};
                    break;
                case 2: // down
                    paths[i] = {x: this.realX, y: this.realY + 1, weight: heuristic({x: this.realX, y: this.realY + 1}, this.dest)};
                    break;
                case 3: // left
                    paths[i] = {x: this.realX - scale, y: this.realY, weight: heuristic({x: this.realX - 1, y: this.realY}, this.dest)};
                    break;
            }
        })

        paths.sort((a, b) => a.weight - b.weight);
        const nextNode = paths[0];
        //console.log(this.realX, this.realY, this.dir, paths);

        if(nextNode){
            if(nextNode.x < this.realX) this.nextDir = 3;
            if(nextNode.x > this.realX) this.nextDir = 1;
            if(nextNode.y < this.realY) this.nextDir = 0;
            if(nextNode.y > this.realY) this.nextDir = 2;
        }

        // change dir to nextDir if can
        if(this.dir !== this.nextDir){
            switch(this.nextDir){
                case 0: // up
                    if(matrix[this.realY - 1][this.realX] == 0 || matrix[this.realY - 1][this.realX] == 2){
                        if(this.x == this.realX * scale) this.dir = 0;
                    }
                    break;
                case 1: // right
                    if(matrix[this.realY][this.realX + 1] == 0 || matrix[this.realY][this.realX + 1] == 2){
                        if(this.y == this.realY * scale) this.dir = 1;
                    }
                    break;
                case 2: // down
                    if(matrix[this.realY + 1][this.realX] == 0 || matrix[this.realY + 1][this.realX] == 2){
                        if(this.x == this.realX * scale) this.dir = 2;
                    }
                    break;
                case 3: // left
                    if(matrix[this.realY][this.realX - 1] == 0 || matrix[this.realY][this.realX - 1] == 2){
                        if(this.y == this.realY * scale) this.dir = 3;
                    }
                    break;
            }
        }

        if((this.x > 13.5 * scale && this.x < 17 * scale) && this.y == 16 * scale) this.dir = 3;
        if((this.x < 13.5 * scale && this.x > 9 * scale) && this.y == 16 * scale) this.dir = 1;

        if((this.x > 13.4 * scale && this.x < 13.6 * scale) && (this.realY <= 16 && this.realY >= 14)) this.dir = 0;

        // movement
        switch(this.dir){
            case 0: // up
                if(matrix[this.realY - 1][this.realX] == 0 || matrix[this.realY - 1][this.realX] == 2 || matrix[this.realY - 1][this.realX] == 34){
                    this.y-=4;
                }
                break;
            case 1: // right
                if(matrix[this.realY][this.realX + 1] == 0 || matrix[this.realY][this.realX + 1] == 2 || matrix[this.realY][this.realX + 1] == 34){
                    this.x+=4;
                }
                break;
            case 2: // down
                if(matrix[this.realY + 1][this.realX] == 0 || matrix[this.realY + 1][this.realX] == 2 || matrix[this.realY + 1][this.realX] == 34){
                    this.y+=4;
                }
                break;
            case 3: // left
                if(matrix[this.realY][this.realX - 1] == 0 || matrix[this.realY][this.realX - 1] == 2 || matrix[this.realY][this.realX - 1] == 34){
                    this.x-=4;
                }
                break;
        }
        if(this.x <= scale && this.y == 14 * scale){
            if(this.dir == 3) this.x-=4;
            if(this.x < -1 * scale) this.x = 28 * scale
        }
        if(this.x >= 27 * scale && this.y == 14 * scale){
            if(this.dir == 1) this.x+=4;
            if(this.x > 29 * scale) this.x = -1 * scale
        }
    }
}