const canvas = document.getElementById("canvas")
const ctx = canvas.getContext("2d")
const scale = 10;

const rows = canvas.height / scale
const cols = canvas.width / scale

let boost = false

var snake = new Snake();
var fruit = new Fruit();

snake.addNode()

const update = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    fruit.draw();

    snake.update(fruit)
    snake.draw()
}

let interval = setInterval(() => {
    update()
}, 100)

window.addEventListener("keydown", (e) => {
    if(e.key.includes("Arrow") || e.key=="w" || e.key=="a" || e.key=="s" || e.key=="d"){
        let direction = e.key.replace("Arrow", "")
        switch(direction){
            case "w":
            case "Up":
                snake.dir = 0;
                break;
            case "s":
            case "Down":
                snake.dir = 1;
                break;
            case "a":
            case "Left":
                snake.dir = 2;
                break;
            case "d":
            case "Right":
                snake.dir = 3;
                break;
        }
    } else {
        if(e.key == "e") snake.addNode()
        if(e.code == "Space"){
            boost = !boost
            clearInterval(interval)
            interval = setInterval(() => {
                update()
            }, boost ? 10 : 100)
        }
    }
})