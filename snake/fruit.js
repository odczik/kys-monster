function Fruit(){
    this.x = Math.floor(Math.random() * (cols - 1)) * scale
    this.y = Math.floor(Math.random() * (rows - 1)) * scale

    this.draw = () => {
        ctx.fillStyle = "#f00"
        ctx.fillRect(this.x, this.y, scale, scale)
    }

    this.eat = () => {
        this.x = Math.floor(Math.random() * (cols - 1)) * scale
        this.y = Math.floor(Math.random() * (rows - 1)) * scale
        this.draw();
    }
}