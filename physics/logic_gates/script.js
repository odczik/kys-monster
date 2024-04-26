const container = document.getElementById('container');

const gates = [];

let counter = 0;
let move = null;
let moveOffset = null;
let moved = false;
let outputSelected = null;

let gateSelected = "";
let buttonSelected = null;

const update = () => {
    gates.forEach(gate => {
        gate.update();
    })
    requestAnimationFrame(update);
}
update();

/*var frameCount = 0;
var fps, fpsInterval, startTime, now, then, elapsed;
startAnimating(40);
function startAnimating(fps) {
    fpsInterval = 1000 / fps;
    then = Date.now();
    startTime = then;
    console.log(startTime);
    animate();
}
function animate() {
    requestAnimationFrame(animate);
    now = Date.now();
    elapsed = now - then;
    if (elapsed > fpsInterval) {
        then = now - (elapsed % fpsInterval);

        update();
    }
}*/
const handleInputDown = (e) => {
    if(e.button === 2) return;
    if(e.target.classList.contains("gateBody")){
        //e.target.parentNode.style.left = `${e.clientX - 35}px`;
        //e.target.parentNode.style.top = `${e.clientY - 50}px`;
        move = e.target.parentNode;
        moveOffset = {x: e.clientX - move.getBoundingClientRect().left, y: e.clientY - move.getBoundingClientRect().top};
        counter++;
        move.style.zIndex = counter;
    } else if(e.target.classList.contains("output")){
        outputSelected = e.target;
        const svg = document.querySelector('svg');
        const line = document.createElementNS("http://www.w3.org/2000/svg", "polyline");
        line.setAttribute('points', `${outputSelected.getBoundingClientRect().right},${outputSelected.getBoundingClientRect().y + outputSelected.getBoundingClientRect().height / 2} ${e.clientX},${e.clientY}`);
        svg.appendChild(line);

        let gate = gates.filter(gate => gate.element.contains(outputSelected))[0];
        gate.outputs.push({connected: null, wire: line, value: false});
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
                
                input.wire.wire.remove();
                input.wire = null;
                input.connected = null;
                input.value = false;
            }
        })
    } else if(e.pageX > 230){
        switch(gateSelected){
            case "gate":
                gates.push(new Gate(e.clientX - 35, e.clientY - 50));
                break;
            case "switch":
                gates.push(new Switch(e.clientX - 35, e.clientY - 50));
                break;
            case "button":
                gates.push(new Button(e.clientX - 35, e.clientY - 50));
                break;
            case "led":
                gates.push(new Led(e.clientX - 35, e.clientY - 50));
                break;
        }
    }
}

document.querySelectorAll("button").forEach(button => {
    button.addEventListener("click", (e) => {
        gateSelected = e.target.value;

        if(buttonSelected) buttonSelected.classList.remove("active");
        buttonSelected = e.target;
        buttonSelected.classList.add("active");
    })
})

const handleInputMove = (e) => {
    if(move){
        moved = true;
        let newX = e.clientX - moveOffset.x;
        let newY = e.clientY - moveOffset.y;
        move.style.left = `${newX}px`;
        move.style.top = `${newY}px`;

        let gate = gates.filter(gate => gate.element.contains(move))[0];
        if(gate.inputs){
            Object.entries(gate.inputs).forEach((input, i) => {
                input = input[1];
                if(input.connected){
                    /*let inputIndex = Object.entries(gate.inputs).findIndex(gateInput => console.log(gateInput));
                    console.log(inputIndex, i)
                    let inputBounds = gate.element.childNodes[inputIndex + i].getBoundingClientRect();*/
                    let inputBounds = input.wire.connected.getBoundingClientRect();
                    let wireCoords = input.wire.wire.getAttribute('points').split(" ");
                    input.wire.wire.setAttribute('points', `${wireCoords[0].split(",")[0]},${wireCoords[0].split(",")[1]} ${inputBounds.left},${inputBounds.y + inputBounds.height / 2}`);
                }
            })
        }
        if(gate.outputs){
            gate.outputs.forEach(output => {
                let outputBounds = gate.element.lastChild.getBoundingClientRect();
                let wireCoords = output.wire.getAttribute('points').split(" ");
                output.wire.setAttribute('points', `${outputBounds.right},${outputBounds.y + outputBounds.height / 2} ${wireCoords[1].split(",")[0]},${wireCoords[1].split(",")[1]}`);
            })
        }
    }
    if(outputSelected){
        let gate = gates.filter(gate => gate.element.contains(outputSelected))[0];
        gate.outputs[gate.outputs.length - 1].wire.setAttribute('points', `${outputSelected.getBoundingClientRect().right},${outputSelected.getBoundingClientRect().y + outputSelected.getBoundingClientRect().height / 2} ${e.clientX},${e.clientY}`);
    }
}

const handleInputUp = (e) => {
    if(!moved && move){
        let gate = gates.filter(gate => gate.element.contains(move))[0];
        if(gate.isLogicGate){
            gate.type = types[(types.indexOf(gate.type) + 1) % types.length];
            gate.element.childNodes[1].innerText = gate.type.toUpperCase();
        }
    }
    moved = false;
    move = null;
    moveOffset = null;
    if(outputSelected){
        console.log(e)
        if(e.target.classList.contains("input1") || e.target.classList.contains("input2")){
            let inputGate = gates.filter(gate => gate.element.contains(e.target))[0];
            let input = e.target.classList.contains("input1") ? inputGate.inputs.input1 : inputGate.inputs.input2;
            
            if(input.connected){
                let gate = gates.filter(gate => gate.element.contains(outputSelected))[0];
                gate.outputs[gate.outputs.length - 1].wire.remove();
                gate.outputs.pop();
                outputSelected.style.backgroundColor = "#333";
                outputSelected = null;
                return;
            }

            let outputGate = gates.filter(gate => gate.element.contains(outputSelected))[0];
            outputGate.outputs[outputGate.outputs.length - 1].wire.setAttribute('points', `${outputSelected.getBoundingClientRect().right},${outputSelected.getBoundingClientRect().y + outputSelected.getBoundingClientRect().height / 2} ${e.target.getBoundingClientRect().left},${e.target.getBoundingClientRect().y + e.target.getBoundingClientRect().height / 2}`);
            outputGate.outputs[outputGate.outputs.length - 1].connected = e.target;

            input.connected = outputSelected;
            input.wire = outputGate.outputs[outputGate.outputs.length - 1];

            //input.value = 1;
            e.target.style.backgroundColor = "green";
            outputSelected.style.backgroundColor = "green";
        } else {
            let gate = gates.filter(gate => gate.element.contains(outputSelected))[0];
            gate.outputs[gate.outputs.length - 1].wire.remove();
            gate.outputs.pop();
            outputSelected.style.backgroundColor = "#333";
        }
        outputSelected = null;
    }
}

document.addEventListener("mousedown", (e) => {
    if(window.screen.width < window.screen.height) return;
    handleInputDown(e);
})
document.addEventListener("mousemove", (e) => {
    handleInputMove(e);
})
document.addEventListener("mouseup", (e) => {
    if(window.screen.width < window.screen.height) return;
    handleInputUp(e);
})

let lastTouch = null;
document.addEventListener("touchstart", (e) => {
    handleInputDown(e.touches[0]);
    lastTouch = e.touches[0];
})
document.addEventListener("touchmove", (e) => {
    handleInputMove(e.touches[0]);
    lastTouch.clientX = e.touches[0].clientX;
    lastTouch.clientY = e.touches[0].clientY;
    lastTouch.target = document.elementFromPoint(e.touches[0].clientX, e.touches[0].clientY);
})
document.addEventListener("touchend", () => {
    lastTouch.target = null
    console.log(lastTouch.clientX, lastTouch.clientY, lastTouch.target)
    handleInputUp(lastTouch);
})