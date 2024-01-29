let follow_interval

const follow_func = () => {
    if(snake.x == canvas.width - scale){
        snake.dir = 1;
        setTimeout(() => {
            snake.dir = 2;
        }, boost ? 10 : 100)
    }
    if(snake.x == 10){
        snake.dir = 1;
        setTimeout(() => {
            snake.dir = 3;
        }, boost ? 10 : 100)
    }
}

if(document.getElementById("patternCheckbox").checked){
    follow_interval = setInterval(() => {
        follow_func()
    }, boost ? 10 : 100)
} else {
    clearInterval(follow_interval)
}