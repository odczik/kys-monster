const canvas = document.getElementById("canvas")
const ctx = canvas.getContext("2d")
const scale = 10;

const rows = canvas.height / scale
const cols = canvas.width / scale

var snake = new Snake();
var fruit = new Fruit();


setInterval(() => {
    //console.log(snake, fruit)

    ctx.clearRect(0, 0, canvas.width, canvas.height)

    fruit.draw();

    snake.update(fruit)
    snake.draw()
}, 100)

window.addEventListener("keydown", (evt) => {
    if(evt.key.includes("Arrow")){
        snake.dir = evt.key.replace("Arrow", "")
    } else {
        if(evt.key = "e") snake.addNode()
    }
})