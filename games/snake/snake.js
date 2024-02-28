function Snake(){
    this.x = canvas.width / 2
    this.y = canvas.height / 2
    this.lastX = this.x
    this.lastY = this.y
    this.tail = []
    this.ntail = 0
    this.dir = 3
    this.path = []
    this.astarMax = 0

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
        let lastNode = this.path[0];
        this.path.forEach((node, i) => {
            ctx.beginPath();
            ctx.moveTo((lastNode.x * scale) + (scale / 2), (lastNode.y * scale) + (scale / 2));
            ctx.lineTo((node.x * scale) + (scale / 2), (node.y * scale) + (scale / 2));
            ctx.lineWidth = 1;
            ctx.strokeStyle = "#f00";
            ctx.stroke();
            lastNode = node;
        })
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
    const matrix = [
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
    ]
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
            if(!document.getElementById("astarCheckbox").checked || !document.getElementById("patternCheckbox").checked){
                clearInterval(interval)
                ctx.clearRect(0, 0, canvas.width, canvas.height)
                return
            }
        }

        if(document.getElementById("mirrorCheckbox").checked){
            if(this.x < 0) this.x = canvas.width-1
            if(this.x > canvas.width-1) this.x = 0
            if(this.y < 0) this.y = canvas.height-1
            if(this.y > canvas.height-1) this.y = 0
        } else {
            if(document.getElementById("astarCheckbox").checked){
                if(this.x < 0){
                    this.x+=scale;
                    this.y -= scale;
                    this.dir = 0;
                }
                if(this.x > canvas.width-1){
                    this.x-=scale;
                    this.y += scale;
                    this.dir = 1;
                }
                if(this.y < 0){
                    this.y+=scale;
                    this.x += scale;
                    this.dir = 3;
                }
                if(this.y > canvas.height-1){
                    this.y-=scale;
                    this.x -= scale;
                    this.dir = 2;
                }
            } else {
                if(this.x < 0 || this.x > canvas.width || this.y < 0 || this.y > canvas.height) clearInterval(interval)
            }

            /*if(this.x < 0||this.x > canvas.width-1||this.y < 0||this.y > canvas.height-1){
                this.x = this.lastX
                this.y = this.lastY
            }*/
        }
        this.lastX = this.x
        this.lastY = this.y

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
        let tempMatrix = matrix;
        if(document.getElementById("astarCheckbox").checked){
            document.getElementById("mirrorCheckbox").checked = false
            document.getElementById("debugCanvas").style.display = "block"
            
            //tempMatrix = matrix;
            for(let i = 0; i < 30; i++){
                for(let j = 0; j < 30; j++){
                    tempMatrix[i][j] = 0
                }
            }

            for(let i = 1; i < this.ntail; i++){
                tempMatrix[this.tail[i].y / scale][this.tail[i].x / scale] = 1
            }
            //console.log(tempMatrix, this.x / scale, this.y / scale, fruit.x / scale, fruit.y / scale)
            let timer = Date.now()
            this.path = findPath(tempMatrix, {x: this.x / scale, y: this.y / scale}, {x: fruit.x / scale, y: fruit.y / scale}, true, 1);
            timer = Date.now() - timer
            if(this.path.length < 1){
                timer = "PANIC: NO PATH FOUND"
            } else {
                if(timer > this.astarMax) this.astarMax = timer
                timer = timer + "ms"
            }
            document.getElementById("msText").innerText = "A* took: " + timer
            document.getElementById("msTextMax").innerText = "A* max: " + this.astarMax + "ms"

            // DEBUG
            const debugCtx = document.getElementById("debugCanvas").getContext("2d")
            debugCtx.clearRect(0, 0, canvas.width, canvas.height)
            for(let i = 0; i < 30; i++){
                for(let j = 0; j < 30; j++){
                    if(tempMatrix[i][j] == 1){
                        debugCtx.fillStyle = "#f005"
                    } else {
                        debugCtx.fillStyle = "#0f05"
                    }
                    debugCtx.fillRect(j * scale, i * scale, scale, scale)
                }
            }
            debugCtx.fillStyle = "#fff"
            debugCtx.fillRect(this.x + (scale / 4), this.y + (scale / 4), scale - (scale / 2), scale - (scale / 2))
            debugCtx.fillStyle = "#f00"
            debugCtx.fillRect(fruit.x, fruit.y, scale, scale)
            // END DEBUG

            if(this.path < 1){
                console.log("PANIC", this.x, this.y, this.tail, tempMatrix)
            }

            if(this.path.length > 1){
                let nextNode = this.path[this.path.length - 2];
                if(nextNode){
                    if(this.x / scale < nextNode.x){
                        this.dir = 3;
                    } else if(this.x / scale > nextNode.x){
                        this.dir = 2;
                    } else if(this.y / scale < nextNode.y){
                        this.dir = 1;
                    } else if(this.y / scale > nextNode.y){
                        this.dir = 0;
                    }
                }
            }
        } else {
            this.path = []
        }
    }
}