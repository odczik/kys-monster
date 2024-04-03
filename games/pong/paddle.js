function Paddle({side}){
    this.width = scale;
    this.height = scale * 5;
    this.x = side == "left" ? scale : canvas.width - scale * 2;
    this.y = canvas.height / 2 - this.height / 2;
    this.score = 0;
    this.ai = side == "left" ? 0 : 1;

    this.draw = () => {
        ctx.fillStyle = 'white';
        ctx.fillRect(this.x, this.y, this.width, this.height);

        ctx.font = `${scale}px Arial`;
        ctx.fillText(this.score, side == "left" ? scale * 5 : canvas.width - scale * 6, scale * 2)
    }

    this.update = () => {
        if(!ball.started) return;

        if(keysDown.includes("w") && side == "left") this.y -= speed;
        if(keysDown.includes("s") && side == "left") this.y += speed;

        if(keysDown.includes("ArrowUp") && side == "right") this.y -= speed;
        if(keysDown.includes("ArrowDown") && side == "right") this.y += speed;

        if(this.ai && ball.xDir && ball.x > canvas.width / 2){
            if(ball.y + scale > this.y + this.height / 2){
                this.y += speed;
            } else {
                this.y -= speed;
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