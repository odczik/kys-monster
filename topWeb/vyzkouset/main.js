/** @type {HTMLCanvasElement} */
const canvas = document.getElementById('myCanvas');
const ctx = canvas.getContext('2d');

canvas.width  = window.innerWidth
canvas.height = window.innerHeight

var container = document.getElementById('gateContainer'), toolmode = document.getElementById('switchModes'), toolBox = document.getElementById('toolBox'), bodyElm = document.getElementById('body')

var amountOfSpace = 48

var amount = canvas.height/amountOfSpace, cursorPoint

var moveGate = true

var dontPlace = true

var INPUTS = {
    all: ['1','&','N1','N&','X1','NX1'],
    idToPoint: {},
    startIn: null,
    IDs: ['inputA'],
    toGate: {}
}
var OUTPUTS = {
    IDs: ['outputZ'],
    idToPoint: {},
    gateIDs: [],
    toGate: {}
}
var GATES = {
    IDs: [],
    allGates: [],

    activeG: '<div class="gate" id="activeGate"><div class="gateBody"><div class="gateName" id="activeGateText"></div></div></div>',

    idToPoint: {},
    idToConntent: {},

    activeInput: '1',

    freeSpace: true,
    nextId: 0,
    
    hasOutput: [],
    inputs: {},
    values: {}
}
var CABLE = {
    startGate: null,
    gateInputs: {},
    disconnect: false,
    output: false
}
var MOVE = {
    activeID: null,
}
var tools = {
    gate: true,
    cable: false,
    move: false
}

container.innerHTML = '<div class="gate" id="activeGate"><div class="gateBody"><div class="gateName" id="activeGateText"></div></div></div>'
var activeGate = document.getElementById('activeGate')
activeGate.style.top = '110vh'
activeGate.style.opacity = '0.5'


drawGrid()

function drawGrid(){
    let x = canvas.height, y = canvas.height
    
    amount = y/amountOfSpace
    
    ctx.fillStyle = 'rgb(15,15,15)'

    for(let i = 1; i <= 100; i++){
        ctx.fillRect(0, i*(amount), canvas.width, 2)
        ctx.fillRect(i*(amount), 0, 2, canvas.height)
    }
}

function hasSpace(){
    
    for(let id of GATES.IDs){
        
        let X = GATES.idToPoint[id][0], Y = GATES.idToPoint[id][1]

        if(!(cursorPoint[0] + 3 < X || cursorPoint[0] - 3 > X || cursorPoint[1] + 5 < Y || cursorPoint[1] - 5 > Y)){
            return false
        }
    }
    return true
}
function displayConnections(){
    for(let id of GATES.IDs){
        
        if(CABLE.gateInputs[id] != null){
            
            let distance = (amount*6)/(CABLE.gateInputs[id].length+1)
            
            
            let startX = GATES.idToPoint[id][0]*amount + amount/2.5, startY = (GATES.idToPoint[id][1])*amount

            for(let i of CABLE.gateInputs[id]){
                
                if(i != null && !i.includes('input')){
                    let X = (GATES.idToPoint[i][0] + 4)*amount - amount/2.5, Y = (GATES.idToPoint[i][1] + 3)*amount

                    startY += distance
                
                    let color = GATES.idToConntent[i].includes('N') ? 'blue' : 'red'

                    drawLine(startX, startY, X, Y, color)
                }
            }
            for(let j of INPUTS.IDs){

                if(INPUTS.toGate[j] != null){
                
                    for(let gate of INPUTS.toGate[j]){
                        if(gate == id){

                            let X = GATES.idToPoint[gate][0]*amount + amount/2.5

                            let inX = (INPUTS.idToPoint[j] + 2)*amount

                            startY += distance

                            drawLine(inX, startY, X, startY, 'aqua')
                            drawCircle(inX, startY, 10, 0, 360, 'aqua')
                        }
                    }
                }
            }
        }
    }
    for(let out of OUTPUTS.IDs){
        
        if(OUTPUTS.toGate[out] != null){
            
            let X = (GATES.idToPoint[OUTPUTS.toGate[out]][0]+4)*amount - amount/2.5, Y = (GATES.idToPoint[OUTPUTS.toGate[out]][1]+3)*amount
            
            let outX = (OUTPUTS.idToPoint[out]+2)*amount
            
            drawLine(outX, Y, X, Y, 'magenta')
            drawCircle(outX, Y, 10, 0, 360, 'magenta')
        }
    }
}
function drawCircle(X, Y, size, ang1, ang2, color){
    ctx.fillStyle = color
    ctx.beginPath()
    ctx.arc(X, Y, size, (Math.PI*ang1)/180, (Math.PI*ang2)/180)
    ctx.fill()
    ctx.closePath()
}
function updateAll(e){
    document.getElementById('activeGateText').textContent = GATES.activeInput

    let X, Y
     
    if(e.clientX % amount < amount/2) X = e.clientX - e.clientX % amount
    else X = e.clientX - e.clientX % amount + amount
    
    if(e.clientY % amount < amount/2) Y = e.clientY - e.clientY % amount
    else Y = e.clientY - e.clientY % amount + amount

    cursorPoint = [X/amount, Y/amount]
    
    canvas.width  = window.innerWidth
    canvas.height = window.innerHeight

    ctx.clearRect(0, 0, canvas.width, canvas.height)
    drawGrid()

    updateOutputLoc()
    updateInputLoc()
    displayConnections()

    if(CABLE.startGate){
        
        let startX = GATES.idToPoint[CABLE.startGate][0]*amount, startY = GATES.idToPoint[CABLE.startGate][1]*amount + amount*3 - 2
        if(ctrlOutput){
            startX += amount*4 - amount/2.5
        }else{
            startX += amount/2.5
        }
        
        if(CABLE.disconnect) ctx.fillStyle = drawLine(startX, startY, e.clientX, e.clientY, 'orange')
        else drawLine(startX, startY, e.clientX, e.clientY, 'rgba(255,255,255,0.8)')
    }

    if(INPUTS.startIn != null){

        let startX = INPUTS.idToPoint[INPUTS.startIn]*amount+amount*2

        drawLine(startX, e.clientY, e.clientX, e.clientY, 'rgba(255,255,255,0.8)')
    }

    ctx.fillStyle = 'rgb(143, 51, 143)'
    if(tools.gate || tools.move){
        ctx.fillRect(cursorPoint[0]*amount-2, cursorPoint[1]*amount-2, 6, 6)
    }
    for(let id of GATES.IDs){
        let gate = document.getElementById(id)

        gate.style.left = `${GATES.idToPoint[id][0]*amount + amount/2.5}px`
        gate.style.top = `${GATES.idToPoint[id][1]*amount}px`
    
        document.getElementById(`${id}text`).textContent = GATES.idToConntent[id]
    }
    
    if(cursorPoint[0] < (canvas.width/10)/amount){
        activeGate.style.left = `${canvas.width/10 + 10}px`    

    }else{
        activeGate.style.left = `${e.clientX + 10}px`
    }
    if(tools.gate){
        activeGate.style.top  = `${e.clientY + 10}px`
    }else{
        activeGate.style.top = '110vh'
    }
    GATES.freeSpace = hasSpace()

    if(GATES.freeSpace) activeGate.style.opacity = '0.5'
    else activeGate.style.opacity = '0.15'

    return e
}
function addGateHtml(){
    
    let nextGate = `<div class="gate" id="gate${GATES.nextId}"><div class="gateBody"><div class="gateName" id="gate${GATES.nextId}text"></div></div></div>`
    GATES.allGates.push(nextGate)
    GATES.IDs.push(`gate${GATES.nextId}`)

    updateGateContainer()

    GATES.idToConntent[`gate${GATES.nextId}`] = GATES.activeInput

    GATES.nextId++
}
function updateGateContainer(){

    container.innerHTML = `${GATES.allGates.join('')}${GATES.activeG}`
    activeGate = document.getElementById('activeGate')
}
function switchModes(){
    if(tools.gate){
        tools.gate = false, tools.cable = true
        toolmode.textContent = 'cable'

    }else if(tools.cable){
        tools.cable = false, tools.move = true
        toolmode.textContent = 'move'

    }else if(tools.move){
        tools.move = false, tools.gate = true
        toolmode.textContent = 'gate'
    }
}
function drawLine(startX, startY, endX, endY, color){
    ctx.beginPath()

    ctx.strokeStyle = color
    ctx.lineWidth = 5

    ctx.moveTo(startX, startY)
    ctx.lineTo(endX, endY)

    ctx.stroke()
}
window.addEventListener('resize', (e) => {e = updateAll(e)})

window.addEventListener('mousemove', (e) => {
    e = updateAll(e)
})
window.addEventListener('keypress', (e) => {
    if(e.key == ' '){
        switchModes()
        e = updateAll(e)

        ctrlOutput = null
        CABLE.startGate = null, CABLE.disconnect = false
        INPUTS.startIn = null, INPUTS.startY = null
        
    }else if(e.key == 'q'){
        
        ctrlOutput = null
        CABLE.startGate = null, CABLE.disconnect = false
        e = updateAll(e)
        INPUTS.startIn = null, INPUTS.startY = null
    }
})
window.addEventListener('mousedown', (e) => {
    if(tools.gate){
        if(e.button == 0 && GATES.freeSpace && e.clientX > canvas.width/10){

            GATES.idToPoint[`gate${GATES.nextId}`] = cursorPoint
            addGateHtml()
            e = updateAll(e)

        }else if((e.button == 2 || e.button == 0)&& dontPlace){
            
            for(let id of GATES.IDs){
                
                let X = GATES.idToPoint[id][0], Y = GATES.idToPoint[id][1]

                if(e.clientX/amount > X && e.clientX/amount < X + 4 && e.clientY/amount > Y && e.clientY/amount < Y + 6){
                    if(e.button == 2){
                    
                        if(e.button == 2){
                            for(let i of OUTPUTS.IDs){
                                if(OUTPUTS.toGate[i] == id) OUTPUTS.toGate[i] = null
                            }
                        }

                        for(let i of GATES.IDs){
                            if(CABLE.gateInputs[i] != null && CABLE.gateInputs[i].includes(id)){
                                for(let j = 0; j<16; j++){
                                   
                                    if(CABLE.gateInputs[i].includes(id)){
                                        CABLE.gateInputs[i].splice(CABLE.gateInputs[i].indexOf(id), 1)
                                    }
                                }
                            }
                        }

                        GATES.allGates.splice(GATES.IDs.indexOf(id), 1)
                        GATES.IDs.splice(GATES.IDs.indexOf(id), 1)

                        updateGateContainer()
                    
                    }else{
                        let index = INPUTS.all.indexOf(GATES.idToConntent[id])

                        GATES.idToConntent[id] = index == INPUTS.all.length-1 ? INPUTS.all[0] : INPUTS.all[index+1] 
                    }
                    
                    e = updateAll(e)
                }
            }
        
        }
    }
})
window.addEventListener('contextmenu', (e) => {e.preventDefault()})
document.getElementById('tableContainer').addEventListener('mouseover', () => {dontPlace = false})
document.getElementById('tableContainer').addEventListener('mouseleave', () => {dontPlace = true})