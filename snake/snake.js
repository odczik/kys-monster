function Snake(){
    this.x = canvas.width / 2
    this.y = canvas.height / 2
    this.tail = []
    this.ntail = 0
    this.dir = 3

    this.draw = () => {
        // Head
        ctx.fillStyle = "#fff"
        ctx.fillRect(this.x+1, this.y+1, 8, 8)
        //ctx.fillRect(this.x, this.y, 10, 10)
        /*switch(this.dir){
            case 0:
                ctx.fillRect(this.x+1, this.y+1, 8, 9)
                break;
            case 1:
                ctx.fillRect(this.x+1, this.y, 8, 9)
                break;
            case 2:
                ctx.fillRect(this.x+1, this.y+1, 9, 8)
                break;
            case 3:
                ctx.fillRect(this.x, this.y+1, 9, 8)
                break;
        }*/

        // Tail
        /*for(let i = 0; i < this.ntail; i++){
            if(i == 0) return
            ctx.fillRect(this.tail[i].x, this.tail[i].y, scale, scale)
        }*/
        for(let i = 0; i < this.ntail; i++){
            if(i != 0){
                ctx.fillRect(this.tail[i].x+2, this.tail[i].y+2, 6, 6)

                if(this.tail[i].y > this.tail[i-1].y){   // Up
                    ctx.fillRect(this.tail[i].x+2, this.tail[i].y-2, 6, 4)
                } else if(this.tail[i].y < this.tail[i-1].y){   // Down
                    ctx.fillRect(this.tail[i].x+2, this.tail[i].y+8, 6, 4)
                }

                if(this.tail[i].x > this.tail[i-1].x){   // Left
                    ctx.fillRect(this.tail[i].x-2, this.tail[i].y+2, 4, 6)
                } else if(this.tail[i].x < this.tail[i-1].x){   // Right
                    ctx.fillRect(this.tail[i].x+8, this.tail[i].y+2, 4, 6)
                }
            }
        }
    }

    this.addNode = () => {
        this.tail[this.ntail] = {x: this.x, y: this.y}
        this.ntail++;
    }

    this.hasNode = (tail, ntail) => {
        for(let i = 0; i < ntail; i++){
            if(tail[i].x == this.x && tail[i].y == this.y){
                return 1;
            }
        }
        return 0;
    }

    this.update = (fruit) => {
        switch(this.dir){
            case 0:
                this.y -= scale;
                break;
            case 1:
                this.y += scale;
                break;
            case 2:
                this.x -= scale;
                break;
            case 3:
                this.x += scale;
                break;
        }

        if(this.hasNode(this.tail, this.ntail)){
            if(!document.getElementById("patternCheckbox").checked){
                clearInterval(interval)
                ctx.clearRect(0, 0, canvas.width, canvas.height)
                return
            }
        }

        if(document.getElementById("mirrorCheckbox").checked){
            if(this.x < 0) this.x = canvas.width
            if(this.x > canvas.width) this.x = 0
            if(this.y < 0) this.y = canvas.height
            if(this.y > canvas.height) this.y = 0
        } else {
            if(this.x < 0 || this.x > canvas.width || this.y < 0 || this.y > canvas.height) clearInterval(interval)
        }

        let tailTmp = []
        for(let i = 0; i < this.ntail; i++){
            if(i == 0){
                tailTmp[i] = {x: this.x, y: this.y}
            } else {
                tailTmp[i] = {x: this.tail[i - 1].x, y: this.tail[i - 1].y}
            }
        }
        this.tail = tailTmp

        if(this.x == fruit.x && this.y == fruit.y){
            fruit.eat(this.tail, this.ntail)
            this.addNode()
        }
    }
}