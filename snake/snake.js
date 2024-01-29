function Snake(){
    this.x = canvas.width / 2
    this.y = canvas.height / 2
    this.tail = []
    this.ntail = 0
    this.dir = "Right"

    this.draw = () => {
        ctx.fillStyle = "#fff"
        ctx.fillRect(this.x, this.y, scale, scale)
        for(let i = 0; i < this.ntail; i++){
            ctx.fillRect(this.tail[i].x, this.tail[i].y, scale, scale)
        }
    }

    this.addNode = () => {
        this.tail[this.ntail] = {x: this.x, y: this.y}
        this.ntail++;
    }

    this.update = (fruit) => {
        switch(this.dir){
            case "Up":
                this.y -= scale;
                break;
            case "Down":
                this.y += scale;
                break;
            case "Left":
                this.x -= scale;
                break;
            case "Right":
                this.x += scale;
                break;
        }
        if(this.x < 0) this.x = canvas.width
        if(this.x > canvas.width) this.x = 0
        if(this.y < 0) this.y = canvas.height
        if(this.y > canvas.height) this.y = 0
        console.log(this.x, this.y)
        console.log(this.tail)
        let tailTmp = []
        for(let i = 0; i < this.ntail; i++){
            if(i == 0){
                tailTmp[i] = {x: this.x, y: this.y}
            } else {
                tailTmp[i] = {x: this.tail[i - 1].x, y: this.tail[i - 1].y}
            }
        }
        this.tail = tailTmp
        console.log(tailTmp)

        if(this.x == fruit.x && this.y == fruit.y){
            fruit.eat()
            this.addNode()
        }
    }
}