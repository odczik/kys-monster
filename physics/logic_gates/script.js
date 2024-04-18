const container = document.getElementById('container');

const gates = [];

let counter = 0;
let move = null;
let outputSelected = null;

const types = ['and', 'or', 'not', 'nand', 'nor', 'xor', 'xnor'];

function Gate(x, y){
    this.element;
    this.x = x,
    this.y = y,
    this.width = 70,
    this.height = 100,
    this.inputs = {
        input1: {
            connected: null,
            wire: null
        },
        input2: {
            connected: null,
            wire: null
        }
    },
    this.outputs = [],
    this.state = 0,
    this.type = types[0]

    this.fireInput = () => {
        console.log("hey")
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
    gateType.innerText = this.type.toUpperCase();
    gateType.classList.add('gateType');
    gate.appendChild(gateType);

    const input1 = document.createElement('div');
    input1.classList.add('input1');
    gate.appendChild(input1);
    const input2 = document.createElement('div');
    input2.classList.add('input2');
    gate.appendChild(input2);
    const output = document.createElement('div');
    output.classList.add('output');
    gate.appendChild(output);
    
    this.element = gate;

    this.element.addEventListener("contextmenu", (e) => {
        e.preventDefault();
        this.type = types[(types.indexOf(this.type) + 1) % types.length];
        gateType.innerText = this.type.toUpperCase();
    })
};

document.addEventListener("mousedown", (e) => {
    if(e.button === 2) return;
    if(e.target.classList.contains("gateBody")){
        //e.target.parentNode.style.left = `${e.clientX - 35}px`;
        //e.target.parentNode.style.top = `${e.clientY - 50}px`;
        move = e.target.parentNode;
        counter++;
        move.style.zIndex = counter;
    } else if(e.target.classList.contains("output")){
        outputSelected = e.target;
        const svg = document.querySelector('svg');
        const line = document.createElementNS("http://www.w3.org/2000/svg", "polyline");
        line.setAttribute('points', `${outputSelected.getBoundingClientRect().right},${outputSelected.getBoundingClientRect().y + outputSelected.getBoundingClientRect().height / 2} ${e.clientX},${e.clientY}`);
        svg.appendChild(line);

        let gate = gates.filter(gate => gate.element.contains(outputSelected))[0];
        gate.outputs.push(line);
    } else if(e.target.classList.contains("input1") || e.target.classList.contains("input2")){
        let inputGate = gates.filter(gate => gate.element.contains(e.target))[0];
        Object.entries(inputGate.inputs).forEach((input, i) => {
            input = input[1];
            let inputIndex = Number(e.target.classList[0].substring(5)) - 1;
            if(input.connected && inputIndex === i){
                let outputGate = gates.filter(gate => gate.element.contains(input.connected))[0];
                let inputGate = gates.filter(gate => Object.entries(gate.inputs).find(gateInput => gateInput[1].connected === input.connected))[0];
                outputGate.outputs.splice(outputGate.outputs.indexOf(input.wire), 1);
                
                input.connected.style.backgroundColor = "#333";
                inputGate.element.childNodes[2 + i].style.backgroundColor = "#333";
                
                input.wire.remove();
                input.wire = null;
                input.connected = null;
            }
        })
    } else {
        gates.push(new Gate(e.clientX - 35, e.clientY - 50));
    }
})

document.addEventListener("mousemove", (e) => {
    if(move){
        //let newX = e.clientX + (move.style.left.split("px")[0] - e.clientX);
        move.style.left = `${e.clientX - 35}px`;
        move.style.top = `${e.clientY - 50}px`;

        let gate = gates.filter(gate => gate.element.contains(move))[0];
        Object.entries(gate.inputs).forEach((input, i) => {
            input = input[1];
            if(input.connected){
                let inputBounds = gate.element.childNodes[2 + i].getBoundingClientRect();
                let wireCoords = input.wire.getAttribute('points').split(" ");
                input.wire.setAttribute('points', `${wireCoords[0].split(",")[0]},${wireCoords[0].split(",")[1]} ${inputBounds.left},${inputBounds.y + inputBounds.height / 2}`);
            }
        })
        gate.outputs.forEach(output => {
            let outputBounds = gate.element.lastChild.getBoundingClientRect();
            let wireCoords = output.getAttribute('points').split(" ");
            output.setAttribute('points', `${outputBounds.right},${outputBounds.y + outputBounds.height / 2} ${wireCoords[1].split(",")[0]},${wireCoords[1].split(",")[1]}`);
        })
    }
    if(outputSelected){
        let gate = gates.filter(gate => gate.element.contains(outputSelected))[0];
        gate.outputs[gate.outputs.length - 1].setAttribute('points', `${outputSelected.getBoundingClientRect().right},${outputSelected.getBoundingClientRect().y + outputSelected.getBoundingClientRect().height / 2} ${e.clientX},${e.clientY}`);
    }
})

document.addEventListener("mouseup", (e) => {
    move = null;
    if(outputSelected){
        if(e.target.classList.contains("input1") || e.target.classList.contains("input2")){
            let inputGate = gates.filter(gate => gate.element.contains(e.target))[0];
            let input = e.target.classList.contains("input1") ? inputGate.inputs.input1 : inputGate.inputs.input2;
            
            if(input.connected){
                let gate = gates.filter(gate => gate.element.contains(outputSelected))[0];
                gate.outputs[gate.outputs.length - 1].remove();
                outputSelected.style.backgroundColor = "#333";
                return;
            }

            let outputGate = gates.filter(gate => gate.element.contains(outputSelected))[0];
            outputGate.outputs[outputGate.outputs.length - 1].setAttribute('points', `${outputSelected.getBoundingClientRect().right},${outputSelected.getBoundingClientRect().y + outputSelected.getBoundingClientRect().height / 2} ${e.target.getBoundingClientRect().left},${e.target.getBoundingClientRect().y + e.target.getBoundingClientRect().height / 2}`);
            
            input.connected = outputSelected;
            input.wire = outputGate.outputs[outputGate.outputs.length - 1];

            //input.value = 1;
            e.target.style.backgroundColor = "green";
            outputSelected.style.backgroundColor = "green";
        } else {
            let gate = gates.filter(gate => gate.element.contains(outputSelected))[0];
            gate.outputs[gate.outputs.length - 1].remove();
            outputSelected.style.backgroundColor = "#333";
        }
        outputSelected = null;
    }
})
