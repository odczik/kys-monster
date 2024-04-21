function Switch(x, y){
    this.isSwitch = true;
    this.element;
    this.x = x,
    this.y = y,
    this.width = 70,
    this.height = 100,
    this.inputs = {},
    this.outputs = [],
    this.state = false

    this.update = () => {
        this.element.lastChild.style.backgroundColor = this.state ? "red" : this.outputs.length ? "green" : "#333";
        this.outputs.forEach(output => {
            output.value = this.state;
        })
    }

    this.fireInput = () => {
        this.state = !this.state;
        this.outputs.forEach(output => {
            output.value = this.state;
        })
        /*this.outputs.forEach(output => {
            let gateToTrigger = gates.filter(gate => gate.element.contains(output.connected))[0];
            gateToTrigger.fireInput(output.connected.classList.contains("input1") ? 1 : 2);
        })*/
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

    const gateType = document.createElement('div');
    gateType.innerText = "SWITCH";
    gateType.classList.add('gateType');
    gate.appendChild(gateType);

    const output = document.createElement('div');
    output.classList.add('output');
    gate.appendChild(output);
    
    this.element = gate;
    this.element.style.cursor = "pointer";

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