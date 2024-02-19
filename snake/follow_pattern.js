const follow_func = () => {
    if(snake.x == canvas.width - scale){
        snake.dir = 1
        setTimeout(() => {
            snake.dir = 2
        }, boost ? 10 : 100)
    }

    if(snake.x != canvas.width - scale && snake.y == 0){
        snake.dir = 3
    }

    if(snake.x == 10){
        if(snake.y == canvas.height - scale){
            setTimeout(() => {
                snake.dir = 0
            }, boost ? 10 : 100)
        } else if(snake.y != 0){
            snake.dir = 1
            setTimeout(() => {
                snake.dir = 3
            }, boost ? 10 : 100)
        }
    }
}

document.getElementById("patternCheckbox").addEventListener("change", () => {
    shouldDispatch = true
})
const boostCheckbox = document.getElementById("boostCheckbox")
let shouldDispatch = false
setInterval(() => {
    if(document.getElementById("patternCheckbox").checked){
        if(shouldDispatch){
            boostCheckbox.checked = true
            boostCheckbox.dispatchEvent(new Event("change"))
            shouldDispatch = false
        }
        follow_func()
    } else {
        if(shouldDispatch){
            boostCheckbox.checked = false
            boostCheckbox.dispatchEvent(new Event("change"))
            shouldDispatch = false
        }
    }
}, 10)