function Led(x, y){
    this.element;
    this.x = x,
    this.y = y,
    this.width = 70,
    this.height = 100,
    this.inputs = {
        input1: {
            connected: null,
            wire: null,
            value: false
        }
    },
    this.outputs = [],
    this.state = false

    this.update = () => {
        /*Object.entries(this.inputs).forEach((input, i) => {
            input = input[1];
            
            if(input.wire) input.wire.connected.style.backgroundColor = input.value ? "red" : "green";
            
            this.element.childNodes[1 + i].style.backgroundColor = input.value ? "red" : input.connected ? "green" : "#333";

            let gateToCheck = gates.filter(gate => gate.element.contains(input.connected))[0];
            if(!gateToCheck){
                input.value = false;
                return;
            }

            let outputToCheck = gateToCheck.outputs.filter(output => output.wire === input.wire.wire);
            outputToCheck[0].connected.style.backgroundColor = outputToCheck[0].value ? "red" : "green";
            outputToCheck[0].wire.style.stroke = outputToCheck[0].value ? "red" : "green";
            
            input.value = outputToCheck[0].value;
        })*/
    }

    this.fireInput = (input) => {
        switch(input){
            case 1:
                this.inputs.input1.value = !this.inputs.input1.value;
                break;
            case 2:
                this.inputs.input2.value = !this.inputs.input2.value;
                break;
        }
    }

    counter++;

    const gate = document.createElement('div');
    gate.classList.add('gate');
    gate.style.left = `${this.x}px`;
    gate.style.top = `${this.y}px`;
    gate.style.zIndex = counter;
    document.body.appendChild(gate);

    const gateBody = document.createElement('div');
    gateBody.classList.add('gateBody');
    gate.appendChild(gateBody);

    const input1 = document.createElement('div');
    input1.classList.add('input1');
    gate.appendChild(input1);
    
    this.element = gate;
    this.element.style.cursor = "move";

    this.element.addEventListener("contextmenu", (e) => {
        e.preventDefault();

        gates.splice(gates.indexOf(this), 1);

        this.outputs.forEach(output => {
            output.wire.remove();
            let outputGate = gates.filter(gate => gate.element.contains(output.connected))[0];
            let outputGateInput = outputGate.inputs[output.connected.classList.contains("input1") ? "input1" : "input2"];
            outputGateInput.connected = null;
            outputGateInput.wire = null;
        })
        Object.entries(this.inputs).forEach(input => {
            input = input[1];
            if(input.connected){
                input.wire.wire.remove();
                let inputGate = gates.filter(gate => gate.element.contains(input.connected))[0];
                inputGate.outputs.splice(inputGate.outputs.indexOf(inputGate.outputs.filter(output => output.wire === input.wire.wire)[0]), 1);
            }
        })

        this.element.remove();
    })
};