const container = document.getElementById('container');

let counter = 0;
let move = null;

const types = ['and', 'or', 'not', 'nand', 'nor', 'xor', 'xnor'];

function Gate(x, y){
    this.x = x,
    this.y = y,
    this.width = 70,
    this.height = 100,
    this.inputs = 2,
    this.output = 0,
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
    
};

const gates = [];

gates.push(new Gate(100, 100), new Gate(400, 100));

document.addEventListener("mousedown", (e) => {
    if(e.target.classList.contains("gateBody")){
        //e.target.parentNode.style.left = `${e.clientX - 35}px`;
        //e.target.parentNode.style.top = `${e.clientY - 50}px`;
        move = e.target.parentNode;
    } else {
        gates.push(new Gate(e.clientX - 35, e.clientY - 50));
    }
})

document.addEventListener("mousemove", (e) => {
    if(move){
        let newX = e.clientX + (move.style.left.split("px")[0] - e.clientX);
        move.style.left = `${newX}px`;
        move.style.top = `${e.clientY - 50}px`;
    }
})

document.addEventListener("mouseup", (e) => {
    move = null;
})