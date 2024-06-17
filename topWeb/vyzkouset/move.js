window.addEventListener('mousedown', (e) => {       
    if(tools.move && e.button == 0){
        for(let id of GATES.IDs){
            let X = GATES.idToPoint[id][0], Y = GATES.idToPoint[id][1]

            if(e.clientX/amount > X && e.clientX/amount < X + 4 && e.clientY/amount > Y && e.clientY/amount < Y + 6){
                MOVE.activeID = id
            }
        }
    }
})
window.addEventListener('mouseup', () => {
    GATES.idToPoint[MOVE.activeID] = cursorPoint
    MOVE.activeID = null
    MOVE.moveBg = false
})
window.addEventListener('mousemove', (e) => {
    if(MOVE.activeID != null && e.clientX > canvas.width/10){
    
        GATES.idToPoint[MOVE.activeID] = [e.clientX/amount, e.clientY/amount]
    }else{
        try{
            GATES.idToPoint[MOVE.activeID] = [GATES.idToPoint[MOVE.activeID][0], e.clientY/amount]
        }catch(error){}
    }
})