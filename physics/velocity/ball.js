function Ball(){
    this.x = window.innerWidth / 2;
    this.y = window.innerHeight / 2;
    this.lastX = this.x;
    this.lastY = this.y;
    this.velocityX = 0;
    this.velocityY = 0;
    this.veloctityDir = 0;
    this.velocitySize = 0;
    this.top = this.y - scale / 2;
    this.bot = this.y + scale / 2;
    this.left = this.x - scale / 2;
    this.right = this.x + scale / 2;

    const updateVelX = () => {
        this.x += this.velocityX;

        this.left = this.x - scale / 2;
        this.right = this.x + scale / 2;
        
        // bounce off walls
        if(this.right > canvas.width){
            this.x = canvas.width - scale / 2;
            this.velocityX *= -0.8;
        }
        if(this.left < 0){
            this.x = scale / 2;
            this.velocityX *= -0.8;
        }

        // gradually slow down (air resistance)
        if(this.velocityX > 0){
            this.velocityX -= airResistance;
        } else {
            this.velocityX += airResistance;
        }

        /*if(this.lastX === this.x){
            this.velocityX = 0;
        }*/
        this.lastX = this.x;
    }
    const updateVelY = () => {
        this.velocityY += 0.7;
        this.y += this.velocityY;

        this.top = this.y - scale / 2;
        this.bot = this.y + scale / 2;
        
        // bounce off walls
        if(this.top < 0){
            this.y = scale / 2;
            this.velocityY *= -0.8;
        }
        if(this.bot > canvas.height){
            this.y = canvas.height - scale / 2;
            this.velocityY *= -0.8;
        }

        // gradually slow down (air resistance)
        if(this.velocityY > 0){
            this.velocityY -= airResistance;
        } else {
            this.velocityY += airResistance;
        }


        /*if(this.lastY === this.y){
            this.velocityY = 0;
        }*/
        this.lastY = this.y;
    }
    this.update = () => {
        updateVelX();
        updateVelY();

        this.veloctityDir = Math.atan2(this.velocityY, this.velocityX);
        this.velocitySize = Math.sqrt(Math.pow(this.velocityX, 2) + Math.pow(this.velocityY, 2));

        //console.log(this.bot, this.y)
        //console.log(this.y, this.lastY, this.velocityY);
    }

    this.draw = () => {
        ctx.beginPath();
        ctx.strokeStyle = 'red';
        ctx.lineWidth = 3;
        ctx.arc(ball.x, ball.y, scale / 2 - ctx.lineWidth, 0, Math.PI * 2);
        ctx.stroke();
        ctx.closePath();

        ctx.beginPath();
        ctx.strokeStyle = 'green';
        ctx.moveTo(this.x, this.y);
        ctx.lineTo(this.x + Math.cos(this.veloctityDir) * this.velocitySize * 3, this.y + Math.sin(this.veloctityDir) * this.velocitySize * 3);
        ctx.stroke();
        ctx.closePath();
    }
}
