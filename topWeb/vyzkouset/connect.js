var hoverGate, ctrlOutput

var hoverInput, hoverOutput

window.addEventListener('mousemove', (e) => {
    hoverGate = null, hoverInput = null, hoverOutput = null
    
    if(tools.cable){
        for(let id of GATES.IDs){

            let X = GATES.idToPoint[id][0], Y = GATES.idToPoint[id][1]

            if(e.clientY/amount > Y && e.clientY/amount < Y + 6){
                if(e.clientX/amount > X && e.clientX/amount <= X + 2){
                    CABLE.output = false
                    if(CABLE.startGate != id && ctrlOutput != false) drawCircle(X*amount + amount/2.5, Y*amount + amount*3, 16, 90, 270, 'rgba(255,255,255,0.8)')

                    hoverGate = id

                }else if(e.clientX/amount > X+2 && e.clientX/amount < X + 4){
                    CABLE.output = true
                    if(CABLE.startGate != id && ctrlOutput != true) drawCircle(X*amount + amount*4 - amount/2.5, Y*amount + amount*3, 16, 270, 90, 'rgba(255,255,255,0.8)')

                    hoverGate = id
                }

            }
        }

        for(let input of INPUTS.IDs){
            if(e.clientX/amount > INPUTS.idToPoint[input] + 1 && e.clientX/amount < INPUTS.idToPoint[input] + 3 && CABLE.startGate == null){
                hoverInput = input
                drawCircle((INPUTS.idToPoint[input]+2)*amount, e.clientY, 16, 0, 360, 'aqua')
            }
        }
        for(let output of OUTPUTS.IDs){
            if(e.clientX/amount > OUTPUTS.idToPoint[output] + 1 && e.clientX/amount < OUTPUTS.idToPoint[output] + 3 && CABLE.startGate != null){
                hoverOutput = output
                drawCircle((OUTPUTS.idToPoint[output]+2)*amount, e.clientY, 16, 0, 360, 'magenta')
            }
        }
    }
})
window.addEventListener('mousedown', (e) => {
    if(tools.cable && hoverInput == null && hoverOutput == null){
        if(e.button == 0){
            CABLE.startGate = hoverGate
            ctrlOutput = CABLE.output
1
        }else if(e.button == 2 && hoverInput == null && hoverOutput == null){

            CABLE.startGate = hoverGate
            ctrlOutput = CABLE.output
            CABLE.disconnect = true
        }
    }
    if(tools.cable && hoverInput != null){
        INPUTS.startIn = hoverInput
    }
})
window.addEventListener('mouseup', (e) => {
    if(CABLE.startGate != hoverGate && hoverInput == null && hoverOutput == null){

        if(ctrlOutput != CABLE.output){
            if(e.button == 0 && tools.cable){

                if(CABLE.output && INPUTS.startIn == null){
                
                    if(CABLE.gateInputs[CABLE.startGate] == null){

                        CABLE.gateInputs[CABLE.startGate] = [hoverGate]

                    }else if(CABLE.gateInputs[CABLE.startGate].length >= 16){

                        console.error('maximum is 15 connections')

                    }else{
                        console.log(hoverGate)
                        CABLE.gateInputs[CABLE.startGate].push(hoverGate)
                    }
                }else{
                
                    if(CABLE.gateInputs[hoverGate] == null){

                        if(CABLE.startGate == null){
                         
                            CABLE.gateInputs[hoverGate] = [INPUTS.startIn]
                        }else{
                         
                            CABLE.gateInputs[hoverGate] = [CABLE.startGate]
                        }
                    }else if(CABLE.gateInputs[hoverGate].length >= 16){

                        console.error('maximum is 15 connections')
                    }else{
                        if(CABLE.startGate == null){

                            CABLE.gateInputs[hoverGate].push(INPUTS.startIn)
                        }else{
                         
                            CABLE.gateInputs[hoverGate].push(CABLE.startGate)
                        }
                    }
                }

                if(INPUTS.startIn != null){

                    if(INPUTS.toGate[INPUTS.startIn] == null) INPUTS.toGate[INPUTS.startIn] = []
                
                    INPUTS.toGate[INPUTS.startIn].push(hoverGate)
                }

            }else if(e.button == 2 && INPUTS.startIn == null && CABLE.disconnect && tools.cable){

                if(CABLE.output){
                    try{
                        CABLE.gateInputs[CABLE.startGate].splice(CABLE.gateInputs[CABLE.startGate].indexOf(hoverGate), 1)
                    }catch(error){}
                
                }else if(!CABLE.output){
                    try{
                        CABLE.gateInputs[hoverGate].splice(CABLE.gateInputs[hoverGate].indexOf(CABLE.startGate), 1)
                    }catch(error){}
                }
            }
        }
    }else if(hoverOutput != null && e.button == 0 && tools.cable){
        OUTPUTS.toGate[hoverOutput] = CABLE.startGate
    }
    if(e.button == 2 && hoverOutput != null && CABLE.startGate != null && tools.cable){
        
        for(let i of OUTPUTS.IDs){
        
            if(OUTPUTS.toGate[i] == CABLE.startGate){
        
                OUTPUTS.toGate[i] = null
            }
        }
    }
    if(e.button == 2 && INPUTS.startIn != null && hoverGate != null && tools.cable){ 

        for(let i of INPUTS.IDs){

            if(INPUTS.toGate[i] != null){
                try{
                    INPUTS.toGate[i].splice(INPUTS.toGate[i].indexOf(hoverGate), 1)
                }catch(error){}
                
            }
            if(CABLE.gateInputs[hoverGate] != null){
                if(CABLE.gateInputs[hoverGate].includes(i)){
                    CABLE.gateInputs[hoverGate].splice(CABLE.gateInputs[hoverGate].indexOf(i), 1)
                }
            }
        }
    }
    ctrlOutput = null

    INPUTS.startIn = null
    CABLE.startGate = null
    CABLE.disconnect = false
})