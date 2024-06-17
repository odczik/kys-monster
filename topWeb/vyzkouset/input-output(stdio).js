var startAt = canvas.width/10 - canvas.width/10 % amount + amount*2

updateInputLoc()
updateOutputLoc()

function updateInputLoc(){
    startAt = canvas.width/10 - canvas.width/10 % amount + amount*2

    for(let id of INPUTS.IDs){
        
        let inputElement = document.getElementById(id)

        INPUTS.idToPoint[id] = startAt/amount
        
        inputElement.style.left = `${startAt}px`
        inputElement.style.width = `${amount*2-2}px`

        startAt += amount*3
    }
}
function updateOutputLoc(){
    startAt = canvas.width - canvas.width % amount

    for(let id of OUTPUTS.IDs){
        startAt -= amount*3

        let outputElement = document.getElementById(id)

        OUTPUTS.idToPoint[id] = startAt/amount

        outputElement.style.left = `${startAt}px`
        outputElement.style.width  = `${amount*2-2}px`
    }
}
window.addEventListener('resize', () => {
    updateInputLoc()
    updateOutputLoc()
})