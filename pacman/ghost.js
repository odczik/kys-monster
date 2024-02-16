function Ghost({who, startX, startY, delay, color}){
    this.dir = 0;
    this.nextDir = 4;
    //this.x = scale * 13.5;
    this.x = scale * startX;
    this.y = scale * startY;
    this.realX = 0;
    this.realY = 0;
    this.lastRealX = 0;
    this.lastRealY = 0;
    this.lastPathEnd = {x: 0, y: 0};
    this.path = [];
    this.timer = Date.now();

    this.draw = () => {
        ctx.beginPath();
        ctx.fillStyle = color;
        ctx.arc(this.x + (scale / 2), this.y + (scale / 2), scale / 2, 0, Math.PI * 2);
        ctx.fill();

        /*ctx.beginPath();
        ctx.fillStyle = "#000";
        ctx.moveTo(this.x + (scale / 2), this.y + (scale / 2));
        ctx.lineTo(this.x + (scale / 2), (this.y + (scale / 2)) + 25);
        ctx.lineTo(this.x + (scale / 2), (this.y + (scale / 2)) - 25);
        ctx.fill();*/
    }

    this.update = () => {
        if(Date.now() - this.timer < delay) return;

        this.realX = Math.round(this.x / scale);
        this.realY = Math.round(this.y / scale);

        // find path to pacman if he or ghost moves
        if(
        this.lastPathEnd.x !== pacman.realX || 
        this.lastPathEnd.y !== pacman.realY ||
        this.lastRealX !== this.realX ||
        this.lastRealY !== this.realY /*||
        this.lastPathEnd.x !== this.path[this.path.length - 2].x || 
        this.lastPathEnd.y !== this.path[this.path.length - 2].y*/){ // if pacman or ghost moved or path changed

            let dest;
            switch(who){
                case "blinky":
                    dest = {x: pacman.realX, y: pacman.realY};
                    break;
                case "inky":
                    switch(pacman.dir){
                        case 0: // up
                            dest = {x: pacman.realX, y: pacman.realY - 4};
                            break;
                        case 1: // down
                            dest = {x: pacman.realX, y: pacman.realY + 4};
                            break;
                        case 2: // left
                            dest = {x: pacman.realX - 4, y: pacman.realY};
                            break;
                        case 3: // right
                            dest = {x: pacman.realX + 4, y: pacman.realY};
                            break;
                    }
                    break;
                case "pinky":
                    break;
                case "clyde":
                    break;
            }

            let timer = Date.now()
            this.path = findPath(matrix, {x: this.realX, y: this.realY}, dest, true, 1)
            timer = Date.now() - timer
            console.log(timer, "ms")

            this.lastPathEnd = {x: pacman.realX, y: pacman.realY}
        }

        if(color){
            let lastNode = this.path[0];
            this.path.forEach((node, i) => {
                ctx.beginPath();
                ctx.moveTo((lastNode.x * scale) + (scale / 2), (lastNode.y * scale) + (scale / 2));
                ctx.lineTo((node.x * scale) + (scale / 2), (node.y * scale) + (scale / 2));
                ctx.lineWidth = 1;
                ctx.strokeStyle = color;
                ctx.stroke();
                lastNode = node;
            })
        }

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

        // change dir towards next node
        if(this.realX !== this.lastRealX || this.realY !== this.lastRealY){
            let nextNode = this.path[this.path.length - 2];
            if(nextNode){
                if(this.realX < nextNode.x){
                    this.dir = 3;
                } else if(this.realX > nextNode.x){
                    this.dir = 2;
                } else if(this.realY < nextNode.y){
                    this.dir = 1;
                } else if(this.realY > nextNode.y){
                    this.dir = 0;
                }
            }
            this.lastRealX = this.realX;
            this.lastRealY = this.realY;
        }

        // movement
        switch(this.dir){
            case 0: // up
                if(matrix[this.realY - 1][this.realX] !== 1){
                    this.y--;
                }
                break;
            case 1: // down
                if(matrix[this.realY + 1][this.realX] !== 1){
                    this.y++;
                }
                break;
            case 2: // left
                if(matrix[this.realY][this.realX - 1] !== 1){
                    this.x--;
                }
                break;
            case 3: // right
                if(matrix[this.realY][this.realX + 1] !== 1){
                    this.x++;
                }
                break;
        }
    }
}