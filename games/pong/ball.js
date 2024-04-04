function Ball(){
    this.x = canvas.width / 2 - scale / 2;
    this.y = canvas.height / 2 - scale / 2;
    this.xDir = Math.round(Math.random());
    this.yDir = Math.round(Math.random());
    this.started = false;
    this.speed = speed;
    this.center = {
        x: this.x + scale / 2,
        y: this.y + scale / 2
    };
    this.bouncePoint = {
        x: this.x,
        y: this.y
    };
    this.dest = {
        x: this.x,
        y: this.y
    };
    this.interceptPoint = {};

    this.draw = () => {
        ctx.fillStyle = 'white';
        ctx.fillRect(this.x, this.y, scale, scale);

        if(!debug) return;
        
        ctx.beginPath();
        ctx.lineWidth = scale / 10;
        ctx.strokeStyle = "red";
        ctx.moveTo(this.center.x, this.center.y);
        ctx.lineTo(this.bouncePoint.x, this.bouncePoint.y);
        ctx.lineTo(this.dest.x, this.dest.y);
        ctx.stroke();
        ctx.closePath();
        
        ctx.fillStyle = 'green';
        ctx.fillRect(this.interceptPoint.x - scale / 4, this.interceptPoint.y - scale / 4, scale / 2, scale / 2);
    }

    this.update = () => {
        if(!this.started) return;

        this.center = {
            x: this.x + scale / 2,
            y: this.y + scale / 2
        };

        let headingFor = this.yDir ? canvas.height - this.center.y : this.center.y;
        this.bouncePoint = {
            x: this.xDir ? this.center.x + headingFor : this.center.x - headingFor,
            y: this.yDir ? canvas.height : 0
        };
        let distToClosestWall = this.yDir ? this.center.y : canvas.height - this.center.y;
        this.dest = {
            x: (this.bouncePoint.x - (this.center.x - this.bouncePoint.x)) + (this.xDir ? distToClosestWall : -distToClosestWall),
            y: this.yDir ? 0 : canvas.height
        };
        if(this.xDir){
            if(!this.interceptPoint.y){
                if(this.bouncePoint.x < paddle2.x){
                    this.interceptPoint = {
                        x: paddle2.x,
                        y: this.bouncePoint.y + ((this.dest.y - this.bouncePoint.y) / (this.dest.x - this.bouncePoint.x)) * (paddle2.x - this.bouncePoint.x)
                    }
                }
            }
        } else {
            this.interceptPoint = {};
        }
        //console.log(this.bouncePoint, this.dest, this.interceptPoint)

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