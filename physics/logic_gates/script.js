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
    this.input1 = {
        value: 0,
        connected: null
    },
    this.input2 = {
        value: 0,
        connected: null
    },
    this.outputs = [],
    this.state = 0,
    this.type = types[0]

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
};

document.addEventListener("mousedown", (e) => {
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
        gate.outputs.forEach(output => {
            console.log(gate.element.querySelector("output"))
            output.setAttribute('points', `${output.getBoundingClientRect().right},${output.getBoundingClientRect().y + output.getBoundingClientRect().height / 2} ${output.getAttribute('points').split(" ")[1].split(",")[0]},${output.getAttribute('points').split(" ")[1].split(",")[1]}`);
        })
    }
    if(outputSelected){
        let gate = gates.filter(gate => gate.element.contains(outputSelected))[0];
        gate.outputs[gate.outputs.length - 1].setAttribute('points', `${outputSelected.getBoundingClientRect().right},${outputSelected.getBoundingClientRect().y + outputSelected.getBoundingClientRect().height / 2} ${e.clientX},${e.clientY}`);
    }
})

document.addEventListener("mouseup", (e) => {
    move = null;
    outputSelected = null;
})
