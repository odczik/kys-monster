var alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'

var inContainer = document.getElementById('inputContainer')

var TOOLBOX = {
    nextIn: 1,
    nextOut: alphabet.length-2,
    lines: ['<div id="inputA" class="inputBody"></div>','<div id="outputZ" class="inputBody"></div>'],
    idToName: {'inputA':'A', 'outputZ': 'Z'}
}

var num_rows = INPUTS.IDs.length *INPUTS.IDs.length
var num_cols = INPUTS.IDs.length

var answers = {}
let X = OUTPUTS.IDs.length

createTable()
addInput()
removeInput()

function ANDgate(gateInput){
    return (gateInput.includes(0)) ? 0 : 1
}
function ORgate(gateInput){
    return (gateInput.includes(1)) ? 1 : 0
}
function XORgate(gateInput){
    let cnt
    switch(gateInput.length){
        
        case 2:
        
            return (gateInput.includes(0) && gateInput.includes(1)) ? 1 : 0

        case 3:

            cnt = XORgate([gateInput[0], gateInput[1]])
            return XORgate([cnt, gateInput[2]])
        case 4:
            
            cnt = [XORgate([gateInput[0], gateInput[1]]), XORgate([gateInput[2], gateInput[3]])]
            return XORgate(cnt)
        case 5:
            
            cnt = [XORgate([gateInput[0], gateInput[1], gateInput[2]]), XORgate([gateInput[3], gateInput[4]])]
            return XORgate(cnt)
        case 6:
            
            cnt = []
            for(let i = 0; i<6; i+=3){
                cnt.push(XORgate([gateInput[i], gateInput[i+1], gateInput[i+2]]))
            }
            return XORgate(cnt)
        case 7:

            cnt = [XORgate([gateInput[0], gateInput[1], gateInput[2], gateInput[3]]), XORgate([gateInput[4], gateInput[5], gateInput[6]])]
            return XORgate(cnt)
        case 8:

            cnt = []
            for(let i = 0; i<8; i+=4){
                cnt.push(XORgate([gateInput[i], gateInput[i+1], gateInput[i+2], gateInput[i+3]]))
            }
            return XORgate(cnt)
        case 9:
            
            cnt = [XORgate([gateInput[0], gateInput[1], gateInput[2], gateInput[3], gateInput[4]]), XORgate([gateInput[5], gateInput[6], gateInput[7], gateInput[8]])]
            return XORgate(cnt)
        case 10:

            cnt = []
            for(let i = 0; i<10; i+=5){
                cnt.push(XORgate([gateInput[i], gateInput[i+1], gateInput[i+2], gateInput[i+3], gateInput[i+4]]))
            }
            return XORgate(cnt)
        case 11:

            cnt = [XORgate([gateInput[0], gateInput[1], gateInput[2], gateInput[3], gateInput[4]]), XORgate([gateInput[5], gateInput[6], gateInput[7], gateInput[8], gateInput[9], gateInput[10]])]
            return XORgate(cnt)
        case 12:

            cnt = []
            for(let i = 0; i<12; i+=4){
                cnt.push(XORgate([gateInput[i], gateInput[i+1], gateInput[i+2], gateInput[i+3]]))
            }
            console.log(cnt)
            return XORgate(cnt)
    }
}
function NOT(gateOutput){
    return gateOutput == 1 ? 0 : 1
}
function readyToDecode(){
    let DA = false

    for(let input of INPUTS.IDs){
        if(INPUTS.toGate[input] != null) DA = true
    }
    if(!DA) return false

    for(let output of OUTPUTS.IDs){
        if(OUTPUTS.toGate[output] == null) return false
    }

    for(let id of GATES.IDs){
        if(CABLE.gateInputs[id] == null) return false
    }

    for(let gate of GATES.IDs){
        if(GATES.idToConntent[gate].includes('X1')){
            
            if(CABLE.gateInputs[gate].length > 12){
                console.error('maximum connections for xor is 12')
            }
        }
    }

    return true
}
function findAnswer(inputValues){

    GATES.hasOutput = [], GATES.inputs = {}, GATES.values = inputValues, OUTPUTS.haveInput = []

    for(let input of INPUTS.IDs){
        
        let value = GATES.values[input]
        if(INPUTS.toGate[input] != null){

            for(let gate of INPUTS.toGate[input]){

                if(GATES.inputs[gate] == null) GATES.inputs[gate] = []

                GATES.inputs[gate].push(value)
            }
        }
    }

    let repetion = 0
    while(OUTPUTS.IDs.length != OUTPUTS.haveInput.length){
        
        for(let id of GATES.IDs){

            if(GATES.inputs[id] != null && CABLE.gateInputs[id] != null){

                if(GATES.inputs[id].length == CABLE.gateInputs[id].length){

                    if(GATES.idToConntent[id].includes('X1')){
                        GATES.values[id] = XORgate(GATES.inputs[id])

                    }else if(GATES.idToConntent[id].includes('&')){
                        GATES.values[id] = ANDgate(GATES.inputs[id])
                    
                    }else if(GATES.idToConntent[id].includes('1')){
                        GATES.values[id] = ORgate(GATES.inputs[id])
                    }

                    if(GATES.idToConntent[id].includes('N')){
                        GATES.values[id] = NOT(GATES.values[id])
                    }
                
                    if(!GATES.hasOutput.includes(id)) GATES.hasOutput.push(id)
                }
            }
        }

        for(let id of GATES.hasOutput){

            for(let gate of GATES.IDs){

                if(CABLE.gateInputs[gate].includes(id)){

                    if(GATES.inputs[gate] == null) GATES.inputs[gate] = []

                    if(CABLE.gateInputs[gate].length != GATES.inputs[gate].length){
                        
                        GATES.inputs[gate].push(GATES.values[id])
                    }
                }
            }

            for(let out of OUTPUTS.IDs){

                if(OUTPUTS.toGate[out] == id && GATES.hasOutput.includes(id)){

                    OUTPUTS.haveInput.push(out)
                    GATES.values[out] = GATES.values[id]
                }
            }
        }
        repetion++

        if(repetion >= 100){
            console.error('kkt si fr')
            break
        }
    }
}
function fillAnswer(){

    if(readyToDecode()){
        for (let j = 0; j < num_rows; j++) {

            let rowValues = {}
            for(let i = 0; i < num_cols; i++){

                let inputName = `in${j}-${i}`
                rowValues[`input${alphabet[i]}`] = parseInt(document.getElementsByName(inputName)[0].value)
            }
            findAnswer(rowValues)

            for(let i = 0; i < X; i++){

                let divName = `out${j}-${i}`

                document.getElementById(divName).textContent = GATES.values[`output${alphabet[alphabet.length - i -1]}`]  
            }
        }
    }else{
        console.log('you are not ready to decode')
    }
}
function updateTable(){
    document.getElementById('TABLEin').innerHTML = ''
    document.getElementById('TABLEout').innerHTML = ''
 
    num_rows = 2 **INPUTS.IDs.length
    num_cols = INPUTS.IDs.length

    createTable()
}
function updateLines(){
    for(let id of INPUTS.IDs){
        document.getElementById(id).textContent = TOOLBOX.idToName[id]
    }
    for(let id of OUTPUTS.IDs){
        document.getElementById(id).textContent = TOOLBOX.idToName[id]
    }
    updateInputLoc()
    updateOutputLoc()

    updateTable()
}
function addInput(){

    let inChar = alphabet[TOOLBOX.nextIn]

    let input = `<div id="input${inChar}" class="inputBody"></div>`

    TOOLBOX.lines.push(input)
    TOOLBOX.idToName[`input${inChar}`] = inChar
    INPUTS.IDs.push(`input${inChar}`)

    inContainer.innerHTML = TOOLBOX.lines.join('')

    TOOLBOX.nextIn++

    updateLines()
}
function addOutput(){

    let outChar = alphabet[TOOLBOX.nextOut]

    let output = `<div id="output${outChar}" class="inputBody"></div>`
    
    TOOLBOX.lines.push(output)
    TOOLBOX.idToName[`output${outChar}`] = outChar
    OUTPUTS.IDs.push(`output${outChar}`)

    inContainer.innerHTML = TOOLBOX.lines.join('')

    TOOLBOX.nextOut--

    updateLines()
}
function removeInput(){
    
    if(TOOLBOX.nextIn > 1){
        let ID = INPUTS.IDs[INPUTS.IDs.length-1]

        INPUTS.IDs.splice(INPUTS.IDs.indexOf(ID), 1)
        INPUTS.toGate[ID] = null
        TOOLBOX.lines.splice(TOOLBOX.lines.indexOf(`<div id="${ID}" class="inputBody"></div>`))

        inContainer.innerHTML = TOOLBOX.lines.join('')

        TOOLBOX.nextIn--

        updateLines()
    }
}
function removeOutput(){

    if(TOOLBOX.nextOut < alphabet.length-2){
        
        let ID = OUTPUTS.IDs[OUTPUTS.IDs.length-1]

        OUTPUTS.IDs.splice(OUTPUTS.IDs.indexOf(ID), 1)
        OUTPUTS.toGate[ID] = null
        TOOLBOX.lines.splice(TOOLBOX.lines.indexOf(`<div id="${ID}" class="inputBody"></div>`))

        inContainer.innerHTML = TOOLBOX.lines.join('')

        TOOLBOX.nextOut++

        updateLines()
    }
    console.log(TOOLBOX.nextOut, alphabet.length)
}
function showInputTable(){
    
    let buttonT = document.getElementById('tableButton')

    switch(buttonT.textContent){
        case '+table':
            buttonT.textContent = '-table'
            document.getElementById('tableContainer').style.top = '94%'
            break
        case '-table':
            buttonT.textContent = '+table'
            document.getElementById('tableContainer').style.top = '200%'
    }
}
function createTable() {

    let table = document.createElement('table');

    for(let i = 0; i < num_rows; i++) {

        let row = table.insertRow(i)        

        for (let j = 0; j < num_cols; j++) {

            let cell = row.insertCell(j);
            let input = document.createElement('input');
            
            input.type = 'text';
            input.name = `in${i}-${j}`;
            input.maxLength = '1'
            input.classList.add('Cell')

            input.addEventListener('input', correctContent)
            input.addEventListener('click', deleteContent)

            cell.appendChild(input);
        }
    }
    
    let myRow = table.insertRow(0)
    for(let item = 0; item<num_cols; item++){
        
        let cell = myRow.insertCell(item)
        let div = document.createElement('div')

        div.type = 'text'
        div.innerText = alphabet[item]
        div.classList.add('nameCell')

        cell.appendChild(div)
    }

    document.getElementById('TABLEin').appendChild(table);


    X = OUTPUTS.IDs.length

    let outTable = document.createElement('table')

    for(let i = 0; i<num_rows; i++){

        let row = outTable.insertRow(i)

        for(let j = 0; j<X; j++){

            let cell = row.insertCell(j)
            let output = document.createElement('div')

            output.type = 'text'
            output.id = `out${i}-${j}`

            output.maxLength = '1'
            output.classList.add('divCell')
    
            cell.appendChild(output)
        }
    }

    myRow = outTable.insertRow(0)
    for(let item = 0; item<X; item++){
        
        let cell = myRow.insertCell(item)
        let div = document.createElement('div')

        div.type = 'text'
        div.innerText = alphabet[alphabet.length - item - 1]
        div.classList.add('nameCell')

        cell.appendChild(div)
    }

    document.getElementById('TABLEout').appendChild(outTable)
}

function correctContent(){
    if(this.value == '1' || this.value == '0'){
    }else if(this.value == 'a') this.value = '1'
    else this.value = '0'
}
function deleteContent(){
    this.value = ''
}
function retrieveContent(){
    for (let i = 0; i < num_rows; i++) {
        for (let j = 0; j < num_cols; j++) {

            let inputName = `in${i}-${j}`
            let inputValue = document.getElementsByName(inputName)[0].value
            
            console.log(inputName, inputValue)
        }
    }
}
function autoFillTable(){

    let index = 0, num = 1

    for(let X = 0; X<num_cols; X++){

        while(index != num_rows){
            for(let i = 0; i<num; i++){
                try{
                    let CELL = document.getElementsByName(`in${index}-${X}`)[0]
                    CELL.value = '1'
                    CELL.setAttribute('data-content', 'oneBG')

                    index++
                }catch(error){}
            }
            for(let j = 0; j<num; j++){
                try{
                    let CELL = document.getElementsByName(`in${index}-${X}`)[0]
                    CELL.value = '0'
                    CELL.setAttribute('data-content', 'zeroBG')
                    
                    index++
                }catch(error){}
            }
        }
        num*=2
        index = 0
    }
}