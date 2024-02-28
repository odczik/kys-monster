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
            document.getElementById("patternCheckbox").checked = false
            boost = !boost
            clearInterval(interval)
            interval = setInterval(() => {
                update()
            }, boost ? 10 : 100)
        }
    }
})

document.getElementById("mirrorCheckbox").checked = true
document.getElementById("patternCheckbox").checked = false
document.getElementById("boostCheckbox").checked = false
document.getElementById("boostCheckbox").addEventListener("change", e => {
    if(e.target.checked){
        boost = true;
    } else {
        boost = false;
    }
    clearInterval(interval)
    interval = setInterval(() => {
        update()
    }, boost ? 10 : 100)
})

let startTouch = {}
window.addEventListener("touchstart", e => {
    startTouch = {x: e.touches[0].clientX, y: e.touches[0].clientY}
})
window.addEventListener("touchend", e => {
    let endTouch = {x: e.changedTouches[0].clientX, y: e.changedTouches[0].clientY}
    let diffX = startTouch.x - endTouch.x
    let diffY = startTouch.y - endTouch.y
    document.getElementById("text").innerText = "diff x: " +  diffX + " diff y: " +  diffY
    if(Math.abs(diffX) > Math.abs(diffY)){
        if(diffX > 0){
            snake.dir = 2
        } else {
            snake.dir = 3
        }
    } else {
        if(diffY > 0){
            snake.dir = 0
        } else {
            snake.dir = 1
        }
    }
})