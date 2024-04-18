function Switch(x, y){
    this.element;
    this.x = x,
    this.y = y,
    this.width = 70,
    this.height = 100,
    this.inputs = {},
    this.outputs = [],
    this.state = 0,

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

    this.element.addEventListener("contextmenu", (e) => {
        e.preventDefault();
        this.state = !this.state;
        if(this.outputs.length){
            this.outputs.forEach(output => {
                output.fireInput();
            })
        }
    })
};