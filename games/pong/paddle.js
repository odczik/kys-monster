function Paddle({side}){
    this.width = scale;
    this.height = scale * 5;
    this.x = side == "left" ? scale : canvas.width - scale * 2;
    this.y = canvas.height / 2 - this.height / 2;
    this.score = 0;
    this.ai = side == "left" ? 0 : "smart";
    this.speed = speed

    this.draw = () => {
        ctx.fillStyle = 'white';
        ctx.fillRect(this.x, this.y, this.width, this.height);

        ctx.font = `${scale}px Arial`;
        ctx.fillText(this.score, side == "left" ? scale * 5 : canvas.width - scale * 6, scale * 2)
    }

    this.update = () => {
        if(!ball.started) return;

        if(keysDown["w"] && side == "left") this.y -= this.speed;
        if(keysDown["s"] && side == "left") this.y += this.speed;

        if(keysDown["arrowup"] && side == "right") this.y -= this.speed;
        if(keysDown["arrowdown"] && side == "right") this.y += this.speed;

        if(this.ai == "dumb" && ball.xDir){
            if(ball.y + scale > this.y + this.height / 2){
                this.y += this.speed;
            } else {
                this.y -= this.speed;
            }
        }
        if(this.ai == "smart" && ball.xDir){
            if(this.y + this.height / 2 < ball.interceptPoint.y - speed / 2){
                this.y += this.speed;
            } else if(this.y + this.height / 2 > ball.interceptPoint.y + speed / 2){
                this.y -= this.speed;
            }
        }
        if(this.ai && !ball.xDir){
            if(this.y + this.height / 2 < canvas.height / 2){
                this.y += this.speed;
            } else if(this.y + this.height / 2 > canvas.height / 2){
                this.y -= this.speed;
            }
        }

        if(this.y < 0){
            this.y = 0;
        }
        if(this.y + this.height > canvas.height){
            this.y = canvas.height - this.height;
        }
    }

    this.reset = () => {
        this.y = canvas.height / 2 - this.height / 2;
    }
}