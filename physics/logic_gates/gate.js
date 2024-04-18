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