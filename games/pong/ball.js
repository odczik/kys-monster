function Ball(){
    this.x = canvas.width/2;
    this.y = canvas.height/2;
    this.xDir = Math.round(Math.random());
    this.yDir = Math.round(Math.random());
    this.started = false;
    this.speed = speed * 1.5;
    this.center = {
        x: this.x + scale / 2,
        y: this.y + scale / 2
    };

    this.draw = () => {
        ctx.fillStyle = 'white';
        ctx.fillRect(this.x, this.y, scale, scale);

        ctx.beginPath();
        ctx.lineWidth = scale / 10;
        ctx.strokeStyle = "red";
        ctx.moveTo(this.center.x, this.center.y);
        ctx.lineTo(
            this.xDir ? this.center.y * 2 : (canvas.height - this.center.y) * -2,
            this.yDir ? canvas.height : 0
        )
        ctx.stroke();
        ctx.closePath();
    }

    this.update = () => {
        if(!this.started) return;

        this.center = {
            x: this.x + scale / 2,
            y: this.y + scale / 2
        };

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
            this.speed += speed / 6;
        }
        if(this.x + scale >= paddle2.x && this.x <= paddle2.x + paddle2.width && this.y <= paddle2.y + paddle2.height && this.y + scale >= paddle2.y){
            this.xDir = 0;
            this.speed += speed / 6;
        }

        this.xDir ? this.x += this.speed : this.x -= this.speed;
        this.yDir ? this.y += this.speed : this.y -= this.speed;

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
        this.speed = speed;

        setTimeout(() => {
            this.started = true;
        }, 1000)
    }
}