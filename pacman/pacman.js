function Pacman(){
    this.dir = 3;
    this.nextDir = 3;
    this.x = scale;
    this.y = scale * 14;
    this.realX = 0;
    this.realY = 0;

    this.draw = () => {
        ctx.beginPath();
        ctx.fillStyle = "#ff0";
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
        console.log("dir:", this.dir, "nextDir:", this.nextDir, "x:", this.x, "y:", this.y, "realX:", this.realX, "realY:", this.realY)

        // change dir to nextDir if can
        if(this.dir !== this.nextDir){
            switch(this.nextDir){
                case 0: // up
                    if(matrix[this.realY - 1][this.realX] !== 1){
                        if(this.x == this.realX * scale) this.dir = 0;
                    }
                    break;
                case 1: // down
                    if(matrix[this.realY + 1][this.realX] !== 1){
                        if(this.x == this.realX * scale) this.dir = 1;
                    }
                    break;
                case 2: // left
                    if(matrix[this.realY][this.realX - 1] !== 1){
                        if(this.y == this.realY * scale) this.dir = 2;
                    }
                    break;
                case 3: // right
                    if(matrix[this.realY][this.realX + 1] !== 1){
                        if(this.y == this.realY * scale) this.dir = 3;
                    }
                    break;
            }
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