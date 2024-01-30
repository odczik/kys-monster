function Fruit(){
    this.x = Math.floor(Math.random() * (cols - 1)) * scale
    this.y = Math.floor(Math.random() * (rows - 1)) * scale

    this.draw = () => {
        ctx.fillStyle = "#f00"
        ctx.fillRect(this.x, this.y, scale, scale)
    }

    this.hasNode = (tail, ntail) => {
        for(let i = 0; i < ntail; i++){
            if(tail[i].x == this.x && tail[i].y == this.y){
                return 1;
            }
        }
        return 0;
    }

    this.eat = (tail, ntail) => {
        do {
            this.x = Math.floor(Math.random() * (cols - 1)) * scale
            this.y = Math.floor(Math.random() * (rows - 1)) * scale
        } while(this.hasNode(tail, ntail))

        this.draw();
    }
}