function Ball(){
    this.x = canvas.width/2;
    this.y = canvas.height/2;
    this.xDir = Math.round(Math.random());
    this.yDir = Math.round(Math.random());
    this.started = false;

    this.draw = () => {
        ctx.fillStyle = 'white';
        ctx.fillRect(this.x, this.y, scale, scale);
    }

    this.update = () => {
        if(!this.started) return;

        if(this.x + scale < 0){
            this.reset()
            paddle1.reset();
            paddle2.reset();
            paddle2.score++;
        }
        if(this.x > canvas.width){
            this.reset() 
            paddle1.reset();
            paddle2.reset();
            paddle1.score++;
        }

        if(this.x <= paddle1.x + paddle1.width && this.x >= paddle1.x && this.y <= paddle1.y + paddle1.height && this.y + scale >= paddle1.y){
            this.xDir = 1;
        }
        if(this.x + scale >= paddle2.x && this.x <= paddle2.x + paddle2.width && this.y <= paddle2.y + paddle2.height && this.y + scale >= paddle2.y){
            this.xDir = 0;
        }

        this.xDir ? this.x += speed : this.x -= speed;
        this.yDir ? this.y += speed : this.y -= speed;

        if(this.y <= 0 || this.y >= canvas.height - scale){
            this.yDir = !this.yDir;
        }
    }

    this.reset = () => {
        this.started = false;

        this.x = canvas.width/2;
        this.y = canvas.height/2;
        this.xDir = Math.round(Math.random());
        this.yDir = Math.round(Math.random());

        setTimeout(() => {
            this.started = true;
        }, 1000)
    }
}